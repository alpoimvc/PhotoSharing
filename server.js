const express = require('express');
const app = express();
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const path = require('path');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

const {getDashboard} = require('./routes/dashboard');
const {sendImage} = require('./routes/dashboard');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "photosharing"
});

con.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.con = con;

app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(fileUpload()); // configure fileupload

app.get('/', function (req, res) {
  res.sendFile('/xampp/htdocs/SIRTP2/index.html');
});

app.get('/dashboard', getDashboard);

app.get('/search',function(req,res){
  let query = 'SELECT username FROM accounts WHERE username like "%'+req.query.key+'%"';
  console.log(query)
  con.query(query, function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].username);
      }
      res.end(JSON.stringify(data));
  });
});

app.post('/send/:username', sendImage);

app.get('/download/:image', function(req, res){
  console.log(req.params.image);
  var file = __dirname + '/public/assets/img/'+req.params.image;
  res.download(file); // Set disposition and send it.
});

app.post('/register', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;

    // send the player's details to the database
    let query = "INSERT INTO accounts (username, password, email) VALUES ('" +username + "', '" + password + "', '" + email + "')";
    con.query(query, (err, result) => {
      if (err) {
          console.log(err);
          return response.status(500).send(err);
      }
      response.redirect('/');
    });
});

app.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/dashboard');
      } else {
        response.send('Incorrect Username and/or Password!');
      }     
      response.end();
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.listen(3000);
