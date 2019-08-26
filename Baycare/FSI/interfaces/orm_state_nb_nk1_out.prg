/**************************************************************************************************************************
 **  Script Name:  orm_state_nb_nk1_out 
 **  Cerner doesn't create an NK1, so we'll populate the GT1, and then change it in the mod-orig to NK1
 ***************************************************************************************************************************/

execute oencpm_msglog(build("Beginning of orm_state_nb_nk1_out", char(0)))

DECLARE PID = F8
DECLARE NOK_PID = F8
DECLARE NOK_MOTHER_PID = F8
DECLARE NOK_FATHER_PID = F8
DECLARE NOK_RELTN_CD = F8
DECLARE NOK_STREET = VC
DECLARE NOK_CITY = VC
DECLARE NOK_STATE = VC
DECLARE NOK_NAME = VC
DECLARE NOK_FIRST_NAME = VC
DECLARE NOK_LAST_NAME = VC
DECLARE NOK_MIDDLE_NAME = VC
DECLARE NOK_ZIP = VC
DECLARE NOK_COUNTY = VC
DECLARE NOK_PHONE = VC
DECLARE NOK_DOB = VC
DECLARE NOK_SSN = VC
DECLARE RELTN_PERSON_ID = F8

;;;** Start building GT1 segment, to use it for a temporary segment.  Then will change to NK1 in Mod-orig script.

Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP, 1)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1, 1)
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->set_id = "NK1"


SET MSG_DBL_LST_SIZE = SIZE (OEN_REPLY->CERNER->DOUBLELIST ,5 )

FOR (D = 1 TO MSG_DBL_LST_SIZE )
  IF ((OEN_REPLY->CERNER->DOUBLELIST[D ]->STRMEANING = "person_id" ) )
     SET PID = CNVTREAL (OEN_REPLY->CERNER->DOUBLELIST[D ]->DVAL )
  ENDIF
ENDFOR

SET MALE_CV = UAR_GET_CODE_BY ("DISPLAY" ,57 ,"Male" )
SET FEMALE_CV = UAR_GET_CODE_BY ("DISPLAY" ,57 ,"Female" )
SET CHILD_CV = UAR_GET_CODE_BY ("DISPLAY" ,40 ,"Child" )
SET MOM_CV = UAR_GET_CODE_BY ("DISPLAY" ,40 ,"Mother" )
SET DAD_CV = UAR_GET_CODE_BY ("DISPLAY" ,40 ,"Father" )
SET PERSON_RELTN_CV = UAR_GET_CODE_BY ("DISPLAY" ,351 ,"Next of Kin" )        ;** this can vary from site to site


SELECT INTO "nl:"
  PPR.RELATED_PERSON_ID
  FROM (PERSON_PERSON_RELTN PPR )
  WHERE   (PPR.PERSON_RELTN_CD = MOM_CV ) 
         AND   (PPR.PERSON_ID = PID )
DETAIL
  NOK_MOTHER_PID = PPR.RELATED_PERSON_ID
WITH NOCOUNTER


If ((NOK_MOTHER_PID > 0 ) )
   Set NOK_PID = NOK_MOTHER_PID
Elseif ((NOK_FATHER_PID > 0 ) )
   Set NOK_PID = NOK_FATHER_PID
Endif


SELECT INTO "nl:"
  P.NAME_FULL_FORMATTED ,
  P.NAME_FIRST_KEY ,
  P.NAME_LAST_KEY ,
  P.BIRTH_DT_TM
FROM (PERSON P )
  WHERE (P.PERSON_ID = NOK_PID )
DETAIL
  NOK_DOB = format(cnvtdatetime(P.BIRTH_DT_TM) ,"YYYYMMDDHHMMSS;;D"),
  NOK_NAME = P.NAME_FULL_FORMATTED ,
  NOK_LAST_NAME = P.NAME_LAST_KEY ,
  NOK_FIRST_NAME = P.NAME_FIRST_KEY
WITH NOCOUNTER

execute oencpm_msglog(build("NOK dob:t",NOK_DOB, char(0)))

SELECT INTO "nl:"
   PA.ALIAS
FROM (PERSON_ALIAS PA)
   WHERE (PA.PERSON_ID = NOK_PID )
    AND (PA.PERSON_ALIAS_TYPE_CD = 7.00)
DETAIL
   NOK_SSN = PA.ALIAS
WITH NOCOUNTER


SELECT INTO "nl:"
  AD.STREET_ADDR ,
  AD.CITY ,
  AD.STATE ,
  AD.ZIPCODE ,
  AD.COUNTY
FROM (ADDRESS AD )
  WHERE (AD.PARENT_ENTITY_ID = NOK_PID ) AND (AD.PARENT_ENTITY_NAME = "PERSON" )
  AND (AD.ADDRESS_TYPE_CD = 756)
DETAIL
  NOK_STREET = AD.STREET_ADDR ,
  NOK_CITY = AD.CITY ,
  NOK_STATE = AD.STATE ,
  NOK_ZIP = AD.ZIPCODE ,
  NOK_COUNTY = AD.COUNTY
WITH NOCOUNTER


execute oencpm_msglog build("STREET: ", NOK_STREET, char(0))





SELECT INTO "nl:"
   PN.PHONE_NUM
FROM (PHONE PN )
  WHERE (PN.PARENT_ENTITY_ID = NOK_PID ) AND (PN.PARENT_ENTITY_NAME = "PERSON" )
DETAIL
  NOK_PHONE = PN.PHONE_NUM
WITH NOCOUNTER



;;;; NK1-3 = Relationship
If ((NOK_MOTHER_PID > 0 ) )
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_name [1]->last_name = "MTH"
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_name [1]->first_name = "Mother"
Elseif ((NOK_FATHER_PID > 0 ) )
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_name [1]->last_name = "FTH"
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_name [1]->first_name = "Father"
Endif
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_name [1]->middle_name = "HL70063"

;;;; NK1-2 = Name
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->nbr->id = NOK_LAST_NAME
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->nbr->check_digit = NOK_FIRST_NAME


;;;; NK1-4 = Address
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_spouse_name [1]->last_name = NOK_STREET
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_spouse_name [1]->first_name = NOK_CITY
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_spouse_name [1]->middle_name = NOK_STATE
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_spouse_name [1]->suffix = NOK_ZIP
if (NOK_COUNTY != "" )
  Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_spouse_name [1]->name_type_cd = concat("^", NOK_COUNTY)
endif

;;;; NK1-5 = Phone
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->guar_address [1]->street =  cnvtalphanum(NOK_PHONE)

;;;; NK1-16 = NOK birthdate
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->emp_name [1]->last_name = substring(1,8,NOK_DOB)

;;;; NK1-33 = NOK SSN
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1 [1]->living_dependency = 
               concat (NOK_SSN, "^^^SSA&2.16.840.1.113883.4.1&ISO")

execute oencpm_msglog(build("End of orm_state_nb_nk1_out", char(0)))