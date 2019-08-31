let express = require("express");
let Router = new express.Router();
let controls = require("../controllers/index");

Router
    .route("/signRequest")
    .get(controls.signRequest);

module.exports = Router;