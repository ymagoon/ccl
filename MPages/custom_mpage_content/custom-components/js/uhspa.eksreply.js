/*
  // you have some reference to a custom component
  var mycomp = new uhspa.custommpagecomponent();
  
  // create an eksReply object, set to cancel the original order
  var eksReply = (new EksReply()).setup(1);

**** basic usage: ****
  // what to do when the all the orders are complete
  eksReply.onComplete(
    function( eksReply ){
      CCLEVENT("EVENT_EKS_REPLY", eksReply.toXML());
      }
    );
  
  // make a "NURSING COMMUNICATION" order with "some special instructions"
  eksReply.newOrderableByMnemonicKeyCap( 
     mycomp
    ,"NURSING COMMUNICATION"
    ,function( newOrd ){
      var oRef = newOrd.findOrderDetail( "SPECINX" ); 
      if( oRef ){ oRef.setFieldDisplayValue('some special instructions'); }

      newOrd.setComplete();
      }
    );
  // more order requests

**** alternate usage example: ****
  eksReply.onComplete(
    function( eksReply ){
      $("#myGoButton").removeAttr("disabled");
      }
    );

  eksReply.newOrderableByMnemonicKeyCap( 
     mycomp
    ,"NURSING COMMUNICATION"
    ,function( newOrd ){}
    );

  
  $("#myGoButton").click( function(evt){
    var order1 = eksReply.findOrderable( "NURSING COMMUNICATION" );
    if( order1 ){
      var oRef = order1.findOrderDetail( "SPECINX" );
      if( oRef ){ 
        oRef.setFieldDisplayValue('some special instructions'); 
        }
      order1.setComplete();  // this means we're done editing this orderable  
      }
    // repeat for order2 .. orderN
    
    // this reassignment will immediately execute the function if all the orders successfully setComplete() above
    eksReply.onComplete(
      function( eksReply ){
        CCLEVENT("EVENT_EKS_REPLY", eksReply.toXML());
        }
      );
      
    if( getComplete.getComplete() > 0 ){
      // the callback function was fired
      }
    else {
      // perhaps something is wrong
      }
      
    });

    
*** CCL to lookup Detail/Field for an Orderable(?????) ***
select 
  off.oe_field_id
  ,ofm.oe_field_meaning
  ,off.label_text
  ,off.default_value
from order_catalog_synonym ocs
    ,oe_format_fields off
    ,order_entry_fields oef
    ,oe_field_meaning ofm
plan ocs
     where ocs.mnemonic_key_cap = "?????"
     and ocs.mnemonic_type_cd = value(UAR_GET_CODE_BY("MEANING",6011,"PRIMARY"))
join off
     where off.oe_format_id = ocs.oe_format_id
       and off.action_type_cd = value(uar_get_code_by("MEANING",6003,"ORDER"))
join oef
     where oef.oe_field_id = off.oe_field_id
join ofm
     where ofm.oe_field_meaning_id = oef.oe_field_meaning_id
 
order by off.group_seq, off.field_seq, off.oe_field_id
with maxrec = 2000, time=90
    
*/

/* *** extend Detail *** */

Detail.prototype.setFieldLabel = function( fieldLabel ){
   this.fieldLabel = fieldLabel;
}
Detail.prototype.getFieldLabel = function(){
   return this.fieldLabel;
}

/* *** extend Orderable *** */    

/* either return the existing requested order detail, or create one from the template in the detailmap */
Orderable.prototype.findOrderDetail = function( key ){
  /* the only reason we scan the array rather than using a maplike object is because someone might actually use the native methods to add details themselves and we'd lose track of them */
  var i = (!this.orderDetailList) ? -1 : this.orderDetailList.length-1;  /* if there is not an orderDetail list then -1 else read the length once, work backwards to a fixed starting point */
  while( i >= 0 && this.orderDetailList[i].getFieldLabel() != key ){ i--; } /* keep iterating until we find the index or pass the front of the list */
  
  if( i >= 0 ){ /* the detail object was found in the existing list ( we didn't pass it ) */
    var rv = this.orderDetailList[i];
    }
  else { /* wasn't found, make one */
    var dtl = this.detailmap[ key ];  /* find the detail in the map */
    if( dtl ){  /* if the detail was found (because, people lookup invalid codes... or codes that worked in dev sometimes get deleted */
      var rv = this.newOrderDetail(); /* use native newOrderDetail() method, set the object properties (caller will have to set *values) */
      rv.setFieldId( parseFloat(dtl.OE_FIELD_ID) );
      rv.setFieldMeaning( dtl.OE_FIELD_MEANING );
      rv.setFieldMeaningId( parseFloat(dtl.OE_FIELD_MEANING_ID) );
      rv.setFieldLabel( dtl.OE_FIELD_LABEL );
      /* the 'type' will remain in the detailmap, along with any other information that comes from the getObj call */
      }
    else {
      /* 
        the next line of code was probably going to call a .setFoo() method but there won't be an object returned...
          maybe there was a typo in the calling code, maybe someone deleted the detail long after development validation passed
      */
      var ordnm = (this.parent) ? this.parent.getMnemonicKeyCap : "OrderReference" ;  /* if 'this' has a parent reference, use it to get the Mnemonic for the order, else generic "OrderReference" */
      alert( "Invalid order detail:\n" + ordnm + ".findOrderDetail('" + key + "'" );
      }
    }
  
  return rv;
  }
/*
  method to set a reference to the orderable parent (EksReply object) 
  for the sake of orderable.setComplete() to initiate EksReply complete assessment 
*/
Orderable.prototype.setParent = function( p ){
  this.parent = p;
  }
/* add setter for MnemonicKeyCap because that may be the only way the caller knows to name the orderable */
Orderable.prototype.setMnemonicKeyCap = function(mnemonickeycap){
   this.mnemonickeycap = mnemonickeycap;
}  
/* add getter because it's used by the findOrderable function */
Orderable.prototype.getMnemonicKeyCap = function(){
   return this.mnemonickeycap;
}  
/* add the setComplete() function so we know when the caller has finished editing this orderable */  
Orderable.prototype.setComplete = function(p){
  this.isComplete = (p==undefined) || !!p;  /* if p is not passed(undefined) then true, otherwise force to a boolean value whatever was passed */
  /* 
    this space could be used to assess orderdetails for required/etc.
  */
  if( this.getComplete() ){ /* if() [prevent calling checkComplete if we already know this one isn't ready] */
    this.parent.doComplete();   /* attempt to do the completion callback on the parent (EksReply object) - it has it's own guard against incomplete orderables */
    }

  /* return this status in case the caller wanted to know (use the getter in case it is ever extended/modified */
  return this.getComplete();
  }
/* if we aren't sure the status of the orderable, this allows us to check it without knowing internals */
Orderable.prototype.getComplete = function(){  
  return this.isComplete;
  }
  
  
/* *** extend EksReply *** */

/* 
  convenience function for basic setup 
  usage: 
    var eksReply = new EksReply();
    eksReply.setup(1); 
  or  
    var eksReply = (new EksReply()).setup(1); 
    
  fyi:
    cancelOrder : [ undefined | 1 | true | a truthy value ] = cancel the order  
    cancelOrder : [ 0 | false | a falsey value ] = don't cancel the order
*/  
EksReply.prototype.setup = function( cancelOrder ){
  this.setScratchPadChangeInd(1); /* docs say "always set to 1" */
  this.setCancelOrder(99);        /* docs say "always set to 99" */
  var sp = this.getScratchPad();
  if( (cancelOrder==undefined) || !!cancelOrder ){
    sp.setActionFlag( 1 );
    }  
  else {
    sp.setActionFlag( 0 );
    }
    
  return this;  /* enables chaining this method onto the construction, see note above */
  }
  
/* 
  we may need to retrieve an orderable reference from the EksReply after it was loaded asynchronously, 
    use MnemonicKeyCap (default) to retrieve this orderable from the orderableList
*/
EksReply.prototype.findOrderable = function( key, by ){
  if( !{MnemonicKeyCap:true,Mnemonic:true,CatalogCd:true,SynonymId:true,FormatId:true}[ by ] ){ by = "MnemonicKeyCap"; }

  var i = this.orderableList.length-1;
  while( i >= 0 && this.orderableList[i][ "get"+by ]() != key ){ i--; }
  return this.orderableList[i];
  }
  
/*
  it is possible that multiple orderables could be loading asynchronously.  Since we don't know (or sometimes even care) 
  when they've completed, we just want to schedule a callback function for whenever the orderables are all complete.
  - this could be used to actually call CCLEVENT("EVENT_EKS_REPLY", theEKSReplyRef.toXML())  
    ex:  localEKSReply.onComplete( function( myEKSReply ){  CCLEVENT("EVENT_EKS_REPLY", myEKSReply.toXML()); } );
  OR
  - it could be used to enable a UI element to call CCLEVENT("EVENT_EKS_REPLY", theEKSReplyRef.toXML())
    ex:  localEKSReply.onComplete( function( myEKSReply ){ $("#myGoButton").removeAttr("disabled"); );
    ex:  where the #myGoButton click method calling CCLEvent itself
    
  fwiw: it is a good idea to use the EksReply.onComplete() method for consistency
    since EksReply.isReady() checks the Orderables' .getComplete() which may have assessors for status
    the onComplete assignment will immediately doComplete() if orderables exist and are all ready to go
*/  
EksReply.prototype.onComplete = function( callback ){
  this.completeCalled = 0;
  this.completeCallback = callback;
  /* in case someone is assigning the callback function after all orders are already ready */
  if( this.isReady() ){
    this.doComplete();
    }
  }
/* return the completion status of this EKSReply object by iterating/checking its orderables */
EksReply.prototype.isReady = function(){
  if( this.orderableList == null ){
    var rv = false;
    }
  else {
    var i = this.orderableList.length-1;  /* one read of array length, then work backwards towards 0 */
    var rv = ( i >= 0 );  /* if there are orders to process, assume we are ready to go; else false */
    while( rv && i >= 0 ){ /* as long as we're still good and there are items remaining to check */
      rv = this.orderableList[i].getComplete();  /* any incomplete orderable means the reply is not ready */
      i--;  /* item */
      }
    }
  return rv;
  }
/* interface for doing the callback function assigned via onComplete() */  
EksReply.prototype.doComplete = function( allowMultiple ){  
  var multi = allowMultiple || false;
  if( this.isReady() ){         /* everything is complete/ready to go...  */
    this.completeCalled = this.completeCalled++ || 1;   /* increment existing property or that failed so initialize to 1 */ 
    if( this.completeCalled == 1 || multi ){  /* if this is the first call, or the allowMultiple override is set (idk why that would ever need to happen) */
      if( typeof this.completeCallback == 'function' ){
        this.completeCallback( this );  /* pass this EksReply to it's callback function */
        }
      }
    }
  }
/* interface to expose completeCalled / check status */ 
EksReply.prototype.getComplete = function(){
  return this.completeCalled;
  }
/* 
  load an orderable into the EksReply object from a template retrieved via loadCCL
  component :       an mpage component from which to getProperty() for cclParames
                    as well as a host for the .loadCCL() method (because EksReply doesn't natively have this capability)
  mnemonickeycap :  the 'template' name for the last parameter of "UHS_MPG_GET_ORDER_OBJ" (also how the caller will likely findOrderable() later if necessary)
                    aka "the thing you want to order"
  callback :        follow up for after the asych .loadCCL() method has finished and the template/orderable is loaded into EksReply object
                    aka "when the thing is ready, do this to it"
*/  
EksReply.prototype.newOrderableByMnemonicKeyCap = function(component, mnemonickeycap, callback){
  var theOrder = this.newOrderable();
  theOrder.setMnemonicKeyCap( mnemonickeycap ); /* custom property */
  theOrder.setComplete( false ); /* custom property */  
  theOrder.setParent( this ); /* give this order a reference to the parent [fwiw: this causes circular object references, which upsets JSON.stringify() ] */
  theOrder.detailmap = {};
  
  /* closure over "theOrder" (and "callback") to be used as a callback for when the loadCCL is complete */
  var templateparse = function( data ){
    theOrder.setSynonymId( data.RREC.SYNONYM_ID );
    theOrder.setCatalogCd( data.RREC.CATALOG_CD );
    theOrder.setFormatId( data.RREC.OE_FORMAT_ID );
    theOrder.setMnemonic( data.RREC.MNEMONIC );
    
    /* iterate template order details and create detailmap on the order */
    for( var i=0, iMax=data.RREC.DET.length; i<iMax; i++ ){
      var dtl = data.RREC.DET[i];
      theOrder.detailmap[ dtl.OE_FIELD_LABEL ] = dtl;
      }
    
    /* pass the new orderable to the callback function that was sent into the newOrderableByMnemonicKeyCap method */
    callback( theOrder );
    }

  var cclParams = ["MINE"
    ,component.getProperty("personId")
    ,component.getProperty("encounterId")
    ,component.getProperty("userId")
    ,mnemonickeycap
    ];
    
  /* load ccl to get object template, pass the "templateparse" function as callback */ 
  component.loadCCL("UHS_MPG_GET_ORDER_OBJ"
    ,cclParams
    ,templateparse
    ,"JSON");     

  }
