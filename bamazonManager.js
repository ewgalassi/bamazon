var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var chalk = require("chalk");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

var itemList = [];
var quantList = [];
var initialQuant;
var barCode;
var selected;

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    makeList();
    introInquire();
});

function introInquire() {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["Check the inventory", "View low inventory", "Purchase more inventory", "Purchase new products", "Exit"],
            name: "command"
        }
    ]).then(function (response) {
        switch (response.command) {
            case "Check the inventory":
                introDisplay();
                break;
            case "View low inventory":
                lowDisplay();
                break;
            case "Purchase more inventory":
                addInvent();
                break;
            case "Purchase new products":
                newItem();
                break;
            case "Exit":
                console.log(chalk.blue("\nThank you for using bamazonManager! Have a great day!\n"));
                connection.end();
            default:
                break;
        }
    });
};

function introDisplay() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(chalk.yellow("\nHere is the current inventory, unless rats got into the store again.\n"));
        console.table(res);
        introInquire();
    });
};

function lowDisplay() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(chalk.yellow("\nHere are the items that are running low on inventory.\n"));
        console.table(res);
        introInquire();
    });
};

function addInvent() {
    inquirer.prompt([
        {
            message: "What would you like to buy more of?",
            type: "list",
            choices: itemList,
            name: "inventory"
        },
        {
            message: "How many would you like to add to the inventory?",
            name: "quantity"
        }
    ]).then(function(response) {
        if (isNaN(response.quantity) || parseInt(response.quantity) <= 0) {
            console.log(chalk.red("\nPlease enter a number greater than zero.\n"));
            addInvent();
        }
        else {
            selected = response.inventory;
            barCode = itemList.indexOf(selected) + 1;
            initialQuant = quantList[barCode - 1];
            var amount = parseInt(response.quantity);
            console.log(chalk.green("\nInventory purchased!\n"));
            var query = "UPDATE products SET ? WHERE ?";
            connection.query(query, [
                {stock_quantity: initialQuant + amount}, 
                {item_id: barCode}
            ], function (err, res) {
                itemList = [];
                quantList = [];
                if (err) throw err;
                makeList();
                introInquire();
            });            
        }
    })
};

function newItem() {
    inquirer.prompt([
        {
            message: "What new product would you like to sell?",
            name: "newProduct"
        },
        {
            message: "What department will this be sold in?",
            name: "department"
        },
        {
            message: "How much are we selling these for?",
            name: "price"
        },
        {
            message: "How many do we have in stock?",
            name: "initInvent"
        }
    ]).then(function(response) {
        if (isNaN(response.price) || isNaN(response.initInvent) || parseInt(response.price) <= 0 || parseInt(response.initInvent) <= 0) {
            console.log(chalk.red("\nPlease enter a number greater than zero for price and quantity.\n"));
            newItem();
        }
        else {
            var product = response.newProduct;
            var department = response.department;
            var price = response.price;
            var stockAmount = response.initInvent;
            var query = "INSERT INTO products SET ?";
            connection.query(query, [
                {
                    product_name: product,
                    department_name: department,
                    price: price,
                    stock_quantity: stockAmount
                }
            ], function (err, res) {
                console.log(chalk.green("\nNew products added!\n"));
                itemList = [];
                quantList = [];
                if (err) throw err;
                makeList();
                introInquire();
            });
        }
    })
}

function makeList() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (item in res) {
            itemList.push(res[item].product_name);
            quantList.push(res[item].stock_quantity);
        };
    });
};