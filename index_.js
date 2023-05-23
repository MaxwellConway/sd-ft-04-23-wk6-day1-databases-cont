require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3002;
const connectionCreds = require("./databaseCreds");
console.log(connectionCreds);

app.use(express.json());

app.post("/create_user", (req, res) => {
  //   const { email, username, password } = req.body;
  //   syntatic sugar
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

app.put("/update_username", (req, res) => {
  //   const { email, username, password } = req.body;
  //   syntatic sugar
  const username = req.body.username;
  const newUsername = req.body.newUsername;

  connectionCreds.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
      return;
    }

    const sqlQuery = `UPDATE users SET username = $2 WHERE username = $1;`;
    const values = [username, newUsername];

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

app.put("/update_email", (req, res) => {
  //   const { email, username, password } = req.body;
  //   syntatic sugar
  const email = req.body.email;
  const newEmail = req.body.newEmail;

  connectionCreds.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
      return;
    }

    const sqlQuery = `UPDATE users SET email = $2 WHERE email = $1;`;
    const values = [email, newEmail];

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

app.put("/delete_user", (req, res) => {
  //   const { email, username, password } = req.body;
  //   syntatic sugar
  const email = req.body.email;

  connectionCreds.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
      return;
    }

    const sqlQuery = `DELETE FROM users WHERE email = $1;`;
    const values = [email];

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

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
