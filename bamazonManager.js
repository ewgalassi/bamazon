var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    introInquire();
});

function introInquire() {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["Check the inventory", "View low inventory", "Purchase more inventory", "Purchase new products"],
            name: "command"
        }
    ]).then(function (response) {
        switch (response.command) {
            case "Check the inventory":
                introDisplay();
                break;
            case "View low inventory":

                break;
            case "Purchase more inventory":

                break;
            case "Purchase new products":

                break;
            default:
                break;
        }
    });
};

function introDisplay() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var result = res;
        // console.table(result, ["ID", "Product", "Department", "Price", "In Stock"]);
        for (item in res) {
            console.log(res[item].item_id + " | " + res[item].product_name + " | " + res[item].department_name + " | " + res[item].price + " | " + res[item].stock_quantity + "\n");
        };
        introInquire();
    });
};