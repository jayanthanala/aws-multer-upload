require("dotenv").config();
const express = require('express'),
  app = express(),
  fs = require('fs'),
  multer = require('multer'),
  multerS3 = require('multer-s3');
  aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS,
  secretAccessKey: process.env.SECRET
});
