var express = require('express');
var session = require('express-session');
var bodyParser = require("body-parser");
var mysql = require('mysql');
var app = express();

const {getDashboard} = require('./routes/dashboard');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "photosharing"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  app.listen(3000);
  console.log('Server listening on port 3000');
});
global.con = con;

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile('/xampp/htdocs/SIRTP2/index.html');
});

/*app.get('/dashboard', function(request, response) {
  if (request.session.loggedin) {
    console.log(request.session);
    //response.send('Welcome back, ' + request.session.username + '!');
    //response.sendFile('/xampp/htdocs/SIRTP2/public/dashboard.html');
  } else {
    response.send('Please login to view this page!');
  }
  response.sendFile('/xampp/htdocs/SIRTP2/public/dashboard.html');
  //response.end();
});*/

app.get('/dashboard', getDashboard);

app.get('/users', function(req, res) {
  //res.sendFile(path.join(__dirname+ '/myfile.html'));
  con.query('SELECT * FROM users', (err, rows, fields)=>{
    if(!err) 
    res.send(rows);
    else
    console.log(err);
  });
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
