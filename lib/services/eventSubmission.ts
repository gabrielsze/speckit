import { v4 as uuid } from 'uuid';
import { sql, getConnection } from '../db';
import type { SubmittedEvent } from '../../types';

export async function submitEvent(eventData: {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime?: string;
  location: string;
  category: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  imageUrl?: string;
}): Promise<SubmittedEvent> {
  const id = uuid();
  const createdAt = new Date().toISOString();

  const pool = await getConnection();
  const request = pool.request();

  try {
    await request
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar(200), eventData.title)
      .input('description', sql.NVarChar(sql.MAX), eventData.description)
      .input('eventDate', sql.Date, eventData.eventDate)
      .input('startTime', sql.Time, eventData.startTime)
      .input('endTime', sql.Time, eventData.endTime || null)
      .input('location', sql.NVarChar(300), eventData.location)
      .input('category', sql.NVarChar(100), eventData.category)
      .input('contactEmail', sql.NVarChar(254), eventData.contactEmail || null)
      .input('contactPhone', sql.NVarChar(32), eventData.contactPhone || null)
      .input('website', sql.NVarChar(300), eventData.website || null)
      .input('imageUrl', sql.NVarChar(500), eventData.imageUrl || null)
      .query(`
        INSERT INTO submitted_events (id, title, description, event_date, start_time, end_time, location, category, contact_email, contact_phone, website, image_url, created_at)
        VALUES (@id, @title, @description, @eventDate, @startTime, @endTime, @location, @category, @contactEmail, @contactPhone, @website, @imageUrl, SYSDATETIMEOFFSET())
      `);

    return {
      id,
      ...eventData,
      createdAt,
    };
  } catch (error) {
    console.error('Failed to insert event:', error);
    throw new Error('Failed to save event to database');
  }
}

export async function getRecentEvents(limit: number = 10): Promise<SubmittedEvent[]> {
  const pool = await getConnection();

  try {
    const result = await pool.request().query(`
      SELECT TOP ${limit} * FROM submitted_events ORDER BY created_at DESC
    `);

    return result.recordset.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      eventDate: row.event_date,
      startTime: row.start_time,
      endTime: row.end_time,
      location: row.location,
      category: row.category,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      website: row.website,
      imageUrl: row.image_url,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Failed to fetch recent events:', error);
    throw new Error('Failed to fetch events');
  }
}
