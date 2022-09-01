 //import
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const passport = require('passport');
const dbase = require('./config/database')
//const message = require('express-message')

mongoose.connect(dbase.database);
let db = mongoose.connection;
//check connection

db.once('open',function(){
    console.log('connecter à mongodg ')
})

//check for db errors

db.on('error',function(err){
    console.log(err);

})


//init server app
const app = express();
//bring to models
let Article = require('./models/articles')

//load view engine /**moteur de vue de charge */
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

//body-Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//set public folder

app.use(express.static(path.join(__dirname,'public')));

///Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
/*  cookie: { secure: true }*/
}));

//Message expresss middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
 //Validator middleware express

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace= param.split('.'),
        root= namespace.shift(),
        formParam = root;

        while(namespace.lenght){
            formParam += '['+namespace.shift() +']';
        }
        return{
            param:formParam,
            msg:msg,
            value:value
        }
    }
 }))

//Passport Config

require('./config/passport')(passport);
//passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('*', function(req,res,next){
        res.locals.user = req.user || null;
        next();
    });

//home route

app.get('/', (req,res)=>{
    Article.find({},function(err, articles){
        if(err){
            console.log(err)
        }else{
        res.render('index', {
        title: 'Articles',
        articles:articles
            }); 
        }    
    })   
    
});

//add route get

app.get('/article/add', (req,res)=>{
    res.render('add_article', {
        title:'Add articles'
    })

})

//Routes file

let articles =require('./routes/articles');
app.use('/articles',articles)
let users =require('./routes/users');
const { config } = require('dotenv');
app.use('/users',users)


//start server
app.listen(8082,()=>{
    console.log("server connecté");
})