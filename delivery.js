var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const method = require('./method');
const mydb = require('./mydb').DBOperations;
// Load the cookie-parser library = common name for variable is "cookieParser"
const cookieParser = require('cookie-parser');

// Load the morgan library - common name for variable is morgan
const morgan = require('morgan');

// Load the winston library - common name for variable is winston
const winston = require('winston');

// Load the filesystem library - common name for variable is fs
const fs = require('fs');

// Load the path library - common name for variable is path
const path = require('path');

// Load the rotating-file-stream library - common name for variable is rfs
const rfs = require('rotating-file-stream');

// Load the express-session library - common name for variable is "session"
const session = require('express-session')

// Setup the cookie-parser middleware, set a secret key to support cookie signing
app.use(cookieParser("theSecretKey"));

// Use the session middleware - set session lifetime to 10 seconds for demo
app.use(session({
  key:"user_sid",
  secret: 'a secret cookie signing value',
  cookie: { maxAge: 1000 * 60 * 10 },
  resave: false,
  saveUninitialized: false
}))


// use database

var db = new mydb(); // postgres database functions

const hbs = require('hbs');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());

app.use(express.static('public'));


// Define the log directory and make sure it exists
var logDirectory = path.resolve('logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream for standard logging
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// create a rotating write stream for dev logging
var devLogStream = rfs.createStream('dev.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// setup 2 loggers - one with dev info and the other using Apache standard log format
app.use(morgan('dev', { stream: devLogStream }));
app.use(morgan('combined', { stream: accessLogStream }));

// Create a logger and setup transports
const logger = winston.createLogger({
  level: 'info',
  levels: winston.config.syslog.levels,
  format: winston.format.combine(winston.format.timestamp(),
    winston.format.json()),
  exitOnError: false,
  transports: [
    //
    // Write to all logs with level `info` and below to `combined.log`
    // Write all logs error (and below) to `error.log`.
    // Write unhandled exceptions to exceptions.log
    new winston.transports.File({ filename: `${logDirectory}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logDirectory}/combined.log` })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${logDirectory}/exceptions.log` })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}


//log in page
app.get('/', function (req, res) {
    res.status(200);
    res.render('index.hbs', {
      title: "Log in Page",
      welcomMsg: "Welcome to Deliverator"
      
     });
  })

app.get('/index', function (req, res) {
    res.status(200);
    res.redirect('/');
  })

app.get('/logout', function (req, res) {
    res.clearCookie('user_sid');
    res.redirect('/');
  })

  //todo make .get("consumerLogin.hbs") redirect 
//going to each home page
app.get('/consumerLogin', function (req, res) {
  
    res.status(200);

    res.render('consumerLogin.hbs', {
      title: "Consumer Log in Page",
      userType: "consumer",
      errorMsg: req.query.error
     });
  })
app.get('/merchantLogin', function (req, res) {
 
    res.status(200);
    res.render('merchantLogin.hbs', {
        title: "Merchant Log in Page",
        userType: "merchant"
       });
  })

  app.get('/registrationMerchant', function (req, res) {
    res.render('registration-merchant.hbs', {
        title: "Merchant Registration",
        userType: "merchant"
       });
  })

  app.post('/registrationMerchant', function (req, res) {
    // TODO DB unique constraint on database column of stores 
    // rename these files! 
    // changeAll urls to have no .hbs
    // update the links after you change the file names 
    // user can only look at stores where there is merchant. 
    let usernm = req.body.username;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let store_name = req.body.store_name;
    
    db.addMerchant(usernm, password, firstName, store_name).then (result => {
      
      res.render('merchantLogin.hbs', {
          title: "Merchant Login Page",
          userType: "Merchant"
         });
    }); 
  })


  
  app.get('/registrationConsumer', function (req, res) {
    try {
     // y.toLowerCase(); 
      res.render('registration-consumer.hbs', {
        title: "Consumer Registration",
        userType: "consumer"
       });
    }catch (err){
      redirectToLogin(res, err.message, "500 Error Page", err.mess); 

    }
   
  })


  
  
  app.post('/registrationConsumer', function (req, res) {

    
    let usernm = req.body.username;
    let password = req.body.password;
    let firstName = req.body.firstName;
    
    db.addConsumer(usernm, password, firstName).then (result => {
      res.redirect('/consumerLogin'); 
    });

  });

//after log in the main page of consumer
app.post('/consumerMain', function (req, res) {

    let usernm = req.body.username;
    let passwword = req.body.password;
    let authenticated  = false; 
    let isRealUser = db.isAuthenticated(usernm, passwword, "consumers");
    isRealUser.then(result => {
              
      authenticated = result.rows.length > 0 ? true : false; 
      
     

      if (authenticated){
      
         res.status(200);
         console.log("Storing the session information", result.rows[0].id)
          req.session.userid  = result.rows[0].id; 
          req.session.role  ="CONSUMER"; 
          req.session.username  = result.rows[0].username; 
      
         res.render('consumerMain.hbs', {
             title: "Consumer Main Page",
             username: usernm, 
             userid: req.session.userid
            });
            
       }else{
       
         res.redirect('/consumerLogin.hbs?&error=failed_login');
       
       }
      
   });
   

    

  })
//after log in the main page of merchant
app.post('/merchantMain', function (req, res) {

  let usernm = req.body.username;
  let passwword = req.body.password;
  let authenticated  = false; 
  let isRealUser = db.isAuthenticated(usernm, passwword, "merchants");
  isRealUser.then(result => {
    authenticated = result.rows.length > 0 ? true : false; 
    
   if (authenticated){
        res.status(200);
        req.session.userid  = result.rows[0].id; 
        req.session.role  ="MERCHANT"; 
        req.session.store_name = result.rows[0].store_name; 
        req.session.username  = result.rows[0].username; 
        res.redirect('/merchantMain');

     }else{
       res.clearCookie('user_sid')
       res.redirect('/merchantLogin.hbs?&error=failed_login');
          }
      
      
    }); // then promise 
  });
  


    
      app.get('/orderKFC', function (req, res) {
        res.status(200);
        if (!req.session.userid){
          redirectToLogin(res);
        }else {
          res.render('orderKFC.hbs', {"customer_id":req.session.userid});
        }
      }); 

      app.get('/orderPizzaHut', function (req, res) {
        res.status(200);
        if (!req.session.userid){
          redirectToLogin(res);
        }else {
          res.render('orderPizzaHut.hbs', {"customer_id":req.session.userid});
        }
      }); 
  //KFC order display Page with new session
app.post('/orderKFC', function (req, res) {
    var item_json = req.body.items;
    let parsed_json = [];
    let js = JSON.parse(item_json);
    // convert to db format for item_name price format 
    for (x in js){
      parsed_json.push({"item_name":x, "price":js[x]});
    }
    var userid  = req.session.userid;
    console.log("OrDER POST Method" + JSON.stringify(parsed_json));
    db.addOrder(userid, JSON.stringify(parsed_json), "KFC").then( result => {
      console.log("NOW REDIRECTING");
      var date = new Date();
      date = date.toString().split(" ").slice(0, 5).join(" ");
      res.redirect('/consumerMain?order_status=Success');
      
   });
  })

//Pizza hut order display page with new session
app.post('/orderPizzaHut', function (req, res) {

  var item_json = req.body.items;
    let parsed_json = [];
    let js = JSON.parse(item_json);
    // convert to db format for item_name price format 
    for (x in js){
      parsed_json.push({"item_name":x, "price":js[x]});
    }
    var userid  = req.session.userid;
    console.log("OrDER POST Method" + JSON.stringify(parsed_json));
    db.addOrder(userid, JSON.stringify(parsed_json), "PizzaHut").then( result => {
      console.log("NOW REDIRECTING");
      var date = new Date();
      date = date.toString().split(" ").slice(0, 5).join(" ");
      res.redirect('/consumerMain?order_status=Success');
      
   });
     }); 



//GET error page for three main pages!
app.get('/consumerMain', (req,res) =>{
  console.log("User Id ", req.session.userid);
  if (req.session.userid == undefined){
    redirectToLogin(res);
  }
  else {
    res.render(`consumerMain.hbs`) ; // ${req.query.error_msg || ""}&order_status=${req.query.order_status || ""}`);
  }
    
   
  })
  app.get('/merchantMain', (req,res) =>{
   
    if ( req.session.role == "CONSUMER"){
      res.render('getError.hbs', {
        Result: "Not Sufficient Privieges",
        Message: "Please log in.",
        userType: "consumer",
        errorMsg: req.query.error
       });
      
    }else if (!req.session.userid){
      console.log("Not Logged in")
      res.render('getError.hbs', {
        Result: "Not logged in.",
        Message: "Please log in."
       });
      // logger.crit("log in attempted through GET request");
    }else {
      console.log('about to sending data to view hbs')
      db.getOrdersByStore(req.session.store_name).then(result => {
        console.log(result.rows); 
        console.log('Sending data to view hbs')
        res.render('merchantMain.hbs', {username: req.session.username, orders: result.rows});
        
      });
    }
   
  })
 //catching 404, must be the very last route
  app.get("*", function(req, res){
   
      res.render('404.hbs', {url:req.url});
     
  
  }); 

  function redirectToLogin(httpResponse, error="Not logged in.", errorType="404 Bad Request", errMsg="Not Logged In"){
    httpResponse.render('getError.hbs', {
      Result: error,
      errorType: errorType
     });
     logger.crit("Critical Error " + errMsg);
  }
  

 
//use cookie example
// app.post('/yourhome', (req, res) =>{
//     var userType = req.body.userType;

  
//     var optionsUnsigned = {
//         maxAge: 1000 * 60 * 15, // Expires after 15 minutes
//         httpOnly: true, // The cookie only accessible by the web server
//         signed: false // Indicates if the cookie should be signed
  
//     };
//     res.status(200);
//     res.cookie("Pre", userType, optionsUnsigned);
  
  
//     res.render('yourhome.hbs', {
//       title: "home",
//       userType: userType
//      });
//   })

  module.exports.app = app;

  /**
   *     var optionsUnsigned = {
   
       maxAge: 1000 * 60 * 15, // Expires after 15 minutes
       httpOnly: true, // The cookie only accessible by the web server
       signed: false // Indicates if the cookie should be signed
     
   };
   */