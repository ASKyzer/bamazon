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
  console.log("");
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
  console.log("These are the items we sell...");
  connection.query("SELECT * FROM products", function(err, res){
      if (err) throw err;
      // loop through the products we have available and display the item_id, prodict_name and price.
      for (var i = 0; i < res.length; i++) {
        // Log all results of the SELECT statement
        console.log(res[i].item_id + ". " + res[i].product_name + " $" + parseFloat(res[i].price).toFixed(2) + " Quantity: " + res[i].stock_quantity);
      }
    }) // end of SELECT query
    // promptManager();
} // end of viewProducts function.

// function that allows the manager to view items that have five or fewer units left.
function viewLowInventory() {
  console.log("");
  console.log("These items are running low...");
  connection.query("SELECT * FROM products WHERE stock_quantity < 6", function(err, res){
      if (err) throw err;
      // loop through the products we have available and display the item_id, prodict_name and price.
      for (var i = 0; i < res.length; i++) {
        // Log all results of the SELECT statement
        console.log(res[i].item_id + ". " + res[i].product_name + " $" + parseFloat(res[i].price).toFixed(2) + " Quantity: " + res[i].stock_quantity);
      }
  }) // end of SELECT query
  // promptManager();
} // end of viewLowInventory function;

// function to ask manager which items to add more units to.
function addInventory() {
  console.log("");
  inquirer.prompt([
    {
      name: "choice",
      type: "input",
      message: "Enter the product ID for the product you want to update."
    }
  ]).then(function(answer){
    // console.log(answer.choice);
    itemID = answer.choice
    connection.query("SELECT * FROM products WHERE ?", {item_id: itemID}, function(err, res){
        if (err) throw err;
          // Log all results of the SELECT statement
          console.log("");
          console.log(res[0].item_id + ". " + res[0].product_name + " Quantity: " + res[0].stock_quantity);
          currentQuantity =  res[0].stock_quantity;
          confirmChoice(itemID, currentQuantity);
    }) // end of SELECT query
  }) //end of .then promise.
} // end of addInventory function.

function confirmChoice(itemID, currentQuantity) {
  console.log("");
  inquirer.prompt([
    {
      type: "confirm",
      message: "Is this the item you want to add?",
      name: "confirm",
      default: true
    },
    {
      type: "input",
      message: "How many units would you like to add to the inventory?",
      name: "units"
    },
    {
      name: "choice",
      type: "input",
      message: "Enter the product ID for the product you want to update again."
    }
  ]).then(function(response){
    console.log("");
    if (response.confirm) {
      var quantity = response.units;
      var itemID = response.choice;
      connection.query("SELECT * FROM products WHERE ?", {item_id: itemID}, function(err, res){
          if (err) throw err;
            // Log all results of the SELECT statement
            console.log(res[0].item_id + ". " + res[0].product_name + " Quantity: " + res[0].stock_quantity);
            currentQuantity =  res[0].stock_quantity;
            newTotal = parseInt(quantity) + parseInt(currentQuantity);
            updateInventory(itemID, newTotal);
      }) // end of SELECT query
    }
  })
} // end of confirm Choice function.

// function to update the inventory from the manager's entries
function updateInventory(itemID, newTotal) {
  console.log("");
  console.log("The quantity for product #" + itemID + " is being updated...");
  console.log("There are now " + newTotal + " of this item.");

  var query = connection.query("UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newTotal
      },
      {
        item_id: itemID // the chosen item from the prompt above
      }
    ], function(err, res) {
      if (err) throw err;
    }
  ); // end of query
}

function addProducts() {
  console.log("");
  inquirer.prompt([
    {
      name: "productName",
      type: "input",
      message: "What is the name of the item you want to add?",
    },
    {
      name: "productDept",
      type: "input",
      message: "What department item you want to add belong in?",
    },
    {
      name: "productPrice",
      type: "input",
      message: "Enter price",
    },
    {
      name: "productQuantity",
      type: "input",
      message: "Enter quantity",
    }
  ]).then(function(res){
    var name = res.productName;
    var dept = res.productDept;
    var cost = res.productPrice;
    var quant = res.productQuantity;
    createProduct(name, dept, cost, quant);
  })
}

function createProduct(name, dept, cost, quant) {
  console.log("");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: name,
      department_name: dept,
      price: cost,
      stock_quantity: quant
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      viewProducts();

    }
  );
} // end of createProduct function.
