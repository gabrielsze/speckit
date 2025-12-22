const { app } = require('@azure/functions');
const sql = require('mssql');
const { v4: uuid } = require('uuid');

app.http('submitEvent', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'events/submit',
  handler: async (request, context) => {
    const correlationId = uuid();
    context.log(`[${correlationId}] Event submission request received`);

    try {
      const body = await request.json();
      const { title, description, event_date, start_time, end_time, location, category, contact_email, contact_phone, website, image_url } = body;

      // Validation
      if (!title || !description || !event_date || !start_time || !location || !category) {
        return {
          status: 400,
          jsonBody: { error: 'Missing required fields' }
        };
      }

      context.log(`[${correlationId}] Env vars - Server: ${process.env.SQL_SERVER}, DB: ${process.env.SQL_DATABASE}`);

      // Connect to SQL
      const pool = new sql.ConnectionPool({
        server: process.env.SQL_SERVER,
        database: process.env.SQL_DATABASE,
        authentication: {
          type: 'default',
          options: {
            userName: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
          }
        },
        options: {
          encrypt: true,
          trustServerCertificate: false,
          connectTimeout: 30000,
        }
      });

      await pool.connect();
      context.log(`[${correlationId}] Connected to database`);

      const eventId = uuid();
      const now = new Date();

      await pool.request()
        .input('id', sql.UniqueIdentifier, eventId)
        .input('title', sql.NVarChar(200), title)
        .input('description', sql.NVarChar(sql.MAX), description)
        .input('event_date', sql.Date, new Date(event_date))
        .input('start_time', sql.Time, new Date(`2000-01-01T${start_time}`))
        .input('end_time', sql.Time, end_time ? new Date(`2000-01-01T${end_time}`) : null)
        .input('location', sql.NVarChar(300), location)
        .input('category', sql.NVarChar(100), category)
        .input('contact_email', sql.NVarChar(254), contact_email || null)
        .input('contact_phone', sql.NVarChar(32), contact_phone || null)
        .input('website', sql.NVarChar(300), website || null)
        .input('image_url', sql.NVarChar(500), image_url || null)
        .query(`
          INSERT INTO submitted_events 
          (id, title, description, event_date, start_time, end_time, location, category, contact_email, contact_phone, website, image_url)
          VALUES 
          (@id, @title, @description, @event_date, @start_time, @end_time, @location, @category, @contact_email, @contact_phone, @website, @image_url)
        `);

      await pool.close();
      context.log(`[${correlationId}] Event inserted: ${eventId}`);

      return {
        status: 200,
        jsonBody: {
          id: eventId,
          createdAt: now.toISOString()
        }
      };

    } catch (error) {
      context.log(`[${correlationId}] Error: ${error.message || error}`);
      return {
        status: 500,
        jsonBody: { error: 'Failed to submit event', details: error.message }
      };
    }
  }
});
