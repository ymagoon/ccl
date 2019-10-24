function getXMLCclRequest(){var xmlHttp=null;
if(location.protocol.substr(0,4)=="http"){try{xmlHttp=new XMLHttpRequest();
}catch(e){try{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
}catch(e){xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
}}}else{xmlHttp=new XMLCclRequest();
}return xmlHttp;
}var popupWindowHandle;
function getPopupWindowHandle(){return popupWindowHandle;
}XMLCclRequest=function(options){this.onreadystatechange=function(){return null;
};
this.options=options||{};
this.readyState=0;
this.responseText="";
this.status=0;
this.statusText="";
this.sendFlag=false;
this.errorFlag=false;
this.responseBody=this.responseXML=this.async=true;
this.requestBinding=null;
this.requestText=null;
this.blobIn=null;
this.onerror=this.abort=this.getAllResponseHeaders=this.getResponseHeader=function(){return null;
};
this.open=function(method,url,async){if(method.toLowerCase()!="get"&&method.toLowerCase()!="post"){this.errorFlag=true;
this.status=405;
this.statusText="Method not Allowed";
return false;
}this.method=method.toUpperCase();
this.url=url;
this.async=async!=null?(async?true:false):true;
this.requestHeaders=null;
this.responseText="";
this.responseBody=this.responseXML=null;
this.readyState=1;
this.sendFlag=false;
this.requestText="";
this.onreadystatechange();
};
this.send=function(param){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}this.sendFlag=true;
this.requestLen=param.length;
this.requestText=param;
var uniqueId=this.url+"-"+(new Date()).getTime()+"-"+Math.floor(Math.random()*99999);
XMLCCLREQUESTOBJECTPOINTER[uniqueId]=this;
window.location='javascript:XMLCCLREQUEST_Send("'+uniqueId+'")';
};
this.setRequestHeader=function(name,value){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(!value){return false;
}if(!this.requestHeaders){this.requestHeaders=[];
}this.requestHeaders[name]=value;
};
this.setBlobIn=function(blob){this.blobIn=blob;
};
};
XMLCCLREQUESTOBJECTPOINTER=[];
function evaluate(x){return eval(x);
}function CCLLINK__(program,param,nViewerType){}function CCLLINK(program,param,nViewerType){var paramLength=param.length;
if(paramLength>2000){param=param.substring(0,2000);
}var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLLINK__("'+program+'","'+param+'",'+nViewerType+","+paramLength+")";
el.click();
}function CCLNEWWINDOW(url){var newWindow=window.open(url,"","fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no");
newWindow.focus();
}function CCLEVENT__(eventId,eventData){}function CCLEVENT(eventId,eventData){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLEVENT__("'+eventId+'")';
el.click();
}function CCLNEWSESSIONWINDOW__(sUrl,sName,sFeatures,bReplace,bModal){}function CCLNEWSESSIONWINDOW(sUrl,sName,sFeatures,bReplace,bModal){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLNEWSESSIONWINDOW__("'+sUrl+'","'+sName+'","'+sFeatures+'",'+bReplace+","+bModal+")";
el.click();
if(bModal==0){popupWindowHandle=window.open(sUrl,sName,sFeatures,bReplace);
if(popupWindowHandle){popupWindowHandle.focus();
}}}function APPLINK(mode,appname,param){if(mode==0){window.open("file:///"+appname+" "+param);
}else{window.location="file:///"+appname+" "+param;
}}function MPAGES_EVENT__(eventType,eventParams){}function MPAGES_EVENT(eventType,eventParams){var paramLength=eventParams.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+eventParams+'"';
eventParams=eventParams.substring(0,2000);
}window.location.href="javascript:MPAGES_EVENT__('"+eventType+"','"+eventParams+"',"+paramLength+")";
}function ArgumentURL(){this.getArgument=_getArg;
this.setArgument=_setArg;
this.removeArgument=_removeArg;
this.toString=_toString;
this.arguments=new Array();
var separator=",";
var equalsign="=";
var str=window.location.search.replace(/%20/g," ");
var index=str.indexOf("?");
var sInfo;
var infoArray=new Array();
var tmp;
if(index!=-1){sInfo=str.substring(index+1,str.length);
infoArray=sInfo.split(separator);
}for(var i=0;
i<infoArray.length;
i++){tmp=infoArray[i].split(equalsign);
if(tmp[0]!=""){var t=tmp[0];
this.arguments[tmp[0]]=new Object();
this.arguments[tmp[0]].value=tmp[1];
this.arguments[tmp[0]].name=tmp[0];
}}function _toString(){var s="";
var once=true;
for(i in this.arguments){if(once){s+="?";
once=false;
}s+=this.arguments[i].name;
s+=equalsign;
s+=this.arguments[i].value;
s+=separator;
}return s.replace(/ /g,"%20");
}function _getArg(name){if(typeof(this.arguments[name].name)!="string"){return null;
}else{return this.arguments[name].value;
}}function _setArg(name,value){this.arguments[name]=new Object();
this.arguments[name].name=name;
this.arguments[name].value=value;
}function _removeArg(name){this.arguments[name]=null;
}return this;
}var ExternalDebugger=(function(){var debuggerObj=false,prevDebuggerObj,debuggerDefined=false,bufferOutput=" ";
return({initialize:function(dObj){prevDebuggerObj=debuggerObj;
debuggerObj=dObj;
ExternalDebugger.reset();
if(prevDebuggerObj){debuggerObj.innerHTML=prevDebuggerObj.innerHTML;
}},define:function(){debuggerDefined=true;
bufferOutput=" ";
},reset:function(){try{if(debuggerObj){debuggerObj.innerHTML=" ";
}}catch(err){if(prevDebuggerObj){prevDebuggerObj.innerHTML=" ";
}}},isDefined:function(){return debuggerDefined;
},isInitialized:function(){if(debuggerObj){return true;
}return false;
},loadBufferOutput:function(){debuggerObj.innerHTML+=bufferOutput;
},clearBufferOutput:function(){bufferOutput=" ";
},sendBufferOutput:function(outData){bufferOutput+=outData;
},sendOutput:function(outData){try{if(debuggerObj){debuggerObj.innerHTML+=outData;
}}catch(err){if(prevDebuggerObj){prevDebuggerObj.innerHTML+=outData;
}}}});
}());
var UtilJsonXmlDebugWindow;
var UtilJsonXml=function(prefs){var cur_dt_tm=new Date(),_w=window,_d=document,that=this,xCclPanel,messages={json_parsing_failed:"JSON Parsing Failed"},truncate_zeros=true,whtSpEnds=new RegExp("^\\s*|\\s*$","g"),whtSpMult=new RegExp("\\s\\s+","g"),error_handler=function(msg,fnc){alert(msg+" - "+fnc);
},RealTypeOf=function(v){try{if(typeof(v)==="object"){if(v===null){return"null";
}if(v.constructor===([]).constructor){return"array";
}if(v.constructor===(new Date()).constructor){return"date";
}if(v.constructor===(new RegExp()).constructor){return"regex";
}return"object";
}if(v!=""&&!isNaN(Number(v))){return"number";
}else{return typeof(v);
}}catch(e){error_handler(e.message,"RealTypeOf()");
}},format_json=function(jObj,sIndent){try{if(!sIndent){sIndent="";
}var sIndentStyle="&nbsp;&nbsp;",iCount=0,sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=("<br>"+sIndent+sIndentStyle);
}else{sHTML+=("<br>"+sIndent+sIndentStyle+'"'+j+'": ');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=format_json(jObj[j],(sIndent+sIndentStyle));
break;
case"boolean":case"number":sHTML+=jObj[j].toString();
break;
case"null":sHTML+="null";
break;
case"string":sHTML+=('"'+jObj[j]+'"');
break;
case"function":break;
default:sHTML+=("TYPEOF: "+typeof(jObj[j]));
}iCount=iCount+1;
}}if(sDataType==="array"){sHTML+=("<br>"+sIndent+"]");
}else{sHTML+=("<br>"+sIndent+"}");
}return sHTML;
}catch(e){error_handler(e.message,"format_json()");
}},format_xml=function(Obj,sIndent){try{var str="",sIndentStyle="&nbsp;&nbsp;",i=0,j=0;
if(!sIndent){sIndent="";
}for(i=0;
i<Obj.childNodes.length;
i++){if(Obj.childNodes[i].tagName){str+=sIndent+"&#60"+Obj.childNodes[i].tagName;
if(Obj.childNodes[i].attributes){for(j=0;
j<Obj.childNodes[i].attributes.length;
j++){str+="&nbsp;&nbsp;"+Obj.childNodes[i].attributes[j].name+"&nbsp;=&nbsp;'"+Obj.childNodes[i].attributes[j].value+"'";
}}str+="&#62;<br>";
}if(!Obj.childNodes[i].nodeValue&&RealTypeOf(Obj.childNodes[i].childNodes)==="object"){str+=sIndent+format_xml(Obj.childNodes[i],sIndent+sIndentStyle);
}else{if(Obj.childNodes[i].nodeValue){str+=sIndent+Obj.childNodes[i].nodeValue+"<br>";
}}if(Obj.childNodes[i].tagName){str+=sIndent+"&#60/"+Obj.childNodes[i].tagName+"&#62;<br>";
}}return str;
}catch(e){error_handler(e.message,"format_xml()");
}},normalizeString=function(s){s=s.replace(whtSpMult," ");
s=s.replace(whtSpEnds,"");
return(s);
},createDocument=function(){try{if(typeof arguments.callee.activeXString!=="string"){var versions=["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"],i,len=versions.length;
for(i=0;
i<len;
i+=1){try{this.xml_object=new ActiveXObject(versions[i]);
arguments.callee.activeXString=versions[i];
return this.xml_object;
}catch(ex){}}}return new ActiveXObject(arguments.callee.activeXString);
}catch(e){error_handler(e.message,"createDocument()");
}},ReadFromFile=function(sFile){try{var ForReading=1,TriStateFalse=0,fso=new ActiveXObject("Scripting.FileSystemObject"),fileText="",path_split=[],sfile_split=sFile.split("$");
if(sfile_split.length==1){if(location.href){path_split=location.href.split("?")[0];
path_split=path_split.split("%20").join(" ").split("file:///").join("").split("file:").join("").split("/");
path_split=path_split.slice(0,path_split.length-2);
path_split=path_split.join("\\");
sFile=sFile.split("/").join("\\");
}sFile=(path_split+sFile);
}else{sFile=sfile_split[1];
}inFile=fso.OpenTextFile(sFile,ForReading,true);
fileText=inFile.ReadAll();
inFile.close();
return fileText;
}catch(err){error_handler(err.message,"ReadFromFile()");
return"";
}},init=function(){if(prefs&&RealTypeOf(prefs)=="object"){if(prefs.debug_mode_ind){that.debug_mode_ind=prefs.debug_mode_ind;
}if(that.debug_mode_ind==1&&!ExternalDebugger.isInitialized()&&(!prefs.disable_firebug)){ExternalDebugger.define();
appendDebugJavaScriptTag("..\\js\\firebug-lite.js");
console.log("Debugging mode turned on");
if(Firebug){Firebug.extend(function(FBL){with(FBL){var panelName="XmlCclRequest";
Firebug.XmlCclRequest=extend(Firebug.Module,{getPanel:function(){return Firebug.chrome?Firebug.chrome.getPanel(panelName):null;
},clear:function(){ExternalDebugger.clearBufferOutput();
ExternalDebugger.reset();
}});
Firebug.registerModule(Firebug.XmlCclRequest);
function XmlCclRequestPanel(){}XmlCclRequestPanel.prototype=extend(Firebug.Panel,{name:panelName,title:"XmlCclRequest",options:{hasToolButtons:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.clearButton=new Button({caption:"Clear",title:"Clear XmlCclRequest logs",owner:Firebug.XmlCclRequest,onClick:Firebug.XmlCclRequest.clear});
ExternalDebugger.initialize(this.panelNode);
ExternalDebugger.loadBufferOutput();
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments);
this.clearButton.initialize();
},shutdown:function(){this.clearButton.shutdown();
Firebug.Panel.shutdown.apply(this,arguments);
}});
Firebug.registerPanel(XmlCclRequestPanel);
}});
}}}};
appendDebugJavaScriptTag=function(filePath){headID=document.getElementsByTagName("head")[0];
newScript=document.createElement("script");
newScript.type="text/javascript";
newScript.id="firebug_lite_debugger";
newScript.src=filePath;
headID.appendChild(newScript);
};
this.text_debug=" ";
this.debug_mode_ind=0;
this.text_format="html";
this.target_url="";
this.json_object={};
this.xml_object={};
this.browserName="msie";
this.target_debug="_utiljsonxml_";
this.wParams="fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no";
this.trim_float_zeros=function(ind){truncate_zeros=ind;
};
this.setDebugMode=function(dMode){that.debug_mode_ind=dMode;
init();
};
this.launch_debug=function(){try{if(!UtilJsonXmlDebugWindow){UtilJsonXmlDebugWindow=_w.open(this.target_url,this.target_debug,this.wParams,0);
UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>"+this.text_debug+"</div>");
}else{UtilJsonXmlDebugWindow.document.write("<div>"+this.text_debug+"</div>");
}this.text_debug=" ";
}catch(e){try{UtilJsonXmlDebugWindow=_w.open(this.target_url,this.target_debug,this.wParams,0);
UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>"+this.text_debug+"</div>");
}catch(e2){error_handler(e.message,"launch_debug()");
}}};
this.parse_json=function(serializedJSON){try{if(JSON&&JSON.parse){return JSON.parse(serializedJSON);
}}catch(e){}return this.json1_parse(serializedJSON);
};
this.json1_parse=(function(){var at,ch,parseError="",escapee={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},text,error=function(m){parseError=m;
},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of '"+ch+"'");
}ch=text.charAt(at);
at+=1;
return ch;
},number=function(){var number,string="";
if(ch==="-"){string="-";
next("-");
}while(ch>="0"&&ch<="9"){string+=ch;
next();
}if(ch==="."){string+=".";
while(next()&&ch>="0"&&ch<="9"){string+=ch;
}}if(ch==="e"||ch==="E"){string+=ch;
next();
if(ch==="-"||ch==="+"){string+=ch;
next();
}while(ch>="0"&&ch<="9"){string+=ch;
next();
}}if(truncate_zeros==true){number=+string;
}else{number=string;
}if(isNaN(number)){error("Bad number");
}else{return number;
}},string=function(){var hex,i,string="",uffff;
if(ch==='"'){while(next()){if(ch==='"'){next();
return string;
}else{if(ch==="\\"){next();
if(ch==="u"){uffff=0;
for(i=0;
i<4;
i+=1){hex=parseInt(next(),16);
if(!isFinite(hex)){break;
}uffff=uffff*16+hex;
}string+=String.fromCharCode(uffff);
}else{if(typeof escapee[ch]==="string"){string+=escapee[ch];
}else{break;
}}}else{string+=ch;
}}}}error("Bad string");
},white=function(){while(ch&&ch<=" "){next();
}},word=function(){switch(ch){case"t":next("t");
next("r");
next("u");
next("e");
return true;
case"f":next("f");
next("a");
next("l");
next("s");
next("e");
return false;
case"n":next("n");
next("u");
next("l");
next("l");
return null;
}error("Unexpected '"+ch+"'");
},array=function(){var array=[];
if(ch==="["){next("[");
white();
if(ch==="]"){next("]");
return array;
}while(ch){array.push(value());
white();
if(ch==="]"){next("]");
return array;
}next(",");
white();
}}error("Bad array");
},object=function(){var key,object={};
if(ch==="{"){next("{");
white();
if(ch==="}"){next("}");
return object;
}while(ch){key=string();
white();
next(":");
if(Object.hasOwnProperty.call(object,key)){error('Duplicate key "'+key+'"');
}object[key]=value();
white();
if(ch==="}"){next("}");
return object;
}next(",");
white();
}}error("Bad object");
},value=function(){white();
switch(ch){case"{":return object();
case"[":return array();
case'"':return string();
case"-":return number();
default:return ch>="0"&&ch<="9"?number():word();
}};
return function(source,reviver){var result;
text=source;
at=0;
ch=" ";
parseError=result=value();
white();
if(ch){error("Syntax error");
}return typeof reviver==="function"?(function walk(holder,key){var k,v,value=holder[key];
if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);
if(v!==undefined){value[k]=v;
}else{delete value[k];
}}}}return reviver.call(holder,key,value);
}({"":result},"")):(parseError===""?{PARSE_JSON_ERROR:parseError}:result);
};
}());
this.parse_xml=function(data){try{var parser;
if(window.DOMParser){parser=new DOMParser();
this.xml_object=parser.parseFromString(data,"text/xml");
}else{this.xml_object=createDocument();
this.xml_object.async=false;
this.xml_object.loadXML(normalizeString(data));
}return(this.xml_object);
}catch(e){error_handler(e.message,"parse_xml()");
}};
this.loggerExists=function(){if(log){if(log.ajax&&log.info&&log.error){return true;
}}return false;
};
this.append_json=function(jObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** JSON Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_json_string=format_json(jObj,""),debug_string=debug_msg_hdr+debug_json_string;
if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return jObj;
}catch(e){error_handler(e.message,"append_json()");
}};
this.formatted_json=function(jObj){return format_json(jObj,"");
};
this.append_xml=function(xObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** XML Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_xml_string=format_xml(xObj),debug_string=debug_msg_hdr+debug_xml_string;
if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return xObj;
}catch(e){error_handler(e.message,"append_xml()");
}};
this.append_text=function(data){try{if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){if(header===undefined){log.info(data);
}else{log.info(data,header);
}}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(data);
}else{ExternalDebugger.sendBufferOutput(data);
}}else{this.text_debug+=data;
this.launch_debug();
}}}}catch(e){error_handler(e.message,"append_text()");
}};
this.load_json_obj=function(json_text,that){try{that===undefined?this:that;
return(that.append_json(that.parse_json(json_text)));
}catch(e){errmsg(e.message,"load_json_obj()");
}};
this.load_xml_obj=function(xml_text,that){try{that===undefined?this:that;
return(that.append_xml(that.parse_xml(xml_text)));
}catch(e){errmsg(e.message,"load_xml_obj()");
}};
this.load_txt=function(text,that){try{that===undefined?this:that;
return(that.append_text(text));
}catch(e){errmsg(e.message,"load_txt()");
}};
this.json_schema_validate=function(instance,schema){return this._validate_json_schema(instance,schema,false);
};
this.json_schema_property=function(value,schema,property){return this._validate_json_schema(value,schema,property||"property");
};
this._validate_json_schema=function(instance,schema,_changing){var errors=[];
function checkProp(value,schema,path,i){var l;
path+=path?typeof i=="number"?"["+i+"]":typeof i=="undefined"?"":"."+i:i;
function addError(message){errors.push({property:path,message:message});
}if((typeof schema!="object"||schema instanceof Array)&&(path||typeof schema!="function")){if(typeof schema=="function"){if(!(value instanceof schema)){addError("is not an instance of the class/constructor "+schema.name);
}}else{if(schema){addError("Invalid schema/property definition "+schema);
}}return null;
}if(_changing&&schema.readonly){addError("is a readonly field, it can not be changed");
}if(schema["extends"]){checkProp(value,schema["extends"],path,i);
}function checkType(type,value){if(type){if(typeof type=="string"&&type!="any"&&(type=="null"?value!==null:typeof value!=type)&&!(value instanceof Array&&type=="array")&&!(type=="integer"&&value%1===0)){return[{property:path,message:(typeof value)+" value found, but a "+type+" is required"}];
}if(type instanceof Array){var unionErrors=[];
for(var j=0;
j<type.length;
j++){if(!(unionErrors=checkType(type[j],value)).length){break;
}}if(unionErrors.length){return unionErrors;
}}else{if(typeof type=="object"){var priorErrors=errors;
errors=[];
checkProp(value,type,path);
var theseErrors=errors;
errors=priorErrors;
return theseErrors;
}}}return[];
}if(value===undefined){if(!schema.optional){addError("is missing and it is not optional");
}}else{errors=errors.concat(checkType(schema.type,value));
if(schema.disallow&&!checkType(schema.disallow,value).length){addError(" disallowed value was matched");
}if(value!==null){if(value instanceof Array){if(schema.items){if(schema.items instanceof Array){for(i=0,l=value.length;
i<l;
i++){errors.concat(checkProp(value[i],schema.items[i],path,i));
}}else{for(i=0,l=value.length;
i<l;
i++){errors.concat(checkProp(value[i],schema.items,path,i));
}}}if(schema.minItems&&value.length<schema.minItems){addError("There must be a minimum of "+schema.minItems+" in the array");
}if(schema.maxItems&&value.length>schema.maxItems){addError("There must be a maximum of "+schema.maxItems+" in the array");
}}else{if(schema.properties){errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties));
}}if(schema.pattern&&typeof value=="string"&&!value.match(schema.pattern)){addError("does not match the regex pattern "+schema.pattern);
}if(schema.maxLength&&typeof value=="string"&&value.length>schema.maxLength){addError("may only be "+schema.maxLength+" characters long");
}if(schema.minLength&&typeof value=="string"&&value.length<schema.minLength){addError("must be at least "+schema.minLength+" characters long");
}if(typeof schema.minimum!==undefined&&typeof value==typeof schema.minimum&&schema.minimum>value){addError("must have a minimum value of "+schema.minimum);
}if(typeof schema.maximum!==undefined&&typeof value==typeof schema.maximum&&schema.maximum<value){addError("must have a maximum value of "+schema.maximum);
}if(schema["enum"]){var enumer=schema["enum"];
l=enumer.length;
var found;
for(var j=0;
j<l;
j++){if(enumer[j]===value){found=1;
break;
}}if(!found){addError("does not have a value in the enumeration "+enumer.join(", "));
}}if(typeof schema.maxDecimal=="number"&&(value.toString().match(new RegExp("\\.[0-9]{"+(schema.maxDecimal+1)+",}")))){addError("may only have "+schema.maxDecimal+" digits of decimal places");
}}}return null;
}function checkObj(instance,objTypeDef,path,additionalProp){if(typeof objTypeDef=="object"){if(typeof instance!="object"||instance instanceof Array){errors.push({property:path,message:"an object is required"});
}for(var i in objTypeDef){if(objTypeDef.hasOwnProperty(i)&&!(i.charAt(0)=="_"&&i.charAt(1)=="_")){var value=instance[i];
var propDef=objTypeDef[i];
checkProp(value,propDef,path,i);
}}}for(i in instance){if(instance.hasOwnProperty(i)&&!(i.charAt(0)=="_"&&i.charAt(1)=="_")&&objTypeDef&&!objTypeDef[i]&&additionalProp===false){errors.push({property:path,message:(typeof value)+"The property "+i+" is not defined in the schema and the schema does not allow additional properties"});
}var requires=objTypeDef&&objTypeDef[i]&&objTypeDef[i].requires;
if(requires&&!(requires in instance)){errors.push({property:path,message:"the presence of the property "+i+" requires that "+requires+" also be present"});
}value=instance[i];
if(objTypeDef&&typeof objTypeDef=="object"&&!(i in objTypeDef)){checkProp(value,additionalProp,path,i);
}if(!_changing&&value&&value.$schema){errors=errors.concat(checkProp(value,value.$schema,path,i));
}}return errors;
}if(schema){checkProp(instance,schema,"",_changing||"");
}if(!_changing&&instance&&instance.$schema){checkProp(instance,instance.$schema,"","");
}return{valid:!errors.length,errors:errors};
};
this.stringify_json=function(objectJSON){try{if(JSON&&JSON.stringify){return JSON.stringify(objectJSON);
}}catch(e){}return this.json1_stringify(objectJSON);
};
this.json1_stringify=function(jObj){try{var sIndent="",iCount=0,sIndentStyle="",sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=(""+sIndent+sIndentStyle);
}else{sHTML+=(""+sIndent+sIndentStyle+'"'+j+'":');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=this.json1_stringify(jObj[j]);
break;
case"boolean":case"number":sHTML+=jObj[j].toString();
break;
case"null":sHTML+="null";
break;
case"string":sHTML+=('"'+jObj[j]+'"');
break;
case"function":break;
default:sHTML+=("TYPEOF: "+typeof(jObj[j]));
}iCount=iCount+1;
}}if(sDataType==="array"){sHTML+=(""+sIndent+"]");
}else{sHTML+=(""+sIndent+"}");
}return sHTML;
}catch(e){error_handler(e.message,"json1_stringify()");
}};
this.ajax_request=function(spec){try{var requestAsync,load_json_obj_fnc=this.load_json_obj,load_xml_obj_fnc=this.load_xml_obj,append_text_fnc=this.load_txt,json_response_obj,that=this,start_timer=new Date(),elapsed_time,ready_state_msg,status_msg,response_spec,parse_target,parse_target_type,debug_string,send_response_ind,parse_target_text,display_response_text,asyncInd=spec.request.synchronous?false:true;
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM&&spec.loadingDialog.content){spec.loadingDialog.targetDOM.innerHTML=spec.loadingDialog.content;
}}if(spec.request.target.toUpperCase().indexOf(".JSON")==-1&&spec.request.target.toUpperCase().indexOf(".XML")==-1&&spec.request.target.toUpperCase().indexOf(".TXT")==-1){if(spec.request.type==="XMLHTTPREQUEST"){if(window.XMLHttpRequest){requestAsync=new XMLHttpRequest();
}else{if(window.ActiveXObject){requestAsync=new ActiveXObject("MSXML2.XMLHTTP.3.0");
}}}else{requestAsync=getXMLCclRequest();
}if(spec.request.binding&&spec.request.binding>" "){requestAsync.requestBinding=spec.request.binding;
}requestAsync.onreadystatechange=function(){if(requestAsync.readyState===4&&requestAsync.status===200){if(spec.loadingDialog){if(spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="";
}}if(requestAsync.responseText>" "){try{elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
append_text_fnc(debug_string,that);
if(spec.response.type.toUpperCase()==="JSON"){json_response_obj=load_json_obj_fnc(requestAsync.responseText,that);
if(!json_response_obj||(json_response_obj.PARSE_JSON_ERROR&&json_response_obj.PARSE_JSON_ERROR>" ")){send_response_ind=false;
if(spec.loadingDialog&&spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="ERROR: "+messages.json_parsing_failed;
spec.loadingDialog.targetDOM.style.cursor="hand";
spec.loadingDialog.targetDOM.title="Click for more details.";
if(UtilPopup&&(RealTypeOf(UtilPopup)=="object"||RealTypeOf(UtilPopup)=="function")){display_response_text=requestAsync.responseText.split(">").join("&gt;").split("<").join("&lt;");
UtilPopup.attachModalPopup({elementDOM:spec.loadingDialog.targetDOM,event:"click",width:"500px",defaultpos:["30%","20%"],exit:"x",header:"Invalid JSON from "+spec.request.target,content:"<div style='height:500px;width:499px;overflow:auto;'><b>Parameters</b>: "+spec.request.parameters+"<br/><br/><b>Response Text</b>: "+display_response_text+"</div>"});
}else{spec.loadingDialog.targetDOM.onclick=function(event){alert(spec.request.target+"\n"+spec.request.parameters+"\n"+requestAsync.responseText);
};
}}else{alert(messages.json_parsing_failed+" \n\n"+spec.request.target+"\n"+spec.request.parameters);
}}else{send_response_ind=true;
if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={responseText:requestAsync.responseText,response:json_response_obj,parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={responseText:requestAsync.responseText,response:json_response_obj,elapsed:elapsed_time};
}}}else{send_response_ind=true;
if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={responseText:requestAsync.responseText,response:load_xml_obj_fnc(requestAsync.responseText,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={responseText:requestAsync.responseText,response:load_xml_obj_fnc(requestAsync.responseText,that),elapsed:elapsed_time};
}}if(send_response_ind){spec.response.target(response_spec);
}}catch(e){error_handler(e.message,"ajax_request.requestAsync.responseText");
}}}else{try{switch(requestAsync.readyState){case 0:ready_state_msg="0 - Uninitalized";
break;
case 1:ready_state_msg="1 - Loading";
break;
case 2:ready_state_msg="2 - Loaded";
break;
case 3:ready_state_msg="3 - Interactive";
break;
case 4:ready_state_msg="4 - Completed";
break;
}switch(requestAsync.status){case 200:status_msg="200 - Success";
break;
case 405:status_msg="405 - Method Not Allowed";
break;
case 409:status_msg="409 - Invalid State";
break;
case 492:status_msg="492 - Non-Fatal Error";
break;
case 493:status_msg="493 - Memory Error";
break;
case 500:status_msg="500 - Internal Server Exception";
break;
}if(requestAsync.readyState==4&&requestAsync.readyState&&requestAsync.status){ready_state_msg="ajax_request failed on: \n\n Request Target: "+spec.request.target+"\n Request Parameters: "+spec.request.parameters+"\n\n with requestAsync.readyState -> "+ready_state_msg;
status_msg=" requestAsync.status -> "+status_msg;
elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
debug_string+=" <b>requestAsync.readyState </b>"+ready_state_msg;
debug_string+=" <b>requestAsync.status </b>"+status_msg;
append_text_fnc(debug_string,that);
error_handler(ready_state_msg,status_msg);
}}catch(e3){}}};
if(spec.request.type==="XMLHTTPREQUEST"){requestAsync.open("GET",spec.request.target,asyncInd);
if(!spec.request.parameters||spec.request.parameters===null||spec.request.parameters===""){requestAsync.setRequestHeader("Access-Control-Allow-Origin","*");
requestAsync.send(null);
}else{requestAsync.setRequestHeader("Content-type","application/x-www-form-urlencoded");
requestAsync.setRequestHeader("Content-length",spec.request.parameters.length);
requestAsync.setRequestHeader("Connection","close");
requestAsync.send(spec.request.parameters);
}}else{if(location.protocol.substr(0,4)==="http"){var url=location.protocol+"//"+location.host+"/discern/mpages/reports/"+spec.request.target+"?parameters="+spec.request.parameters;
requestAsync.open("GET",url,asyncInd);
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
}catch(e){alert(" requestAsync.setBlobIn not available");
}}requestAsync.send(null);
}else{requestAsync.open("GET",spec.request.target,asyncInd);
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
}catch(e){alert(" requestAsync.setBlobIn not available");
}}requestAsync.send(spec.request.parameters);
}}}else{parse_target=spec.request.target.split(".");
parse_target_type=parse_target[parse_target.length-1].toUpperCase();
parse_target_text=ReadFromFile(spec.request.target);
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="";
}}elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
append_text_fnc(debug_string,that);
switch(parse_target_type){case"JSON":if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:load_json_obj_fnc(parse_target_text,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:load_json_obj_fnc(parse_target_text,that),elapsed:elapsed_time};
}break;
case"XML":if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:load_xml_obj_fnc(parse_target_text,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:load_xml_obj_fnc(parse_target_text,that),elapsed:elapsed_time};
}break;
default:if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:parse_target_text,parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:parse_target_text,elapsed:elapsed_time};
}break;
}spec.response.target(response_spec);
}}catch(e){error_handler(e.message,"ajax_request()");
}};
init();
};
var AjaxHandler=new UtilJsonXml();
/**
 * @author RB018070
 */
/***** Error handling methods ***/
function errorHandler(error_obj, det) {
	if (AjaxHandler && AjaxHandler.debug_mode_ind === 1) {
		if (console && console.error) {
			console.error("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
		} else {
			AjaxHandler.append_text("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
		}
	}
	else {
		alert("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
	}
}
/**
 * @author RB018070
 */

// list of icons displayed on the advisor
var icons = (function () {
	return {
		"restart": "6355_24.png",
		"showComment": "4972.gif",
		"editComment": "5153.gif",
		"documentedOrder": "3796_16.gif",
		"circleLoading": "ajax-loader.gif",
		"editSentence": "4969.gif",
		"root_path": "..",
		"icon_folder_name": "\\img\\"
	};
}());/**
 * @author RB018070
 */

var UtilSort = (function () {
	return {
		jsonTableSort: function (sortPrefs) {
			var parentTable = sortPrefs.parentTable,
				jsonList = sortPrefs.jsonList,
				idAttr	= sortPrefs.idAttr,
				curElement,
				tableChildNodes,
				curJSONObject,
				cntr = 0,
				len;
			
			for (cntr = 0, len = jsonList.length; cntr < len; cntr++) {
				curJSONObject = jsonList[cntr];
				curElement = _g(curJSONObject[idAttr]);
				if (curJSONObject && curElement) {
					curElement = Util.ac(curElement, parentTable);	
				}
			}														
		}
	};
})();


function SortIt(TheArr, us, u, vs, v, ws, w, xs, x, ys, y, zs, z) {
    // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
	function Sortsingle(a, b) {
        var swap = 0;
        if (isNaN(a - b)) {
            if ((isNaN(a)) && (isNaN(b))) {
                swap = (b < a) - (a < b);
            }
            else {
                swap = (isNaN(a) ? 1 : -1);
            }
        }
        else {
            swap = (a - b);
        }
        return swap * us;
    }
	
	function Sortmulti(a, b) {
        var swap = 0;
        if (isNaN(a[u] - b[u])) {
            if ((isNaN(a[u])) && (isNaN(b[u]))) {
                swap = (b[u] < a[u]) - (a[u] < b[u]);
            }
            else {
                swap = (isNaN(a[u]) ? 1 : -1);
            }
        }
        else {
            swap = (a[u] - b[u]);
        }
        if ((v === undefined) || (swap !== 0)) {
            return swap * us;
        }
        else {
            if (isNaN(a[v] - b[v])) {
                if ((isNaN(a[v])) && (isNaN(b[v]))) {
                    swap = (b[v] < a[v]) - (a[v] < b[v]);
                }
                else {
                    swap = (isNaN(a[v]) ? 1 : -1);
                }
            }
            else {
                swap = (a[v] - b[v]);
            }
            if ((w === undefined) || (swap !== 0)) {
                return swap * vs;
            }
            else {
                if (isNaN(a[w] - b[w])) {
                    if ((isNaN(a[w])) && (isNaN(b[w]))) {
                        swap = (b[w] < a[w]) - (a[w] < b[w]);
                    }
                    else {
                        swap = (isNaN(a[w]) ? 1 : -1);
                    }
                }
                else {
                    swap = (a[w] - b[w]);
                }
                if ((x === undefined) || (swap !== 0)) {
                    return swap * ws;
                }
                else {
                    if (isNaN(a[x] - b[x])) {
                        if ((isNaN(a[x])) && (isNaN(b[x]))) {
                            swap = (b[x] < a[x]) - (a[x] < b[x]);
                        }
                        else {
                            swap = (isNaN(a[x]) ? 1 : -1);
                        }
                    }
                    else {
                        swap = (a[x] - b[x]);
                    }
                    if ((y === undefined) || (swap !== 0)) {
                        return swap * xs;
                    }
                    else {
                        if (isNaN(a[y] - b[y])) {
                            if ((isNaN(a[y])) && (isNaN(b[y]))) {
                                swap = (b[y] < a[y]) - (a[y] < b[y]);
                            }
                            else {
                                swap = (isNaN(a[y]) ? 1 : -1);
                            }
                        }
                        else {
                            swap = (a[y] - b[y]);
                        }
                        if ((z === undefined) || (swap !== 0)) {
                            return swap * ys;
                        }
                        else {
                            if (isNaN(a[z] - b[z])) {
                                if ((isNaN(a[z])) && (isNaN(b[z]))) {
                                    swap = (b[z] < a[z]) - (a[z] < b[z]);
                                }
                                else {
                                    swap = (isNaN(a[z]) ? 1 : -1);
                                }
                            }
                            else {
                                swap = (a[z] - b[z]);
                            }
                            return swap * zs;
                        }
                    }
                }
            }
        }
    }
	
    if (u === undefined) {
        TheArr.sort(Sortsingle);
    } // if this is a simple array, not multi-dimensional, ie, SortIt(TheArr,1): ascending.
    else {
        TheArr.sort(Sortmulti);
    }
    return TheArr;
}
function getXMLCclRequest(){var xmlHttp=null;
if(location.protocol.substr(0,4)=="http"){try{xmlHttp=new XMLHttpRequest();
}catch(e){try{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
}catch(e){xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
}}}else{xmlHttp=new XMLCclRequest();
}return xmlHttp;
}var popupWindowHandle;
function getPopupWindowHandle(){return popupWindowHandle;
}XMLCclRequest=function(options){this.onreadystatechange=function(){return null;
};
this.options=options||{};
this.readyState=0;
this.responseText="";
this.status=0;
this.statusText="";
this.sendFlag=false;
this.errorFlag=false;
this.responseBody=this.responseXML=this.async=true;
this.requestBinding=null;
this.requestText=null;
this.blobIn=null;
this.onerror=this.abort=this.getAllResponseHeaders=this.getResponseHeader=function(){return null;
};
this.open=function(method,url,async){if(method.toLowerCase()!="get"&&method.toLowerCase()!="post"){this.errorFlag=true;
this.status=405;
this.statusText="Method not Allowed";
return false;
}this.method=method.toUpperCase();
this.url=url;
this.async=async!=null?(async?true:false):true;
this.requestHeaders=null;
this.responseText="";
this.responseBody=this.responseXML=null;
this.readyState=1;
this.sendFlag=false;
this.requestText="";
this.onreadystatechange();
};
this.send=function(param){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}this.sendFlag=true;
this.requestLen=param.length;
this.requestText=param;
var uniqueId=this.url+"-"+(new Date()).getTime()+"-"+Math.floor(Math.random()*99999);
XMLCCLREQUESTOBJECTPOINTER[uniqueId]=this;
window.location='javascript:XMLCCLREQUEST_Send("'+uniqueId+'")';
};
this.setRequestHeader=function(name,value){if(this.readyState!=1){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(this.sendFlag){this.errorFlag=true;
this.status=409;
this.statusText="Invalid State";
return false;
}if(!value){return false;
}if(!this.requestHeaders){this.requestHeaders=[];
}this.requestHeaders[name]=value;
};
this.setBlobIn=function(blob){this.blobIn=blob;
};
};
XMLCCLREQUESTOBJECTPOINTER=[];
function evaluate(x){return eval(x);
}function CCLLINK__(program,param,nViewerType){}function CCLLINK(program,param,nViewerType){var paramLength=param.length;
if(paramLength>2000){param=param.substring(0,2000);
}var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLLINK__("'+program+'","'+param+'",'+nViewerType+","+paramLength+")";
el.click();
}function CCLNEWWINDOW(url){var newWindow=window.open(url,"","fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no");
newWindow.focus();
}function CCLEVENT__(eventId,eventData){}function CCLEVENT(eventId,eventData){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLEVENT__("'+eventId+'")';
el.click();
}function CCLNEWSESSIONWINDOW__(sUrl,sName,sFeatures,bReplace,bModal){}function CCLNEWSESSIONWINDOW(sUrl,sName,sFeatures,bReplace,bModal){var el=document.body.appendChild(document.createElement("a"));
el.href='javascript:CCLNEWSESSIONWINDOW__("'+sUrl+'","'+sName+'","'+sFeatures+'",'+bReplace+","+bModal+")";
el.click();
if(bModal==0){popupWindowHandle=window.open(sUrl,sName,sFeatures,bReplace);
if(popupWindowHandle){popupWindowHandle.focus();
}}}function APPLINK(mode,appname,param){if(mode==0){window.open("file:///"+appname+" "+param);
}else{window.location="file:///"+appname+" "+param;
}}function MPAGES_EVENT__(eventType,eventParams){}function MPAGES_EVENT(eventType,eventParams){var paramLength=eventParams.length;
if(!document.getElementById("__ID_CCLPostParams_32504__")){linkObj=document.body.appendChild(document.createElement("a"));
linkObj.id="__ID_CCLPostParams_32504__";
}if(paramLength>2000){document.getElementById("__ID_CCLPostParams_32504__").value='"'+eventParams+'"';
eventParams=eventParams.substring(0,2000);
}window.location.href="javascript:MPAGES_EVENT__('"+eventType+"','"+eventParams+"',"+paramLength+")";
}function ArgumentURL(){this.getArgument=_getArg;
this.setArgument=_setArg;
this.removeArgument=_removeArg;
this.toString=_toString;
this.arguments=new Array();
var separator=",";
var equalsign="=";
var str=window.location.search.replace(/%20/g," ");
var index=str.indexOf("?");
var sInfo;
var infoArray=new Array();
var tmp;
if(index!=-1){sInfo=str.substring(index+1,str.length);
infoArray=sInfo.split(separator);
}for(var i=0;
i<infoArray.length;
i++){tmp=infoArray[i].split(equalsign);
if(tmp[0]!=""){var t=tmp[0];
this.arguments[tmp[0]]=new Object();
this.arguments[tmp[0]].value=tmp[1];
this.arguments[tmp[0]].name=tmp[0];
}}function _toString(){var s="";
var once=true;
for(i in this.arguments){if(once){s+="?";
once=false;
}s+=this.arguments[i].name;
s+=equalsign;
s+=this.arguments[i].value;
s+=separator;
}return s.replace(/ /g,"%20");
}function _getArg(name){if(typeof(this.arguments[name].name)!="string"){return null;
}else{return this.arguments[name].value;
}}function _setArg(name,value){this.arguments[name]=new Object();
this.arguments[name].name=name;
this.arguments[name].value=value;
}function _removeArg(name){this.arguments[name]=null;
}return this;
}var ExternalDebugger=(function(){var debuggerObj=false,prevDebuggerObj,debuggerDefined=false,bufferOutput=" ";
return({initialize:function(dObj){prevDebuggerObj=debuggerObj;
debuggerObj=dObj;
ExternalDebugger.reset();
if(prevDebuggerObj){debuggerObj.innerHTML=prevDebuggerObj.innerHTML;
}},define:function(){debuggerDefined=true;
bufferOutput=" ";
},reset:function(){try{if(debuggerObj){debuggerObj.innerHTML=" ";
}}catch(err){if(prevDebuggerObj){prevDebuggerObj.innerHTML=" ";
}}},isDefined:function(){return debuggerDefined;
},isInitialized:function(){if(debuggerObj){return true;
}return false;
},loadBufferOutput:function(){debuggerObj.innerHTML+=bufferOutput;
},clearBufferOutput:function(){bufferOutput=" ";
},sendBufferOutput:function(outData){bufferOutput+=outData;
},sendOutput:function(outData){try{if(debuggerObj){debuggerObj.innerHTML+=outData;
}}catch(err){if(prevDebuggerObj){prevDebuggerObj.innerHTML+=outData;
}}}});
}());
var UtilJsonXmlDebugWindow;
var UtilJsonXml=function(prefs){var cur_dt_tm=new Date(),_w=window,_d=document,that=this,xCclPanel,messages={json_parsing_failed:"JSON Parsing Failed"},truncate_zeros=true,whtSpEnds=new RegExp("^\\s*|\\s*$","g"),whtSpMult=new RegExp("\\s\\s+","g"),error_handler=function(msg,fnc){alert(msg+" - "+fnc);
},RealTypeOf=function(v){try{if(typeof(v)==="object"){if(v===null){return"null";
}if(v.constructor===([]).constructor){return"array";
}if(v.constructor===(new Date()).constructor){return"date";
}if(v.constructor===(new RegExp()).constructor){return"regex";
}return"object";
}if(v!=""&&!isNaN(Number(v))){return"number";
}else{return typeof(v);
}}catch(e){error_handler(e.message,"RealTypeOf()");
}},format_json=function(jObj,sIndent){try{if(!sIndent){sIndent="";
}var sIndentStyle="&nbsp;&nbsp;",iCount=0,sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=("<br>"+sIndent+sIndentStyle);
}else{sHTML+=("<br>"+sIndent+sIndentStyle+'"'+j+'": ');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=format_json(jObj[j],(sIndent+sIndentStyle));
break;
case"boolean":case"number":sHTML+=jObj[j].toString();
break;
case"null":sHTML+="null";
break;
case"string":sHTML+=('"'+jObj[j]+'"');
break;
case"function":break;
default:sHTML+=("TYPEOF: "+typeof(jObj[j]));
}iCount=iCount+1;
}}if(sDataType==="array"){sHTML+=("<br>"+sIndent+"]");
}else{sHTML+=("<br>"+sIndent+"}");
}return sHTML;
}catch(e){error_handler(e.message,"format_json()");
}},format_xml=function(Obj,sIndent){try{var str="",sIndentStyle="&nbsp;&nbsp;",i=0,j=0;
if(!sIndent){sIndent="";
}for(i=0;
i<Obj.childNodes.length;
i++){if(Obj.childNodes[i].tagName){str+=sIndent+"&#60"+Obj.childNodes[i].tagName;
if(Obj.childNodes[i].attributes){for(j=0;
j<Obj.childNodes[i].attributes.length;
j++){str+="&nbsp;&nbsp;"+Obj.childNodes[i].attributes[j].name+"&nbsp;=&nbsp;'"+Obj.childNodes[i].attributes[j].value+"'";
}}str+="&#62;<br>";
}if(!Obj.childNodes[i].nodeValue&&RealTypeOf(Obj.childNodes[i].childNodes)==="object"){str+=sIndent+format_xml(Obj.childNodes[i],sIndent+sIndentStyle);
}else{if(Obj.childNodes[i].nodeValue){str+=sIndent+Obj.childNodes[i].nodeValue+"<br>";
}}if(Obj.childNodes[i].tagName){str+=sIndent+"&#60/"+Obj.childNodes[i].tagName+"&#62;<br>";
}}return str;
}catch(e){error_handler(e.message,"format_xml()");
}},normalizeString=function(s){s=s.replace(whtSpMult," ");
s=s.replace(whtSpEnds,"");
return(s);
},createDocument=function(){try{if(typeof arguments.callee.activeXString!=="string"){var versions=["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"],i,len=versions.length;
for(i=0;
i<len;
i+=1){try{this.xml_object=new ActiveXObject(versions[i]);
arguments.callee.activeXString=versions[i];
return this.xml_object;
}catch(ex){}}}return new ActiveXObject(arguments.callee.activeXString);
}catch(e){error_handler(e.message,"createDocument()");
}},ReadFromFile=function(sFile){try{var ForReading=1,TriStateFalse=0,fso=new ActiveXObject("Scripting.FileSystemObject"),fileText="",path_split=[],sfile_split=sFile.split("$");
if(sfile_split.length==1){if(location.href){path_split=location.href.split("?")[0];
path_split=path_split.split("%20").join(" ").split("file:///").join("").split("file:").join("").split("/");
path_split=path_split.slice(0,path_split.length-2);
path_split=path_split.join("\\");
sFile=sFile.split("/").join("\\");
}sFile=(path_split+sFile);
}else{sFile=sfile_split[1];
}inFile=fso.OpenTextFile(sFile,ForReading,true);
fileText=inFile.ReadAll();
inFile.close();
return fileText;
}catch(err){error_handler(err.message,"ReadFromFile()");
return"";
}},init=function(){if(prefs&&RealTypeOf(prefs)=="object"){if(prefs.debug_mode_ind){that.debug_mode_ind=prefs.debug_mode_ind;
}if(that.debug_mode_ind==1&&!ExternalDebugger.isInitialized()&&(!prefs.disable_firebug)){ExternalDebugger.define();
appendDebugJavaScriptTag("..\\js\\firebug-lite.js");
console.log("Debugging mode turned on");
if(Firebug){Firebug.extend(function(FBL){with(FBL){var panelName="XmlCclRequest";
Firebug.XmlCclRequest=extend(Firebug.Module,{getPanel:function(){return Firebug.chrome?Firebug.chrome.getPanel(panelName):null;
},clear:function(){ExternalDebugger.clearBufferOutput();
ExternalDebugger.reset();
}});
Firebug.registerModule(Firebug.XmlCclRequest);
function XmlCclRequestPanel(){}XmlCclRequestPanel.prototype=extend(Firebug.Panel,{name:panelName,title:"XmlCclRequest",options:{hasToolButtons:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.clearButton=new Button({caption:"Clear",title:"Clear XmlCclRequest logs",owner:Firebug.XmlCclRequest,onClick:Firebug.XmlCclRequest.clear});
ExternalDebugger.initialize(this.panelNode);
ExternalDebugger.loadBufferOutput();
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments);
this.clearButton.initialize();
},shutdown:function(){this.clearButton.shutdown();
Firebug.Panel.shutdown.apply(this,arguments);
}});
Firebug.registerPanel(XmlCclRequestPanel);
}});
}}}};
appendDebugJavaScriptTag=function(filePath){headID=document.getElementsByTagName("head")[0];
newScript=document.createElement("script");
newScript.type="text/javascript";
newScript.id="firebug_lite_debugger";
newScript.src=filePath;
headID.appendChild(newScript);
};
this.text_debug=" ";
this.debug_mode_ind=0;
this.text_format="html";
this.target_url="";
this.json_object={};
this.xml_object={};
this.browserName="msie";
this.target_debug="_utiljsonxml_";
this.wParams="fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=no";
this.trim_float_zeros=function(ind){truncate_zeros=ind;
};
this.setDebugMode=function(dMode){that.debug_mode_ind=dMode;
init();
};
this.launch_debug=function(){try{if(!UtilJsonXmlDebugWindow){UtilJsonXmlDebugWindow=_w.open(this.target_url,this.target_debug,this.wParams,0);
UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>"+this.text_debug+"</div>");
}else{UtilJsonXmlDebugWindow.document.write("<div>"+this.text_debug+"</div>");
}this.text_debug=" ";
}catch(e){try{UtilJsonXmlDebugWindow=_w.open(this.target_url,this.target_debug,this.wParams,0);
UtilJsonXmlDebugWindow.document.write("<title>DC MPages Debugger</title><div>"+this.text_debug+"</div>");
}catch(e2){error_handler(e.message,"launch_debug()");
}}};
this.parse_json=function(serializedJSON){try{if(JSON&&JSON.parse){return JSON.parse(serializedJSON);
}}catch(e){}return this.json1_parse(serializedJSON);
};
this.json1_parse=(function(){var at,ch,parseError="",escapee={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},text,error=function(m){parseError=m;
},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of '"+ch+"'");
}ch=text.charAt(at);
at+=1;
return ch;
},number=function(){var number,string="";
if(ch==="-"){string="-";
next("-");
}while(ch>="0"&&ch<="9"){string+=ch;
next();
}if(ch==="."){string+=".";
while(next()&&ch>="0"&&ch<="9"){string+=ch;
}}if(ch==="e"||ch==="E"){string+=ch;
next();
if(ch==="-"||ch==="+"){string+=ch;
next();
}while(ch>="0"&&ch<="9"){string+=ch;
next();
}}if(truncate_zeros==true){number=+string;
}else{number=string;
}if(isNaN(number)){error("Bad number");
}else{return number;
}},string=function(){var hex,i,string="",uffff;
if(ch==='"'){while(next()){if(ch==='"'){next();
return string;
}else{if(ch==="\\"){next();
if(ch==="u"){uffff=0;
for(i=0;
i<4;
i+=1){hex=parseInt(next(),16);
if(!isFinite(hex)){break;
}uffff=uffff*16+hex;
}string+=String.fromCharCode(uffff);
}else{if(typeof escapee[ch]==="string"){string+=escapee[ch];
}else{break;
}}}else{string+=ch;
}}}}error("Bad string");
},white=function(){while(ch&&ch<=" "){next();
}},word=function(){switch(ch){case"t":next("t");
next("r");
next("u");
next("e");
return true;
case"f":next("f");
next("a");
next("l");
next("s");
next("e");
return false;
case"n":next("n");
next("u");
next("l");
next("l");
return null;
}error("Unexpected '"+ch+"'");
},array=function(){var array=[];
if(ch==="["){next("[");
white();
if(ch==="]"){next("]");
return array;
}while(ch){array.push(value());
white();
if(ch==="]"){next("]");
return array;
}next(",");
white();
}}error("Bad array");
},object=function(){var key,object={};
if(ch==="{"){next("{");
white();
if(ch==="}"){next("}");
return object;
}while(ch){key=string();
white();
next(":");
if(Object.hasOwnProperty.call(object,key)){error('Duplicate key "'+key+'"');
}object[key]=value();
white();
if(ch==="}"){next("}");
return object;
}next(",");
white();
}}error("Bad object");
},value=function(){white();
switch(ch){case"{":return object();
case"[":return array();
case'"':return string();
case"-":return number();
default:return ch>="0"&&ch<="9"?number():word();
}};
return function(source,reviver){var result;
text=source;
at=0;
ch=" ";
parseError=result=value();
white();
if(ch){error("Syntax error");
}return typeof reviver==="function"?(function walk(holder,key){var k,v,value=holder[key];
if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);
if(v!==undefined){value[k]=v;
}else{delete value[k];
}}}}return reviver.call(holder,key,value);
}({"":result},"")):(parseError===""?{PARSE_JSON_ERROR:parseError}:result);
};
}());
this.parse_xml=function(data){try{var parser;
if(window.DOMParser){parser=new DOMParser();
this.xml_object=parser.parseFromString(data,"text/xml");
}else{this.xml_object=createDocument();
this.xml_object.async=false;
this.xml_object.loadXML(normalizeString(data));
}return(this.xml_object);
}catch(e){error_handler(e.message,"parse_xml()");
}};
this.loggerExists=function(){if(log){if(log.ajax&&log.info&&log.error){return true;
}}return false;
};
this.append_json=function(jObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** JSON Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_json_string=format_json(jObj,""),debug_string=debug_msg_hdr+debug_json_string;
if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return jObj;
}catch(e){error_handler(e.message,"append_json()");
}};
this.formatted_json=function(jObj){return format_json(jObj,"");
};
this.append_xml=function(xObj){try{cur_dt_tm=new Date();
var debug_msg_hdr="<br><b>*************** XML Formatted ( "+cur_dt_tm.toUTCString()+" ) ***************</b><br>",debug_xml_string=format_xml(xObj),debug_string=debug_msg_hdr+debug_xml_string;
if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){log.ajax(debug_string);
}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(debug_string);
}else{ExternalDebugger.sendBufferOutput(debug_string);
}}else{this.text_debug+=debug_string;
this.launch_debug();
}}}return xObj;
}catch(e){error_handler(e.message,"append_xml()");
}};
this.append_text=function(data){try{if(this.debug_mode_ind===1){try{if(this.loggerExists()==true){if(header===undefined){log.info(data);
}else{log.info(data,header);
}}}catch(e){if(ExternalDebugger.isDefined()){if(ExternalDebugger.isInitialized()){ExternalDebugger.sendOutput(data);
}else{ExternalDebugger.sendBufferOutput(data);
}}else{this.text_debug+=data;
this.launch_debug();
}}}}catch(e){error_handler(e.message,"append_text()");
}};
this.load_json_obj=function(json_text,that){try{that===undefined?this:that;
return(that.append_json(that.parse_json(json_text)));
}catch(e){errmsg(e.message,"load_json_obj()");
}};
this.load_xml_obj=function(xml_text,that){try{that===undefined?this:that;
return(that.append_xml(that.parse_xml(xml_text)));
}catch(e){errmsg(e.message,"load_xml_obj()");
}};
this.load_txt=function(text,that){try{that===undefined?this:that;
return(that.append_text(text));
}catch(e){errmsg(e.message,"load_txt()");
}};
this.json_schema_validate=function(instance,schema){return this._validate_json_schema(instance,schema,false);
};
this.json_schema_property=function(value,schema,property){return this._validate_json_schema(value,schema,property||"property");
};
this._validate_json_schema=function(instance,schema,_changing){var errors=[];
function checkProp(value,schema,path,i){var l;
path+=path?typeof i=="number"?"["+i+"]":typeof i=="undefined"?"":"."+i:i;
function addError(message){errors.push({property:path,message:message});
}if((typeof schema!="object"||schema instanceof Array)&&(path||typeof schema!="function")){if(typeof schema=="function"){if(!(value instanceof schema)){addError("is not an instance of the class/constructor "+schema.name);
}}else{if(schema){addError("Invalid schema/property definition "+schema);
}}return null;
}if(_changing&&schema.readonly){addError("is a readonly field, it can not be changed");
}if(schema["extends"]){checkProp(value,schema["extends"],path,i);
}function checkType(type,value){if(type){if(typeof type=="string"&&type!="any"&&(type=="null"?value!==null:typeof value!=type)&&!(value instanceof Array&&type=="array")&&!(type=="integer"&&value%1===0)){return[{property:path,message:(typeof value)+" value found, but a "+type+" is required"}];
}if(type instanceof Array){var unionErrors=[];
for(var j=0;
j<type.length;
j++){if(!(unionErrors=checkType(type[j],value)).length){break;
}}if(unionErrors.length){return unionErrors;
}}else{if(typeof type=="object"){var priorErrors=errors;
errors=[];
checkProp(value,type,path);
var theseErrors=errors;
errors=priorErrors;
return theseErrors;
}}}return[];
}if(value===undefined){if(!schema.optional){addError("is missing and it is not optional");
}}else{errors=errors.concat(checkType(schema.type,value));
if(schema.disallow&&!checkType(schema.disallow,value).length){addError(" disallowed value was matched");
}if(value!==null){if(value instanceof Array){if(schema.items){if(schema.items instanceof Array){for(i=0,l=value.length;
i<l;
i++){errors.concat(checkProp(value[i],schema.items[i],path,i));
}}else{for(i=0,l=value.length;
i<l;
i++){errors.concat(checkProp(value[i],schema.items,path,i));
}}}if(schema.minItems&&value.length<schema.minItems){addError("There must be a minimum of "+schema.minItems+" in the array");
}if(schema.maxItems&&value.length>schema.maxItems){addError("There must be a maximum of "+schema.maxItems+" in the array");
}}else{if(schema.properties){errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties));
}}if(schema.pattern&&typeof value=="string"&&!value.match(schema.pattern)){addError("does not match the regex pattern "+schema.pattern);
}if(schema.maxLength&&typeof value=="string"&&value.length>schema.maxLength){addError("may only be "+schema.maxLength+" characters long");
}if(schema.minLength&&typeof value=="string"&&value.length<schema.minLength){addError("must be at least "+schema.minLength+" characters long");
}if(typeof schema.minimum!==undefined&&typeof value==typeof schema.minimum&&schema.minimum>value){addError("must have a minimum value of "+schema.minimum);
}if(typeof schema.maximum!==undefined&&typeof value==typeof schema.maximum&&schema.maximum<value){addError("must have a maximum value of "+schema.maximum);
}if(schema["enum"]){var enumer=schema["enum"];
l=enumer.length;
var found;
for(var j=0;
j<l;
j++){if(enumer[j]===value){found=1;
break;
}}if(!found){addError("does not have a value in the enumeration "+enumer.join(", "));
}}if(typeof schema.maxDecimal=="number"&&(value.toString().match(new RegExp("\\.[0-9]{"+(schema.maxDecimal+1)+",}")))){addError("may only have "+schema.maxDecimal+" digits of decimal places");
}}}return null;
}function checkObj(instance,objTypeDef,path,additionalProp){if(typeof objTypeDef=="object"){if(typeof instance!="object"||instance instanceof Array){errors.push({property:path,message:"an object is required"});
}for(var i in objTypeDef){if(objTypeDef.hasOwnProperty(i)&&!(i.charAt(0)=="_"&&i.charAt(1)=="_")){var value=instance[i];
var propDef=objTypeDef[i];
checkProp(value,propDef,path,i);
}}}for(i in instance){if(instance.hasOwnProperty(i)&&!(i.charAt(0)=="_"&&i.charAt(1)=="_")&&objTypeDef&&!objTypeDef[i]&&additionalProp===false){errors.push({property:path,message:(typeof value)+"The property "+i+" is not defined in the schema and the schema does not allow additional properties"});
}var requires=objTypeDef&&objTypeDef[i]&&objTypeDef[i].requires;
if(requires&&!(requires in instance)){errors.push({property:path,message:"the presence of the property "+i+" requires that "+requires+" also be present"});
}value=instance[i];
if(objTypeDef&&typeof objTypeDef=="object"&&!(i in objTypeDef)){checkProp(value,additionalProp,path,i);
}if(!_changing&&value&&value.$schema){errors=errors.concat(checkProp(value,value.$schema,path,i));
}}return errors;
}if(schema){checkProp(instance,schema,"",_changing||"");
}if(!_changing&&instance&&instance.$schema){checkProp(instance,instance.$schema,"","");
}return{valid:!errors.length,errors:errors};
};
this.stringify_json=function(objectJSON){try{if(JSON&&JSON.stringify){return JSON.stringify(objectJSON);
}}catch(e){}return this.json1_stringify(objectJSON);
};
this.json1_stringify=function(jObj){try{var sIndent="",iCount=0,sIndentStyle="",sDataType=RealTypeOf(jObj),sHTML,j;
if(sDataType==="array"){if(jObj.length===0){return"[]";
}sHTML="[";
}else{if(sDataType==="object"&&sDataType!==null){sHTML="{";
}else{return"{}";
}}iCount=0;
for(j in jObj){if(RealTypeOf(jObj[j])!=="function"){if(iCount>0){sHTML+=",";
}if(sDataType==="array"){sHTML+=(""+sIndent+sIndentStyle);
}else{sHTML+=(""+sIndent+sIndentStyle+'"'+j+'":');
}switch(RealTypeOf(jObj[j])){case"array":case"object":sHTML+=this.json1_stringify(jObj[j]);
break;
case"boolean":case"number":sHTML+=jObj[j].toString();
break;
case"null":sHTML+="null";
break;
case"string":sHTML+=('"'+jObj[j]+'"');
break;
case"function":break;
default:sHTML+=("TYPEOF: "+typeof(jObj[j]));
}iCount=iCount+1;
}}if(sDataType==="array"){sHTML+=(""+sIndent+"]");
}else{sHTML+=(""+sIndent+"}");
}return sHTML;
}catch(e){error_handler(e.message,"json1_stringify()");
}};
this.ajax_request=function(spec){try{var requestAsync,load_json_obj_fnc=this.load_json_obj,load_xml_obj_fnc=this.load_xml_obj,append_text_fnc=this.load_txt,json_response_obj,that=this,start_timer=new Date(),elapsed_time,ready_state_msg,status_msg,response_spec,parse_target,parse_target_type,debug_string,send_response_ind,parse_target_text,display_response_text,asyncInd=spec.request.synchronous?false:true;
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM&&spec.loadingDialog.content){spec.loadingDialog.targetDOM.innerHTML=spec.loadingDialog.content;
}}if(spec.request.target.toUpperCase().indexOf(".JSON")==-1&&spec.request.target.toUpperCase().indexOf(".XML")==-1&&spec.request.target.toUpperCase().indexOf(".TXT")==-1){if(spec.request.type==="XMLHTTPREQUEST"){if(window.XMLHttpRequest){requestAsync=new XMLHttpRequest();
}else{if(window.ActiveXObject){requestAsync=new ActiveXObject("MSXML2.XMLHTTP.3.0");
}}}else{requestAsync=getXMLCclRequest();
}if(spec.request.binding&&spec.request.binding>" "){requestAsync.requestBinding=spec.request.binding;
}requestAsync.onreadystatechange=function(){if(requestAsync.readyState===4&&requestAsync.status===200){if(spec.loadingDialog){if(spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="";
}}if(requestAsync.responseText>" "){try{elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
append_text_fnc(debug_string,that);
if(spec.response.type.toUpperCase()==="JSON"){json_response_obj=load_json_obj_fnc(requestAsync.responseText,that);
if(!json_response_obj||(json_response_obj.PARSE_JSON_ERROR&&json_response_obj.PARSE_JSON_ERROR>" ")){send_response_ind=false;
if(spec.loadingDialog&&spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="ERROR: "+messages.json_parsing_failed;
spec.loadingDialog.targetDOM.style.cursor="hand";
spec.loadingDialog.targetDOM.title="Click for more details.";
if(UtilPopup&&(RealTypeOf(UtilPopup)=="object"||RealTypeOf(UtilPopup)=="function")){display_response_text=requestAsync.responseText.split(">").join("&gt;").split("<").join("&lt;");
UtilPopup.attachModalPopup({elementDOM:spec.loadingDialog.targetDOM,event:"click",width:"500px",defaultpos:["30%","20%"],exit:"x",header:"Invalid JSON from "+spec.request.target,content:"<div style='height:500px;width:499px;overflow:auto;'><b>Parameters</b>: "+spec.request.parameters+"<br/><br/><b>Response Text</b>: "+display_response_text+"</div>"});
}else{spec.loadingDialog.targetDOM.onclick=function(event){alert(spec.request.target+"\n"+spec.request.parameters+"\n"+requestAsync.responseText);
};
}}else{alert(messages.json_parsing_failed+" \n\n"+spec.request.target+"\n"+spec.request.parameters);
}}else{send_response_ind=true;
if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={responseText:requestAsync.responseText,response:json_response_obj,parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={responseText:requestAsync.responseText,response:json_response_obj,elapsed:elapsed_time};
}}}else{send_response_ind=true;
if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={responseText:requestAsync.responseText,response:load_xml_obj_fnc(requestAsync.responseText,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={responseText:requestAsync.responseText,response:load_xml_obj_fnc(requestAsync.responseText,that),elapsed:elapsed_time};
}}if(send_response_ind){spec.response.target(response_spec);
}}catch(e){error_handler(e.message,"ajax_request.requestAsync.responseText");
}}}else{try{switch(requestAsync.readyState){case 0:ready_state_msg="0 - Uninitalized";
break;
case 1:ready_state_msg="1 - Loading";
break;
case 2:ready_state_msg="2 - Loaded";
break;
case 3:ready_state_msg="3 - Interactive";
break;
case 4:ready_state_msg="4 - Completed";
break;
}switch(requestAsync.status){case 200:status_msg="200 - Success";
break;
case 405:status_msg="405 - Method Not Allowed";
break;
case 409:status_msg="409 - Invalid State";
break;
case 492:status_msg="492 - Non-Fatal Error";
break;
case 493:status_msg="493 - Memory Error";
break;
case 500:status_msg="500 - Internal Server Exception";
break;
}if(requestAsync.readyState==4&&requestAsync.readyState&&requestAsync.status){ready_state_msg="ajax_request failed on: \n\n Request Target: "+spec.request.target+"\n Request Parameters: "+spec.request.parameters+"\n\n with requestAsync.readyState -> "+ready_state_msg;
status_msg=" requestAsync.status -> "+status_msg;
elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
debug_string+=" <b>requestAsync.readyState </b>"+ready_state_msg;
debug_string+=" <b>requestAsync.status </b>"+status_msg;
append_text_fnc(debug_string,that);
error_handler(ready_state_msg,status_msg);
}}catch(e3){}}};
if(spec.request.type==="XMLHTTPREQUEST"){requestAsync.open("GET",spec.request.target,asyncInd);
if(!spec.request.parameters||spec.request.parameters===null||spec.request.parameters===""){requestAsync.setRequestHeader("Access-Control-Allow-Origin","*");
requestAsync.send(null);
}else{requestAsync.setRequestHeader("Content-type","application/x-www-form-urlencoded");
requestAsync.setRequestHeader("Content-length",spec.request.parameters.length);
requestAsync.setRequestHeader("Connection","close");
requestAsync.send(spec.request.parameters);
}}else{if(location.protocol.substr(0,4)==="http"){var url=location.protocol+"//"+location.host+"/discern/mpages/reports/"+spec.request.target+"?parameters="+spec.request.parameters;
requestAsync.open("GET",url,asyncInd);
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
}catch(e){alert(" requestAsync.setBlobIn not available");
}}requestAsync.send(null);
}else{requestAsync.open("GET",spec.request.target,asyncInd);
if(spec.request.blobIn){try{requestAsync.setBlobIn(spec.request.blobIn);
}catch(e){alert(" requestAsync.setBlobIn not available");
}}requestAsync.send(spec.request.parameters);
}}}else{parse_target=spec.request.target.split(".");
parse_target_type=parse_target[parse_target.length-1].toUpperCase();
parse_target_text=ReadFromFile(spec.request.target);
if(spec.loadingDialog){if(spec.loadingDialog.targetDOM){spec.loadingDialog.targetDOM.innerHTML="";
}}elapsed_time=new Date()-start_timer;
debug_string=" <br><b>Type: </b>"+spec.request.type+"<br>";
debug_string+=" <b>Target: </b>"+spec.request.target+"<br>";
debug_string+=" <b>Parameters: </b>"+spec.request.parameters+"<br>";
debug_string+=" <b>Elapsed Time: </b>"+elapsed_time+" milliseconds -> "+(elapsed_time/1000)+" seconds";
append_text_fnc(debug_string,that);
switch(parse_target_type){case"JSON":if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:load_json_obj_fnc(parse_target_text,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:load_json_obj_fnc(parse_target_text,that),elapsed:elapsed_time};
}break;
case"XML":if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:load_xml_obj_fnc(parse_target_text,that),parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:load_xml_obj_fnc(parse_target_text,that),elapsed:elapsed_time};
}break;
default:if(spec.response.parameters!==undefined&&RealTypeOf(spec.response.parameters)!==null){response_spec={response:parse_target_text,parameters:spec.response.parameters,elapsed:elapsed_time};
}else{response_spec={response:parse_target_text,elapsed:elapsed_time};
}break;
}spec.response.target(response_spec);
}}catch(e){error_handler(e.message,"ajax_request()");
}};
init();
};
var AjaxHandler=new UtilJsonXml();
/**
 * @author RB018070
 */
/***** Error handling methods ***/
function errorHandler(error_obj, det) {
	if (AjaxHandler && AjaxHandler.debug_mode_ind === 1) {
		if (console && console.error) {
			console.error("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
		} else {
			AjaxHandler.append_text("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
		}
	}
	else {
		alert("An error occurred in " + det + " --- >" + AjaxHandler.stringify_json(error_obj));
	}
}
/**
 * @author RB018070
 */

// list of icons displayed on the advisor
var icons = (function () {
	return {
		"restart": "6355_24.png",
		"showComment": "4972.gif",
		"editComment": "5153.gif",
		"documentedOrder": "3796_16.gif",
		"circleLoading": "ajax-loader.gif",
		"editSentence": "4969.gif",
		"root_path": "..",
		"icon_folder_name": "\\img\\"
	};
}());/**
 * @author RB018070
 */

var UtilSort = (function () {
	return {
		jsonTableSort: function (sortPrefs) {
			var parentTable = sortPrefs.parentTable,
				jsonList = sortPrefs.jsonList,
				idAttr	= sortPrefs.idAttr,
				curElement,
				tableChildNodes,
				curJSONObject,
				cntr = 0,
				len;
			
			for (cntr = 0, len = jsonList.length; cntr < len; cntr++) {
				curJSONObject = jsonList[cntr];
				curElement = _g(curJSONObject[idAttr]);
				if (curJSONObject && curElement) {
					curElement = Util.ac(curElement, parentTable);	
				}
			}														
		}
	};
})();


function SortIt(TheArr, us, u, vs, v, ws, w, xs, x, ys, y, zs, z) {
    // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
	function Sortsingle(a, b) {
        var swap = 0;
        if (isNaN(a - b)) {
            if ((isNaN(a)) && (isNaN(b))) {
                swap = (b < a) - (a < b);
            }
            else {
                swap = (isNaN(a) ? 1 : -1);
            }
        }
        else {
            swap = (a - b);
        }
        return swap * us;
    }
	
	function Sortmulti(a, b) {
        var swap = 0;
        if (isNaN(a[u] - b[u])) {
            if ((isNaN(a[u])) && (isNaN(b[u]))) {
                swap = (b[u] < a[u]) - (a[u] < b[u]);
            }
            else {
                swap = (isNaN(a[u]) ? 1 : -1);
            }
        }
        else {
            swap = (a[u] - b[u]);
        }
        if ((v === undefined) || (swap !== 0)) {
            return swap * us;
        }
        else {
            if (isNaN(a[v] - b[v])) {
                if ((isNaN(a[v])) && (isNaN(b[v]))) {
                    swap = (b[v] < a[v]) - (a[v] < b[v]);
                }
                else {
                    swap = (isNaN(a[v]) ? 1 : -1);
                }
            }
            else {
                swap = (a[v] - b[v]);
            }
            if ((w === undefined) || (swap !== 0)) {
                return swap * vs;
            }
            else {
                if (isNaN(a[w] - b[w])) {
                    if ((isNaN(a[w])) && (isNaN(b[w]))) {
                        swap = (b[w] < a[w]) - (a[w] < b[w]);
                    }
                    else {
                        swap = (isNaN(a[w]) ? 1 : -1);
                    }
                }
                else {
                    swap = (a[w] - b[w]);
                }
                if ((x === undefined) || (swap !== 0)) {
                    return swap * ws;
                }
                else {
                    if (isNaN(a[x] - b[x])) {
                        if ((isNaN(a[x])) && (isNaN(b[x]))) {
                            swap = (b[x] < a[x]) - (a[x] < b[x]);
                        }
                        else {
                            swap = (isNaN(a[x]) ? 1 : -1);
                        }
                    }
                    else {
                        swap = (a[x] - b[x]);
                    }
                    if ((y === undefined) || (swap !== 0)) {
                        return swap * xs;
                    }
                    else {
                        if (isNaN(a[y] - b[y])) {
                            if ((isNaN(a[y])) && (isNaN(b[y]))) {
                                swap = (b[y] < a[y]) - (a[y] < b[y]);
                            }
                            else {
                                swap = (isNaN(a[y]) ? 1 : -1);
                            }
                        }
                        else {
                            swap = (a[y] - b[y]);
                        }
                        if ((z === undefined) || (swap !== 0)) {
                            return swap * ys;
                        }
                        else {
                            if (isNaN(a[z] - b[z])) {
                                if ((isNaN(a[z])) && (isNaN(b[z]))) {
                                    swap = (b[z] < a[z]) - (a[z] < b[z]);
                                }
                                else {
                                    swap = (isNaN(a[z]) ? 1 : -1);
                                }
                            }
                            else {
                                swap = (a[z] - b[z]);
                            }
                            return swap * zs;
                        }
                    }
                }
            }
        }
    }
	
    if (u === undefined) {
        TheArr.sort(Sortsingle);
    } // if this is a simple array, not multi-dimensional, ie, SortIt(TheArr,1): ascending.
    else {
        TheArr.sort(Sortmulti);
    }
    return TheArr;
}
