/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  morg_adose_out
*  Description:  Modify Original Script for Acudose
*  Type:  Open Engine Modify Original Script
*  ---------------------------------------------------------------------------------------------
*  Author:  Centers FSI
*  Domain:  All
*  ---------------------------------------------------------------------------------------------
*
*/
execute oencpm_msglog build("In morg_adose_out", char(0))

; Transform ZXE to ZRX Segments 
; 5/6/2013 - RDETRICK Updated to fix Carriage Return issue on outbound messages.
declare zrx_seg = vc
declare zxe_seg = vc
Set zrx_seg = concat(char(13), "ZRX")
Set zxe_seg = concat(char(13), "ZXE")

Set oen_reply->out_msg =concat(trim(replace(oen_request->org_msg, zxe_seg, zrx_seg, 0)), char(13), char(0))

execute oencpm_msglog build("Out morg_adose_out", char(0))