 ;;Solution_Test/script/PathNet -- Gen Lab/glb_get_qc_by_filter_set/glb_get_qc_lot_to_date.inc Turn on black mode

;This include file will be used to load the results information for
;lot to date
declare LoadQCForLotToDate() = i2
subroutine LoadQCForLotToDate(null)

  declare lLotCnt           = i4 with protect, noconstant(0)

  record lots
  (
    1 qual[*]
      2 lot_id          = f8
      2 receive_dt_tm   = dq8
  )

  ;if the controls list is filled out, then load the lots for these controls
  if (lControlslist > 0)

    select into "nl:"
    from
      (dummyt d1 with seq = value(lControlslist)),
      control_lot cl
    plan d1
    join cl
      where cl.control_id = request->controls[d1.seq]->control_id
        and cnvtdatetime(curdate,curtime3) between cl.receive_dt_tm and
                                                    cl.expiration_dt_tm
    order by cl.lot_id
    head cl.lot_id
      lLotCnt = lLotCnt + 1
      if (lLotCnt > size(lots->qual, 5))
        nStat = alterlist(lots->qual, lLotCnt + 4)
      endif
      lots->qual[lLotCnt]->lot_id = cl.lot_id
      lots->qual[lLotCnt]->receive_dt_tm = cl.receive_dt_tm
    with nocounter

  ;if the test sites list is filled out, then load the lots for these test sites
  elseif (lTestSiteslist > 0)

    select into "nl:"
    from
      (dummyt d1 with seq = value(lTestSiteslist)),
      resource_lot_r rlr,
      control_lot cl
    plan d1
    join rlr
      where rlr.service_resource_cd = request->test_sites[d1.seq]->service_resource_cd
    join cl
      where cl.lot_id = rlr.lot_id
        and cnvtdatetime(curdate,curtime3) between cl.receive_dt_tm and
                                                   cl.expiration_dt_tm
    order by cl.lot_id
    head cl.lot_id
      lLotCnt = lLotCnt + 1
      if (lLotCnt > size(lots->qual, 5))
        nStat = alterlist(lots->qual, lLotCnt + 4)
      endif
      lots->qual[lLotCnt]->lot_id = cl.lot_id
      lots->qual[lLotCnt]->receive_dt_tm = cl.receive_dt_tm
    with nocounter

  ;if the assays list is filled out, then load the lots for these assays
  elseif (lProcedureslist > 0)

    select into "nl:"
    from
      (dummyt d1 with seq = value(lProcedureslist)),
      resource_assay_control rac,
      control_lot cl
    plan d1
    join rac
      where rac.task_assay_cd = request->procedures[d1.seq]->task_assay_cd
    join cl
      where cl.control_id = rac.control_id
        and cnvtdatetime(curdate,curtime3) between cl.receive_dt_tm and
                                                    cl.expiration_dt_tm
    order by cl.lot_id
    head cl.lot_id
      lLotCnt = lLotCnt + 1
      if (lLotCnt > size(lots->qual, 5))
        nStat = alterlist(lots->qual, lLotCnt + 4)
      endif
      lots->qual[lLotCnt]->lot_id = cl.lot_id
      lots->qual[lLotCnt]->receive_dt_tm = cl.receive_dt_tm
    with nocounter

  endif

  ;load the qc_results for the lots that were retrieved above
  if (lLotCnt > 0)
    set nStat = alterlist(lots->qual, lLotCnt)

    select into "nl:"
      apr_exists_ind = evaluate(nullind(apr.service_resource_cd), 0, 1, 0),
      qe1_exists_ind = evaluate(nullind(qe1.qc_result_id), 0, 1, 0),
      qe2_exists_ind = evaluate(nullind(qe2.qc_result_id), 0, 1, 0),
      qe3_exists_ind = evaluate(nullind(qe3.qc_result_id), 0, 1, 0)

    from
      (dummyt d3 with seq = value(lLotCnt)),
      qc_result qr,
      control_lot cl,
      qc_result_grp qrg,
      accession a,
      discrete_task_assay dta,
      nomenclature n,
      assay_processing_r apr,
      qc_result_event qe1,
      prsnl p1,
      qc_result_event qe2,
      prsnl p2,
      qc_result_event qe3,
      prsnl p3,
      (dummyt d1 with seq = 1),
      (dummyt d2 with seq = 1)
    plan d3
    join qr
    	where qr.lot_id = lots->qual[d3.seq]->lot_id
    	  and parser(sControl_Parser)
    	  and parser(sTestsite_Parser)
    	  and parser(sProcedure_Parser)
    	  and parser(sResultstatus_Parser)
    	  and qr.qc_result_type_flag = 0
    	  and (qr.perform_dt_tm between cnvtdatetime(lots->qual[d3.seq]->receive_dt_tm)
    	                            and cnvtdatetime(request->end_dt_tm)
               or qr.perform_dt_tm = cnvtdatetime(lots->qual[d3.seq]->receive_dt_tm)
               or qr.perform_dt_tm = cnvtdatetime(request->end_dt_tm))
          and ((request->lot_type_flag = 0 and qr.preactive_ind = 1) or
               (request->lot_type_flag = 1 and qr.preactive_ind = 0) or
               (request->lot_type_flag = 2))
          and qr.result_status_cd != result_status_performed_cd
    join cl
      where cl.lot_id = qr.lot_id
    join qrg
      where qrg.qc_group_id = qr.qc_group_id
    join a
      where a.accession_id = qrg.accession_id
    join dta
      where dta.task_assay_cd = qr.task_assay_cd
    join n
      where n.nomenclature_id = qr.nomenclature_id
    join apr
      where apr.service_resource_cd = outerjoin(qr.service_resource_cd) and
            apr.task_assay_cd = outerjoin(qr.task_assay_cd)
    join d1
      where d1.seq = 1
    join qe1
      where qe1.qc_result_id = outerjoin(qr.qc_result_id) and
            (qe1.event_type_cd = result_status_verified_cd
            or qe1.event_type_cd = result_status_auto_verf_cd
            or qe1.event_type_cd = result_status_changed_cd)
    join p1
      where p1.person_id = outerjoin(qe1.event_personnel_id)
    join d2
      where d2.seq = 1
    join qe2
      where qe2.qc_result_id = outerjoin(qr.qc_result_id) and
            qe2.event_type_cd = outerjoin(result_status_reviewed_cd)
    join p2
      where p2.person_id = outerjoin(qe2.event_personnel_id)
    join qe3
      where qe3.qc_result_id = outerjoin(qr.qc_result_id) and
            qe3.event_type_cd = outerjoin(result_status_reviewed2_cd)
    join p3
      where p3.person_id = outerjoin(qe3.event_personnel_id)

    ORDER BY  qr.qc_result_id

    HEAD qr.qc_result_id

      dServiceResourceCd = qr.service_resource_cd

      if (IsResourceViewable(dServiceResourceCd) = True)

        lResultsCnt = lResultsCnt + 1

        if (lResultsCnt > size(reply->results, 5))
          lStatus = alterlist(reply->results, lResultsCnt + 9)
        endif

        reply->results[lResultsCnt]->qc_result_id          = qr.qc_result_id,
        reply->results[lResultsCnt]->qc_group_id           = qr.qc_group_id,
        reply->results[lResultsCnt]->accession_id          = qrg.accession_id,
        reply->results[lResultsCnt]->accession             = a.accession,
        reply->results[lResultsCnt]->result_status_cd      = qr.result_status_cd,
        reply->results[lResultsCnt]->result_control_cd     = qr.result_control_cd,
        reply->results[lResultsCnt]->lot_id                = qr.lot_id,
        reply->results[lResultsCnt]->lot_number            = cl.lot_number,
        reply->results[lResultsCnt]->service_resource_cd   = qr.service_resource_cd,
        reply->results[lResultsCnt]->task_assay_cd         = qr.task_assay_cd,
        reply->results[lResultsCnt]->mnemonic              = dta.mnemonic,
        reply->results[lResultsCnt]->perform_dt_tm         = cnvtdatetime(qr.perform_dt_tm),
        reply->results[lResultsCnt]->result_type_cd        = qr.result_type_cd,
        reply->results[lResultsCnt]->result_value_numeric  = qr.result_value_numeric,
        reply->results[lResultsCnt]->result_value_alpha    = n.source_string,
        reply->results[lResultsCnt]->nomenclature_id       = n.nomenclature_id,
        reply->results[lResultsCnt]->resource_error_codes  = qr.resource_error_codes,
        reply->results[lResultsCnt]->multiplex_resource_cd = qr.multiplex_resource_cd,
        reply->results[lResultsCnt]->rule_id               = qr.rule_id,
        reply->results[lResultsCnt]->mean                  = qr.mean,
        reply->results[lResultsCnt]->prev_result_id        = qr.prev_result_id,
        reply->results[lResultsCnt]->clinical_std_dev      = qr.clinical_std_dev,
        reply->results[lResultsCnt]->statistical_std_dev   = qr.statistical_std_dev,
        reply->results[lResultsCnt]->abs_low               = qr.abs_low,
        reply->results[lResultsCnt]->abs_high              = qr.abs_high,
        reply->results[lResultsCnt]->result_control_cd     = qr.result_control_cd,
        reply->results[lResultsCnt]->numeric_raw_value     = qr.numeric_raw_value,
        reply->results[lResultsCnt]->z_score               = qr.z_score,
        reply->results[lResultsCnt]->preactive_ind         = qr.preactive_ind,
        reply->results[lResultsCnt]->qc_result_updt_cnt    = qr.updt_cnt,
        reply->results[lResultsCnt]->result_process_cd     = qr.result_process_cd,
        reply->results[lResultsCnt]->ascii_text            = qr.ascii_text,
        reply->results[lResultsCnt]->interface_flag        = qr.interface_flag,
        reply->results[lResultsCnt]->comment_ind           = qr.comment_ind,

        if (apr_exists_ind = 1)
          reply->results[lResultsCnt]->display_sequence = apr.display_sequence
        else
          reply->results[lResultsCnt]->display_sequence = 0
        endif

        if (qe1_exists_ind = 1)
          if (qe1.event_type_cd = result_status_reviewed_cd)
            reply->results[lResultsCnt].review_tech = p1.name_full_formatted
            reply->results[lResultsCnt].review_dt_tm = qe1.event_dt_tm
          endif
        endif

        if (qe2_exists_ind = 1)
          if (qe2.event_type_cd = result_status_verified_cd)
            reply->results[lResultsCnt]->result_tech = p2.name_full_formatted
            reply->results[lResultsCnt]->result_tech_id = p1.person_id
          endif
        endif

        if (qe2.event_type_cd = result_status_auto_verf_cd)
          reply->results[lResultsCnt]->result_tech = p2.name_full_formatted
          reply->results[lResultsCnt]->result_tech_id = p1.person_id
        endif

        if (qe2.event_type_cd = result_status_changed_cd)
          reply->results[lResultsCnt]->result_tech = p2.name_full_formatted
          reply->results[lResultsCnt]->result_tech_id = p1.person_id
        endif

        if (qe3_exists_ind = 1)
          if (qe3.event_type_cd = result_status_reviewed2_cd)
            reply->results[lResultsCnt].review2_tech = p3.name_full_formatted
            reply->results[lResultsCnt].review2_dt_tm = qe3.event_dt_tm
          endif
        endif
      endif

    foot report

     if (lResultsCnt > 0)
       lStatus = alterlist(reply->results, lResultsCnt)
     endif

    with
      dontcare = qe1,
      dontcare = p1,
      outerjoin = d1,
      outerjoin = d2,
      nocounter

  endif
  
  free set lots
end

;Generated by GNU enscript 1.6.4.
