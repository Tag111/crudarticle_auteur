const express = require('express');
const router = express.Router();

//Bring Articles models

let Article = require('../models/articles');


//Add Router
router.get('/add', function(req,res){
    res.render('add_article', {
        title:'Add article'
    });
});

//Add submit post router

/*router.post('/add', function(req,res){

    req.checkBody('title','Le titre est obligatoire').notEmpty();
    req.checkBody('author','L\'auteur est obligatoire').notEmpty();
    req.checkBody('body','La description est obligatoire').notEmpty();
})*/


////////////////


//add submit POST router

router.post('/add', function(req,res){

    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success','Article ajouté')
            res.redirect('/');
        }
    })
    return;

});

//Load edit form

router.get('/edit/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
        title:'Edit Article',
        article:article
        });
        
    });
});

//update submit post

router.post('/edit/:id', function(req,res){

    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query = {_id:req.params.id}
    Article.updateOne(query,article, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    })
    return;

});

//delete article by id

router.delete('/:id', function(req,res){
    let query = {_id:req.params.id}
    Article.deleteOne(query, function(err){
        console.log(err);

    })
    res.send('success');
});

//get article by id
router.get('/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
        article:article
        })
        
    })
})


module.exports=router;