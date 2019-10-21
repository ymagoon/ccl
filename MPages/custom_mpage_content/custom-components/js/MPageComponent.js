/* Topic: License 
	The MIT License
	
	Copyright (c) 2011 University of New Mexico Hospitals 
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
/* Class: MPage.Component
	base class for MPage components.
	*/
	/* Property: data
		JS struct to store data after callbacks. Normally set by <loadData>
		*/
	
	
	/* Property: cclProgram
		default CCL called by <loadData>, may not be necessary for all components 
		
		Normally set in <init> o
		
		See Also:
		* <cclParams>
		
		*/	
	/* Property: cclParams
		Array, Parameters for default CCL called by <loadData>, may not be necessary for all components
		
		If not defined, these params will be generated, via <_getStandardParams>
		
		
		Set Also:
		* <cclProgram>
		
		*/
	/* Property: cclDataType
		Default dataType expected by <loadCCL>, Default: JSON.
		
		Value must be "JSON", "XML" or "TEXT".
		
		See:
			<loadCCL>
		*/
	/* Property: _target
		*Non-Standard* target element id or DOM element instance for this component. 
		Set in <init> or <generate>, can be overridden in <render>
		*/
	/* Function: create
		*Non-Standard* Initializes a component *DO NOT OVERRIDE*
		
		Parameters:
			target	-	id or DOM element in which to display this component
			options	-	JSON or JavaScript options object containing 
						configuration information for this component
		Note: init() will be called by create
		
		*/
	/* Function: init
		*Component Override* Initializes a component
		
		override this function to provide component-specific initialization. 
		"this.options" will contain any options for this component. 
		
		*/
	/* Function: resize
		*Component Override* resize event handler
		
		Parameters:
			w		-	new width of container in pixels
			h		-	new height of container in pixels
		
		This function may be called when the size of this element has changed. 
		Components should override this function if they have any UI that 
		must be changed after a resize 
		
		*/
	/* Function: throwNewError
		Throws an error
		
		Parameters:
			desc		-	String, description of error
			errorObj	-	*Optional, default null*
							Error object previously caught in a try...catch block
							
							
		Normally components should pass any errors up up to the framework. 
		If this is not possible because of Async callbacks in AJAX, 
		window.setTimout/Interval, onClick handlers, etc., this function can 
		be used to inform the framework that an error has occurred.
		
		Note: 
		
		This function should only be called for un-recoverable errors, 
		and is not intended as a logging system. Processing may not stop 
		after calling this function, so be sure to manually exit processing
		via a return; or a break [label]; to prevent further execution.
		 
		
		*/
	/* Function: unload
		*Component Override* unload event handler
		
		This function is called whenever the page is about to be unloaded or 
		if the component is being permanently discarded. Components can 
		override this function to perform any end-of-life processing such 
		as deleting DOM event listeners, unregistering from shared component
		stores, etc.
		
		*/
	
	/* Function: getTarget
		returns a DOM element reference for a supplied target
		
		Parameters;
			target	-	*Optional, default local <target> property*
						ID or DOM element to find
						
		Detail:
			This function will always return a DOM element.
			
			
			* 	If _target_ is undefined, then _target_ will be set to the local 
				<target> property. 
			*	If the local <target> property is also undefined, then undefined will be returned
			* 	If _target_ is a DOM element it will be returned
			* 	If _target_ is a String, and an element with that id exists, a 
				reference to that element will be returned
			* 	If _target_ is a String, and an element with that id does not exist, 
				undefined will be returned
		*/
		
	
	
	/* Function: loadData
		*Component Override* Loads all data that this MPage.Component needs and saves 
		it into <data>
		
		Parameters:
			callback	-	*Optional, default null*
							Function. Called when <loadData> completes
							
		Callback Parameters:
			component	-	a reference to this component
		
		Events:
			dataloded	-	fired when complete, and after _callback_. Passes "this"
							
		Detail:
			The default implmentation will call <loadCCL> with <ccl> and 
			<cclParams>, attempt to evaluate the response as JSON, and save the 
			result to this.<data>
			
			Component developers can override this function to perform 
			component specific data loading. If overridden, it should still call 
			<loadCCL> for ccl loading, save the interpreted data to this.<data>, 
			call _callback_ if provided, and fire the	"dataloaded" event
			
		*/	
	/* Function: render
		*Component Override* renders this MPage.Component.
		
		Parameters:
			target	-	*Optional, default local <target> property*
						ID or DOM element to render to
						
		Detail:
			This function must be overridden by the component developer to create 
			the UI for the component. The component developer should pass _target_ 
			to	<getTarget> to properly resolve the DOM element that _target_ 
			represents. Components are expected to manage the innerHTML of _target_
			but not manipulate any other properties of _target_, such as the id, 
			style properties or event handlers. Components can add expando 
			properties to _target_ if necessary 
			
		(code)
			//Override render in MyComponent
			www.MyComponent.prototype.render = function(target){
				var dom = this.getTarget(target)
				var buffer =[]
				buffer.push('<table	border="0">');
					buffer.push('<tr>');
						buffer.push('<th>First Name</th>');
						buffer.push('<th>Last Name</th>');
					buffer.push('</tr>');
				for (var i = 0; i< this.data.length; ++i){
					var row = this.data[i];
					buffer.push('<tr>');
						buffer.push('<td>' + row.first_name + '</td>');
						buffer.push('<td>' + row.last_name + '</td>');
					buffer.push('</tr>');
				}
				buffer.push('</table>');
				dom.innerHTML = buffer.join("\n")
			}
		(end)
		*/
	/* Function: loadCCL
		*Framework Override* Calls a ccl and returns data via async callback
		
		Parameters:
			ccl			-	ccl script to run
			cclParams	-	Array of CCL parameters to pass
			callback	-	callback function to execute when data is available. See 
							*Callback Parameters* below
			cclDataType	-	*Optional, default:* <MPage.Component.cclDataType>
							Datatype of the result. see the _response_ callback parameters below.
	
		Callback Parameters:
			component		-	this component
			response		-	response from the CCL call. If 
								_cclDataType_ = "JSON", then this will be a JS 
								object, if _cclDataType_ = "XML" the this will 
								be an XML DOM object, if _cclDataType_ = "TEXT" 
								then this be returned the raw text response
			
		Component developers should always use this call to execute ccl scripts 
		rather than directly accessing XMLCclRequest
		
		The default implementation uses XMLCclRequest to execute the _ccl_ script
		
		Framework developers can override this function to provide a richer interface 
		to callbacks
		
		*/
	/* Function: getProperty
		*Framework Override* returns page variables by name.
		
		Parameters:
			name	-	name of parameter to get
			
		Returns:
			value of _name_
		
		Component developers should use this function to access local 
		variables. The framework is expected to expose "global" variables such 
		as "userId" and "personId" as local properties via this funciton 
		
		Framework/base-class developers must override this function to find the requested 
		_name_ in the appropriate scope. If the requested _name_ exists directly on 
		the component, that value must be returned.
		
		Example Implementation:
		(code)
			//override "get"
			MPage.Component.prototype.getProperty = function(name){
				if (name in this) return this[name];
				
				//now check URL 
				var regex = new RegExp("[\\?&]"+name+"=([^&#]*)");
				var qs = regex.exec(window.location.href.replace(/%26/g,"&"));
				if (qs == null) {
					return mull
				} else {
					return qs[1];
				}
			}
		(end)
		
		
		*/
	/* Function: setProperty
		Sets a property on this component instance
		
		Parameters:
			name		-	property name
			value		-	property value
			
		Note:
			This can be used to set a local override for any  "global" 
			properties provided by the Page such as
			
			* userId
			* personId
			* encounterId
			
		Returns:
			This component instance
			
		Example:
		(code)
			var comp = new univnm.NamesTable().generate("my_div_id_1")
				.setProperty("cclProgram","1_uh_mp_names")
				.setProperty("cclParams",["MINE"])
				.setProperty("personId",window.personId)
		(end)
		
		See Also:
			* <setProperties>
		*/
	/* Function: setProperties
		Sets multiple properties on this component instance
		
		Parameters:
			name		-	property object
			
			
		Note:
			This can be used to set a local override for any  "global" 
			properties provided by the Page such as
			
			* userId
			* personId
			* encounterId
			
		Returns:
			This component instance
			
		Example:
		(code)
		var comp = new univnm.NamesTable().generate("my_div_id_1").setProperties({
			cclProgram:"1_uh_mp_names",
			cclParams:["MINE"],
			personId:window.personID
		})
		(end)
		
		See Also:
			* <setProperty>
		*/
	/*  */	
	/* Function: generate
		*Non-Standard* Executes <create>, <loadData>, and <render>
		
		Parameters:
			target		-	Id or Dom object that should contain this component's HTML
			options		-	component options object or JSON string
			callback	-	See _callback_ in <loadData>
			
		Returns:
			this
			
		Detail:
			This is used to create and render a component in a single step
		
		(code)
			<script>
				window.onload = function(){
					new www.CustomComponent().generate("my_div_id_1")
					
					var comp = new univnm.NamesTable().generate("my_div_id_1",{
						cclProgram:"1_uh_mp_names",//handled by base class
						cclParams:["MINE"],//handled by base class
						personId:window.personID,//handled by base class
						customOption:"bob"//handled by init()
					})
					
				}
			<script>
		(end)
		
		See Also:
			* <create>
			* <init>
			* <loadData>
			* <render>
		*/
	/* Function: _getStandardParams
		*internal, Non-Standard* returns a standard param array
	
		Standard Params:
		"MINE"							-	standard outdev
		this.getProperty("personId")	-	Patient id, from the environment, see <get>
		this.getProperty("encounterId")	-	Encounter id, from the environment, see <get>
		this.getProperty("userId")		-	User id, from the environment, see <get> 
		*/	
/* MPage.Component base class */
if (typeof MPage == "undefined") MPage={
	Properties: 
    ( (typeof MPageProperties != 'undefined') /* if MPageProperties exists... */
      ? MPageProperties                       /* it supersedes the default */
      : {personId     : 0                     /* else the default object.properties */
        ,encounterId  : 0
        ,userId       : 0
        }
    )  
  ,namespace:function(name){
		var parts =name.split(".")
		var result = window;
		while (parts.length){
			var part = parts.shift();
			result = result[part] = result[part] || {};
		}
		return result
	}
	//non-standard function
	,_generatePageUniqueId:function(){
		var my = arguments.callee;
		if (!my.counter){ my.counter=0; }
		++my.counter;
		return "MpageComponent_" + my.counter;
	}
};

MPage.Component = function(){
};

/* default properties */
MPage.Component.prototype.options = {
	
};
MPage.Component.prototype.data = null;

MPage.Component.prototype.cclDataType = "JSON";
MPage.Component.prototype.componentMinimumSpecVersion = 1.0;
MPage.Component.prototype.baseclassSpecVersion = null;

	
MPage.Component.prototype.create = function(target,options){
	this.cclParams=[]
	if (target) this._target=target
	this.options =options||{
		cclParams:[]	
	};
	if (!this.options.cclParams){
		this.options.cclParams=[]
	}
	
	var standardOptions = [
		"cclProgram",
		"cclParams"
	]
	for (var i = 0; i < standardOptions.length; ++i){
		var option = standardOptions[i];
		if (option in this.options){
			this[option] = this.options[option]	
		}
	}
	this.init();
	return this
}	

MPage.Component.prototype.init = function(options){
}
MPage.Component.prototype.resize=function(w,h){
}
MPage.Component.prototype.unload=function(){
}

MPage.Component.prototype._getStandardParams = function(){
	return [
		"MINE",
		this.getProperty("personId"),
		this.getProperty("encounterId"),
		this.getProperty("userId")
	]
}
MPage.Component.prototype.getComponentUid = function(){
	var my = arguments.callee;
	if (!my.id) my.id=MPage._generatePageUniqueId()
	return my.id
}
		
MPage.Component.prototype.getTarget = function(target){
	target =target||this._target;
	var element;
	if (typeof target == "string"){
		if (document.getElementById(target)) {
			
			element= document.getElementById(target)
		} else {
			return undefined;
		}
	} else if (typeof target =="object" && "tagName" in target){
		element= target;
	} else {
		//should never get here
		return undefined
	}
	this._target = element;
	return element;
}

MPage.Component.prototype.loadData = function(callback){
	var component = this;
	var params =this.cclParams

	if (!params || !params.length) params = this._getStandardParams() 
	if (this.cclProgram){
		this.loadCCL(
			this.cclProgram,
			params,
			function(response){
				component.data=response;
				callback(component)
			},
			this.cclDataType
		)	
	} else if (callback) {
		callback(this)
	}
}

MPage.Component.prototype.loadCCL = function(cclProgram,cclParams,callback,cclDataType){
	var component = this;
	var me = arguments.callee;
	var my = me;
	if (!("seqNum" in my)) my.seqNum=0;
	my.seqNum++;
	if (!("history" in my)) my.history =[]
	if (my.history.length > 10) my.history.shift();

	var transaction = {
		ccl:cclProgram,
		cclParams:cclParams,
		cclDataType:cclDataType||component.cclDataType||"JSON",
		handler:callback,
		id:my.seqNum,
		responseText:"",
		xcr:{}
	}
	
	my.history.push(transaction);
	//wraps string paramters with text delimiters
	var collapseParams =function(){
		if (typeof transaction.cclParams == "string"){
			return transaction.cclParams
		}else {
			var params=[]
			for(var i=0;i<transaction.cclParams.length;++i){
				var arg = transaction.cclParams[i]
				if (!arg && parseFloat(arg) != arg){
					params[i]= "";
				}
				if (typeof(arg) == 'string'){
					if (!/'/.test(arg)){
						params[i]= "'" + arg + "'"
					}else if (!/\^/.test(arg)){
						params[i]= '^' + arg +'^'
					} else if (!/"/.test(arg)){
						params[i]= '"' + arg +'"'
					}else{
						throw new Error("Unable to find a quote for " + arg)
					}
				} 
				else if (typeof(arg) == 'object') {
                    valueParams = [];
                    $.each(arg,function(idx,val) {
                        if (typeof val == "string") {
                            valueParams.push("^" + val + "^");
                        } else if (typeof val == "number") {
                            if (!/\.0$/.test(val)) {
                                valueParams.push(val + ".0");
                            }
                            else {
                                valueParams.push(val);
                            }
                        }
                    });
                    params[i] = 'value(' + valueParams.join() + ')';
                }
                /*else if (typeof(arg) == "number") {
                    if (!/\.0$/.test(arg)) {
                        params[i] = arg + ".0";
                    }
                }*/
                else {
					params[i]= arg;	
				}
			}
			return params.join()
		}
	}
        
	transaction.xcr = new XMLCclRequest();
	
	var handleResult = function(){
		var response = transaction.xcr.responseText
		var data=response;
		switch (transaction.cclDataType.toUpperCase()){
			case "JSON":
				if (typeof JSON == "undefined"){
					data=response?eval("("+response+")"):{}
				} else {
					data=response?JSON.parse(response):{}
				}
				break;
			case "XML":
				if (window.DOMParser){
					data =new DOMParser().parseFromString(response,"text/xml");
				}else{ // Internet Explorer
					data=new ActiveXObject("Microsoft.XMLDOM");
					data.async="false";
					data.loadXML(response);
				}
				break;
		}
		transaction.handler.call(this,data);
	}
	transaction.xcr.onreadystatechange=function (){
		try{
			if (transaction.xcr.readyState==4) {
				
				var status = transaction.xcr.status
				
				if (status=="200" || status=="0"){

					//fixed memory leak in old MPages XCR code
					if (typeof XMLCCLREQUESTOBJECTPOINTER =="object"){
						for (var id in XMLCCLREQUESTOBJECTPOINTER){
							if (XMLCCLREQUESTOBJECTPOINTER[id] === transaction.xcr){
								delete XMLCCLREQUESTOBJECTPOINTER[id];
							}
						}
					}
					
					handleResult()
				}else{
					component.throwNewError([
						'** Failed Callback **',
						'\nccl: 				',
						'\t' +transaction.ccl,
						'\ncclParams: 	',
						'\t'+ collapseParams(),
						'\nResponse Text:',
						'\t' +transaction.xcr.responseText,
						'\nStatus Text:',
						'\t'+transaction.xcr.statusText
					].join("\n"))
				}
			}
		} catch(e){
			alert(e.message);
alert( "CCL Transaction:\n" + JSON.stringify( transaction ) );
			console.log(e);
			console.log(e.message);
			component.throwNewError(e);
		}
	}
	
	transaction.xcr.open("GET", transaction.ccl, true);
	transaction.xcr.send(collapseParams());
	
	return null;
}

MPage.Component.prototype.render = function(target){}

//non-standard
MPage.Component.prototype.generate = function(target,callback,options){
	this.create(target,options);
	this.loadData(function(thisComponent){
		thisComponent.render()
		if (typeof callback == "function") callback(thisComponent);
	})
	return this;
}

MPage.Component.prototype.throwNewError = function(desc,errorObj){
	if (errorObj) throw errorObj;
	throw new Error(desc)
}

MPage.Component.prototype.getProperty = function(name){
	var value=undefined
	if (name in this && this[name] !== null) {
		value = this[name];
	} else if (name in MPage.Properties){
		value= MPage.Properties[name]
	} 
	
	return value;
}
MPage.Component.prototype.setProperty = function(name,value){
	this[name] = value;
	return this;//will evaluate to true
}

MPage.Component.prototype.setProperties = function(obj){
	if (!obj) return this
	for (var p in obj){
		if (obj.hasOwnProperty(p)){
			this.setProperty(p,obj[p])	
		}
	}
	return this
}

/*
20140507 msd - eric shared with me that Cerner framework extends Date
so if MPageComponents.js (this file) is the standard+modificaton for MPage
it makes the most sense to add this date-extension here
*/
Date.prototype.setISO8601 = function (string) {
var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
var d = string.match(new RegExp(regexp));
 
var offset = 0;
var date = new Date(d[1], 0, 1);
 
if (d[3]) { date.setMonth(d[3] - 1); }
if (d[5]) { date.setDate(d[5]); }
if (d[7]) { date.setHours(d[7]); }
if (d[8]) { date.setMinutes(d[8]); }
if (d[10]) { date.setSeconds(d[10]); }
if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
if (d[14]) {
offset = (Number(d[16]) * 60) + Number(d[17]);
offset *= ((d[15] == '-') ? 1 : -1);
}
 
offset -= date.getTimezoneOffset();
time = (Number(date) + (offset * 60 * 1000));
this.setTime(Number(time));
return this; /* make this function chainable */
}

/* 20140507msd modified from ../UnifiedContent/js/master-core-util.js */
MPage.Component.prototype.refresh = function(){
  var parentComp=null;
  var target=null;
  target=this.getTarget();
  if(target){
    $(target).html( /* reset contents with a div that's the same height as the current container */
      $('<div>Reloading...</div>').height( $(target).height() )
      )
    }
  parentComp = this.getOption("parentComp");
  if(parentComp){
    CERN_CUSTOM_COMP_O1.ReloadCustomComp(parentComp,this);
    }
  else { /* not cerner */
    var comp = this;
    comp.loadData( 
      function(){ 
        $( target ).empty(); /* empty target container */
        comp.render.apply(comp); /* rerender */
        } 
      );
    }
};

/* 20140523msd cerner added this to their framework, so we're adding it in case a component uses it */
MPage.Component.prototype.getOption = function(p){ return this.options[ p ]; }


MPage.namespace("uhspa");