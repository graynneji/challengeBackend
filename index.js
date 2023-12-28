const express = require("express");
const app = express();
const logger = require("./logger/logger");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

//Cors implementation
app.use(cors());

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger
app.use(logger);

//Start server
app.listen(PORT);
app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Connected Successfully</h1>");
});

//APIs
//Access sectors
app.use("/sectors", require("./API/sectors"));

//Users
app.use("/users", require("./API/getusers"));

//Select
app.use("/userselection", require("./API/userSelection"));

//register
app.use("/register", require("./API/postuser"));

//Login
app.use("/login", require("./API/loginuser"));

//Logout
app.use("/logout", require("./API/logoutuser"));
