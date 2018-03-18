;cclrtf.inc
subroutine 
cclrtf_print(par_flag, par_xpixel, par_yoffset, par_numcol, par_blob, par_bloblen, par_check)
;**********************************************************************************
; parameters:
; par_flag        ::  1(dio) 0(ascii)
; par_xpixel      ::  x pixel to begin printing text
; par_yoffset     ::  y offset to space the text vertically
; par_numcol      ::  width to display the blob
; par_blob        ::  blob to print rtf for
; par_bloblen     ::  max length of blob
; par_check       ::  (0, dont print with check) (1, print with check option)
;**********************************************************************************
     m_output_buffer_len = 0
     blob_out =  fillstring(30000," ")
     blob_buf = fillstring(200," ")
     m_linefeed = concat(char(10))
     numLines = 0

     textindex = 0
     numcol = par_numcol
     whiteflag = 0
     yIncrement = 12
     yOffset = 0    

     call uar_rtf(par_blob,par_bloblen,blob_out,size(blob_out),m_output_buffer_len,par_flag)
     m_output_buffer_len = minval(m_output_buffer_len,size(trim(blob_out)))

     if (m_output_buffer_len > 0)
          m_cc = 1
          while (m_cc)
             m_cc2 = findstring(m_linefeed,blob_out,m_cc)
             if (m_cc2)
                blob_len = m_cc2 - m_cc

                if (blob_len <= par_numcol)
                   m_blob_buf = substring(m_cc, blob_len, blob_out)

                   yOffset = y_pos + par_yoffset

                   if (par_check)
                         call print(calcpos( par_xpixel, yOffset ))  
                         call print( trim( check( m_blob_buf ) ))
                   else
                         call print(calcpos( par_xpixel, yOffset ))  
                         call print( trim( m_blob_buf )) 
                   endif

                   par_yoffset = par_yoffset + yIncrement
                   numLines = numLines + 1
                   row+1
                else
                    m_blobbuf = substring(m_cc, blob_len, blob_out)
                    CALL cclrtf_printline(par_numcol,blob_out,blob_len,par_check)
                endif

                if (m_cc2 >= m_output_buffer_len)
                    m_cc = 0
                else
                    m_cc = m_cc2+1
                endif

             else
                blob_len = m_output_buffer_len - m_cc + 1
                m_blobbuf = substring(m_cc, blob_len, blob_out)
                CALL cclrtf_printline(par_numcol,blob_out,blob_len,par_check)

                m_cc = 0
             endif
          endwhile
     endif
     m_numLines = numLines
end  ;subroutine cclrtf_print
;**********************************************************************************

subroutine
cclrtf_printline(par_numcol,blob_out,blob_len,par_check)
;**********************************************************************************
; parameters:
; par_numcol      ::  width to display the blob
; blob_out        ::  blob section to print
; blob_len        ::  length of current blob section
; par_check       ::  (0, dont print with check) (1, print with check option)
;**********************************************************************************

    textindex = 0
    numcol = par_numcol
    whiteflag = 0     
    printcol = 0
    rownum = 0
    lastline = 0
    m_linefeed = concat(char(10))

while (blob_len > 0)

    if (blob_len <= par_numcol)
       numcol = blob_len
       lastline = 1
    endif
    textindex = m_cc + par_numcol 

    if (lastline = 0)
        ; find last white space prior to max line width so words are not split at EOL
        whiteflag = 0
        while (whiteflag = 0)                        
           if ((substring( textindex, 1, blob_out ) = " ") OR
               (substring( textindex, 1, blob_out ) = m_linefeed) )          
                whiteflag = 1
           else
                textindex = textindex - 1
           endif
           if (textindex = m_cc OR textindex = 0)
                textindex = m_cc + par_numcol
                whiteflag = 1
           endif
        endwhile      
        numcol = textindex - m_cc + 1
    endif

    m_blob_buf = substring(m_cc, numcol, blob_out)        
    if (m_blob_buf > " ")
        numLines = numLines + 1

        yOffset = y_pos + par_yoffset
        if (par_check)
            call print(calcpos( par_xpixel, yOffset ))  
            call print( trim( check( m_blob_buf ) ))
        else
            call print(calcpos( par_xpixel, yOffset ))  
            call print( trim( m_blob_buf ) ) 
        endif
        par_yoffset = par_yoffset + yIncrement
        ROW+1
    else
        blob_len = 0
    endif
    m_cc = m_cc + numcol
    if (blob_len > numcol)
        blob_len = blob_len - numcol
    else
        blob_len = 0
    endif
endwhile
end ; subroutine cclrtf_printline



