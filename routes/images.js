const express = require('express');

const router = express.Router();
const upload = require('../middlewares/config-multer').upload;
const imagesCtrl = require('../controllers/images');


router.post('/', upload, imagesCtrl.uploadImage);
router.patch('/:imageId', imagesCtrl.updateImage);
router.delete('/:imageId', imagesCtrl.deletImage);
router.get('/', imagesCtrl.getImages);
router.get('/:imageId', imagesCtrl.getImage);
module.exports = router;
