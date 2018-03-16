# bamazon

### Overview
This is a node application with two parts using mysql. The first is for the customer and the second is for the manager. This project started with 10 products in the database.

If you are a <strong>customer</strong>, the terminal will list all the items that are for sale.  The customer then chooses the item to purchase via the product ID number and... if there are insufficient quantities of that item, the customer will be told and the list will reappear for the customer to continue shopping.  If there are enough of the items, the  customer enters the amount he/she wants to buy and then the total cost will then appear on screen.  The list will reappear for the customer to continue shopping.

If you are a manager, you will be prompted with four choices.
  1. View Products
      - The list of items appear on the screen in order of product ID.
  2. View Items with Low Inventory of quantities of 5 or less.
      - We query the db to return items where the stock quantity is less than 6.
  3. Add to the Inventory
      - The manager is prompted to enter the product ID of the item she/he wants to add.  Then, the id, name, price and     quantity of the item is displayed and the manager is then asked to confirm if this is the item she/he wants to add.  If so, the quantity is then entered and is added to the stock quantity at the ID entered.
  4. Add a new Product.
      - The manager is prompted to first add the name of the item, then the department the item belongs in.  The price is then entered and lastly, the quantity of the items.  The into is then inserted to the products table and the list of items is now displayed with the new items added to the end of the list.
  
Usefulness
This application is great for shopping.  It's a simple app for now, but shows the concept of online shopping where inventory has to be updated in real time as the customers purchase them or the manager updates and adds items.

Tools Used
The site is built using node and npm packages for inquirer and mysql.

This project is created and maintained by Adrian Kyzer.
