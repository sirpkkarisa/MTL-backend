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

exports.usersTable = () => {
  pool.query(`CREATE TABLE IF NOT EXISTS
    users(
        user_id UUID,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        username VARCHAR(255),
        gender VARCHAR(100),
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        role VARCHAR(100) NOT NULL,
        reset_password_token VARCHAR(255),
        created_on TIMESTAMP DEFAULT NOW(),
        UNIQUE(email),
        UNIQUE(username),
        PRIMARY KEY(user_id))`)
    .then(
      () => console.log('users relation successfully created...'),
    )
    .catch(
      (error) => console.log(`unable to create users relation due to error ${error}`),
    );
};
