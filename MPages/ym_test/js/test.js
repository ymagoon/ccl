if (baycfl == undefined) {
	var baycfl = new Object();
}

baycfl.MyComponent = function(){};
baycfl.MyComponent.prototype = new MPage.Component();
baycfl.MyComponent.prototype.constructor = MPage.Component;
baycfl.MyComponent.prototype.base = MPage.Component.prototype;

baycfl.MyComponent.prototype.render = function(){
	var oDiv = this.getTarget();
	oDiv.innerHTML = “Hello World”;
};

