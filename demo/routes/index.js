var express = require('express');
const ToyModel = require('../models/ToyModel');
var router = express.Router();
const CategoryModel = require('../models/CategoryModel')

/* GET home page. */
router.get('/', async(req, res) => {
  try {
    // Thêm populate để lấy thông tin về category của mỗi toy
    var toys = await ToyModel.find({}).populate('category');

    // Bạn cũng cần tính toán tổng số lượng toy hiện có, không cần sử dụng populate ở đây
    var total = await ToyModel.countDocuments();

    res.render('nammautoy/homepage', { toys: toys, total: total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/toy", async (req, res) => {
  var toys = await ToyModel.find({});

  var total = await ToyModel.countDocuments();

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
  res.redirect('/toy');
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

router.get('/add', async (req, res) => {
  try {
    // Truy vấn danh sách các danh mục từ cơ sở dữ liệu và truyền chúng vào trang HTML
    const categories = await CategoryModel.find({}, 'name');
    res.render('nammautoy/add', { categories: categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/add', async (req, res) => {
  try {
    var toy = req.body;
    await ToyModel.create(toy);
    console.log('Add new toy succeed !');
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const toy = await ToyModel.findById(id);
    const categories = await CategoryModel.find(); // Lấy tất cả các danh mục

    res.render('nammautoy/edit', { toy: toy, categories: categories });
  } catch (error) {
    console.error('Error editing toy:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedToy = req.body;

    const result = await ToyModel.findByIdAndUpdate(id, updatedToy);

    if (!result) {
      console.log('Edit toy failed: Toy not found');
      return res.status(404).send('Toy not found');
    }

    console.log('Edit toy succeed!');
    res.redirect('/');
  } catch (error) {
    console.error('Error editing toy:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/login', (req, res) => {
  res.render("login")
})

router.get('/signup', (req, res) =>{
  res.render("signup")
})

router.get('/detail/:id', async (req, res) => {
  var id = req.params.id;
  var toy = await ToyModel.findById(id).populate('category');
  res.render('nammautoy/detail', { toy : toy});
})


router.post('/search', async (req, res) => {
  let keyword = req.body.keyword;
  let toys = await ToyModel.find({ name: new RegExp(keyword, "i") });
  res.render('nammautoy/list', { toys : toys });
})

module.exports = router;
