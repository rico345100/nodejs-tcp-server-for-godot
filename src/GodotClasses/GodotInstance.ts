import InstanceType from '../InstanceType';
import Vector3 from './Vector3';

class GodotInstance {
	instanceType: InstanceType;
	clientID: number;
	localID: number;
	position: Vector3;
	rotation: Vector3;

    constructor(instanceType, clientID, localID, position, rotation) {
        this.instanceType = instanceType;
        this.clientID = clientID;
        this.localID = localID;
        this.position = position;
        this.rotation = rotation;
    }
}

export default GodotInstance;
