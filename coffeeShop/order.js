module.exports = function () {
    let express = require('express');
    let router = express.Router();


    function getItems(res, mysql, context, complete) {
        mysql.pool.query("SELECT itemID, name, unitPrice FROM Items", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results);
            context.item = results;
            complete();
        });
    }


    // Display all items in the order page.
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.loggedin = req.isAuthenticated() ? true : false;
        context.userName = req.isAuthenticated() ? req.user.name : ""
        context.userID = req.user.userID;
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('order/Order', context);
            }
        }
    });


    router.post('/', function (req, res) {
        let mysql = req.app.get('mysql');
        var userID = req.user.userID;
        var orderTime = getNowTime();
        var orderID = getTimeForCreateOrderID() + userID; //time + userID to create the new orderID
        console.log('userID: ' + userID);
        console.log('orderTime: ' + orderTime);
        console.log('orderID: ' + orderID);
        //creat the order with the orderID
        var sql2 = "INSERT INTO Orders (orderID, userID, orderTime, orderStatus) VALUES (?, ?, ?, 'placed')";
        var inserts2 = [orderID, userID, orderTime];
        sql2 = mysql.pool.query(sql2, inserts2, function (error, results, fields) {
            if (error) {
                console.log('Not OK');
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            } else {
                console.log('OK');
            }
        });

        var priceToPay = 0.0;
        var orderMark = 0; //if number is 0 for all item, orderMark is 0, meaning user didn't order anything
        for (var i = 0; i < req.body.itemID.length; i++) {
            var sql = "INSERT INTO Item_order (orderID, itemID, itemQuanity) VALUES (?, ?,?)";
            var itemID = parseInt(req.body.itemID[i]);
            var number = parseInt(req.body.number[i]);
            console.log('itemID: ' + itemID);
            console.log('number: ' + number);
            if (number > 0) {
                orderMark = 1;
                priceToPay = priceToPay + number * parseFloat(req.body.unitPrice[i]);
                console.log('price: ' + parseFloat(req.body.unitPrice[i]));
                var inserts = [orderID, itemID, number];
                console.log("inserts: " + inserts);
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                    if (error) {
                        console.log('Not OK');
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {
                        console.log('OK');
                    }
                });
            }
        }
        if(orderMark >0){
        console.log('priceToPay: ' + priceToPay);
        //update the totalPrice for the order
        var sql3 = "UPDATE Orders SET totalPrice=? WHERE orderID =?";
        var inserts3 = [priceToPay, orderID];
                sql3 = mysql.pool.query(sql3, inserts3, function (error, results, fields) {
                    console.log(sql3);
                    if (error) {
                        console.log('Not OK');
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {
                        console.log('OK');
                    }
                });
                res.redirect('/order/Confirmation');
                }
        //user didn't order, delete the preSet for order
        if(orderMark == 0){
            var sql4 = "DELETE FROM Orders WHERE orderID =?";
            var inserts4 = [orderID];
            sql4 = mysql.pool.query(sql4, inserts4, function (error, results, fields) {
                                console.log(sql4);
                                if (error) {
                                    console.log('Not OK');
                                    console.log(JSON.stringify(error));
                                    res.write(JSON.stringify(error));
                                    res.end();
                                } else {
                                    console.log('OK');
                                }
                            });
                            res.redirect('/order/Order');
        }


    });


    function getNowTime() {
        var timestamp = Date.now();
        if (timestamp) {
            var time = new Date(timestamp);
            var y = time.getFullYear();
            var M = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
        } else {
            return '';
        }
    }

    function getTimeForCreateOrderID() {
        var timestamp = Date.now();
        if (timestamp) {
            var time = new Date(timestamp);
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            return h * 100000000 + m * 1000000 + s * 10000;
        } else {
            return '';
        }
    }

    function checkNum(val) {
        document.getElementById('input').value = val >= 0 ? val : 0
        console.log('hello world');
    }


    return router;
}();



//reference:
//https://segmentfault.com/a/1190000015992232