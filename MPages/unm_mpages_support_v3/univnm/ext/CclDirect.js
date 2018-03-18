/* Topic: License 
	The MIT License
	
	Copyright (c) 2010 University of New Mexico Hospitals 
	
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


/* Topic: Ext Direct 
	Using Ext Direct with MPages
	
	What is Ext Direct?:
	
	Ext Direct (http://www.sencha.com/products/js/direct.php) is Remote Procedure 
	Call (RPC) protocol that allows for local function definitions of remote web 
	services. Of particular benefit for MPages is the ability to combine 
	multiple callbacks into a single request. By default, all requests made within 10 
	milliseconds are batched into a single callback.
	
	Here is a quick example:
	
	Old way:
	(code)
	<script>
		// a function like this needs to be created for every CCL callback
		function getStuffAboutPatient(patientId, callback){
			var ccl = new XMLCclRequest();
			ccl.onreadystatechange=function(){
				if (calllback.readyState==4) {
					var status = callback.status
					if (status=="200" || status=="0"){
						callback(eval("(" + ccl.responseText + ")"))
					}
				}
			}
			ccl.open("GET", "GETSTUFFABOUTPATIENT", true);
			ccl.send("^MINE^, " + patientId);
		}
		...
		//Make the call
		for (var x=0; x < patients.length; ++x){
			//each of these is a different callback, causing an async bottleneck
			getStuffAboutPatient(patients[x],function(result){
				//do stuff with result
			});
		}
	</script>
	(end)
	
	Ext Direct Way:
	(code)
	<script src="../shared/js/mpages_core.js"></script>
	<script src="../shared/js/mpages_jslib.js"></script>
	<script src="../ext/ext-3.2.1/adapter/ext/ext-base.js"></script>
	<script src="../ext/ext-3.2.1/ext-all.js"></script>
	<script src="../shared/js/PCRemotingProvider.js"></script>
	<script>
		//Ext will generate functions from this API
		Ext.Direct.addProvider({
			ccl:"ccl_direct", //name of the router program
			type:"pcremoting", //indicates that Ext should use our custom provider
			enableBuffer:300, //time to wait for requests before sending callback
			urlPrefix:"data", //Where to look for dummy output file when inMpage==false
			actions:{
				MyApp:[{// can be any name you want. Functions will be generated in this namespace.
					name:"getStuffAboutPatient", // CCL name
					len:1 //This is always 1
					//,"dontBatch":true // this causes this ccl to NOT be included in batch callbacks
				}]
			}
		})
		
		//Make the call
		for (var x=0; x < patients.length; ++x){
			//each of these will be fired within 10 ms, so they are bundled into one callback
			MyApp.getStuffAboutPatient(["MINE",patients[x]],function(result){
				//do stuff with result
			});
		}
	</script>
	(end)
	
	To use Ext.Direct with CCL:
		* You need to include the PCRemotingProvider.js file, 
		* You need to install the <ccl_direct.prg> file into the backend.
		* Every CCL that will be called in this method must call "return()" with a string JSON response
		* Finally you need to create an API that describes your CCL scripts. For more detail on the 
	options available in the API definition, see 
	<http://dev.sencha.com/deploy/dev/docs/?class=Ext.direct.RemotingProvider>
	
	 
	
	Note:
		We have made a few extensions to the default Ext.Direct API definition
		that are only supported by the PCRemoting provider
		 
		
	UNM Extensions:
		urlPrefix		-	*Optional, default current directory*
							This can be defined as a root level property or in 
							a method definition. This defines the path to find 
							a file with the same name as the method name that 
							contains an example return text to use when 
							inMpage==false
							
		dontBatch		-	*Optional, default false*
							This is set in the method definition. When true, 
							this causes this method to NOT be included in batch 
							calls. In the case of both "dontBatch" and batchable 
							calls being made within the timeout, all batchable 
							calls will be made first in a single callback, 
							followed by the "dontBatch" calls in the order they 
							were requested
*/
/* Topic: ccl_direct.prg
	The source code for the CCL router is in the univnm/ccl/ folder as ccl_direct.prg
*/	


Ext.define("univnm.ext.CclDirect", {
	alias:"direct.ccl_directprovider",
	extend:"Ext.direct.RemotingProvider",
    requires: [
        'Ext.util.MixedCollection', 
        'Ext.util.DelayedTask', 
        'Ext.direct.Transaction',
        'Ext.direct.RemotingMethod'
    ],


	constructor: function(config){
		this.callParent([config]);
		this.callBuffer = univnm.ext.CclDirect.callBuffer
	},
	statics:{
		callBuffer:[]
	},
	connect: function(){
		if(this.ccl){
			this.initAPI();
			this.connected = true;
			this.fireEvent('connect', this);
		}else {
			throw 'Error initializing PCRemotingProvider, no CCL router name configured.';
		}
	},
	
	combineAndSend:function(){
		var batch=[];
		var dontBatch=[];
		var $this= this
		this.callBuffer.forEach(function(t){
			var methodAPI =t.getProvider().actions[t.action].reduce(function(found,m,i){
				if (found) return found;
				if (m.name == t.method) {
					return m;
				}
				else return false;
			},false)
			
			if (methodAPI.dontBatch){
				dontBatch.push(t);
			} else {
				batch.push(t);
			}
		})
		//clear the callBuffer
		this.callBuffer.splice(0,this.callBuffer.length);;
		if(batch.length){
			this.sendRequest(batch);
		}
		
		dontBatch.forEach(function(t){
			$this.sendRequest(t);
		})
	},
	/* onData: function(opt, success, xhr){
		alert("ondata")
		if(success){
			
			var events = this.getEvents(xhr);
			for(var i = 0, len = events.length; i < len; i++){
				var e = events[i],
					t = this.getTransaction(e);
				   
				this.fireEvent('data', this, e);
				if(t){
					this.doCallback(t, e, true);
					Ext.Direct.removeTransaction(t);
				}
			}
		}else{
			var ts = [].concat(opt.ts);
			for(var i = 0, len = ts.length; i < len; i++){
				var t = this.getTransaction(ts[i]);
				if(t && t.retryCount < this.maxRetries){
					t.retry();
				}else{
					var e = new Ext.Direct.ExceptionEvent({
						data: e,
						transaction: t,
						code: Ext.Direct.exceptions.TRANSPORT,
						message: 'Unable to connect to the server.',
						xhr: xhr
					});
					this.fireEvent('data', this, e);
					if(t){
						this.doCallback(t, e, false);
						Ext.Direct.removeTransaction(t);
					}
				}
			}
		}
	}, */
	onData: function(options, success, response){
        var me = this,
            i = 0,
            len,
            events,
            event,
            transaction,
            transactions;
            
        if (success) {
            events = me.createEvents(response);
            for (len = events.length; i < len; ++i) {
                event = events[i];
                transaction = me.getTransaction(event);
                me.fireEvent('data', me, event);
                if (transaction) {
                    me.runCallback(transaction, event, true);
                    Ext.direct.Manager.removeTransaction(transaction);
                }
            }
        } else {
            transactions = [].concat(options.transaction);
            for (len = transactions.length; i < len; ++i) {
                transaction = me.getTransaction(transactions[i]);
                if (transaction && transaction.retryCount < me.maxRetries) {
                    transaction.retry();
                } else {
                    event = Ext.create('Ext.direct.ExceptionEvent', {
                        data: null,
                        transaction: transaction,
                        code: Ext.direct.Manager.self.exceptions.TRANSPORT,
                        message: 'Unable to connect to the server.',
                        xhr: response
                    });
                    me.fireEvent('data', me, event);
                    if (transaction) {
                        me.runCallback(transaction, event, false);
                        Ext.direct.Manager.removeTransaction(transaction);
                    }
                }
            }
        }
    },
	sendRequest: function(data){
		$this =this;
		
		var o = {
			ccl:this.ccl,
			parameters:["MINE"],
			async:true,
			onsuccess:function(v,r,o){
				var obj = Ext.decode(r.responseText)
				obj.forEach(function(t)
				{					
					if(!t.data)
					{
						//alert(r.responseText);
						throw new Error("No data returned for CCL script '"+t.method+"'. \n"
							+"Be sure that a RETURN(<json data>) statement is in that CCL")
					}
					t.data =univnm.jslib.fixCclJson(t.data) 
				})
				
				$this.onData(o,true,{
					responseText:Ext.encode(obj)
				});
			},
			ts:data,
			timeout:this.timeout
		}

		if(!Ext.isArray(data)){
			data=[data];
		}
		
		var p=""
		var transactions=[[]];
		var curTransArray=transactions[0]
		var transTotalLength=0;
		var maxTransLength = 1900 - ("^MINE^,".length + o.ccl.length)
		if ($env.mpageType != "external" || $env.serviceSupportsDirect){
			data.forEach(function(t,index){
				if (!t.data[0]) t.data[0] = []
				if (!t.tid) t.tid = t.id
				if (!Ext.isArray(t.data[0])){
					debug_window(t)
					throw new Error("The first argument to "+t.action+"."+t.method+" must be an array")
				}
				t.data = t.data[0].map(function(arg,index){
					if (typeof(arg) == 'string'){
						if (!/'/.test(arg)){
							return "'" + arg + "'"
						}else if (!/\^/.test(arg)){
							return '^' + arg +'^'	
						} else if (!/"/.test(arg)){
							return '"' + arg +'"'
						}else{
							throw new Error(t.action+"."+t.method+": argument "+index+" ("+arg+") can only contain 2 types of quotes, i.e ', \", or ^")
						}
					} else {
						return arg;	
					}
				}).join().replace(/\^/g,"__CARET__")
				var curTrans=
					t.action +"~"+
					univnm.jslib.applyCclMask(t.method)+"~"+
					'rpc~'+
					t.tid+"~"+
					t.data.replace(/~/g,"CCL_DIRECT_TILDE")
				;
				
				if (transTotalLength + curTrans.length >= maxTransLength && curTransArray.length){
					
					transactions.push(curTransArray = [])
					transTotalLength=0;
				}
				
				curTransArray.push(curTrans);
				transTotalLength += curTrans.length;
			})
			transactions.forEach(function(transArray){
				var transString = transArray
					.map(function(trans){
						return trans.replace(/\|/g,"CCL_DIRECT_PIPE")
					})
					.join("|")
				o.parameters=["MINE",transString];
				univnm.jslib.ccl_callback(o);
			})
			
		} else {
			//alert('not an mpage foo?')
			data.forEach(function(t,index){
				var methodAPI =t.provider.actions[t.action].reduce(function(found,m,i){
					if (found) return found;
					if (m.name == t.method) {
						return m;
					}
					else return false;
				},false)
				var o = {
					ccl:applyCclMask(methodAPI.name),
					parameters:["MINE"],
					index:index,
					async:true,
					url_prefix:t.provider.urlPrefix|| methodAPI.urlPrefix|| undefined,
					onsuccess:function(v,r,o){
						var response ={
							action:t.action,
							method:applyCclMask(t.method),
							type:"rpc",
							tid:t.tid,
							data:univnm.jslib.fixCclJson(r.responseText.parseJson())
						};
						var proxy = ObjectLib.setDefaultProperties({
							responseText:ObjectLib.toJson(response)
						},r);
						
						t.provider.onData(o,true,proxy);
					},
					ts:data,
					timeout:this.timeout
				}
				univnm.jslib.ccl_callback(o);
			})
		}
	}
});
