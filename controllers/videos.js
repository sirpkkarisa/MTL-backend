const uuid = require('uuid');
const pool = require('../middlewares/config-pool');
const cloudinary = require('../middlewares/config-cloudinary');

exports.uploadVideo = (req, res) => {
  if (req.file === undefined) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'Please select video file',
      });
  }
  return cloudinary.uploader.upload(req.file.path, (result) => {
    const videoId = uuid.v4();
    const videoUrl = result.secure_url;
    const { videoTitle } = req.body;
    const { userRole } = req.body;
    const { authorId } = req.body;
    if (videoTitle === undefined || userRole === undefined || authorId === undefined) {
      return res.status(400)
        .json({
          status: 'error',
          error: 'All fields are required',
        });
    }
    return pool.query('INSERT INTO videos VALUES($1, $2, $3, $4, $5)', [videoId, videoTitle, videoUrl, userRole, authorId])
      .then(
        ({ rows }) => {
          const createdOn = rows.map((data) => data.created_on).toString();
          res.status(201)
            .json({
              status: 'success',
              data: {
                videoId,
                message: 'Video successfully uploaded',
                videoUrl,
                videoTitle,
                authorId,
                createdOn,
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
  });
};
exports.getVideos = (req, res) => {
  pool.query('SELECT * FROM videos')
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'No videos found',
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
exports.getVideo = (req, res) => {
  const { videoId } = req.params;
  pool.query('SELECT * FROM videos WHERE video_id=$1', [videoId])
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'Video Not Found',
            });
        }
        return pool.query(`SELECT * FROM comments WHERE video_id='${videoId}'`)
          .then(
            (result) => {
              console.log(result);
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
exports.updateVideo = (req, res) => {
  const { userRole } = req.body;
  const { videoTitle } = req.body;
  const { videoId } = req.params;
  pool.query(`UPDATE videos SET video_title='${videoTitle}' WHERE video_id='${videoId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        return res.status(200)
          .json({
            status: 'success',
            data: {
              message: 'Video title successfully updated',
              videoTitle,
            },
          });
      },
    );
};
exports.deletVideo = (req, res) => {
  const { userRole } = req.body;
  const { videoId } = req.params;
  pool.query(`SELECT * FROM videos WHERE video_id='${videoId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        return pool.query(`DELETE FROM videos WHERE video_id='${videoId}' AND user_role ='${userRole}'`)
          .then(
            () => {
              res.status(200)
                .json({
                  status: 'success',
                  data: {
                    message: 'Video successfully deleted',
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
