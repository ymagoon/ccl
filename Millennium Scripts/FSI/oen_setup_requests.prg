DROP PROGRAM oen_setup_requests :dba GO
CREATE PROGRAM oen_setup_requests :dba
 SET trace = recpersist
 FREE SET request
 RECORD request (
   1 message = vc
   1 segs [* ]
     2 seg_name = vc
 )
 FREE SET req_seg
 RECORD req_seg (
   1 field_value = vc
 )
 SET trace = norecpersist
END GO