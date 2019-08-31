let express = require("express");
let app = new express();
let router = require("./backend/routes/index");
let body = require("body-parser");
let path = require("path");

app.set("PORT", 80);

app.listen(app.get("PORT"), ()=>{
    console.log("Server Got Activated On Port Number 80");
});

app.use((req, res, next)=>{
    console.log(req.method, req.url);
    next();
})

app.use(express.static(path.join(__dirname, "app")));

app.use(body.urlencoded({extended:false}));
app.use(body.json());

app.use(router);