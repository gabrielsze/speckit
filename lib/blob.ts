import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuid } from 'uuid';

let containerClient: ContainerClient | null = null;

export function getContainerClient(): ContainerClient {
  if (!containerClient) {
    const connectionString = process.env.BLOB_CONNECTION_STRING || '';
    const containerName = process.env.BLOB_CONTAINER || 'events-images';
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(containerName);
  }
  return containerClient;
}

export async function uploadImage(file: Buffer, mimeType: string): Promise<string> {
  const container = getContainerClient();
  const fileName = `${uuid()}-${Date.now()}`;
  const blockBlobClient = container.getBlockBlobClient(fileName);
  
  await blockBlobClient.upload(file, file.length, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });
  
  return blockBlobClient.url;
}

export async function deleteImage(blobUrl: string): Promise<void> {
  const container = getContainerClient();
  const blobName = blobUrl.split('/').pop();
  if (blobName) {
    const blockBlobClient = container.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  }
}
