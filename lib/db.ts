import sql from 'mssql';

const config: sql.config = {
  server: process.env.SQL_SERVER || '',
  database: process.env.SQL_DATABASE || '',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USER || '',
      password: process.env.SQL_PASSWORD || '',
    },
  },
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: false,
    connectTimeout: 15000,
    requestTimeout: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
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
