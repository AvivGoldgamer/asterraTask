const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {Pool} = require("pg");

const PORT = process.env.PORT || 3001;

const app = express();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// Creating pool instance
const pool = new Pool({
  host: "dbinstance.cjteigjyzuqh.us-east-2.rds.amazonaws.com",
  user: "AVIV_GOLDGAMER",
  password: "asterratask",
  database: "taskdb"
});

// Connecting to the db
try{
  pool.connect();

  // pool.query("CREATE TABLE users(ID int, FirstName varchar(255), LastName varchar(255), Address varchar(255), PhoneNumber varchar(255), UNIQUE (ID));")

  // pool.query("CREATE TABLE hobbies(UserID int, Hobby varchar(255));")

  console.log("Connected");

}catch(error) {
  console.log(error)
}

// Create User
app.post("/user",(req, res) => {
  let params = [req.body.id, req.body.firstName, req.body.lastName, req.body.address, req.body.phoneNumebr]
  pool.query("INSERT INTO users(id, firstname, lastname, address, phonenumber) VALUES($1, $2, $3, $4, $5);", params)
  .then(result => res.send("User Created Succefully"))
  .catch(err => res.send("ID Already Exists"))
})

// Get all users
app.get("/getUser", (req, res) => {
  console.log("asd")
  pool.query("Select * FROM users")
  .then(result => res.send(result.rows))
})

// Add hobby
app.post("/hobby", (req, res) => {
  let params = [req.body.userId, req.body.hobby]
  pool.query("INSERT INTO hobbies(userId, hobby) VALUES($1, $2);", params)
  .then(result => res.send("Added Hobby Successfully"))
  .catch(err => res.send(err.response))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});