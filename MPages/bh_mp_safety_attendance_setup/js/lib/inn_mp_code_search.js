var CodeSearch = function(prefs){
	var results = []
	var modalTitle = ""
	var query = ""
	  prefs.element.typeahead({
	    source: function (typeahead) {
	    	var $element=typeahead.$element
	    	var wildCardInd = false
	    	var searchString = $element.val()
	    	var primInd = prefs.primInd===undefined ? 0 : prefs.primInd
	    	$element.attr("code_value", "")
	    	$element.removeAttr("title")
	    	var json_handler = new UtilJsonXml({
				"debug_mode_ind" : 0,
				"disable_firebug" : true
			})
			query = searchString
			if(searchString.charAt(0)==="*"){
				wildCardInd=true
				searchString = searchString.substring(1)
			}
	    	if(searchString.length>1){
			    var path = "inn_get_event_search_json", params = "^MINE^, "+prefs.codeSet+", ^"+searchString+"^, "+primInd
				json_handler.ajax_request({
					request : {
						type : "XMLCCLREQUEST",
						target : path,
						parameters : params
					},
					response : {
						type : "JSON",
						target : function receiveReply(json_response){
							var response = json_response.response.REPORT_DATA
							if(response.STATUS_DATA.STATUS==="S"){
								var list = []
								if(wildCardInd){
									list = response.STARTS_WITH_LIST.concat(response.CONTAINS_LIST)
									modalTitle = "Contains \"" + searchString + "\"..."
								}
								else{
									list = response.STARTS_WITH_LIST
									modalTitle = "Starts with \"" + searchString + "\"..."
								}
								results=list
								typeahead.process(list)																
							}
							else{
								typeahead.process([])	    		
							}
						},
						parameters : [this]
					}
				});
	    	}
	    	else{
				typeahead.process([])	    		
	    	}
	    },
	    onselect: function (obj, typeahead) {
	    	if(obj.RESULT_CD===-1){
	    		var $modal = $('#myModal')
	    		$modal.modal()
	    		$modal.find(".modal-header-text").text(modalTitle)
	    		var $select = $modal.find('.modal-body-select')
	    		$select.html("")
	    		$select.css("width", $modal.find('.modal-body').css("width"))
	    		$.each(results, function(index, result){
	    			$select.append("<option value='"+result.RESULT_CD+"' title='"+result.RESULT_CD+"''>"+result.RESULT_DISP+"</option>")
	    		})
	    		typeahead.val(query)
	    		$modal.find('.submit-btn').click(function() {
				  	var $selected = $modal.find('.modal-body-select option:selected')
				  	typeahead.val($selected.text())
	    			typeahead.attr("code_value", $selected.val())
	    			typeahead.attr("title", $selected.val())
	    			$modal.find('.submit-btn').unbind("click")
	    			$modal.find('.modal-body-select').unbind("dblclick")
	    			$modal.modal('hide')		  	
				});
	    		$modal.find('.modal-body-select').dblclick(function() {
					$modal.find('.submit-btn').trigger("click")	  	
				});
	    	}
	    	else{
	    		typeahead.attr("code_value", obj.RESULT_CD)
	    		typeahead.attr("title", obj.RESULT_CD)
	    	}
	    },
	    "property": "RESULT_DISP",
	    "items": 11
	  })
}