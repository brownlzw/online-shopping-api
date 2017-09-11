const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * List information for all orders
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    ID: number,
 *    cID: number,
 *    status: string,
 *    placeDate: Date | null
 *  }]
 *  message: string
 * }
 */
router.get('/all', function(req, res, next) {
  db.many('SELECT * from orders')
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of all orders successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Gets products information for an order
 * @param {
 *  orderId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    pID: number,
 *    quantity: number
 *  }]
 *  message: string
 * }
 */
router.get('/:orderId', function(req, res, next) {
  db.many('SELECT pID, quantity from orderDetails where ID = $1', req.params.orderId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Get information of order' + req.params.orderId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Insert a new order
 * @param {
 *  cID: number,
 *  status: string,
 *  placeDate: Date | null,
 *  products:[{
 *   pID: number,
 *   quantity: number
 *  }]
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/insert', function(req, res, next) {
  let oID;
  db.one('insert into orders(cID, status, placeDate) values(${cID}, ${status}, ${placeDate}' +
    ') RETURNING ID', req.body)
    .then(function (data) {
      oID = data.rows[0].ID;
      for (const element of req.body.products) {
        element.oID = oID;
        db.none('insert into orderDetails(oID, cID, pID, quantity) values( ${oID}, ${cID}, ${status},' +
          ' ${placeDate})', element)
          .then(function () {
            res.status(200)
              .json({
                status: 'success',
                message: 'Inserted one order successfully.'
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
 * Update an existing order
 * @param {
 *  ID: number,
 *  status: string,
 *  placeDate: Date | null
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:orderId/update', function(req, res, next) {
  db.none('update orders set status=$1, placeDate=$2 where ID=$3',
    [req.body.status, req.body.placeDate, req.params.orderId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated name and quantity of order' + req.params.orderId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Delete an existing order
 * @param {
 *  orderId: number
 * }
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string
 * }
 */
router.post('/:orderId/delete', function(req, res, next) {
  db.none('delete from orders where ID = $1', req.params.orderId)
    .then(function () {
      db.none('delete from orderDetails where oID = $1', req.params.orderId)
        .then(function (result) {
          res.status(200)
            .json({
              status: 'success',
              message: 'Delete order ' + req.params.orderId + ' successfully.'
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
 * Add a new product of an existing order, or add certain value to the quantity of a existing
 * product of an order
 * @param {
 *  product: number,
 *  quantity: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:orderId/product/insert', function(req, res, next) {
  db.manyOrNone('SELECT pID, quantity from orderDetails where oID = $1', req.params.orderId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      let newQuatity = req.body.quantity;
      for (const row of data.rows) {
        if (row.pID === req.body.product) {
          newQuatity += row.quantity;
          break;
        }
      }
      db.none('insert into orderDetails(oID, pID, quantity) values($1, $2, $3)'
        , [req.params.orderId, req.body.product, newQuatity])
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Add product ' + req.body.product + ' into order ' + req.params.orderId + ' successfully.'
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
 * Update a product's quantity of an existing order
 * @param {
 *  orderId: number,
 *  productId: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:orderId/product/:productId/update', function(req, res, next) {
  db.one('SELECT * from orderDetails where oID = $1 AND pID = $2', [req.params.orderId, req.params.productId])
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      db.none('update orderDetails set quantity = $1 where oID=$2 AND pID = $3',
        [req.body.quantity, req.params.orderId, req.params.productId])
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Update quantity of product ' + req.body.product + ' in order ' + req.params.orderId + ' successfully.'
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
 * Delete a product of an existing order
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:orderId/product/:productId/delete', function(req, res, next) {
  db.none('delete from orderDetailswhere oID = $1 AND pID = $2', [req.params.orderId, req.params.productId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete product ' + req.body.product + ' in order ' + req.params.orderId + ' successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

/**
 * Get average number of products sold in a period
 * @param {
 *  start: Date,
 *  end: Date,
 *  unit: string
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  data: {
 *    average: number,
 *  }
 *  message: string
 * }
 */
router.get('/average', function(req, res, next) {
  db.one('SELECT sum(quantity) as sum from orders JOIN orderDetails ON orders.ID =' +
    ' orderDetails.oID where placeDate >= $1 AND placeDate <= $2'
    , req.body.start, req.body.end)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      const timeDiff = Math.abs(req.body.end.getTime() - req.body.start.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      let average = data.sum / diffDays;;
      if (req.body.unit === 'week') {
        average *= 7;
      } else if (req.body.unit === 'month') {
        average *= 30;
      }
      res.status(200)
        .json({
          status: 'success',
          data: {
            average
          },
          message: 'Get information of all orders successfully.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;