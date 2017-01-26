const s = require('./structures');
const cluster = require('cluster');
const os = require('os');

const identity=i=>i;
class Matrix {
	constructor (identifier=identity) {
		this.size = 0;
		this.storage = [];
		this.swapSpace = [];
		this.identifier= identifier;
	}
	set (x, y, value) {
		this.storage[y] = this.storage[y] || [];
		if (this.storage[y][x] === undefined) this.size++;
		this.storage[y][x]  = value;
		this.swapSpace[x] = this.swapSpace[x] || [];
		this.swapSpace[x][y] = value;
	}
	clone () {
		let clone = new Matrix(this.identifier);
		clone.size = this.size;
		clone.storage = this.storage;
		clone.swapSpace = this.swapSpace;
	}
	get (x, y) {
		return this.storage[y] ? this.storage[y][x] : undefined;
	}
	row (y) {
		return this.storage[y] || [];
	}
	setRow (y, arr) {
		arr.forEach((value, x) => {
			this.set(x, y, value);
		});
	}
	setCol (x, arr) {
		return this.setColumn(x, arr);
	}
	setColumn (x, arr) {
		arr.forEach((value, y) => {
			this.set(x, y, value);
		});
	}
	column (x) {
		return this.swapSpace[x] || [];
	}
	forEach (cb) {
		this.storage.forEach((row, y) => {
			row.forEach((value, x) => {
				cb(value, x, y);
			});
		});
	}
	forEachRow (cb) {
		this.storage.forEach((row, y) => {
			cb(row, y);
		});
	}
	forEachCol (cb) {
		this.swapSpace.forEach((col, x) => {
			cb(col, x);
		});
	}
	map (cb) {
		let clone = this.clone();
		clone.swapSpace.map((column, x) => {
			return this.column.map((value, y) => {
				return cb(value, x, y);
			});
		});
		clone.storage.map((row, y) => {
			return this.row.map((value, x) => {
				return cb(value, x, y);
			});
		});
		return clone;
	}
	pow(n) {
		if (pow > 0) {
			let current = this.clone();
			for (let i = 0; i < n; i++) {
				current = current.multiply(this.clone());
			}
			return current;
		}

	}
	transpose() {
		let result = new Matrix(this.identifier);
		this.forEach((value, x, y) => {
			result.set(y,x, value);
		});
		return result;
	}
	add (m) {
		let result = new Matrix(this.identifier);
		this.forEach((value, x, y) => {
			result.set(x,y, value + (m.get(x, y) || 0));
		});
		m.forEach((value, x, y) => {	
			result.set(x,y, value + (this.get(x,y) || 0));
		});
		return result;
	}
	multiply (m) {
		if (typeof m === 'number') {
			let result = this.clone();
			result.map(x => x * m);
		} else if (m.constructor !== Matrix) {
			throw new Error('TypeError: must be a matrix or a number');
		} else {
			let result = new Matrix(this.identifier);
			this.forEachRow((row, y) => {
				let newRow = [];
				m.forEachCol((col, x) => {
					let v = 0;
					row.forEach((e, i) => v += e * col[i]);
					newRow.push(v);
				});
				result.setRow(y, newRow);
			});
			return result;
		}
	}
	clusterMult (m, cb) {
		if (m.constructor !== Matrix) {
			throw new Error('TypeError: matrix multiplication must be of type matrix.');
		}
		if (cluster.isMaster) {
			let result = new Matrix(this.identifier);
			let workers = [];
			let incoming = new s.Queue();
			this.forEachRow((row, y) => {
				incoming.enqueue({row, y});
			});
			//worker.send master --> worker
			//process.on('message') worker --> master;
			const constructWorker = (i) => {
				let worker = cluster.fork();
				worker.on('online', ()=>{
					let r = incoming.dequeue();
					let row = r.row;
					let newRow = [];
					m.forEachCol((col, x) => {
						let v = 0;
						row.forEach((e, i) => v += e * col[i]);
						newRow.push(v);
					});
					result.setRow(r.y, newRow);
					worker.kill(0);
				});
				worker.on('exit', ()=>{
					if (incoming.length > 0) {
						workers[i] = constructWorker(i);
					} else {
						workers.forEach(w => w.kill(0));
						cb(result);
					}
				});
				return worker;
			}
			for (let i = 0; i < Math.min(incoming.length, os.cpus().length); i ++) {
				let w = constructWorker(i);
				workers.push(w);
			}
		};
	}
	toString () {
		return this.storage.map(row => row.toString()).join('\n');
	}
}

module.exports = Matrix;