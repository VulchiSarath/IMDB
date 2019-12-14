/*jslint indent: 2 */
'use strict';

/**
*
*  This file is the main of the node server.  It uses the cluster module to spin up one process per core, if configured to run in cluster mode.
*  It calls app.js, which is the code that would start the hapi server.
*
**/
const appLoader = require('./app'),
  cluster = require('cluster');

if (cluster.isMaster) {
  // Fork workers.
  let i,
    numProccesses = process.env.NODE_ENV === 'production' ? require('os').cpus().length : 1;

  /*jslint plusplus: true*/
  if (numProccesses > 1) {
    for (i = 0; i < numProccesses; i++) {
      cluster.fork();
    }

    /*jslint unparam: true*/
    cluster.on('exit', function () {
      //console.log('worker ' + worker.process.pid + ' died');
      //console.log('spawning a new process if one crashed...');
      //cluster.fork();
    });
  } else {
    (new appLoader()).bootUpApp();
  }
  /*jslint unparam: false*/
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  (new appLoader()).bootUpApp();
}
