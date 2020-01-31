const pool = require('../middlewares/config-pool');

exports.imagesTable = () => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS
    videos(
        video_id UUID,
        video_title VARCHAR(255) NOT NULL,
        video_url VARCHAR(255) NOT NULL,
        user_role VARCHAR(255) NOT NULL,
        author_id UUID NOT NULL,
        created_on TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY(video_id)
    )
    `);
};
