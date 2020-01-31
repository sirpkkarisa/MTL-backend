const express = require('express');

const router = express.Router();
const audiosCtrl = require('../controllers/audios');

router.post('/', audiosCtrl.uploadAudio);
router.patch('/:audioId', audiosCtrl.updateAudio);
router.delete('/:audioId', audiosCtrl.deleteAudio);
router.get('/', audiosCtrl.getAudios);
router.get('/:audioId', audiosCtrl.getAudio);
module.exports = router;
