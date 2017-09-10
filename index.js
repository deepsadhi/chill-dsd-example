var express = require('express');
var app = express();
var path = require('path');

const CHILL_DSD_PORT = 34455;

const SOCKET_CONNECTION = 'connection';
const SOCKET_MONITOR_NS = '/monitor';
const SOCKET_FRONTEND_NS = '/frontend';
const SOCKET_REST_API_NS = '/rest-api';
const SOCKET_DISCONNECT = 'disconnect';

const SERVICE_STOP = 'service-stop';
const SERVICE_START = 'service-start';
const SERVICE_STATUS_CHANGED = 'service-status-changed';

var io = require('socket.io').listen(app.listen(34455));

var monitorSocket = io.of(SOCKET_MONITOR_NS);
var restApiSocket = io.of(SOCKET_REST_API_NS);
var frontendSocket = io.of(SOCKET_FRONTEND_NS);

frontendSocket.on(SOCKET_CONNECTION, function (socket) {
  console.log('FRONTEND-SOCKET connected');

  socket.on(SERVICE_START, function(payload){
    // var payload = {
    //   id: 1,
    //   maxRetry: 5,
    //   method: 'OPTIONS',
    //   name: 'Localhost',
    //   minInterval: 1000,
    //   maxInterval: 10000,
    //   downStatus: '^(5..|4..)$',
    //   url: 'http://localhost:3000'
    // }
    console.log('FRONTEND-SOCKET service start');
    restApiSocket.emit(SERVICE_START, payload);
  });

  socket.on(SERVICE_STOP, function(payload){
    // var payload = { id: 1 };
    console.log('FRONTEND-SOCKET service stop');
    restApiSocket.emit(SERVICE_STOP, payload);
  });

  socket.on(SOCKET_DISCONNECT, function (socket) {
    console.log('FRONTEND-SOCKET disconnected');
  });
});


restApiSocket.on(SOCKET_CONNECTION, function (socket) {
  console.log('REST-API-SOCKET connected');

  socket.on(SOCKET_DISCONNECT, function (socket) {
    console.log('REST-API-SOCKET disconnected');
  });
});

monitorSocket.on(SOCKET_CONNECTION, function(socket) {
  console.log('MONITOR-SOCKET connected');

  socket.on(SERVICE_STATUS_CHANGED, function(payload){
    console.log('service status changed', payload);
    frontendSocket.emit(SERVICE_STATUS_CHANGED, payload);
  });

  socket.on(SOCKET_DISCONNECT, function (socket) {
    console.log('MONITOR-SOCKET disconnected');
  });
});


console.log('Server listening at port ' + CHILL_DSD_PORT);
