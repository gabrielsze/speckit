const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential, ManagedIdentityCredential } = require('@azure/identity');
const { v4: uuid } = require('uuid');

app.http('uploadImage', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'events/upload-image',
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  },
  handler: async (request, context) => {
    const correlationId = uuid();
    context.log(`[${correlationId}] Image upload request received`);

    try {
      // Get file from request body - handle ReadableStream for local testing
      let buffer;
      
      if (request.arrayBuffer) {
        // Azure Functions v4 - use arrayBuffer method
        const arrayBuffer = await request.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else if (request.body instanceof Buffer) {
        buffer = request.body;
      } else if (request.rawBody) {
        buffer = request.rawBody;
      } else {
        buffer = request.body;
      }
      
      context.log(`[${correlationId}] Buffer size: ${buffer ? buffer.length : 0} bytes`);
      
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

      // Connect to Blob Storage using managed identity (ManagedIdentityCredential in Azure, DefaultAzureCredential locally)
      const isAzure = !!(process.env.MSI_ENDPOINT || process.env.IDENTITY_ENDPOINT || process.env.AZURE_WEBSITE_INSTANCE_ID);
      const credential = isAzure ? new ManagedIdentityCredential() : new DefaultAzureCredential();
      const blobServiceClient = new BlobServiceClient(
        `https://${process.env.BLOB_ACCOUNT}.blob.core.windows.net`,
        credential
      );
      const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_CONTAINER);
      context.log(`[${correlationId}] Connected to Blob Storage using managed identity`);

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
      context.log(`[${correlationId}] Error stack: ${error.stack}`);
      return {
        status: 500,
        jsonBody: { 
          error: 'Failed to upload image',
          details: error.message 
        }
      };
    }
  }
});
