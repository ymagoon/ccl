drop program pel_test_shell : dba go
drop program pel_test_itn_shell : dba go
create program pel_test_itn_shell :dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Report" = 0
	, "person_Id" = 0
 
with OUTDEV, REPORT_NBR, person_id
 
;**********************************************************************************************************
; PEL TEST START
;
;free record request
;    7381725.00
SET PERSON_INFO = BUILD2("r.person_id = ",$PERSON_ID)
CALL ECHO (VALUE(PERSON_INFO))
if ($report_nbr = 0 )
    execute sch_itnry_by_pat_mayo_mn $outdev,
    								  'a.beg_dt_tm >= cnvtdatetime("06-FEB-2014")'
                                      ,'a.end_dt_tm <= cnvtdatetime("31-DEC-2014")'  ;'1 = 1'
;                                      ,'r.person_id = 13673692.00';    13168595.00'
                                       ,VALUE(PERSON_INFO)
ELSEIF ($report_nbr = 1)
    execute sch_itnry_by_pat_mayo_mn $outdev,
    								  'a.beg_dt_tm >= cnvtdatetime("06-FEB-2014")'
                                      ,'a.end_dt_tm <= cnvtdatetime("31-DEC-2014")'  ;'1 = 1'
                                      ,'r.person_id = 13673692.00';    13168595.00'
;                                       ,VALUE(PERSON_INFO)
else
    execute pel_sch_itnry_by_pat_mayo_mn $outdev,
    								  'a.beg_dt_tm >= cnvtdatetime("10-JUL-2013")'
                                      ,'a.end_dt_tm <= cnvtdatetime("31-DEC-2014")'  ;'1 = 1'
                                      ,'r.person_id =  7381725.00';    13168595.00'
endif
 
# EXIT_SCRIPT
 
 END GO
