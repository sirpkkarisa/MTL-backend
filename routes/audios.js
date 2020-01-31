const express = require('express');

const router = express.Router();
const audiosCtrl = require('../controllers/audios');
const upload = require('../middlewares/config-multer').audioUpload;

router.post('/', upload, audiosCtrl.uploadAudio);
router.patch('/:audioId', audiosCtrl.updateAudio);
router.delete('/:audioId', audiosCtrl.deleteAudio);
router.get('/', audiosCtrl.getAudios);
router.get('/:audioId', audiosCtrl.getAudio);
module.exports = router;
