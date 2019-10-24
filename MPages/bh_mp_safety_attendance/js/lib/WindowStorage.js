var WindowStorage = {
    cache: null,

    get: function(key){
        if (window.name.length > 0) {
            this.cache = eval("(" + window.name + ")");
        }
        else {
            this.cache = {};
        }
        return unescape(this.cache[key]);
    },

    encodeString: function(value){
        return encodeURIComponent(value).replace(/'/g, "'")
										.replace(/[~!'()]/g, escape) 
										.replace(/\*/g, "%2A") 
										.replace(/\./g,"%2E") 
										.replace(/\_/g,"%5F") 
										.replace(/\-/g,"%2D"); 
	},
	
    set: function(key, value){
        this.get();
        if (typeof key != "undefined" && typeof value != "undefined") {
            this.cache[key] = value;
        }
        var jsonString = "{";
        var itemCount = 0;
        for (var item in this.cache) {
            if (itemCount > 0) {
                jsonString += ", ";
            }
            if(item === key){
                jsonString += "'" + this.encodeString(item) + "':'" + this.encodeString(this.cache[item]) + "'";
            }
            else{
                jsonString += "'" + item + "':'" + this.cache[item] + "'";
            }
            itemCount++;
        }
        jsonString += "}";
        window.name = jsonString;
    },
    del: function(key){
        this.get();
        delete this.cache[key];
        //this.serialize(this.cache);
    },
    clear: function(){
        window.name = "";
    }
};