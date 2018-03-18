/*******************************************************************
Report Name:  EU Lab Order Catalog -Alias,etc
Report Path:  /mayo/mhspd/prg/1_LM_LAB_ALIAS_INOUT
Report Description: Displays lab order catalog with alternate names,
					OEF information and aliases
Created by:  Lisa Sword
Created date: ?/2006
 
Modified by: 	Lisa Sword
Modified date: 	11/2008
Modifications:	Pull only orders with virtual view to EU facilities.
				General reformatting.
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
drop program 1_LM_LAB_ALIAS_INOUT_2 go
create program 1_LM_LAB_ALIAS_INOUT_2
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	with OUTDEV
 
SELECT
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
SET MaxSecs = 500
 
SELECT DISTINCT INTO $outdev
	O.ACTIVE_IND														;order active?
	, O_ACTIVITY_TYPE_DISP = UAR_GET_CODE_DISPLAY(O.ACTIVITY_TYPE_CD)	;order activity type
	, OC.MNEMONIC														;order name
	, OC.ACTIVE_IND														;alt name active?
	, OC.HIDE_FLAG														;alt name hidden?
	, OC_MNEMONIC_TYPE_DISP = UAR_GET_CODE_DISPLAY(OC.MNEMONIC_TYPE_CD)	;alt name type
	, O_CATALOG_DISP = UAR_GET_CODE_DISPLAY(O.CATALOG_CD)				;alt name
	, C_CONTRIBUTOR_SOURCE_DISP = UAR_GET_CODE_DISPLAY(C.CONTRIBUTOR_SOURCE_CD)
	, C.ALIAS															;inbound order alias
	, CV_CONTRIBUTOR_SOURCE_DISP = UAR_GET_CODE_DISPLAY(CV.CONTRIBUTOR_SOURCE_CD)
	, CV.ALIAS															;outbound order alias
	, OE.OE_FORMAT_NAME													;order OEF
	, OFR_FACILITY_DISP = UAR_GET_CODE_DISPLAY(OFR.FACILITY_CD)			;order virtual viewed to facility
	, CV1.CODE_VALUE
 
FROM
	ORDER_CATALOG   O
	, ORDER_CATALOG_SYNONYM   OC
	, CODE_VALUE   CV1
	, CODE_VALUE_ALIAS   C
	, ORDER_ENTRY_FORMAT   OE
	, OCS_FACILITY_R   OFR
	, CODE_VALUE_OUTBOUND   CV
 
PLAN O		WHERE O.CATALOG_TYPE_CD = 2513  			;pull Catalog Type of Lab
JOIN OC 	WHERE O.CATALOG_CD = OC.CATALOG_CD
JOIN C		WHERE O.CATALOG_CD = C.CODE_VALUE
			AND C.CONTRIBUTOR_SOURCE_CD = 3374510		;pull aliases built under LH contrib source
JOIN CV1 	WHERE C.CODE_VALUE = CV1.CODE_VALUE
JOIN OE 	WHERE OE.OE_FORMAT_ID = O.OE_FORMAT_ID
			AND OE.ACTION_TYPE_CD = 2534				;pull orders
JOIN OFR	WHERE OC.SYNONYM_ID = OFR.SYNONYM_ID
			AND OFR.FACILITY_CD IN 						;pull virtual view information for the following facilities:
			 (633867									;LH
			,3186521									;LHBH
			,3196530									;BL CLINIC
			,3196529									;BL HOSP
			,3196528									;BA Clinic
			,3196527									;BA Hosp
			,3196532									;OS Clinic
			,3196531									;OS Hosp
			,3180507									;MC
			,3186522 									;MCBH
			,3196533									;NWHC
			,3196534) 									;Pain Clinic
JOIN CV		WHERE O.CATALOG_CD = OUTERJOIN (CV.CODE_VALUE)
			AND CV.CONTRIBUTOR_SOURCE_CD = 3458509		;pull aliases built under ORDERSMNE contrib source
 
ORDER BY
	O.ACTIVE_IND   DESC
	, C.ALIAS
	, OC.MNEMONIC
 
WITH NOCOUNTER, SEPARATOR=" ", TIME= VALUE( MaxSecs ), FORMAT
 
 
end
go
