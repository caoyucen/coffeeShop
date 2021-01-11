module.exports = function(passport){
    var express = require('express');
    var router = express.Router();
    const bcrypt = require('bcrypt')

    router.get('/')
    router.get('/login', checkNotAuthenticated, (req, res) => {
      var context = {};
      context.loggedin = false;
      context.error = req.flash('error');
      context.message = req.flash('message');
      res.render('account/login', context);
    })

    router.get('/signup', checkNotAuthenticated, (req, res) => {
      var context = {};
      context.loggedin = false;
      context.error = req.flash('error');
      res.render('account/signup', context);
    })

    router.get('/logout', (req, res) => {
      req.logOut()
      context = {};
      res.render('account/logout', context);
    })

    router.post('/signup', function(req, res){
        //console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "SELECT * FROM Users WHERE email = ? ";
        var insert = [req.body.email];
        mysql.pool.query(sql, insert, function(error, results){
          if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
          }
          if(results.length){
            req.flash('error', req.body.email + ' is already taken!')
            res.redirect('/account/signup');
            return;
          }else{
            let password = bcrypt.hashSync(req.body.password, 10);
            var sql = "INSERT INTO Users (name, email, password) VALUES (?,?,?)";
            var inserts = [req.body.name, req.body.email, password];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    req.flash('message', 'Account has been created. Please login')
                    res.redirect('/account/login');
                }
              });
          }
        })

    });

    router.get('/profile', checkAuthenticated, (req, res) => {
      var context = {};
      context.loggedin = true;
      context.message = req.flash('message');
      context.name = req.user.name;
      context.email = req.user.email;
      context.phoneNumber = req.user.phoneNumber;
      res.render('account/profile', context);
    })

    router.get('/edit', checkAuthenticated, (req, res) => {
      var context = {};
      context.loggedin = true;
      context.name = req.user.name;
      context.phoneNumber = req.user.phoneNumber;
      res.render('account/editProfile', context);
    })

    router.post('/edit', function(req, res){
        var mysql = req.app.get('mysql');
        //console.log(req.body)
        //console.log(req.params.id)
        if(req.body.phoneNumber == ""){
          req.body.phoneNumber = null;
        }
        var sql = "UPDATE Users SET name=?, phoneNumber=? WHERE userID=?";
        var inserts = [req.body.name, req.body.phoneNumber, req.user.userID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
              req.flash('message', 'Your profile has been updated')
              res.redirect('/account/profile');
            }
        });
    });

    router.get('/changePassword', checkAuthenticated, (req, res) => {
      var context = {};
      context.loggedin = true;
      context.error = req.flash('error');
      res.render('account/changePassword', context);
    })

    router.post('/changePassword', function(req, res){
;
        if(bcrypt.compareSync(req.body.oldPassword, req.user.password)==false){
            req.flash('error', 'Please enter the correct old password')
            res.redirect('/account/changePassword');
            return;
        }
        let newPassword = bcrypt.hashSync(req.body.newPassword, 10);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Users SET password = ? WHERE userID=?";
        var inserts = [newPassword, req.user.userID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
              req.logout();
              req.flash('message', 'Your password has been changed. Please log in again')
              res.redirect('/account/login');
            }
        });

    });

    function checkAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/account/login')
    }

    function checkNotAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return res.redirect('/')
      }
      next()
    }


  return router;
}();
