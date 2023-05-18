const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const passwordHash = require('password-hash');
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({extended: true}));

mongoose
    .connect(
        'mongodb+srv://caominh:WEB123@cluster0.sepuobq.mongodb.net/?retryWrites=true&w=majority',
    )
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log(error.message));

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/vendor-dashboard', (req, res) => {
  res.render('vendor-dashboard');
});
app.get('/product/new', (req, res) => {
  res.render('add-product');
});
app.get('/shipper-dashboard', (req, res) => {
  res.render('shipper-dashboard');
});

// CUSTOMER REGISTER PAGE
app.get('/customer-register', (req, res) => {
  res.render('customer-register');
});
app.post('/customer-register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    realname: req.body.realname,
    address: req.body.address,
    role: req.body.role,
  });

  try {
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    res.redirect('/customer-register');
  }
});
// VENDOR REGISTER
app.get('/vendor-register', (req, res) => {
  res.render('vendor-register');
});
app.post('/vendor-register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    realname: req.body.realname,
    address: req.body.address,
    role: req.body.role,
  });

  try {
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    res.redirect('/vendor-register');
  }
});
// SHIPPER REGISTER
app.get('/shipper-register', (req, res) => {
  res.render('shipper-register');
});
app.post('/shipper-register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    hub: req.body.hub,
    role: req.body.role,
  });

  try {
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    res.redirect('/shipper-register');
  }
});

// LOGIN USER
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      res.status(400).send('User is not existed, Please create your account');
      return;
    }

    const originalPassword = passwordHash.verify(
        req.body.password,
        user.password,
    );

    if (originalPassword === false) {
      res.status(400).send('Wrong Password');
    } else {
      if (user.role === 'customer') {
        res.render('home');
      } else if (user.role === 'vendor') {
        res.render('vendor-dashboard');
      } else {
        res.render('shipper-dashboard');
      }
    }
  } catch (err) {
    res.send(err);
  }
});

// USER ACTIONS
// UPADTE INFO
app.post('/my-account/update', async (req, res) => {
  if (req.body.password) {
    req.body.password = passwordHash.generate(req.body.password);
  }

  try {
    await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {new: true},
    );
    res.redirect('/my-account');
  } catch (err) {
    res.send(err.message);
  }
});

// PRODUCT VENDOR
// CREATE A PRODUCT
app.post('/add-product', async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
    category: req.body.category,
  });
  try {
    await newProduct.save();
    res.redirect('/vendor-dashboard');
  } catch (err) {
    console.log(err);
  }
});
// GET ALL PRODUCTS
app.get('/products', async (req, res) => {
  Product.find()
      .then((products) => {
        res.render('view-products', {products});
      })
      .catch((error) => console.log(error.message));
});
// DELETE - Show delete product form
app.get('/product/:id/delete', (req, res) => {
  Product.findById(req.params.id)
      .then((product) => {
        if (!product) {
          return res.send('Not found any product matching the ID!');
        }
        res.render('delete-product', {product});
      })
      .catch((error) => res.send(error));
});
// DELETE - Delete a product by ID
app.post('/product/:id/delete', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
      .then((product) => {
        if (!product) {
          return res.send('Not found any product matching the ID!');
        }
        res.redirect('/products');
      })
      .catch((error) => res.send(error));
});

// CART
// CREATE CART
app.post('/cart', async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.render('/cart', savedCart);
  } catch (err) {
    res.send(err.message);
  }
});

// UPADTE CART
app.post('/', async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {new: true},
    );
    res.redirect('/cart');
  } catch (err) {
    res.send(err.message);
  }
});

// ORDER
// CREATE ORDER, after clicking order in your cart page
app.post('/order', async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.render('/order', savedOrder);
  } catch (err) {
    res.send(err.message);
  }
});

// UPADTE, ONLY THE SHIPPER can update the status
app.post('/', async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {new: true},
    );
    res.render('/shipper-dashboard', updateOrder);
  } catch (err) {
    res.send(err.message);
  }
});

// GET CUSTOMER ORDER
app.get('/find/:id', async (req, res) => {
  try {
    const order = await Order.findOne({userId: req.params.userId});
    res.render('/shipper-dashboard', order);
  } catch (err) {
    res.send(err.message);
  }
});

// GET ALL CUSTOMER ORDERS
app.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.render('/shipper-dashboard', orders);
  } catch (err) {
    res.send(err.message);
  }
});

app.listen(port, () => {
  console.log('backend server is running');
});
