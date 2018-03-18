drop program MAYO_PCA_QUALIFY_PL:dba go
create program MAYO_PCA_QUALIFY_PL:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "PL CodeSet" = ""
	, "Person Id" = ""
	, "Criteria List" = ""
	, "nomenclature Ref" = "" ;if ORIGINATING_NOMENCLATURE_ID for search code [Mayo problem list]; NOMENCLATURE_ID for target code
 
with OUTDEV, codeset, personID,criteriaList,nomenclatureRef
 
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
DECLARE sub_get_codevalue(p1=f8,p2=i4,p3=vc(ref),p4=vc(ref))=null
declare sub_piece(p1=vc,p2=vc,p3=i4,p4=vc) = vc
declare sub_qualify_problemlist_by_searchcode(p1=f8,p2=vc(ref)) = i4
declare sub_qualify_problemlist_by_targetcode(p1=f8,p2=vc(ref)) = i4
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare PROB_ACTIVE_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",12030,"ACTIVE")),protect
call echo(build("criteriaList=",$criteriaList))
declare code_set = i4 with protect, constant(CNVTINT($codeset))
declare person_id = f8 with protect, constant(CNVTREAL($personID))
declare criteria_list = vc with protect, constant($criteriaList)
declare nomenclature_ref = vc with protect, constant($nomenclatureRef)
 
record codeValList(
	1 list[*]
		2 Desc_value =  c60; Pulling from Description
		2 disp_value = c60 ; pulling from Display
		2 meaning_value = c60 ; pulling from cdf_meaning
		2 def_value = c60; definition value
 
)
 
record criterialist(
	1 qual[*]
		2 cdf_meaning = c60
)
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
declare str = vc with noconstant("")
declare notfnd = vc with constant("<not_found>")
declare num = i4 with noconstant(1)
declare criterial_cnt = i4 with noconstant(0)
 
while (str != notfnd)
	set criterial_cnt = criterial_cnt + 1
	if(mod(criterial_cnt,3) = 1)
		set stat = alterlist(criterialist->qual,criterial_cnt+2)
	endif
	set str = sub_piece(criteria_list,',',num,notfnd)
	if(str != notfnd)
		set criterialist->qual[criterial_cnt].cdf_meaning = str
	else
		set criterial_cnt = criterial_cnt - 1
	endif
	;call echo(build("piece",num,"=",str))
	set num = num+1
endwhile
set stat = alterlist(criterialist->qual,criterial_cnt)
;call echorecord(criterialist)
 
CALL sub_get_codevalue(person_id, code_set,criterialist, codeValList)
 
call echorecord(codeValList)
 
declare nProbFound = i4
 
if(nomenclature_ref = "SEARCH_CODE")
	set nProbFound = sub_qualify_problemlist_by_searchcode(person_id,codeValList)
elseif (nomenclature_ref = "TARGET_CODE")
	set nProbFound = sub_qualify_problemlist_by_targetcode(person_id,codeValList)
endif
call echo(build("nProbFound = ",nProbFound))
 
if (nProbFound = 0)
	set retval = 0      ;;If no rows are returned, send FALSE
	set log_message =("NOT FOUND")
else
	set retval = 100 ;;If rows return, send TRUE
	set log_message = concat("FOUND"," ","TESTING")
endif
call echo(build("retval=",cnvtString(retval)))
call echo(build("log_message=",log_message))
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
SUBROUTINE sub_get_codevalue(p_personID, p_codeset, p_criterialist, rec)
	CALL echo(build("sub_get_codevalue:p_personID=",p_personID,",p_codeset=",p_codeset,",p_criterialist=",p_criterialist))
	if(p_personID <= 0)
		return
	endif
	call echorecord(p_criterialist)
 
	declare nstart = i4 with noconstant(1)
	declare idx = i4
	declare nsize = i4
	set nsize = size(p_criterialist->qual,5)
	call echo(build("size of criteria = ",nsize))
	SELECT INTO "NL:"
		CV1.DESCRIPTION
		, CV1.DISPLAY
		, CV1.DISPLAY_KEY
		, CV1.DEFINITION
		, CV1.cdf_meaning
 
	FROM
		CODE_VALUE   CV1
 
	WHERE CV1.CODE_SET = p_codeset
		AND expand(idx, nstart, nstart+(nsize-1), CV1.CDF_MEANING, p_criterialist->qual[idx].cdf_meaning)
	  	AND CV1.ACTIVE_IND = 1
 
	HEAD REPORT
			cnt = 0
		DETAIL
			cnt = cnt + 1
			call echo(build("CV1.DISPLAY_KEY[",cnt,"]=",CV1.DISPLAY_KEY))
			if(mod(cnt,10) = 1)
				stat = alterlist(rec->list,cnt+9)
			endif
 
			rec->list[cnt].Desc_value = CV1.DESCRIPTION
			rec->list[cnt].disp_value = CV1.DISPLAY
			rec->list[cnt].meaning_value = CV1.cdf_meaning
			rec->list[cnt].def_value = CV1.DEFINITION
 
		FOOT REPORT
			stat = alterlist(rec->list,cnt)
 
	WITH NOCOUNTER
 
 
	return
 
END; end sub_get_codevalue
 
 
/**************************************/
SUBROUTINE sub_qualify_problemlist_by_searchcode(p_personID,p_codeValList)
	call echo("calling .... sub_qualify_problemlist_by_searchcode")
	declare nstart = i4 with noconstant(1)
	declare idx = i4
	declare nsize = i4
	set nsize = size(p_codeValList->list,5)
 
	SELECT
	P.ORIGINATING_NOMENCLATURE_ID
	, NO.CONCEPT_CKI
	, NO.SOURCE_IDENTIFIER
	, NO_SOURCE_VOCABULARY_DISP = UAR_GET_CODE_DISPLAY(NO.SOURCE_VOCABULARY_CD)
	, P_LIFE_CYCLE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.LIFE_CYCLE_STATUS_CD)
 
FROM
	PROBLEM   P
	, NOMENCLATURE   NO
 
WHERE P.PERSON_ID = p_personID
		and p.active_ind = 1
		and p.LIFE_CYCLE_STATUS_CD = PROB_ACTIVE_VAR
		and P.ORIGINATING_NOMENCLATURE_ID = NO.NOMENCLATURE_ID
		and expand(idx, nstart, nstart+(nsize-1), NO.SOURCE_IDENTIFIER, p_codeValList->list[idx].def_value)
 
 
WITH NOCOUNTER, SEPARATOR=" ", EXPAND = 1, FORMAT
 
 
	RETURN (curqual)
END
 
/**************************************/
SUBROUTINE sub_qualify_problemlist_by_targetcode(p_personID,p_codeValList)
	call echo("calling .... sub_qualify_problemlist_by_targetcode")
	declare nstart = i4 with noconstant(1)
	declare idx = i4
	declare nsize = i4
	set nsize = size(p_codeValList->list,5)
	SELECT
	P.ORIGINATING_NOMENCLATURE_ID
	, N.CONCEPT_CKI
	, N.SOURCE_IDENTIFIER
	, N_SOURCE_VOCABULARY_DISP = UAR_GET_CODE_DISPLAY(N.SOURCE_VOCABULARY_CD)
	, P.ACTIVE_IND
	, P_ACTIVE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.ACTIVE_STATUS_CD)
	, P.ACTIVE_STATUS_DT_TM "@LONGDATETIME"
	, P.ACTIVE_STATUS_PRSNL_ID
	, P.ACTUAL_RESOLUTION_DT_TM
	, P_LIFE_CYCLE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.LIFE_CYCLE_STATUS_CD)
 
FROM
	PROBLEM   P
	, NOMENCLATURE   N
 
WHERE P.PERSON_ID = p_personID
		and P.ACTIVE_IND = 1
		and P.NOMENCLATURE_ID = N.NOMENCLATURE_ID
		and expand(idx, nstart, nstart+(nsize-1), N.SOURCE_IDENTIFIER, p_codeValList->list[idx].def_value)
 
WITH MAXREC = 100, NOCOUNTER, SEPARATOR=" ", EXPAND = 1, FORMAT
 
 
	RETURN (curqual)
END
 
/*************************************/
SUBROUTINE sub_piece(p_string,p_delim,p_num,p_default)
	if (p_num<=0)
		return("")
	endif
	declare p_cnt = i4 with protect
	declare p_beg = i4 with protect
	declare p_end = i4 with protect,noconstant(0)
	for (p_cnt = 1 to p_num)
		set p_beg = p_end+1
		set p_end = findstring(p_delim,p_string,p_beg)
		if (p_end = 0)
			if (p_cnt < p_num)
				return(p_default)
			endif
			set p_end = size(p_string)+1
		endif
	endfor
	return(substring(p_beg,p_end-p_beg,p_string))
END ;END OF sub_piece
 
 
end go
 
 
/**********************************************/
MAYO_PCA_QUALIFY_PL "NL:",104514,10390821.00,"ICD9CM,MAYO_PROB","SEARCH_CODE" GO
 
