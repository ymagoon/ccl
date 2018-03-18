/*******************************************************************
 
Report Name:  Clinics Downtime Lab
Report Description:  This report is used for lab downtimes and
						displays patients that have open lab orders
						for the previous and future 14 days.
						The file is FTP'd to a PC in Lab.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:  Mary Wiersgalla
Modified date:  09/2009
Modifications:  Converted to PDF.  Added provider name/alias.
	Added order alias.
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
drop program 1_lm_downtime_lab_mc:dba go
create program 1_lm_downtime_lab_mc:dba
 
 
prompt
	"Output to File/Printer/MINE" = "MINE"
 
 
with outdev
 
 
 
declare mrn_var = f8
set mrn_var = uar_get_code_by("MEANING", 4, "MRN")
 
set maxsecs = 720
 
select distinct into $outdev
	p.name_full_formatted
	, p1.name_full_formatted
	, o_catalog_cdf = uar_get_code_meaning( o.catalog_cd )
	, o.catalog_cd
	, o_catalog_disp = uar_get_code_display( o.catalog_cd )
	, order_id = cnvtint(o.order_id)
	, o.orig_order_dt_tm
	, p.birth_dt_tm
	, o.current_start_dt_tm
	, pa_person_alias_type_cdf = uar_get_code_meaning( pa.person_alias_type_cd )
	, pa.person_alias_type_cd
	, pa_person_alias_type_disp = uar_get_code_display( pa.person_alias_type_cd )
	, pa.person_alias_id
	, ne.nomenclature_id
	, n.source_string
	, n.source_identifier
	, od.oe_field_display_value
	, pal.alias
	, pal.alias_pool_cd
	, o.order_mnemonic
	, o_order_status_disp = uar_get_code_display( o.order_status_cd )
	, od2.oe_field_display_value
	, pr.name_full_formatted
	, cva.alias
 
from
	orders   o
	, person   p
	, person   p1
	, person_alias   pa
	;, encounter   e
	, dummyt d1
	, nomen_entity_reltn   ne
	, nomenclature   n
	, order_detail   od
	, prsnl_alias   pal
	, prsnl   pr
	, dummyt d3
	, order_detail od2
	, code_value_outbound cva
 
plan o
; 2546 = future
where  o.order_status_cd = 2546 and o.current_start_dt_tm
    between cnvtdatetime(curdate-14,curtime3) and cnvtdatetime(curdate+14,curtime3)
 
join p
where  p.person_id = o.person_id
and p.name_last_key != "TESTPATIENT"
and p.name_last_key != "TEST"
 
join od
where o.order_id = od.order_id
   ; collection priority
  and od.oe_field_meaning="COLLPRI"
 
join pa
where p.person_id = pa.person_id
  and pa.person_alias_type_cd = mrn_var
  and pa.active_ind = 1
 
join p1
where o.last_update_provider_id = p1.person_id
 
join pal
where outerjoin(p1.person_id) = pal.person_id
  ; 4530509 = cycare #
  and pal.alias_pool_cd = outerjoin(4530509)
  and pal.active_ind = outerjoin(1)
 
join pr
where pr.person_id = pal.person_id
 
 
join cva
where cva.code_value = o.catalog_cd
and cva.contributor_source_cd =     3458509.00
 
join d3
join od2
where o.order_id = od2.order_id
and od2.oe_field_meaning = "ICD9"
 
 
 
;join e
;where e.encntr_id = o.encntr_id
 
/*and e.encntr_type_cd in
	(10579519,	;clinic outpatient
	26160275,	;clinic recurring outpatient
	7136874)	;lab/rad only
	)	; clinic
*/
 
join d1
join ne
; diagnosis
where ne.parent_entity_name = "ORDERS"
  and ne.parent_entity_id = o.order_id
 
join n
; name of diagnosis
where n.nomenclature_id = ne.nomenclature_id
 
 
order by
	p.name_full_formatted
	, o.orig_order_dt_tm
	, o.order_id
 
 
 
head report
	m_numlines = 0
%i cclsource:vccl_diortf.inc
	y_pos = 18
subroutine offset( yval )
	call print( format( y_pos + yval, "###" ))
end
	count = 0
 
head page
	if (curpage > 1)  y_pos = 10 endif
	"{f/0}{cpi/14}"
	count = count + 1
	row + 1, "{f/9}{cpi/9}"
	call print(calcpos(250,y_pos+7)) "Midelfort Clinic"
	call print(calcpos(240,y_pos+21)) "Future Lab Orders"
	row + 1
	row + 1, "{f/9}{cpi/11}"
	call print(calcpos(280,y_pos+35)) curdate
	;row + 1
	row + 1, "{f/0}{cpi/15}"
	row + 1,
 
 
	row + 1
	y_pos = y_pos + 51
 
head p.name_full_formatted
	;if (( y_pos + 146) >= 792 ) y_pos = 0,  break endif
	if (( y_pos + 190) >= 792 ) y_pos = 0,  break endif
	row + 1, "{f/1}{cpi/14}"
	call print(calcpos(36,y_pos+11)) "Patient Name"
	call print(calcpos(220,y_pos+11)) "Birth Date"
	call print(calcpos(390,y_pos+11)) "Clinic MRN"
	row + 1
	name_full_formatted1 = substring( 1, 30, p.name_full_formatted ),
	alias1 = substring( 1, 10, pa.alias ),
	row + 1, "{f/0}"
	call print(calcpos(36,y_pos+29)) name_full_formatted1
	call print(calcpos(220,y_pos+29)) p.birth_dt_tm
	call print(calcpos(390,y_pos+29)) alias1
	row + 1
	row + 1, "{f/1}"
	call print(calcpos(36,y_pos+47)) "Priority"
	call print(calcpos(90,y_pos+47)) "Date"
	call print(calcpos(145,y_pos+47)) "Order ID"
	call print(calcpos(220,y_pos+47)) "Order Alias"
	call print(calcpos(300,y_pos+47)) "Order Status"
	call print(calcpos(390,y_pos+47)) "Provider"
	row + 1
	y_pos = y_pos + 59
 
 
detail
	if (( y_pos + 133) >= 792 ) y_pos = 0,  break endif
	oe_field_display_value1 = substring( 1, 5, od.oe_field_display_value ),
	alias2 = substring( 1, 6, pal.alias ),
	;alias2 = trim(pal.alias)
	provider = trim(pr.name_full_formatted)
	provider_name_alias = concat(alias2, provider)
	order_alias = substring(1,25, cva.alias)
	row + 1, "{f/0}{cpi/14}"
	call print(calcpos(36,y_pos+5)) oe_field_display_value1
	call print(calcpos(90,y_pos+5)) o.current_start_dt_tm
	call print(calcpos(135,y_pos+5)) order_id
	call print(calcpos(220,y_pos+5)) order_alias
	call print(calcpos(300,y_pos+5)) o_order_status_disp
	call print(calcpos(390,y_pos+5)) provider_name_alias
	;call print(calcpos(414,y_pos+14)) alias2
	row + 2
	call print(calcpos(36,y_pos+20)) "{b}Diagnosis (ICD9 Code):{endb}"
	call print(calcpos(155,y_pos+20)) n.source_identifier
	;call print(calcpos(150,y_pos+14)) n.source_string
	;row + 1,
	;call print(calcpos(90,y_pos+20)) od2.oe_field_display_value
	;call cclrtf_print ( 0 ,  180 ,  90 ,  75 , od2.oe_field_display_value,  255 ,  1 ),
	;call cclrtf_print ( 0 ,  90 ,  21 ,  90 , od2.oe_field_display_value,  255 ,  1 ),
	;	row + 1, "{f/0}{cpi/15}"
	;call print(calcpos(36,y_pos+30)) "{b}Order Status:{endb}"
	;call print(calcpos(110,y_pos+30)) o_order_status_disp
	y_pos = y_pos + 36
 
foot p.name_full_formatted
	if (( y_pos + 66) >= 792 ) y_pos = 0,  break endif
 
	row + 1	y_val= 792-y_pos-21
	^{ps/newpath 1 setlinewidth   20 ^, y_val, ^ moveto  590 ^, y_val, ^ lineto stroke 20 ^, y_val, ^ moveto/}^
	call print(calcpos(45,y_pos+12)) "----------------------------------------------------------------------------------------------"
	y_pos = y_pos + 12
 
foot page
	y_pos = 726
	row + 1, "{f/0}{cpi/14}"
	row + 1,
	;call print(calcpos(20,y_pos+11)) count
	call print(calcpos(20,y_pos+11)) "Lab Orders (Midelfort), page: "
    call print(calcpos(150,y_pos+11)) count
    call print(calcpos(20,y_pos+20))"Run Date/Time:"
    call print(calcpos(100,y_pos+20)) curdate
	call print(calcpos(145,y_pos+20)) curtime2
 
 
with maxcol = 300, maxrow = 10000 , dio = 38, noheading,
format= variable, outerjoind = d1, outerjoind = d3, time= value( maxsecs )
 
 
end
go
 
