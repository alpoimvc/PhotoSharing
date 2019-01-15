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

const {login} = require('./routes/user');
const {register} = require('./routes/user');
const {logout} = require('./routes/user');

const {getDashboard} = require('./routes/dashboard');
const {searchUser} = require('./routes/dashboard');
const {sendImage} = require('./routes/dashboard');
const {uploadImage} = require('./routes/dashboard');
const {downloadImage} = require('./routes/dashboard');
const {getImages} = require('./routes/myImages');
const {getProfile} = require('./routes/profile');

const {updateUser} = require('./routes/profile');

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
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(fileUpload()); // configure fileupload

app.get('/', function (req, res) {
  res.render('index', { user: req.session.username });
});

app.get('/dashboard', getDashboard);
app.get('/search', searchUser);
app.get('/download/:image', downloadImage);
app.get('/profile', getProfile);
app.get('/myImages', getImages);
app.get('/logout', logout);

app.post('/register', register);
app.post('/login', login);
app.post('/send/:username', sendImage);
app.post('/upload', uploadImage);
app.post('/profile', updateUser);

app.listen(3000);


