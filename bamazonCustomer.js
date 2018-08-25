var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

var itemList =[];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    introDisplay();
});

function introDisplay() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        //   console.table(res, ["ID", "Product", "Department", "Price", "In Stock"])
        for (item in res) {
            console.log(res[item].item_id + " | " + res[item].product_name + " | " + res[item].department_name + " | " + res[item].price + " | " + res[item].stock_quantity + "\n");
            itemList.push(res[item].product_name);
        };
        inquirer.prompt([
            {
                message: "What would you like to buy?",
                type: "list",
                choices: itemList,
                name: "custBuy"
            }
        ]).then(function(response) {
            var selected = response;
            inquirer.prompt([
                {
                    message: "How many would you like to buy?",
                    name: "custQuant"
                }
            ]).then(function(response) {
                var amount = response;
            })
        })
    });
};