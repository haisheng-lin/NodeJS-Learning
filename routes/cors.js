const express = require('express');
const cors = require('cors');
const app = express();

// 白名单
const whiteList = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1) { // if the header contains the domain in whitelist
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);