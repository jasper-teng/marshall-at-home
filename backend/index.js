var express = require("express");
var app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

//test api
app.get("/test", (req, res, next) => {
    res.json(["Tony","love","big","butts"]);
});