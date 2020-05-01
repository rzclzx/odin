var express = require("express");
var app = express();
app.listen(80);
app.use(express.static(__dirname + "/dist"));


