/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2009 Cerner Corporation                 *
 *                                                                      *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
 *  This material contains the valuable properties and trade secrets of *
 *  Cerner Corporation of Kansas City, Missouri, United States of       *
 *  America (Cerner), embodying substantial creative efforts and        *
 *  confidential information, ideas and expressions, no part of which   *
 *  may be reproduced or transmitted in any form or by any means, or    *
 *  retained in any storage or retrieval system without the express     *
 *  written permission of Cerner.                                       *
 *                                                                      *
 *  Cerner is a registered mark of Cerner Corporation.                  *
 *                                                                      *
 ************************************************************************
 
        Author:                 Matt Watt
        Date Written:           09/02/2009
        Source file name:       sc_cps_word_wrap.inc
        Object name:            n/a
        Request #:              n/a
 
        Product:                Solution Center
        Product Team:           Custom Programming Services
        HNA Version:            500
        CCL Version:
 
        Program purpose:        Subroutine to parse through text and word wrap,
                                based on logic in DCP_PARSE_TEXT
 
        Executing from:         Custom Scripts
 
        Special Notes:          %i cclsource:sc_cps_word_wrap.inc
                                sText       =   <text you want parsed>
                                nMaxLength  =   <max allowed text length per line>
                                pt          =   <record structure of output lines>
 
                                If used in a reportwriter section be sure to use a
                                set call, rather than a call().
                                i.e. dummyVar = word_wrap(sText, nMaxLength)
 
**********************************************************************************************************************************
*   MODIFICATION CONTROL LOG
**********************************************************************************************************************************
* Mod  Date      Feature  Engineer       Comment
* ---  --------  -------  -------------  ----------------------------------------------------------------------------------------
* 000  09/02/09           MW017700       Initial release based on current dcp_parse_text code.
* 001  09/10/09           MW017700       Move declarations inside sub and make variable names more meaningful.
* 002  01/19/11           MW017700       Removed incorrect documentation, and improved documentation overall.
*********************************************************************************************************************************/
 
free set pt
record pt (
    1 line_cnt = i2
    1 lns[*]
        2 line = vc
)
 
free set blob
record blob
(  1 line = vc
   1 cnt = i2
   1 qual[*]
     2 line = vc
     2 sze = i4
)
 
/*******************************************************************************/
declare word_wrap(sText = vc,
                  nMaxLength = i4) = null
 
/********************************************************************************
  word_wrap
*********************************************************************************
  Description: Parse through text and wrap to multiple lines based on desired max character length of each line.
 
  Inputs: sText             [vc] - text to be parsed
          nMaxLength        [i4] - max allowed text length per line
 
  Output: pt->lns[x].line   [vc] - Record structure contains each wrapped line of text, where [x] is the line number.
 
  Returns: [i2] - Returns 0 at completion.  Has no defined meaning.
********************************************************************************/
SUBROUTINE word_wrap(sText, nMaxLength)
call echo("***  subroutine:word_wrap")
 
    declare check_blob  = vc with private, noconstant(" ")
    declare lf          = vc with private, noconstant(concat(char(13),char(10)))
    declare cr          = i4 with private, noconstant(0)
    declare length      = i4 with private, noconstant(0)
    declare line_cnt    = i4 with private, noconstant(0)
    declare prev_cnt    = i4 with private, noconstant(0)
    declare cur_pos     = i4 with private, noconstant(0)
 
    ;>> Initialize <<
    set stat = initrec(pt)
    set stat = initrec(blob)
 
    set check_blob = concat(trim(sText),lf)
    set blob->cnt = 0
    set cr = findstring(lf,check_blob)
    set length = textlen(check_blob)
 
    while (cr > 0)
;call echo(build("***    lf found at:",cr))
      set blob->line = substring(1,cr-1,check_blob)
      ;// substring() cut off characters by the end,if set the length shorter
      ;// than the actual length of the string to be traced.
      set check_blob = substring(cr+2,length,check_blob)
      set blob->cnt = blob->cnt + 1
      set stat = alterlist(blob->qual,blob->cnt)
      set blob->qual[blob->cnt].line = trim(blob->line)
      set blob->qual[blob->cnt].sze = textlen(trim(blob->line))
      set cr = findstring(lf,check_blob)
 
    endwhile
 
    for (j = 1 to blob->cnt)
      while (blob->qual[j].sze > nMaxLength)
        set prev_cnt = line_cnt
        set cur_pos = nMaxLength
        while (cur_pos > 0)
          if (substring(cur_pos,1,blob->qual[j].line) in (" ","-"))
            set line_cnt = line_cnt + 1
;call echo(build("***    new line from:[",substring(cur_pos,1,blob->qual[j].line),"]"))
            set stat = alterlist(pt->lns, line_cnt)
            set pt->lns[line_cnt].line = substring(1,cur_pos,blob->qual[j].line)
            set blob->qual[j].line = substring(cur_pos+1,blob->qual[j].sze-cur_pos,blob->qual[j].line)
            set cur_pos = 1
          endif
          set cur_pos = cur_pos - 1
        endwhile
        if (prev_cnt = line_cnt) ; no space or dash found, take nMaxLength worth of characters
           set line_cnt = line_cnt + 1
;call echo(build("***    new line due to max length"))
           set stat = alterlist(pt->lns, line_cnt)
           set pt->lns[line_cnt].line = substring(1,nMaxLength,blob->qual[j].line)
           set blob->qual[j].line = substring(nMaxLength+1,blob->qual[j].sze-nMaxLength,blob->qual[j].line)
        endif
        set blob->qual[j].sze = size(trim(blob->qual[j].line))
      endwhile
      set line_cnt = line_cnt + 1
;call echo(build("***    new line for last line"))
      set stat = alterlist(pt->lns, line_cnt)
      set pt->lns[line_cnt].line = substring(1,blob->qual[j].sze,blob->qual[j].line)
      set pt->line_cnt = line_cnt
    endfor
 
    return(0)
 
call echo("***  end:word_wrap")
END ;word_wrap
/*******************************************************************************/
 
set inc_last_mod = "002  01/19/11  MW017700"
 

