free set request go
record request
(
; 1 person_id = f8
; 1 encntr_id = f8
1 PEND_DEFIC_IND = i2
1 LETTER_DESCRIPTION = vc
1 PRINT_MED_SERVICE_IND = i2
1 FULL_REPORT_NAME = vc
1 OUTPUT_DEST_CD = f8
1 PRINTER_ID = i2
1 PHYSICIAN_QUAL[*]
  2 physician_id = f8
  2 MED_SERVICE_NAME = vc
  2 PHYSICIAN_NAME =  vc
	2 LETTERS_DIST_PREF = vc
	2 EMAIL_ADDRESS = vc
1 org_qual[*]
  2 ORGANIZATION_ID = f8
1 SORT_IND =i2
1 DEBUG_IND = i2
1 QUALIFIED_DEFS_IND = i2
1 QUALIFIED_CHARTS_IND = i2
1 BATCH_NBR = i4
1 PRINTER_ID = f8)
go
;set stat = alterlist(request,1) go
set REQUEST -> PEND_DEFIC_IND  = 1 go
set REQUEST-> LETTER_DESCRIPTION  = "LASF- Warning" go
set stat = alterlist(REQUEST -> PHYSICIAN_QUAL,1) go  
set REQUEST -> PHYSICIAN_QUAL [1]-> PHYSICIAN_ID  = 4282915.00 go
set stat = alterlist(REQUEST -> ORG_QUAL,1) go  
set REQUEST -> PRINT_MED_SERVICE_IND  = 1 go
set REQUEST -> org_QUAL [1]-> organization_ID  = 4282915.00 go

set REQUEST -> FULL_REPORT_NAME = "Test Report" go
set REQUEST -> OUTPUT_DEST_CD  =     4542040.00 go
set REQUEST -> PRINTER_ID  = 123555 go
set REQUEST -> SORT_IND  = 1 go
set REQUEST -> DEBUG_IND  = 0 go
set REQUEST -> QUALIFIED_DEFS_IND  = 1 go
set REQUEST -> QUALIFIED_charts_IND  = 1 go
set REQUEST -> BATCH_NBR=   70541607 go
;set request->person_id =      12573471.00 go  ;12585510.00 go
;set request->encntr_id =     90761230.00 go   ;90781239.00 go
execute HIM_MAK_PHYS_DOC_LETTERS go
