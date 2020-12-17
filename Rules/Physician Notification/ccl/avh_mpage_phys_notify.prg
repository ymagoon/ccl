/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  avh_mpage_phys_notify
 *
 *  Description:  Script used by the BCC_PHYS_OC_CUSTOM rule in an EKS_EXEC_CCL_L template. 
 *				  This script calculate a number of scenarios regarding urinary catheter, central line
 * 				  and arterial line orders and returns recommended orders that need to be placed or
 *  			  continued to the front-end. 
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Contact:    ymagoon@gmail.com
 *  Creation Date:  11/18/2020
 *
 *  Testing: execute avh_mpage_phys_notify <person_id>, <encntr_id> go 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  001    11/18/20  Yitzhak Magoon   Init release
 *  ---------------------------------------------------------------------------------------------
*/

drop program avh_mpage_phys_notify go
create program avh_mpage_phys_notify
 
free record temp
record temp (
  1 disc_ords[*]
    2 order_id		   		= f8
    2 catalog_cd 	   		= f8
    2 order_dt_tm	  		= dq8
)

free record orders
record orders (
  1 qual[9]
    2 catalog_cd 		    = f8
    2 synonym_id			= f8
)

free record data
record data (
  1 prsnl_id		        = f8
  1 arterial_msg_flag		= i2
  1 urinary_msg_flag		= i2
  1 central_venous_msg_flag = i2
  1 map[3]
    2 orders[3]
      3 display			    = vc
      3 catalog_cd			= f8
      3 synonym_id			= f8
      3 active_care_ind		= i2
      3 order_sentences[*]
        4 indication	    = vc
        4 order_sentence_id = f8
        4 code_value		= f8
    2 dynamic_label[1]
      3 exist_ind			= i2
      3 create_dt_tm		= dq8
      3 display				= vc
  1 orders[*]
    2 order_id 		    	= f8
    2 order_sentence_id		= f8
    2 indication_cd 		= f8
    2 order_mnemonic    	= vc
    2 catalog_cd       		= f8
    2 clin_display      	= vc
    2 order_phys	   		= vc
    2 orig_order_dt_tm 	 	= dq8
    2 order_dt_tm      	 	= vc
    2 start_dt_tm      	 	= vc
    2 stop_dt_tm       	 	= vc
    2 expires_in	   	 	= i2
    2 missing_ind   	 	= i2
    2 type			   	 	= vc
 
    2 cur_time		    	= dq8
)

/****************************************
 * Variable Declaration                 *
 ****************************************/
 
set person_id = $1
set encntr_id = $2
 
declare primary_synonym = f8 with constant(uar_get_code_by("MEANING", 6011,"PRIMARY"))
 
declare idx           = i2
declare ordered_cd    = f8 with protect,constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare completed_cd  = f8 with protect,constant(uar_get_code_by("DISPLAYKEY",6004,"COMPLETED"))
declare disc_cd 	  = f8 with constant(uar_get_code_by("MEANING", 6004, "DISCONTINUED"))
 
;insertion orders
set io_arterial_line  =  uar_get_code_by("DISPLAYKEY",200,"ARTERIALLINEINSERTION")
set io_central_venous = uar_get_code_by("DISPLAYKEY",200,"CENTRALLINEINSERTION")
set io_urinary_cath   = uar_get_code_by("DISPLAYKEY",200,"URINARYCATHETERINSERTION")
;set io_picc = uar_get_code_by("DISPLAYKEY",200,"PICCLINEINSERTION")
 
;care orders
set co_arterial_line  = uar_get_code_by("DISPLAYKEY",200,"ARTERIALLINECARE")
set co_central_venous = uar_get_code_by("DISPLAYKEY",200,"CENTRALVENOUSCATHETERCARE")
set co_urinary_cath   = uar_get_code_by("DISPLAYKEY",200,"URINARYCATHETERCARE")
;set co_picc = uar_get_code_by("DISPLAYKEY",200,"PICCLINECARE")
 
;discontinue orders
set do_arterial_line  = uar_get_code_by("DISPLAYKEY",200,"ARTERIALLINEDISCONTINUE")
set do_central_venous = uar_get_code_by("DISPLAYKEY",200,"CENTRALVENOUSCATHETERDISCONTINUE")
set do_urinary_cath   = uar_get_code_by("DISPLAYKEY",200,"URINARYCATHETERDISCONTINUE")
;set do_picc = uar_get_code_by("DISPLAYKEY",200,"PERIPHERALIVDISCONTINUE")

;most recent indications if care order is complete
declare in_arterial_line = f8
declare in_central_venous = f8
declare in_urinary_cath = f8
declare in_arterial_time = dq8
declare in_central_time = dq8
declare in_urinary_time = dq8

set admit_phys_cd     = uar_get_code_by("MEANING",333,"ADMITDOC")
set attend_phys_cd    = uar_get_code_by("MEANING",333,"ATTENDDOC")
 
;dynamic label templates
set active_label = uar_get_code_by("MEANING",4002015,"ACTIVE")
 
set dl_urinary  = 28030753
set dl_central  = 34441291
set dl_arterial = 16863173
 
/****************************************
 * Populate Record Structure            *
 ****************************************/
 
set data->prsnl_id = reqinfo->updt_id
 
;default existance to false
set data->map.dynamic_label.exist_ind = 0
set data->map[2].dynamic_label.exist_ind = 0
set data->map[3].dynamic_label.exist_ind = 0
 
;position 1 of map is Arterial
set data->map.orders.catalog_cd = io_arterial_line
set data->map.orders[2].catalog_cd = co_arterial_line
set data->map.orders[3].catalog_cd = do_arterial_line
 
;position 2 of map is Central Venous
set data->map[2].orders.catalog_cd = io_central_venous
set data->map[2].orders[2].catalog_cd = co_central_venous
set data->map[2].orders[3].catalog_cd = do_central_venous
;set data->map[2].display = "Central Venous"
 
;position 3 of map is Urinary Catheter
set data->map[3].orders.catalog_cd = io_urinary_cath
set data->map[3].orders[2].catalog_cd = co_urinary_cath
set data->map[3].orders[3].catalog_cd = do_urinary_cath
;set data->map[3].display = "Urinary Catheter"
 
set orders->qual[1].catalog_cd = io_arterial_line
set orders->qual[2].catalog_cd = co_arterial_line
set orders->qual[3].catalog_cd = do_arterial_line
set orders->qual[4].catalog_cd = io_central_venous
set orders->qual[5].catalog_cd = co_central_venous
set orders->qual[6].catalog_cd = do_central_venous
set orders->qual[7].catalog_cd = io_urinary_cath
set orders->qual[8].catalog_cd = co_urinary_cath
set orders->qual[9].catalog_cd = do_urinary_cath
 
/****************************************
 * Gather Synonym IDs                   *
 ****************************************/
 
select into "nl:"
from
  order_catalog_synonym ocs
where expand(idx, 1, size(orders->qual,5), ocs.catalog_cd, orders->qual[idx].catalog_cd)
  and ocs.mnemonic_type_cd = primary_synonym
detail
  if (ocs.catalog_cd in (io_arterial_line
  						 , co_arterial_line
  						 , do_arterial_line))
 
    pos = locateval(idx, 1, size(data->map.orders,5), ocs.catalog_cd, data->map.orders[idx].catalog_cd)
    data->map.orders[pos].synonym_id = ocs.synonym_id
    data->map.orders[pos].display = uar_get_code_display(ocs.catalog_cd)
 
  elseif (ocs.catalog_cd in (io_central_venous
  							 , co_central_venous
  							 , do_central_venous))
 
    pos = locateval(idx, 1, size(data->map[2].orders,5), ocs.catalog_cd, data->map[2].orders[idx].catalog_cd)
    data->map[2].orders[pos].synonym_id = ocs.synonym_id
    data->map[2].orders[pos].display = uar_get_code_display(ocs.catalog_cd)
 
  elseif (ocs.catalog_cd in (io_urinary_cath
  					         , co_urinary_cath
  					         , do_urinary_cath))
 
    pos = locateval(idx, 1, size(data->map[3].orders,5), ocs.catalog_cd, data->map[3].orders[idx].catalog_cd)
    data->map[3].orders[pos].synonym_id = ocs.synonym_id
    data->map[3].orders[pos].display = uar_get_code_display(ocs.catalog_cd)
 
  endif
 
  pos2 = locateval(idx, 1, size(orders->qual,5), ocs.catalog_cd, orders->qual[idx].catalog_cd)
  orders->qual[pos2].synonym_id = ocs.synonym_id
with nocounter
  
/***********************************************
 * Gather Synonym IDs & Order Sentences        *
 ***********************************************/
 
select into "nl:"
from
  order_catalog_synonym ocs
  , order_sentence os
  , order_sentence_detail osd
  , code_value cv
plan ocs
  where expand(idx, 1, size(orders->qual,5), ocs.catalog_cd, orders->qual[idx].catalog_cd)
    and ocs.mnemonic_type_cd = primary_synonym
join os
  where os.parent_entity_id = ocs.synonym_id
    and os.parent_entity_name = "ORDER_CATALOG_SYNONYM"
    and os.parent_entity2_id = 0
join osd
  where osd.order_sentence_id = os.order_sentence_id
    and osd.default_parent_entity_name = "CODE_VALUE"
join cv
  where osd.default_parent_entity_id = cv.code_value
    and cv.code_set in (100363, 100145, 100190)
    and cv.active_ind = 1
order by
  ocs.catalog_cd
  , cv.collation_seq
head ocs.synonym_id
  if (ocs.catalog_cd = io_arterial_line)
    map_idx = 1
    ord_idx = 1
  elseif (ocs.catalog_cd = co_arterial_line)
    map_idx = 1
    ord_idx = 2
  elseif (ocs.catalog_cd = do_arterial_line)
    map_idx = 1
    ord_idx = 3
  elseif (ocs.catalog_cd = io_central_venous)
    map_idx = 2
    ord_idx = 1
  elseif (ocs.catalog_cd = co_central_venous)
    map_idx = 2
    ord_idx = 2
  elseif (ocs.catalog_cd = do_central_venous)
    map_idx = 2
    ord_idx = 3
  elseif (ocs.catalog_cd = io_urinary_cath)
    map_idx = 3
    ord_idx = 1
  elseif (ocs.catalog_cd = co_urinary_cath)
    map_idx = 3
    ord_idx = 2
  elseif (ocs.catalog_cd = do_urinary_cath)
    map_idx = 3
    ord_idx = 3
  endif
 
  data->map[map_idx].orders[ord_idx].synonym_id = ocs.synonym_id
  os_cnt = 0
detail
  os_cnt = os_cnt + 1
 
  if (mod(os_cnt,10) = 1)
    stat = alterlist(data->map[map_idx].orders[ord_idx].order_sentences, os_cnt + 10)
  endif
 
  data->map[map_idx].orders[ord_idx].order_sentences[os_cnt].indication = cv.display
  data->map[map_idx].orders[ord_idx].order_sentences[os_cnt].order_sentence_id = os.order_sentence_id
  data->map[map_idx].orders[ord_idx].order_sentences[os_cnt].code_value = osd.default_parent_entity_id
foot ocs.synonym_id
  stat = alterlist(data->map[map_idx].orders[ord_idx].order_sentences, os_cnt)
with nocounter
 
/****************************************
 * Gather Active Dynamic Labels         *
 ****************************************/
 
select into "nl:"
from
  ce_dynamic_label c
where c.person_id = person_id
  and c.label_status_cd = active_label
  and c.label_template_id in (dl_urinary, dl_central, dl_arterial)
  and c.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
detail
  if (c.label_template_id = dl_arterial)
    data->map.dynamic_label.exist_ind = 1
    data->map.dynamic_label.create_dt_tm = c.create_dt_tm
    data->map.dynamic_label.display = "Arterial"
  elseif (c.label_template_id = dl_central)
    data->map[2].dynamic_label.exist_ind = 1
    data->map[2].dynamic_label.create_dt_tm = c.create_dt_tm
    data->map[2].dynamic_label.display = "Central Venous"
  elseif (c.label_template_id = dl_urinary)
    if (c.label_name not in ("Condom*", "Purewick*"))
      data->map[3].dynamic_label.exist_ind = 1
      data->map[3].dynamic_label.create_dt_tm = c.create_dt_tm
      data->map[3].dynamic_label.display = "Urinary Catheter"
    endif
  endif
with nocounter
 
/****************************************
 * Gather List of Orders on Patient     *
 ****************************************/
 
select into "nl:"
from
  orders o
  , order_action oa
  , prsnl p
  , order_detail od
plan o
  where o.person_id = person_id
    and o.encntr_id = encntr_id
    and o.order_status_cd in (ordered_cd, completed_cd, disc_cd)
    and o.orig_ord_as_flag = 0
    and o.template_order_flag in (0,1)
    and expand(idx, 1, size(orders->qual,5), o.catalog_cd, orders->qual[idx].catalog_cd)
join oa
  where oa.order_id = o.order_id
    and oa.action_sequence = o.last_action_sequence
join p
  where p.person_id = oa.order_provider_id
join od
  where od.order_id = o.order_id
;    and od.oe_field_meaning = "STOPDTTM"
    ;orders that expire in 12 hours and have expired 4 hours ago
;    and datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3))*24*60 > -240
;    and datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3))*24*60 < 720
order by
  o.order_id
  , od.action_sequence desc
head report
  oCnt = 0
  dcCnt = 0
head o.order_id
  call echo(build("catalogCd=",uar_get_code_display(o.catalog_cd)))
  ;handle insert orders
  if ((o.catalog_cd in (io_arterial_line, io_central_venous, io_urinary_cath)
        and o.order_status_cd in (ordered_cd, completed_cd)
      ))
 
    oCnt = oCnt + 1
 
    if (mod(oCnt,10) = 1)
      stat = alterlist(data->orders, oCnt + 10)
    endif
 
    data->orders[oCnt].order_id = o.order_id
    data->orders[oCnt].catalog_cd = o.catalog_cd
    data->orders[oCnt].order_mnemonic = o.hna_order_mnemonic
    data->orders[oCnt].clin_display = o.clinical_display_line
    data->orders[oCnt].order_phys = p.name_full_formatted
    data->orders[oCnt].orig_order_dt_tm = o.orig_order_dt_tm
    data->orders[oCnt].type = "insert"
 
    ;;;add time in here because we only want to look at orders that will expire within 12hr
    if (o.catalog_cd in (co_arterial_line, co_central_venous, co_urinary_cath))
      data->orders[oCnt].order_dt_tm = format(o.orig_order_dt_tm, "MM/DD/YY HH:MM;;d")
      data->orders[oCnt].start_dt_tm = format(o.current_start_dt_tm, "MM/DD/YY HH:MM;;d")
      data->orders[oCnt].expires_in = datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3),4) ;;;dbl check accuracy
      data->orders[oCnt].type = "care"
    endif
 
    data->orders[oCnt].cur_time = cnvtdatetime(curdate,curtime3)
  endif
  
  ;handle care orders
  if (o.catalog_cd in (co_arterial_line,co_central_venous,co_urinary_cath) and o.order_status_cd in (ordered_cd))
    call echo('inside care order if statement')
    
    
    oCnt = oCnt + 1
    
    call echo(build("oCnt in care order=",oCnt))
 
    if (oCnt > size(data->orders,5))
      stat = alterlist(data->orders, oCnt + 10)
    endif
 
    data->orders[oCnt].order_id = o.order_id
    data->orders[oCnt].catalog_cd = o.catalog_cd
    data->orders[oCnt].order_mnemonic = o.hna_order_mnemonic
    data->orders[oCnt].clin_display = o.clinical_display_line
    data->orders[oCnt].order_phys = p.name_full_formatted
    data->orders[oCnt].orig_order_dt_tm = o.orig_order_dt_tm
    data->orders[oCnt].order_dt_tm = format(o.orig_order_dt_tm, "MM/DD/YY HH:MM;;d")
    data->orders[oCnt].type = "care"
    
    data->orders[oCnt].start_dt_tm = format(o.current_start_dt_tm, "MM/DD/YY HH:MM;;d")
    data->orders[oCnt].cur_time = cnvtdatetime(curdate,curtime3)
  endif
  
  ;handle discontinue orders
  if (o.catalog_cd in (do_arterial_line, do_central_venous, do_urinary_cath))
    /*
      The map is used to connect the insertion, care, and discontinue orders together. Finding the position of the discontinue
      order in the map finds the corresponding insertion and care orders. The corresponding position in data->dynamic_label is
      also the same.
    */
    
    pos = locateval(idx, 1, size(data->map,5), o.catalog_cd, data->map[idx].orders[3].catalog_cd)
 
    if (pos > 0)
      ;make sure corresponding dynamic label exists and is created before discontinue order was placed
      if (data->map[pos].dynamic_label.exist_ind = 1 and o.orig_order_dt_tm > data->map[pos].dynamic_label.create_dt_tm)
        dcCnt = dcCnt + 1
 
        if (mod(dcCnt,10) = 1)
          stat = alterlist(temp->disc_ords, dcCnt + 10)
        endif
 
 		;store all discontinue orders in temp
        temp->disc_ords[dcCnt].order_id = o.order_id
        temp->disc_ords[dcCnt].catalog_cd = o.catalog_cd
        temp->disc_ords[dcCnt].order_dt_tm = o.orig_order_dt_tm
      endif
    endif
  endif
  
  call echo(build("oCnt from head=",oCnt))
  ignore = 0 ;if we are ignoring care order, set flag to 1
detail
  if (oCnt > 0)
    if (o.catalog_cd in (co_arterial_line, co_central_venous, co_urinary_cath))
      call echo('inside catalog_cd in care order')

      if (od.oe_field_meaning = "STOPDTTM")
        call echo('setting stopdttime in detail secton')
        
        
        min_diff = datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3),4)
        
        call echo(build("min_diff=",min_diff))
        
        data->orders[oCnt].stop_dt_tm = format(od.oe_field_dt_tm_value, "MM/DD/YY HH:MM;;d")
        data->orders[oCnt].expires_in = min_diff
        
        ;if the care order that is active, we don't want to display an alert
        if (min_diff > 720)
          if (o.catalog_cd = co_arterial_line)
            data->map.orders[2].active_care_ind = 1
          elseif (o.catalog_cd = co_central_venous)
            data->map[2].orders[2].active_care_ind = 1
          elseif (o.catalog_cd = co_urinary_cath)
            data->map[3].orders[2].active_care_ind = 1
          endif
          
          ;remove order and reset oCnt
          oCnt = oCnt - 1
          stat = alterlist(data->orders, oCnt)
          ignore = 1
          
          call echo(build("ignore=",ignore))
          call echo(build("oCnt after detail=",oCnt))
        endif
      endif
      
      if (od.oe_field_id in (28523135, 31159129, 26492559) and ignore = 0) ; Urinary Cath / Central Line / Arterial Line Indication
        call echo('inside oe_field_id')
        data->orders[oCnt].indication_cd = od.oe_field_value
        
        if (od.oe_field_id = 26492559 and o.orig_order_dt_tm > in_arterial_time)
          in_arterial_line = od.oe_field_value
        elseif (od.oe_field_id = 31159129 and o.orig_order_dt_tm > in_central_time)
          in_central_venous = od.oe_field_value
        elseif (od.oe_field_id = 28523135 and o.orig_order_dt_tm > in_urinary_time)
          in_urinary_cath = od.oe_field_value
        endif        
        
      endif
    endif
  endif
 
foot report
  stat = alterlist(data->orders, oCnt)
  stat = alterlist(temp->disc_ords,dcCnt)
with nocounter

call echo(build("in_arterial_line=",in_arterial_line))
call echo(build("in_central_venous=",in_central_venous))
call echo(build("in_urinary_cath=",in_urinary_cath))

call echorecord(data)

/****************************************
 * Modify record structure              *
 ****************************************
 *
 * 1. Loop through discontinue orders (if there are any)
 * 2. Find insert/care catalog_cd's in the map
 * 3. Loop through orders to find insert/care orders placed before discontinue order
 * 4. Remove orders from data->orders
 * 5. Remove dynamic group indicator
 *
 ****************************************/

set dc_sz = size(temp->disc_ords,5)
 
if (curqual > 0 and dc_sz > 0)
  ;loop through all discontinue orders on the patient
  for (i = 1 to dc_sz)
    set pos = locateval(idx, 1, size(data->map,5), temp->disc_ords[i].catalog_cd, data->map[idx].orders[3].catalog_cd)
   
    ;find corresponding insert / care orders matching discontinue order
    if (pos > 0)
      set insert_order = data->map[pos].orders.catalog_cd
      set care_order = data->map[pos].orders[2].catalog_cd
      
      ;loop through all order(s), if there are any, and remove any insert / care orders. Also, update dynamic label
      if (size(data->orders,5) > 0)      
        set j = 1
        while (j > 0)
          if (data->orders[j].catalog_cd in (insert_order, care_order))
            if (data->orders[j].orig_order_dt_tm < temp->disc_ords[i].order_dt_tm)
              set stat = alterlist(data->orders, size(data->orders,5) - 1, j - 1)
              
              ;remove dynamic label indicator if discontinue order was placed after it
              if (data->map[pos].dynamic_label.create_dt_tm < temp->disc_ords[i].order_dt_tm)
                call echo("Setting dynamic group indicator to 0")
                set data->map[pos].dynamic_label.exist_ind = 0
              endif
            
              set j = j - 1
            endif
          endif
          
          ;if no care or insert orders exist, still need to turn off the dynamic group
          if (data->map[pos].dynamic_label.create_dt_tm < temp->disc_ords[i].order_dt_tm)
            call echo("Setting dynamic group indicator to 0")
            set data->map[pos].dynamic_label.exist_ind = 0
          endif
          
 
          if (j = size(data->orders,5))
            set j = 0
          else
            set j = j + 1
          endif
        endwhile
      else
        ;if no insert / care orders exist, compare dynamic label to discontinue order
		if (data->map[pos].dynamic_label.create_dt_tm < temp->disc_ords[i].order_dt_tm)
		  call echo("Setting dynamic group indicator to 0")
          set data->map[pos].dynamic_label.exist_ind = 0
		endif
      endif ;end size(data->orders,5) > 0
    endif ;end if (pos > 0) 
  endfor
endif

if (data->map.dynamic_label.exist_ind = 0 
	and data->map[2].dynamic_label.exist_ind = 0 
	and data->map[3].dynamic_label.exist_ind = 0)
	
  call echo("setting retval = 0")
  set retval = 0
  set log_message = "No dynamic group found; this rule will only fire if a dynamic group exists on patient"
  go to exit_script
endif
 
/***********************************************************************
 * Set msg header flags and build insert / care orders if missing      *
 ***********************************************************************/
;Urinary Cath
if (data->map[3].dynamic_label.exist_ind = 1)
  set find_care_order = 0
  set find_insert_order = 0
  declare indication_cd = f8
  
  call echo("inside urinary cath dynamic label...")
  
  for (idx = 1 to size(data->orders,5))
    call echo(build("idx=",idx))
    if (data->orders[idx].catalog_cd = co_urinary_cath and data->map[3].orders[2].active_care_ind = 0 and find_insert_order = 0)
      call echo(build("inside urinary cath care"))
      
      if (data->orders[idx].indication_cd > 0)
        set indication_cd = data->orders[idx].indication_cd
      endif
      
      set find_care_order = 1
      set data->urinary_msg_flag = 1
    endif
    
    if (data->orders[idx].catalog_cd = io_urinary_cath)
      call echo(build("inside urinary cath insert"))
      
      if (data->orders[idx].indication_cd > 0)
        set indication_cd = data->orders[idx].indication_cd
      endif
      
      set find_insert_order = 1
      set data->urinary_msg_flag = 1
    endif
  endfor
  
  call echo(build("find_care_order=",find_care_order))
  call echo(build("find_insert_order=",find_insert_order))
  
  if (find_care_order = 0 and find_insert_order = 1)
    call echo('inside - display care order')
    ;build new order
    set pos = size(data->orders,5) + 1
    set stat = alterlist(data->orders, pos)
    
    set data->orders[pos].order_mnemonic = data->map[3].orders[2].display
    set data->orders[pos].type = "care"
    set data->orders[pos].catalog_cd = co_urinary_cath
    set data->orders[pos].indication_cd = indication_cd
    set data->orders[pos].missing_ind = 1
    
    set data->urinary_msg_flag = 1
  elseif (find_insert_order = 0)
    ;build new order
    set pos = size(data->orders,5) + 1
    set stat = alterlist(data->orders, pos)
    
    set data->orders[pos].order_mnemonic = data->map[3].orders.display
    set data->orders[pos].type = "care"
    set data->orders[pos].catalog_cd = io_urinary_cath
    set data->orders[pos].indication_cd = in_urinary_cath
    set data->orders[pos].missing_ind = 1
    
    set data->urinary_msg_flag = 2    
  endif
  
  if (find_insert_order = 1 and data->map[3].orders[2].active_care_ind = 1)
    set data->map[3].dynamic_label.exist_ind = 0
  endif
endif ;end cauti logic

;Central Venous 
if (data->map[2].dynamic_label.exist_ind = 1)
  set find_order = 0

  if (data->map[2].orders[2].active_care_ind = 0)
    for (idx = 1 to size(data->orders,5))
      if (data->orders[idx].catalog_cd = co_central_venous)
        set find_order = 1
        set data->central_venous_msg_flag = 1
      endif
    endfor
  
    if (find_order = 0)   
      ;build new order
      set pos = size(data->orders,5) + 1
      set stat = alterlist(data->orders, pos)
    
      set data->orders[pos].order_mnemonic = data->map[2].orders[2].display
      set data->orders[pos].type = "care"
      set data->orders[pos].catalog_cd = co_central_venous
      set data->orders[pos].indication_cd = in_central_venous
      set data->orders[pos].missing_ind = 1

      set data->central_venous_msg_flag = 2
    endif
  else
    set data->map[2].dynamic_label.exist_ind = 0
  endif
endif ;end clabsi logic

;Arterial
if (data->map.dynamic_label.exist_ind = 1)
  set find_order = 0
  
  if (data->map.orders[2].active_care_ind = 0)
    for (idx = 1 to size(data->orders,5))
      if (data->orders[idx].catalog_cd = co_arterial_line)
        set find_order = 1
        set data->arterial_msg_flag = 1
      endif
    endfor
  
    if (find_order = 0)   
      ;build new order
      set pos = size(data->orders,5) + 1
      set stat = alterlist(data->orders, pos)
    
      set data->orders[pos].order_mnemonic = data->map.orders[2].display
      set data->orders[pos].type = "care"
      set data->orders[pos].catalog_cd = co_arterial_line
      set data->orders[pos].indication_cd = in_arterial_line
      set data->orders[pos].missing_ind = 1

      set data->arterial_msg_flag = 2
    endif
  else
    set data->map.dynamic_label.exist_ind = 0
  endif
endif ;end clabsi logic

if (data->map.dynamic_label.exist_ind = 0 
	and data->map[2].dynamic_label.exist_ind = 0 
	and data->map[3].dynamic_label.exist_ind = 0)
	call echo('inside silly if statement')
  call echo("setting retval = 0")
  set retval = 0
  set log_message = "No dynamic group found; this rule will only fire if a dynamic group exists on patient"
  go to exit_script
endif

call echo('setting reval=100')
set retval = 100
set log_misc1 = cnvtrectojson(data,9,1)
call echo(cnvtrectojson(data,9,1))

set log_message = "Ran successfully"

#exit_script
 
call echorecord(data)
call echorecord(temp)
call echorecord(orders)

call echo(build("arterial=",data->map.dynamic_label.exist_ind))
call echo(build("central=",data->map[2].dynamic_label.exist_ind))
call echo(build("urinary=",data->map[3].dynamic_label.exist_ind))
 
end
go
 
;execute avh_mpage_phys_notify 14274774, 118097813  go  ;avhtest, physicianone
;execute avh_mpage_phys_notify 14274762, 118097789  go ;avhtest, nurseone
execute avh_mpage_phys_notify 14274778,118097822  go ;avhtest, labone

