var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
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
    } else {
        //updateProduct()
    }
    connection.end();
};


// function createProduct() {
//     console.log("Adding a new product...\n");
//     var query = connection.query(
//         "INSERT INTO products SET ?", {
//             PRODUCT_NAME: "THERMO-EXTREME PROTECTANT SPRAY",
//             DEPARTMENT_NAME: "BIO-ENHANCEMENT",
//             PRICE: 54,
//             STOCK_QUANTITY: 358
//         },
//         function(err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " product inserted!\n");
//             // Call updateProduct AFTER the INSERT completes
//             updateProduct();
//         }
//     );

// logs the actual query being run
// console.log(query.sql);
// }

// function updateProduct() {
//     console.log("Updating product...\n");
//     var query = connection.query(
//         "UPDATE products SET ? WHERE ?", [{
//                 quantity: 100
//             },
//             {
//                 PRODUCT: "EXO-SKELETON"
//             }
//         ],
//         function(err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " products updated!\n");
//             // Call deleteProduct AFTER the UPDATE completes
//             deleteProduct();
//         }
//     );
//     // logs the actual query being run
//     console.log(query.sql);
// }

// function deleteProduct() {
//     console.log("Deleting all strawberry icecream...\n");
//     connection.query(
//         "DELETE FROM products WHERE ?", {
//             PRODUCT: "INVISI-CLOAK"
//         },
//         function(err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " products deleted!\n");
//             // Call readProducts AFTER the DELETE completes
//             readProducts();
//         }
//     );
// }