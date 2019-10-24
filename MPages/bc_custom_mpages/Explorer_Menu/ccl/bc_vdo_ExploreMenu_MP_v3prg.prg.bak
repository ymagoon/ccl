drop program bc_vdo_ExploreMenu_MP go
create program bc_vdo_ExploreMenu_MP

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV, USER_ID



/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare personnelID = f8 with Protect
set personnelID = $USER_ID ;7455162.00
/**************************************************************
; DVDev Start Coding
**************************************************************/



Record EMemu
(	
	1 iCount = i4
	1 MasterFolder[*]
		2 ID = f8
		2 PARENT_ID = f8
		2 ITEM_TYPE = C1
		2 DESC = vc
		2 ITEM = c30

		
)

Record Folder
(	
	1 iCount = i4
	1 Folder[*]
		2 ID = f8
	;	2 DESC = vc	
)
 select distinct into "nl:" child.menu_id, child.item_desc,child2.menu_id, child2.item_desc
 from
 
	APPLICATION_GROUP   ag,
	 prsnl   pr,
	EXPLORER_MENU_SECURITY   ES,
 	 EXPLORER_MENU master,
 	  EXPLORER_MENU child,
 	 EXPLORER_MENU child2
 	 
 plan  pr
where pr.person_id = personnelID;   5521696.00 ; 7455162.00 ; 5521696.00
join ag
where pr.position_cd = ag.position_cd
join ES
	WHERE ES.app_group_cd = ag.app_group_cd
 join master
 where master.menu_id = es.menu_id
 	and master.menu_parent_id = 0.0 and master.item_desc = ".*" and master.item_type = "M"
 join child
 		 where outerjoin(master.menu_id)  = child.menu_parent_id and child.item_type = outerjoin("M")
 join child2
 			where outerjoin(child.menu_id) = child2.menu_parent_id and child2.item_type = outerjoin("M")
head report
	cnt = 0	

head master.menu_id

	 cnt = cnt + 1
	 
	 if (mod(cnt, 1000) = 1)
  		stat = alterlist(Folder->Folder, cnt + 999)
  	endif
	
  	
  	Folder->Folder[cnt].ID = master.menu_id
	;Folder->Folder[cnt].DESC = master.item_desc

Head child.menu_id

	if (child.menu_id > 0.0 and child.item_desc > " ")
		cnt = cnt + 1
		Folder->Folder[cnt].ID = child.menu_id
	;	Folder->Folder[cnt].DESC = child.item_desc
	endif
Head child2.menu_id

	if (child2.menu_id > 0.0 and child2.item_desc > " ")
		cnt = cnt + 1
	
		Folder->Folder[cnt].ID = child2.menu_id
	;	Folder->Folder[cnt].DESC = child2.item_desc
	endif
	
foot report
		Folder->iCount = cnt
		stat = alterlist(Folder->Folder, Folder->iCount)

;    Your Code Goes Here


/* get the top level folder */

SELECT DISTINCT INTO "NL:"
	ID = em.menu_id
	, em.menu_parent_id
	, Item = em.item_name
	, desc = em.item_desc
	, iType = em.item_type
;	, FOLDER_ID = FOLDER->Folder[D1.SEQ].ID

FROM
	EXPLORER_MENU   EM
	, (DUMMYT   D1  WITH SEQ = VALUE(SIZE(FOLDER->Folder, 5)))
Plan D1
JOIN EM
WHERE ((FOLDER->Folder[D1.SEQ].ID = EM.menu_parent_id) Or (EM.menu_id = FOLDER->Folder[D1.SEQ].ID))
		and em.active_ind = 1
	  

ORDER BY
	EM.item_desc

HEAD REPORT
	cnt = 0

DETAIL
	cnt = cnt + 1
  	if (mod(cnt, 10) = 1)
  		stat = alterlist(EMemu->MasterFolder, cnt + 9)
  	endif
  	
  	EMemu->MasterFolder[cnt].ID = em.menu_id
  	EMemu->MasterFolder[cnt].PARENT_ID = em.menu_parent_id
	EMemu->MasterFolder[cnt].ITEM = em.item_name
 	EMemu->MasterFolder[cnt].DESC = em.item_desc
 	EMemu->MasterFolder[cnt].ITEM_TYPE  = em.item_type

foot report

	EMemu->iCount = cnt
	stat = alterlist(EMemu->MasterFolder, EMemu->iCount)




/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
;Set Ememu->MasterFolder[1].test_output  = "Under Construction....Coming Soon... Summer 2012"
;call echorecord(Ememu)
;call echojson(Ememu, $OUTDEV)

set _Memory_Reply_String = cnvtrectojson(Ememu)

call echo(_Memory_Reply_String)
end
go

