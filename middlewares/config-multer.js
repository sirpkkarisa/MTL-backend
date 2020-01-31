const multer = require('multer');

const MIME_TYPES = {
  'image/gif': 'gif',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'video/x-flv': 'flv',
  'video/mp4': 'mp4',
  'video/3gpp': '3gp',
  'video/MP2T': 'ts',
  'video/quicktime': 'mov',
  'audio/mp4': 'mp4 audio',
  'audio/mpeg': 'mp3',
  'audio/vnd.wav': 'wav',
};
const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`);
  },
});
exports.upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
}).single('image');

exports.videoUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
}).single('video');

exports.audioUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
}).single('audio');
