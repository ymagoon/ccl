/* Package: univnm_code_code
   University of New Mexico's PL/SQL library to support custom tables and 
   CCL-to-SQL gateway
   
   This package provides the following public functions:
   * <code_lookup>
   * <code_display>
   * <code_display_key>

   These are intended to be used from queries
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
create or replace package univnm_code is
   
   -- Author  : Mark Porter, University of New Mexico Hospitals
   -- Created : 08/2012
   
      -- Functions:
      function by_display_key(
         code_set_in IN number, 
         display_key_in IN varchar2
      ) return number;

      function display_key (
         code_value_in IN number,
         code_set_in IN number
      ) RETURN varchar2;

      function display_key (
         code_value_in IN number
      ) RETURN varchar2;

      function display (
         code_value_in IN number,
         code_set_in IN number
      ) RETURN varchar2;

      function display (
         code_value_in IN number
      ) RETURN varchar2;
      
end univnm_code;
/
create or replace package body univnm_code is

/* Function: by_display_key
   returns code by codeset and display key, like uar_get_code_by("DISPLAYKEY",...)
   
   Parameters:
      code_set_in    -  IN number.     Code set to search
      display_key_in -  IN varchar2.   Display key to search
      
   Example:
   (code)
      select * 
      from orders s
      where 
         s.order_status_cd != univnm_code.by_display_key(6004, 'CANCELED')

   (end)

   Note:
   in the case of no match found, -1 is returned 
   */
   function by_display_key (code_set_in IN number, display_key_in IN varchar2)
   return number
   is
      v_code_number number;
   BEGIN
      select   
         nvl(max(code_value),-1) into v_code_number
      from   
         code_value
      where   
         code_set = code_set_in
         and display_key = display_key_in;
    
      RETURN v_code_number;
   

   END by_display_key;
   
/* Function: display_key
   returns UAR display key  by code set and code value
   
   Parameters:
      
      code_value_in  -  IN number.     Display key to search
      code_set_in    -  IN number.     *Optional* Code set to search
      
      
   Note:
   in the case of no match found, an empty string is returned 
   */
   function display_key (code_value_in IN number)
   RETURN varchar2
   is
      v_display_key varchar2(100);
   BEGIN
      select   
         nvl(max(display_key),'') into v_display_key
      from   
         code_value
      where   
         code_value = code_value_in;

      return v_display_key;

   END display_key;
   
   function display_key (code_value_in IN number, code_set_in IN number)
   RETURN varchar2
   is
      v_display_key varchar2(100);      
   BEGIN
   
      select   
         nvl(max(display_key),'') into v_display_key
      from     
         code_value
      where    
         code_set = code_set_in
         and code_value = code_value_in;
   
      RETURN v_display_key;
   
 
      
   END display_key;
   
/* Function: display
   returns UAR display  by code set and code value
   
   Parameters:
      code_value_in  -  IN number.     Display key to search
      code_set_in    -  IN number.     *Optional* Code set to search
      
   Note:
   in the case of no match found, an empty string is returned 
   */
   function display (code_value_in IN number)
   RETURN varchar2
   is
      v_display varchar2(100);
   
   BEGIN
      select   
         nvl(max(display),'') into v_display
      from   
         code_value
      where   
         code_value = code_value_in;
      
      RETURN v_display;
  
   END display;

   function display (code_value_in IN number,code_set_in IN number)
   RETURN varchar2
   is
      v_display varchar2(100);
   
   BEGIN
      select   
         nvl(max(display),'') into v_display
      from   
         code_value
      where   
         code_set = code_set_in
         and code_value = code_value_in;
      
      RETURN v_display;
  
   END display;

end univnm_code;

/
