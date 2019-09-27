drop program eks_pregnancy_prefetch go
create program eks_pregnancy_prefetch
 
set eks_common->event_repeat_count = 1
record event (
  1 qual [*]
    2 accession_id = f8
    2 order_id = f8
    2 encntr_id = f8
    2 person_id = f8
    2 logging = c100
    2 cnt = i4
    2 data [*]
      3 misc = vc
)
set stat = alterlist(event->qual,1)
set event->qual[1].person_id = request->patient_id
set event->qual[1].encntr_id = request->encntr_id
 
end
go
 
