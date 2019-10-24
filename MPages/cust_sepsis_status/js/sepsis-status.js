MPage.namespace("cerner");

/*Initialize Sepsis Alert Status Component*/
cerner.sepsis_status = function(){};
cerner.sepsis_status.prototype = new MPage.Component();
cerner.sepsis_status.prototype.constructor = MPage.Component;
cerner.sepsis_status.prototype.base = MPage.Component.prototype;
cerner.sepsis_status.prototype.name = "cerner.sepsis_status";
cerner.sepsis_status.prototype.cclProgram = "MP_GET_SEPSIS_ALERT_STATUS";
cerner.sepsis_status.prototype.cclParams = "";
cerner.sepsis_status.prototype.cclDataType = "JSON";

/* Initialize the cclParams variable */
cerner.sepsis_status.prototype.init = function(options){
	var params = [];
	params.push("MINE");
	this.cclParams = params;
};

/* Render the basic layout of the component */
cerner.sepsis_status.prototype.render = function(){
	var component = this;
	var compId;
	var status;
	var contentArea = this.getTarget();
	var divElement = document.createElement("div");
	
	status = component.data.SEPSISSTATUS;
	compId = component.getComponentUid();

	if (status.STATUS === 0) {
		divElement.innerHTML = "Downtime alert: Sepsis alerts are not functioning properly at this time.";  //alerts status down
		divElement.className = 'cerner_sepsis_status_red';
	} else if (status.STATUS === 1) {
		divElement.innerHTML = "Sepsis alerts are functioning properly.";  //alerts status working
		divElement.className = 'cerner_sepsis_status_black';
	} else if (status.STATUS === 2) {
		divElement.innerHTML = "Downtime alert: Sepsis alerts are not functioning properly at this time.";  //alerts status delays
		divElement.className = 'cerner_sepsis_status_red';
	} else {
		divElement.innerHTML = "Unable to determine the status of the sepsis alerts.";  //alerts status unknown
		divElement.className = 'cerner_sepsis_status_black';
	}
	contentArea.appendChild(divElement);
};