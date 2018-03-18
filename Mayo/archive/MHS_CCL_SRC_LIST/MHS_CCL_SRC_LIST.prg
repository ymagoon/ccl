drop program MHS_CCL_SRC_LIST GO
CREATE PROGRAM MHS_CCL_SRC_LIST 

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Days" = "0"
	, "Package number" = "0" 

with OUTDEV, Days, pack_nbr

call echo ($Days)
set days_int = cnvtint($days)
set package = cnvtint($pack_nbr)
declare where_text = vc
set where_text = "1 = 1"


if (days_int > 0)
   set where_text = build(concat(where_text, " and  p.datestamp >= curdate - ")
               ,days_int)
endif
if (package > 0)
   set where_text = build(concat(where_text, 
   				" and p.app_major_version = 8000	and p.app_minor_version = ")
               ,package)
endif

SELECT    INTO  $outdev
 GROUP =P.GROUP,
P.BINARY_CNT,
P.APP_MINOR_VERSION,
P.APP_MAJOR_VERSION,
 APP_OCDMAJOR =
IF ( (P.APP_MINOR_VERSION>900000 ) )  MOD (P.APP_MINOR_VERSION, 1000000 )
ELSE  P.APP_MINOR_VERSION
ENDIF
,
 APP_OCDMINOR =
IF ( (P.APP_MINOR_VERSION>900000 ) )  CNVTINT ((P.APP_MINOR_VERSION/1000000.0 ))
ELSE  0
ENDIF
,


 CCL_VERSION = MOD (P.CCL_VERSION, 100 ),
 CCL_REG =
IF ( (P.CCL_VERSION>100 ) ) " Ureg"
ELSE  "  Reg"
ENDIF
,
 OBJECT_NAME =P.OBJECT_NAME,
 OBJECT_BREAK = CONCAT (P.OBJECT, P.OBJECT_NAME),
P.OBJECT,
P.SOURCE_NAME,
P.USER_NAME,
P.DATESTAMP,
P.TIMESTAMP,
 UPDT_ID =
IF ( ( CCL_VERSION >=2 ) ) 0.0
ELSE  0.0
ENDIF
,
 UPDT_TASK =
IF ( ( CCL_VERSION >=2 ) )  VALIDATE (P.UPDT_TASK, 0 )
ELSE  0
ENDIF
,
 UPDT_APPLCTX =
IF ( ( CCL_VERSION >=2 ) )  VALIDATE (P.UPDT_APPLCTX, 0 )
ELSE  0
ENDIF
,
 PRCNAME =
IF ( ( CCL_VERSION >=2 ) )  VALIDATE (P.PRCNAME, "               " )
ELSE  "               "
ENDIF

FROM ( DPROTECT  P )

WHERE (P.OBJECT= "P" ) 
 and  parser (where_text)
;and p.datestamp >= curdate-7

order by 
  P.APP_MINOR_VERSION,
  P.APP_MAJOR_VERSION,
  APP_OCDMAJOR,
  APP_OCDMINOR,
  OBJECT_NAME

WITH NOCOUNTER, format, separator = " "

END
GO 

 

