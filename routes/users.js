const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const flash =require('connect-flash');
const passport=require('passport');
//Bring Articles models

let User = require('../models/user');
const { Router } = require('express');

//Register form

router.get('/register', function(req,res){
    res.render('register');

});

//Register process

router.post('/register', function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name','votre nom').notEmpty();
    req.checkBody('email','votre email').notEmpty();
    req.checkBody('email','votre email pas valide').isEmail();
    req.checkBody('username','votre prenom').notEmpty();
    //req.checkBody('password','votre mot de passe').notEmpty();
    req.checkBody('password2','incorrecte').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.render('register', {
            errors:errors
        });
    }
    else{
        let newUser =new User({
            name:name,
            username:username,
            email:email,
            password:password

        });

        bcrypt.genSalt(10,function(_err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                        req.flash('success','tu es enregistré et peut te connecter');
                        res.redirect('/users/login')
                    }
                })
            });
        })
        
    }
});
//login form
router.get('/login', function(req,res){
    res.render('login');
})

//login proccess

router.post('/login', function(req,res,next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//logout route

router.get('/logout', function(req,res){
    req.logout(function(err){
        if(err) {return next(err);}
    });
    req.flash('success', 'Déconnexion réussit')
    res.redirect('/users/login');
})

module.exports=router;