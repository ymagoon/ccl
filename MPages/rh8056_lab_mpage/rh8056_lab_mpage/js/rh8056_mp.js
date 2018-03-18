/***************************************************************************************
* Major change tracking:                                                               *
* Engineer: RH8056                                                                     *
* Date: October, 2015                                                                  *
* Version | Engineer      | Date       | Change Description                            *
* v 0.0   | RH8056        | 2015-10-26 | Demonstration of basic MPage events.  This    *
*                                      | simply puts a button on a page that calls a   *
*                                      | function to execute a CCL.  That CCL then     *
*                                      | responds back with a JSON file.  The JSON file*
*                                      | is then looped through to popup an alert on   *
*                                      | the screen for the name_full_formatted.       *
***************************************************************************************/
var paramsArr = [];

function getEvents(){
  var innerData = "<div id='divTwo'><p>This is new data from the JavaScript file</p></div>";
  var buttons = "<div id='divButtons'><button id='goCCL'>Go CCL</button>";
  $('#divWrapper').append(innerData);
  $('#divWrapper').append(buttons);
}
$(document).ready(function() {
  $('body').on('click','#goCCL',function(){ 
    paramsArr = [];
    paramsArr.push('^MINE^','^^','^^');
    CCLRequest('RH8056_LAB_MPAGE',paramsArr,function(){
      for(k in replyDoc.QUAL){
        alert(replyDoc.QUAL[k].NAME_FULL_FORMATTED);
      }
    });
  });
});

CCLRequest = function(scriptName,paramsArr,callback){
  log.debug("In CCLRequest for "+scriptName);
  var request = new XMLCclRequest();
  var success = ["Z","S"];
  request.onreadystatechange = function(){
    if(request.readyState == 4 && request.status ==200){
      var replyRaw = request.responseText;
      log.debug("In CCLRequest for "+scriptName);
      log.debug("replyRaw: " + replyRaw);
      replyDoc = $.parseJSON(replyRaw).RECORD_DATA;
      if(success.indexOf(replyDoc.STATUS_DATA.STATUS) >= 0){
        callback(replyDoc);
      }else{
        var errMsg = [];
        errMsg.push("<b>Discern Error in CCLRequest for ",scriptName," with parameters of: ",paramsArr);
        alert(errMsg.join(''));
      }
    }
  }
  request.open('GET',scriptName);
  request.send(paramsArr.join(','));
}