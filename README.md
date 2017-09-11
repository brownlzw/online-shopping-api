# A RESTful API With Node and Postgres

Possible Setup steps
1. Install dependencies - `npm install`
2. Run - `psql -U postgres -f ./sql/createDB.sql`
3. Run the development server - `npm start`

Assumptions
1. Products are stored in the same place.
2. Every category, product, customer has a not null name.
3. Category's name can be fitted in 30 characters, product's name can be
fitted in 80 characters, customer's first name and last name can be
fitted in 30 characters and order status can be fitted in 20 characters.
4. Every order has a not null status and every product in a order has a
not null quantity.
5. Each order can be placed by only one customer once.
