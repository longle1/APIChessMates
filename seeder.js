const mongoose = require("mongoose");
const fs = require("fs");
var colors = require('colors');
//Dùng để kết nối đến databasea
mongoose.connect('mongodb://127.0.0.1:27017/test');
const usersSchemas = require(__path_schemas + 'users');

const users = JSON.parse(fs.readFileSync(`${__dirname}/app/data/users.json`, "utf8"));

const importData = async () => {
    try {
        await usersSchemas.create(users);
        console.log("Import thành công...".yellow);
        process.exit();
    }catch(err) {
        console.log("error: " + err);
    }
}

const deleteData = async () => {
    try {
        await usersSchemas.deleteMany({});
        console.log("Delete thành công...".yellow);
        process.exit();
    }catch(err) {
        console.log("error: " + err);
    }
}
if(process.argv[2] == '-i') {
    importData();
}else if(process.argv[2] == '-d') {
    deleteData();
}