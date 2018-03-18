/*******************************************************************
 
Report Name:  Clinics Lab No Show Report
Report Path:  /mayo/mhspd/prg/1_lm_eth_no_show.prg
Report Description:  Displays all lab orders that are still in future status
						15 days or older.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:	Lisa Sword
Modified date:	07/2009
Modifications:		Added orders > 1 year into the future.
					Changed phone to an outerjoin
					added express care 8/17/09.
Modified date:	11/2009
Modifications:	Added exclusion of Lab SBAR orders.They will print on a separate report to Lab.
 
Modified date:	05/21/2010
Modifications: 	Added subquery to only pull latest location from order_detail.
				08/02/2010, changed location subquery to look at latest updt_cnt instead of updt_dt_tm.
				03/03/2011, changed location subquery to look at latest updt_cnt AND latest updt_dt_tm
				04/15/2011, changed location qualification and subquery to use field_id.
				02/23/2012, increased time-out from 1800 to 3000 seconds. report was failing.
 
Modified by:	Akcia - SE
Modified date:	04/26/12
Modifications:  changes for efficiency  and add db2 code
Modification Num:  003
 
*******************************************************************/
 
drop program 1_lm_eth_no_show go
create program 1_lm_eth_no_show
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
/*** START 003 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 003 ***/ 
 
DECLARE MRN_VAR = F8
DECLARE PHONE_VAR = F8
SET MRN_VAR = UAR_GET_CODE_BY("MEANING", 4, "MRN")
SET PHONE_VAR = UAR_GET_CODE_BY("MEANING", 43, "HOME")
declare start_date = dq8 with constant(cnvtlookbehind("15 D")) 		;003
declare end_date = dq8 with constant(cnvtlookahead("420 D"))		;003
 
/*
Record set used to print the report to the correct department.
 
To add a department:
1-increase the array to include the new printer
	(i.e. 1 dept_printers_list[42])
2-add the department and printer to the array (note:  department name
	EXACTLY how it appears in the display of codeset 100500)
	(i.e. set dept_printers -> dept_printers_list[42] -> dept = "Osseo - Urgent Care"
		  set dept_printers -> dept_printers_list[42] -> printer_name =  "PH1621")
3-modify the FOR loop to match the length of the array
	(i.e. FOR (x=1 to 42))
*/
 
;003 start
free record data
record data (
1 qual[*]
  2 dept = c24
  2 printer_name = c6
  2 provider[*]
    3 provider = vc
    3 pat_name = vc
    3 dob = c15
    3 mrn = c15
    3 phone_num = c15
    3 collect_priority = vc
    3 fo_date = c15
    3 order_id = f8
    3 order_mnem = vc
    3 diag_ident = vc
    3 diagnosis = vc
    3 icd9 = c30
    3 comments = vc
    3 nomenclature_id = f8
	3 long_text_id = f8
	3 orig_order_dt_tm = dq8
 
)
 
;003 end
free record dept_printers
record dept_printers (
1 dept_printers_list[54]
	2 dept = C24
	2 printer_name = C6 )
set dept_printers -> dept_printers_list[1] -> dept = "Internal Medicine - MCC"
set dept_printers -> dept_printers_list[1] -> printer_name =  "PH1111"
set dept_printers -> dept_printers_list[2] -> dept = "Internal Medicine - MCLC"
set dept_printers -> dept_printers_list[2] -> printer_name =  "PH1199"
set dept_printers -> dept_printers_list[3] -> dept = "Neurology"
set dept_printers -> dept_printers_list[3] -> printer_name =  "PH1200"
set dept_printers -> dept_printers_list[4] -> dept = "Peds/Adoles Med"
set dept_printers -> dept_printers_list[4] -> printer_name =  "PH1201"
set dept_printers -> dept_printers_list[5] -> dept = "Gastroenterology"
set dept_printers -> dept_printers_list[5] -> printer_name =  "PH1097"
set dept_printers -> dept_printers_list[6] -> dept = "Pulmonology"
set dept_printers -> dept_printers_list[6] -> printer_name =  "PH1097"
set dept_printers -> dept_printers_list[7] -> dept = "Nephrology"
set dept_printers -> dept_printers_list[7] -> printer_name =  "PH1097"
set dept_printers -> dept_printers_list[8] -> dept = "Cardiology"
set dept_printers -> dept_printers_list[8] -> printer_name =  "PH1085"
set dept_printers -> dept_printers_list[9] -> dept = "Urology"
set dept_printers -> dept_printers_list[9] -> printer_name =  "PH1415"
set dept_printers -> dept_printers_list[10] -> dept = "Surgery"
set dept_printers -> dept_printers_list[10] -> printer_name =  "PH1416"
set dept_printers -> dept_printers_list[11] -> dept = "Barron"
set dept_printers -> dept_printers_list[11] -> printer_name =  "PH1556"
set dept_printers -> dept_printers_list[12] -> dept = "Barron - Triage"
set dept_printers -> dept_printers_list[12] -> printer_name =  "PH1475"
set dept_printers -> dept_printers_list[13] -> dept = "BA-Urgent Care"
set dept_printers -> dept_printers_list[13] -> printer_name =  "PH1479"
set dept_printers -> dept_printers_list[14] -> dept = "Prairie Farm"
set dept_printers -> dept_printers_list[14] -> printer_name =  "PH1164"
set dept_printers -> dept_printers_list[15] -> dept = "Heart Failure Clinic"
set dept_printers -> dept_printers_list[15] -> printer_name =  "PH1085"
set dept_printers -> dept_printers_list[16] -> dept = "Chetek"
set dept_printers -> dept_printers_list[16] -> printer_name =  "PH1558"
set dept_printers -> dept_printers_list[17] -> dept = "Dermatology"
set dept_printers -> dept_printers_list[17] -> printer_name =  "PH1852"
set dept_printers -> dept_printers_list[18] -> dept = "Behavioral Hlth"
set dept_printers -> dept_printers_list[18] -> printer_name =  "PH1284"
set dept_printers -> dept_printers_list[19] -> dept = "Endocrinology"
set dept_printers -> dept_printers_list[19] -> printer_name =  "PH1189"
set dept_printers -> dept_printers_list[20] -> dept = "DiabEd/NutrServ"
set dept_printers -> dept_printers_list[20] -> printer_name =  "PH1189"
set dept_printers -> dept_printers_list[21] -> dept = "Chippewa"
set dept_printers -> dept_printers_list[21] -> printer_name =  "PH1165"
set dept_printers -> dept_printers_list[22] -> dept = "Orthopedics"
set dept_printers -> dept_printers_list[22] -> printer_name =  "PH1418"
set dept_printers -> dept_printers_list[23] -> dept = "Urgent Care"
set dept_printers -> dept_printers_list[23] -> printer_name =  "PH1301"				;"PH1190" changed 10/19/09
set dept_printers -> dept_printers_list[24] -> dept = "Oncology"
set dept_printers -> dept_printers_list[24] -> printer_name =  "PH1119"
set dept_printers -> dept_printers_list[25] -> dept = "Rheumatology"
set dept_printers -> dept_printers_list[25] -> printer_name =  "PH1111"
set dept_printers -> dept_printers_list[26] -> dept = "Occupational Medicine"
set dept_printers -> dept_printers_list[26] -> printer_name =  "PH1447"
set dept_printers -> dept_printers_list[27] -> dept = "Allergy"
set dept_printers -> dept_printers_list[27] -> printer_name =  "PH1187"
set dept_printers -> dept_printers_list[28] -> dept = "Colfax"
set dept_printers -> dept_printers_list[28] -> printer_name =  "PH1674"
set dept_printers -> dept_printers_list[29] -> dept = "Otolaryngology"
set dept_printers -> dept_printers_list[29] -> printer_name =  "PH1190"
set dept_printers -> dept_printers_list[30] -> dept = "Osseo"
set dept_printers -> dept_printers_list[30] -> printer_name =  "PH1307"
set dept_printers -> dept_printers_list[31] -> dept = "Mondovi"
set dept_printers -> dept_printers_list[31] -> printer_name =  "PH1505"
set dept_printers -> dept_printers_list[32] -> dept = "Bloomer"
set dept_printers -> dept_printers_list[32] -> printer_name =  "PH1459"
set dept_printers -> dept_printers_list[33] -> dept = "Weight Mgmt Ctr"
set dept_printers -> dept_printers_list[33] -> printer_name =  "PH1846"
set dept_printers -> dept_printers_list[34] -> dept = "Ophthalm/Opto"
set dept_printers -> dept_printers_list[34] -> printer_name =  "PH1690"
set dept_printers -> dept_printers_list[35] -> dept = "Rice Lake"
set dept_printers -> dept_printers_list[35] -> printer_name =  "PH1872"
set dept_printers -> dept_printers_list[36] -> dept = "Spine and Neurological Surgery"
set dept_printers -> dept_printers_list[36] -> printer_name =  "PH1905"
set dept_printers -> dept_printers_list[37] -> dept = "Infectious Disease"
set dept_printers -> dept_printers_list[37] -> printer_name =  "PH1199"
set dept_printers -> dept_printers_list[38] -> dept = "Anticoagulation"
set dept_printers -> dept_printers_list[38] -> printer_name =  "PH2024"
set dept_printers -> dept_printers_list[39] -> dept = "Osseo - Urgent Care"
set dept_printers -> dept_printers_list[39] -> printer_name =  "PH1621"
set dept_printers -> dept_printers_list[40] -> dept = "Barron - Urgent Care"
set dept_printers -> dept_printers_list[40] -> printer_name =  "PH1556"
set dept_printers -> dept_printers_list[41] -> dept = "Bloomer - Urgent Care"
set dept_printers -> dept_printers_list[41] -> printer_name =  "PH1459"
set dept_printers -> dept_printers_list[42] -> dept = "Cardio/ThorSurg"
set dept_printers -> dept_printers_list[42] -> printer_name =  "PH1085"
set dept_printers -> dept_printers_list[43] -> dept = "Plastic Surgery"
set dept_printers -> dept_printers_list[43] -> printer_name =  "PH1136"
set dept_printers -> dept_printers_list[44] -> dept = "Podiatry"
set dept_printers -> dept_printers_list[44] -> printer_name =  "PH1418"
set dept_printers -> dept_printers_list[45] -> dept = "Rice Lake - Triage"
set dept_printers -> dept_printers_list[45] -> printer_name =  "PH1872"
set dept_printers -> dept_printers_list[46] -> dept = "Radiology"
set dept_printers -> dept_printers_list[46] -> printer_name =  "PH1119"
set dept_printers -> dept_printers_list[47] -> dept = "Radiation Oncology"
set dept_printers -> dept_printers_list[47] -> printer_name =  "PH1119"
set dept_printers -> dept_printers_list[48] -> dept = "Occ/Hand Therapy"
set dept_printers -> dept_printers_list[48] -> printer_name =  "PH1418"
set dept_printers -> dept_printers_list[49] -> dept = "Neurosurgery"
set dept_printers -> dept_printers_list[49] -> printer_name =  "PH1905"
set dept_printers -> dept_printers_list[50] -> dept = "Express Care South"
set dept_printers -> dept_printers_list[50] -> printer_name =  "PH1301"
set dept_printers -> dept_printers_list[51] -> dept = "Express Care West"
set dept_printers -> dept_printers_list[51] -> printer_name =  "PH1301"
set dept_printers -> dept_printers_list[52] -> dept = "Interventional Radiology" ;added 10/07/2010
set dept_printers -> dept_printers_list[52] -> printer_name =  "PH1134"
set dept_printers -> dept_printers_list[53] -> dept = "Corporate Health Services" ;added 12/02/2010
set dept_printers -> dept_printers_list[53] -> printer_name =  "PH1447"
set dept_printers -> dept_printers_list[54] -> dept = "Physical Medicine & Rehabilitation" ;added 02/03/2011
set dept_printers -> dept_printers_list[54] -> printer_name =  "PH1905"
 
;Some Depts have been moved to thier own reports:
		; 1_lm_labnoshow_fm, 1_lm_cb_labnoshow_wh,
		; 1_LM_labnoshow_cameron.prg,or 1_LM_labnoshow_other,
 
declare prt_idx = i2
SET MaxSecs = 3000
 
;003 FOR (x=1 to 54)
;003 SELECT DISTINCT INTO dept_printers -> dept_printers_list[x] -> printer_name
SELECT INTO "nl:"
;	P.NAME_FULL_FORMATTED
;	, P1.NAME_FULL_FORMATTED
;	, O_CATALOG_CDF = UAR_GET_CODE_MEANING( O.CATALOG_CD )
;	, O.CATALOG_CD
	O_CATALOG_DISP = UAR_GET_CODE_DISPLAY( O.CATALOG_CD )
;	, O.ORDER_ID
;	, O.ORIG_ORDER_DT_TM
;	, P.BIRTH_DT_TM
;	, O.CURRENT_START_DT_TM "@SHORTDATE4YR"
;	, PA_PERSON_ALIAS_TYPE_CDF = UAR_GET_CODE_MEANING( PA.PERSON_ALIAS_TYPE_CD )
;	, PA.PERSON_ALIAS_TYPE_CD
;	, PA_PERSON_ALIAS_TYPE_DISP = UAR_GET_CODE_DISPLAY( PA.PERSON_ALIAS_TYPE_CD )
;	, PA.PERSON_ALIAS_ID
;	, NE.NOMENCLATURE_ID
;	, N.SOURCE_STRING
;	, OD.OE_FIELD_DISPLAY_VALUE
;	, OD1.OE_FIELD_DISPLAY_VALUE
;	, od2.oe_field_display_value
;	, PH.PHONE_NUM
;	, PH.PARENT_ENTITY_ID
;	, L.LONG_TEXT
 
FROM
	ORDERS   O
	, PERSON   P
	, PERSON   P1
	, PERSON_ALIAS   PA
	;003	, DUMMYT   D1
	, NOMEN_ENTITY_RELTN   NE
	, NOMENCLATURE   N
	, ORDER_DETAIL   OD
	, ORDER_DETAIL   OD1
	, LONG_TEXT   L
	, ORDER_COMMENT   OC
	;003  , DUMMYT   D
	, PHONE   PH
	;003   , DUMMYT   D3
	, ORDER_DETAIL   OD2
 
PLAN O
WHERE  O.ORDER_STATUS_CD = 2546   ; 2546 = Future
  AND O.dept_status_cd !=    9312.00
  ;AND (O.CURRENT_START_DT_TM < cnvtlookbehind("15 D") or O.CURRENT_START_DT_TM > cnvtlookahead("420 D"))
  ;and O.CURRENT_START_DT_TM between cnvtdatetime(start_date) and cnvtdatetime(end_date)			;003
  and o.orig_order_dt_tm between cnvtdatetime(cnvtdate(04082012),0) and cnvtdatetime(cnvtdate(04122012),235959)
    	; orders 15 days or older, or in the future more than 420 days
  AND O.CATALOG_CD NOT IN (93232878,93232886,93232892,93232897,93232904,93232909,
  						   93232915,93232920,93232925,93232930,93232936,93232941)  ;Lab SBAR Orders
 
JOIN P
WHERE  P.PERSON_ID = O.PERSON_ID
;and P.NAME_LAST_KEY !="TESTPATIENT"
;and p.person_id != 7280632  ;test,patient
 
JOIN OD
WHERE O.ORDER_ID = OD.ORDER_ID
  ; collection priority
  AND OD.OE_FIELD_MEANING="COLLPRI"
 
JOIN OD1
; location field from OEF
WHERE O.ORDER_ID = OD1.ORDER_ID
  AND OD1.OE_FIELD_ID = 7441493		; changed from field meaning, to field_id. 4/15/2011
  AND OD1.UPDT_DT_TM				; changed max to look at field_id. 4/15/2011
     IN (SELECT MAX(UPDT_DT_TM) FROM ORDER_DETAIL ODMAX2
          WHERE OD1.ORDER_ID = ODMAX2.ORDER_ID and ODMAX2.OE_FIELD_ID = 7441493)
 
 
  ; for printing
  ;003AND OD1.OE_FIELD_DISPLAY_VALUE = dept_printers -> dept_printers_list[x] -> dept
  and expand(prt_idx,1,size(dept_printers->dept_printers_list,5),od1.oe_field_display_value,			;003
  				dept_printers->dept_printers_list[prt_idx]->dept)										;003
 
JOIN PA
WHERE P.PERSON_ID = PA.PERSON_ID
  ; MRN
  AND PA.PERSON_ALIAS_TYPE_CD = MRN_VAR
  and pa.end_effective_dt_tm > sysdate			;003
  AND PA.ACTIVE_IND = 1
 
JOIN P1
WHERE O.LAST_UPDATE_PROVIDER_ID = P1.PERSON_ID
 
JOIN PH
WHERE PH.PARENT_ENTITY_ID = OUTERJOIN(P.PERSON_ID)
  and ph.parent_entity_name = OUTERJOIN("PERSON")						;003
  AND PH.PHONE_TYPE_CD = OUTERJOIN(PHONE_VAR)		; home phone number only		;003
  AND PH.ACTIVE_IND = OUTERJOIN(1)													;003
;003  AND PH.PHONE_TYPE_CD = PHONE_VAR		; home phone number only
;003  AND PH.ACTIVE_IND = 1
 
JOIN OC
WHERE OC.ORDER_ID = OUTERJOIN(O.ORDER_ID)
JOIN L
WHERE L.LONG_TEXT_ID = OUTERJOIN(OC.LONG_TEXT_ID)
 
;003  JOIN D
;003  WHERE OC.LONG_TEXT_ID = L.LONG_TEXT_ID
 
;003  JOIN D3
JOIN OD2
WHERE OD2.order_id = OUTERJOIN(O.order_id)
AND OD2.oe_field_meaning = OUTERJOIN("ICD9")
 
;003  JOIN D1
JOIN NE
; diagnosis
WHERE NE.PARENT_ENTITY_NAME = OUTERJOIN("ORDERS")
  AND NE.PARENT_ENTITY_ID = OUTERJOIN(O.ORDER_ID)
;003  WHERE NE.PARENT_ENTITY_NAME = "ORDERS"
;003    AND NE.PARENT_ENTITY_ID = O.ORDER_ID
 
JOIN N
; name of diagnosis
WHERE N.NOMENCLATURE_ID = OUTERJOIN(NE.NOMENCLATURE_ID)
;003  WHERE N.NOMENCLATURE_ID = NE.NOMENCLATURE_ID
 
ORDER BY
	OD1.OE_FIELD_DISPLAY_VALUE
	, P1.NAME_FULL_FORMATTED
	, P.NAME_FULL_FORMATTED
	, O.ORDER_ID
	, N.NOMENCLATURE_ID
	, L.LONG_TEXT_ID
	, O.ORIG_ORDER_DT_TM
 
;003 start
head report
cnt = 0
pcnt= 0
pos = 0
num = 0
 
head od1.oe_field_display_value
cnt = cnt + 1
stat = alterlist(data->qual,cnt)
pcnt = 0
pos = locateval(num,1,size(dept_printers->dept_printers_list,5),od1.oe_field_display_value,
		dept_printers->dept_printers_list[num]->dept)
data->qual[cnt].dept = dept_printers->dept_printers_list[pos]->dept
data->qual[cnt].printer_name = dept_printers->dept_printers_list[pos]->printer_name
 
head o.order_id
pcnt = pcnt + 1
stat = alterlist(data->qual[cnt]->provider,pcnt)
data->qual[cnt].provider[pcnt].provider = p1.name_full_formatted
data->qual[cnt].provider[pcnt].pat_name = p.name_full_formatted
data->qual[cnt].provider[pcnt].dob = format(p.birth_dt_tm,"mm/dd/yy;;d")
data->qual[cnt].provider[pcnt].mrn = pa.alias
data->qual[cnt].provider[pcnt].phone_num = ph.phone_num
data->qual[cnt].provider[pcnt].collect_priority = OD.OE_FIELD_DISPLAY_VALUE
data->qual[cnt].provider[pcnt].fo_date = format(o.current_start_dt_tm,"mm/dd/yy;;d")
data->qual[cnt].provider[pcnt].order_id = o.order_id
data->qual[cnt].provider[pcnt].order_mnem = O_CATALOG_DISP
data->qual[cnt].provider[pcnt].diag_ident = n.source_identifier
data->qual[cnt].provider[pcnt].diagnosis = n.source_string
data->qual[cnt].provider[pcnt].icd9 = od2.oe_field_display_value
data->qual[cnt].provider[pcnt].comments = l.long_text
data->qual[cnt].provider[pcnt].nomenclature_id = n.nomenclature_id
data->qual[cnt].provider[pcnt].long_text_id = l.long_text_id
data->qual[cnt].provider[pcnt].orig_order_dt_tm  = o.orig_order_dt_tm
 
with nocounter
 
 
for (y = 1 to size(data->qual,5))
 
select into value(data->qual[y]->printer_name)
provider = substring(1,60,data->qual[y]->provider[d.seq].provider),
pat_name = substring(1,60,data->qual[y]->provider[d.seq].pat_name),
ord_id = data->qual[y]->provider[d.seq].order_id,
nom_id = data->qual[y]->provider[d.seq].nomenclature_id,
long_id = data->qual[y]->provider[d.seq].long_text_id,
order_dt_tm = data->qual[y]->provider[d.seq].orig_order_dt_tm
from
(dummyt d with seq = size(data->qual[y]->provider,5))
 
plan d
 
order by
provider,
pat_name,
ord_id,
nom_id,
long_id,
order_dt_tm
;003 end
 
Head Report
	m_NumLines = 0
%I cclsource:vccl_diortf.inc
	y_pos = 18
SUBROUTINE OFFSET( yVal )
	CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
	count = 0
 
Head Page
	if (curpage > 1)  y_pos = 18 endif
	"{F/0}{CPI/14}"
	count = count + 1
	ROW + 1, "{F/9}{CPI/7}"
	CALL PRINT(CALCPOS(159,y_pos+11)) "{U}No-Show Report (15+ days old){ENDU}"
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(504,y_pos+11)) "Page #:"
	ROW + 1, CALL PRINT(CALCPOS(522,y_pos+11)) count
	ROW + 1
	ROW + 1, CALL PRINT(CALCPOS(252,y_pos+29)) curdate
	ROW + 1
	y_pos = y_pos + 41
 
;003  Head OD1.OE_FIELD_DISPLAY_VALUE
	y_pos = y_pos + 24
 
 
Head provider				;003
;003 Head P1.NAME_FULL_FORMATTED
	;003   OE_FIELD_DISPLAY_VALUE1 = SUBSTRING( 1, 60, OD1.OE_FIELD_DISPLAY_VALUE ),
	OE_FIELD_DISPLAY_VALUE1 = SUBSTRING(1,60,data->qual[y].dept),
	;003   NAME_FULL_FORMATTED1 = SUBSTRING( 1, 60, P1.NAME_FULL_FORMATTED ),
	NAME_FULL_FORMATTED1 = SUBSTRING( 1, 60, provider ),
	ROW + 1, "{F/5}{CPI/9}"
	CALL PRINT(CALCPOS(20,y_pos+0)) OE_FIELD_DISPLAY_VALUE1
	ROW + 1, "{CPI/11}"
	CALL PRINT(CALCPOS(36,y_pos+13))  "{U}" NAME_FULL_FORMATTED1, ROW + 1
	ROW + 1
	y_pos = y_pos + 42
 
;003  Head P.NAME_FULL_FORMATTED
Head pat_name						;003
	if (( y_pos + 116) >= 792 ) y_pos = 0,  break endif
	ROW + 1, "{F/1}{CPI/14}"
	CALL PRINT(CALCPOS(36,y_pos+11)) "Name"
	CALL PRINT(CALCPOS(216,y_pos+11)) "Birth Date"
	CALL PRINT(CALCPOS(306,y_pos+11)) "Clinic MRN"
	CALL PRINT(CALCPOS(396,y_pos+11)) "Phone Number"
	ROW + 1
	NAME_FULL_FORMATTED2 = SUBSTRING( 1, 30, data->qual[y].provider[d.seq].pat_name ),   	;003
	ALIAS1 = SUBSTRING( 1, 10, data->qual[y].provider[d.seq].mrn ),   						;003
	PHONE_NUM1 = SUBSTRING( 1, 15, data->qual[y].provider[d.seq].phone_num ),   			;003
;003	NAME_FULL_FORMATTED2 = SUBSTRING( 1, 30, P.NAME_FULL_FORMATTED ),
;003	ALIAS1 = SUBSTRING( 1, 10, PA.ALIAS ),
;003	PHONE_NUM1 = SUBSTRING( 1, 15, PH.PHONE_NUM ),	ROW + 1, "{F/0}"
	CALL PRINT(CALCPOS(36,y_pos+29)) NAME_FULL_FORMATTED2
	;003  CALL PRINT(CALCPOS(216,y_pos+29)) P.BIRTH_DT_TM
	CALL PRINT(CALCPOS(216,y_pos+29)) data->qual[y].provider[d.seq].dob   	;003
	CALL PRINT(CALCPOS(306,y_pos+29)) ALIAS1
	CALL PRINT(CALCPOS(396,y_pos+29)) PHONE_NUM1
	ROW + 1
	ROW + 1, "{F/1}"
	CALL PRINT(CALCPOS(54,y_pos+47)) "F.O. Date"
	CALL PRINT(CALCPOS(120,y_pos+47)) "Order ID"
	CALL PRINT(CALCPOS(198,y_pos+47)) "Order Mnemonic"
	CALL PRINT(CALCPOS(414,y_pos+47)) "Provider"
	ROW + 1
	y_pos = y_pos + 59
 
 
;003  Head O.ORDER_ID
Head ord_id		;003
	if (( y_pos + 103) >= 792 ) y_pos = 0,  break endif
	OE_FIELD_DISPLAY_VALUE2 = SUBSTRING( 1, 5, data->qual[y].provider[d.seq].collect_priority  ),
	NAME_FULL_FORMATTED3 = SUBSTRING( 1, 30, provider ),
;003	OE_FIELD_DISPLAY_VALUE2 = SUBSTRING( 1, 5, OD.OE_FIELD_DISPLAY_VALUE ),
;003	NAME_FULL_FORMATTED3 = SUBSTRING( 1, 30, P1.NAME_FULL_FORMATTED ),
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(20,y_pos+1)) OE_FIELD_DISPLAY_VALUE2
	CALL PRINT(CALCPOS(54,y_pos+1)) data->qual[y].provider[d.seq].fo_date   			;003
	CALL PRINT(CALCPOS(108,y_pos+1)) data->qual[y].provider[d.seq].order_id   			;003
	CALL PRINT(CALCPOS(198,y_pos+1)) data->qual[y].provider[d.seq].order_mnem   			;003
;003	CALL PRINT(CALCPOS(54,y_pos+1)) O.CURRENT_START_DT_TM
;003	CALL PRINT(CALCPOS(108,y_pos+1)) O.ORDER_ID
;003	CALL PRINT(CALCPOS(198,y_pos+1)) O_CATALOG_DISP
	CALL PRINT(CALCPOS(414,y_pos+1)) NAME_FULL_FORMATTED3
	ROW + 1
	CALL PRINT(CALCPOS(72,y_pos+19)) "Diagnosis:"
	ROW + 1
	y_pos = y_pos + (m_NumLines * 12)
	y_pos = y_pos + 31
 
 
Head nom_id    				;003
;003  Head N.NOMENCLATURE_ID
;003	SOURCE_IDENTIFIER1 = SUBSTRING( 1, 15, N.SOURCE_IDENTIFIER ),
	SOURCE_IDENTIFIER1 = SUBSTRING( 1, 15, data->qual[y].provider[d.seq].diag_ident ),			;003
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(78,y_pos+0)) SOURCE_IDENTIFIER1
	CALL cclrtf_print( 0, 115, 0, 80, data->qual[y].provider[d.seq].diagnosis , 150, 1 )			;003
    CALL cclrtf_print( 0, 115, 0, 90, data->qual[y].provider[d.seq].icd9, 160, 1 )				;003
;003	CALL cclrtf_print( 0, 115, 0, 80, N.SOURCE_STRING, 150, 1 )
;003    CALL cclrtf_print( 0, 115, 0, 90, od2.oe_field_display_value, 160, 1 )
	y_pos = y_pos + (m_NumLines * 12)
 
	ROW + 1
	y_pos = y_pos + 5
 
Head long_id 				;003
;003    Head L.LONG_TEXT_ID
;003	ORDERCOMMENT = Trim(L.LONG_TEXT)
	ORDERCOMMENT = Trim(data->qual[y].provider[d.seq].comments )
	ROW + 1, "{F/0}{CPI/14}"
	CALL PRINT(CALCPOS(72,y_pos)) "Comments:"
	y_pos = y_pos + 8
	CALL cclrtf_print( 0, 78, 0, 80, ORDERCOMMENT, 150, 1 )
 
	y_pos = y_pos + (m_NumLines * 12)
 
	ROW + 1
	y_pos = y_pos + 20
 
foot long_id 				;003
;003    Foot L.LONG_TEXT_ID
	y_pos = y_pos + 0
 
Foot nom_id
;003    Foot N.NOMENCLATURE_ID
	y_pos = y_pos + 0
 
Foot ord_id
;003    Foot O.ORDER_ID
	y_pos = y_pos + 0
 
Foot pat_name
;003    Foot P.NAME_FULL_FORMATTED
 
	ROW + 1	y_val= 792-y_pos-21
	^{PS/newpath 1 setlinewidth   20 ^, y_val, ^ moveto  590 ^, y_val, ^ lineto stroke 20 ^, y_val, ^ moveto/}^
	y_pos = y_pos + 12
 
foot provider			;003
;003    Foot P1.NAME_FULL_FORMATTED
	BREAK
 
;003    Foot OD1.OE_FIELD_DISPLAY_VALUE
;003    	y_pos = y_pos + 0
 
WITH MAXCOL = 300, MAXROW = 500, DIO= 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
;003  , OUTERJOIN = D, OUTERJOIN = D1, OUTERJOIN = D3, DONTCARE=PH
ENDFOR
 
 /*** START 003 ***/
;*** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
/*** END 003 ***/
 
END
GO
