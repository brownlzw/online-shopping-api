const express = require('express');
const router = express.Router();


const customerRouter = require('./customer');
const categoryRouter = require('./category');
const productRouter = require('./product');
const orderRouter = require('./order');

router.use('/customer', customerRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);

router.get('/', function (req, res) {

    res.render('index', {title: 'online-shopping API'});
});

module.exports = router;
