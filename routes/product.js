const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * list information for all products
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    ID: number,
 *    name: string,
 *    quantity: number
 *  }]
 *  message: string
 * }
 */
router.get('/all', function(req, res, next) {
  db.many('SELECT * from products')
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of all products successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Gets information for a product
 * @param {
 *  productId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  data: {
 *    ID: number,
 *    name: string,
 *    quantity: number
 *  }
 *  message: string
 * }
 */
router.get('/:productId', function(req, res, next) {
  db.one('SELECT * from products where ID = $1', req.params.productId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of product' + req.params.productId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Insert a new product into DB
 * @param {
 *  name: string,
 *  quantity: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/insert', function(req, res, next) {
  db.none('insert into products(name, quantity) values(${name}, ${quantity})', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one product successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Update an existing product
 * @param {
 *  name: stirng,
 *  quantity: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:productId/update', function(req, res, next) {
  db.none('update products set name=$1, quantity=$2 where ID=$3',
    [req.body.name, req.body.quantity, req.params.productId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated name and quantity of product' + req.params.productId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Delete an existing product
 * @param {
 *  productId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:productId/delete', function(req, res, next) {
  db.none('delete from products where ID = $1', req.params.productId)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete product ' + req.params.productId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Add a new category of an existing product
 * @param {
 *  category: number,
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:productId/category/insert', function(req, res, next) {
  db.oneOrNone('SELECT * from category-product where cID = $1 AND pID = $2', req.body.category, req.params.productId)
    .then(function (data) {
      if (data) {
        res.sendStatus(404);
        return;
      }
      db.none('insert into category-product(cID, pID) values($1, $2)', [req.body.category, req.params.productId])
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Add a category of product ' + req.params.productId + ' successfully.'
            });
        })
        .catch(function (err) {
          return next(err);
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Delete a category of an existing product
 * @param {
 *  productId: number,
 *  categoryId: number,
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:productId/category/:categoryId/delete', function(req, res, next) {
  db.one('delete from categories where cID = $1 AND pID = $2', req.params.categoryId, req.params.productId)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete category ' + req.params.categoryId + ' of product ' + req.params.productId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;