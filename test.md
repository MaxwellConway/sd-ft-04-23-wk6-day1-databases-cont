require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3002;
const connectionCreds = require("./databasecreds");

app.use(express.json());
//CREATE
app.post("/create_user", (req, res) => {
// const { email, username, password } = req.body;
// syntatic sugar
const email = req.body.email;
const username = req.body.username;
const password = req.body.password;

connectionCreds.connect((err, client, release) => {
if (err) {
release();
console.error("Error connecting to the database: ", err);
res.status(500).send("Internal service error");
return;
}

    const sqlQuery = `INSERT INTO users (username,email,password) VALUES ($1,$2,$3);`;
    const values = [username, email, password];

    client.query(sqlQuery, values, (err, result) => {
      release();
      if (err) {
        console.error("Error in executing the query: ", err);
        res.status(500).send("Internal server error");
        return;
      }
      res.send(result);
    });

});
});
//READ
app.get("/get_all_users", (req, res) => {
connectionCreds.connect((err, client, release) => {
if (err) {
release();
console.error("Error Connecting to the Database: ", err);
res.status(500).send("Internal Service Error");
return;
}
client.query(`SELECT * FROM users;`, (err, result) => {
release();
if (err) {
console.error("Error in Executing the Query: ", err);
res.status(500).send("Internal Server Error");
return;
}
res.send(result.rows);
});
});
});
//UPDATE
//DESTROY
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
