const express = require('express');

const router = express.Router();
const audiosCtrl = require('../controllers/audios');
const upload = require('../middlewares/config-multer').audioUpload;
const auth = require('../middlewares/config-jwt').auth;


router.post('/', auth, upload, audiosCtrl.uploadAudio);
router.patch('/:audioId', auth, audiosCtrl.updateAudio);
router.delete('/:audioId', auth, audiosCtrl.deleteAudio);
router.get('/', audiosCtrl.getAudios);
router.get('/:audioId', audiosCtrl.getAudio);
module.exports = router;
