if(validate(schuar_def, 999)=999)
   call echo("Declaring schuar_def")
   declare schuar_def = i2 with persist
   set schuar_def = 1

   declare uar_sch_check_security(sec_type_cd=f8(ref),
                                  parent1_id=f8(ref),
                                  parent2_id=f8(ref),
                                  parent3_id=f8(ref),
                                  sec_id=f8(ref),
                                  user_id=f8(ref)) = i4
      with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security", persist

   declare uar_sch_security_insert(user_id=f8(ref),
                                   sec_type_cd=f8(ref),
                                   parent1_id=f8(ref),
                                   parent2_id=f8(ref),
                                   parent3_id=f8(ref),
                                   sec_id=f8(ref)) = i4
      with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_insert", persist

   declare uar_sch_security_perform() = i4
      with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_perform", persist

   declare uar_sch_check_security_ex(user_id=f8(ref),
                                     sec_type_cd=f8(ref),
                                     parent1_id=f8(ref),
                                     parent2_id=f8(ref),
                                     parent3_id=f8(ref),
                                     sec_id=f8(ref)) = i4
      with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security_ex", persist
 
   ;87486+
   declare uar_sch_check_security_ex2(user_id=f8(ref),
                                     sec_type_cd=f8(ref),
                                     parent1_id=f8(ref),
                                     parent2_id=f8(ref),
                                     parent3_id=f8(ref),
                                     sec_id=f8(ref),
                                     position_cd=f8(ref)) = i4
      with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security_ex2", persist
 
   declare uar_sch_security_insert_ex2(user_id=f8(ref),
                                   sec_type_cd=f8(ref),
                                   parent1_id=f8(ref),
                                   parent2_id=f8(ref),
                                   parent3_id=f8(ref),
                                   sec_id=f8(ref),
                                   position_cd=f8(ref)) = i4
      with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_insert_ex2", persist
   ;87486-
endif   

