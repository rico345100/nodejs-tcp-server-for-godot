import * as net from 'net';
import GodotSocket from './GodotSocket';
import SocketManager from './Managers/SocketManager';
import ByteReader from './NetworkUtils/ByteReader';
import MessageType from './MessageType';
import {
	sendClientID,
	syncNetworkObjects,
	destoryNetworkObjects,
	parseInstantiate,
	parseSyncTransform
} from './Routes';

// This value will use for distinguish client for each transmission
let socketCounter: number = 0;

const server: net.Server = net.createServer(function (socket: GodotSocket) {
	socket.name = socket.remoteAddress + ':' + socket.remotePort;
	socket.clientID = socketCounter++;
	socket.syncCount = 0; // Check for Sync Network Object Instantiation

	SocketManager.addSocket(socket);
	console.log(`New Client Connected: ${socket.name}`);
	console.log(`Assign ID: ${socket.clientID}`);

	// Send ClientID to client
	sendClientID(socket);

	socket.on('data', function(data: Buffer) {
		const byteReader: ByteReader = new ByteReader(data);
		const messageType: MessageType = byteReader.readByte();
		const clientID: number = byteReader.readInt();

		if (messageType !== MessageType.SyncTransform) {
			console.log(`Receive Message\nMessageType: ${messageType}\nClientID: ${clientID}`);
		}

		// Dispatch message
		switch (messageType) {
			case MessageType.ClientRequestObjectSync:
				syncNetworkObjects(socket);
				break;
			case MessageType.Instantiate:
				parseInstantiate(socket, data);
				break;
			case MessageType.SyncTransform:
				parseSyncTransform(socket, data);
				break;
			default:
				throw new Error(`Invalid Message Type ${messageType.toString()}`);
		}
	});

	socket.on('end', function() {
		console.log(`Client ${socket.clientID} Left.`);
		destoryNetworkObjects(socket);
		SocketManager.removeSocket(socket);
	});

	socket.on('error', function(error: Error) {
		console.log('Error', error);

		if (error['code'] === 'ECONNRESET') {
			socket.emit('end');
		}
	});
});

server.listen(1337, () => console.log('Node.js TCP Server for Godot Multiplayer listening on port 1337...'));
