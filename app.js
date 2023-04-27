var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//thư viện cors
var cors = require('cors');
//thư viện express-rate-limit
const rateLimit = require('express-rate-limit');
//thư viện xss-clearn
var xss = require('xss-clean')
//thư viện helmet
const helmet = require("helmet");
//thư viện express-validator
var expressValidator = require('express-validator');
//thư viện mongoose
const mongoose = require("mongoose");
//thư viện màu chữ
var colors = require('colors');
//thêm error handle vào
var app = express();
app.use(express.json());
app.use(expressValidator());
app.use(helmet());
app.use(xss());
app.use(cors());
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 3
});

const pathFolders = require("./pathFolders");
const errorHandler = require('./app/middlewares/error');
global.__base = __dirname + '/';
global.__path_app = __base + pathFolders.folder_app + '/';
global.__path_configs = __path_app + pathFolders.folder_configs + '/';
global.__path_routes = __path_app + pathFolders.folder_routes + '/';
global.__path_schemas = __path_app + pathFolders.folder_schemas + '/';
global.__path_middlewares = __path_app + pathFolders.folder_middlewares + '/';
global.__path_models = __path_app + pathFolders.folder_models + '/';
global.__path_validates = __path_app + pathFolders.folder_validates + '/';
//Dùng để kết nối đến databasea
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log("Connect Success".blue);
}
const notifyConfig = require(__path_configs + "notify");
app.use('/api/v1/auth/login', limiter, (req, res) => {
    res.status(429).json({
        success: false,
        message: notifyConfig.NOTITY_LOGIN
    });

});
app.use('/api/v1', require(__path_routes));


app.use(errorHandler);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
module.exports = app;
