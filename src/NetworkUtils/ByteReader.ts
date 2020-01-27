import CursorBehaviour from './CursorBehaviour';
import Vector3 from '../GodotClasses/Vector3';
import { floatSize, intSize } from '../typeSize';

class ByteReader extends CursorBehaviour {
    readInt(): number {
        const value = this.dataSource.readInt32LE(this.cursor);
        this.cursor += intSize;

        return value;
    }

    readVector3(): Vector3 {
        const x = this.dataSource.readFloatLE(this.cursor + (floatSize * 0));
        const y = this.dataSource.readFloatLE(this.cursor + (floatSize * 1));
        const z = this.dataSource.readFloatLE(this.cursor + (floatSize * 2));
        this.cursor += floatSize * 3;
        
        return new Vector3(x, y, z);
    }

    readByte(): number {
        const value = this.dataSource[this.cursor];
        this.cursor++;

        return value;
    }
}

export default ByteReader;
