const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.createUserCtrl = (req, res) => {
  const userId = uuid.v4();
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { username } = req.body;
  const { gender } = req.body;
  const password = crypto.randomBytes(10).toString('base64').split('=')[0];
  const { address } = req.body;
  const { role } = req.body;

  if (firstName === undefined || lastName === undefined || email === undefined || gender === undefined || role === undefined) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'All fields are required',
      });
  }
  if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || gender.length === 0 || role.length === 0) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'No NULLs',
      });
  }
  const mailOptions = {
    from: `${process.env.NODEMAILER_USER}`,
    to: `${email}`,
    subject: 'Account confirmation',
    text: 'Your account at MTL has successfully been created\n'
            + 'Use the following password to login to the system hence you can change it from there\n'
            + `${password}\n`
            + 'Thank you.',
  };
  console.log(password);
  bcrypt.hash(password, 10)
    .then(
      (hash) => {
        pool.query('INSERT INTO users VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', [userId, firstName, lastName, email, username, gender, hash, address, role])
          .then(
            () => {
              transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                  return res.status(403)
                    .json({
                      status: 'error',
                      error: `${error}`,
                    });
                }
                console.log(response);
                return res.status(200)
                  .json({
                    status: 'success',
                    data: {
                      message: 'user account successfully created',
                      userId,
                      password,
                      firstName,
                      lastName,
                      email,
                      gender,
                      role,
                      address
                    },
                  });
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
    );
};

exports.loginCtrl = (req, res) => {
  const { uid } = req.body;
  const { password } = req.body;

  if (uid === undefined || password === undefined) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'All fields are required',
      });
  }
  pool.query(`SELECT * FROM users WHERE username='${uid}' OR email='${uid}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }

        const dbPassword = rows.map((data) => data.password);
        const id = rows.map((data) => data.user_id).toString();
        return bcrypt.compare(password, dbPassword.toString())
          .then(
            (valid) => {
              if (!valid) {
                return res.status(401)
                  .json({
                    status: 'error',
                    error: 'Unauthorized',
                  });
              }
              const token = jwt.sign(
                { userId: id },
                process.env.TOKEN,
                { expiresIn: '1h' },
              );
              return res.status(200)
                .json({
                  status: 'success',
                  data: {
                    userId: id,
                    token,
                  },
                });
            },
          )
          .catch(
            (error) => {
              res.status(500)
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
        res.status(500)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};

exports.changePassword = (req, res) => {
  // This can either be email or username
  const { uid } = req.body;
  const { currentPassword } = req.body;
  const { newPassword } = req.body;
  if (uid === undefined || currentPassword === undefined || newPassword === undefined) {
    return res.status(400)
      .json({
        status: 'error',
        error: 'All fields are required',
      });
  }
  pool.query(`SELECT * FROM users WHERE email='${uid}' OR username='${uid}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
        }
        const dbPassword = rows.map((data) => data.password).toString();
        return bcrypt.compare(currentPassword, dbPassword)
          .then(
            (valid) => {
              if (!valid) {
                return res.status(401)
                  .json({
                    status: 'error',
                    error: 'Unauthorized',
                  });
              }
              return bcrypt.hash(newPassword, 10)
                .then(
                  (hash) => pool.query(`UPDATE users SET password='${hash}' WHERE (email='${uid}' OR username='${uid}')`)
                    .then(
                      () => {
                        res.status(200)
                          .json({
                            status: 'success',
                            message: 'Password has been successfully changed',
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
                    ),
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

exports.forgotPassword = (req, res) => {
  const resetPasswordToken = crypto.randomBytes(20).toString('hex');
  const { email } = req.body;
  const mailOptions = {
    from: `${process.env.NODEMAILER_USER}`,
    to: `${email}`,
    subject: 'Link To Reset Password',
    text: 'You are receiving this email because either you( or someone else) have requested to change password\n'
        + 'If you did not request, please ignore and your password for MTL will remain unchaged\n'
        + 'Click the link below to reset password\n\n'
        + `http://localhost:3000/reset-password/${resetPasswordToken}.`,
  };
  pool.query(`SELECT * FROM users WHERE email='${email}'`)
    .then(
      ({ rows }) => {
        if (rows.length === 0) {
          return res.status(401)
            .json({
              status: 'error',
              error: 'Unauthorized',
            });
             }
        return pool.query(`UPDATE users SET reset_password_token='${resetPasswordToken}' WHERE email='${email}'`)
          .then(
            () => {
              transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                  return res.status(500)
                    .json({
                      status: 'error',
                      error: `${error}`,
                    });
                }
                console.log('Response', response);
                return res.status(200)
                  .json({
                    status: 'success',
                    data: {
                      message: 'Recovery Link Sent',
                      resetPasswordToken,
                    },
                  });
              });
            },
          )
          .catch(
            (error) => {
              res.status(500)
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
        res.status(500)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};

exports.resetPassword = (req, res) => {
  const { password } = req.body;
  const { resetPasswordToken } = req.body;

  pool.query(`SELECT * FROM users WHERE reset_password_token='${resetPasswordToken}'`)
    .then(
      ({ rows }) => {
        if (!rows) {
          return res.status
            .json({
              status: 'error',
              error: 'Forbidden',
            });
        }
        const email = rows.map((data) => data.email).toString();
        return bcrypt.hash(password, 10)
          .then(
            (hash) => pool.query(`UPDATE users SET password='${hash}', reset_password_token=null WHERE email='${email}'`)
              .then(
                () => {
                  res.status(200)
                    .json({
                      status: 'success',
                      message: 'Password has successfully been reset',
                    });
                },
              )
              .catch(
                (error) => {
                  res.status(500)
                    .json({
                      status: 'error',
                      error: `${error}`,
                    });
                },
              ),
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

exports.removeUser = (req, res) => {
  // const { userRole } = req.body;
  const { userId } = req.params;

  pool.query(`DELETE FROM users WHERE user_id='${userId}'`)
    .then(
      () => {
        res.status(200)
          .json({
            status: 'success',
            message: 'User successfully deleted',
          });
      },
    )
    .catch(
      (error) => {
        res.status(500)
          .json({
            status: 'error',
            error: `${error}`,
          });
      },
    );
};

exports.getUsers = (req, res) => {
  pool.query('SELECT * FROM users')
  .then(
    ({rows}) => {
      if (rows.length === 0) {
        return res.status(404)
        .json({
          status: 'error',
          error: 'No users',
        })
      }
      return res.status(200)
      .json({
        status: 'success',
        data: rows,
      })
    }
    )
  .catch(
    (error) => {
      res.status(501)
      .json({
        status: 'error',
        error: `${error}`
      })
    }
    )
}