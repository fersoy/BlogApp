var express = require("express");
app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/BlogApp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://s3.amazonaws.com/uploads.hotmart.com/blog/2017/09/criar-um-blog-2-670x419.png",
//     body: " This is a Test blog!"
// });

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs });
        }
    });

});
app.get("/blogs/new", function (req, res) {
    res.render("new");
})

app.post("/blogs", function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new")
        } else {
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundblog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundblog });
        }
    })
});

app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundblog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundblog });
        }
    });
});

app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, ubdatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
})
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err, ubdatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
})

app.listen(3000, function () {
    console.log("app starts here!")
});