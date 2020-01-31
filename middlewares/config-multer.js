const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/gif': 'gif',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};
const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    if (extension !== '.gif' || extension !== '.jpeg' || extension !== '.jpg' || extension !== '.png') {
      return callback('Only images required');
    }
    return callback(null, true);
  },
}).single('image');
module.exports = upload;
