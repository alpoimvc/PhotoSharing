module.exports = {
  register: (req, res) => {
    console.log("entrou");
    let name = req.body.name;
    let age = req.body.age;

    let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

    // send the player's details to the database
    let query = "INSERT INTO users (name, age) VALUES ('" +
        name + "', '" + age + "')";
    con.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.redirect('/');
    });
  }
};
