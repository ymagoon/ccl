/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_muse_out
 *  Description:  Script for EKG orders outbound to MUSE
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Rick Quackenbush
 *  Library:        OEOCF23ORMORM
 *  Creation Date:  03/06/12
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:    03/06/12   R. Quack      Set up the basic ob mod obj for orders with msh, ssn and doc nbr fixes
 *  2:    04/26/12   R. Quack      Set up logic to check fin nbr alias pool or hospital service then set  pv1;3 values
 *  3:    05/16/12   R. Quack      Set up code to filter out all doctor ID's except those in the Username alias pool.
 *  4:    05/30/12   R. Quack      Added ignore logic for SIGX region patients and MSH;5 logic for SIGM and SIGU
 *  5:    05/31/12   R. Quack      Added ignore logic for SJN patients until they go live on Muse
 *  6:    7/11/12   R. Quack        Added logic for SJN patients to first ignore logic for their go live on Muse
*   7.   03.07.2014  H. Bruns    Added logic for Soarian.   Add logic to check for Soarian values.  If BayCare FIN then check 
*			       MSH:5 for Facility to determine which value to place in the location alias
*   8.      07.22.2014 T McArtor  Added SJS Facility
*   9.    05/12/15      L. Tabler      Added WHH and WHW
*   10.    04/25/16     McArtor       Added Added BRM RFC 11022
*   11.    05/17/16    S Parimi       Added BMGFN RFC 11846 (Copy of T McArtor's code from M30) 
 *  ---------------------------------------------------------------------------------------------
*/

/***We are not sending any orders from SIGX region because that is SJ Diagnostics and they do not 
do EKG's with Muse out there Per Michael Flannery.  Also SJN is not live on MUSE yet so filter and all others
not listed in IF statement just in case outreach or other clinics have patients where EKGs would get ordered***/

If(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id not in ("SIGM FIN",
"SIGU FIN", "SJH FIN", "SJW FIN", "SAH FIN", "SFB FIN", "MPH FIN", "MCS FIN", "MDU FIN", "NBY FIN", "SJN FIN"
, "BayCare FIN","BMGFN"))
 
   Set oenstatus->Ignore=1
   set oenstatus->ignore_text = build("SKIPPED: FIN OF ", 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id, " IS NOT FROM A VALID ALIAS POOL")
Endif

/*** Facility in MSH:5 ***/
EXECUTE OP_MSH_FAC_MODOBJ_OUT

/***Logic to set the MSH;5 field equal to SIGM, SIGU since the msh fix script above does not address the 
signature outpatient clinic locations for the MSH.***/

If(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SIGU FIN")

   Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
   Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SIGU"

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SIGM FIN")

   Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
   Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SIGM"

Endif

/*** ssn fix***/
If(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
Endif

/***Set up the location logic to check fin nbr alias pool or hospital service then set  pv1;3.  This logic is for MUSE because
they can only have 1 value in their system per site and we have duplicat aliases such as 2E or ICU aliased the same
at multiple hospitals.  In order to get around this for the hospital site lists we are concatentating a two character
 facility specific indicator onto the front of each PV1;3.1 location alias.  This makes it JW2E or SA2E, etc when 
MUSE receives the location.  Next for signature regions we are check SIGU FIN pool and setting location to 
EKC which represents the Carillon patients only.  However for the SIGM FIN pool we can't just check that we 
have to check the hospital servcie codes instead to determineif the patient is from Trinity or Bardmoor patient 
populations since those are both mapped into the SIGM FIN outpatien region alias pool.  Those two outpatient 
clinics are both witnin 1 outpatient region.  We can use the more descriptiove hospital service codes of EKB, 
RDB to represent EKG Bardmoor and Imaging Bardmoor patients and EKT, RDT to represent EKG Trinity and 
Imaging Trinity patients.***/

If(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->hospital_service in ("RDT", "EKT"))
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "EKT"

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->hospital_service in ("RDB","EKB"))

   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "EKB"

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SIGU FIN")

   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "EKC"

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SFB FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("SF",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SJN FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("JN",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SJH FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("JH",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SJW FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("JW",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "SAH FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("AH",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "MPH FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("MP",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "MCS FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("MC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "MDU FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("MD",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "NBY FIN")
  
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      concat("NB",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

/* 	7.  Add logic to check for Soarian values.  If BayCare FIN then check MSH:5 for Facility to determine which value to place in 
	the location alias	 */

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "BayCare FIN")

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SJS")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("JS",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SFB")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("SF",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SJN")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("JN",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SJH")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("JH",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SJW")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("JW",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SAH")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("AH",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "MPH")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("MP",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "MCS")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("MC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "MDU")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("MD",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "NBY")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("NB",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "WHH")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("WH",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "WHW")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("WH",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

	if	(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "BAH")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("BA",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

	if (oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "BRM")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("BR",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)
	endif

/*Start Muse Worklist change for BMG */

Elseif(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = "BMGFN")

   		Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = 
      		concat("BMG",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit)

/*Stop  Muse Worklist change BMG*/

Endif

/***This doctor filter code is to send only the Username alias pool doctor ID for the patient facility. This code is for 
Admitting, Attending, Consulting and the ORC/OBR Ordering physicians.  We are using the new Username alias
pool which is going to store the organization wide unique physician ID's created for the Cactus project.  In the
ADT interface from Invision to MUSE we are not passing any doctor personnel information only the demographics
so we don't have to worry that Invision  does not yet have these doctor numbres loaded to send out on ADT. 
MUSE will take the doctor ID's from Cerner in the  ORM messages and then return those same ID's to us 
the result messages as the result interpretor. They were provided a list of these ID's from  Core to load into MUSE 
for all reading physicians at Baycare ***/

set id_type="Username"

/***Consulting Doctor Filter***/

set con_size=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc,5)
;modified set con_nbr from 0 to 1 per G. Gerlemen recommendation for fix issue w/last recurring cons. dr. #
set con_nbr=1
set doc_found="N"
for (j=1 to con_size)
    if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [j]->id_type=id_type)

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->id_nbr =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [j]->id_nbr

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->last_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc[j]->last_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->first_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [j]->first_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->middle_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [j]->middle_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->suffix = 
                oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [j]->suffix 
            
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->assign_auth->name_id = 
                oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [j]->assign_auth->name_id

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->name_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->id_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc [con_nbr]->assign_fac_id->name_id = ""

          set con_nbr=con_nbr+1
          set doc_found="Y"

    endif
endfor

;added the minus 1 to the end of the alterlist statement for testing final consulting dr
If (doc_found="Y")
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1[1]->consulting_doc,con_nbr - 1)
else
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->consulting_doc,0)
endif

/***Referring Doctor Filter***/

set ref_size=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc,5)
set ref_nbr=0
set doc_found="N"
for (j=1 to ref_size)
    if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->id_type=id_type)

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->id_nbr =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->id_nbr

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->last_name=
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->last_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->first_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->first_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->middle_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->middle_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [con_nbr]->suffix = 
                oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->suffix 

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->assign_auth->name_id =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [j]->assign_auth->name_id
      
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->name_type = ""		
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->id_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [ref_nbr]->assign_fac_id->name_id = ""

          set ref_nbr=ref_nbr+1
          set doc_found="Y"

    endif
endfor


If (doc_found="Y")
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc,ref_nbr)
else
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc,0)
endif 


/***Admitting Doctor Filter***/

set adm_size=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc,5)
set adm_nbr=0
set doc_found="N"
for (j=1 to adm_size)
    if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->id_type=id_type)

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->id_nbr =
		oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->id_nbr

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->last_name =
		oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->last_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->first_name =
		oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->first_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->middle_name =
		oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->middle_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->suffix = 
                oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->suffix       

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->assign_auth->name_id =
		oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [j]->assign_auth->name_id

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->name_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->id_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc [adm_nbr]->assign_fac_id->name_id = ""

          set adm_nbr=adm_nbr+1
          set doc_found="Y"

    endif
endfor

If (doc_found="Y")
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc,adm_nbr)
else
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admitting_doc,0)
endif

/***Attending Doctor Filter***/

set att_size=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,5)
set att_nbr=0
set doc_found="N"
for (j=1 to att_size)
    if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->id_type=id_type)

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->id_nbr =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->id_nbr

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->last_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->last_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->first_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->first_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->middle_name =
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->middle_name

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->suffix = 
                oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->suffix 

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->assign_auth->name_id = 
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [j]->assign_auth->name_id

          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->name_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->id_type = ""
          set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [att_nbr]->assign_fac_id->name_id = ""

          set att_nbr=att_nbr+1
          set doc_found="Y"

    endif
endfor

If (doc_found="Y")
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,att_nbr)
else
   set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,0)
endif

/***Ordering Doctor Filter***/

if (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORM")
set ord_size=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider,5)
set ord_nbr=0
set doc_found="N"
for (j=1 to ord_size)
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->id_type=id_type)

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->id_nbr =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->id_nbr

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->last_name =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->last_name

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->first_name =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->first_name

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->middle_name =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->middle_name

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->suffix = 
                oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->suffix 

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->assign_auth->name_id =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [j]->assign_auth->name_id

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->name_type = ""
          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->id_type = ""
          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [ord_nbr]->assign_fac_id->name_id = ""

          set ord_nbr=ord_nbr+1
          set doc_found="Y"

    endif
endfor

If (doc_found="Y")
   set stat=alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider,ord_nbr)
else
   set stat=alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider,0)
endif

/***ORC Ordering Doctor Filter***/

Set stat=alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by,0)
Set stat=alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->verified_by,0)
Set stat=alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->action_by,0)

set orc_size=size(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider,5)
set orc_nbr=0
set doc_found="N"
for (j=1 to orc_size)
    if (oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->id_type=id_type)
          
          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->id_nbr =
	oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->id_nbr

          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->last_name =
	oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->last_name

          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->first_name =
	oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->first_name

          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->middle_name =
	oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->middle_name

          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->suffix = 
                oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->suffix 

          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->assign_auth->name_id =
	oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [j]->assign_auth->name_id

          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->name_type = ""		
          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->id_type = ""
          set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [orc_nbr]->assign_fac_id->name_id = ""

          set orc_nbr=orc_nbr+1
          set doc_found="Y"

    endif
endfor

If (doc_found="Y")
   set stat=alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider,orc_nbr)
else
   set stat=alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider,0)
endif
endif

/***OBR Result Copies Doctor Filter***/

set res_size=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies,5)
set res_nbr=0
set doc_found="N"
for (j=1 to res_size)
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->id_type=id_type)

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->id_nbr =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->id_nbr

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->last_name =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->last_name

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->first_name =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->first_name

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->middle_name =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->middle_name

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->suffix = 
                oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->suffix 

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->assign_auth->name_id =
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [j]->assign_auth->name_id

          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->name_type = ""
          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->id_type = ""
          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies [res_nbr]->assign_fac_id->name_id = ""

          set res_nbr=res_nbr+1
          set doc_found="Y"

    endif
endfor

If (doc_found="Y")
   set stat=alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies,res_nbr)
else
   set stat=alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->result_copies,0)
endif