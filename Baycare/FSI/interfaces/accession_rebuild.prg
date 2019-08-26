declare  accRebuild (tAcc) = c20

 ;*
 ;* Rebuilds a truncated accession to an unformatted accession number.
 ;*
 ;* The passed in accession number is returned string does not match 
 ;* the millennium size.
 ;*   

        if (validate (acc_setup->loaded, -1) = -1)

          record acc_setup
          (
            1 site_len  = i2
            1 year_len  = i2
            1 jseq_len  = i2
            1 min_len   = i2
            1 loaded    = i2
          )
          with persist
        endif

        subroutine accRebuild (_tAcc)

          set tAcc = fillstring (value (size (trim (_tAcc))), " ")
          set tAcc = _tAcc

          set uAcc = fillstring (20, " ")

          if (acc_setup->loaded = 0)

            select into "nl:" a.site_code_length, a.julian_sequence_length, 
                              a.year_display_length
            from accession_setup a
            where a.accession_setup_id = 72696.00
            detail
              acc_setup->loaded = 1
              acc_setup->site_len = a.site_code_length
              acc_setup->year_len = a.year_display_length
              acc_setup->jseq_len = a.julian_sequence_length

              acc_setup->min_len = acc_setup->site_len + acc_setup->jseq_len + 1
            with nocounter

          endif

          ;* Return the truncated accession number when the lookup of the 
          ;* ACCESSION_SETUP information failed.
          if (acc_setup->loaded = 0)
            return (tAcc)
          endif

          ;* Length of the truncated accession number.
          set tLen = size (tAcc, 1)

          ;* Return the truncated accession number when the length is less than
          ;* the minimum.
          if (tLen < acc_setup->min_len)
            return (tAcc)
          endif

          set SITE_LENGTH = 5
          set YEAR_LENGTH = 4
          set JDAY_LENGTH = 3
          set JSEQ_LENGTH = 6

          set _site = fillstring (value (SITE_LENGTH), "0")
          set _year = fillstring (value (YEAR_LENGTH), " ")
          set _jday = fillstring (value (JDAY_LENGTH), "0")
          set _jseq = fillstring (value (JSEQ_LENGTH), "0")

          ;* Extract the site prefix.
          set tSite = substring (1, acc_setup->site_len, tAcc)

          ;* Create the site prefix with the leading zeros.
          if ((SITE_LENGTH - acc_setup->site_len) > 0)
       set _site = concat(substring (1,(SITE_LENGTH - acc_setup->site_len),_site), 
                                substring (1, acc_setup->site_len, tSite))
          endif

          ;* Extract the julian sequence.
          set tPos = tLen - acc_setup->jseq_len
          set tSeq = substring (tPos + 1, acc_setup->jseq_len, tAcc)

          ;* Create julian sequence with leading zeros.
          if (JSEQ_LENGTH > acc_setup->jseq_len)
        set _jseq = concat(substring (1,(JSEQ_LENGTH - acc_setup->jseq_len),_jseq), 
                                substring (1, acc_setup->jseq_len, tSeq))
          else
            set _jseq = tSeq
          endif

          ;* Initialize the year and julian day.

          set _dttm = cnvtdatetime (sysdate)
          set _year = cnvtstring (year (_dttm))

          if (julian (_dttm) < 100)
            set _jday = concat ("0", cnvtstring (julian (_dttm)))
          else
            set _jday = cnvtstring (julian (_dttm))
          endif

          ;* Extract the year and the julian day.

      set tJul = fillstring (value ((tPos - acc_setup->site_len)), " ")
      set tJul = substring((acc_setup->site_len + 1),(tPos-acc_setup->site_len),tAcc)
      set tPos = size (tJul, 1) - JDAY_LENGTH

          ;* Extract the julian day.

          if (tPos > 0)

            ;* The accession was not truncated into the julian day.
      set _jday = substring (tPos + 1, JDAY_LENGTH, tJul)
      set _year = concat(substring(1,(YEAR_LENGTH-tPos),_year),substring(1,tPos,tJul))

          else

            ;* The accession was truncated into the julian day.
            set _jday=concat(substring(1,(JDAY_LENGTH-size(tJul, 1)),_jday),tJul)

          endif

          set uAcc = concat (trim (uAcc), _site, _year, _jday, _jseq)
          return (uAcc)

        end