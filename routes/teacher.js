
path = require('path');
let fs=require('fs');
var async = require('async');
var User = require('../models/user');
var Course = require('../models/course');
var Profile = require('../models/Profile');
;

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter: fileFilter
 });


module.exports = function (app) {

  app.route('/become-an-instructor')


    .get(function (req, res, next) {
      res.render('teacher/become-instructor');
    })

    .post(function (req, res, next) {
      async.waterfall([
        function (callback) {
          var course = new Course();
          course.title = req.body.title;
          course.save(function (err) {
            callback(err, course);
          });
        },



        function (course, callback) {
          User.findOne({
            _id: req.user._id
          }, function (err, foundUser) {
            foundUser.role = "teacher";
            foundUser.coursesTeach.unshift({
              course: course._id
            });
            foundUser.save(function (err) {
              if (err) return next(err);
              res.redirect('/create-profile');
            });
          });
        }
      ]);
    });

  app.get('/teacher/dashboard', function (req, res, next) {
    User.findOne({
        _id: req.user._id
      })
      .populate('coursesTeach.course')
      .exec(function (err, foundUser) {
        res.render('teacher/teacher-dashboard', {
          foundUser: foundUser
        });
      });

  });
  app.get('/enrolled-courses', function (req, res, next) {
    User.findOne({
        _id: req.user._id
      })
      .populate('coursesTaken.course')
      .exec(function (err, foundUser) {
        res.render('teacher/enrolled-course', {
          foundUser: foundUser
        });
      });

  });
 


  app.route('/create-course')

    .get(function (req, res, next) {
      res.render('teacher/create-course');
    })

    .post(upload.single('syllabus'),function (req, res, next) {
      
      async.waterfall([
        function (callback) {
          console.log(req.file)
          var course = new Course();
          course.title = req.body.title;
          course.category = req.body.category;
          course.desc = req.body.desc;
         //course.image= req.file.path ;
          //course.image=req.files[0].filename;
          course.syllabus=req.file.path;
          course.language=req.body.language;
          course.wistiaId = req.body.wistiaId;
          course.price = req.body.price;
          course.ownByTeacher = req.user._id;
          course.save(function (err) {
            callback(err, course);
          });
        },

        function (course, callback) {
          User.findOne({
            _id: req.user._id
          }, function (err, foundUser) {
            foundUser.coursesTeach.unshift({
              course: course._id
            });
            foundUser.save(function (err) {
              if (err) return next(err);
              res.redirect('/teacher/dashboard');
            });
          });
        }
      ]);
    });
    
    
    // app.get('/add-to-wishlist/:id', function (req, res, next) {
    //   var courseId = req.params.id;
    //   var wishlist = new Wishlist(req.session.wishlist? req.session.wishlist : {});
    
    //   Course.findById(courseId, function (err, course) {
    //     if (err) {
    //       return res.redirect('/');
    //     }
    //     wishlist.add(course, course.id,course.title,course.desc);
    //     req.session.wishlist = wishlist;
    //     console.log(req.session.wishlist);
    //     res.redirect('/');
    //   });
    // });
    
    // app.get('/remove/:id', function (req, res, next) {
    //   var courseId = req.params.id;
    //   var wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});
    //   wishlist.removeItem(courseId);
    //   req.session.wishlist = wishlist;
    //   res.redirect('/');
    // });
    // app.get('/wishlists', function (req, res, next) {
    //   if (!req.session.wishlist) {
    //     return res.render('accounts/wishlist', {
    //       courses: null
    //     });
    //   }
    //   var wishlist = new Wishlist(req.session.cart);
    //   res.render('accounts/wishlist', {
    //     courses: wishlist.generateArray()
        
    //   });
    // });
    

   

  app.route('/edit-course/:id')

    .get(function (req, res, next) {
      Course.findOne({
        _id: req.params.id
      }, function (err, foundCourse) {
        res.render('teacher/edit-course', {
          course: foundCourse
        });
      });
    })


    .post(upload.any(),function (req, res, next) {
      Course.findOne({
        _id: req.params.id
      }, function (err, foundCourse) {
        if (foundCourse) {
          if (req.body.title) foundCourse.title = req.body.title;
          if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
          if (req.body.syllabus) foundCourse.syllabus = req.body.syllabus;
          if (req.body.price) foundCourse.price = req.body.price;
          if (req.body.desc) foundCourse.desc = req.body.desc;

          foundCourse.save(function (err) {
            if (err) return next(err);
            res.redirect('/teacher/dashboard');
          });
        }
      });
    });
    


    app.route('/create-profile')
    .get(function (req, res, next) {
      res.render('teacher/teacher-profile');
    })


    .post(
      (req, res, next) => {



        Profile.findOne({
          user: req.user._id
        }).then(profile => {
          const newPro = {
            handle: req.body.handle,
            company: req.body.company,
            location: req.body.location,
            website: req.body.website,
            githubusername: req.body.githubusername
          };


          profile.teacher.unshift(newPro);


          profile.save(function (err) {
            if (err) return next(err);
            res.redirect('/experience');
          });
        });
      }
    );
   




  


  app.route('/experience')
    .get(function (req, res, next) {
      res.render('teacher/experience');
    })


    .post(
      (req, res, next) => {



        Profile.findOne({
          user: req.user._id
        }).then(profile => {
          const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
          };


          profile.experience.unshift(newExp);


          profile.save(function (err) {
            if (err) return next(err);
            res.redirect('/education');
          });
        });
      }
    );


  app.route('/education')
  .get(function (req, res, next) {
    res.render('teacher/education');
  })
  
  
  
  
  .post((req, res,next) => {


      Profile.findOne({
        user: req.user._id
      }).then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Add to exp array
        profile.education.unshift(newEdu);
        profile.save(function (err) {
          if (err) return next(err);
          res.redirect('/teacher/dashboard');
        });

        
      });
    }
  );


  app.route('/create-userprofile')
  .get(function (req, res, next) {
    res.render('accounts/create-profile');
  })

  .post(


    (req, res, next) => {


      // Get fields
      var profile = new Profile();

      profile.user = req.user._id;
      profile.firstname= req.body.firstname;
      profile.lastname = req.body.lastname;
      profile.profession= req.body.profession;
      profile.bio = req.body.bio;
      profile.city=req.body.city;
      if (typeof req.body.skills !== 'undefined') {
        profile.skills = req.body.skills.split(',');
      }
      profile.social = {};
      if (req.body.youtube) profile.social.youtube = req.body.youtube;
      if (req.body.twitter) profile.social.twitter = req.body.twitter;
      if (req.body.facebook) profile.social.facebook = req.body.facebook;
      if (req.body.linkedin) profile.social.linkedin = req.body.linkedin;
      if (req.body.instagram) profile.social.instagram = req.body.instagram;
  
      profile.save(function (err) {
        if (err) return next(err);
        res.redirect('/courses');
      });
    });

    app.get('/uploaded-courses', function(req, res, next) {
      res.redirect('/teacher/dashboard');
    });
    // app.get('/enrolled-courses', function(req, res, next) {
    //   res.redirect('/learner/enrolled-course');
    // });



  app.get('/revenue-report', function (req, res, next) {
    var revenue = 0;
    User.findOne({
      _id: req.user._id
    }, function (err, foundUser) {
      foundUser.revenue.forEach(function (value) {
        revenue += value;
      });

      res.render('teacher/revenue-report', {
        revenue: revenue
      });
    });
  });



}
