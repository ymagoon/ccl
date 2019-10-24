function SocialHistoryComponentStyle(){
    this.initByNamespace("sh");
}
SocialHistoryComponentStyle.inherits(ComponentStyle);

/**
 * The Social History component will retrieve all Social History information associated to the encounter
 *
 * @param {Criterion} criterion
 */
function SocialHistoryComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new SocialHistoryComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.SOCIAL_HISTORY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.SOCIAL_HISTORY.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    
    SocialHistoryComponent.method("InsertData", function(){
        CERN_SOCIAL_HISTORY_O1.GetSocialHistoryTable(this);
    });
    SocialHistoryComponent.method("HandleSuccess", function(recordData){
        CERN_SOCIAL_HISTORY_O1.RenderComponent(this, recordData);
    });
}
SocialHistoryComponent.inherits(MPageComponent);

/**
 * @static
 * @global
 */
var CERN_SOCIAL_HISTORY_O1 = function(){
    return {
        GetSocialHistoryTable: function(component){
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0");
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_SOCIAL_HISTORY", sendAr, true);
        },
        RenderComponent: function(component, recordData){
           
            try {
            	var i = 0;
            	var j = 0;
                var shhtml = "";
                var socialCnt = 0;
                var social = "";
                var socDetlCnt = 0;
                var socDetl = "";
                var comntCnt = 0;
                var comment = "";
                var shArray = [];
                var category = "";
                var riskAssessment = "";
                var updatedPrsn = "";
                var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
                var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
                var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                var updateDT = new Date();
                var eventObj = "";
                socialCnt = recordData.SOCIAL_CNT;
                shArray.push("<div class ='", MP_Util.GetContentClass(component, socialCnt), "'>");
                for (i = 0; i < socialCnt; i++) {
                    social = recordData.SOCIAL[i];
                    category = social.CATEGORY;
                    if (social.RISK_ASSESSMENT_CD > 0) {
                        eventObj = MP_Util.GetValueFromArray(social.RISK_ASSESSMENT_CD, codeArray);
                        riskAssessment = eventObj.display;
                    }
                    else {
                        riskAssessment = "";
                    }
                    
                    var detailTxt = "";
                    var detailTag = "";
                    if (social.SHX_DETAIL_CNT > 0) {
                        for (j = 0, socDetlCnt = social.SHX_DETAIL_CNT; j < socDetlCnt; j++) {
                            socDetl = social.SHX_DETAIL[j];
                            detailTxt += socDetl.DETAIL_TEXT + "<br />";
                        }
                        detailTag = i18n.DETAILS;
                    }
                    var updatedTime = "";
                    if (social.UPDT_DT_TM !== "") {
                        updateDT.setISO8601(social.UPDT_DT_TM);
                        updatedTime=df.format(updateDT,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                    }
                    
                    if (social.UPDT_PRSNL_ID > 0) {
                        var prsnlObj = MP_Util.GetValueFromArray(social.UPDT_PRSNL_ID, personnelArray);
                        updatedPrsn = prsnlObj.fullName;
                    }
                    else {
                        updatedPrsn = "";
                    }
					var comments = social.COMMENTS;
                    var commentTxt = "";
                    if (social.COMMENT_CNT > 0) {
                    	var commentLen = comments.length;
                       	for(var x = 0; x < commentLen; x++){
                    		var cmmtDate = df.formatISO8601(comments[x].COMMENT_DT, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                    		commentTxt += cmmtDate + " - " + comments[x].COMMENT_PRSNL_NAME + " - " + comments[x].COMMENT_TXT + "<br />";
                    	} 
                    }
                    
                    var riskAssessHigh = "";
                    
                    if(eventObj.meaning == "HIGHRISK"){
                    	riskAssessHigh = 'res-severe';
                    }
                    
                    
                    
                    shArray.push("<dl class='sh-info'><dt>", i18n.SOCIAL_HISTORY_INFORMATION, "</dt><dd class = 'sh-risk'><span class='sh-cat'>", category, ":</span><span class='sh-assess detail-line ", riskAssessHigh,"'>", riskAssessment, "</span></dd><dd class='sh-flag'><span>", detailTag, "</span></dd></dl> <h4 class='det-hd'>", i18n.SOCIAL_HISTORY_DETAILS, ":</h4> <div class= 'hvr'><dl class='sh-det'><dt><span>", i18n.CATEGORY, ":</span></dt><dd><span>", category, "</span></dd><dt><span>", i18n.DETAILS, ":</span></dt><dd><span>", detailTxt, "</span></dd><dt><span>", i18n.LAST_UPDATED, ":</span></dt><dd><span>", updatedTime, "</span></dd><dt><span>", i18n.LAST_UPDATED_BY, ":</span></dt><dd><span>", updatedPrsn, "</span></dd><dt><span>", i18n.COMMENTS, ":</span></dt><dd><span>", commentTxt, "</span></dd></dl></div>");
                }
                shArray.push("</div>");
                shhtml = shArray.join("");
                countText = MP_Util.CreateTitleText(component, socialCnt);
                MP_Util.Doc.FinalizeComponent(shhtml, component, countText);
            } 
            catch (err) {
              
                throw (err);
            }
            finally {
                
            }
        }
    };
}();
