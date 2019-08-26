/****Modobject script for PharmNet Formulary Updates to Talyst AutoPharm ***/
/****1.  PHopkins   6/713 trim extra zeros from Strength and Volume fields****/
/****2.  PHopkins    6/7/13  Added code to suppress Meds identified with "XXX" by PharmNet******/
/****3.  PHopkins  6/7/13  Removed XXX suppression per Ira Kurland******/
/****4.  RQuack     9/16/14  Copied Talyst MFN script for Pyxis*****/

/*************Declare variables*********/
declare strengthstrg = vc
declare volumestrg = vc

;;;declare sizes = f4
;;;declare sizev = f4

/*******Set variable values************/
set strengthstrg = ""
set volumestrg = ""

;;;set sizes = cnvtint(size(trim(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength,1)))
;;;set sizev = cnvtint(size(trim(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume,1)))


;;;;;;;;;;;;Convert Numeric field to Text and set length,precision,justification;;;;;;

set strengthstrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength,10,3,r)
set volumestrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume,10,3,r)
	execute oencpm_msglog(build("OrigStrength  = ",strengthstrg))
	execute oencpm_msglog(build("OrigVolume  = ",volumestrg))

;;;;;;;;;;If there are zero's after the decimal, truncate the field to an integer value;;;;;;;;;;;;;;;;

/*****************************Correct Precision for Strength*************/

set LAST = 0
set SECOND = 0
set FIRST = 0

set LAST = cnvtint(substring(10,1,strengthstrg))
   if(LAST > 0)
	set LAST = 3
	else
	set LAST = 0
  endif



set SECOND = cnvtint(substring(9,1,strengthstrg))
   if(SECOND > 0)
	set SECOND = 2
	else
	set SECOND = 0
  endif


set FIRST = cnvtint(substring(8,1,strengthstrg))
   if(FIRST > 0)
	set FIRST = 1
	else
	set FIRST = 0
  endif



If (LAST > 0)
	set strengthstrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength,10,3)

elseIf (SECOND > 0 and LAST = 0)
	set strengthstrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength,10,2)

elseIf (FIRST > 0 and SECOND > 0 and LAST = 0)
	set strengthstrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength,10,2)


elseIf (FIRST > 0 and SECOND = 0 and LAST = 0)
	set strengthstrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength,10,1)
	

else set strengthstrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength)

endif

Set oen_reply->MFNZFM_GROUP [1]->ZFM [1]->strength = strengthstrg


/*****************************Correct Precision for Volume*************/

set LASTV = 0
set SECONDV = 0
set FIRSTV = 0

set LASTV = cnvtint(substring(10,1,volumestrg))
   if(LASTV > 0)
	set LASTV = 3
	else
	set LASTV = 0
  endif


set SECONDV = cnvtint(substring(9,1,volumestrg))
   if(SECONDV > 0)
	set SECONDV = 2
	else
	set SECONDV = 0
  endif

set FIRSTV = cnvtint(substring(8,1,volumestrg))
   if(FIRSTV > 0)
	set FIRSTV = 1
	else
	set FIRSTV = 0
  endif

If (LASTV > 0)
	set volumestrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume,10,3)

elseIf (SECONDV > 0 and LASTV = 0)
	set volumestrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume,8,2)
	
elseIf (FIRSTV > 0 and SECONDV > 0 and LASTV = 0)
	set volumestrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume,8,2)
	
elseIf (FIRSTV > 0 and SECONDV = 0 and LASTV = 0)
	set volumestrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume,8,1)
else
set volumestrg = cnvtstring(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume)

	
endif
 
Set oen_reply->MFNZFM_GROUP [1]->ZFM [1]->volume = volumestrg




;;;;;;;;;;;;Filter for Med Identifiers that begin with "ZZZ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;Removed filter per Ira 2/6/2013;;;;;;;;;;;;;;
;;;Declare altmedid = vc
;;;Declare xxmed = i4
;;;Declare xxmed2 = i4

;;;set altmedid = oen_reply->MFNZFM_GROUP [1]->ZFM [1]->alternate_item_id2->identifier 
;;;set xxmed2 = findstring("xxx",altmedid,1)
;;;set xxmed = findstring("XXX",altmedid,1)

;;;if (xxmed > 0)
 ;;;       set oenStatus->ignore = 1
;;;endif

;;;if (xxmed2 > 0)

      ;;;  set oenStatus->ignore = 1
;;;endif