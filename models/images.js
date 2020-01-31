const pool = require('../middlewares/config-pool');

exports.imagesTable = () => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS
    images(
        image_id UUID,
        image_title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        user_role VARCHAR(255) NOT NULL,
        author_id UUID NOT NULL,
        created_on TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY(image_id)
    )
    `);
};
