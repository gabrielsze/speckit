import sql from 'mssql';
import { DefaultAzureCredential } from '@azure/identity';

let pool: sql.ConnectionPool | null = null;

async function getAccessToken(): Promise<string> {
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken('https://database.windows.net/');
  return tokenResponse.token;
}

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    const accessToken = await getAccessToken();
    
    const config: sql.config = {
      server: process.env.SQL_SERVER || '',
      database: process.env.SQL_DATABASE || '',
      authentication: {
        type: 'azure-active-directory-access-token',
        options: {
          token: accessToken,
        },
      },
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 15000,
        requestTimeout: 30000,
      },
    };

    pool = new sql.ConnectionPool(config);
    await pool.connect();
  }
  return pool;
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

export { sql };
