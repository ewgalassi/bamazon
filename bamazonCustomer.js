var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

var itemList = [];
var quantList = [];
var priceList = [];
var initialQuant;
var barCode;
var selected;
var cost = 0;
var price = 0;

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    introDisplay();
});

function introDisplay() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var result = res;
        // console.table(result, ["ID", "Product", "Department", "Price", "In Stock"]);
        for (item in res) {
            console.log(res[item].item_id + " | " + res[item].product_name + " | " + res[item].department_name + " | " + res[item].price + " | " + res[item].stock_quantity + "\n");
            itemList.push(res[item].product_name);
            quantList.push(res[item].stock_quantity);
            priceList.push(res[item].price);
        };
        inquirer.prompt([
            {
                message: "What would you like to buy?",
                type: "list",
                choices: itemList,
                name: "custBuy"
            }
        ]).then(function (response) {
            selected = response.custBuy;
            barCode = itemList.indexOf(selected) + 1;
            initialQuant = quantList[barCode - 1];
            price = priceList[barCode - 1];
            inquireQuantity();
        })
    });
};

function inquireQuantity() {
    inquirer.prompt([
        {
            message: "How many would you like to buy?",
            name: "custQuant"
        }
    ]).then(function (response) {
        var amount = response.custQuant;
        if (amount === NaN || amount <= 0) {
            console.log("Please enter a number greater than zero.");
            inquireQuantity();
        }
        else if (amount > initialQuant) {
            console.log("I'm sorry, but we don't have that many.  Please enter a different amount.");
            inquireQuantity();
        } else {
            var query = "UPDATE products SET ? WHERE ?";
            connection.query(query, [{ stock_quantity: initialQuant - amount }, { item_id: barCode }], function (err, res) {
                if (err) throw err;
                console.log("Item(s) added to your cart!");
                cost += (price * amount);
                console.log("Your total comes to $" + cost);
                inquirer.prompt([
                    {
                        message: "Would you like to purchase something else?",
                        type: "confirm",
                        name: "continue"
                    }
                ]).then(function (response) {
                    if (response.continue) {
                        introDisplay();
                    } else {
                        console.log("Thank you for shopping with us! Have a great day!");
                        connection.end();
                    }
                })
            });
        };
    });
}