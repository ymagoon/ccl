drop program bc_vdo_ExploreMenu_MP go
create program bc_vdo_ExploreMenu_MP

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV



/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/

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


;    Your Code Goes Here


/* get the top level folder */

select distinct into "nl:"
	ID = em.menu_id, em.menu_parent_id, Item = em.item_name, desc = em.item_desc, iType = em.item_type

from 
explorer_menu em
where em.active_ind  = 1
	  
ORDER BY EM.item_desc

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

with maxrec = 1200


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

