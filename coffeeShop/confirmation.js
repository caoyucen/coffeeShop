module.exports = function () {
    let express = require('express');
    let router = express.Router();

    // Display all items in the order page.
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.loggedin = req.isAuthenticated() ? true : false;
        context.userName = req.isAuthenticated() ? req.user.name : ""
        context.userID = req.user.userID;
        let mysql = req.app.get('mysql');
        getPlacedOrders(res, mysql, context, complete)
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('order/Confirmation', context);
            }
        }
    });

    function getPlacedOrders(res, mysql, context, complete){
        var userID = context.userID;

        var sql = "SELECT orderID, orderTime, totalPrice FROM Orders WHERE orderStatus = 'placed' and userID = ? ORDER BY Orders.orderTime DESC";
        var inserts = [userID];
        console.log('userID: ' + context.userID);
        mysql.pool.query(sql, inserts, function(error, results, fields){
        console.log('sql: ' + sql);
                        if(error){
                            res.write(JSON.stringify(error));
                            res.end();
                        }
                        console.log(results);
                        context.order = results;
                        complete();
                    });
    }

    return router;
}();



//reference:
//https://segmentfault.com/a/1190000015992232