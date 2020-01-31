const pool = require('../middlewares/config-pool');

exports.commentsTable = () => {
    pool.query(`CREATE TABLE IF NOT EXISTS
    comments(
        comment_id UUID,
        item_id UUID NOT NULL,
        author_id UUID NOT NULL,
        comment TEXT NOT NULL,
        created_on TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY(comment_id)
    )`);
}