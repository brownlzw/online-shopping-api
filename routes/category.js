const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * list all categories
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    name: string
 *  }]
 *  message: string
 * }
 */
router.get('/all', function(req, res, next) {
  db.many('SELECT * from categories')
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of all categories successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Lists all products that belongs to a category
 * @param {
 *  categoryId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    pID: number,
 *  }]
 *  message: string
 * }
 */
router.get('/:categoryId/products', function(req, res, next) {
  db.many('SELECT pID from category-product WHERE cID = $1', req.params.categoryId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get all products that belongs to category' + req.params.categoryId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Insert a new category into DB
 * @param {
 *  name: string,
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/insert', function(req, res, next) {
  db.none('insert into categories(name) values($1)', req.body.name)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one category successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Update the name of an existing category
* @param {
 *  name: string
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:categoryId/update', function(req, res, next) {
  db.none('update categories set name=$1 WHERE ID=$2',
    [req.body.name, req.params.categoryId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Update category' + req.params.categoryId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Delete an existing category
 * @param {
 *  categoryId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:categoryId/delete', function(req, res, next) {
  db.none('delete from category-product WHERE cID = $1', req.params.categoryId)
    .then(function () {
      db.none('delete from categories WHERE ID = $1', req.params.categoryId)
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Delete category ' + req.params.categoryId + ' successfully.'
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

module.exports = router;