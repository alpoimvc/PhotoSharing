module.exports = {
    getDashboard: (req, res) => {
        let query = "SELECT * FROM `accounts` ORDER BY id ASC"; // query database to get all the players

        // execute query
        con.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            //res.render('./public/dashboard.ejs', {
            res.render('dashboard.ejs', {
                title: "Welcome to PicShare | View Users"
                ,players: result
            });
        });
    },
};