/* report with activity type of patient care- copy of blood bank vitual report)*/
DROP PROGRAM 1_mhs_fsh_pc_virtual_views_1:dba GO
CREATE PROGRAM 1_mhs_fsh_pc_virtual_views_1:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facility" = ""
 
with OUTDEV, FACILITY
 
case($Facility)
	 of "EU":
 
select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00 ;Patient care
    and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "EU*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "LA":
	select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "LA*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "MA":
 
	select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "MA*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "ME":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "ME*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "OW":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "OW*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "LC":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "LC*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "CA":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "CA*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "AU":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "AU*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "AL":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "AL*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "FA":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "FA*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
	of "FB":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*"
													and display = "FB*")
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
 
	of "ALL":
 
	 select distinct into $outdev
 
	Primary_Mnemonic = oc.PRIMARY_MNEMONIC,
	Catalog_ID = oc.CATALOG_CD,
	Activity_Type = UAR_GET_CODE_DISPLAY(oc.activity_type_cd),
	Mnemonic = ocs.MNEMONIC,
	MNEMONIC_TYPE = uar_get_code_display ( ocs.MNEMONIC_TYPE_CD ),
	Synonim_ID = ocs.SYNONYM_ID,
	Facility_Name = uar_get_code_display (ocsf.facility_cd)
 
from order_catalog oc,
     order_catalog_synonym ocs,
	 ocs_facility_r ocsf
 
plan ocs
  where ocs.ACTIVITY_TYPE_CD = 635107.00
  and ocs.active_ind = 1
 
join oc
  where ocs.catalog_cd = oc.catalog_cd
  and oc.active_ind = 1
 
join ocsf
  where ocsf.synonym_id = ocs.synonym_id
 ; and ocsf.facility_cd = 0 or ocsf.facility_cd BETWEEN 24988858 AND 24988876
 and ocsf.facility_cd =0 or ocsf.facility_cd in (select CV1.CODE_VALUE FROM CODE_VALUE CV1
													WHERE CV1.CODE_SET =  220 AND CV1.ACTIVE_IND = 1
													and cdf_meaning = "FAC*")
 
order by oc.primary_mnemonic
WITH MAXREC= 2500000, FORMAT
 
 
endcase
 
end
go
