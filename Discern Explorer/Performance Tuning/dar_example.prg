DROP PROGRAM   DAR_EXAMPLE GO
CREATE PROGRAM  DAR_EXAMPLE 

declare  PROCEDURE_CD  = f8 with noConstant(uar_get_code_by("MEANING", 401, "PROCEDURE"))

declare  ICD_9_CD  =  f8 with noConstant(uar_get_code_by("MEANING", 400, "ICD9"))
SET  PERSON_ID  =  33074 

free record rec
record rec(
1 person_id = f8
1 list[*]
  2 encntr_id  = f8
  2 procedure_id = f8
  2 Nomenclature_id = f8
  2 source_identifier = vc
)

SELECT into "nl:"
P.*
FROM ( PROCEDURE  P ),
( NOMENCLATURE  N ),
( ENCOUNTER  E )
 PLAN ( N 
WHERE (N.PRINCIPLE_TYPE_CD= PROCEDURE_CD ) AND (N.SOURCE_VOCABULARY_CD= ICD_9_CD
 ))
 AND ( P 
WHERE (P.NOMENCLATURE_ID=N.NOMENCLATURE_ID))
 AND ( E 
WHERE (E.ENCNTR_ID=P.ENCNTR_ID) AND (E.PERSON_ID= PERSON_ID ))

head report
	rec->person_id = e.person_id
	rec_cnt = 0
detail
	rec_cnt = rec_cnt + 1
 	stat = alterlist(rec->list,rec_cnt)
	rec->list[rec_cnt]->encntr_id = e.encntr_id
	rec->list[rec_cnt]->procedure_id = p.procedure_id
	rec->list[rec_cnt]->nomenclature_id = n.nomenclature_id
	rec->list[rec_cnt]->source_identifier = n.source_identifier
with nocounter


free record orders
record orders
(1 list[*]
   2 order_id = f8
   2 details[*]
     3 OE_FIELD_MEANING = vc
)
declare ORDER_STATUS = f8 with noConstant(uar_get_code_by("MEANING", 6004, "FUTURE"))

select into "nl:"
 o.* from orders o  where o.encntr_id = 0 and o.order_status_cd = ORDER_STATUS 
head report
  o_cnt = 0
detail
  o_cnt = o_cnt + 1
  stat = alterlist(orders->list,o_cnt)
  orders->list[o_cnt]->order_id = o.order_id
with nocounter, MAXQUAL(O,500)

for (x1 = 1 to size(orders->list,5))
  select into "nl:" od.OE_FIELD_MEANING from order_detail od 
  where od.order_id = orders->list[x1]->order_id
  head report
     o_cnt = 0
  detail
     o_cnt = o_cnt + 1
     stat = alterlist(orders->list[x1]->details,o_cnt)
     orders->list[x1]->details[o_cnt]->oe_field_meaning = od.oe_field_meaning
  with nocounter
endfor   
 END GO