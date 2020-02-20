const uuid = require('uuid');
const pool = require('../middlewares/config-pool');
const cloudinary = require('../middlewares/config-cloudinary');

exports.uploadImage = (req, res) => {
  if (req.file === undefined) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'Please select an image file',
      });
  }
  return cloudinary.uploader.upload(req.file.path, (result) => {
    const imageId = uuid.v4();
    const imageUrl = result.secure_url;
    const { imageTitle } = req.body;
    const { userRole } = req.body;
    const { authorId } = req.body;
    if (imageTitle === undefined || userRole === undefined || authorId === undefined) {
      return res.status(400)
        .json({
          status: 'error',
          error: 'All fields are required',
        });
    }
    return pool.query('INSERT INTO images VALUES($1, $2, $3, $4, $5)', [imageId, imageTitle, imageUrl, userRole, authorId])
      .then(
        () => {
          pool.query('SELECT * FROM images WHERE image_id=$1', [imageId])
            .then(
              ({ rows }) => {
                // const createdOn = rows.map((data) => data.created_on).toString();
                res.status(201)
                  .json({
                    status: 'success',
                    data: {
                      message: 'Image successfully uploaded',
                      image: rows,
                    },
                  });
              },
            ).catch(
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
  });
};
exports.getImages = (req, res) => {
  pool.query('SELECT * FROM images')
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'No images found',
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
exports.getImage = (req, res) => {
  const { imageId } = req.params;
  pool.query('SELECT * FROM images WHERE image_id=$1', [imageId])
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'Image Not Found',
            });
        }
        return pool.query(`SELECT * FROM comments WHERE item_id='${imageId}'`)
          .then(
            (result) => {
              res.status(200)
                .json({
                  status: 'success',
                  data: {
                    image: rows,
                    comments: result.rows,
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
exports.updateImage = (req, res) => {
  const { userRole } = req.body;
  const { imageTitle } = req.body;
  const { imageId } = req.params;
  pool.query(`SELECT * FROM images WHERE image_id='${imageId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        pool.query(`UPDATE images SET image_title='${imageTitle}' WHERE image_id='${imageId}'`)
          .then(
            () => res.status(200)
              .json({
                status: 'success',
                data: {
                  message: 'Image title successfully updated',
                  imageTitle,
                },
              }),
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
exports.deletImage = (req, res) => {
  const { userRole } = req.body;
  const { imageId } = req.params;
  pool.query(`SELECT * FROM images WHERE image_id='${imageId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        return pool.query(`DELETE FROM images WHERE image_id='${imageId}' AND user_role ='${userRole}'`)
          .then(
            () => {
              res.status(200)
                .json({
                  status: 'success',
                  data: {
                    message: 'Image successfully deleted',
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
