const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt= require('bcryptjs');

module.exports=function(passport){
//localStrategy

passport.use(new LocalStrategy(function(username, password, done){
        //Match username

        let query ={username:username};
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message:'Inconnu'})
            }
            // Match Password

            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err; 
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null, false, {message:'Mauvais password'})
                }
            })

        })
    }));
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.serializeUser(function(id, done){
        User.findById(id, function(err,user){
            done(err,user);
        })
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
  });
});     
}