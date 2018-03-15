var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayProducts();
});


function displayProducts() {
  console.log("These are the items we have available...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // loop through the products we have available and display the item_id, prodict_name and price.
    for (var i = 0; i < res.length; i++) {
      // Log all results of the SELECT statement
      console.log(res[i].item_id, res[i].product_name, res[i].price);
    }
    customerOrder();
  });
}

function customerOrder() {
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
        var thisItem = res[0];
        var totalQuantity = thisItem.stock_quantity;
        console.log(totalQuantity);

        if (quantityWanted > totalQuantity) {
          console.log("Insufficient quantity!");
          connection.end();
        }
        else {
          updateProduct(quantityWanted, totalQuantity, item);
          processOrder(quantityWanted, item);
        }
      }) // end of connection.query
    }) // end of .then promis
} // end of customerOrder function


// update the products table with fewer stock_quantity
function updateProduct(quantityWanted, totalQuantity, item) {

  console.log("");
  console.log("The quantity for the puchased items are being adjusted...");

  var newQuantity = totalQuantity - quantityWanted;
  var query = connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: item // the chosen item from the prompt above
      }
    ], function(err, res) {

    }
  );
  // log the actual query being run
  console.log(query.sql);
}

function processOrder(quantityWanted, item) {
  console.log(""); // add a blank line for readability.
  console.log(quantityWanted);
  console.log(item);

  var query = connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(err, res) {
    console.log(res[0]);
    var itemPrice = res[0].price;
    var totalCost = itemPrice * quantityWanted;
    var itemName = res[0].product_name;
    // log the total price of the desired quantities.
    console.log("The total cost for " + quantityWanted + " " + itemName + " is: $" + totalCost);
  })

} // end of processOrder function
