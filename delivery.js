var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const method = require('./method');
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
  secret: 'a secret cookie signing value',
  cookie: { maxAge: 10000 },
  resave: false,
  saveUninitialized: false
}))

//use handlebar
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

app.get('/index.hbs', function (req, res) {
    res.status(200);
    res.redirect('/');
  })

//going to each home page
app.get('/consumerHome.hbs', function (req, res) {
    res.status(200);

    res.render('consumerHome.hbs', {
      title: "Consumer Log in Page",
      userType: "consumer"
     });
  })
app.get('/merchantHome.hbs', function (req, res) {
    res.status(200);
    res.render('merchantHome.hbs', {
        title: "Merchant Log in Page",
        userType: "merchant"
       });
  })


//after log in the main page of consumer
app.post('/conMain', function (req, res) {
    var usernm = req.body.username;

    var optionsUnsigned = {
            maxAge: 1000 * 60 * 15, // Expires after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
          
        };

    res.status(200);
    res.cookie("user", usernm, optionsUnsigned);

    res.render('conMain.hbs', {
        title: "Consumer Main Page",
        username: usernm,
        user: req.cookies["user"]
       });
  })
//after log in the main page of merchant
app.post('/merMain', function (req, res) {
    var usernm = req.body.username;

    res.status(200);
    res.render('merMain.hbs', {
        title: "Merchant Main Page",
        username: usernm
       });
  })

//KFC page
  app.post('/KFC', function (req, res) {
    

    res.status(200);
    res.render('KFC.hbs', {
        title: "KFC",
        welcomMsg:"Welcome",
        user: req.cookies["user"]
       });
  })

//pizzahut page
app.post('/pizzaHut', function (req, res) {
    

    res.status(200);
    res.render('pizzaHut.hbs', {
        title: "Pizza Hut",
        welcomMsg:"Welcome",
        user: req.cookies["user"]
       });
  })

//KFC order display Page with new session
app.post('/orderKFC', function (req, res) {
    var order = req.body.foods;
    var usernm  = req.cookies["user"]
    //turn selected oder to array 
    var arr=method.itemsToArray(order)
   
    //calcualte price
    var price  = method.calcPriceKFC(arr)


    var optionsUnsigned = {
        maxAge: 1000 * 60 * 15, // Expires after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
      
    };

    res.status(200);
    res.cookie("price", price, optionsUnsigned);
    res.cookie("user", usernm, optionsUnsigned);
    res.cookie("order", order, optionsUnsigned);
    res.render('orderKFC.hbs', {
        title: "KFC Order",
        welcomMsg:"Welcome",
        user: req.cookies["user"],
        order:req.cookies["order"],
        price:req.cookies["price"]
       });
  })

//Pizza hut order display page with new session
app.post('/orderPizzaHut', function (req, res) {
    var order = req.body.food;
    var usernm  = req.cookies["user"]

    //turn selected oder to array 
    var arr=method.itemsToArray(order)
   
    //calcualte price
    var price  = method.calcPricePizzaHut(arr)
    
    

    var optionsUnsigned = {
        maxAge: 1000 * 60 * 15, // Expires after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
      
    };

    res.status(200);
    res.cookie("price", price, optionsUnsigned);
    res.cookie("user", usernm, optionsUnsigned);
    res.cookie("order", order, optionsUnsigned);
    res.render('orderPizzaHut.hbs', {
        title: "pizzaHut Order",
        welcomMsg:"Welcome",
        user: req.cookies["user"],
        order:req.cookies["order"],
        price:req.cookies["price"]
       });
  })



//GET error page for three main pages!
app.get('/conMain', (req,res) =>{
    res.status(400);
    res.render('getError.hbs', {
      Result: "Cannot GET to log in",
      Message: "GET request is not supported! Please log in."
     });
     logger.crit("log in attempted through GET request");
  })
  app.get('/merMain', (req,res) =>{
    res.status(400);
    res.render('getError.hbs', {
      Result: "Cannot GET to log in",
      Message: "GET request is not supported! Please log in."
     });
     logger.crit("log in attempted through GET request");
  })
  app.get('/logMain', (req,res) =>{
    res.status(400);
    res.render('getError.hbs', {
      Result: "Cannot GET to log in",
      Message: "GET request is not supported! Please log in."
     });
     logger.crit("log in attempted through GET request");
  })
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