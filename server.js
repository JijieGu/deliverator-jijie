// Get the app server port from the environment (assuming heroku) or default to 8000 for local testing
const httpPort = process.env.PORT || 8000;


// get the calculator Express app
const app = require('./delivery').app;

// start the server!
app.listen(httpPort, () => {
  console.log(`HTTP server up on port ${httpPort}`);
});
