prompt
prompt Fixing CUST_AROS_ACOS
prompt =========================
prompt
	prompt
	prompt CUST_AROS_ACOS: delete orphans
	prompt =========================
	prompt
	delete
	from  CUST_AROS_ACOS t
	where not exists(select 'x' from cust_aros where id = aro_id)
	or not exists(select 'x' from cust_acos where id = aco_id)
	;
	
	prompt
	prompt CUST_AROS_ACOS: add foreign keys
	prompt =========================
	prompt 
	alter table CUST_AROS_ACOS
	  add constraint fk_rc_ro foreign key (ARO_ID)
	  references cust_aros (ID) on delete cascade;
	  
	alter table CUST_AROS_ACOS
	  add constraint fk_rc_co foreign key (ACO_ID)
	  references cust_acos (ID) on delete cascade;
	  
	  