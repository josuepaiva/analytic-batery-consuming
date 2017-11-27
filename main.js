var app = require("express")();
 var express = require("express");
 
 // Na pasta public é onde colocaremos o arquivo Chart.js
 app.use(express.static(__dirname + '/public'));
 
 var http = require("http").Server(app);
 
 // Socket.io é um biblioteca que permite estabelecer concexão cliente servidor em tempo ral.
 var io = require("socket.io")(http);
  
var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
var port = new SerialPort('COM6', {
  baudRate: 9600,
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on("data", function(data){

	var results = data.split(",");
	console.log(results[3]);
	console.log(data);
	io.emit("dadosArduino", { // Emite um evento e o objeto data recebe valor.
 		valor: data
 	});
});
/**
 * mySerial.on - Verifiica conexão com o arduino e informa no console.
 */
 port.on("open", function(){
 	console.log("Arduino conexão estabelecida!");
 });
 
/**
 * io.on - Recebe conexão de cliente.
 */
 io.on("connection", function(socket){
 	console.log("Usuário está conectádo!");
 });
 
/**
 * http.linten -  
 */
 http.listen("3000", function(){
 	console.log("Servidor on-line em http://localhost:3000 - para sair Ctrl+C.");
 })