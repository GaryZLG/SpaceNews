const express = require("express");
const ejs = require("ejs");
const path = require("path");
const router = require("./router");

const app = express();

// Set the corresponding directory of the view
app.set("views", path.join(__dirname, "./views")); 

 // Set the default template engine
app.set("view engine", "ejs");

// Define the template engine
app.engine("ejs", ejs.__express);

app.use(express.static(path.join(__dirname, "./public")));

app.use(express.urlencoded({ extends: false }));

app.use(router);

module.exports = app;
