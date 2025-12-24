import { z } from 'zod';

export const eventSubmissionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  eventDate: z.string().refine(
    (date) => {
      const d = new Date(date);
      return d > new Date();
    },
    { message: 'Event date must be in the future' }
  ),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:mm format').optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required').max(300, 'Location must be 300 characters or less'),
  category: z.string().min(1, 'Category is required'),
  contactEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  contactPhone: z.string().max(32, 'Phone must be 32 characters or less').optional().or(z.literal('')),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  imageUrl: z.string().optional(),
});

export type EventSubmission = z.infer<typeof eventSubmissionSchema>;

export function validateEventSubmission(data: unknown) {
  return eventSubmissionSchema.safeParse(data);
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File size must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)` };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { valid: true };
}
