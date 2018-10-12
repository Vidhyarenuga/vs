var Course = require('../models/course');
var User = require('../models/user');
var Category = require('../models/category');
var Fos= require('../models/fos');
var Language= require('../models/lang');
var Count= require('../models/count');
var Admin= require('../models/admin');
var async = require('async');

module.exports = function(app) {
 
  app.get('/', function(req, res, next) {
    res.render('main/home');
  });
  app.route('/pdf/:id')

    .get(function (req, res, next) {
      Course.findOne({
        _id: req.params.id
      }, function (err, foundCourse) {
      res.render('accounts/pdf',{
          course: foundCourse
        });
       });
    })



  app.get('/courses', function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/courses', { courses: courses });
    });
  });
  app.route('/admin/no_of_learner')
  .get(function(req, res, next) {
      User.count({role:null}, function(err, count){
          console.log( "Number of docs: ", count );
      });
    });

    app.route('/admin/no_of_teacher')
  .get(function(req, res, next) {
      User.count({role:"teacher"}, function(err, count){
          console.log( "Number of teacher: ", count );
      });
    });

    app.route('/admin/no_of_courses')
    .get(function(req, res, next) {
        Course.count({}, function(err, count){
            console.log( "Number of courses: ", count );
        });
      });

      app.route('/admin/no_of_users')
    .get(function(req, res, next) {
        User.count({}, function(err, count){
            console.log( "Number of user: ", count );
        });
      });
  
 
  app.get('/mostpopular', function(req, res, next) {
    Course.find({}, function(err, courses) {
      res.render('courses/mostpopular', { courses: courses });
    });
  });
//---------<Get request to display the categories>-----------
app.get('/categories', function(req, res, next) {
  Category.find({}, function(err, categories) {
    res.render('admin/categories', { categories: categories });
  });
});

//---------<Get request to display the categories>-----------
app.get('/fos', function(req, res, next) {
  Fos.find({}, function(err, fos) {
    res.render('admin/fos', { fos: fos });
    
  });
});

// app.route('/admin/create-lang')
// .get(function(req, res, next) {
//     res.render('admin/create-language');
//   })


//   .post(function(req, res, next) {
   
//     async.waterfall([
//       function(callback) {
        
//         var language = new Language();
//         language.title=req.body.title;
    
//         language.save(function(err) {
         
//           if (err) return next(err);
//           callback(err, language);
//         });
//         res.redirect('/language');
//       },
//       ]);
//   });
app.get('/language', function(req, res, next) {
  Language.find({}, function(err, language) {
    res.render('admin/language', { language: language });
    
  });
});

app.get('/dashboard', function(req, res, next) {
  Category.find({}, function(err, categories) {
    res.render('admin/dashboard', { categories: categories });
  });
});

//---------<Get request to display the users>-----------
app.get('/users', function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('admin/allusers', { users: users });
  });
});

//---------<Get request to display the teacher>-----------
app.get('/teachers', function(req, res, next) {
  User.find({role:"teacher"}, function(err, users) {
    res.render('admin/teacher', { users: users });
  });
});

app.get('/student', function(req, res, next) {
  User.find({role:null}, function(err, users) {
    res.render('admin/student', { users: users });
  });
});
 //---------<Get request to display the courses>-----------
 app.get('/course', function(req, res, next) {
  Course.find({}, function(err, courses) {
    res.render('admin/courses', { courses: courses });
  });
});


app.get('/catdelete/:id',  function (req, res) {
  Category.findByIdAndRemove(req.params.id, function (error) {
      if (error)
          return console.log(error);

      Category.find(function (error, categories) {
          if (error)
              console.log(error);
          else
              req.app.locals.categories = categories;
      });

      req.flash('success', 'Category deleted!!');
      res.redirect('/categories');
  });
});


app.get('/fosdelete/:id',  function (req, res) {
  Fos.findByIdAndRemove(req.params.id, function (error) {
      if (error)
          return console.log(error);

      Fos.find(function (error, fos) {
          if (error)
              console.log(error);
          else
              req.app.locals.fos = fos;
      });

      req.flash('success', 'fos deleted!!');
      res.redirect('/dashboard');
  });
});

app.get('/langdelete/:id',  function (req, res) {
  Language.findByIdAndRemove(req.params.id, function (error) {
      if (error)
          return console.log(error);

      Language.find(function (error, language) {
          if (error)
              console.log(error);
          else
              req.app.locals.language = language;
      });

      req.flash('success', 'language deleted!!');
      res.redirect('/language');
  });
});


app.route('/editadmin/:id')

        .get(function(req, res, next) {
          Admin.findOne({ _id: req.params.id }, function(err,admin) {
            res.render('admin/editadmin', { admin: admin });
          });
        });


   
        // .post(function(req, res, next) {
        //   Admin.findOne({ _id: req.params.id }, function(err, found) {
        //     if (foundCourse) {
        //       if (req.body.title) foundCourse.title = req.body.title;
        //       if (req.body.price) foundCourse.price = req.body.price;
        //       if (req.body.desc) foundCourse.desc = req.body.desc;
        //       if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
             
              
        //       foundCourse.save(function(err) {
        //         if (err) return next(err);
        //         res.redirect('/course');
        //       });
        //     }
        //   });
        // });
app.route('/editcourse/:id')

        .get(function(req, res, next) {
          Course.findOne({ _id: req.params.id }, function(err,course) {
            res.render('admin/edit-course', { course: course });
          });
        })


   
        .post(function(req, res, next) {
          Course.findOne({ _id: req.params.id }, function(err, foundCourse) {
            if (foundCourse) {
              if (req.body.title) foundCourse.title = req.body.title;
              if (req.body.price) foundCourse.price = req.body.price;
              if (req.body.desc) foundCourse.desc = req.body.desc;
              if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
             
              
              foundCourse.save(function(err) {
                if (err) return next(err);
                res.redirect('/course');
              });
            }
          });
        });

app.get('/coursedelete/:id',  function (req, res) {
  Course.findByIdAndRemove(req.params.id, function (error) {
      if (error)
          return console.log(error);

      Course.find(function (error, course) {
          if (error)
              console.log(error);
          else
              req.app.locals.course = course;
      });

      req.flash('success', 'course deleted!!');
      res.redirect('/dashboard');
  });
});


  app.get('/courses/:id', function(req, res, next) {

    async.parallel([
      function(callback) {

        Course.findOne({ _id: req.params.id })
        .populate('ownByStudent.user')
        .exec(function(err, foundCourse) {
          callback(err, foundCourse);
        });
      },
   
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id})
        .populate('coursesTaken.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },

     
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.id})
        .populate('coursesTeach.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },
    ], function(err, results) {
      var course = results[0];
      var userCourse = results[1];
      var teacherCourse = results[2];
      if (userCourse === null && teacherCourse === null) {
        res.render('courses/courseDesc', { course: course });
      } else if (userCourse === null && teacherCourse != null) {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      } else {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      }
    });
  });


  app.get('/viewcourses/:id', function(req, res, next) {

    async.parallel([
      function(callback) {

        Course.findOne({ _id: req.params.id })
        .populate('ownByStudent.user')
        .exec(function(err, foundCourse) {
          callback(err, foundCourse);
        });
      },
   
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id})
        .populate('coursesTaken.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },

     
      function(callback) {
        User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.id})
        .populate('coursesTeach.course')
        .exec(function(err, foundUserCourse) {
          callback(err, foundUserCourse);
        });
      },
    ], function(err, results) {
      var course = results[0];
      var userCourse = results[1];
      var teacherCourse = results[2];
      if (userCourse === null && teacherCourse === null) {
        res.render('courses/courseDesc', { course: course });
      } else if (userCourse === null && teacherCourse != null) {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      } else {
        res.render('courses/course', { course: course ,userCourse:userCourse, teacherCourse:teacherCourse });
      }
    });
  });




}
