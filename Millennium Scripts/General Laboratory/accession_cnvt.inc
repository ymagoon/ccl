 ;;Solution_Test/script/PathNet -- Common Services/ACCESSION_CNVT/ACCESSION_CNVT.INC Turn on black mode

;;--------------------------------------------------------------------------------------------------------------------;;
;; File:  accession_cnvt.inc                                                                                          ;;
;; Description: Accession conversion routines between HNAM and HNAC.                                                  ;;
;; Request Nbr: n/a                                                                                                   ;;
;;                                                                                                                    ;;
;;--------------------------------------------------------------------------------------------------------------------;;
;; Notes                                                                                                              ;;
;; ----- -------------------------------------------------------------------------------------------------------------;;
;;   000 accToHnac (acc_hnam) = HNAM -> HNAC                                                                          ;;
;;   000 accToHnam (acc_hnac) = HNAC -> HNAM                                                                          ;;
;;--------------------------------------------------------------------------------------------------------------------;;
;; Mod Date                  Feature    Description                                                                   ;;
;; --- -------- -----------  ---------- ------------------------------------------------------------------------------;;
;; 000 07/01/99 CERGYL       6255       File creation.                                                                ;;
;;--------------------------------------------------------------------------------------------------------------------;;

        declare  accToHnac (acc_hnam) = c20
        declare  accToHnam (acc_hnac) = c20

        ;*
        ;* Converts an unformatted millenium accession number to a classic accession number.
        ;*
        ;* The passed in accession number is returned string does not match the millenium size.
        ;*   

        subroutine accToHnac (acc_hnam)

          set acc_classic = fillstring (20, " ")

          set acc_sze = size (trim (acc_hnam))
          if (acc_sze != 18)
            return (acc_hnam)
          endif

          ;*
          ;* Create the classic site prefix from positions 4 and 5 of the millenium accession number. 
          ;*

          set classic_site = substring (4, 2, acc_hnam)

          ;*
          ;* Check to see if this an alpha prefexed number.
          ;*

          set alpha1 = substring (6, 1, acc_hnam)
          set alpha2 = substring (7, 1, acc_hnam)

          if (isnumeric (alpha1) and isnumeric (alpha2))
            set classic_year = substring (8, 2, acc_hnam)
            set classic_day = substring (10, 3, acc_hnam)
            set classic_julian_seq = substring (14, 5, acc_hnam)

            ;*
            ;* Add the shift indicator after the site code.
            ;*

            set acc_classic = concat (trim (acc_classic), classic_site, "0", classic_year, classic_day, classic_julian_seq)
          else
            set classic_prefix = substring (6, 2, acc_hnam)
            set classic_year = substring (10, 2, acc_hnam)
            set classic_prefix_seq = substring (13, 6, acc_hnam)
            set acc_classic = concat (trim (acc_classic), classic_site, classic_prefix, classic_year, classic_prefix_seq)
          endif

          return (acc_classic)
        end

        ;*
        ;* Converts an unformatted classic accession number to a millenium accession
        ;*
        ;*   The passed in accession number is returned string does not match the millenium size.
        ;*   

        subroutine accToHnam (acc_hnac)

          set acc_mill = fillstring (20, " ")

          set acc_sze  = size (trim (acc_hnac))
          if (acc_sze != 12 and acc_sze != 13)
            return (acc_hnac)
          endif

          ;*
          ;* Create the classic site prefix from positions 4 and 5 of the milleni 
          ;*

          set mill_site = concat ("000", substring (1, 2, acc_hnac))

          ;*
          ;* Check to see if this an alpha prefexed number.
          ;*

          set alpha1 = substring (3, 1, acc_hnac)
          set alpha2 = substring (4, 1, acc_hnac)

          set julian = 0
          if (isnumeric (alpha1) and isnumeric (alpha2))
            set julian = 1
          endif

          set cur_year = Year (cnvtdatetime (curdate, 0))
          set mill_year = cnvtstring (cur_year)

          set mill_day = fillstring (3, " ")
          set mill_julian_seq = fillstring (5, " ")

                    
          if (julian = 1)
            set mill_year = concat (substring (1, 2, mill_year), substring (4, 2, acc_hnac))
            set mill_day = substring (6, 3, acc_hnac)
            set mill_julian_seq = concat (trim (mill_julian_seq), substring (9, 5, acc_hnac))
          else
            set mill_prefix = substring (3, 2, acc_hnac)
            set mill_year = concat (substring (1, 2, mill_year), substring (5, 2, acc_hnac))
            set mill_prefix_seq = substring (7, 6, acc_hnac)
          endif

          ;*
          ;* Calculate the current century for the classic accession number.
          ;*

          set acc_year = cnvtint (mill_year)
          if (acc_year != cur_year)
            set dec_year = cur_year + 10
            if (acc_year > dec_year)
              set acc_year = acc_year - 100
            elseif (acc_year < dec_year)
              if (acc_year < (dec_year - 100))
                set acc_year = acc_year + 100
              endif
            endif

            if ((acc_year - mod (acc_year, 100)) != (cur_year - mod (cur_year, 100)))
              set mill_year = cnvtstring (acc_year)
            endif
          endif

          if (julian = 1)
            set acc_mill = concat (trim (acc_mill), mill_site, substring (1, 4, mill_year), mill_day, "0", mill_julian_seq)
          else
            set acc_mill = concat (trim (acc_mill), mill_site, mill_prefix, substring (1, 4, mill_year), "0", mill_prefix_seq)
          endif

          return (acc_mill)
        end

;Generated by GNU enscript 1.6.4.
