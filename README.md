# open-data

## Installation

``` sh
npm i open-data
```

## Usage
``` javascript
let od = require('open-data');
```
### Sorting

``` javascript
od.sorts.merge(/*data*/);
od.sorts.bucket();
od.sorts.radix();
od.sorts.comb();
od.sorts.quick();
//All accept an array or object with an iterator, as well as a comparator which takes two arguments
//All return a sorted array
od.sorts.isSorted();
```

### Search

``` javascript
od.selections.jump(/* sorted data */, elem);
od.selections.fibonnaci(/* sorted data */, elem);
od.selections.linear(/*data*/, elem);
```

### Data Structures

``` javascript
//LinkedLists
let ll = new od.structures.LinkedList();
ll.append('value');
ll.prepend('value');
ll.shift(); //returns head
ll.pop(); //returns tail
ll.remove('value', /*optional comparator*/);
ll.contains('value', /*optional comparator*/);
//same interface for DoublyLinkedList();

//Caches
// LRUcache, MRUcache, RRcache FIFOcache, LIFOcache
let lru = new od.structures.LRUcache();
lru.store('value');
lru.retrieve('value', comparator);
//OR
let findFunc = (a) => a === 'desired result';
lru.retrieve(findFunc);

//Queue and S2Queue (Queue made from 2 stacks)
let q = new od.structures.Queue();
q.enqueue('elem');
q.dequeue(); //elem

//Stack and Q2Stack (Stack made from 2 queues)
let s = new od.structures.Stack();
q.push(val);
q.pop(val);

//Bit Arrays
//Bit32Array and BitArray
let bits = new od.structures.Bit32Array();
let secondBits = new od.structures.Bit32Array();
bits.on(10);//position
secondBits.on(3);
secondBits.leftShit(2);
secondBits.isToggled(5);
//true
bits.and(secondBits);
//Returns new Bit32Array

//Trees
//Tree, BinaryTree, DoublyLinkedTree, DoublyLinkedBinaryTree
//RedBlackTree
let t = new Tree();
let root = t.insert(10);
let child1 = t.insert(15);
let otherTree = new Tree(15);
root.prune();
root.graft(otherTree);
tree.breadthFirstSearch(console.log);
tree.depthFirstSearch(console.log);

//Specifically Binary Trees:
let t = new BinaryTree(5);
t.insert(6,7,3,2);
t.contains(7);
//true
t.insert(10,10,10,10,10);
t.balance();
//Balances tree.

//Splay Trees & Graphs to come soon.

```

### Matrices

```javascript
const Matrix = require('open-data').Matrix;

let a = new Matrix();
let b = new Matrix();
let x = 1;
let y = 2;
a.set(x, y, 10);
b.set(0, 3, 5);
let test = [];
for (let i = 0; i < 100; i++) {
	test.push(i);
}
for (let i = 0; i < 100; i++) {
	//i represents x for a row and y for a column.
	a.setRow(i, test);
	b.setColumn(i, test);
}
//Multiplies two arrays and returns a new instance of a matrix.
console.log(a.mult(b));
//Supports scalar multiplication
console.log(a.mult(5));
//Power function
console.log(a.pow(3));
//Uses node cluster to parallelize multiplication. Only effective when there are multiple cpus available.
console.log(a.clusterMult(b));

console.log(a.add(b));
console.log(a.transpose());
a.get(13, 13);
//retrieves element at 13, 13.
a.row(3);
//retrieves third row.
a.column (5);
//retrieves 5th column.
a.forEach((value, x, y)=>{
	someFunction(v, x, y);
});
a.forEachRow((row, y) => someFunction(row, y));
a.forEachCol((col, x) => someFunction(col, x));
//Map returns a clone with the modified value.
a.map((value, x, y) => return otherFunction(value, x, y));

//If you need to clone it
a.clone();
```

# Bugs

Please report bugs or suggestions or fixes to julianknodt@gmail.com
Thanks for using open-data <3, best of luck to you in your coding.

### 

License
----

MIT
