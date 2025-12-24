export function getConfig() {
  return {
    sql: {
      server: process.env.SQL_SERVER,
      database: process.env.SQL_DATABASE,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      encrypt: process.env.SQL_ENCRYPT === 'true',
    },
    blob: {
      account: process.env.BLOB_ACCOUNT,
      container: process.env.BLOB_CONTAINER,
      connectionString: process.env.BLOB_CONNECTION_STRING,
    },
    app: {
      env: process.env.APP_ENV || 'development',
      logLevel: process.env.LOG_LEVEL || 'info',
    },
  };
}

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = getConfig();

  if (!config.sql.server) errors.push('SQL_SERVER is not set');
  if (!config.sql.database) errors.push('SQL_DATABASE is not set');
  if (!config.sql.user) errors.push('SQL_USER is not set');
  if (!config.sql.password) errors.push('SQL_PASSWORD is not set');
  if (!config.blob.connectionString) errors.push('BLOB_CONNECTION_STRING is not set');

  return {
    valid: errors.length === 0,
    errors,
  };
}
