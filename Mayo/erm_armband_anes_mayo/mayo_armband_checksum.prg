drop program mayo_armband_checksum go
create program mayo_armband_checksum

declare GenerateCheckDigit (cMRN = vc (ref)) = vc
 
declare clinicNumber 		= vc  ;declared only to test program. This should come from query/record structure
declare checkDigits 		= vc with public, constant("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%")
declare maxCheckDigit 		= i2 with public, constant(textlen(checkDigits))
declare checkDigitFormatted = vc
declare checkDigitsLen		= i2
declare idx 				= i2 ;clinicNumber digitCounter
declare sum					= i2
declare modulus				= i2
declare hold_num			= i2
declare temp_clinicDigit	= c1
declare godzilla			= vc
 
set clinicNumber = "10902379"

;call echo(clinicNumber)

;if "AC" is not first two characters of MRN then add it
if (substring(1,2,clinicNumber) != "AC")
	set clinicNumber = concat("AC", clinicNumber)
endif
 
;call echo(build("new clinic number:", clinicNumber))

set checkDigitsLen = textlen(clinicNumber) ;10

;call echo(build("checkDigitsLen:", checkDigitsLen))

set godzilla = GenerateCheckDigit(clinicNumber)
  
subroutine GenerateCheckDigit(mrn)
 
;reduced to single for statement for efficiency
for (idx = 1 to checkDigitsLen) ;1 to 10
;set temp_clinicDigit to corresponding idx character of clinicDigit (MRN)
	set temp_clinicDigit = substring(idx,1,mrn)
;find position of clinicDigit[idx] in checkDigits; added -1 to formula because C# lists start at 0, CCL lists start at 1
	set hold_num = findstring(temp_clinicDigit,checkDigits) - 1
 
;formula for sum; added +1 to formula to account for C#/CCL list difference
	set sum = sum + ((checkDigitsLen - idx + 1) * hold_num)
endfor
 
set modulus = mod(sum,43) + 1 ;account for C#/CCL list difference
 
set checkDigitFormatted = concat(mrn, substring(modulus,1,checkDigits))
 
return (checkDigitFormatted)
end ;endsub
 
 call echo(godzilla)
 
end
go
mayo_armband_checksum go
 
