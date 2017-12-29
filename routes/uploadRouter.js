const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        // if not specify originalname, the multer will generate a random string as name
        callback(null, file.originalname);
    }
});

const imageFileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('You can upload only image files!'), false);
    }
    else {
        callback(null, true);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: imageFileFilter 
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

/** ========================== upload image files ========================== */

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported for /imageUpload');
})

// single() allows upload only single file
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /imageUpload');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported for /imageUpload');
})

module.exports = uploadRouter;