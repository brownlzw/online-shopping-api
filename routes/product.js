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
 *    quatity: number
 *  }]
 *  message: string
 * }
 */
router.get('/all', function(req, res, next) {
  db.many('select * from products')
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
 *    quatity: number
 *  }
 *  message: string
 * }
 */
router.get('/:productId', function(req, res, next) {
  db.one('select * from products where ID = $1', req.params.productId)
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
 *  quatity: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/insert', function(req, res, next) {
  db.none('insert into products(name, quatity) values(${name}, ${quatity})', req.body)
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
 *  quatity: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:productId/update', function(req, res, next) {
  db.none('update products set name=$1, quatity=$2 where ID=$3',
    [req.body.name, req.body.quatity, req.params.productId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated name and quatity of product' + req.params.productId + ' successfully.'
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
 *  category: string,
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:productId/category/insert', function(req, res, next) {
  db.oneOrNone('select * from products where name = $1 AND pID = $2', req.body.category, req.params.productId)
    .then(function (data) {
      if (data) {
        res.sendStatus(404);
        return;
      }
      db.none('insert into categories(name, pID) values($1, $2)', [req.body.category, req.params.productId])
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
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:productId/category/:categoryName/delete', function(req, res, next) {
  db.one('delete from categories where name = $1 AND pID = $2', req.params.categoryName, req.params.productId)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete category of product ' + req.params.productId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;