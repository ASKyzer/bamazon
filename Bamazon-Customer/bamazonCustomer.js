//* DEPENDENCIES *//

var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // log to see our connection.
  console.log("connected as id " + connection.threadId);
  // run the displayProducts function to list the items for sale.
  displayProducts();
});

// function that queries out mysql products table and list the items for sale.
function displayProducts() {
  console.log('');
  console.log("These are the items we have available...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // loop through the products we have available and display the item_id, prodict_name and price.
    for (var i = 0; i < res.length; i++) {
      // Log all results of the SELECT statement
      console.log(res[i].item_id, res[i].product_name, res[i].price);
    }
    // after we display the available products, we prompt the customer's order.
    promptCustomerOrder();
  }); // end of query
} // end of displayProducts function

// function using inquirer to ask the customer to chose an item by ID and how many of it they want.
function promptCustomerOrder() {
  console.log(""); // add a blank line for readability.
  // Prompt the user to chose the item by ID and how many unit s they want to buy.
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "Enter the product ID number of the item you wish to purchase.",
      },
      {
        name: "howMany",
        type: "input",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(function(answer) {
      // when finished prompting, let the customer know there are either insufficent quantity or let the order go through.
      var item = answer.productID;
      var quantityWanted = answer.howMany;

      connection.query("SELECT * FROM products WHERE item_id = ?", (item), function(err, res) {
        if (err) throw err;

        var thisItem = res[0];
        var totalQuantity = thisItem.stock_quantity;

        if (quantityWanted > totalQuantity) {
          console.log('');
          console.log("----------------------------------------------------------------------");
          console.log("Insufficient quantity! Please choose another item or a lower quantity.");
          console.log("----------------------------------------------------------------------");
          // list the items for sale again.
          displayProducts();
        }
        else {
          // call the function to update the quantity of the item purchased in our products table.
          updateProduct(quantityWanted, totalQuantity, item);
          // call the function to process the order
          processOrder(quantityWanted, item);
        }
      }) // end of connection.query
    }) // end of .then promis
} // end of customerOrder function


// update the products table with fewer stock_quantity
function updateProduct(quantityWanted, totalQuantity, item) {

  var newQuantity = totalQuantity - quantityWanted;

  console.log("");
  console.log("The quantity for the purchased items are being adjusted...");
  console.log("There are " + newQuantity + " left of this item.");

  var query = connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: item // the chosen item from the prompt above
      }
    ], function(err, res) {
      if (err) throw err;
    }
  ); // end of query
} // end of updateProduct function

function processOrder(quantityWanted, item) {

  console.log(""); // add a blank line for readability.

  var query = connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(err, res) {
    if (err) throw err;

    var itemPrice = res[0].price;
    var totalCost = parseFloat(itemPrice * quantityWanted).toFixed(2); // makes sure the price has only two decimal points
    var itemName = res[0].product_name;
    // log the total price of the desired quantities.
    console.log("----------------------------------------------------------------------------");
    console.log("The total cost for " + quantityWanted + " " + itemName + " is: $" + totalCost);
    console.log("----------------------------------------------------------------------------");

    // list the products again for continued shopping.
    displayProducts();

  })
} // end of processOrder function
