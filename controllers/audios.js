const uuid = require('uuid');
const pool = require('../middlewares/config-pool');
const cloudinary = require('../middlewares/config-cloudinary');

exports.uploadAudio = (req, res) => {
  if (req.file === undefined) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'Please select audio file',
      });
  }
  return cloudinary.uploader.upload_large(req.file.path, (result) => {
    const audioId = uuid.v4();
    const audioUrl = result.secure_url;
    const { audioTitle } = req.body;
    const { userRole } = req.body;
    const { authorId } = req.body;
    if (audioTitle === undefined || userRole === undefined || authorId === undefined) {
      return res.status(400)
        .json({
          status: 'error',
          error: 'All fields are required',
        });
    }
    return pool.query('INSERT INTO Audios VALUES($1, $2, $3, $4, $5)', [audioId, audioTitle, audioUrl, userRole, authorId])
      .then(
        ({ rows }) => {
          const createdOn = rows.map((data) => data.created_on).toString();
          res.status(201)
            .json({
              status: 'success',
              data: {
                audioId,
                message: 'Video successfully uploaded',
                audioUrl,
                audioTitle,
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
  }, { resource_type: 'video' });
};
exports.getAudios = (req, res) => {
  pool.query('SELECT * FROM audios')
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'No Audios found',
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
exports.getAudio = (req, res) => {
  const { audioId } = req.params;
  pool.query('SELECT * FROM Audios WHERE audio_id=$1', [audioId])
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'Audio Not Found',
            });
        }
        return pool.query(`SELECT * FROM comments WHERE item_id='${audioId}'`)
          .then(
            (result) => {
              res.status(200)
                .json({
                  status: 'success',
                  data: {
                    audio: rows,
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
exports.updateAudio = (req, res) => {
  const { userRole } = req.body;
  const { audioTitle } = req.body;
  const { audioId } = req.params;
  pool.query(`SELECT * FROM audios WHERE audio_id='${audioId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        pool.query(`UPDATE Audios SET audio_title='${audioTitle}' WHERE audio_id='${audioId}' AND user_role='${userRole}'`)
          .then(
            () => res.status(200)
              .json({
                status: 'success',
                data: {
                  message: 'Video title successfully updated',
                  audioTitle,
                },
              }),
          )
          .catch(
            (error) => {
              res.status(200)
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
        res.status(200)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};
exports.deleteAudio = (req, res) => {
  const { userRole } = req.body;
  const { audioId } = req.params;
  pool.query(`SELECT * FROM audios WHERE audio_id='${audioId}' AND user_role='${userRole}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        return pool.query(`DELETE FROM audios WHERE audio_id='${audioId}' AND user_role ='${userRole}'`)
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
