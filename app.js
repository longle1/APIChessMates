var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//thư viện cors
var cors = require('cors');
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

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const pathFolders = require("./pathFolders");
global.__base = __dirname + '/';
global.__path_app = __base + pathFolders.folder_app + '/';
global.__path_configs = __path_app + pathFolders.folder_configs + '/';
global.__path_routes = __path_app + pathFolders.folder_routes + '/';
global.__path_schemas = __path_app + pathFolders.folder_schemas + '/';
global.__path_middlewares = __path_app + pathFolders.folder_middlewares + '/';
global.__path_models = __path_app + pathFolders.folder_models + '/';
global.__path_validates = __path_app + pathFolders.folder_validates + '/';
const config = require(__path_configs + "config");
//Dùng để kết nối đến databasea
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(`mongodb+srv://${config.usernameMongoose}:${config.passwordMongoose}@cluster0.pffoqjv.mongodb.net/test`);
    console.log("Connect Success".blue);
}

app.use('/api/v1', require(__path_routes));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
module.exports = app;
