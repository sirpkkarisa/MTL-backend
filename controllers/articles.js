const uuid = require('uuid');
const pool = require('../middlewares/config-pool');

exports.createArticle = (req, res) => {
  const articleId = uuid.v4();
  const { articleTitle } = req.body;
  const { article } = req.body;
  const { userRole } = req.body;
  const { authorId } = req.body;

  if (articleTitle === undefined || article === undefined || userRole === undefined || authorId === undefined) {
      return res.status(400)
      .json({
          status: 'error',
          error: 'All fields are required',
      })
  }
  pool.query('INSERT INTO articles VALUES($1,$2,$3,$4,$5)', [articleId, articleTitle, article, userRole, authorId])
    .then(
      () => {
        pool.query('SELECT * FROM articles WHERE article_id=$1', [articleId])
          .then(
            ({ rows }) => {
              if (rows.length === 0) {
                return res.status(403)
                  .json({
                    status: ' error',
                    error: 'Forbidden',
                  });
              }
              return res.status(200)
                .json({
                  status: 'success',
                  data: {
                    message: 'New article created!',
                    article: rows,
                  },
                });
            },
          )
          .catch(
            (error) => {
              res.status(501)
                .json({
                  status: 'error',
                  error: `${error}`,
                });
            },
          );
      },
    )
    .catch(
      (error) => {
        res.status(501)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};
exports.getArticles = (req, res) => {
  pool.query('SELECT * FROM articles')
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'No articles',
            });
        }
        return res.status(200)
          .json({
            status: 'success',
            data: rows,
          });
      },
    )
    .catch(
      (error) => {
        res.status(501)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};
exports.getArticle = (req, res) => {
  const { articleId } = req.params;
  pool.query('SELECT * FROM articles WHERE article_id=$1', [articleId])
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'Article Not Found',
            });
        }
        return res.status(200)
          .json({
            status: 'success',
            data: rows,
          });
      },
    )
    .catch(
      (error) => {
        res.status(501)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};
exports.updateArticle = (req, res) => {
  const { articleId } = req.params;
  const { userRole } = req.body;
  const { articleTitle } = req.body;
  const { article } = req.body;

  pool.query(`SELECT * FROM articles WHERE article_id='${articleId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        return pool.query(`UPDATE articles SET article_title='${articleTitle}',article='${article}' WHERE article_id='${articleId}' AND user_role='${userRole}'`)
          .then(
            () => res.status(200)
              .json({
                status: 'success',
                data: {
                  message: 'Article has been successfully updated',
                  articleTitle,
                  article,
                },
              }),
          )
          .catch(
            (error) => {
              res.status(501)
                .json({
                  status: 'error',
                  error: `hh${error}`,
                });
            },
          );
      },
    )
    .catch(
      (error) => {
        res.status(501)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};
exports.deleteArticle = (req, res) => {
  const { articleId } = req.params;
  const { userRole } = req.body;
  pool.query(`SELECT * FROM articles WHERE article_id='${articleId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        return pool.query(`DELETE FROM articles WHERE article_id='${articleId}' AND user_role='${userRole}'`)
          .then(
            () => {
              res.status(200)
                .json({
                  status: 'success',
                  data: {
                    message: 'Article successfully deleted',
                  },
                });
            },
          )
          .catch(
            (error) => {
              res.status(501)
                .json({
                  status: 'error',
                  error: `${error}`,
                });
            },
          );
      },
    )
    .catch(
      (error) => {
        res.status(501)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};
