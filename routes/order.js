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
  db.many('select * from orders')
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
 * List all orders of a customer
 * @returns {
 *  status: HttpResponseStatus,
 *  data: [{
 *    ID: number,
 *    status: string,
 *    placeDate: Date | null
 *  }]
 *  message: string
 * }
 */
router.get('/:customerID/all', function(req, res, next) {
  db.one('select ID, status, placeDate from orders where cID = $1', req.params.customerID)
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
 *    quatity: number
 *  }]
 *  message: string
 * }
 */
router.get('/:orderId', function(req, res, next) {
  db.many('select pID, quatity from orderDetails where ID = $1', req.params.orderId)
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
 *   quatity: number
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
        db.none('insert into orderDetails(oID, cID, pID, quatity) values( ${oID}, ${cID}, ${status},' +
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
          message: 'Updated name and quatity of order' + req.params.orderId + ' successfully.'
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
 * Add a new product of an existing order, or add certain value to the quatity of a existing
 * product of an order
 * @param {
 *  product: number,
 *  quatity: number
 * } req.body
 * @returns {
 *  status: HttpResponseStatus,
 *  message: string,
 * }
 */
router.post('/:orderId/product/insert', function(req, res, next) {
  db.manyOrNone('select pID, quatity from orderDetails where oID = $1', req.params.orderId)
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      let newQuatity = req.body.quatity;
      for (const row of data.rows) {
        if (row.pID === req.body.product) {
          newQuatity += row.quatity;
          break;
        }
      }
      db.none('insert into orderDetails(oID, pID, quatity) values($1, $2, $3)'
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
 * Update a product's quatity of an existing order
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
  db.one('select * from orderDetails where oID = $1 AND pID = $2', [req.params.orderId, req.params.productId])
    .then(function (data) {
      if (!data) {
        res.sendStatus(404);
        return;
      }
      db.none('update orderDetails set quatity = $1 where oID=$2 AND pID = $3',
        [req.body.quatity, req.params.orderId, req.params.productId])
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Update quatity of product ' + req.body.product + ' in order ' + req.params.orderId + ' successfully.'
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

module.exports = router;