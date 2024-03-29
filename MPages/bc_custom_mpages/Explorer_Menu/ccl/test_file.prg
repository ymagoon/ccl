drop program bc_vdo_test go
create program bc_vdo_test

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV


Record Folder
(	
	1 iCount = i4
	1 Folder[*]
		2 ID = f8
		2 DESC = vc	
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
where pr.person_id =5521696.00;   5521696.00 ; 7455162.00 ; 5521696.00
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
	Folder->Folder[cnt].DESC = master.item_desc

Head child.menu_id

	if (child.menu_id > 0.0 and child.item_desc > " ")
		cnt = cnt + 1
		Folder->Folder[cnt].ID = child.menu_id
		Folder->Folder[cnt].DESC = child.item_desc
	endif
Head child2.menu_id

	if (child2.menu_id > 0.0 and child2.item_desc > " ")
		cnt = cnt + 1
	
		Folder->Folder[cnt].ID = child2.menu_id
		Folder->Folder[cnt].DESC = child2.item_desc
	endif
	
foot report
		Folder->iCount = cnt
		stat = alterlist(Folder->Folder, Folder->iCount)
		
		
	
call echorecord(Folder)
end
go

