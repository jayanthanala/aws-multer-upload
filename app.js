require("dotenv").config();
const express = require('express'),
  app = express(),
  fs = require('fs'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  bodyParser = require('body-parser'),
  //mongoose = require('mongoose'),
  aws = require('aws-sdk');

  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({extended: true}));

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS,
  secretAccessKey: process.env.SECRET
});

var upload = multer({      //multer({storage:?});
    storage: multerS3({    //multer({s3,bucket,key:fn(req,file,cb)});  //cb -> callback
        s3: s3,
        bucket: 'test-bucket-j',
        acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null,req.body.title); //use Date.now() for unique file keys
        }
    })
});


app.get("/",(req,res) => {
  res.render("index");
});

app.post("/upload",upload.array('fileupl',1),(req,res) => {
  data = {};
  console.log(req.files);
  req.files.forEach((file) => {
    data.bucket = file.bucket,
    data.location = file.location,
    data.key = file.key
  });
  res.redirect("/files");
});

app.get("/files/:bucket/:key",(req,res) => {
  var params = { Bucket: req.params.bucket, Key: req.params.key };
    s3.getObject(params, function(err, data) {
    res.writeHead(200);
    res.write(data.Body, 'binary');
    res.end(null, 'binary');
    console.log(data);
});
})

app.listen(3000,() => {
  console.log("Server up at port 3000");
})
