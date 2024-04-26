var express = require('express');
const ToyModel = require('../models/ToyModel');
var router = express.Router();

/* GET home page. */
router.get('/', async(req, res) => {
  var toys = await ToyModel.find({});

  var total = await ToyModel.count();

  res.render('nammautoy/homepage', { toys: toys, total : total });
});


router.get("/toy", async (req, res) => {
  var toys = await ToyModel.find({});

  var total = await ToyModel.count();

  res.render("nammautoy/index", { toys: toys, total: total });
});


router.get('/list', async (req, res) => {
  var toys = await ToyModel.find({});
  res.render("nammautoy/list", { toys: toys });
})

router.get('/delete/:id', async(req, res) => {
  await ToyModel.findByIdAndDelete(req.params.id)
  .then(() => { console.log ('Delete this toy succeed !')})
  .catch((err) => { console.log ('Delete toy failed !')});
  res.redirect('nammautoy');
})
router.get('/drop', async(req, res) => {
  await ToyModel.deleteMany({})
  .then(() => { console.log ('Delete all toys succeed !')});
  res.redirect("/nammautoy");
})

router.post('/order', async (req, res) => {
  var id = req.body.id;
  var toy = await ToyModel.findById(id);
  var order_quantity = req.body.order_quantity;
  var price = req.body.price;
  var total_price = price * order_quantity;
  res.render('order_confirm', { toy: toy, order_quantity : order_quantity, total_price : total_price});
})

router.get('/add', (req, res) => {
  res.render('nammautoy/add');
})

router.post('/add', async (req, res) => {
  var toy = req.body;
  await ToyModel.create(toy)
  .then(() => { console.log ('Add new toy succeed !')});
  res.redirect("/");
})

router.get('/edit/:id', async (req, res) => {
  var toy = await ToyModel.findById(req.params.id);
  res.render('nammautoy/edit', { toy : toy});
})

router.post('/edit/:id', async (req, res) => {
  var id = req.params.id;
  await ToyModel.findByIdAndUpdate(id)
  .then(() => { console.log('Edit toy succeed !') });
  res.redirect("/");
})

router.get('/login', (req, res) => {
  res.render("login")
})

router.get('/signup', (req, res) =>{
  res.render("signup")
})

router.post('/search', async (req, res) => {
  let keyword = req.body.keyword;
  let toys = await ToyModel.find({ name: new RegExp(keyword, "i") });
  res.render('nammautoy/list', { toyList : toys });
})


module.exports = router;
