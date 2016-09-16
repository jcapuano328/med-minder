'use strict'
var crypto = require('react-native-crypto');

let getGUID = (guidversion,randomId) => {
	/*
	 in:     (1) 'guidversion' (1=timestamp or 2=random) and (2) 'randomId' (a function and will be idHexidecimal or idTimestamp)
	 out:    returns ARRAY guid
	*/

	let value;
	let guidarray = [];
	let prev=0;

	for(var i = 0; i < 20; i++) {
		if(i >= 8) {
			if(i !== 8 && i % 8 == 0) {
				value = guidversion + randomId(3);  /* add group 3 */
				guidarray.push(value);
			} else if(i % 4 == 0) {
				value = randomId(i-prev);           /* add group 1 and 2 */
				guidarray.push(value);
				prev = i;
			}
		}
	}
	value = randomizer(1,'89ab');           /* the first val in col4 needs to be 8, 9, a or b */
	guidarray.push(value + randomId(3));    /* add group 4 */
	guidarray.push(randomId(12));           /* add group 5 */
	let guid = guidarray.join('-');
	return guid;
}
let idHexidecimal = (length) => {
	return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}
let idTimestamp = (length) => {
	let value = '';
	let num;
	let alphanum = '0123456789ABCDEF';

	for(var i = 0; i < length; i++){
		num = Math.floor(Math.random()*0x10).toString();
		value = value ? value + alphanum[num] : alphanum[num];
	}
	return value;
}
let randomizer = (num, chars) => {
	/*
	 in:     (1) 'num' (the number of characters to return) and (2) 'chars' (the string of chars to use for the randomization)
	 out:    returns STRING value
	*/

	let rand = crypto.randomBytes(num);
	let value = new Array(num);
	let charlength = chars.length;

	for (var i = 0; i < num; i++) {
		value[i] = chars[rand[i] % charlength]
	}
	return value.join('');
}

module.exports = {
	v1(){
		return return getGUID(1,idTimestamp);
	},
	v4(){
		return getGUID(4,idHexidecimal);
	}
};
