const fs = require('fs');

module.exports = {
    getProfile: (req, res) => {
        let username = req.session.username
        if(req.session.username){
            con.query('SELECT * FROM accounts WHERE username = ?', [username], function(err, result, fields) {
                if (err) {
                    res.redirect('/');
                }
                res.render('profile.ejs', {
                    title: "Welcome to PicShare | View Users",
                    files: result
                });
            });
        }else{
            res.redirect('/');
        }
    },
    updateUser: (req, res) => {
        
        let username = req.session.username;
        let email = req.body.email;
        let password = req.body.password;

        let query = "UPDATE accounts set email= '" + email + "', password ='" + password + "' WHERE username = '" + username + "'";
        con.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/dashboard');
        });
    },
    
};