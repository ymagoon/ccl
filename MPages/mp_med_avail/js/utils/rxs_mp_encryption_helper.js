String.prototype.replaceAll = function (srch, repl) {
	var cur = this, prev;
	if (typeof (srch) == "object" && srch.length) {
		for (var i=0,len=srch.length;i<len;i++) {
			if (typeof (repl) == "object" && repl.length){
				if (srch.length != repl.length || repl.length === 0)
					return this;
				cur = cur.replaceAll(srch[i], repl[i]);
			}
			else {
				cur = cur.replaceAll(srch[i], repl);
			}
		}
	}
	else {
		do {
			prev = cur;
			cur = cur.replace(srch,repl);
		} while(cur != prev);
	}
	return cur;
};

function rstr2b64(input) {
	var b64pad = "="; /* base-64 pad character. "=" for strict RFC compliance   */
    b64pad = b64pad || '';
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet = (input[i] << 16)
            | (i + 1 < len ? input[i + 1] << 8 : 0)
                | (i + 2 < len ? input[i + 2] : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) { output += b64pad; }
            else { output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F); }
        }
    }
    return output;
};

function base64UrlEncode(data) {
	return rstr2b64(data).replaceAll([/\+/,/\//,/(=$)/],['-','_','']);
};

function doEncryption(unencodedText, onEncryptComplete) { 
	var password = "yqszrhxuiatbiozp";
	var salt = "sixteenbyteslong"; // if length of salt is less than 8, pad with null (\0)
	var iterations = 50; //used to be 1000
	var keySize = 128;
	
	//Asynch encryption call
	encrypt(password, salt, iterations, keySize, unencodedText, onEncryptComplete);
	//encryptSanspbkdf2(password, salt, iterations, keySize, unencodedText, onEncryptComplete);
};