/**
 * Retrieves Patient Images via mmf image service.  Singleton is instantiated
 * immediately
 * and handles web service authorization automatically.
 * @author Aaron Nordyke - AN015953
 
 * File "translation.safety.json"
					Namespaces used: 
						"PatientImageRetreivalhandlebar"
 
 */
var PatientImageRetriever = (function() {
	var json_img_handler = {};
	
	function initializeHandler() {
		if(_.isEmpty(json_img_handler)) {
			json_img_handler = new UtilJsonXml({
				"debug_mode_ind" : 0,
				"disable_firebug" : true
			});
		}
	}

	function setPatientImageThumbnailValue(patientModel, imageSize) {
		var params = "MINE," + patientModel.get("person_id") + "," + imageSize + ",1";
		
		initializeHandler();
		
		json_img_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : "dc_mp_get_person_thumbnail",
				parameters : params
			},
			response : {
				type : "JSON",
				target : receiveThumbnailReply,
				parameters : [patientModel]
			}
		});
	}

	function setJsonHandler(handler) {
		json_img_handler = handler;
	}
	

	function receiveThumbnailReply(json_response) {
		var PREPLY = json_response.response.PREPLY,
				patientModel= json_response.parameters[0];
		if(isSuccessful(PREPLY)) {						
			patientModel.set({
				"image_data" : "data:image/jpeg;base64,"+PREPLY.IMAGEDATA
			});
		}
		else{
			var localurl = "";
			var imageSize = Criterion.image_size ? Criterion.image_size : 3;
			switch(imageSize){
				case 1:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_16");
					break;
				case 2:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_32");
					break;
				case 3:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_64");
					break;
				case 4:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_128");
					break;
				case 5:
					localurl = $.i18n.t("PatientImageRetreivalhandlebar.DEFAULT_PHOTO_200");
					break;
			}
			patientModel.set({
				"image_data" : localurl
			});
		}
	}

	/**
	 * checks if json reply is successful, using status_block.inc
	 */
	function isSuccessful(json) {
		return json.STATUS_DATA.STATUS.toUpperCase() === "S" ? true : false;
	}

	
	return {
		/**
		 * Set Patient Image Thumbnail 64-bit value from CCL
		 */
		setPatientImageThumbnailValue : setPatientImageThumbnailValue,
		
		/**
		 * Manually set Json_Handler to be used for CCL calls
		 */
		setJsonHandler : setJsonHandler
	};

})();
