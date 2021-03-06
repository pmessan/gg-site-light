//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");


mongoose.connect(`mongodb+srv://admin:${process.env.PASSWD}@gg-cluster0.yuzpe.mongodb.net/websiteDB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


//create schemas

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    }
})

const PortfolioItem = mongoose.model("item", itemSchema)

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + "/public"));

app.use('/portfolio', express.static(__dirname + '/../externalFiles/Portfolio'));

app.set("view engine", "ejs")

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/t/:title", function (req, res) {
    // res.render("template");
    const req_title = req.params.title;

    //find the doc using the title
    PortfolioItem.findOne({ title: req_title }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            const description = doc.description;
            const folder = doc.folder;
            const files = fs.readdirSync(__dirname + "/../externalFiles/Portfolio" + folder);
            res.render("template", { title: req_title, description: description, folder: folder, files: files });
        }
    })


});

app.get("/portfolio", function (req, res) {
    res.render("portfolio");
});

app.listen(9000, function () {
    console.log("Listening on port 9000");
});
