const express = require('express');

const router = express.Router();
const upload = require('../middlewares/config-multer').upload;
const imagesCtrl = require('../controllers/images');
const auth = require('../middlewares/config-jwt').auth;


router.post('/', upload, imagesCtrl.uploadImage);
router.patch('/:imageId', auth, imagesCtrl.updateImage);
router.delete('/:imageId', auth, imagesCtrl.deletImage);
router.get('/', imagesCtrl.getImages);
router.get('/:imageId', imagesCtrl.getImage);
module.exports = router;
