/*~BB~************************************************************************
*
*  Copyright Notice:  (c) 2018 Sansoro Health, LLC
*
*  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
*  This material contains the valuable properties and trade secrets of
*  Sansoro Health, United States of
*  America, embodying substantial creative efforts and
*  confidential information, ideas and expressions, no part of which
*  may be reproduced or transmitted in any form or by any means, or
*  retained in any storage or retrieval system without the express
*  written permission of Sansoro Health.
*
~BE~***********************************************************************/
 
;EMISSARY VERSION: 1.16.6.1
 
declare directory = vc go
 
;---------------------------------
; THE DIRECTORY MUST BE SET HERE
;---------------------------------
set directory = "CCLUSERDIR:" go;<--- 	Change CCLUSERDIR: to the correct directory if applicable.
								;		*NOTE: Be sure to post directory between the quotation marks
								; 		**DO NOT add a trailing forward slash
								;
								; 		Examples:
								; 			CCLUSERDIR:
								; 			/cerner/d_001/ccluserdir
								; 			cust_script:
								; 			cust_script:/scripts
								; 			/cerner/w_custom/p001_cust/code/script/scripts
								;			/cerner/cmsftp
;---------------------------------------------
; DO NOT MODIFY ANYTHING BELOW THIS SECTION
;---------------------------------------------
call compile(build(directory,"/","snsro_compiler.prg")) go
 
snsro_compiler 'MINE', directory, 0 go
 
 
 
 
 
 
 
 
 
 
 
 
 
 
