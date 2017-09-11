const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * list name for all categories
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    name: string
 *  }]
 *  message: string
 * }
 */
router.get('/all', function(req, res, next) {
  db.many('select distinct(name) from categories')
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
 *  name: string
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    pID: number,
 *  }]
 *  message: string
 * }
 */
router.get('/:categoryName/products', function(req, res, next) {
  db.many('select pID from categories where name = $1', req.params.categoryName)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get all products that belongs to category' + req.params.categoryName + ' successfully.'
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
 *  pIDs: number[]
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/insert', function(req, res, next) {
  db.manyOrNone('select * from categories where name = $1', req.params.categoryName)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      for (const pID of req.body.pIDs) {
        db.none('insert into categories(name, pID) values($1, $2)', req.body.name, pID)
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
      }
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
router.post('/:categoryName/update', function(req, res, next) {
  db.none('update categories set name=$1 where name=$2',
    [req.body.name, req.params.categoryName])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Change category' + req.params.categoryName + ' into category '
          + req.body.name +' successfully.'
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
router.post('/:categoryName/delete', function(req, res, next) {
  db.none('delete from categories where name = $1', req.params.categoryName)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete category ' + req.params.categoryName + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;