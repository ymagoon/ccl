drop program avh_cust_expired_orders go
create program avh_cust_expired_orders
 
record temp (
  1 disc_ords[*]
    2 order_id		   		= f8
    2 catalog_cd 	   		= f8
    2 order_dt_tm	  		= dq8
)
 
record orders (
  1 qual[9]
    2 catalog_cd 		    = f8
    2 synonym_id			= f8
)
 
record data (
  1 prsnl_id		        = f8
  1 relationship	        = vc
  1 cauti_alert				= i2
  1 clabsi_alert			= i2
  1 map[3]
    2 orders[3]
      3 display			    = vc
      3 catalog_cd			= f8
      3 synonym_id			= f8
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
    2 indication_ind   	 	= i2
    2 type			   	 	= vc
 
    2 cur_time		    	= dq8
    2 min_diff          	= i2
    2 hr_diff           	= i2
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
;set do_picc = uar_get_code_by("DISPLAYKEY",200,"PERIPHERALIVDISCONTINUE") ;;;fix me
 
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
  and ocs.mnemonic_type_cd = primary_synonym ;value(uar_get_code_by("MEANING",6011,"PRIMARY"))
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
    and cv.code_set in (100126, 100145, 100190)
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
  diff_min = datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3),4)
head o.order_id
  if ((o.catalog_cd in (io_arterial_line
  				      , io_central_venous
  				      , io_urinary_cath
  				      , co_arterial_line
  				      , co_central_venous
  				      , co_urinary_cath
  				      )
        and o.order_status_cd = ordered_cd
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
    data->orders[oCnt].min_diff = datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3),4)
    data->orders[oCnt].hr_diff = datetimediff(od.oe_field_dt_tm_value,cnvtdatetime(curdate,curtime3),3)
  endif
 
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
detail
  if (oCnt > 0)
    if (o.catalog_cd in (co_arterial_line, co_central_venous, co_urinary_cath))
      if (od.oe_field_meaning = "STOPDTTM")
        data->orders[oCnt].stop_dt_tm = format(od.oe_field_dt_tm_value, "MM/DD/YY HH:MM;;d")
      endif
      
      if (od.oe_field_id in (28523135, 31159129)) ; Urinary Cath Indication / Central Line Indications
        data->orders[oCnt].indication_cd = od.oe_field_value
      endif
    endif
  endif
 
foot report
  stat = alterlist(data->orders, oCnt)
  stat = alterlist(temp->disc_ords,dcCnt)
with nocounter
 
 
set dc_sz = size(temp->disc_ords,5)
 
/*
 1. Loop through discontinue orders (if there are any)
 2. Find insert/care catalog_cd's in the map
 3. Loop through orders to find insert/care orders placed before discontinue order
 4. Remove orders from data->orders
 5. Remove dynamic group indicator
*/
 
if (curqual > 0 and dc_sz > 0)
  for (i = 1 to dc_sz)
    set pos = locateval(idx, 1, size(data->map,5), temp->disc_ords[i].catalog_cd, data->map[idx].orders[3].catalog_cd)
 
    if (pos > 0)
      set insert_order = data->map[pos].orders.catalog_cd
      set care_order = data->map[pos].orders[2].catalog_cd
 
      set j = 1
      while (j > 0)
        if (data->orders[j].catalog_cd in (insert_order, care_order))
          if (data->orders[j].orig_order_dt_tm < temp->disc_ords[i].order_dt_tm)
            call echo(build("Removing index ", j, " from data->orders"))
            set stat = alterlist(data->orders, size(data->orders,5) - 1, j - 1)
            
            call echo("Setting dynamic group indicator to 0")
            set data->map[pos].dynamic_label.exist_ind = 0 
            
            set j = j - 1
          endif
        endif
 
        if (j = size(data->orders,5))
          set j = 0
        else
          set j = j + 1
        endif
      endwhile
    endif
  endfor
;else
;  call echo("setting retval = 0")
;  set retval = 0
;  set log_message = "No care orders found; or all orders that are active have a corresponding discontinue order"
;  go to exit_script
endif

if (data->map.dynamic_label.exist_ind = 0 
	and data->map[2].dynamic_label.exist_ind = 0 
	and data->map[3].dynamic_label.exist_ind = 0)
	
  call echo("setting retval = 0")
  set retval = 0
  set log_message = "No dynamic group found; this rule will only fire if a dynamic group exists on patient"
  go to exit_script
endif
 
/********************************************************
 * Determine whether Nurse is Missing Documentation     *
 ********************************************************/
 
if (data->map[3].dynamic_label.exist_ind = 1)
  set find_order = 0
  
  for (idx = 1 to size(data->orders,5))
    if (data->orders[idx].catalog_cd = co_urinary_cath)
      if (data->map[3].dynamic_label.create_dt_tm > data->orders[idx].orig_order_dt_tm)
        set data->cauti_alert = 1
      endif
    endif
  endfor
elseif (data->map[2].dynamic_label.exist_ind = 1)
  set find_order = 0

  for (idx = 1 to size(data->orders,5))
    if (data->orders[idx].catalog_cd = co_central_venous)
      if (data->map[2].dynamic_label.create_dt_tm > data->orders[idx].orig_order_dt_tm)
        set data->clabsi_alert = 1
      endif
    endif
  endfor
endif
 /*
for (idx = 1 to size(data->orders,5))
  if (data->orders[idx].catalog_cd = co_urinary_cath)
    if ((data->map[3].dynamic_label.exist_ind = 1 and data->orders[idx].orig_order_dt_tm > data->map[3].dynamic_label.create_dt_tm)
      or (data->map[3].dynamic_label.exist_ind = 0))
        set data->cauti_alert = 1
    endif
 
  elseif (data->orders[idx].catalog_cd = co_central_venous)
    if ((data->map[2].dynamic_label.exist_ind = 1 and data->orders[idx].orig_order_dt_tm > data->map[2].dynamic_label.create_dt_tm)
      or (data->map[2].dynamic_label.exist_ind = 0))
        set data->clabsi_alert = 1
    endif
  endif
endfor 
 */
set retval = 100
set log_misc1 = cnvtrectojson(data,9,1)
call echo(cnvtrectojson(data,9,1))
set log_message = "Ran successfully"
 
#exit_script
 
call echorecord(data)
call echorecord(temp)
;call echorecord(eksdata,"eksdata2.dat")
 
end
go
 
; execute avh_cust_expired_orders 12968065.00, 116979875 go ;nurseone
; execute avh_cust_expired_orders 14127163, 117828018 go
 execute avh_cust_expired_orders 14127204, 117828048 go ;avhtest, ipten             
; execute avh_cust_expired_orders 14127195, 117828036 go ;avhtest, ipsix              
