const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuid } = require('uuid');

app.http('uploadImage', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'events/upload-image',
  handler: async (request, context) => {
    const correlationId = uuid();
    context.log(`[${correlationId}] Image upload request received`);

    try {
      // Get file from request body
      const buffer = request.rawBody;
      if (!buffer || buffer.length === 0) {
        return {
          status: 400,
          jsonBody: { error: 'No file provided' }
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (buffer.length > maxSize) {
        return {
          status: 400,
          jsonBody: { error: 'File too large. Maximum size: 5MB' }
        };
      }

      // Connect to Blob Storage
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.BLOB_CONNECTION_STRING
      );
      const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_CONTAINER);

      // Generate unique filename
      const filename = `${uuid()}.jpg`;

      // Upload to blob
      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: { blobContentType: 'image/jpeg' }
      });

      const imageUrl = blockBlobClient.url;
      context.log(`[${correlationId}] Image uploaded: ${filename}`);

      return {
        status: 200,
        jsonBody: {
          url: imageUrl,
          filename: filename
        }
      };

    } catch (error) {
      context.log(`[${correlationId}] Error: ${error.message}`);
      return {
        status: 500,
        jsonBody: { error: 'Failed to upload image' }
      };
    }
  }
});
