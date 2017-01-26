const sorts = require('./sorts.js');

const memFibCache = [];
const memFib = (n) => {
	if (memFibCache[n]) return memFibCache[n];
	let retval = n <= 1 ? n : memFib(n-1) + memFib(n-2);
	memFibCache[n] = retval;
	return retval;
}

const checkSorted = (dataStruct) => {
	if (!sorts.isSorted(dataStruct)) {
		throw new Error('Data Structure must be sorted first');
	}
}

const fibonnaciSearch = (dataStruct, elem) => {
	let clone = [...dataStruct];
	checkSorted(clone);
	let offset = -1;
	let cap = memFib(0);
	let k = 1;
	while(cap < dataStruct.length) {
		cap = memFib(k++);
	}
	let down1 = memFib(k - 1);
	let down2 = memFib(k - 2);
	while (cap > 1) {
		let i = Math.min(offset + down2, dataStruct.length-1);
		if (clone[i] < elem) {
			cap = down1;
			down1 = down2;
			down2 = cap - down1;
			offset = i;
		} else if (clone[i] > elem) {
			cap = down2;
			down1 = down1 - down2;
			down2 = cap - down1;
		} else {
			return i;
		}
	} 
	if (down1 && clone[offset +1] === elem) return offset +1;
	return -1;
}

const jumpSearch = (dataStruct, elem) => {
	let clone = [...dataStruct];
	checkSorted(clone);
	let jumpSize = Math.floor(Math.sqrt(dataStruct.length));
	for (let i = 0; i < dataStruct.length; i += jumpSize) {
		if (elem === clone[i]) {
			return i;
		} else if (elem < clone[i]) {
			let lowerBound = i-jumpSize;
			let upperBound = i;
			let recur = jumpSearch(clone.slice(lowerBound, upperBound), elem);
			if (recur !== -1) {
				return lowerBound + recur;
			}
		}
	}
	return clone[clone.length-1] === elem ? clone.length-1 : -1;
}

const linearSearch = (dataStruct, elem) => {
	for (let i = 0; i < dataStruct.length; i ++) {
		if (dataStruct[i] === elem) {
			return i;
		}
	}
	return -1;
}

const selection = {
	linear: linearSearch,
	fibonnaci: fibonnaciSearch,
	jump: jumpSearch
}

module.exports = selection;