#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var http = require('http');
var iconv = require('iconv-lite');
var franc = require('franc');

var argv;

if (process.argv[2]) {
    argv = process.argv[2];
} else {
    console.log('Uso: ppn <termo>');
    process.exit(0);
}

var options = {
    host: 'npmsearch.com',
    path: '/query?q=' + argv + '&fields=description,version,name'
};

var callback = function (response) {
    if (response.statusCode !== 200) {
        console.error('Serviço indisponível.');
        process.exit(1);
    }

    response.pipe(iconv.decodeStream('utf8')).collect(function (error, body) {
        if (error) {
            console.error('Erro!');
            process.exit(1);
        }

        body = JSON.parse(body);

        var results = body.results;

        results.forEach(function (i) {
            var description = i.description[0];

            if (franc(description) === 'por') {
                console.log(chalk.cyan(i.name[0]));
                console.log(chalk.gray(description));
                console.log('');
            }
        });
    });
};

http.request(options, callback).on('error', function () {
    console.error('Serviço indisponível.');
    process.exit(1);
}).end();