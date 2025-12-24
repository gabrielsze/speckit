CREATE TABLE submitted_events (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  title NVARCHAR(200) NOT NULL,
  description NVARCHAR(MAX) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NULL,
  location NVARCHAR(300) NOT NULL,
  category NVARCHAR(100) NOT NULL,
  contact_email NVARCHAR(254) NULL,
  contact_phone NVARCHAR(32) NULL,
  website NVARCHAR(300) NULL,
  image_url NVARCHAR(500) NULL,
  created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Index for recent submissions (for listing with created_at DESC)
CREATE INDEX idx_submitted_events_created_at ON submitted_events(created_at DESC);

-- Index for category filtering (future enhancement)
CREATE INDEX idx_submitted_events_category ON submitted_events(category);
