const bcrypt = require('bcrypt-nodejs');

module.exports = {
  login: (request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
      con.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
        if (results.length > 0) {
          bcrypt.compare(password, results[0].password, function(err, res) {
            if(res == true){
              request.session.loggedin = true;
              request.session.username = username;
              response.redirect('/dashboard');
            }
            else {
              response.send('Incorrect Password!');
            }
            response.end();
          }); 
        } else {
          response.send('Username doesnt exist');
          response.end();
        }     
      });
    } else {
      response.send('Please enter Username and Password!');
      response.end();
    }
  },

  register: (request, response) => {
      var username = request.body.username;
      var password = request.body.password;
      var email = request.body.email;

      // Store hash in database
      bcrypt.hash(password, null, null, function(err, hash) {
          // send the player's details to the database
          let query = "INSERT INTO accounts (username, password, email) VALUES ('" +username + "', '" + hash + "', '" + email + "')";
          con.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return response.status(500).send(err);
            }
            response.redirect('/');
          });
      });
  },

  logout: (req, res) => {
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  },

};