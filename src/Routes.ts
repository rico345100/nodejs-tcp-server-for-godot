import GodotSocket from './GodotSocket';
import NetworkObjectManager from './Managers/NetworkObjectManager';
import SocketManager from './Managers/SocketManager';
import Vector3 from './GodotClasses/Vector3';
import GodotInstance from './GodotClasses/GodotInstance';
import ByteReader from './NetworkUtils/ByteReader';
import ByteWriter from './NetworkUtils/ByteWriter';
import MessageType from './MessageType';
import InstanceType from './InstanceType';
import { byteSize, intSize, vector3Size } from './typeSize';

/**
 * Send ClientID to client
 * @param {GodotSocket} socket
 */
export function sendClientID(socket: GodotSocket) {
	const sendingBytes: Buffer = Buffer.allocUnsafe(byteSize + intSize);
	const byteWriter: ByteWriter = new ByteWriter(sendingBytes);
	byteWriter.writeByte(MessageType.AssignID);
	byteWriter.writeInt(socket.clientID);

	socket.write(sendingBytes);
}

/**
 * Synchronize Network objects 
 * @param {GodotSocket} socket 
 */
export function syncNetworkObjects(socket: GodotSocket) {
	const networkObjects = NetworkObjectManager.getObjects();
	const totalCount = networkObjects.length;
	let sendingBytes: Buffer;

	if (socket.syncCount >= totalCount) {
		sendingBytes = Buffer.allocUnsafe(byteSize);
		sendingBytes[0] = MessageType.ServerRequestObjectSyncComplete;
		console.log('Nothing to Sync. Complete Instantiation...');
	}
	else {
		const gInstance = networkObjects[socket.syncCount];

		// Skip own objects
		if (gInstance.clientID === socket.clientID) {
			socket.syncCount++;
			return syncNetworkObjects(socket);
		}

		sendingBytes = Buffer.allocUnsafe((byteSize * 2) + (intSize * 2) + vector3Size + vector3Size);

		const byteWriter: ByteWriter = new ByteWriter(sendingBytes);
		byteWriter.writeByte(MessageType.ServerRequestObjectSync);
		byteWriter.writeInt(gInstance.clientID);
		byteWriter.writeInt(gInstance.localID);
		byteWriter.writeByte(gInstance.instanceType);
		byteWriter.writeVector3(gInstance.position);

		socket.syncCount++;
		console.log(`Send Request to Instantiate Object CID ${gInstance.clientID} LID ${gInstance.localID}`);
		console.log(`Sync Progress ${socket.syncCount} / ${totalCount}`)		
	}

	socket.write(sendingBytes);
}

/**
 * Destroy all NetworkObject belongs to specified socket
 * @param {GodotSocket} socket 
 */
export function destoryNetworkObjects(socket: GodotSocket) {
	const { clientID } = socket;
	const buffer: Buffer = Buffer.allocUnsafe(byteSize + intSize);
	const byteWriter: ByteWriter = new ByteWriter(buffer);
	byteWriter.writeByte(MessageType.DestroyNetworkObjects);
	byteWriter.writeInt(clientID);

	SocketManager.broadcast(buffer, socket);

	// Remove from server
	NetworkObjectManager.removeObjectByClientID(socket.clientID);
}

/**
 * Parse Instantiate
 * @param {GodotSocket} socket
 * @param {Buffer} data 
 */
export function parseInstantiate(socket: GodotSocket, data: Buffer) {
	const byteReader: ByteReader = new ByteReader(data);
	const messageType: MessageType = byteReader.readByte();
	const clientID: number = byteReader.readInt();
	const localID: number = byteReader.readInt();
	const instanceType: InstanceType = byteReader.readByte();
	const position: Vector3 = byteReader.readVector3();

	if (instanceType === InstanceType.Player) {
		console.log('Instantiating Player...');
	}

	const instance = new GodotInstance(instanceType, clientID, localID, position);
	console.log('Saving Instance...');
	console.log(instance);

	NetworkObjectManager.addObject(instance);
	SocketManager.broadcast(data, socket);
}

/**
 * Parse Sync Transform
 * @param {GodotSocket} socket 
 * @param {Buffer} data 
 */
export function parseSyncTransform(socket: GodotSocket, data: Buffer) {
	// Just uncomment above lines if you want to see the data between sockets
    // const byteReader = new ByteReader(data);
	// byteReader.readByte(); // Consume MessageType
	
    // const clientID = byteReader.readInt();
    // const localID = byteReader.readInt();
    // const position = byteReader.readVector3();
    // const positionStr = `Vector3 (x: ${position.x}, y: ${position.y}, z: ${position.z})`;
    // console.log(`Sync Transform\nClientID: ${clientID}\nLocalID: ${localID}\nPosition: ${positionStr}`);

    SocketManager.broadcast(data, socket);
}
