abstract class CursorBehaviour {
	dataSource: Buffer;
	cursor: number;

	constructor(dataSource: Buffer, initOffset: number = 0) {
		this.dataSource = dataSource;
		this.cursor = initOffset;
	}

	resetCursor() {
		this.cursor = 0;
	}

	moveCursor(offset: number) {
		this.cursor = offset;
	}
}

export default CursorBehaviour;
