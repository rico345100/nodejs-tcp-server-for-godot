import CursorBehaviour from './CursorBehaviour';
import Vector3 from '../GodotClasses/Vector3';
import { floatSize, intSize } from '../typeSize';

class ByteWriter extends CursorBehaviour {	
	/**
     * Write Int32
     * @param {int} value 
     */
    writeInt(value: number) {
        this.dataSource.writeInt32LE(value, this.cursor);
        this.cursor += intSize;
    }

    /**
     * Write Vector3
     * @param {Vector3} value
     */
    writeVector3(value: Vector3) {
        this.dataSource.writeFloatLE(value.x, this.cursor + (floatSize * 0));
        this.dataSource.writeFloatLE(value.y, this.cursor + (floatSize * 1));
        this.dataSource.writeFloatLE(value.z, this.cursor + (floatSize * 2));
        this.cursor += floatSize * 3;
    }

    /**
     * Write Byte
     * @param {byte} value 
     */
    writeByte(value: number) {
        this.dataSource[this.cursor] = value;
        this.cursor++;
    }
}

export default ByteWriter;
