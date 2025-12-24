'use client';

import { useState, useEffect } from 'react';
import { validateImageFile } from '@/lib/validation';

interface FormErrors {
  [key: string]: string | undefined;
}

interface FormData {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  imageFile: File | null;
  imageUrl: string;
}

const CATEGORIES = ['Workshop', 'Networking', 'Conference', 'Social', 'Educational', 'Fundraiser'];
const PLACEHOLDER_IMAGE = '/images/placeholder-event.png';

export default function SubmitEventPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    category: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    imageFile: null,
    imageUrl: PLACEHOLDER_IMAGE,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate locally
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors((prev) => ({
        ...prev,
        imageFile: validation.error,
      }));
      return;
    }

    setUploadingImage(true);
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/events/upload-image`, {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const { imageUrl } = await response.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl,
        imageFile: file,
      }));
      setErrors((prev) => ({
        ...prev,
        imageFile: '',
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        imageFile: error instanceof Error ? error.message : 'Failed to upload image',
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        event_date: formData.eventDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        category: formData.category,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        website: formData.website,
        image_url: formData.imageUrl !== PLACEHOLDER_IMAGE ? formData.imageUrl : undefined,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/events/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.fieldErrors || { submit: data.message || 'Submission failed' });
        return;
      }

      // Success
      setSuccessMessage(
        `Event submitted successfully! Event ID: ${data.id}. Your event will appear on the events listing shortly.`
      );
      setErrors({});

      // Reset form
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          eventDate: '',
          startTime: '',
          endTime: '',
          location: '',
          category: '',
          contactEmail: '',
          contactPhone: '',
          website: '',
          imageFile: null,
          imageUrl: PLACEHOLDER_IMAGE,
        });
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl p-8 transition-colors">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Submit an Event</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Share your event with the community. Fill in the details below.
          </p>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-300">{successMessage}</p>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                aria-invalid={!!errors.title}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.title ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="e.g., React Workshop"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                aria-invalid={!!errors.description}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.description
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="Tell us about your event..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.eventDate}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.eventDate
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                />
                {errors.eventDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eventDate}</p>}
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.startTime}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.startTime
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                />
                {errors.startTime && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startTime}</p>}
              </div>
            </div>

            {/* End Time */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time (optional)
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                aria-invalid={!!errors.location}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.location
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="e.g., 123 Main St, San Francisco, CA"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                aria-invalid={!!errors.category}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.category
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information (optional)</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.contactEmail}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.contactEmail
                        ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                        : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                    placeholder="contact@example.com"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.website}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.website
                        ? 'border-red-300 dark:border-red-500 focus:ring-red-500'
                        : 'border-slate-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.website && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Image (optional)</h2>

              <div className="flex gap-6">
                <div className="flex-1">
                  <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image (JPEG, PNG, WebP - max 5MB)
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
                  />
                  {uploadingImage && <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">Uploading...</p>}
                  {errors.imageFile && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imageFile}</p>}
                </div>

                {formData.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={formData.imageUrl}
                      alt="Event preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Event'}
              </button>

              <button
                type="reset"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    eventDate: '',
                    startTime: '',
                    endTime: '',
                    location: '',
                    category: '',
                    contactEmail: '',
                    contactPhone: '',
                    website: '',
                    imageFile: null,
                    imageUrl: PLACEHOLDER_IMAGE,
                  });
                  setErrors({});
                }}
                className="px-6 py-3 border border-slate-300 dark:border-gray-600 rounded-lg font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
