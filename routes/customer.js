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
  db.many('SELECT * from customers')
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
  db.one('SELECT * from customers WHERE ID = $1', req.params.customerId)
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
  db.none('update customers set firstName=$1, lastName=$2 WHERE ID=$3',
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
  db.none('delete from customers WHERE ID = $1', req.params.customerId)
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
 * Gets the category's name and quantity from all customers' order, for problem #3
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
router.get('/categoryCount', function(req, res, next) {
  const sql = 'SELECT customer_id, firstName as customer_first_name, category_id, category_name, number_purchased' +
    'FROM customer JOIN ' +
      '( ' +
        'SELECT customer_id, category_id, category_name, sum(number) as number_purchased ' +
        'FROM ' +
          '( ' +
            'SELECT cID as category_id, name as category_name, pID as productID ' +
            'FROM ' +
              'categories JOIN category-product ' +
            'ON categories.ID = category-product.cID ' +
          ') ' +
        'JOIN ' +
          '( ' +
            'SELECT cID as customer_id, pID, sum(quantity) as number ' +
            'FROM ' +
              'orders JOIN orderDetails ' +
            'ON orders.ID = orderDetails.oID ' +
            'GROUP BY cID, pID ' +
          ') ' +
        'ON productID = pID ' +
        'GROUP BY customer_id, category_id ' +
      ') ' +
      'ON customers.ID = customer_id';
  db.many(sql)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Gets the category\'s name and quantity from all customers\' order successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Gets orders for a customer
 * @param {
 *  customerId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  data: {
 *    ID: number,
 *    status: string,
 *    placeDate: Date
 *  }
 *  message: string
 * }
 */
router.get('/:customerId/order', function(req, res, next) {
  db.many('SELECT ID as order_id, status, placeDate from orders WHERE cID = $1', req.params.customerId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get orders of customer ' + req.params.customerId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;