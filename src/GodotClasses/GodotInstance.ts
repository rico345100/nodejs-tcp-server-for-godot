import InstanceType from '../InstanceType';
import Vector3 from './Vector3';

class GodotInstance {
	instanceType: InstanceType;
	clientID: number;
	localID: number;
	position: Vector3;

    constructor(instanceType, clientID, localID, position) {
        this.instanceType = instanceType;
        this.clientID = clientID;
        this.localID = localID;
        this.position = position;
    }
}

export default GodotInstance;
