module.exports = function () {
    let express = require('express');
    let router = express.Router();

    function getItems(res, mysql, context, complete) {
        mysql.pool.query("SELECT name, unitPrice, calorie, description, picURL FROM Items", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results);
            context.item = results;
            complete();
        });
    }

    // Display all items.
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.loggedin = req.isAuthenticated() ? true : false;
        let mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('menu/Menu', context);
            }
        }
    });

    return router;
}();


//reference:
//https://www.runoob.com/w3cnote/javascript-search-auto-tip.html