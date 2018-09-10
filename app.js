'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const app = express();
require('./config/express')(app);
// require('./server/auth/routes')(app);
// require('./server/lfs/routes')(app);

app.route('/api/opt/:gitPath/objects/batch')
.post((req, res) => {
    const { headers, body, params } = req;
    if (body.operation === 'upload') {
        res.json({
            transfer: 'basic',
            objects: _.map(body.objects, (obj) => ({
                oid: obj.oid,
                size: obj.size,
                authenticated: true,
                actions: {
                    upload: {
                        href: `https://${headers.host}/api/opt/${params.gitPath}/${obj.oid}`,
                        header: {
                            Authorization: 'AUTH'
                        }
                    }
                }
            }))
        });
    } else if (body.operation === 'download') {
        res.json({
            transfer: 'basic',
            objects: _.map(body.objects, (obj) => ({
                oid: obj.oid,
                size: obj.size,
                authenticated: true,
                actions: {
                    download: {
                        href: `https://${headers.host}/api/opt/${params.gitPath}/${obj.oid}`,
                        header: {
                            Authorization: 'AUTH'
                        }
                    }
                }
            }))
        });
    } else {
        console.log(req.method, req.url, req.headers, req.query, req.body);
        res.sendStatus(404);
    }
});

app.route('/api/opt/:gitPath/:oid')
.put((req, res) => {
    const { params } = req;
    let dname = `data/${params.gitPath}`;
    let ps = new Promise((resolve, reject) => {
        fs.stat(dname, (err, stat) => {
            if (err.code === 'ENOENT') {
                fs.mkdir(dname, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            } else {
                resolve();
            }
        });
    });
    ps
    .then(() => new Promise((resolve, reject) => {
        let ws = fs.createWriteStream(`${dname}/${params.oid}`);
        ws.on('error', (err) => reject(err));
        req
        .on('data', (chunk) => ws.write(chunk))
        .on('end', () => ws.end(() => resolve()));
    }))
    .then(() => {
        res.sendStatus(200);
    })
    .catch((err) => {
        console.error(err);
        res.sendStatus(500);
    });
})
.get((req, res) => {
    const { params } = req;
    let fname = `data/${params.gitPath}/${params.oid}`;
    fs.stat(fname, (err, stat) => {
        if (err) {
            res.sendStatus(410);
        } else {
            res.sendFile(path.join(__dirname, fname));
        }
    });
});

app.route('/*')
.all((req, res) => {
    console.log(req.method, req.url, req.headers, req.query, req.body);
    res.sendStatus(404);
});

https.createServer({
        key: fs.readFileSync('./config/key.pem'),
        cert: fs.readFileSync('./config/cert.pem')
}, app).listen(9528);

