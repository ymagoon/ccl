record contam(
  1 rec [*]
    2 accession             = vc
    2 coll_source_cd        = f8
    2 coll_source_disp      = vc
    2 coll_facility_cd      = f8
    2 coll_facility_disp    = vc
    2 coll_nurse_unit_cd    = f8
    2 coll_nurse_unit_disp  = vc
    2 drawn_dt_tm           = dq8
    2 drawn_user_id         = f8
    2 drawn_user_full_name  = vc
    2 drawn_user_name       = vc
    2 enc_confid_level_cd   = f8
    2 enc_confid_level_disp = vc
    2 enc_class_cd          = f8
    2 enc_class_disp        = vc
    2 enc_type_cd           = f8
    2 enc_type_disp         = vc
    2 enc_type_class_cd     = f8
    2 enc_type_class_disp   = vc
    2 enc_fin_class_cd      = f8
    2 enc_fin_class_disp    = vc
    2 enc_med_srv_cd        = f8
    2 enc_med_srv_disp      = vc
    2 fin                   = vc
    2 inlab_dt_tm           = dq8
    2 inlab_user_id         = f8
    2 inlab_user_full_name  = vc
    2 inlab_user_name       = vc
    2 organism_cd           = f8
    2 organism_disp         = vc
    2 priority_cd           = f8
    2 priority_disp         = vc
    2 pt_birth_dt_tm        = dq8
    2 pt_mrn                = vc
    2 pt_facility_cd        = f8
    2 pt_facility_disp      = vc
    2 pt_full_name          = vc
    2 pt_nurse_unit_cd      = f8
    2 pt_nurse_unit_disp    = vc
    2 pt_room_cd            = f8
    2 pt_room_disp          = vc
    2 pt_bed_cd             = f8
    2 pt_bed_disp           = vc
    2 pt_sex_cd             = f8
    2 pt_sex_disp           = vc
    2 rslt_dt_tm            = dq8
  1 stats[1]
    2 contam_cnt = i4
    2 total_cnt  = i4
    2 percent    = f8
    2 units[*]
      3 unit_cd     = f8
      3 unit_disp   = vc
      3 total_cnt   = i4
      3 contam_cnt  = i4
      3 percent     = f8
    2 phlebs[*]
      3 phleb_id    = f8
      3 name        = vc
      3 username    = vc
      3 total_cnt   = i4
      3 contam_cnt  = i4
      3 percent     = f8
)

