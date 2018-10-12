var express = require('express');
var router = express.Router();
var async = require('async');

path = require('path');
// Get Category model
var Language = require('../models/lang');
module.exports = function(app) {

app.route('/admin/create-lang')
.get(function(req, res, next) {
    res.render('admin/create-language');
  })


  .post(function(req, res, next) {
   
    async.waterfall([
      function(callback) {
        
        var language = new Language();
        language.title=req.body.title;
    
        language.save(function(err) {
         
          if (err) return next(err);
          callback(err, language);
        });
        res.redirect('/language');
      },
      ]);
  });


app.route('/edit-lang/:id')

        .get(function(req, res, next) {
          Language.findOne({ _id: req.params.id }, function(err,language) {
            res.render('admin/edit-language', { language: language });
          });
        })


   
        .post(function(req, res, next) {
          Language.findOne({ _id: req.params.id }, function(err, foundLang) {
            if (foundLang) {
              if (req.body.title) foundLang.title = req.body.title;
             
              
              foundLang.save(function(err) {
                if (err) return next(err);
                res.redirect('/language');
              });
            }
          });
        });

        app.delete('/delete-categories/:id', (req, res)=>{

          Category.remove({_id: req.params.id}).then(result=>{
       
       
              res.redirect('/language');
       
       
       
          });});


    }