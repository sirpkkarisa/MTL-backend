const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.connect()
  .then(
    () => console.log('DB Connection OK'),
  )
  .catch(
    (error) => console.log(`Something went wrong ${error}`),
  );
module.exports = pool;
