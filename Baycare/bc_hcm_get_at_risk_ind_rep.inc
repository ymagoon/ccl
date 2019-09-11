1 person_id = f8
1 at_risk_ind = i2
1 health_plans[*]
  2 plan_name = vc
  2 begin_iso_dt_tm = vc
  2 end_iso_dt_tm = vc
  2 plan_identifiers[*]
    3 value = vc
    3 type = vc
%i cclsource:status_block.inc