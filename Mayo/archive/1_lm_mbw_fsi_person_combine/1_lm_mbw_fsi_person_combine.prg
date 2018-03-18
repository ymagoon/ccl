/*******************************************************************
 
Report Name:  Possible Prsn Matches - FSI
Report Path:  /mayo/mhspd/prg/1_lm_mbw_fsi_person_combine.prg
Report Description:  Displays possible person matches from
						unauthenticated Contributor Systems.
 
Created by:  Mary Wiersgalla
Created date:  11/2005
 
Modified by:
Modified date:
Modifications:
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
DROP PROGRAM 1_lm_mbw_fsi_person_combine GO
CREATE PROGRAM 1_lm_mbw_fsi_person_combine
 
PROMPT	"Output to File/Printer/MINE" = MINE
WITH   OUTDEV
 
 
SET MaxSecs = 600
 
SELECT INTO $OUTDEV
	PERSON_ID = CNVTINT(P.PERSON_ID),
	NAME = SUBSTRING(1,40,P.NAME_FULL_FORMATTED),
	MRN = SUBSTRING(1,12,PA.ALIAS),
	LHMRN = SUBSTRING(1,12,PA1.ALIAS),
	BIRTHDATE = FORMAT(P.BIRTH_DT_TM,"MM/DD/YYYY;;D"),
	GENDER = SUBSTRING(1,10,(UAR_GET_CODE_DISPLAY( P.SEX_CD ))),
	CREATED_DT = FORMAT(P.CREATE_DT_TM,"MM/DD/YYYY HH:MM:SS;;D"),
	CONTRIBUTOR_SYSTEM = UAR_GET_CODE_DISPLAY( P.CONTRIBUTOR_SYSTEM_CD )
 
FROM
	PERSON  P,
	PERSON_ALIAS  PA,
	PERSON_ALIAS  PA1,
	DUMMYT  D,
	DUMMYT  D1
 
PLAN P
    WHERE
    	; 3456511 = Misys, 3568990 = Muse, 3458511 = IDX, 3374509 = Dictaphone
        P.ACTIVE_IND = 1 AND P.CONTRIBUTOR_SYSTEM_CD = 3456511 OR
        P.CONTRIBUTOR_SYSTEM_CD = 3568990 OR P.CONTRIBUTOR_SYSTEM_CD = 3458511 OR
        P.CONTRIBUTOR_SYSTEM_CD = 3374509
JOIN D
JOIN PA
    WHERE
    	; 3844507 = Clinic MRN
        P.PERSON_ID = PA.PERSON_ID AND PA.ALIAS_POOL_CD = 3844507
JOIN D1
JOIN PA1
    WHERE
    	; 3844508 = LH MRN
        P.PERSON_ID = PA1.PERSON_ID AND PA1.ALIAS_POOL_CD = 3844508
 
ORDER BY	NAME
 
Head Report
	ROW 1 COL 62 "PERSON ROWS CREATED BY CONTRIBUTOR SYSTEMS"
	ROW 2 COL 5 "Run Date:"
	CURRENTDATE = FORMAT(CURDATE,"MM/DD/YYYY;;dd")
	ROW 2 COL 17 	CURRENTDATE
	CURRENTTIME = FORMAT(curtime, "HH:MM:SS;;S")
	ROW 2 COL 29 	CURRENTTIME
	ROW + 2
 
Head Page
	COL 140  "Page No:"
	COL 148  curpage
	ROW + 2
 
Detail
	if ((ROW + 5) >= maxrow)  break endif
 	LINE1 = FILLSTRING( 152, '-' )
	COL 5  	LINE1
	ROW + 1
	COL 9  "Person ID"
	COL 25  "Name"
	COL 53  "MRN"
	COL 65  "LHMRN"
	COL 77  "DOB"
	COL 93  "Gender"
	COL 109  "Created"
	COL 136  "Contributor System"
	ROW + 1
 
	CONTRIBUTOR_SYSTEM1 = SUBSTRING( 1, 15, CONTRIBUTOR_SYSTEM ),
	COL 5   PERSON_ID
	COL 25   NAME
	COL 53   MRN
	COL 65   LHMRN
	COL 77   BIRTHDATE
	COL 93   GENDER
	COL 109   CREATED_DT
	COL 136  CONTRIBUTOR_SYSTEM1
	ROW + 1
 
Foot Report
 	LINE2 = FILLSTRING( 152, '-' )
	COL 6  	LINE2
	ROW + 1
	COL 128  "Total:"
	Total = cnvtint(count(  NAME ))
	COL 136  	Total
 
WITH MAXCOL = 170, MAXROW = 44 , OUTERJOIN = D, DONTCARE = PA, OUTERJOIN = D1, LANDSCAPE, COMPRESS, NOHEADING, FORMAT= VARIABLE,
 TIME= VALUE( MaxSecs )
 
END
GO
 
