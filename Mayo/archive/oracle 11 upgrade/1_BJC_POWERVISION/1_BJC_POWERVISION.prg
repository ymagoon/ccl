drop program 1_bjc_PowerVision:dba go
create program 1_bjc_PowerVision:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
set maxsec = 300
 
;DECLARE OMF_GET_PERS_FULL() = C42
;DECLARE OMF_GET_CV_DISPLAY() = c42
 
SELECT DISTINCT into $OUTDEV
;User_Name = opsf.user_id, ;OMF_GET_PERS_FULL(OPSF.USER_ID),
Name = p.name_full_formatted,
Username = p.username,
Position = uar_get_code_display(p.position_cd),
Reporting_Domain = uar_get_code_display(OG.GRID_GROUP_CD), ;OMF_GET_CV_DISPLAY(OG.GRID_GROUP_CD),
Subject_Area = uar_get_code_display(OPSF.GRID_CD);OMF_GET_CV_DISPLAY(OPSF.GRID_CD)
FROM OMF_PV_SECURITY_FILTER OPSF, OMF_GRID OG
, prsnl p
PLAN OG
WHERE 1=1
JOIN OPSF
WHERE OPSF.GRID_CD = OG.GRID_CD
join p where p.person_id = opsf.user_id
and p.active_ind = 1
and p.end_effective_dt_tm >=cnvtdatetime(curdate, curtime3)
ORDER
Position,
Name,
Reporting_Domain,
Subject_Area
;OMF_GET_PERS_FULL(OPSF.USER_ID),
;OMF_GET_CV_DISPLAY(OG.GRID_GROUP_CD),
;OMF_GET_CV_DISPLAY(OPSF.GRID_CD)
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, TIME= VALUE(maxsec)
 
 
end
go
 
