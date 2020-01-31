const express = require('express');

const router = express.Router();
const videosCtrl = require('../controllers/videos');

router.post('/', videosCtrl.uploadVideo);
router.patch('/:videoId', videosCtrl.updateVideo);
router.delete('/:videoId', videosCtrl.deletVideo);
router.get('/', videosCtrl.getVideos);
router.get('/:videoId', videosCtrl.getVideo);
module.exports = router;
