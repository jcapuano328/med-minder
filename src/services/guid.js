let hexdigits = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];

let randomInt = (low, high) => {
	return Math.floor(Math.random()*(high-low+1)) + low;
}

let randomOneOf = (list) => {
    return list[randomInt(0, list.length-1)];
}

let getGUID = (guidversion,randomId) => {
}

let idHexidecimal = (length) => {
	let hex = [];
	while (length-- > 0) {
		hex.push(randomOneOf(hexdigits));
	}
	return hex.join('');
}

let nodeId = [(randomInt(0,255)&0xff)|0x01,randomInt(0,255)&0xff,randomInt(0,255)&0xff,randomInt(0,255)&0xff,randomInt(0,255)&0xff,randomInt(0,255)&0xff];
let lastClockSeq = randomInt(10000, 1000000) & 0x3fff;;
let lastMsecs = 0;
let lastNsecs = 0;
let byteToHex = [];
let initializeV1 = () => {
	for (var q = 0; q < 256; q++) {
		byteToHex[q] = (q + 0x100).toString(16).substr(1);
	}
}
initializeV1();

let idTimestamp = (length) => {
	//https://tools.ietf.org/html/rfc4122#section-4.2.1
	let buf = [];
	let i = 0;
	let msecs = new Date().getTime();
	let nsecs = lastNsecs + 1;
	let clockseq = lastClockSeq;
	let dt = (msecs - lastMsecs) + ((nsecs - lastNsecs)/10000);
	if (dt < 0) {
		clockseq = clockseq + 1 & 0x3fff;
	}
	if (dt < 0 || msecs > lastMsecs) {
		nsecs = 0;
    }

	lastMsecs = msecs;
    lastNsecs = nsecs;
	lastClockSeq = clockseq;

	// Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    let tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    buf[i++] = tl >>> 24 & 0xff;
    buf[i++] = tl >>> 16 & 0xff;
    buf[i++] = tl >>> 8 & 0xff;
    buf[i++] = tl & 0xff;

    // `time_mid`
    let tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    buf[i++] = tmh >>> 8 & 0xff;
    buf[i++] = tmh & 0xff;

    // `time_high_and_version`
    buf[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    buf[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    buf[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    buf[i++] = clockseq & 0xff;

    // `node`
    for (var n = 0; n < 6; n++) {
      buf[i + n] = nodeId[n];
    }
	i = 0;
	return  byteToHex[buf[i++]] + byteToHex[buf[i++]] +
            byteToHex[buf[i++]] + byteToHex[buf[i++]] + '-' +
            byteToHex[buf[i++]] + byteToHex[buf[i++]] + '-' +
            byteToHex[buf[i++]] + byteToHex[buf[i++]] + '-' +
            byteToHex[buf[i++]] + byteToHex[buf[i++]] + '-' +
            byteToHex[buf[i++]] + byteToHex[buf[i++]] +
            byteToHex[buf[i++]] + byteToHex[buf[i++]] +
            byteToHex[buf[i++]] + byteToHex[buf[i++]];
}

module.exports = {
	v1(){
		return idTimestamp();
	},
	v4(){
		let version = 4;
		return [8,4,4,4,12].map((c,i) => {
			switch(i) {
				case 2:
					// group 3: first value must be the version
					return version + idHexidecimal(c-1);
				case 3:
					// group 4: the first val to be 8, 9, a or b
					return randomOneOf(['8','9','a','b']) + idHexidecimal(c-1);
				default:
					return idHexidecimal(c);
			}
		}).join('-');
	}
};
