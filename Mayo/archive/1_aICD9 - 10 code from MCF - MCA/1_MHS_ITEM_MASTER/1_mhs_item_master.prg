DROP PROGRAM 1_mhs_item_master:dba GO
CREATE PROGRAM 1_mhs_item_master:dba
 
PROMPT	"Output to File/Printer/MINE" = MINE
WITH   OUTDEV
 
select distinct into $OUTDEV
item_number = oii5.value,
long_desc = oii.value,
short_desc = oii4.value,
clinical_desc = oii6.value,
equip = uar_get_code_display(oii.object_type_cd),
Base_UOM = uar_get_code_display(pt.uom_cd),
pkg_conv = pt1.qty,
pkg_type_UOM = uar_get_code_display(pt1.uom_cd),
manufacturer = uar_get_code_description(oii1.vendor_manf_cd),
manuf_number = oii1.value,
manuf_desc = oii3.value,
vendor = uar_get_code_description(oii7.vendor_manf_cd),
vend_number = oii7.value,
vend_desc = oii9.value,
reusable = id.reusable_ind,
substitution = id.substitution_ind,
latex = id.latex_ind,
sterilize = im.sterilization_required_ind,
scheduled = im.schedulable_ind,
critical = im.critical_ind,
countable = im.countable_ind,
fda = im.fda_reportable_ind,
safety = em.safety_chk_ind
 
from
 
object_identifier_index oii,
object_identifier_index oii1,
object_identifier_index oii2,
object_identifier_index oii3,
object_identifier_index oii4,
object_identifier_index oii5,
object_identifier_index oii6,
object_identifier_index oii7,
object_identifier_index oii8,
object_identifier_index oii9,
package_type pt,
package_type pt1,
item_definition id,
item_master im,
equipment_master em,
dummyt man,
dummyt inum,
dummyt inum1,
dummyt cdes,
dummyt cdes1,
dummyt pkg,
dummyt pkg1,
dummyt sfty,
dummyt sfty1,
dummyt ven
 
plan oii
where oii.object_type_cd in(3117, 3119)
and oii.identifier_type_cd = 3097
and oii.active_ind = 1
and oii.generic_object = 0
 
join oii4
where oii.object_id = oii4.object_id
and oii4.identifier_type_cd = 3109
and oii4.generic_object = 0
 
join pt
where oii.object_id = pt.item_id
and pt.base_package_type_ind = 1
 
 
join id
where oii.object_id = id.item_id
 
join im
where oii.object_id = im.item_id
 
 
 
join inum
join oii5
where oii.object_id = oii5.object_id
and oii5.identifier_type_cd = 3101
and oii5.generic_object = 0
join inum1
 
 
join cdes
join oii6
where oii.object_id = oii6.object_id
and oii6.identifier_type_cd = 674209
and oii6.generic_object = 0
join cdes1
 
 
join pkg
join pt1
where oii.object_id = pt1.item_id
and pt1.base_package_type_ind = 0
join pkg1
 
join sfty
join em
where oii.object_id = em.item_id
join sfty1
 
 
join man
join (oii1
where oii.object_id = oii1.object_id
and oii1.identifier_type_cd = 3103
 
join oii2
where oii1.identifier_id = oii2.identifier_id
 
join oii3
where oii2.object_id = oii3.object_id
and oii3.object_type_cd = 3121
and oii3.identifier_type_cd = 3097)
 
 
join ven
join (oii7
where oii.object_id = oii7.object_id
and oii7.identifier_type_cd = 3115
 
join oii8
where oii7.identifier_id = oii8.identifier_id)
 
join oii9
where oii8.object_id = oii9.object_id
and oii9.object_type_cd = 3125
and oii9.identifier_type_cd = 3097
 
order by oii.value
with
     outerjoin = man,
     dontcare = oii3,
     outerjoin = ven,
     dontcare = oii5,
     dontcare = oii6,
     dontcare = pt1,
     dontcare = em, SEPARATOR=" ", FORMAT
 
 
 
 
END
GO
