import GodotSocket from '../GodotSocket';

class SocketManager {
	static sockets: GodotSocket[] = [];
	
	/**
	 * Get Sockets
	 * @return {net.GodotSocket[]}
	 */
	static getSockets() {
		return this.sockets;
	}

	/**
	 * Add Socket
	 * @param {net.GodotSocket} socket 
	 */
	static addSocket(socket: GodotSocket) {
		this.sockets.push(socket);
	}

	/**
	 * Remove Socket
	 * @param {net.GodotSocket} socket 
	 */
	static removeSocket(socket: GodotSocket) {
		this.sockets.splice(this.sockets.indexOf(socket), 1);
	}

	/**
	 * Broadcast message to all clients except sender
	 * @param {string|Buffer} message 
	 * @param {net.GodotSocket} senderSocket 
	 */
	static broadcast(message: Buffer, senderSocket: GodotSocket) {
		this.sockets.forEach(function(socket) {
			if(socket == senderSocket) return;
			socket.write(message);
		});
	}
}

export default SocketManager;
