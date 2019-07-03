var express = require('express');
var router = express.Router();
// LOAD AMS REQUIRE MUDULES
var aws = require('aws-sdk');
var path = require('path');
var multer  = require('multer');
var multerS3 = require('multer-s3')
const configPath = path.join(__dirname, './../config.json')
aws.config.loadFromPath(configPath);
var s3 = new aws.S3();

/* GET home page. */
router.get('/', function(req, res, next) {
  var params = { 
    Bucket: 'lcloud-427-ts',
    Delimiter: '/',
    Prefix: ''
  }

  s3.listObjects(params, function (err, data) {
  if(err) console.log(" err", err);
    console.log('=====',data);
    res.render('index', { title: 'Express',data:data });
  });
  
});

var image_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'lcloud-427-ts',
    // contentType: multerS3.AUTO_CONTENT_TYPE,
    // acl: 'public-read',  

    metadata: function (req, file, cb) {

      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
  
      // Date.now().toString()
      cb(null, file.originalname)
    }
  })
});


router.post('/upload', image_upload.array('image_uploads',10), function (req, res, next) {
  res.redirect('/');
});

router.get('/filter', function(req, res, next) {
  
  var params = { 
    Bucket: 'lcloud-427-ts',
    Delimiter: '/',
    Prefix: ''
  }

  s3.listObjects(params, function (err, data) {
  if(err) console.log(" err", err);
    res.render('filteredFiles', { title: 'Express',data:data });
  });
  
});


router.post('/filterFiles', function(req, res, next) {
  console.log("res", req.body.filterValue);
  var prefix = req.body.filterValue;
  var params = { 
    Bucket: 'lcloud-427-ts',
    Delimiter: '/',
    Prefix: prefix
  }

  s3.listObjects(params, function (err, data) {
  if(err) console.log(" err", err);
    res.render('filteredFiles', { title: 'Express',data:data });
  });
  
});

router.post('/deleteFiles', function(req, res, next) {
  console.log("res", req.body.filterValue);
  var prefix = req.body.filterValue;
  var params = { 
    Bucket: 'lcloud-427-ts',
    Delimiter: '/',
    Prefix: prefix
  }

  s3.listObjects(params, function (err, data) {
  if(err) console.log(" err", err);
    res.redirect('/');
  });
  
});


module.exports = router;