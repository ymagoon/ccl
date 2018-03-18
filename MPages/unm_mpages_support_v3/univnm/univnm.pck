/* Package: univnm 
   University of New Mexico's PL/SQL library to support custom tables and 
   CCL-to-SQL gateway
   
   This package provides the following public procedures and functions:
   * <save>
   * <to_json>
   
   All other procedures and data types support those procedures and functions
   
*/
/* Topic: License 
	The MIT License
	
	Copyright (c) 2012 University of New Mexico Hospitals 
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
create or replace package univnm is
   
   -- Author  : Mark Porter, University of New Mexico Hospitals
   -- Created : 05/2012
   
   -- this prevents "ORA-04068: existing state of packages has been discarded" errors
   -- this also prevents use from SQL, which kinda sucks
      PRAGMA SERIALLY_REUSABLE;
   
-- Types:           
      TYPE data_table IS TABLE OF varchar2(32000) INDEX BY VARCHAR2(30);
      TYPE batch_table IS TABLE OF varchar2(32000) INDEX BY binary_integer;
      TYPE col_record IS RECORD (
         table_name varchar2(30),
         column_name varchar2(30),
         data_type   varchar2(9)
      );
      TYPE col_map IS TABLE OF col_record INDEX BY BINARY_INTEGER;

   
-- Procedures:
      procedure save(
         target      IN varchar2,
         save_type   IN varchar2,
         cov_text_values  in varchar2
      );
      procedure save(
         target      IN varchar2,
         save_type   IN varchar2,
         cov_text_values  in varchar2,
         person_id   in  float,
         user_name   in  varchar2
      );
      
      procedure parse_tuple(
         col_data   IN OUT   data_table,
         tuple      IN     varchar2
      );
      procedure process_insert(
         target     IN varchar2,
         cov_text_values IN varchar2
      );
      procedure process_update(
         target      IN varchar2,
         cov_text_values  IN varchar2
      );
      procedure process_remove(
         target      IN varchar2,
         cov_text_values  IN varchar2
      );
      procedure process_set(
         target      IN varchar2,
         cov_text_values  IN varchar2
      );
      procedure run_dml(
         dml    IN varchar2
      );
      procedure log(type IN varchar2, text IN varchar2);
      
      procedure log_sql_end(log_id in number);
      
      procedure get_columns(
         target            IN   varchar2,
         dd_table          OUT col_map,
         n                 OUT number,
         primary_column    OUT   varchar2
      );
      procedure to_json (
         query IN varchar2
      );
      procedure to_json(
         query IN varchar2,
         person_id IN float,
         user_name in varchar2
      );
      PROCEDURE write_clob_data(
         loc   in clob
      );
-- Functions:
      function log_sql_begin(
         sql_code varchar2
      ) return number;
      function get_sql_col_name(
         colname IN varchar2
      ) return varchar2;
      function parse_col_data(
         cov_text_values IN varchar2
      ) return data_table;
      function parse_batch_data(
         batch_values IN varchar2
      ) return batch_table;
      function json_escape(str varchar2) return varchar2;
      
end univnm;
/
create or replace package body univnm is
-- this prevents "ORA-04068: existing state of packages has been discarded" errors
-- this also prevents use from SQL, which kinda sucks
   PRAGMA SERIALLY_REUSABLE;
   
/* Procedure: save
   Saves a row to a table

   Parameters:
      target               -  IN varchar2,   
                              Table name to manage
                              *NOTE* "CUST_" will be prepended to this name,
                              so be sure to only pass the part of the table name
                              after "CUST_"
                              
      save_type            -  IN varchar2,   
                              One of 'insert,update,set'. See Save Types below
                              
      cov_text_values      -  in varchar2,   Column data where tuples are
                              "colname=value" and tuples are separated by "|"
                              characters
                              
      person_id            -  in float 
                              *Optional, default 0.0*
                              person_id of user making the call
                              
      user_name            -  in varchar2
                              *Optional, default 'UNKNOWN (system)'*
                              name of user making the call

   Save Types:
      insert -  inserts a row in _target_ with the values defined in _cov_text_values_.
                Does not require primary key for _target_
      update -  updates a row in _target_ with the values defined in _cov_text_values_.
                REQUIRES that primary key column is set, and exists in _target_
      set    -  Either updates or inserts a row in _target_ with the values
                defined in _cov_text_values_. If _cov_text_values_ contains a primary key
                value, and a row with that value exists in _target_, an update
                is performed, otherwise an insert
             
   Note:
      Profiling and audit information about the actual queries executed will be 
      saved to cust_sql_audit
   */
   procedure save (
       target IN varchar2,
       save_type IN varchar2,
       cov_text_values in varchar2
   )is
   begin
      save(target,save_type,cov_text_values,0.0,'UNKNOWN (system)');
   end save;

   procedure save (
      target IN varchar2,
      save_type IN varchar2,
      cov_text_values in varchar2,
      person_id   in  float,
      user_name   in  varchar2
   ) is
      v_target           varchar2(30);
      v_error            varchar2(32000);
   begin

      if(
         not REGEXP_LIKE(target,'^[a-zA-Z0-9_]+$')
         or instr(lower(target),'log') > 0
         or instr(lower(target),'_audit') > 0
      ) then
         log('error','Attempt to write to invalid table: ' || target);
      else

         log('debug','cov_text_values = ' || cov_text_values);

         /* set globals */
            select cust_seq_audit.nextval into univnm_vars.v_trans_id from dual;
            univnm_vars.v_person_id := person_id;
            univnm_vars.v_user_name := user_name;
            log('debug','username= '||univnm_vars.v_user_name||' person_id= ' || univnm_vars.v_person_id || ' trans_id =' || univnm_vars.v_trans_id);
         /* prepend table prefix */
            v_target := 'CUST_' || target;
         
         /* check type */
            case lower(save_type)
               when 'insert' then process_insert(v_target,cov_text_values);
               when 'update' then process_update(v_target,cov_text_values);
               when 'remove' then process_remove(v_target,cov_text_values);
               when 'set'   then process_set(v_target,cov_text_values);
            end case;
      end if;
        
   EXCEPTION
   WHEN OTHERS THEN
      v_error := 'univnm.save: "'||SQLERRM || '"' 
         || chr(10) || dbms_utility.format_error_backtrace 
         || chr(10) || 'Save Type: ' || save_type 
         || chr(10) || 'Values:' 
         || chr(10) || cov_text_values;
      log('error',v_error);
      raise_application_error(-20001,v_error);
   end save;
/* Procedure: to_json
   Runs a query and saves the result as JSON to the cust_clob_data global temp 
   table in 4000 character chunks

   Parameters:                         
      query       -  in varchar2
                     SQL to execute
      person_id   -  in float 
                     *Optional, default 0.0*
                     person_id of user making the call
      user_name   -  in varchar2
                     *Optional, default 'UNKNOWN (system)'*
                     name of user making the call

   Adapted from PL/JSON package: http://sourceforge.net/projects/pljson/
   
   
   Note:
      Profiling and audit information about the actual queries executed will be 
      saved to cust_sql_audit
   */
   procedure to_json (
       query IN varchar2
   )is
   begin
      to_json(query,0.0,'UNKNOWN (system)');
   end to_json;
   
   procedure to_json(
      query IN varchar2,
      person_id   in  float,
      user_name   in  varchar2
   ) is
      v_result          CLOB;
      l_cur             number;
      l_dtbl            dbms_sql.desc_tab;
      l_cnt             number;
      l_status          number;
      v_sql_log_handle  number;
      v_date_val        date;
      v_text_val        varchar2(32000);
      v_clob_pos        number               :=1;
      v_first_row       boolean              :=true;
      v_error           varchar2(32000);
   begin
      /* set globals */
         select cust_seq_audit.nextval into univnm_vars.v_trans_id from dual;
         univnm_vars.v_person_id := person_id;
         univnm_vars.v_user_name := user_name;
         log('debug','username= '||univnm_vars.v_user_name||' person_id= ' || univnm_vars.v_person_id || ' trans_id =' || univnm_vars.v_trans_id);
         
      
      DBMS_LOB.CREATETEMPORARY(
         lob_loc     => v_result
         , cache     => true
         , dur       => dbms_lob.call
      );
      v_text_val := '[';
      dbms_lob.write(v_result,length(v_text_val),v_clob_pos,v_text_val);
      v_clob_pos := v_clob_pos + length(v_text_val);
      
      l_cur := dbms_sql.open_cursor;
      v_sql_log_handle := log_sql_begin(query);
      dbms_sql.parse(l_cur, query, dbms_sql.native);
      dbms_sql.describe_columns(l_cur, l_cnt, l_dtbl);
      log_sql_end(v_sql_log_handle);
      for i in 1..l_cnt loop
         if(l_dtbl(i).col_type = 12 or l_dtbl(i).col_type = 180) then
            dbms_sql.define_column(l_cur,i,v_date_val);
         else
            dbms_sql.define_column(l_cur,i,v_text_val,4000);
         end if;
      end loop;
      l_status := dbms_sql.execute(l_cur);
      
      --loop through rows
      while ( dbms_sql.fetch_rows(l_cur) > 0 ) loop -- rows
         if (v_first_row) then
            v_first_row := false;
         else
            v_text_val:=',';
            dbms_lob.write(v_result,length(v_text_val),v_clob_pos,v_text_val);
            v_clob_pos := v_clob_pos + length(v_text_val);
         end if;
         
         v_text_val:='{';
         dbms_lob.write(v_result,length(v_text_val),v_clob_pos,v_text_val);
         v_clob_pos := v_clob_pos + length(v_text_val);
         
         --loop through columns
         for i in 1..l_cnt loop --columns
            case l_dtbl(i).col_type
               when 112 then -- clob
                  dbms_sql.column_value(l_cur,i,v_text_val);
                  if(v_text_val is null) then
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":null';
                  else
                     -- Is this a JSON string?
                     if (substr(v_text_val,1,1) = '[' or substr(v_text_val,1,1) = '{') then
                        v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":' || v_text_val;
                     else
                        v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":' || json_escape(v_text_val);
                     end if;
                  end if;
               when 2 then -- number
                  dbms_sql.column_value(l_cur,i,v_text_val);
                  if(v_text_val is null) then
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":null';
                  elsif (to_number(v_text_val) > 0 and to_number(v_text_val) < 1 ) then
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":0' || v_text_val;
                  else 
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":' || v_text_val;
                  end if;
               when 12 then -- date
                  dbms_sql.column_value(l_cur,i,v_date_val);
                  if(v_text_val is null) then
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":null';
                  else
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":"' 
                        || to_char(v_date_val,'yyyy-mm-dd hh24:mi:ss') || '"'; 
                     
                  end if;
               when 180 then -- timestamp
                  dbms_sql.column_value(l_cur,i,v_date_val);
                  if(v_text_val is null) then
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":null';
                  else
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":"' 
                        || to_char(v_date_val,'yyyy-mm-dd hh24:mi:ss') || '"'; 
                     
                  end if;
               else -- assume text like
                  dbms_sql.column_value(l_cur,i,v_text_val);
                  if(v_text_val is null) then
                     v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":null';
                  else
                     -- Is this a JSON string?
                     if (substr(v_text_val,1,5) = '#JSON') then
                        v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":' || substr(v_text_val,6);
                     else
                        v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":' || json_escape(v_text_val);
                     end if;
                  end if;

                  --v_text_val := '"' ||lower(l_dtbl(i).col_name) ||'":"[UNKNOWN_TYPE '|| l_dtbl(i).col_type ||']"';   
            end case;
            
            if i != l_cnt then
               v_text_val := v_text_val ||',';
            end if;
            dbms_lob.write(v_result,length(v_text_val),v_clob_pos,v_text_val);
            v_clob_pos := v_clob_pos + length(v_text_val);
            
         end loop; --columns;
         
         v_text_val:='}';
         dbms_lob.write(v_result,length(v_text_val),v_clob_pos,v_text_val);
         v_clob_pos := v_clob_pos + length(v_text_val);
         
         
      end loop; -- rows;
      
      v_text_val:=']';
      dbms_lob.write(v_result,length(v_text_val),v_clob_pos,v_text_val);
      v_clob_pos := v_clob_pos + length(v_text_val);
      
      --log('debug','result= ' ||to_char(v_result));
      
      write_clob_data(v_result);
      
      dbms_sql.close_cursor(l_cur);
      DBMS_LOB.FREETEMPORARY(v_result);
   EXCEPTION
   WHEN OTHERS THEN
      dbms_sql.close_cursor(l_cur);
      DBMS_LOB.FREETEMPORARY(v_result);
      v_error := 'univnm.to_json: "'||SQLERRM || '"' 
         || chr(10) || dbms_utility.format_error_backtrace 
         || chr(10) || 'Query: ' 
         || chr(10) ||query;
      log('error',v_error);
      raise_application_error(-20001,v_error);
   end to_json;

   
/* Procedure: parse_tuple
   takes a string tuple in the form of "colname=value", and returns the colname
   and value

   Parameters:
      col_data    - IN OUT, hash array to populate
      tuple       - IN, string to parse ("col=value")
   */
   procedure parse_tuple(
      col_data   IN OUT   data_table,
      tuple      IN       varchar2

   ) is

      v_eq_pos             int;
      v_col                varchar2(30);
      v_value             varchar2(32000);
   begin
      v_eq_pos := instr(tuple,':',1);
      v_col := upper(substr(tuple,1,v_eq_pos-1));
      v_value:=substr(tuple,v_eq_pos+1);
      col_data(v_col) := v_value;

      /*log('debug','col =   ' || v_col);
      log('debug','value =   ' || col_data(v_col));*/ 
   end parse_tuple;
/* Procedure: run_dml
   runs a DML query

   Parameters:
      dml        - IN varchar2, sql statement to run
      
   */
   procedure run_dml(
      dml     IN varchar2
      
   ) is
      log_handle  number;
   begin
      log('debug','sql= ' || dml);
      log_handle:=log_sql_begin(dml);
      execute immediate dml; 
      commit;
      log_sql_end(log_handle);
   end run_dml;
/* Procedure: process_insert
   inserts _col_data_ into into _target_

   Parameters:
      target        - IN varchar2, Table to modify
      cov_text_values     - IN varchar2, String of column/values in 
                    "col <operator>:value|col <operator>:value" format. Multiple objects can be 
                    separated by tildes (~) 
   */
   procedure process_insert(
      target     IN varchar2,
      cov_text_values   IN varchar2
   ) is
      s         varchar2(32000);
      colname    varchar2(30);
      batch_id   binary_integer;
      batch_data  batch_table := parse_batch_data(cov_text_values);
      col_data   data_table;
   begin
   
      batch_id := batch_data.first;
      loop
         exit when batch_id is null;
         col_data :=parse_col_data(batch_data(batch_id));
         s :='insert into '|| target ||'(';
         /* add columns to insert */
            colname := col_data.first;
            s := s || get_sql_col_name(colname);
            loop
               colname := col_data.next(colname);
               exit when colname is null;
               s := s || ',' || get_sql_col_name(colname);
   
            end loop;
         s := s || ') values (';
         /* add values to insert */
            colname := col_data.first;
            s := s || col_data(colname);
            loop
               colname := col_data.next(colname);
               exit when colname is null;
               s := s || ',' || col_data(colname);
   
            end loop;
         s := s || ')';
   
         run_dml(s);
         batch_id := batch_data.next(batch_id);
      end loop;
   
   end process_insert;
/* Procedure: process_update
   updates _col_data_ into into _target_

   Parameters:
      target        - IN varchar2, Table to modify
      cov_text_values     - IN varchar2, String of column/values in 
                    "col <operator>:value|col <operator>:value" format. Multiple objects can be 
                    separated by tildes (~)
   */
   procedure process_update(
      target     IN varchar2,
      cov_text_values   IN varchar2
   ) is
      s           varchar2(32000);
      colname     varchar2(30);
      batch_id    binary_integer;
      batch_data  batch_table := parse_batch_data(cov_text_values);
      col_data    data_table;
      key_data    data_table;
      value       varchar2(32000);
      v_counter   number :=0;
      v_has_data  int :=0;
   begin
      batch_id := batch_data.first;
      loop
         
         exit when batch_id is null;
         v_counter := 0;
         col_data :=parse_col_data(batch_data(batch_id));
         key_data.delete;
         s :='update '|| target ||' set ';

         /* add columns to update */
            colname := col_data.first;
            
            loop
               exit when colname is null;
               if instr(colname,' ') >0 then
                  value:=col_data(colname);
                  if instr(colname,'=') >0 and lower(value) = 'null' then
                     colname:= replace(colname,'=','is');
                  end if;
                  key_data(colname) := value;
               else 
                  if (v_counter > 0) then
                     s := s || ',';
                  end if;
                  v_counter := v_counter +1;
                  s := s || colname || ' = ' || col_data(colname);
                  v_has_data :=1;
               end if;
               colname := col_data.next(colname);
            end loop;
         s := s || ' where  1=1 ';
         /* add keys to update */
            colname := key_data.first;
            loop
               exit when colname is null;
               s := s || ' and ' || colname || ' ' || key_data(colname);
               
               colname := key_data.next(colname);
            end loop;
         if (v_has_data = 1)   then
            run_dml(s);
         else
            log('debug','Update with no data, skipping...');
         end if;
         batch_id := batch_data.next(batch_id);
      end loop;
   end process_update;
/* Procedure: process_remove
   updates _col_data_ into into _target_

   Parameters:
      target        - IN varchar2, Table to modify
      cov_text_values     - IN varchar2, String of column/values in 
                    "col <operator>:value|col <operator>:value" format. Multiple objects can be 
                    separated by tildes (~)
   */
   procedure process_remove(
      target     IN varchar2,
      cov_text_values   IN varchar2
   ) is
      s            varchar2(32000);
      colname       varchar2(30);
      batch_id   binary_integer;
      batch_data  batch_table := parse_batch_data(cov_text_values);
      col_data   data_table;
   begin
      batch_id := batch_data.first;
      loop
         exit when batch_id is null;
         col_data :=parse_col_data(batch_data(batch_id));
         s :='delete from  '|| target ||' where 1=1 ';
         /* add columns to update */
            colname := col_data.first;
            
            loop
               exit when colname is null;
               if instr(colname,' ') >0 then
                  s := s || ' and ' || colname || ' ';
               else
                  s := s || ' and ' || colname || ' = ';
               end if;
               s := s || col_data(colname);
               colname := col_data.next(colname);
            end loop;
         run_dml(s);
         batch_id := batch_data.next(batch_id);
      end loop;
   end process_remove;

/* Procedure: process_set
   sets _col_data_ into into _target_

   Parameters:
      target        - IN varchar2, Table to modify
      cov_text_values     - IN varchar2, String of column/values in 
                    "col <operator>:value|col <operator>:value" format. Multiple objects can be 
                    separated by tildes (~)
   */
   procedure process_set(
      target     IN varchar2,
      cov_text_values   IN varchar2
   ) is
      s              varchar2(32000);
      criteria       varchar2(32000) := ' ';
      colname        varchar2(30);
      value          varchar2(32000);
      v_exist_count  int;
      batch_id       binary_integer;
      batch_data     batch_table := parse_batch_data(cov_text_values);
      col_data       data_table;
      key_data       data_table;
      lookup         varchar2(32000) :='select 0 from dual where 1=0 ';
      
      v_run_lookup   int   :=1;
      only_equals_allowed_in_set      EXCEPTION;
   begin
      batch_id := batch_data.first;
      lookup:=' ';
      loop
         criteria := ' ';
         exit when batch_id is null;
         col_data :=parse_col_data(batch_data(batch_id));
         key_data.delete;
         /* find key columns */
            colname := col_data.first;
            loop
               exit when colname is null;
               value:=col_data(colname);
               if instr(colname,' ') >0 then
                  if (instr(colname,'=') = 0 and instr(lower(colname),'is') = 0) then
                     raise only_equals_allowed_in_set;
                  elsif ( instr(lower(colname),'=') > 0 and lower(col_data(colname)) = 'null') then
                     colname:= replace(colname,'=','is');
                  end if; 
                  key_data(colname) := value;
               end if;
               colname :=col_data.next(colname);
            end loop;
         s := 'select count(''x'') '|| 'from '|| target || ' where 1=1 ';
         if key_data.count > 0 then
            colname := key_data.first;
            loop
               exit when colname is null;
               criteria := criteria || ' and ' || colname || ' ' || key_data(colname);
               
               colname := key_data.next(colname);
            end loop;
         else
            criteria:=criteria ||' and id = ' || col_data('ID');
         end if;
         
         s := s || criteria;
   
   
         log('debug','set search sql= ' || s);
         
         execute immediate s into v_exist_count;
         
         log('debug','count = ' || v_exist_count);
         if v_exist_count = 0 then
            log('debug','row not found, inserting..');
            process_insert(target,batch_data(batch_id));
         else
            log('debug','row found, updating..');
            process_update(target,batch_data(batch_id));
            
         end if;
         if length(lookup) < 28000 then
            if batch_id > 0 then
               lookup := lookup || ' UNION ';
            end if; 
            lookup := lookup || ' select ' || batch_id  || ' batch_id, t.* from '
               || target || ' t  where 1=1 ' || criteria;
         else
            v_run_lookup :=0;
         end if;

         batch_id := batch_data.next(batch_id);
         
      end loop;
   
      lookup := lookup || ' order by batch_id';
      /* run lookup */
      if (v_run_lookup = 1) then
         to_json(lookup,univnm_vars.v_person_id,univnm_vars.v_user_name);
      else
         --generate empty resultset, cuz we didn't look anything up
         to_json('select 0 from dual where 1=2',univnm_vars.v_person_id,univnm_vars.v_user_name);
      end if;
      
   end process_set;
/* Procedure: log
   logs to cust_log table.
   
   Parameters:
      type     -  IN varchar2 
                  Arbitrary type. Only 'error' will be logged in instances that 
                  start with 'P' (e.g. P126) 
      text     -  IN varchar2
                  text string to log


   Notes:
   
   * also outputs to sql plus, if "set serveroutput on;" is enabled
   and logScreen = 0 in cust_values (see below)

   * Only logs errors unless logAllTypes = 1 in cust_values (see below)               

   Cust Values Settings:

   These should be entered into the cust_values table with application ='univnm_system'
   and the following keys and values

   logScreen   -     1 = true, 0 = false
                     Determines if dbms_output.put_line is called to send 
                     logs to the screen. If not logScreen, no logs are sent to 
                     screen.

   logAllTypes -     1 = true, 0 = false
                     if logAllTypes, all log types are saved to the cust_log table,
                     otherwise only errors are logged

   */
   procedure log(type IN varchar2, text IN   varchar2) is
      v_log_screen   int;
      v_text         varchar2(4000) := substr(text,1,4000);
      v_log_all      int;      

   begin
      select 
         nvl(max(value),0) into v_log_screen
      from cust_values
      where application='univnm_system'
      and key='logScreen';

      select 
         nvl(max(value),0) into v_log_all
      from cust_values
      where application='univnm_system'
      and key='logAllTypes';

     
      if (v_log_all = 1 or type = 'error') then
         insert into cust_log(type,detail) values (type,'trans_id =' || univnm_vars.v_trans_id ||chr(10) ||substr(v_text,1,3900));
      end if;
      commit;
      if (v_log_screen = 1) then
         dbms_output.put_line(substr('['||type||']' || text,1,4000));
      end if;
      
   end log;
/* Procedure: log_sql_end
   completes SQL profile/audit

   Paramters:
      log_id     -   number, id of log created by log_sql_begin
   */
   procedure log_sql_end(log_id in number) is
   begin
      update cust_sql_audit set
         end_ts = SYSTIMESTAMP
      where id = log_id;
      commit;
   end log_sql_end;

/* Procedure: get_columns
   returns a map of column info for _target_

   Parameters:
      target      - IN   varchar2,          table to inspect
      dd_table   - OUT col_map,   results map (See data type)
      n             - OUT number,             Number of columns (row in dd_table)
   */
   PROCEDURE get_columns(
      target            IN    varchar2,
      dd_table          OUT   col_map,
      n                 OUT   number,
      primary_column    OUT   varchar2
   ) IS

      handle         Integer;
      dbms_return    Integer;
      tablename      varchar(30);
      colname        varchar(30);
      datatype       varchar(9);
      counter        integer := 0;

   begin                    
      handle := DBMS_SQL.OPEN_CURSOR;
      SELECT
         a.COLUMN_NAME into primary_column
      FROM  USER_IND_COLUMNS a, USER_CONSTRAINTS b
      WHERE a.INDEX_NAME=b.INDEX_NAME AND
         a.TABLE_NAME= upper(target) AND
         b.CONSTRAINT_TYPE='P';

      
      DBMS_SQL.PARSE(handle,
            'select table_name,column_name,data_type,column_id '  ||
            'from    user_tab_columns '                           ||
            'where   table_name ='''                              ||
            target                                                ||
            ''''                                                  ||
            ' order by column_id',
         DBMS_SQL.NATIVE);

      DBMS_SQL.DEFINE_COLUMN(handle, 1, tablename, 30);
      DBMS_SQL.DEFINE_COLUMN(handle, 2, colname, 30);
      DBMS_SQL.DEFINE_COLUMN(handle, 3, datatype, 9);
      dbms_return := DBMS_SQL.EXECUTE(handle);

      counter := 0;
      loop
         if DBMS_SQL.FETCH_ROWS(handle) = 0 then
            exit;
         else
            DBMS_SQL.COLUMN_VALUE(handle, 1, tablename);
            DBMS_SQL.COLUMN_VALUE(handle, 2, colname);
            DBMS_SQL.COLUMN_VALUE(handle, 3, datatype);

            counter := counter + 1;
            dd_table(counter).table_name := tablename;
            dd_table(counter).column_name := colname;
            dd_table(counter).data_type := datatype;
         end if;
      end loop;
      n := counter;
      DBMS_SQL.CLOSE_CURSOR(handle);

   EXCEPTION
      WHEN OTHERS THEN
         DBMS_SQL.CLOSE_CURSOR(handle);
         n := -1;
         log('error','univnm.get_columns: '||SQLERRM);
         raise_application_error(-20001,'univnm.get_columns: '||SQLERRM);
   END get_columns;
/* Procedure: write_clob_data
   saves a clob Object to the clob_data_field 

   Parameters:
      target      - IN   varchar2,          table to inspect
      dd_table   - OUT col_map,   results map (See data type)
      n             - OUT number,             Number of columns (row in dd_table)
   */
   PROCEDURE write_clob_data(
      loc   in clob
   ) IS
      v_pos   number;
   begin           
     delete from cust_clob_data;
     for idx in 1 .. ceil(length(loc)/4000)
     loop
         v_pos := ((idx-1)*4000)+1;
         insert into cust_clob_data(ordinal,data) values(idx,dbms_lob.substr(loc,4000,v_pos));
     end loop;
     
     commit;
   END write_clob_data;
/* Function: parse_col_data
   parses the columns and values from a string and returns a data_table

   Paramters:
      cov_text_values    -   object string to parse

   Returns:
      data_table of col <operator>:value tuples
   */
   function parse_col_data (
      cov_text_values IN varchar2
   ) return data_table is
      v_col_data         data_table;
      v_tuple            varchar2(32000);
      v_ptr             int;
      v_ptr_end          int;
   begin
      /* parse values and build col_data */
         v_ptr := 1;
         v_ptr_end := instr(cov_text_values,'|',v_ptr);
         while v_ptr_end > 1
         loop
            v_tuple := substr(cov_text_values,v_ptr,v_ptr_end-v_ptr);
            parse_tuple(v_col_data,replace(v_tuple,'_PIPE_','|'));
            v_ptr := v_ptr_end+1;
            v_ptr_end := instr(cov_text_values,'|',v_ptr);

         end loop;
         v_tuple := substr(cov_text_values,v_ptr);
         parse_tuple(v_col_data,replace(v_tuple,'_PIPE_','|'));

      return (v_col_data);
   end parse_col_data;

/* Function: parse_batch_data
   parses the batch values from a string and returns a batch_table

   Paramters:
      batch_values    -   string to parse

   Returns:
      data_table of cov_text_value strings
   */
   function parse_batch_data (
      batch_values IN varchar2
   ) return batch_table is
      v_batch_data        batch_table;
      v_batch            varchar2(32000);
      v_ptr             int;
      v_ptr_end          int;
      v_counter          number;
   begin
      /* parse values and build batch_data */
         v_ptr := 1;
         v_counter := 0;
         v_ptr_end := instr(batch_values,'~',v_ptr);
         while v_ptr_end > 1
         loop
            v_batch := substr(batch_values,v_ptr,v_ptr_end-v_ptr);
            log ('debug','Batch = ' || v_counter ||':'||v_batch);
            v_batch_data(v_counter) := replace(v_batch,'_TILDE_','~');
            v_ptr := v_ptr_end+1;
            v_ptr_end := instr(batch_values,'~',v_ptr);
            v_counter := v_counter +1;
         end loop;
         
         v_batch := substr(batch_values,v_ptr);
         v_batch_data(v_counter) := replace(v_batch,'_TILDE_','~');
         log ('debug','Batch = ' || v_counter ||':'||v_batch);
      return (v_batch_data);
   end parse_batch_data;
/* Function: get_sql_col_name
   returns a colname minus any operators

   Paramters:
      colname    -   string column name

   Returns:
      colname minus any operators
   */
   function get_sql_col_name (
      colname IN varchar2
   ) return varchar2 is
      v_pos number;
   begin
      v_pos := instr(colname,' ');
      if (v_pos > 0) then
         --log ('debug','colname = ' ||  substr(colname,1,v_pos-1));
         return (substr(colname,1,v_pos-1));
      else 
         --log ('debug','colname = ' ||  colname);
         return colname;
         
      end if;   
         
   end get_sql_col_name;   
   
/* Function: log_sql_begin
   begins SQL profile/audit

   Paramters:
      sql_code    -   sql code to log

   Returns:
      Id number to pass to log_sql_end
   */
   function log_sql_begin (
      sql_code varchar2
   ) return number is
      v_id   number;
   begin
      select cust_seq_audit.nextval into v_id from dual;
      insert into cust_sql_audit(
         id,
         transaction_id,
         full_name,
         person_id,
         begin_ts,
         sql
      ) values (
         v_id,
         univnm_vars.v_trans_id,
         univnm_vars.v_user_name,
         univnm_vars.v_person_id,
         SYSTIMESTAMP,
         sql_code
      );
      commit;

      return (v_id);
   end log_sql_begin;
/* Function: json_escape
   Escapes JSON characters in a string
   
   Parameters:
      str      -  IN varchar2. String to escape.
   
   Adapted from PL/JSON package: http://sourceforge.net/projects/pljson/
   */
   function json_escape(str varchar2) return varchar2 as
      sb varchar2(32767) := '';
      buf varchar2(40);
      num number;
   begin
      if(str is null) then return '""'; end if;
      for i in 1 .. length(str) loop
         buf := substr(str, i, 1);
         case buf
            when chr( 8) then buf := '\b';
            when chr( 9) then buf := '\t';
            when chr(10) then buf := '\n';
            when chr(13) then buf := '\f';
            when chr(14) then buf := '\r';
            when chr(34) then buf := '\"';
            when chr(92) then buf := '\\';
            else
               if(ascii(buf) < 32) then
                  buf := '\u'||replace(substr(to_char(ascii(buf), 'XXXX'),2,4), ' ', '0'); 
               else
                  buf := replace(asciistr(buf), '\', '\u');
               end if;
         end case;
         
         sb := sb || buf;
      end loop;
      
      return '"'||sb||'"';
   end json_escape;




end univnm;
--:tabSize=3:indentSize=3:noTabs=true: jEdit tab settings
/
