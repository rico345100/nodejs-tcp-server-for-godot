import GodotInstance from '../GodotClasses/GodotInstance';

class NetworkObjectManager {
	static networkObjects: GodotInstance[] = [];

	static getObjects(): GodotInstance[] {
		return this.networkObjects;
	}

	static addObject(instance: GodotInstance) {
		this.networkObjects.push(instance);
	}
	
	static removeObject(instance: GodotInstance) {
		this.networkObjects.splice(this.networkObjects.indexOf(instance), 1);
	}

	static removeObjectByClientID(clientID: number) {
		const newList: GodotInstance[] = [];

		for(let i = 0; i < this.networkObjects.length; i++) {
			const networkObject = this.networkObjects[i];

			if(networkObject.clientID !== clientID) {
				newList.push(networkObject);
			}
		}

		this.networkObjects = newList;
	}
}

export default NetworkObjectManager;
