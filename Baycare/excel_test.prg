drop program excel_test go
create program excel_test

%i ccluserdir:excel_common.inc

select into "NL:"
from person p
where p.name_last_key = "SMITH"
head report 
    cnt = 0
    _d1 = startWorkbook("MyPersonWorksheet")
head p.person_id
    cnt = cnt + 1
    _d1 = addRow(null)
detail
    _d1 = addDateTime(p.birth_dt_tm)
    _d1 = addDouble(p.person_id)
    _d1 = addString(trim(p.name_full_formatted))
    _d1 = addint(1)
    
foot report
    _d1 = addRow(null)
    _d1 = addString(" ")
    _d1 = addString(" ")
    _d1 = addString(" ")
    form1 = build("SUM(R[-",cnt,"]C:R[-1]C")
    _d1 = addFormula(form1,1)
    _d1 = stopTable(null)
    _d1 = stopWorkSheet(null)
    
    
    _d1 = startWorkSheet("test")
    _d1 = startTable(null)
    _d1 = addRow(null)
   ; _d1 = startCell(~ss:StyleID="s65"~)
    _d1 = addString("FUCK!",~ss:StyleID="s65"~)
   ; _d1 = stopCell(null)
    
    
    _d1 = stopWorkbook(null)
with maxrec = 100

call writeWorkbook("CCLUSERDIR:MyPersonWorkbook.xml")

end
go
 execute excel_test go

