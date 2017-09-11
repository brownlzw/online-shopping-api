const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * list information for all customers
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    ID: number,
 *    firstName: string,
 *    lastName: string
 *  }]
 *  message: string
 * }
 */
router.get('/all', function(req, res, next) {
  db.many('select * from customers')
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of all customers successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Gets information for a customer
 * @param {
 *  customerId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  data: {
 *    ID: number,
 *    firstName: string,
 *    lastName: string
 *  }
 *  message: string
 * }
 */
router.get('/:customerId', function(req, res, next) {
  db.one('select * from customers where ID = $1', req.params.customerId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of customer ' + req.params.customerId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Insert a new customer into DB
 * @param {
 *  firstName: string,
 *  lastName: string;
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/insert', function(req, res, next) {
  db.none('insert into customers(firstName, lastName) values(${firstName}, ${lastName})', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one customer successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Update an existing customer
 * @param {
 *  firstName: string,
 *  lastName: string;
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:customerId/update', function(req, res, next) {
  db.none('update customers set firstName=$1, lastName=$2 where ID=$3',
    [req.body.firstName, req.body.lastName, req.params.customerId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated customer ' + req.params.customerId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Delete an existing customer
 * @param {
 *  customerId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:customerId/delete', function(req, res, next) {
  db.none('delete from customers where ID = $1', req.params.customerId)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete customer ' + req.params.customerId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Gets the category's name and quatity for customers' order
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    customer_id: number,
 *    customer_first_name: string,
 *    category_id: number,
 *    category_name: string,
 *    number_purchased: number
 *  }]
 *  message: string
 * }
 */
router.get('/:categoryCount', function(req, res, next) {
  const sql = 'select cID, firstName, pID, quatity JOIN (select customer.ID as cID, firstName,' +
    ' order.ID from customers' +
    ' JOIN orders ON customer.ID' +
    ' = orders.cID)'
  db.one('select * from customers where ID = $1', req.params.customerId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of customer ' + req.params.customerId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;