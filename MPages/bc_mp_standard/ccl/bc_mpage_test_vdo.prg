drop program bc_mpage_test_vdo go
create program bc_mpage_test_vdo

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV



RECORD Temp 
(
	1 TEST[2]
		2 TEST_HELLO  = vc
)
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/

/**************************************************************
; DVDev Start Coding
**************************************************************/
Set TEMP->TEST[1].TEST_HELLO = "This sentence comes from the CCL"
Set TEMP->TEST[2].TEST_HELLO = "This also comes from CCL Line 2"

;    Your Code Goes Here


/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
call echojson(TEMP, $OUTDEV) 

end
go

