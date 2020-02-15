const express = require('express');

const router = express.Router();
const videosCtrl = require('../controllers/videos');
const upload = require('../middlewares/config-multer').videoUpload;
const auth = require('../middlewares/config-jwt').auth;

router.post('/', upload, videosCtrl.uploadVideo);
router.patch('/:videoId', auth, videosCtrl.updateVideo);
router.delete('/:videoId', auth, videosCtrl.deletVideo);
router.get('/', videosCtrl.getVideos);
router.get('/:videoId', videosCtrl.getVideo);
module.exports = router;
