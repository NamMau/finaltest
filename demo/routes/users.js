var express = require('express');
const ToyModel = require('../models/ToyModel');
var router = express.Router();

router.get('/homepage', async(req, res) => {
    var toys = await ToyModel.find({});
  
    res.render('homepage', { toys: toys});
  });