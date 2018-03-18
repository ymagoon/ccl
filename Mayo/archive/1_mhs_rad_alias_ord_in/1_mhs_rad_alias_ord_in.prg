;Akcia-SE 	05/24/2013		cab 40771 add contributor source's to prompt  
drop program 1_mhs_rad_alias_ord_in:dba go
create program 1_mhs_rad_alias_ord_in:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"                    ;* Enter or select the printer or file name to send this report to.
	, "Inbound Contributor Source (Multiple Selection)" = 0
 
with OUTDEV, CONT_SOURCE
 
 
set maxsecs = 300
 
SELECT INTO $outdev
	Activity_Type = uar_get_code_display( o.activity_type_cd )
	, Primary_Order_Name = oc.mnemonic
	, Inbound_Alias = cv.alias
	, Contributor_Source = uar_get_code_display( cv.contributor_source_cd )
 
FROM
	order_catalog   o
	, order_catalog_synonym   oc
	, code_value_alias   cv
	, code_value c
 
plan o where
	o.active_ind = 1
	and o.activity_type_cd in (711.00)		;radiology
 
 
join oc where o.catalog_cd = oc.catalog_cd
	and  oc.active_ind = 1
	and oc.mnemonic_type_cd = 2583
 
 
join cv  where o.catalog_cd = cv.code_value
	and cv.code_set = 200					;orders
	and cv.contributor_source_cd = ($cont_source)
 
join c where c.code_value = cv.code_value
and c.active_ind = 1
 
 
ORDER BY
    Activity_Type
	, Primary_Order_Name
	, Inbound_Alias
	, Contributor_Source
 
WITH nocounter, separator=" ", format, time= value( maxsecs )
 
end
go
