/*****************************************************************************
 Author:        	Angela Vail
 Date Written:  	11/06/2014
 Report Title:  	confid_level_updt
 Source File:   	confid_level_updt.prg
 Object Name:		confid_level_updt
 Directory:     	$mhs_ops
 Users: 		HIM Privacy Officers
  Executing from:	Explorer Menu
 Run Frequency: 	Ad Hoc
 Output Destination:	Outdev
 Request structure: 	N/A
 
 
Program purpose: To allow HIM Privacy Officers to
update confidentiality status on patients via Explorer Menu.
 
***************************************************************************
                            Tables Used
--Person
Person_Alias
Encounter
 
****************************************************************************
                        REQUIRED PROMPTS
 $1 "Please enter CMRN:  " = ""
 $2 "Choose Conf Level:  " = ""
****************************************************************************
ADDITIONAL INFORMATION
****************************************************************************
Organization Using Report:  MCHS EMR
Change Control Request # CAB 63873
Report Tested by:
Verified Date:
IT support group to validate in future testing rounds: PM
 
*****************************************************************************
                        MODIFICATION CONTROL LOG
*****************************************************************************
 Mod    Date      Engineer         	Description of Modification   	  Project or CAB #
 ---    --------  -----------------  	--------------------------------  -------------------------
 
Original CCL developed by Lynn Summerlin and Tanya Carr. Modified for MCHS
 
000     11/06/14  Angela Vail          	Initial Release      		  CAB 63873
 
--------------------------------------------------------------------------------------------------
 
 
**************  END OF ALL MODCONTROL BLOCKS  **************************/
 
drop program confid_level_updt: dba go
create program confid_level_updt : dba
 
prompt
	"Please enter CMRN:" = ""
      , "Choose Conf Level:" = ""
 
with PROMPT1, PROMPT2
 
set cmrn =($1)
set confid_cd = 0
Set Confid_status = ($2)
set pvip = 0
set cmrn_cd = UAR_GET_CODE_BY("DISPLAYKEY",4,"COMMUNITYMEDICALRECORDNUMBER")
 
declare p_id=f8
set p_id=0
If(Confid_status ="7")
    set confid_cd =uar_get_code_by("Displaykey",87,"7VIP"),
    set pvip = uar_get_code_by("Displaykey",67,"CALLHELPDESKTOACCESS")
  elseif (Confid_status = "1")
    set confid_cd = uar_get_code_by("DISPLAYKEY",87,"1ROUTINE")
  else
    CALL ECHO("Could not find Conf. Level, exiting program")
    GO TO END_OF_REPORT
endif
/*
Find current User
*/
declare ccl_user_id = F8
If(REQINFO->UPDT_ID <= 0)
  If(substring((size(curuser)-4),5,curuser) = "_TEST" OR
     substring((size(curuser)-4),5,curuser) = "_CERT")
       declare tmp_curuser = vc
       set tmp_curuser = substring(1,(size(curuser)-5),curuser)
       SELECT into "NL:"
         p.person_id
       FROM prsnl p
       where p.username = tmp_curuser
       detail
         ccl_user_id = p.person_id
       with nocounter
  else
       SELECT into "NL:"
         p.person_id
       FROM prsnl p
       WHERE p.username = curuser
       DETAIL
         ccl_user_id = p.person_id
       with nocounter
  endif
ELSE
  SET ccl_user_id = REQINFO->UPDT_ID
ENDIF
 
 
 
SELECT into "NL:"
 
FROM
	PERSON_alias PA
 
where pa.alias = CMRN
and pa.alias_pool_cd =25017849; CMRN_CD
and pa.active_ind = 1
 
detail
 
p_id=pa.person_id
 
with nocounter
 
/*
          Update Section
*/
 
 
If (confid_status = "7")
	/*
	Update into person P
	set p.vip_cd = pvip, p.updt_id = ccl_user_id, p.updt_dt_tm = cnvtdatetime(curdate,curtime3)
	where p.person_id =p_id
	and p.active_ind = 1
	*/
 
	update into encounter e
	set e.confid_level_cd = confid_cd, e.updt_id = ccl_user_id, e.updt_dt_tm = cnvtdatetime(curdate, curtime3)
	where e.person_id =p_id
	and e.active_ind = 1
 
elseif (confid_status = "1")
	/*
	Update into person P
	set p.vip_cd = 0, p.updt_id = ccl_user_id, p.updt_dt_tm = cnvtdatetime(curdate,curtime3)
	where p.person_id =p_id
	and p.active_ind = 1
	*/
 
	update into encounter e
	set e.confid_level_cd = confid_cd, e.updt_id = ccl_user_id, e.updt_dt_tm = cnvtdatetime(curdate, curtime3)
	where e.person_id = p_id
	and e.active_ind = 1
 
 
 
endif
 
 
commit
#end_of_report
end
 
go
 
 
 
 
