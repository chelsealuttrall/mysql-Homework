var mysql = require("mysql");
var inquirer = require("inquirer")
var confirm = require('inquirer-confirm');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "Student.Me",
    password: "d@GGer1217",
    database: "BAMAZON_DB"
});

connection.connect(function(err) {
    if (err) throw err;

    console.log("connected as id " + connection.threadId);


    afterConnection();

});

function questions() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "What is the [ITEM_ID] of the product you'd like to buy?"
        }, {
            name: "qty",
            type: "number",
            message: "How many would you like to buy?"
        }])
        .then(answers => {
            //log product and quantity
            console.log(answers.id)
            ITEM_ID = answers.id;
            console.log(answers.qty);
            // let order = { productId: answers.id, orderQty: answers.qty };
            // console.log(order)
            readProducts(ITEM_ID, answers);
            //check db for qty and remove or error insufficient qty, and stop purchase.
            //return readProducts();
            //show total cost of purchase.
            //update DB
        })
        .catch(error => {
            if (error.isTtyError) {
                "Prompt couldn't be rendered in current environment."
            } else {
                "Something went wrong. Come back again later."
            };
        })
}


function afterConnection() {
    connection.query("SELECT * FROM PRODUCTS", function(err, res) {
        if (err) throw err;
        console.table(res)
        questions();

    });
}



function readProducts(ITEM_ID, answers) {
    console.log("readProducts() is connected");
    console.log("item id is:", ITEM_ID)
    connection.query("SELECT * FROM PRODUCTS WHERE ITEM_ID = ?", [ITEM_ID], function(err, res) {
        if (err) throw err;
        console.log(res[0].STOCK_QUANTITY);
        let stockqty = res[0].STOCK_QUANTITY
        qtyCheck(stockqty, answers);
    });



};

function qtyCheck(stockqty, answers) {
    if (stockqty < answers.qty) {
        console.log("Items are backordered, please reduce your quantity request.")
        questions();
    } else {
        updateProduct(stockqty, answers)
    }
};


function updateProduct(stockqty, answers) {
    console.log("Updating product...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                STOCK_QUANTITY: stockqty - answers.qty
            },
            {
                ITEM_ID: answers.id
            }
        ],

    );
    // logs the actual query being run
    console.log(query.sql);
    //buy more items?
    confirm("Would you like to buy more items?")
        .then(function confirmed() {
            questions();
        }, function cancelled() {
            console.log("Thanks for supporting your small, local black market!");
            connection.end();
        });

};