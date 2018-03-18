drop program immu_ord_syn_query go
create program immu_ord_syn_query
 
prompt 
	"Output to File/Printer/MINE" = "MINE" 

with OUTDEV
 
 
select into $1
cv.code_value
,orderable = uar_get_code_display(cv.code_value)
,ocs.synonym_id
,order_synonym = substring(1, 80, ocs.MNEMONIC)
,synonym_type = uar_get_code_display(ocs.MNEMONIC_TYPE_CD)
,synonym_CKI = substring(1, 30, ocs.CKI)
,event_code_cs_72 = uar_get_code_display(cver.event_cd)
,event_code_cs_72_trade_name = substring(1,40, cvo3.alias)
,event_code_cs_72_CVX_alias = substring(1,60, cvo4.alias)
,cs_100406_name = substring(1,60, cv2.display)
,cs_100406_trade_name_alias = substring(1,40, cvo.alias)
,cs_100406_CVX_alias = substring(1,60, cvo2.alias)
 
from code_value_extension cve
    ,code_value cv
    ,order_catalog_synonym ocs
    ,code_value cv2
    ,code_value_outbound cvo
    ,code_value_outbound cvo2
    ,code_value_event_r cver
    ,code_value_outbound cvo3
    ,code_value_outbound cvo4
 
plan cve
where cve.field_name = "IMMUNIZATIONIND"
  and cve.code_set = 200
  and cve.FIELD_VALUE = "1"
join cv
where cv.code_value = cve.code_value
  and cv.active_ind = 1
join ocs
where ocs.catalog_cd = cv.code_value
  and ocs.active_ind = 1
  and ocs.mnemonic_type_cd not in (2584) ;,614548)
  and trim(ocs.cki,3) != ""
join cv2
where cv2.code_set = outerjoin(100406)
  and cv2.description = outerjoin(ocs.cki)
  and cv2.active_ind = outerjoin(1)
join cvo
where cvo.code_value = outerjoin(cv2.code_value)
  and cvo.contributor_source_cd = outerjoin(299272767)  ;HL7 v2
join cvo2
where cvo2.code_value = outerjoin(cv2.code_value)
  and cvo2.contributor_source_cd = outerjoin(112185842)            ;CVX
join cver
where cver.parent_cd = outerjoin(cv.code_value)
join cvo3
where cvo3.code_value = outerjoin(cver.event_cd)
  and cvo3.contributor_source_cd = outerjoin(299272767)  ;HL7 v2
join cvo4
where cvo4.code_value = outerjoin(cver.event_cd)
  and cvo4.contributor_source_cd = outerjoin(112185842)            ;CVX
 
 
order by orderable, synonym_type, order_synonym
with nocounter, skipreport=1, format
 
end
go
 
