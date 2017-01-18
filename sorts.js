const getNativeComparator = (dataStruct) => {
	if (dataStruct.every(elem => typeof elem === 'number')) {
		return (a,b) => a < b;
	} else if (dataStruct.every(elem => typeof elem === 'string')) {
		return (a,b) => a < b;
	} else if (dataStruct.every(elem => typeof elem === 'boolean')) {
		return (a,b) => a ? true : (b ? false : true);
	}
}
const mergeSorted = (a,b, comparator=(a,b)=>a<b) => {
	let result = [];
	let currentA = 0;
	let currentB = 0;
	while (currentA !== a.length && currentB !== b.length) {
		let nextA = a[currentA];
		let nextB = b[currentB];
		if (comparator(nextA, nextB)) {
			result.push(nextA);
			currentA ++;
		} else {
			result.push(nextB);
			currentB ++;
		}
	}
	if (currentA < a.length) {
		result = result.concat(a.slice(currentA));
	} else {
		result = result.concat(b.slice(currentB));
	}
	return result;
}

// console.log(mergeSorted([0,3,4], [1,2]));

let last = (dataStruct) => {
	return [...dataStruct][dataStruct.length-1];
}

const mergeSort = (dataStruct, comparator=getNativeComparator(dataStruct)) => {
	let clone = [...dataStruct];
	clone = clone.map(e => [e]);
	let next = [];
	let prev = clone;
	while(prev.length > 1) {
		if (prev.length % 2 === 1) {
			let lastElement = mergeSorted(prev[prev.length-1], prev[prev.length-2], comparator);
			prev.pop();
			prev[prev.length-1] = lastElement;
		}
		for (let i = 0; i < prev.length; i += 2) {
			if (prev[i] !== undefined && prev[i+1] !== undefined) {
				next.push(mergeSorted(prev[i], prev[i+1], comparator));
			}
		}
		prev = next;
		next = [];
	}
	return prev[0] || [];
}

const isSorted = (dataStruct, comparator=(a,b)=>a<=b) => {
	return [...dataStruct].every((e, i, arr) => i === arr.length -1 ? true : comparator(e, arr[i+1]))
}

const randomArray = (len, range) => {
	let result = [];
	for (let i = 0; i < len; i ++) {
		result.push(Math.floor(Math.random()*range));
	}
	return result;
}

const swap = (dataStruct, i1, i2) => {
	let temp = dataStruct[i1];
	dataStruct[i1] = dataStruct[i2];
	dataStruct[i2] = temp;
}

const quickSort = (dataStruct, comparator=getNativeComparator(dataStruct)) => {
	let clone = [...dataStruct];
	if (clone.length === 1 || clone.length === 0) {
		return clone;
	} else {
		let pivotPoint = Math.floor(Math.random() * clone.length);
		let above = clone.filter((e, i) => i !== pivotPoint && comparator(clone[pivotPoint], e));
		let below = clone.filter((e, i) => i !== pivotPoint && !comparator(clone[pivotPoint], e));
		return quickSort(below).concat(clone[pivotPoint]).concat(quickSort(above));
	}
}

const insertionSort = (dataStruct, comparator = getNativeComparator(dataStruct)) => {
	let result = [];
	dataStruct.forEach(elem => {
	let added = false;
	for (let i = 0; i < result.length; i ++) {
		if (comparator(elem, result[i]) && !added) {
			result.splice(i, 0, elem);
			added = true;
			break;
		}
	}
	if (!added) {
	    result.push(elem);
	}
	});
	return result;
}

const bubbleSort = (dataStruct, comparator = getNativeComparator(dataStruct)) => {
	let clone = [...dataStruct];
	let swappedElems = true;
	let times = 0;
	while(swappedElems) {
		swappedElems = false;
		for (let i = 0; i < clone.length-times; i ++) {
			if (comparator(clone[i+1], clone[i])) {
				swap(clone, i, i+1);
				swappedElems = true;
			}
		}
		times ++;
	}
	return clone;
}

const selectionSort = (dataStruct, comparator = getNativeComparator(dataStruct)) => {
	let clone = [...dataStruct];
	let result = [];
	for (let i = 0; i < clone.length; i ++) {
		let smallestValIndex;
		let smallestVal;
		clone.reduce((currMin, next, index) => {
			if (!comparator(currMin, next)) {
				smallestVal = next;
				smallestValIndex = index;
				return next;
			}
			return currMin;
		}, Infinity);
		result.push(smallestVal);
		clone[smallestValIndex] = Infinity;
	}
	return result;
};

const combSort = (dataStruct, comparator=(a,b)=>a>b, combConst=1.3) => {
	let clone = [...dataStruct];
	let combLen = Math.floor(clone.length/combConst);
	while(combLen > 1) {
		for (let i = 0; i < clone.length-combLen; i++) {
			if (comparator(clone[i], clone[i+combConst])) {
				swap(clone, i, i+combConst);
			}
		}
		combLen = Math.floor(combLen/combConst);
	}
	//Now it becomes bubbleSort because the elements that take a long time have been sorted.
	return bubbleSort(clone, comparator);
}

const range = (dataStruct) => {
	return [...dataStruct].reduce((m, next) => {
		return {min: Math.min(m.min, next), max: Math.max(m.max, next)}
	}, {min: Infinity, max: -Infinity});
}

const gnomeSort = (dataStruct) => {
	let clone = [...dataStruct];
	while(!isSorted(clone)) {
		clone = clone.sort(()=>Math.random()-.5);
	}
	return clone;
}

const bucketSort = (dataStruct, comparator=(a,b)=>a<b, otherSort=mergeSort) => {
	let dr = range(dataStruct);
	dr.dist = dr.max - dr.min;
	let clone = [...dataStruct];
	if (dr.dist === 0) {
		return clone; 
	}
	let buckets = [];
	for (let i = 0; i < dr.dist/dataStruct.length; i++) {
		buckets.push([]);
	}
	clone.forEach(e => {
		let index = Math.floor((buckets.length-1) * (dr.max - e + dr.min)/dr.dist);
		buckets[index].push(e);
	});
	return buckets.map(bucket => otherSort(bucket, comparator)).reduceRight((alr, next) => {
		return alr.concat(next);
	}, []);
}

const flatten = (arr) => {
	return arr.reduce((flat, next) => flat.concat(next),[])
}

const radixSort = (dataStruct, comparator=(a,b)=>a<b) => {
	let clone = [...dataStruct];
	let nextSort = [];
	const convertToIndex = (thing) => {
		if(typeof thing === 'number') {
			return thing;
		} else if (typeof thing === 'string') {
			return thing.charCodeAt(0);
		}
	}
	let maxLen = clone.reduce((maxLength, next) => Math.max(maxLength, next.toString().length), -Infinity);
	for (let i = 0; i < maxLen; i++) {
		clone.forEach(e => {
			let index = [convertToIndex(e.toString()[e.toString().length-1-i]) || 0];
			nextSort[index] = nextSort[index] || [];
			nextSort[index].push(e);
		});
		clone = flatten(nextSort);
		nextSort = [];
	}
	return clone;
}

const sort = {
	insertion: insertionSort,
	bubble: bubbleSort,
	selection: selectionSort,
	merge: mergeSort,
	bucket: bucketSort,
	radix: radixSort,
	gnome: gnomeSort,
	comb: combSort,
	quick: quickSort,
	isSorted,
}

module.exports = sort;