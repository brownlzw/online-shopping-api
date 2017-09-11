## _A RESTful API With Node and Postgres_

##### Tasks explation
1. I designed a product-category table which product's id and category's
id are combined to make an unique row in the database.
2. I designed an orderDetails table which record the each product along
with its quantities in an order.
3. <pre>SELECT customer_id, firstName as customer_first_name, category_id, category_name, number_purchased
        FROM customer JOIN
          (
            SELECT customer_id, category_id, category_name, sum(number) as number_purchased
            FROM
              (
                SELECT cID as category_id, name as category_name, pID as productID
                FROM
                  categories JOIN category-product
                ON categories.ID = category-product.cID
              )
            JOIN
              (
                SELECT cID as customer_id, pID, sum(quantity) as number
                FROM
                  orders JOIN orderDetails
                ON orders.ID = orderDetails.oID
                GROUP BY cID, pID
              )
            ON productID = pID
            GROUP BY customer_id, category_id
          )
          ON customers.ID = customer_id
   </pre>
4. It's in the customer router and can be called by send a get request to `'/api/customer/categoryCount'`
in the front end.
5. It's in the customer router and can be called by send a post request to `'/api/order/average'`
in the front end.
6. It's in the customer router and can be called by send a get request to `'/api/:customerId/order'`
in the front end, WHERE `':customerId'` is parameterized router and can get its value by `req.params.customerId`.
7. I would add a placed field in the orders table indicated this order
is placed or not and store the unplaced orders in that table. When users
add, update or delete products from an unplaced order, I simply modify
the orderDetails table as what I will do to modify placed orders.
In this way, one-click ordering is convenient: just change the placed
field of order and add the proper placed date to placeDate field.
+ Pros:
  + Easy to create and delete unplaced orders.
  + Easy for add, update and delete products for unplaced orders.
  + Unplaced orders will not losed when session ends.
  + Very easy for one-click ordering.
+ Cons:
  + High storage overhead.
  + Unplaced orders will never expired.
8. I think there are three rules to follow:
  + First come, first serve
  + Try to make as much as possible customers to have that item
  + Limit the number of items every customer can buy

##### Setup steps
1. Install dependencies - `npm install`
2. Run - `psql -U postgres -f ./sql/createDB.sql`
3. Run the development server - `npm start`

##### Assumptions
1. Products are stored in the same place.
2. Every category, product, customer has a not null name.
3. Category's name can be fitted in 30 characters, product's name can be
fitted in 80 characters, customer's first name and last name can be
fitted in 30 characters and order status can be fitted in 20 characters.
4. Every order has a not null status and every product in a order has a
not null quantity.
5. Each order can be placed by only one customer once.
6. The front end will warp the proper data into request body when make
a post request.
