/****************************************************************************
        Source file name:       may_mo_html.inc
        Object name:
        Request #:
 
        Product:                FirstNet
        Product Team:
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Include file for the Depart Summary's
                                User Defined Tokens.
 
        Tables read:            None
        Tables updated:         None
        Executing from:         FirstNet Depart Process
 
        Special Notes:
 
****************************************************************************/
 
;****************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                  *
;****************************************************************************
;*                                                                          *
;*Mod Date     Engineer             Comment                                 *
;*--- -------- -------------------- -----------------------------------     *
;*001 01/06/07 Lisa Choi            Initial Release                         *
;*002  29/02/08 Lisa Choi            CR: 1-1779892094 Changed the font size *
;*003  10/22/08 Nancy Toalson        Changed the font size of tables to 8.  *
;****************************************************************************
 
record reply(
  1 text = vc
  1 format = i4
)
 
declare csBegin = vc with constant("<html><body>")
declare csBold = vc with constant("<B>")
declare csBoldEnd = vc with constant("</B>")
declare csSpan = vc with constant("<span style='font-size:8.0pt;font-family:Tahoma,sans-serif'>")
declare csSpanEnd = vc with constant("</span>")
declare csParagraph = vc with constant("<P class=MsoNormal style='TEXT-ALIGN: center' align=center>")
declare csParagraphEnd = vc with constant("</P>")
declare csEnd = vc with constant("</body></html>")
declare csTable = vc with constant("<TABLE border ='1'")
;declare csTable = vc with constant("<TABLE border ='1' style = 'TEXT-ALIGN: left' align=left>")
declare csTableEnd = vc with constant("</TABLE>")
declare csTableDef1 = vc with constant("<TD><span style='font-size:8.0pt;font-family:Tahoma,sans-serif'>")
declare csTableDef = vc with constant("<span style='font-size:8.0pt;font-family:Tahoma,sans-serif'>")
declare csTableDefEnd = vc with constant("</TD>")
 
 

