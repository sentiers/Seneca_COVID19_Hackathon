const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const dataService = require("./data-service.js");
var path = require("path");

///////////////////////////////////////////////////

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

///////////////////////////////////////////////////

app.use(express.static("./public/"));
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////////////////

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    }
}));

app.set('view engine', '.hbs');

///////////////////////////////////////////////////

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

///////////////////////////////////////////////////

app.get("/", function (req, res) {
    res.render('home');
});

app.get("/heatMap", function (req, res) {
    res.sendFile(path.join(__dirname, "/StrollSafe.html"));
});

app.get("/data", function (req, res) {
    dataService.getData().then((data) => {
        res.render('data', { covidCase: data });
    }).catch((err) => {
        res.render('data', { message: err });
    });
});

///////////////////////////////////////////////////

app.use(function (req, res) {
    res.status(404).render('error');
});

dataService.initialize().then(function () {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
})