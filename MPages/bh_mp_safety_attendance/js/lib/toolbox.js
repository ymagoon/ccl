function isEmpty(o) {
    var i, v;
    if (typeOf(o) === 'object') {
        for (i in o) {
            v = o[i];
            if (v !== undefined && typeOf(v) !== 'function') {
                return false;
            }
        }
    }
    return true;
}

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}


function copyArray(array){
	var copy = [];
	for(var i = 0,l = array.length;i<l;i++){
		
		if(typeOf(array[i]) === "array"){
			copy.push(copyArray(array[i]));
		}
		if(typeOf(array[i]) === "object"){
			copy.push(Object.create(array[i]));
		}
		else{
			copy.push(array[i]);
		}
	}
	return copy;
}
