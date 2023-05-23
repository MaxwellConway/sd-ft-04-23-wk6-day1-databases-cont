require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.DATABASE_PASSWORD,
  port: 5432, // Update with your PostgreSQL port number
});

app.use(express.json());

// Your routes will go here...
app.get("/recipes", (req, res) => {
  pool.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
    }

    const sqlQuery = `SELECT * FROM recipes;`;

    client.query(sqlQuery, (err, result) => {
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

app.post("/new_recipe", (req, res) => {
  const { newRecipe } = req.body;
  //const newRecipe = req.body.newRecipe;

  pool.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
    }

    const sqlQuery = `INSERT INTO recipes (recipe_name) VALUES ($1);`;
    const values = [newRecipe];

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

app.get("/get_recipe/:id", (req, res) => {
  const { id } = req.params;
  pool.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
    }

    const sqlQuery = `SELECT * FROM recipes WHERE id=$1;`;
    const values = [id];

    client.query(sqlQuery, values, (err, result) => {
      release();
      if (err) {
        console.error("Error in executing the query: ", err);
        res.status(500).send("Internal server error");
        return;
      }
      res.send(result.rows);
    });
  });
});

app.put("/update_recipe/:id", (req, res) => {
  const { id } = req.params;
  const { recipeUpdate } = req.body;
  pool.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
    }

    const sqlQuery = `UPDATE recipes SET recipe_name=$2 WHERE id=$1;`;
    const values = [id, recipeUpdate];

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

app.delete("/delete_recipe/:id", (req, res) => {
  const { id } = req.params;
  const { recipeUpdate } = req.body;
  pool.connect((err, client, release) => {
    if (err) {
      release();
      console.error("Error connecting to the database: ", err);
      res.status(500).send("Internal service error");
    }

    const sqlQuery = `UPDATE recipes SET recipe_name=$2 WHERE id=$1;`;
    const values = [id, recipeUpdate];

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

// Start the server
const port = 3000; // Update with your desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
