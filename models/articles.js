const pool = require('../middlewares/config-pool');

exports.articlesTable = () => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS
    articles(
        article_id UUID,
        article_title VARCHAR(255) NOT NULL,
        article TEXT NOT NULL,
        user_role VARCHAR(255) NOT NULL,
        author_id UUID NOT NULL,
        created_on TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY(audio_id)
    )
    `);
};
