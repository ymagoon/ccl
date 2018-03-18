/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1997 Cerner Corporation                 *
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
  ~BE~***********************************************************************/
/*****************************************************************************
        Source file name:       aps_uar_rtf.prg
        Object name:            NONE
        Request #:              NONE
 
        Product:                PathNet
        Product Team:           Anatomic Pathology
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        An include file to call uar to get ascii
                                text from rtf
 
        Tables read:            N/A
 
        Tables updated:         N/a
 
        Executing from:         ccl
 
        Special Notes:          This subroutine will take a string of rtf text
                                and strip it to reveal the ascii.  This string
                                is returned in the NoRtfText variable.  If the
                                format parameter is greater that 0, this
                                subroutine will populate a temporary structure,
                                filling each qual with a full line of text
                                less than or equal to the line_len parameter.
 
        Also Used By:           Blood Bank bbt_rtp_interps.prg
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     ### 02/26/97 Andrew Walker            Initial Release                 *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
/**********************************************************************
*   Internal temporary Record                                         *
***********************************************************************/
  record tmptext
  (
    1 qual[*]
      2 text                           = vc
  )
;***********************************************************************/
 
  declare format                       = i2
  declare line_len                     = i2
  declare OutBuffer                    = c32000
  declare RtfText                      = c32000
  declare NoRtfText                    = c32000
  set format                           = 0
  set line_len                         = 0
 
  subroutine RTF_TO_TEXT(RtfText,format,line_len)
    set all_len                        = 0
    set start                          = 0
    set len                            = 0
    set pos                            = 0
    set linecnt                        = 0
    set InBuffer                       = fillstring(32000, " ")
    set OutBufferlen                   = 0
    set bFl                            = 0
    set bFl2                           = 1
    set OutBuffer                      = fillstring(32000, " ")
    set NoRtfText                      = fillstring(32000, " ")
 
    set InBuffer                       = trim(RtfText)
;;    call uar_rtf(InBuffer,size(InBuffer),OutBuffer,size(OutBuffer),OutBufferLen,bFl,bFl2)
    call uar_rtf2(InBuffer,size(InBuffer),OutBuffer,size(OutBuffer),OutBufferLen,bFl)
    set NoRtfText                      = trim(OutBuffer)
    set stat = alterlist(tmptext->qual, 0)
    set crchar                         = concat(char(13),char(10))
    if (Format > 0)
      set all_len = cnvtint(size(trim(outbuffer)))
      set tot_len = 0
      set start = 1
      set bigfirst = "Y"
      set crstart = start
      while (all_len > tot_len)
        set crpos = crstart
        set crfirst = "Y"
        set loaded = "N"
        While ((crpos <= (crstart + line_len + 1)) and (loaded = "N") and (all_len > tot_len))
          if ((crpos = (crstart + line_len + 1)) and (crfirst ="N")) ;no cr found
            set start = crstart
            set first = "Y"
            set pos = start + line_len - 1
            if ((bigfirst = "Y") and (pos >= all_len))
              ;set pos = all_len + 1
              set pos = start
            endif
            set bigfirst = "N"
            while((pos >= start) and (all_len > tot_len))
              if (pos = start) ;could not find a space default and take the line
                set pos = start + line_len - 1
                set linecnt = linecnt + 1
                set stat = alterlist(tmptext->qual, linecnt)
                set len = pos - start + 1
                set tmptext->qual[linecnt].text = substring(start,len,(outbuffer))
                set start = pos + 1
                set crstart = pos + 1
                set pos = 0
                set tot_len = tot_len + len - 1
                set loaded = "Y"
              else
                if (substring(pos,1,(outbuffer)) = " ")
                  set len = pos - start
                  if (cnvtint(size(trim(substring(start,len,(outbuffer))))) > 0)
                    set linecnt = linecnt + 1
                    set stat = alterlist(tmptext->qual, linecnt)
                    set tmptext->qual[linecnt].text = substring(start,len,(outbuffer))
                    set loaded = "Y"
                  endif
                  set start = pos + 1
                  set crstart = pos + 1
                  set pos = 0
                  set tot_len = tot_len + len ;+ 1
                else
                  if (first = "Y")
                    set first = "N"
                    set tot_len = tot_len + 1
                  endif
                  set pos = pos - 1
                endif
              endif
            endwhile
          else
            set crfirst = "N"
          if (substring(crpos,1,(outbuffer)) = crchar) ;char(13)) ;"X")
              set crlen = crpos - crstart
              ;if (cnvtint(size(trim(substring(crstart,crlen,(outbuffer))))) > 0)
                set linecnt = linecnt + 1
                set stat = alterlist(tmptext->qual, linecnt)
                set tmptext->qual[linecnt].text = substring(crstart,crlen,(outbuffer))
                set loaded = "Y"
              ;endif
              set crstart = crpos + textlen(crchar)
              ;set crpos = 0
              set tot_len = tot_len + crlen
            endif
          endif
          set crpos = crpos + 1 ;textlen(crchar) ;+ 1
        endwhile
      endwhile
    endif
    set RtfText                        = fillstring(32000, " ")
    set InBuffer                       = fillstring(32000, " ")
  End ;Subroutine RTF_TO_TEXT
 
  ;;=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 
  declare OutBufMaxSiz                 = i2
  declare TBlobIn                      = c32000
  declare TBlobOut                     = c32000
  declare BlobIn                       = c32000
  declare BlobOut                      = c32000
 
  subroutine DECOMPRESS_TEXT(TBlobIn)
    set TBlobOut                       = fillstring(32000, " ")
    set BlobOut                        = fillstring(32000, " ")
    set OutBufMaxSiz                   = 0
 
    set BlobIn = trim(TBlobIn)
    call uar_ocf_uncompress(BlobIn,size(BlobIn),BlobOut,size(BlobOut),OutBufMaxSiz)
    set TBlobOut = BlobOut
 
    set TBlobIn                        = fillstring(32000, " ")
    set BlobIn                         = fillstring(32000, " ")
 
  end ;subroutine DECOMPRESS_TEXT
 
 

