const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN,
    );
    const { userId } = decodedToken;
    if (req.body.id && req.body.id !== userId) {
      res.status(401)
        .json({
          status: 'error',
          error: 'Unauthorized',
        });
    } else {
      next();
    }
  } catch (e) {
    res.status(401)
      .json({
        status: 'error',
        error: `${e}`,
      });
  }
};
