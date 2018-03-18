/*******************************************************************
 
Report Name:  Location Codes and Aliases
Report Path:  mhs_prg/1_location_codesalias
Report Description: displays location code values and outbound aliases
              for the contributor source selected
Created by:   Lisa Sword
Created date: 12/2013
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
drop program 1_location_codesalias go
create program 1_location_codesalias
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Site" = ""
	, "Contributor Source" = 0.000000
with OUTDEV, SITE, contrib_source
 
SELECT INTO $1
	UNIT_LEVEL = cv.cdf_meaning
	, DESCRIPTION = cv.description
	, display = cv.display
	, LOCATION_CODE = cv.code_value
	, Outbound_Alias = cvo.alias
	, location_added = cv.BEGIN_EFFECTIVE_DT_TM
	, location_updated = cv.UPDT_DT_TM
	, location_active = cv.active_ind
 
FROM
	code_value   cv
	, code_value_outbound   cvo
	, dummyt   d1
 
plan cv
where cv.code_set= 220
    and cv.cdf_meaning in ("AMBULATORY", "FACILITY", "NURSEUNIT", "LAB", "RAD")
    and cv.display = value(concat(trim($site,1),"*"))
 
join d1
join cvo where outerjoin (cv.code_value) = cvo.code_value
    and cvo.contributor_source_cd = $contrib_source
 
ORDER BY
	cv.cdf_meaning
	, cv.description
 
WITH nocounter,  Separator = " ", FORMAT , dontcare = cvo, outerjoin = d1
 
end
go
 
 
;program prior to 12/2013
;drop program location_codes_all_sites go
;create program location_codes_all_sites
 
;prompt
	;"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	;, "Site" = ""
;with OUTDEV, site
 
;select into $1
;LOCATION_CODE = cv.code_value,
;UNIT_LEVEL = cv.cdf_meaning,
;DESCRIPTION = cv.description
;from code_value cv
;where cv.code_set= 220
;and cv.cdf_meaning in ("AMBULATORY", "FACILITY", "NURSEUNIT", "LAB", "RAD")
;and cv.display = value(concat(trim($site,1),"*"))
;order by cv.updt_dt_tm desc
;with nocounter,  Separator = " ", FORMAT
 
;end
;go
 
