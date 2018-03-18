/****************************************************************************
Program:  1_mhs_rad_ord_view
Created by:  
Created Date:  
 
Description:  
 
Modifications:
001-Akcia SE- 03/12/2014   add red wing
*****************************************************************************/
drop program 1_mhs_rad_ord_view:dba go
create program 1_mhs_rad_ord_view:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility Group" = ""
 
with OUTDEV, facility_grp
 
record facilities
(	1 qual[*]
		2 facility_cd = f8
)
 
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim($Facility_grp,3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
with nocounter
declare num = i2
 
 
set maxsecs = 300
 
SELECT INTO $outdev
	Activity_Type = uar_get_code_display( o.activity_type_cd )
	, Primary_Order_Name = oc.mnemonic
	, Virtual_View = uar_get_code_display( ofr.facility_cd )
 
FROM
	order_catalog   o
	, order_catalog_synonym   oc
	, ocs_facility_r   ofr
	, code_value c
 
plan o where
	o.active_ind = 1
	and o.activity_type_cd in (711.00)		;radiology
 
 
join oc where o.catalog_cd = oc.catalog_cd
	and  oc.active_ind = 1
	and oc.mnemonic_type_cd = 2583
 
join c where c.code_value = o.catalog_cd
and c.active_ind = 1
 
 
 
join ofr
WHERE oc.synonym_id = ofr.synonym_id
	and expand(num, 1, size(facilities->qual,5), ofr.facility_cd, facilities->qual[num].facility_cd )
 
 
ORDER BY
	Activity_Type
	, Primary_Order_Name
	, Virtual_View
 
WITH nocounter, separator=" ", format, time= value( maxsecs )
 
end
go
 
 
 
