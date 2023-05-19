const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const User = require('./models/User');
const Product = require("./models/Product");
const Order = require("./models/Order");
const passwordHash = require("password-hash");
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://khanhtrinh03:khanhtrinh03@cluster0.qci2ae7.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log(error.message));

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/about/:id", (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        res.render("about", { user });
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      });
});
app.get("/", (req, res) => {
    Product.find()
        .then((products) => {
            res.render("home", { products });
        })
        .catch((error) => console.log(error.message));
});
app.get("/vendor-dashboard", (req, res) => {
    res.render("vendor-dashboard");
});
app.get("/product/new", (req, res) => {
    res.render("add-product");
});
app.get("/shipper-dashboard", (req, res) => {
    res.render("shipper-dashboard");
});

//CUSTOMER REGISTER PAGE
app.get("/customer-register", (req, res) => {
    res.render("customer-register");
});
app.post("/customer-register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: passwordHash.generate(req.body.password),
        realname: req.body.realname,
        address: req.body.address,
        role: req.body.role,
        image: req.body.image,
    });

    try {
        const savedUser = await newUser.save();
        res.redirect("/login");
    } catch (err) {
        res.redirect("/customer-register");
    }
});
//VENDOR REGISTER
app.get("/vendor-register", (req, res) => {
    res.render("vendor-register");
});
app.post("/vendor-register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: passwordHash.generate(req.body.password),
        realname: req.body.realname,
        address: req.body.address,
        role: req.body.role,
        image: req.body.image,
    });

    try {
        const savedUser = await newUser.save();
        res.redirect("/login");
    } catch (err) {
        res.redirect("/vendor-register");
    }
});
//SHIPPER REGISTER
app.get("/shipper-register", (req, res) => {
    res.render("shipper-register");
});
app.post("/shipper-register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: passwordHash.generate(req.body.password),
        hub: req.body.hub,
        role: req.body.role,
        image: req.body.image,
    });

    try {
        const savedUser = await newUser.save();
        res.redirect("/login");
    } catch (err) {
        res.redirect("/shipper-register");
    }
});

//LOGIN USER 
app.post("/login", async (req, res) => {
    try {

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).send('User is not existed, Please create your account');
        }

        const originalPassword = passwordHash.verify(req.body.password, user.password);

        if (originalPassword === false) {
            res.status(400).send("Wrong Password");
        } else {
            if (user.role === "customer") {
                Product.find()
                    .then((products) => {
                        res.render("customer-dashboard", { products, user});
                    })
                    .catch((error) => console.log(error.message));
            } else if (user.role === "vendor") {
                res.render('vendor-dashboard', {user});
            } else if (user.role === "shipper") {
                Order.find({ hub: user.hub })
                    .then((orders) => {
                        res.render('shipper-dashboard', { orders, user });
                    })
                    .catch((error) => console.log(error.message));
            } else {
                res.status(400).send('Invalid user role.');
            }
        }

    } catch (err) {
        res.send(err);
    }
});

//USER ACTIONS
//UPADTE INFO
app.get("/my-account/:id", (req, res)=>{
    const userId = req.params.id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        res.render("my-account", { user : user});
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      });
});
app.get('/my-account/:id/update', (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
  
        res.render("update-profile", {user});
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      });
});
app.post('/my-account/:id/update', (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['image']; // Specify the allowed fields as an array
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.send({ error: 'Invalid updates!' });
    }

    User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .then(user => {
            if (!user) {
                return res.send('User not found!');
            }
            res.render("my-account", {user});
        })
        .catch(error => res.send(error));
});



//PRODUCT VENDOR
//CREATE A PRODUCT
app.post("/add-product", async (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        image: req.body.image,
        category: req.body.category,
    });
    try {
        await newProduct.save();

        res.render("add-product");
    } catch (err) {
        console.log(err);
    }
});
//GET ALL PRODUCTS
app.get("/products", async (req, res) => {
   await Product.find()
        .then((products) => {
            res.render("view-products", { products });
        })
        .catch((error) => console.log(error.message));
});
//FILTER
app.get('/filter', (req, res) => {
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
      .then((products) => {
        res.render('home', { products });
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
      });
  });
  

// DELETE - Show delete product form
app.get('/product/:id/delete', (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                return res.send('Not found any product matching the ID!');
            }
            res.render('delete-product', { product });
        })
        .catch(error => res.send(error));
});
// DELETE - Delete a product by ID
app.post('/product/:id/delete', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (!product) {
                return res.send('Not found any product matching the ID!');
            }
            res.redirect('/products');
        })
        .catch(error => res.send(error));
});
//FIND A PRODUCT BY ID IN PRODUCT.EJS
app.get('/product/:id', (req, res) => {
    Product.findById(req.params.id)
        .then((product) => {
            if (!product) {
                return res.send("Cannot found that ID!");
            }
            res.render('product', { product: product });
        })
        .catch((error) => res.send(error));
});

//ORDER
//CREATE ORDER, after clicking order in your cart page
app.get("/order", async (req, res) => {
    await Product.find()
        .then((products) => {
            res.render("order", { products });
        })
        .catch((error) => console.log(error.message));
});
app.post('/checkout', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || user.role !== "customer") {
            return res.send("No customer existed");
        }

        const products = await Product.find({ _id: { $in: req.body.products } });
        const order = new Order({
            customerName: `${req.body.firstName} ${req.body.lastName}`,
            products: products,
            user: user,
            hub: req.body.hub,
            address: req.body.address,
            email: req.body.email,
        });
        const savedOrder = await order.save();

        res.render('order-summary', {
            customerName: `${req.body.firstName} ${req.body.lastName}`,
            products: products,
            user: user,
            hub: req.body.hub,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
});

//UPADTE, ONLY THE SHIPPER can update the status
// UPDATE - Show update order form
app.get('/shipper-dashboard/:id/update', (req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if (!order) {
                return res.send('Not found any order matching the ID!');
            }
            res.render('update-order', { order });
        })
        .catch(error => res.send(error));
});
// UPDATE - Update an order by ID
app.post('/shipper-dashboard/:id/update', (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'hub'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.send({ error: 'Invalid updates!' });
    }

    Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .then(order => {
            if (!order) {
                return res.send('Not found any order matching the ID!');
            }
            res.send("Updated The Order Successfully");
        })
        .catch(error => res.send(error));
});



app.listen(port, () => {
    console.log("backend server is running");
});