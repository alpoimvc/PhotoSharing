const fs = require('fs');

module.exports = {
    getImages: (req, res) => {
        let username = req.session.username
        if(req.session.username){
            con.query('SELECT * FROM uploads WHERE owner = ? ORDER BY id DESC', [username], function(err, result, fields) {
                if (err) {
                    res.redirect('/');
                }
                res.render('myImages.ejs', {
                    title: "Welcome to PicShare | View Users",
                    files: result
                });
            });
        }else{
            res.redirect('/');
        }
    },
};