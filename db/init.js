const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const config = {
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
};

async function initializeDatabase() {
  try {
    console.log('Connecting to Azure SQL Database...');
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Connected');

    const schemaPath = path.join(__dirname, 'schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove markdown code fences if present
    schema = schema.replace(/```sql\n?/g, '').replace(/```\n?/g, '');
    
    console.log('Executing schema...');
    await pool.request().batch(schema);
    console.log('✅ Database schema initialized successfully!');
    
    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

initializeDatabase();
