## _A RESTful API With Node and Postgres_

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

##### Promises(What can I do given time)
1. Add stores information into products and orders table
2. Make security check to prevent some issues like sql injection.
3. Enable session and authentication.
4. Add roles for database and grant authority to different level of
administrator.
5. Add transaction stategy between supplies and orders, like 2PL.
6. Write log to prevent unexpected fail of database or system.
4. Make views and index to accelerate query speed.
