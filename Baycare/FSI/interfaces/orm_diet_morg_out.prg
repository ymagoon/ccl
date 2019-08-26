/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_comp_morg_out
 *  Description:  Script for diet orders outbound to Computrition only
 *  Type:         Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Chris Eakes
 *  Creation Date:  XX/XX/09
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  1:   1/17/11         R Quack               Created new Comp version with name/header standards
 *  2:   2/18/11         T Dillon                 Modified Supplement so that spec instr is loaded to ODS.5
 *  ---------------------------------------------------------------------------------------------
*/

free set request
record REQUEST
(
   1 ORG_MSG = VC
)

Set REQUEST->ORG_MSG = substring (1, 300000,OEN_REQUEST->ORG_MSG)
Set REQUEST->ORG_MSG = replace(REQUEST->ORG_MSG, "\.br\", "~",0)
Set OEN_REPLY->OUT_MSG = concat(trim(REQUEST->ORG_MSG, 2),  CHAR(0 ))

#single_exit

declare findDIET = i4
declare findSuppl = i4
declare findCal = i4
declare findSnack = i4

set findDIET = findstring("|Diets|",oen_request->org_msg,1)
set findSuppl = findstring("|Supplements|",oen_request->org_msg,1)
;set FindCal = findstring("|Calorie Count|",oen_request->org_msg,1)
;set FindTube = findstring("|Tube Feeding|",oen_request->org_msg,1)    ;Mod004+
set findSnack = findstring("|Snacks|",oen_request->org_msg,1)

 RECORD  TMP 
 (
  1  STR = VC
 )
 FREE SET REQUEST 
 RECORD  REQUEST 
 (
  1  ORG_MSG = VC 
  1  ORG_MSG2 = VC 
  1  ORG_MSG3 = VC 
  1  ORG_MSG4 = VC
  1  ORG_MSG5 = VC
 )

 SET  REQUEST->ORG_MSG = SUBSTRING(1, 65534, OEN_REQUEST->ORG_MSG )
 SET  REQUEST->ORG_MSG2 = SUBSTRING(1, 65534, OEN_REQUEST->ORG_MSG )
 SET  REQUEST->ORG_MSG3 = SUBSTRING(1, 65534, OEN_REQUEST->ORG_MSG )
 SET  REQUEST->ORG_MSG4 = SUBSTRING(1, 65534, OEN_REQUEST->ORG_MSG )
 CALL ECHO(TRIM(REQUEST->ORG_MSG ))

 SET  FD = "|" 
 SET  SD = CHAR(13 )
 SET  MP = FINDSTRING("MSH", REQUEST->ORG_MSG )

 SET  SDP = FINDSTRING(SD, REQUEST->ORG_MSG, MP )
 IF( SDP = 0  ) 
    CALL ECHO(" error - end of segment delimiter not found" )
    GO TO endofscript 
 ENDIF

 SET  TMP->STR = SUBSTRING(MP, SDP - MP + 1, REQUEST->ORG_MSG )
 SET  FLDNUM = 2 
 SET  POS = 0 

 FOR( I = 1  TO  FLDNUM  )
   SET  POS = FINDSTRING(FD, TMP->STR, POS )
   IF( POS = 0  ) 
      CALL ECHO(" error - field not found" )
      GO TO  endofscript 
   ENDIF
   SET  POS = POS + 1 
 ENDFOR

 CALL ECHO(CONCAT("***sending app: ", SUBSTRING(POS, 6, TMP->STR )))

 ;execute oencpm_msglog(build("ORG_TYPE->",DIET_GROUP ->diet_type, char(0)))
 ;execute oencpm_msglog(build("ORG_ID->",DIET_GROUP->service_per_id, char(0)))
 ;;;execute oencpm_msglog(build("ORG_DSP->",DIET_GROUP->diet_sup_pref_cd, char(0)))  ;Mod002-
 ;execute oencpm_msglog(build("Spec Inst:  ",DIET_GROUP->special_inst, char(0)))  

;***Mod002-  Each diet detail should go out in its own ODS segment-  <Start>
Set ods_seg = fillstring(1000," ")
For (diet_idx = 1 to size (diet_group-> diet,5)) 
;_____________________________________________________Mod005+- <Start>
  if (findSuppl > 0)  ;( diet_group-> diet [diet_idx]->IS_SUPPLEMENT = "YES" )
;;;;;;;;;;;;need to add logic here for quantity when it is added to the order entry format!!!!!!!!!!!!!!!
    If(diet_idx=1)
     set ods_seg = build(ods_seg,"ODS", "|","S","|",diet_group-> diet[diet_idx]->obx_3,"|",
        diet_group-> diet [diet_idx]->diet_sup_pref_cd,"|",diet_group->special_inst,char(13))
    Else
      set ods_seg = build(ods_seg,"ODS", "|","S","|",diet_group-> diet[diet_idx]->obx_3,"|",
        diet_group-> diet [diet_idx]->diet_sup_pref_cd,char(13))
    Endif
  elseif (findSnack >0)
     If (diet_idx=1)
       set ods_seg = build(ods_seg,"ODS", "|","S","|",diet_group-> diet[diet_idx]->obx_3,"|",
        diet_group-> diet [diet_idx]->diet_sup_pref_cd,"|",diet_group->special_inst,char(13))
     Else
      set ods_seg = build(ods_seg,"ODS", "|","S","|",diet_group-> diet[diet_idx]->obx_3,"|",
        diet_group-> diet [diet_idx]->diet_sup_pref_cd,char(13))
     Endif
  else
     If(diet_idx=1)
     ;;;set ods_seg = build(ods_seg,"ODS", "|", diet_group->diet_type,"|", diet_group->service_per_id,
     set ods_seg = build(ods_seg,"ODS","|",diet_group->diet_type,"|",
         "|","^",diet_group-> diet [diet_idx]->diet_sup_pref_cd,"|",diet_group->special_inst,char(13))
     Else
      set ods_seg = build(ods_seg,"ODS","|",diet_group->diet_type,"|",
         "|","^",diet_group-> diet [diet_idx]->diet_sup_pref_cd,"|",char(13))
     Endif
  endif
;_____________________________________________________Mod005+- <Stop>
Endfor

If (size(diet_group->spec_serv,5)>0)
For (diet_ss_idx = 1 to size (diet_group->spec_serv,5)) 
If (diet_group->spec_serv[diet_ss_idx]->spec_serv_var>"")
        Set ods_seg=build(ods_seg,
	"ODT","|",diet_group->spec_serv[diet_ss_idx]->spec_serv_var,"|","730^ALL","|",char(13),
	"ODT","|",diet_group->spec_serv[diet_ss_idx]->spec_serv_var,"|","1200^ALL","|",char(13),
	"ODT","|",diet_group->spec_serv[diet_ss_idx]->spec_serv_var,"|","1700^ALL","|",char(13))
Endif
Endfor
Endif


 ;execute oencpm_msglog(build("ORG_ODS****",ods_seg, char(0)))

 ;;;SET  XP = FINDSTRING("ORC|", REQUEST->ORG_MSG2)   ;Mod003-
 SET  XP = FINDSTRING("OBR|", REQUEST->ORG_MSG2)   ;Mod003+
 SET  XDP = FINDSTRING(SD, REQUEST->ORG_MSG2, XP )

SET  REQUEST->ORG_MSG3 = CONCAT(SUBSTRING(1,XP-1,REQUEST->ORG_MSG2) ,ods_seg)

 ;execute oencpm_msglog(build("ORG_MESS 3****",REQUEST->ORG_MSG3 , char(0)))

 set REQUEST->ORG_MSG3 = cnvtupper(REQUEST->ORG_MSG3)
 IF( SUBSTRING(POS, 6, TMP->STR )= "IGNORE"  ) 
   SET  OEN_REPLY->OUT_MSG = CONCAT("OEN_IGNORE", CHAR(0))
 ELSE  
   SET  OEN_REPLY->OUT_MSG = CONCAT(REQUEST->ORG_MSG3, CHAR(0))
 ENDIF

SET REQUEST->ORG_MSG4=OEN_REPLY->OUT_MSG
Set REG_VAR = FINDSTRING("|^REG|",REQUEST->ORG_MSG4,1)
If (REG_VAR >= 1)
 Set ODS_VAR = FINDSTRING("ODS|",REQUEST->ORG_MSG4,REG_VAR + 6)
 If (ODS_VAR >=1)
  Set OEN_REPLY->OUT_MSG= CONCAT(trim(SUBSTRING(1, REG_VAR - 8,REQUEST->ORG_MSG4)),
	trim(SUBSTRING(REG_VAR + 6,size(REQUEST->ORG_MSG4,1),REQUEST->ORG_MSG4)),char(0))
 Endif
Endif

;;Remove delete order reason from being sent out as ODS
SET REQUEST->ORG_MSG5=OEN_REPLY->OUT_MSG
 Set DEL_VAR = FINDSTRING("ODS|D||^DONOTSEND",REQUEST->ORG_MSG5,1)
 If (DEL_VAR >=1)
  Set OEN_REPLY->OUT_MSG= CONCAT(trim(SUBSTRING(1, DEL_VAR - 1,REQUEST->ORG_MSG5)),
                trim(SUBSTRING(DEL_VAR + 18,size(REQUEST->ORG_MSG5,1),REQUEST->ORG_MSG5)),char(0))
 Endif

;endif  ;if ((findDIET > 0) or (findSuppl > 0) or (FindCal > 0) or (FindTube > 0))
#endofscript
;Mod001-  Code for dietary orm's out to Computrition- Stop
;______________________________________________________________________