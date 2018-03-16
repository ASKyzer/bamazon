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
  // run the promptManager function to ask what he/she wants to do.
  promptManager();
});

// function that asks the manage a few choices using a switch/case.
function promptManager() {
    inquirer.prompt([
      {
        name: "task",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product"]
      }
    ]).then(function(choice){
        switch (choice.task) {
          case "View Products":
            viewProducts();
          break;
          case "View Low Inventory":
            viewLowInventory();
          break;
          case "Add to Inventory":
            addInventory();
          break;
          case "Add New Product":
            addProducts();
          break;
        }
    }) // end of .then promise.
} // end of promptManager fuction.

// function which displays all items in our products table.
function viewProducts() {
  console.log("");
  connection.query("SELECT * FROM products", function(err, res){
      if (err) throw err;
      // loop through the products we have available and display the item_id, prodict_name and price.
      for (var i = 0; i < res.length; i++) {
        // Log all results of the SELECT statement
        console.log(res[i].item_id + ". " + res[i].product_name + " $" + parseFloat(res[i].price).toFixed(2) + " Quantity: " + res[i].stock_quantity);
      }
    })
} // end of viewProducts function.
