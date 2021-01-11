const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const express = require('express')
const app = express()
var mysql = require('../dbcon.js');
app.set('mysql', mysql);


function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    mysql.pool.query("SELECT * FROM Users WHERE email = ?",[email], function(err, rows){
        if(err){
          return done(err);
        }
        if(!rows.length){
          //row is list, if the list length is not 0, meaning already has the email in database
          return done(null, false, { message: 'Ivalid email or password' });
        }
      try {
        if (bcrypt.compareSync(password, rows[0].password)) {  //row[0] because it only get 1
          return done(null, rows[0])
        } else {
          return done(null, false, { message: 'Ivalid email or password' })
        }
      } catch (e) {
        return done(e)
        }
    })
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.userID))
  passport.deserializeUser((id, done) => {
    return mysql.pool.query("SELECT * FROM Users WHERE userID = ?",[id], function(err, rows){
      done(err, rows[0]);
    })
  })
}

module.exports = initialize
