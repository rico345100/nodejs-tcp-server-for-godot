import { Socket } from 'net';

interface GodotSocket extends Socket {
	name: string;
	clientID: number;
	syncCount: number;
}

export default GodotSocket;
