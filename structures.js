const sorts = require('./sorts.js');

class NaiveLRUcache {
	constructor (size = 10) {
		this.size = size;
		this.storage = new Map();
	}
	get length () {
		return this.storage.size;
	}
	store (val) {
		let newStorage = new Map();
		this.storage.forEach((key, val) => {
			if (key < this.size) {
				newStorage.set(val, key + 1);
			}
		});
		newStorage.set(val, 0);
		this.storage = newStorage;
	}
	find (check) {
		this.storage.forEach((key, val) => {
			if (check(val)) {
				this.store(val);
				return val;
			}
		});
		return undefined;
	}
}

class LinkedList {
	constructor () {
		this.head = undefined;
		this.tail = undefined;
		this.length = 0;
	}
	append (value) {
		if (this.head === undefined) {
			this.head = {next: undefined, value: value};
			this.tail = this.head;
			this.length ++;
		} else {
			this.tail.next = {next: undefined, value: value};
			this.tail = this.tail.next;
			this.length ++;
		}
	}
	prepend (value) {
		if (this.head === undefined) {
			this.head = {next: undefined, value: value};
			this.tail = this.head;
			this.length ++;
		} else {
			this.head = {next: this.head, value: value};
			this.length ++;
		}
	}
	peek () {
		return this.head.value;
	}
	contains (value, comparator=equals) {
		let current = this.head;
		while(current !== undefined) {
			if (comparator(current.value, value)) {
				return true;
			}
			current = current.next;
		}
		return false;
	}
	remove (value, comparator=equals) {
		let current = this.head;
		if (current === undefined) {
			return undefined;
		}
		if (comparator(current.value, value)) {
			let old = current.value;
			if (current.next === undefined) {
				this.head = undefined;
				this.tail = undefined;
				return old;
			} else {
				this.head = current.next;
				return old;
			}
		}
		while (current.next !== undefined) {
			if (comparator(current.next.value, value)) {
				let old = current.next.value;
				if (current.next.next === undefined) {
					current.next = undefined;
					this.tail = current.next;
				} else {
					current.next = current.next.next;
				}
				return old;
			}
			current = current.next;
		}
		return undefined;
	}
	shift () {
		if (this.head !== undefined) {
			let val = this.head.value;
			if (this.head.next !== undefined) {
				this.head = this.head.next;
			} else {
				this.head = undefined;
				this.tail = undefined;
			}
			this.length --;
			return val;
		} else {
			return undefined;
		}
	}
	pop () {
		if (this.tail === undefined) {
			return undefined
		} else {
			let newTail = this.head;
			if (newTail.next === undefined) {
				let val = newTail.value;
				this.head = undefined;
				this.tail = undefined;
				return val;
			} else {
				while (newTail.next.next !== undefined) {
					newTail = newTail.next;
				}
				let val = this.tail.value;
				this.tail = newTail;
				this.tail.next = undefined;
				return val;
			}
		}
	}
}

const equals = (a,b) => {
	if (typeof a !== 'object' || a === null) {
		return a === b;
	} else {
		let partsEqual = true;
		for (let prop in a) {
			partsEqual = partsEqual === false ? false : equals(a[prop], b[prop]);
		}
		return partsEqual;
	}
}

class DoublyLinkedList {
	constructor () {
		this.head;
		this.tail;
		this.length = 0;
	}
	append (value) {
		if (this.head === undefined) {
			this.head = {next: undefined, prev: undefined, value: value};
			this.tail = this.head;
			this.length ++;
		} else {
			this.tail.next = {prev: this.tail, next: undefined, value};
			this.tail = this.tail.next;
			this.length ++;
		}
	}
	prepend (value) {
		if (this.head === undefined) {
			this.head = {next: undefined, prev: undefined, value};
			this.tail = this.head;
			this.length ++;
		} else {
			this.head.prev = {next: this.head, value, prev: undefined};
			this.head = this.head.prev;
			this.length ++;
		}
	}
	pop () {
		if (!(this.length > 0)) {
			return undefined;
		}
		let val = this.tail;
		this.tail = this.tail.prev;
		if (this.tail !== undefined) {
			this.tail.next = undefined;
		}
		this.length --;
		return val;
	}
	shift () {
		if (!(this.length > 0)) {
			return undefined;
		}
		let val = this.head;
		this.head = this.head.next;
		if (this.head !== undefined) {
			this.head.prev = undefined;
		}
		this.length --;
		return val;
	}
	contains (value, comparator=equals) {
		let current = this.head;
		if (current === undefined) {
			return false;
		}
		while (current !== undefined) {
			if (comparator(current.value, value)) {
				return true;
			}
			current = current.next;
		}
		return false;
	}
	find (value, comparator=equals) {
		let current = this.head;
		if (current === undefined) {
			return undefined;
		}
		while (current !== undefined) {
			if (comparator(current.value, value)) {
				return current;
			}
			current = current.next;
		}
		return undefined;
	}
	remove (value, comparator=equals) {
		let current = this.head;
		if (current === undefined) {
			return undefined;
		}
		while (current !== undefined) {
			if (comparator(current.value, value)) {
				let toRm = current;
				if (toRm === this.head) {
					return this.shift();
				} else if (toRm === this.tail) {
					return this.pop();
				}
				if (current.next) {
					current.next.prev = current.prev;
				}
				if (current.prev) {
					current.prev.next = current.next;
				}
				this.length --;
				return toRm;
			}
			current = current.next;
		}
		return undefined;
	}
}

class Cache {
	constructor () {
		this.storage = [];
	}
	clear () {
		let old = this.storage;
		this.storage = new this.storage.constructor;
		return old;
	}
}

class LRUcache extends Cache{
	constructor (limit = 10) {
		this.limit = limit;
		this.storage = new DoublyLinkedList();
	}
	get length () {
		return this.storage.length;
	}
	get newest () {
		return this.storage.tail.value;
	}
	get oldest () {
		return this.storage.head.value;
	}
	store (val) {
		if (this.storage.contains(val)) {
			let recentSearch = this.storage.remove(val);
			this.storage.append(val);
		} else {
			this.storage.append(val);
			while (this.length > this.limit) {
				this.storage.shift();
			}
		}
	}
	retrieve (val, comparator=equals) {
		if (typeof val === 'function') {
			comparator = val;
		}
		let found = this.storage.find(val, comparator);
		if (found !== undefined) {
			let recent = this.storage.remove(val, comparator);
			this.storage.append(recent.value);
		}
		return found === undefined ? found : found.value;
	}
}

class MRUcache {
	constructor (limit = 10) {
		this.limit = limit;
		this.storage = new DoublyLinkedList();
	}
	get length () {
		return this.storage.length;
	}
	get newest () {
		return this.storage.tail.value;
	}
	get oldest () {
		return this.storage.head.value;
	}
	store (val) {
		if (this.storage.contains(val)) {
			let recentSearch = this.storage.remove(val);
			this.storage.append(val);
		} else {
			while (this.length > this.limit-1) {
				this.storage.pop();
			}
			this.storage.append(val);
		}
	}
	retrieve (val, comparator=equals) {
		if (typeof val === 'function') {
			comparator = val;
		}
		let found = this.storage.find(val, comparator);
		if (found !== undefined) {
			let recent = this.storage.remove(val, comparator);
			this.storage.append(recent.value);
		}
		return found === undefined ? found : found.value;
	}
}


class Queue {
	constructor(...elems) {
		this.pointer = 0;
		this.storage = {};
		elems.forEach((e,i) => {
			this.storage[i] = e;
		});
		this.length = elems.length || 0;
		this.end = this.length;
	}
	enqueue (elem) {
		this.storage[this.end] = elem;
		this.end ++;
		this.length ++;
	}
	dequeue () {
		let next = this.storage[this.pointer];
		if (next !== undefined) {
			delete this.storage[this.pointer];
			this.pointer ++;
			this.length --;
		}
		return next;
	}
	at (index) {
		return this.storage[this.pointer + index];
	}
	forEach (cb) {
		for (let index in this.storage) {
			cb(this.storage[index], Number(index)-this.pointer);
		}
	}
}

class RRcache {
	constructor (size = 10) {
		this.size = size;
		this.storage = [];
	}
	store (data) {
		if (this.storage.length >= this.size) {
			let nextIndex = Math.floor(Math.random() * this.size);
			this.storage[nextIndex] = data;
			return nextIndex;
		} else {
			return this.storage.push(data)
		}
	}
	retrieve (val, comparator=equals) {
		if (typeof val === 'function') {
			return this.storage.find(val);
		} else {
			for (let i = 0; i < this.storage.length; i++) {
				if (comparator(this.storage[i], val)) {
					return this.storage[i];
				}
			}
			return undefined;
		}
	}
}

class FIFOcache {
	constructor (size = 10) {
		this.size = size;
		this.storage = new Queue();
	}
	store (val) {
		let retval = [];
		while (this.storage.length >= this.size) {
			retval.push(this.storage.dequeue());
		}
		this.storage.enqueue(val);
	}
	retrieve (val, comparator=equals) {
		if (typeof val === 'function') {
			comparator = val;
		}
		let retval;
		for (let i = 0; i < this.storage.length; i ++) {
			if (comparator(this.storage.at(i), val)) {
				return this.storage.at(i);
			}
		}
		return retval;
	}
}

class Stack {
	constructor() {
		this.storage = [];
	}
	get length () {
		return this.storage.length;
	}
	push (elem) {
		return this.storage.push(elem);
	}
	pop () {
		return this.storage.pop();
	}
	peek () {
		return this.storage[this.storage.length -1];
	}
	forEach(cb) {
		this.storage.forEach(cb);
	}
}

class Q2Stack {
	constructor () {
		this.sides = [new Queue(), new Queue()];
		this.current = 0;
	}
	get length () {
		return this.sides.reduce((total, next) => total += next.length, 0);
	}
	push (val) {
		return this.sides[this.current].enqueue(val);
	}
	pop() {
		if (!this.length) {
			return undefined;
		}
		let result;
		let opp = (this.current + 1) % 2
		for (let i = 0; i < this.sides[this.current].length; i++) {
			this.sides[opp].enqueue(this.sides[this.current].dequeue());
		}
		result = this.sides[this.current].dequeue();
		this.current = opp;
		return result;
	}
}

class S2Queue {
	constructor () {
		this.sides = [new Stack(), new Stack()];
		this.current = false;
	}
	get length () {
		return this.sides[0].length + this.sides[1].length;
	}
	enqueue (val) {
		return this.sides[+this.current].push(val);
	}
	dequeue () {
		if (!this.length) {
			return undefined;
		}
		while (this.sides[+this.current].length) {
			this.sides[+!this.current].push(this.sides[+this.current].pop());
		}
		this.current = !this.current;
		return this.sides[+this.current].pop();
	}
}

class Circular {
	constructor (size = 10) {
		this.storage = [];
		this.size = Math.max(size, 1);
		this.end = 0;
		this.start = 0;
	}
	get length () {
		return this.size - Math.abs(this.start - this.end);
	}
	_circInc (int, mod) {
		return (int + 1) % mod;
	}
	write (val) {
		if (this.storage[this.end]) {
			this.start = this._circInc(this.start, this.size);
		}
		this.storage[this.end] = val;
		let writeIndex = this.end;
		this.end = this._circInc(this.end, this.size);
		return writeIndex;
	}
	read (index) {
		return this.storage[index];
	}
	remove () {
		let retval = this.storage[this.start];
		delete this.storage[this.start];
		this.start = this._circInc(this.start, this.size);
		return retval;
	}
}

class LifoCircular {
	constructor (size = 10) {
		this.storage = [];
		this.size = Math.max(size, 1);
		this.start = 0;
		this.currDir = true;
	}
	get length () {
		return this.storage.filter(e => e !== undefined).length;
	}
	moveCursor () {
		this.start += this.currDir ? 1 : -1;
	}
	moveOpp () {
		this.start -= this.currDir ? 1 : -1;
	}
	write (val) {
		this.storage[this.start] = val;
		this.moveCursor();
		if (this.start === this.size) {
			this.currDir = !this.currDir;
			this.moveCursor();
		} else if (this.start === -1) {
			this.currDir = !this.currDir;
			this.moveCursor();
		}
	}
	read (index) {
		return this.storage[index];
	}
	remove () {
		this.moveOpp();
		if (this.start === this.size) {
			this.currDir = !this.currDir;
			this.moveOpp();
		} else if (this.start === -1) {
			this.currDir = !this.currDir;
			this.moveOpp();
		}
		let result = this.storage[this.start];
		this.storage[this.start] = undefined;
		return result;
	}
}

class LIFOcache {
	constructor (size = 10) {
		this.size = size;
		this.storage = new LifoCircular(size);
	}
	get length () {
		return this.storage.length;
	}
	store (val) {
		this.storage.write(val);
	}
	retrieve (val, comparator=equals) {
		if (typeof val === 'function') {
			comparator = val;
		}
		for (let i = 0; i < this.storage.length; i ++) {
			if (comparator(this.storage.read(i), val)) {
				return this.storage.read(i);
			}
		}
		return undefined;
	}
	clear () {
		let old = this.storage;
		this.storage = new LifoCircular();
		return old;
	}
}

class Bit32Array {
	constructor (val) {
		this.data = val || 0;
	}
	and (bitArr) {
		return new BitArray(this.data & bitArr.data);
	}
	or (bitArr) {
		return new BitArray(this.data | bitArr.data);
	}
	xor (bitArr) {
		return new BitArray(this.data ^ bitArr.data);
	}
	not () {
		return new BitArray(~(this.data -1));
	}
	toggle (pos) {
		this.data ^= 1 << pos;
	}
	on (pos) {
		this.data |= 1 << pos;
	}
	off (pos) {
		this.data &= ~(1 << pos);
	}
	toString () {
		return this.data.toString(2);
	}
	leftShift (amount = 1) {
		this.data <<= amount;
	}
	rightShift (amount = 1) {
		this.data >>= amount;
	}
	isToggled (pos) {
		return Boolean((this.data >> pos) & 1);
	}
	get length () {
		return 32;
	}
	countOn () {
		let i = this.data;
		i = i - ((i >> 1) & 0x55555555);
		i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
		return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
	}
	countOff () {
		return 32 - this.countOn();
	}
}

class BitArray {
	constructor () {
		this.storage = [];
	}
	and (bitArr) {
		let max;
		let min;
		if (bitArr.length > this.length) {
			max = bitArr.storage;
			min = this.storage;
		} else {
			max = this.storage;
			min = bitArr.storage;
		}
		let result = new BitArray();
		result.storage = max.map((e,i) => ((min[i] || 0) && e));
		return result;
	}
	or (bitArr) {
		let max;
		let min;
		if (bitArr.length > this.length) {
			max = bitArr.storage;
			min = this.storage;
		} else {
			max = this.storage;
			min = bitArr.storage;
		}
		let result = new BitArray();
		result.storage = max.map((e,i) => ((min[i] || 0) || e));
		return result;
	}
	on (pos) {
		this.storage[pos] = 1;
	}
	off (pos) {
		this.storage[pos] = 0;
	}
	toggle (pos) {
		this.storage[pos] = this.storage[pos] === undefined ? 1 : +!this.storage[pos];
	}
	isToggled (pos) {
		return this.storage[pos] === 1;
	}
	get length () {
		return this.storage.length;
	}
	countOn () {
		return this.storage.filter(e => e === 1).length;
	}
	countOff () {
		this.shave();
		return this.storage.filter(e => e === 0).length / this.length;
	}
	leftShift (amount = 1) {
		let newStorage = [];
		this.storage.forEach((e, i) => {
			newStorage[i+amount] = e;
		});
		this.storage = newStorage;
	}
	rightShift (amount = 1) {
		let newStorage = [];
		this.storage.forEach((e, i) => {
			let nextIndex = i - amount;
			if (nextIndex > -1) {
				newStorage[nextIndex] = e;
			}

		});
		this.storage = newStorage;
	}
	shave () {
		let newStorage = [];
		let done = false;
		this.storage.reduceRight((none, n, index) => {
			if (n === 1) {
				done = true;
			}
			if (done) {
				newStorage[index] = n;
			}
		}, undefined);
		this.storage = newStorage;
	}
	toString (bigEndian=true) {
		let retval = ' '.repeat(this.length).split('');
		this.storage.forEach((e,i)=>retval[i] = e);
		return retval[bigEndian ? 'reverse' : 'slice']().join('').replace(/ /g, 0);
	}
}

const identity = i=>i;

class Tree {
	constructor (value) {
		this.value = value;
		this.children = [];
	}
	insert (value) {
		if (this.value === undefined) {
			this.value = value;
			return this;
		}
		let child = new Tree(value);
		this.children.push(child);
		return child;
	}
	isLeaf () {
		return this.children.length === 0;
	}
	isBranch () {
		return this.children.length > 0;
	}
	prune () {
		this.children = [];
	}
	graft (...forest) {
		this.children = this.children.concat([...forest]);
	}
	depthFirstSearch(cb) {
		cb(this.value);
		this.children.forEach(child => child.depthFirstSearch(cb));
	}
	preorder(cb) {
		return this.depthFirstSearch(cb);
	}
	postorder(cb) {
		this.children.forEach(child => child.inorder(cb));
		cb(this.value);
	}
	breadthFirstSearch (cb) {
		let currentLayer = new Queue();
		let nextLayer = new Queue();
		cb(this.value, 0, this);
		let depth = 1;
		this.children.forEach(child => nextLayer.enqueue(child));
		while(nextLayer.length > 0 || currentLayer.length > 0) {
			while(nextLayer.length > 0) {
				let curr = nextLayer.dequeue();
				cb(curr.value, depth, curr);
				curr.children.forEach(child => currentLayer.enqueue(child));
			}
			depth ++;
			nextLayer = currentLayer;
		}
	}
	get size () {
		return 1 + this.children.reduce((total, next) => total + next.length, 0);
	}
}

const getMid = (a,b) => ~~((a+b)/2);
class BinaryTree extends Tree {
	constructor(value, scorer=identity) {
		super(value);
		Object.defineProperty(this, 'scorer',  {value: 'static', writable: true});
		this.scorer = scorer;
	}
	insert (...value) {
		if (value.length > 1) {
			value.forEach(v => this.insert(v));
			return;
		} else {
			value = value[0];
		}
		if (this.value === undefined) {
			this.value = value;
			return;
		}
		let dir;
		if (this.scorer(value) > this.scorer(this.value)) {
			dir = RIGHT;
		} else {
			dir = LEFT;
		}
		if (this.children[dir]) {
			return this.children[dir].insert(value);
		} else {
			let next = new BinaryTree(value, this.scorer);
			this.children[dir] = next;
			return next;
		}
	}
	get rSize () {
		return this.children[RIGHT].size;
	}
	get lSize () {
		return this.children[LEFT].size;
	}
	get right () {
		return this.children[RIGHT];
	}
	get left () {
		return this.children[LEFT];
	}
	set right (t) {
		this.children[RIGHT] = t;
	}
	set left (t) {
		this.children[LEFT] = t;
	}
	contains (elem, comparator=equals) {
		if (this.value === elem) {
			return true;
		} else if (this.scorer(this.value) > this.scorer(elem)) {
			if (this.left) {
				return this.left.contains(elem);
			} else {
				return false;
			}
		} else {
			if (this.right) {
				return this.right.contains(elem);
			} else {
				return false;
			}
		}
	}
	balance () {
		let flattened = [];
		this.depthFirstSearch(val => flattened.push(val));
		flattened = sorts.comb(flattened);
		let balancedTree = new BinaryTree(undefined, this.scorer);
		const addBalanced = (arr) => {
			if(arr.length === 2) {
				balancedTree.insert(arr[0]);
				balancedTree.insert(arr[1]);
				return;
			} else if (arr.length === 1) {
				balancedTree.insert(arr[0]);
				return;
			}
			let mid = getMid(0,arr.length);
			balancedTree.insert(arr[mid]);
			addBalanced(arr.slice(0, mid));
			addBalanced(arr.slice(mid));
		}
		addBalanced(flattened);
		this.value = balancedTree.value;
		this.children = balancedTree.children;
	}
	rotateRight () {
		let pivot = this.left;
		if (pivot === undefined) {
			return;
		}
		let switched = pivot.right;
		let temp = this.value;
		this.value = pivot.value;
		pivot.value = temp;
		this.left = switched;
		pivot.right = this;
	}
	rotateLeft () {
		let pivot = this.right;
		if (pivot === undefined) {
			return;
		}
		let switched = pivot.left;
		let temp = this.value;
		this.value = pivot.value;
		pivot.value = temp;
		this.right = switched;
		pivot.left = this;
	}
	readable (_depth = 0, side=undefined) {
		let retval = _depth === 0 ? '' : ('    ').repeat(_depth) + '➤';
		let positioning = side === undefined ? 'ROOT' : (side === RIGHT ? '⯅' : '⯆');
		console.log(retval, this.value, positioning);
		if (this.left) this.left.readable(_depth +1, LEFT);
		if (this.right) this.right.readable(_depth +1, RIGHT);
	}
}

class DoublyLinkedTree extends Tree {
	constructor (value) {
		super(value);
		this.parent = undefined;
		this.length = +!!value;
	}
	get uncle () {
		let parent = this.parent;
		if (parent === undefined) {
			return undefined;
		} else {
			let grandparent = parent.parent;
			if (grandparent === undefined) {
				return undefined;
			}
			return grandparent.left === parent ? grandparent.right : grandparent.left;
		}
	}
	get grandparent () {
		return this.parent ? (this.parent.parent ? this.parent.parent : undefined) : undefined;
	}
	insert (value) {
		let child = new DoublyLinkedTree(value);
		child.parent = this;
		let parent = child.parent;
		while(parent !== undefined) {
			parent.length ++;
			parent = parent.parent;
		}
		this.children.push(child);
		return child;
	}
}

const diffByOne = (a,b) => 2 > Math.abs(a-b);

const RIGHT = 1;
const LEFT = 0;
const oppDir = dir=> dir === RIGHT ? LEFT : RIGHT;
class DoublyLinkedBinaryTree {
	constructor (value, identifier=identity) {
		this.value = value;
		this.children = [];
		this.identifier = identifier;
		this.parent = undefined;
	}
	get right () {
		return this.children[RIGHT];
	}
	get left () {
		return this.children[LEFT];
	}
	set right (value) {
		this.children[RIGHT] = value;
	}
	set left (value) {
		this.children[LEFT] = value;
	}
	get isRightChild () {
		return this.parent ? this.parent.right === this : false;
	}
	get isLeftChild () {
		return this.parent ? this.parent.left === this : false;
	}
	get isRoot () {
		return this.parent === undefined;
	}
	get uncle () {
		return this.grandparent ? (this.parent.isRightChild ? this.grandparent.left : this.grandparent.right) : undefined;
	}
	get sibling () {
		return this.parent ? (this.isRightChild ? this.parent.left : this.parent.right) : undefined;
	}
	get grandparent () {
		return this.parent ? this.parent.parent : undefined;
	}
	get isLeaf() {
		return this.children.every(child => child === undefined);
	}
	get hasOneChild () {
		return (this.right !== undefined && this.left === undefined) 
		|| (this.right === undefined && this.left !== undefined);
	}
	get hasTwoChildren () {
		return (this.right !== undefined && this.left !== undefined);
	}
	_swapWithParent () {
		//Need to create a new node to replace old one;
		let replacement = new BinaryTree(this.value, this.identifier);
		replacement.parent = this.parent;
		replacement.children = this.children;
		if (this.parent !== undefined) {
			if (this.isRightChild) {
				this.parent.right = replacement;
			} else {
				this.parent.left = replacement;
			}
		}
		this.value = replacement.parent.value;
		this.children = replacement.parent.children;
		this.parent = replacement.parent.parent;
		//Update references to this
		this.children.forEach(child => {if(child) child.parent = this});
		//Update references to replacement
		this.children.forEach(child => {if(child) child.children.forEach(kid => {if (kid) kid.parent = child})});
	}
	rotateRight () {
		this._rotate(RIGHT);
		this._swapWithParent();
	}
	rotateLeft () {
		this._rotate(LEFT);
		this._swapWithParent();
	}
	_rotate (dir) {
		let opposite = oppDir(dir);
		let pivot = this.children[opposite];
		this.children[opposite] = pivot.children[dir];
		pivot.children[dir] = this;
		pivot.parent = this.parent;
		pivot.children.forEach(child => {if(child) child.parent = pivot;});
		this.children.forEach(child => {if(child) child.parent = this;});
	}
	insert (value) {
		if (this.value === undefined) {
			this.value = value;
			return this;
		} else {
			let dir;
			if (this.identifier(value) > this.identifier(this.value)) {
				dir = RIGHT;
			} else {
				dir = LEFT;
			}
			if (this.children[dir] === undefined) {
				let newTree = new BinaryTree(value, this.identifier);
				newTree.parent = this;
				this.children[dir] = newTree;
				return newTree;
			} else {
				return this.children[dir].insert(value);
			}
		}
	}
	find (value) {
		let identifiedValue = this.identifier(value);
		let thisValue = this.identifier(this.value);
		if (thisValue === identifiedValue) {
			return this;
		} else {
			let dir;
			if (thisValue < identifiedValue) {
				dir = RIGHT;
			} else {
				dir = LEFT;
			}
			if (this.children[dir] === undefined) {
				return undefined;
			} else {
				return this.children[dir].find(value);
			}
		}
	}
	contains (value) {
		return this.find(value) !== undefined;
	}
	_minimumChild () {
		let current = this;
		while (current.left !== undefined) {
			current = current.left
		}
		return current;
	}
	minimum() {
		return this._minimumChild().value;
	}
	_maximumChild () {
		let current = this;
		while (current.right !== undefined) {
			current = current.right
		}
		return current;
	}
	maximum() {
		return this._maximumChild().value;
	}
	remove (value) {
		let identifiedValue = this.identifier(value);
		let thisValue = this.identifier(this.value);
		if (thisValue === identifiedValue) {
			if (this.isLeaf) {
				if (this.isRoot) {
					this.value = undefined;
				} else if (this.isRightChild) {
					this.parent.right = undefined;
				} else if (this.isLeftChild) {
					this.parent.left = undefined;
				}
			} else if (this.hasOneChild) {
				let rmDir = this.right ? LEFT : RIGHT;
				this.right ? this.rotateLeft() : this.rotateRight();
				this.children[rmDir] = undefined;
			} else if (this.hasTwoChildren) {
				let replacement = this.right._minimumChild();
				this.value = replacement.value;
				this.right.remove(replacement.value);
			}
		} else {
			let dir;
			if (thisValue < identifiedValue) {
				dir = RIGHT;
			} else {
				dir = LEFT;
			}
			if (this.children[dir] === undefined) {
				return undefined;
			} else {
				return this.children[dir].remove(value);
			}
		}
	}
	readable (_depth = 0, side=undefined) {
		let retval = _depth === 0 ? '' : (' ').repeat(_depth) + '➤';
		let positioning = side === undefined ? 'ROOT' : (side === RIGHT ? '⯅' : '⯆');
		console.log(retval, this.value, positioning, _depth + ' deep');
		if (this.left) this.left.readable(_depth +1, LEFT);
		if (this.right) this.right.readable(_depth +1, RIGHT);
	}
};


//With help from eloquent Javascript
const swap = (dataStruct, i1, i2) => {
  let temp = dataStruct[i1];
  dataStruct[i1] = dataStruct[i2];
  dataStruct[i2] = temp;
}
class Heap {
	constructor (scorer=identity) {
		this.storage = [];
		this.scorer = scorer;
	}
	push (elem) {
		this.storage.push(elem);
		this.bubbleUp(this.storage.length-1);
	}
	toSortedArray () {
		let result = [];
		let clone = new Heap (this.scorer);
		clone.storage = this.storage;
		while (clone.length) {
			result.push(clone.pop());
		}
		return result;
	}
	fromArray (arr) {
		arr.forEach(e => {
			this.push(e);
		});
	}
	pop () {
		let result = this.storage[0];
		let end = this.storage.pop();
		if (this.storage.length !== 0) {
			this.storage[0] = end;
			this.sinkDown(0);
		}
		return result;
	}
	remove (elem, comparator=equals) {
		if (typeof elem === 'function') {
			comparator = elem;
		}
		for (let i = 0; i < this.length; i++) {
			if (comparator(this.storage[i], elem)) {
				let old = this.storage[i];
				let end = this.storage.pop();
				if (this.storage.length < 1) {
					return end;
				}
				this.storage[i] = end;
				this.bubbleUp(i);
				this.sinkDown(i);
				return old;
			}
		}
		return undefined;
	}
	peek () {
		return this.storage[0];
	}
	bubbleUp (index) {
		let elem = this.storage[index];
		let elemScore = this.scorer(elem);
		while (index > 0) {
			let parentIndex = ~~((index+1)/2)-1;
			let parent = this.storage[parentIndex];
			if (elemScore >= this.scorer(parent)) return;
			this.storage[parentIndex] = elem;
			this.storage[index] = parent;
			index = parentIndex;
		}
	}
	sinkDown (index) {
	let elem = this.storage[index];
	let elemScore = this.scorer(elem);
	for (;;) {
		let firstChildInd = (index + 1) * 2;
		let secondChildInd = firstChildInd - 1;
		let swapIndex;
		if (firstChildInd < this.length) {
			let child1 = this.storage[firstChildInd];
			let child1Score = this.scorer(child1);
			if (elemScore > child1Score) {
				swapIndex = firstChildInd;
			}
		}
		if (secondChildInd < this.length) {
			let child2 = this.storage[secondChildInd];
			let child2Score = this.scorer(child2);
			if (elemScore > child2Score) {
				if (swapIndex !== undefined) {
					swapIndex = child2Score < this.scorer(this.storage[swapIndex]) ? secondChildInd : swapIndex;
				} else {
					swapIndex = secondChildInd;
				}
			}
		}
		if (swapIndex === undefined) {
			return;
		} else {
			swap(this.storage, index, swapIndex);
			index = swapIndex;
		}
	}
	}
	get length () {
		return this.storage.length;
	}
}

const BLACK = 'b';
const RED = 'r';
class RedBlackTree extends DoublyLinkedBinaryTree {
	constructor (value, identifier=identity, color=BLACK) {
		super(value, identifier);
		this.color = color;
	}
	_swapWithParent () {
		//Need to create a new node to replace old one;
		let replacement = new RedBlackTree(this.value, this.identifier, this.color);
		replacement.parent = this.parent;
		replacement.children = this.children;
		if (this.parent !== undefined) {
			if (this.isRightChild) {
				this.parent.right = replacement;
			} else {
				this.parent.left = replacement;
			}
		}
		this.value = replacement.parent.value;
		this.children = replacement.parent.children;
		this.parent = replacement.parent.parent;
		this.color = replacement.parent.color;
		//Update references to this
		this.children.forEach(child => {if (child) child.parent = this});
		//Update references to replacement
		this.children.forEach(child => {if (child) child.children.forEach(kid => {if (kid) kid.parent = child})});
	}
	paintBlack () {
		this.color = BLACK;
	}
	paintRed () {
		this.color = RED;
	}
	get isBlack () {
		return this.color === BLACK;
	}
	get isRed () {
		return this.color === RED;
	}
	paint () {
		return this._insert1();
	}
	_insert1 () {
		if (this.parent === undefined) {
			this.paintBlack();
			return;
		} else {
			this._insert2();
		}
	}
	_insert2 () {
		if (this.parent.isBlack) {
			return;
		} else {
			this._insert3();
		}
	}
	_insert3() {
		let uncle = this.uncle;
		if (uncle ? uncle.isRed : false) {
			this.parent.paintBlack();
			uncle.paintBlack();
			this.grandparent.paintRed();
			this.grandparent.paint();
			return;
		} else {
			this._insert4();
		}
	}
	_insert4 () {
		if(this.isRightChild && this.parent.isLeftChild) {
			this.parent.rotateLeft();
		} else if (this.isLeftChild && this.parent.isRightChild) {
			this.parent.rotateRight();
		}
		this._insert5();
	}
	_insert5 () {
		this.parent.paintBlack();
		this.grandparent.paintRed();
		if (this.isLeftChild) {
			this.grandparent.rotateRight();
		} else {
			this.grandparent.rotateLeft();
		}
		return;
	}
	insert (value) {
		if (this.value === undefined) {
			this.value = value;
			this.paintBlack();
			return;
		}
		let dir;
		if (this.identifier(value) > this.identifier(this.value)) {
			dir = RIGHT;
		} else {
			dir = LEFT;
		}
		if (this.children[dir] !== undefined) {
			return this.children[dir].insert(value);
		} else {
			let child = new RedBlackTree(value, this.identifier, RED);
			child.parent = this;
			let parent = child.parent;
			this.children[dir] = child;
			child.paint();
			return child;
		}
	}
	countBlackToRoot(count = 0) {
		if (this.parent === undefined) {
			return count;
		} else {
			return this.isBlack ? this.parent.countBlackToRoot(count+1) : this.parent.countBlackToRoot(count);
		}
	}
	_remove0 () {
		let childIsRed = this.hasOneChild ? (this.right ? this.right.isRed : this.left.isRed) : false;
		if (this.isBlack) {
			if(childIsRed) {
				this.right ? this.right.paintBlack() : this.left.paintBlack();
			} else {
				if (this.parent ? this.parent.isBlack : false) {
					this._remove1();
				}
			}
		}
	}
	_remove1 () {
		if (this.parent !== undefined) this._remove2();
	}
	_remove2 () {
		let sib = this.sibling;
		if (sib && sib.isRed) {
			this.parent.paintRed();
			sib.paintBlack();
			if (this.isLeftChild) {
				this.parent.rotateLeft();
			} else if (this.isRightChild) {
				this.parent.rotateRight();
			}
		} 
		this._remove3();	
	}
	_remove3 () {
		let sib = this.sibling;
		let sibIsBlack = sib ? sib.isBlack : true;
		let sibLeftBlack = sib ? (sib.left ? sib.left.isBlack : true) : true;
		let sibRightBlack = sib ? (sib.right ? sib.right.isBlack : true) : true;
		if (this.parent.isBlack && sib && sibIsBlack && sibLeftBlack && sibRightBlack) {
			sib.paintRed();
			this.parent._remove1();
		} else {
			this._remove4();
		}
	}
	_remove4 () {
		let sib = this.sibling;
		let sibIsBlack = sib ? sib.isBlack : true;
		let sibLeftBlack = sib ? (sib.left ? sib.left.isBlack : true) : true;
		let sibRightBlack = sib ? (sib.right ? sib.right.isBlack : true) : true;
		if (this.parent.isRed && sib && sibIsBlack && sibLeftBlack && sibRightBlack){
			sib.paintRed();
			this.parent.paintBlack();
		} else {
			this._remove5();
		}
	}
	_remove5 () {
		let sib = this.sibling;
		if (this.isLeftChild && (sib.right ? sib.right.isBlack : true) && (sib.left ? sib.left.isRed : false)) {
			sib.paintRed();
			sib.left.paintBlack();
			sib.rotateRight();
		} else if (this.isRightChild && (sib.left ? sib.left.isBlack : true) && sib.right ? sib.right.isRed : false) {
			sib.paintRed();
			sib.right.paintBlack();
			sib.rotateLeft();
		}
		this._remove6();
	}
	_remove6() {
		let sib = this.sibling;
		if (sib) this.parent.isBlack ? sib.paintBlack() : sib.paintRed();
		this.parent.paintBlack();
		if (this.isLeftChild) {
			sib.right.paintBlack();
			this.parent.rotateLeft();
		} else {
			sib.left.paintBlack();
			this.parent.rotateRight();
		}
	}
	remove (value) {
		let identifiedValue = this.identifier(value);
		let thisValue = this.identifier(this.value);
		if (thisValue === identifiedValue) {
			this.rmPaint(value);
			return;
		} else {
			let dir;
			if (thisValue < identifiedValue) {
				dir = RIGHT;
			} else {
				dir = LEFT;
			}
			if (this.children[dir] === undefined) {
				return undefined;
			} else {
				return this.children[dir].remove(value);
			}
		}
	}
	standardRemove (value) {
		if (this.isLeaf) {
			if (this.isRoot) {
				this.value = undefined;
				this.paintBlack();
			} else if (this.isRightChild) {
				this.parent.right = undefined;
			} else if (this.isLeftChild) {
				this.parent.left = undefined;
			}
		} else if (this.hasOneChild) {
			let rmDir = this.right ? LEFT : RIGHT;
			this.right ? this.rotateLeft() : this.rotateRight();
			this.children[rmDir] = undefined;
		} else if (this.hasTwoChildren) {
			let replica = this.right._minimumChild();
			this.value = replica.value;
			this.right.remove(replica.value);
		}
	}
	rmPaint(value) {
		if (!this.hasTwoChildren) {
			this._remove0();
		}
		this.standardRemove(value);
	}
	readable (_depth = 0, side=undefined) {
		let retval = (_depth === 0 ? 'RT' : (' ').repeat(_depth) + '➤');
		let positioning = side === undefined ? 'ROOT' : (side === RIGHT ? '⯅' : '⯆');
		console.log(retval, this.value, this.color, positioning, _depth + ' deep');
		if (this.left) this.left.readable(_depth +1, LEFT);
		if (this.right) this.right.readable(_depth +1, RIGHT);
	}
}

const DataStructures = {
	LinkedList,
	DoublyLinkedList,
	Queue,
	Q2Stack,
	S2Queue,
	Bit32Array,
	BitArray,
	Circular,
	Tree,
	Set,
	Heap,
	BinaryTree,
	DoublyLinkedTree,
	DoublyLinkedBinaryTree,
	RedBlackTree,
	caches: {
		NaiveLRUcache,
		LRUcache,
		FIFOcache,
		LIFOcache,
		MRUcache,
		RRcache
	},

}

module.exports = DataStructures;


