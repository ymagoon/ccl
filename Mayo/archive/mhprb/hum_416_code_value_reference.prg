 
DROP PROGRAM  hum_code_value_monthly:dba  GO
CREATE PROGRAM  hum_code_value_monthly:dba
 
declare rtxt = vc
 
;**** BEGINNING OF PREAMBLE ****
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;********************************************************
 
declare startdt = f8
declare enddt = f8
 
set stardt = cnvtdatetime(curdate-1,0)
set endt = cnvtdatetime(curdate-1,235959)
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
declare month = vc
set month = format(startdt,"mmm;;d")
set dir_date = format(curdate,"yyyymm;;d")
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
 
 
;002 unique file logic
set print_file = concat("hum_zh_main_dictionary_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_main_dictionary.txt"
 
call echo("dump the code_value table")
 
 RECORD  TMP  (
1  QUAL [*]
2  CODE_SET  =  VC
2  CODE_VALUE  =  VC
2  CDF_MEANING  =  VC
2  DISPLAY  =  VC
2  DISPLAY_KEY  =  VC
2  DEFINITION  =  VC
2  DESCRIPTION  =  VC
2  ACTIVE_IND = VC
2  NAME  =  VC
)
 
SET  CNT  = 0
 
SELECT  INTO "nl:"
CV.CODE_SET
FROM ( CODE_VALUE  CV )
 
plan cv WHERE CV.CODE_VALUE > 0
;AND CV.ACTIVE_IND=1
 
DETAIL
 CNT =( CNT +1 ),
 STAT = ALTERLIST ( TMP -> QUAL ,  CNT ),
 TMP -> QUAL [ CNT ]-> CODE_SET = CNVTSTRING (CV.CODE_SET),
 TMP -> QUAL [ CNT ]-> CODE_VALUE = CNVTSTRING (CV.CODE_VALUE),
 TMP -> QUAL [ CNT ]-> CDF_MEANING = TRIM (CV.CDF_MEANING, 3 ),
 TMP -> QUAL [ CNT ]-> DISPLAY = TRIM (CV.DISPLAY, 3 ),
 TMP -> QUAL [ CNT ]-> DISPLAY_KEY = TRIM (CV.DISPLAY_KEY, 3 ),
 TMP -> QUAL [ CNT ]-> DEFINITION = TRIM (CV.DEFINITION, 3 ),
 TMP -> QUAL [ CNT ]-> DESCRIPTION = TRIM (CV.DESCRIPTION, 3 ),
 TMP -> QUAL [ CNT ]-> ACTIVE_IND = cnvtstring(CV.ACTIVE_IND)
 WITH  NOCOUNTER
 
IF ( ( SIZE ( TMP -> QUAL , 5 )>0 ) )
 
 
SELECT  INTO concat(print_dir,print_file)	; hum_bc_code_value
TMP -> QUAL [1 ]-> CODE_SET
FROM ( DUMMYT  D1 )
PLAN ( D1 )
 
HEAD REPORT
 X =0 ,
 COL 0 ,
"Code_Set||Code_Value||CDF_Meaning||Display||Display_Key||DEFINITION||DESCRIPTION||ACTIVE_IND|" ,
 ROW +1
DETAIL
 
FOR (  IDX  = 1  TO  SIZE ( TMP -> QUAL , 5 ) )
COL 0 , CODE_SET = TRIM ( TMP -> QUAL [ IDX ]-> CODE_SET , 3 ),
COL +0 , CODE_SET , COL +0 ,"||" ,
COL +0 , TMP -> QUAL [ IDX ]-> CODE_VALUE , COL +0 ,"||" ,
COL +0 , TMP -> QUAL [ IDX ]-> CDF_MEANING , COL +0 ,"||" ,
COL +0 , TMP -> QUAL [ IDX ]-> DISPLAY , COL +0 ,"||" ,
COL +0 , TMP -> QUAL [ IDX ]-> DISPLAY_KEY , COL +0 ,"||" ,
COL +0 , TMP -> QUAL [ IDX ]-> DEFINITION , COL +0 ,"||" ,
COL +0 , TMP -> QUAL [ IDX ]-> DESCRIPTION , COL +0 ,"||" ,
COL +0 , TMP->QUAL[IDX]->ACTIVE_IND, COL+0 , "|",
ROW +1
 
ENDFOR
 
 WITH  NOCOUNTER , FORMAT = VARIABLE , MAXCOL =5000,formfeed = none
ENDIF
 
;****  BEGINNING OF POSTAMBLE ****
DECLARE LEN = I4
DECLARE dclcom = vc ;C255
DECLARE newdir = vc ;C255
 
set newdir = "$mhs_ops/"
set DCLCOM = concat("mkdir ",newdir,"humedica/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir ="$mhs_ops/humedica/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"dictionaries/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/dictionaries/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat(client_code,"_T",dirdt,"_E",edt,file_ext)
 
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
#exit_program
 
;****** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
;******************************************
 
end
go
 
