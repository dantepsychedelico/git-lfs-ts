'use strict';

let compression = require('compression');
let morgan = require('morgan');
let fs = require('fs');
let bodyParser = require('body-parser');

module.exports = (app) => {
    // body parser for content-type with application/json or application/vnd.git-lfs+json
    app.use(bodyParser.json({
        type: ['application/json', 'application/vnd.git-lfs+json']
    }));
    // logger connection
    app.use(morgan('combined'));
    // compress response
    app.use(compression({
        level: 9
    }));
};
