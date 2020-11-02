  function addSections() {
    let txt = [
      "<div id='topDiv'>",
        "<div id='bannerDiv' class='banner'>banner</div>",
//        "<div id='headerDiv' class='header'>header</div>",
      "</div>",
      "<div id='ordersDiv'>orders</div>",
      "<div id='footerDiv'>footer</div>"];

    $('#mainDiv').html(txt.join(""));
  }
  
  //  CREATE BANNER DISPLAY
  function bannerBar() {
    let txt = [
    "<table class='bannerTable'>",
      "<tr>",
        "<td class='bannerCell pt-name'>",pt.name,"</td>",
        "<td class='bannerCell'>DOB: ",pt.dob,"</td>",
        "<td class='bannerCell'>Age: ",pt.age,"</td>",
        "<td class='bannerCell'>Sex: ",pt.sex,"</td>",
        "<td class='bannerCell bold'>MRN: ",pt.mrn,"</td>",
        
      "</tr>",
      "<tr>",
        "<td class='bannerCell'>Allergies: ",pt.allergies,"</td>",
        "<td class='bannerCell'>Dose Wt: ",pt.weight,"</td>",
        "<td class='bannerCell'>Height: ",pt.height,"</td>",
        "<td class='bannerCell bold'>Fin#: ",pt.fin,"</td>",
        "<td class='bannerCell'>Location: ",pt.location,"</td>",
      "</tr>",
    "</table>"];
    $('#bannerDiv').html(txt.join(""));
  }

  // MESSAGE HEADER
  function headerMsg() {
    let txt = [];

    if (orders.cautiAlert()) {
      txt.push("Urinary Catheter Care orders exist, <span class='redH'>but it does not appear nurse has documented</span>.")
    }
    if (orders.clabsiAlert()) {
      txt.push("Venous Catheter Care orders exist, <span class='redH'>but it does not appear nurse has documented</span>.")
    }

    if (txt.length) {
      txt.push('Please contact them to document');
    }

    $('#headerDiv').html(txt.join('<br>'));
  }

  // CREATE TABLE TO DISPLAY EXPIRING ORDERS
  function displayOrders() {

    let txt = [
    "<table id='ordersTable' class='ordTable'>",
      "<thead class = 'header'>",
        "<tr>",
          "<th class='column1'>Order Name/Details</th>",
          "<th class='radio'><img src='@OPT_FREETEXT_PARAM/anteca/imgs/continue.png' alt='Continue Order' /></th>", // prod
          "<th class='radio'><img src='@OPT_FREETEXT_PARAM/anteca/imgs/discontinue.png' alt='Discontinue Order' /></th>", // prod
          // "<th class='radio'><img src='imgs/continue.png' alt='Continue Order' /></th>", // test
          // "<th class='radio'><img src='imgs/discontinue.png' alt='Discontinue Order' /></th>", // test
          "<th class='column2'>Continue Reason</th>",
          "<th class='column3'>Start</th>",
          "<th class='column3'>Stop</th>",
        "</tr>",
      "</thead>",
      "<tr class='order-type'>",
        "<td colspan=6>Cathether and Line Care Orders</td>",
      "</td>"];

    orders.allOrders().forEach(function(item, index) {
      if (item.type === 'care') {
        let pos = orders.findMapPos(item.catalogCd);

        txt.push(
        "<tr class='row'>",
          "<td class='column1' name='ord' id='n",item.orderId,"' idx=",index," catalogCd=",item.catalogCd," pos=[",pos,"]><span class='mySpan' id='l",item.orderId,"'>",
            item.orderMnemonic,"</span>",
          "</td>",
          "<td class='radio'>",
            "<input type='radio' name=order",index," value=continue idx=",index," pos=[",pos,"] class='allOrder-radio'>",
          "</td>",
          "<td class='radio'>",
            "<input type='radio' name=order",index," value=discontinue idx=",index," pos=[",pos,"] class='allOrder-radio'>",
          "</td>",
          "<td>"
        );
		
        let indications = displayIndications(pos, item.indicationCd);

        if (indications.length) {
          txt.push(
            "<select class='indication' name='indication",index,"'idx=",index," pos=[",pos,"]>",
              indications, 
            "</select>"
          )
        }

        txt.push(
          "</td>",
            "<td class='column3' id='s",item.orderId,"'>",item.startDtTm,"</td>",
            "<td class='column3' id='e",item.orderId,"'>",item.stopDtTm,"</td>",
          "</tr>"
        )
      }
    });

    txt.push("</table>");
    $('#ordersDiv').html(txt.join(""));
    
    // make column width dynamic
    let maxLength = [];
    orders.allOrders().forEach(function(item, index){
      let curLength = $('#l'+item.orderId).width()
      maxLength.push(curLength);
    });
    $('.column2').css('width', (Math.max.apply(null,maxLength)+5) + "px");
  } // end displayOrders

  function displayIndications(pos, indicationCd) {
    let indications = orders.getIndications(pos);
    let txt = [];

    if (indications.length) {
      txt[0] = "<option value=-1>Select a Continue Reason...</option>";

      indications.forEach(function(indication, index) {
		if (indicationCd === indication.codeValue) {
		  txt.push("<option value=",indication.orderSentenceId," selected>",indication.indication,"</option>");
		} else {
          txt.push("<option value=",indication.orderSentenceId,">",indication.indication,"</option>");
		}
      });
    }
    return txt.join("");
  }

  // FOOTER DISPLAY
  function footerDisplay() {
    $('#footerDiv').html("<input type='button' value='Sign' id='bContinue' class='button'>\
                          &nbsp&nbsp&nbsp&nbsp<input type='button' value='Reset' id='bReset' class='button'>\
						  &nbsp&nbsp&nbsp&nbsp<input type='button' value='Skip' id='bSkip' class='button'>");
  }

  $(document).ready(function(){
    console.log("lets begin");
    addSections();
    bannerBar();
 //   headerMsg();
    displayOrders();
    footerDisplay();
 //   resetButtons();
 //   console.log(list);

    $( "<div id='messageDiv'></div>" ).insertBefore( $( "#bContinue" ) );
  });

  // RADIO BUTTONS 
  $(document).on('click', '.radio', function (e) {
    if (e.target.type === 'radio') {
      let idx = $(e.target).attr("idx");
      let searchStr = "select[idx=" + idx + "]";

      if (e.target.value === 'continue') {
        orders.orders(idx).status = 2;
		$(this).prop("checked", true)
		
        // show indications
        $(searchStr).css("visibility", "visible");
      } else if (e.target.value === 'discontinue') {
        orders.orders(idx).status = 1;

        // hide indications
        $(searchStr).css("visibility", "hidden");
      }
    }
  });

  // CONTINUE BUTTON
  $(document).on('click', '#bContinue', function () {
    validateOrders();
    // processOrders();
  });

  // RESET BUTTON
  $(document).on('click', '#bReset', function () {
    resetButtons();
    // processOrders();
  });
  
  // SKIP BUTTON
  $(document).on('click', '#bSkip', function () {
    // closer Discern Alert window
    CCLEVENT('EVENT_EKS_OK');
  });

  function resetButtons() {
    $('.allOrder-radio').prop('checked', false); 
    $('.indication').css("visibility", "hidden");
	 
    orders.allOrders().forEach(function(item, index){
	  if (item.status > 0) {
	    orders.orders(index).status = 0
      }
    });
	
	$("#messageDiv").html("");
	 	
    // ADD MOUSE HOVER DISPLAY ON ORDER VIA JQUERYUI
    $( "[name=ord]" ).tooltip({
      items: "[name=ord]",
      content: function () { return displayTooltip($(this).attr('idx')); }
    });
  }

  function validateOrders() {
     // validate that provider selected an indication for each order they are continuing
     let results = [];
     orders.allOrders().forEach(function(item, index) {

      // continue
       if (item.status === 2) {
         let searchStr = "select[name=indication" + index + "]";
         let orderSentence = $(searchStr).val();

         if (orderSentence === '-1') {
            results.push(item.orderMnemonic + ' order does not have a continue reason selected.');
         }
       }
     });

     if (results.length === 0) {
       processOrders();
     } else {
       $("#messageDiv").html(results.join("<br>"));
     }
     
  }

  // PERFORMS SELECTED ACTIONS ON EACH ORDER
  function processOrders() {
    // 3. Call CCL program and pass it list of order_id's that need to be completed
    // add former order to list of orders to complete

    let value = [personId, encntrId] //, txt = ["1",orders.me()];
    let orderTxt = "";
    let doAction = 0;
    
    // A set of flags that can be used to define the style of the Modal Order Entry Window. 
    // Use a value of 24 to enable PowerPlans. 
    // Otherwise, set this flag to 0.
    let customizeFlags = "0";

    // The tab that is to be modified. 
    // Use a value of 2 for customizations to the Order List profile. 
    // Use a value of 3 for customizations to the Medication List profile.
    let tab = "2";

    // A set of flags that can be used to define the style of the tab being altered by 'tab'. 
    // For full PowerOrders functionality, a value of 127 will need to be set.
    let tabDisplayFlags = "127";

    // let tabLst = `{${tab}|${tabDisplayFlags}}`;
    let tabLst = '{' + tab + '|' + tabDisplayFlags + '}';

    // The view to display by default when launching into the Modal Order Entry Window. 
    // A value of 8 will default to the order search. 
    // A value of 16 will default to the order profile. 
    // A value of 32 will default to the orders for signature.
    let defaultDisplay = "32";

    // A Boolean flag used to determine if the Modal Order Entry Window should sign orders silently.  
    // When this flag is set, and the required details on each new order are pre-populated, it causes the orders to be signed automatically 
    // without displaying the Modal Order Entry Window.  Orders are signed automatically when existing orders are not already on the scratchpad 
    // and no other orderActions are present.
    let silentSignFlag = "1";
    
    // let customParams = `${customizeFlags}|${tabLst}|${defaultDisplay}|${silentSignFlag}`; // e.g. 0|{2|127}|32|1
    let customParams = [customizeFlags, tabLst, defaultDisplay, silentSignFlag].join("|");

    // The type of order to be associated with the new order. A value of 0 represents a normal order.
    // A value of 1 represents a Prescription order. A value of 5 represents a satellite order.
    let orderOrigination = 0;

    // The optional nomenclature_id to be associated with the new order.
    let nomenId = 0;

    // A Boolean flag to determine if interaction checking should only be performed at sign-time or not.
    let signTimeInteractionFlag = 0;

    orders.allOrders().forEach(function(item, index) {
      let searchStr = "select[name=indication" + index + "]";
      let orderSentence = $(searchStr).val()
      
      // continue
      if (item.status === 2) {
        let pos = orders.findMapPos(item.catalogCd);
        let synonymId = orders.synonymId(pos);

        let orderSentenceId = orderSentence || 0;
        let txt = ["{ORDER",synonymId, orderOrigination, orderSentenceId, nomenId, signTimeInteractionFlag + "}"].join("|");

        orderTxt += txt;

        doAction = 1;

        // completeOrder(item.orderId); // this is no longer needed

      // discontinue
      } 
      else if (item.status === 1) {
        let pos = orders.findMapPos(item.catalogCd);
        let discOrderId = orders.discOrderId(pos);

        // prevent duplicate discontinue orders if more than one care order is present
        if (orderTxt.search(discOrderId) === -1) {
          let orderSentenceId = 0;

          let txt = ["{ORDER",discOrderId, orderOrigination, orderSentenceId, nomenId, signTimeInteractionFlag + "}"].join("|");
        
          orderTxt += txt;
        }
        doAction = 1;

        // completeOrder(item.orderId); // this is no longer needed
      }

    });

    if (doAction) {
      value.push(orderTxt,customParams);
      console.log(value.join("|"));

      // place orders 
      javascript:MPAGES_EVENT("ORDERS", value.join("|"));

      // closer Discern Alert window
      CCLEVENT('EVENT_EKS_OK');
    } else {
       $("#messageDiv").html("Please address orders above");
    }
    //  expertEvent(txt.join("|"));
  } // end processOrders

  function completeOrder(orderId) {
    // CREATES WIN32-POWERORDERS AND CHECKS TO SEE IF ORDER CAN BE RENEWED OR NEEDS TO BE DC-REORDER
    let PowerOrders = window.external.DiscernObjectFactory("POWERORDERS");
    let moew = PowerOrders.CreateMOEW(personId, encntrId, 0, 2, 127);
    let canComplete = PowerOrders.GetAvailableOrderActions(moew, orderId) & 32768;

    if (canComplete) {
      PowerOrders.InvokeCompleteAction(moew, orderId);
      PowerOrders.SignOrders(moew);
    }
    PowerOrders.DestroyMOEW(moew);
  }

  // DISPLAY ORDER INFO ON MOUSE HOVER
  function displayTooltip(index) {
    let txt = ["Ordered By: <b>", orders.orders(index).orderPhys,"</b><br>",
                "Clinical Display Line: ","<br>",
        orders.orders(index).clinDisplay
      ];
    return txt.join("");
  }