const fs = require('fs');

module.exports = {
    getDashboard: (req, res) => {
        if(req.session.username){
            let query = "SELECT * FROM sharedfiles ORDER BY id ASC"; // query database to get all the players

            // execute query
            con.query(query, (err, result) => {
                if (err) {
                    res.redirect('/');
                }
                //res.render('./public/dashboard.ejs', {
                res.render('dashboard.ejs', {
                    title: "Welcome to PicShare | View Users"
                    ,files: result
                });
            });
        }else{
            res.redirect('/');
        }
    },
    sendImage: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }
        let receiver = req.params.username;
        let sender = req.session.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = req.files.image.name;
        //image_name = req.files.image.name + '.' + fileExtension;

        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${uploadedFile.name}`, (err ) => {
                if (err) {
                    return res.status(500).send(err);
                }
                // send the player's details to the database
                let query = "INSERT INTO sharedfiles (sender, receiver, image) VALUES ('" +
                    sender + "', '" + receiver + "', '" + image_name + "')";
                con.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/dashboard');
                });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('add-player.ejs', {
                message,
                title: "Welcome to PicShare"
            });
        }
    },
    uploadImage: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }
        let owner = req.session.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = req.files.image.name;
        //image_name = req.files.image.name + '.' + fileExtension;

        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/uploads/${uploadedFile.name}`, (err ) => {
                if (err) {
                    return res.status(500).send(err);
                }
                // send the player's details to the database
                let query = "INSERT INTO uploads (image, owner) VALUES ('" +
                    image_name + "', '" + owner + "')";
                con.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/dashboard');
                });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('index.ejs', {
                message,
                title: "Welcome to PicShare"
            });
        }
    },

    searchUser: (req, res) => {
      let query = 'SELECT username FROM accounts WHERE username like "%'+req.query.key+'%"';
      con.query(query, function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++)
          {
            data.push(rows[i].username);
          }
          res.end(JSON.stringify(data));
      });
    },

    downloadImage: (req, res) => {
      var file = './public/assets/img/'+req.params.image;
      res.download(file); // Set disposition and send it.
    },

};