declare begWorkbook = vc with constant(concat(~<?xml version="1.0"?>~,
~<?mso-application progid="Excel.Sheet"?>~,
~<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"~,
~ xmlns:o="urn:schemas-microsoft-com:office:office"~,
~ xmlns:x="urn:schemas-microsoft-com:office:excel"~,
~ xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"~,
~ xmlns:html="http://www.w3.org/TR/REC-html40">~))
declare endWorkbook = vc with constant("</Workbook>")
declare begWorkSheet = vc with constant(~<Worksheet ss:Name="__NAME__">~)
declare endWorkSheet = vc with constant(~</Worksheet>~)
declare begTable = vc with constant("<Table>")
declare endTable = vc with constant("</Table>")
declare begRow = vc with constant("<Row>")
declare endRow = vc with constant("</Row>")
declare begCell = vc with constant("<Cell __STYLE__>")
declare endCell = vc with constant("</Cell>")
declare vcData = vc with constant(~<Data ss:Type="__TYPE__">__DATA__</Data>~)
declare typeNumber = vc with constant("Number")
declare typeDateTime = vc with constant("DateTime")
declare typeString = vc with constant("String")
 
declare LF = c1 with constant(char(10))
declare vcStyle = vc with constant( concat(~<Styles>~,
~  <Style ss:ID="Default" ss:Name="Normal">~,
~   <Alignment ss:Vertical="Bottom"/>~,
~   <Borders/>~,
~   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>~,
~   <Interior/>~,
~   <NumberFormat/>~,
~   <Protection/>~,
~  </Style>~,
~  <Style ss:ID="s62">~,
~   <NumberFormat ss:Format="[$-409]m/d/yy\ h:mm\ AM/PM;@"/>~,
~  </Style>~,
~  <Style ss:ID="s65">~,
~   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFC000" ss:Bold="1"/>~,
~   <Interior ss:Color="#FF0000" ss:Pattern="Solid"/>~,
~  </Style>~,
~ </Styles>~
 ))
 
declare vcWorkbook = vc
declare bWorkbook = i1
declare bWorksheet = i1
declare bTable = i1
declare bRow = i1
declare bCell = i1
 
declare startWorkbook(worksheetname=vc)=null
declare stopWorkbook(null)=null
declare startWorsheet(name=vc)=null
declare stopWorkSheet(null)=null
declare startTable(null)=null
declare stopTable(null)=null
declare startRow(null)=null
declare stopRow(null)=null
declare startCell(style = vc)=null
declare stopCell(null)=null
 
declare addRow(null)=null
declare addCell(style=vc)=null
declare addDateTime(data=f8)=null
declare addString(data=vc, style=vc(value, " "))=null
declare addDouble(data=f8)=null
declare addInt(data=i4)=null
declare addFormula(formula=vc,data=vc)=null
declare writeWorkbook(filename=vc)=i4
 
subroutine startWorkbook(workSheetName)
    if(bWorkbook=0)
        set vcWorkbook = concat(begWorkbook,LF,vcStyle,LF)
        set bWorkbook = 1
        set bWorkSheet = 0
        set bTable = 0
        set bRow = 0
        set bCell = 0
        if(workSheetName>" ")
          set _d1 = startWorkSheet(workSheetName)
        endif
     endif
end
subroutine stopWorkbook(null)
    if(bWorkbook)
        set _d1 = stopWorkSheet(null)
        set vcWorkbook = concat(vcWorkbook,endWorkbook,LF)
        set bWorkbook = 0
    endif
end
subroutine startWorkSheet(name)
    if(bWorksheet=0)
        set vcWorkbook = concat(vcWorkbook,replace(begWorkSheet,"__NAME__",name),LF)
        set _d1 = startTable(null)
        set bWorksheet = 1
    endif
end
subroutine stopWorkSheet(null)
    if(bWorksheet)
        set _d1 = stopTable(null)
        set vcWorkbook = concat(vcWorkbook,endWorkSheet,LF)
        set bWorkSheet = 0
    endif
end
subroutine startTable(null)
    if(bTable=0)
        set vcWorkbook = concat(vcWorkbook,begTable,LF)
        set bTable = 1
    endif
end
subroutine stopTable(null)
    if(bTable)
        set _d1=stopRow(null)
        set vcWorkbook = concat(vcWorkbook,endTable,LF)
        set bTable=0
    endif
end
subroutine startRow(null)
    if(bRow=0)
        set vcWorkbook = concat(vcWorkbook,begRow,LF)
        set bRow = 1
    endif
end
subroutine stopRow(null)
    if(bRow)
        set _d1 = stopCell(null)
        set vcWorkbook = concat(vcWorkbook,endRow,LF)
        set bRow = 0
    endif
end
subroutine startCell(style)
    if(bCell=0)
        set vcWorkbook = concat(vcWorkbook,replace(replace(begCell,"__STYLE__",style),"  >",">"),LF)
        set bCell = 1
    endif
end
subroutine stopCell(null)
    if(bCell)
        set vcWorkbook = concat(vcWorkbook,endCell,LF)
        set bCell = 0
    endif
end
subroutine addRow(null)
    set _d1 = stopRow(null)
    set _d1 = startRow(null)
end
subroutine addCell(style)
    set _d1 = stopCell(null)
    set _d1 = startCell(style)
    set bCell = 1
end
subroutine addDateTime(data)
    declare vcDT = vc with protect
    set _d1 = addCell(~ss:StyleID="s62"~)
    set vcDT = replace(replace(vcData,"__TYPE__",typeDateTime),
            "__DATA__",trim(format(cnvtdatetime(data),"YYYY-MM-DDThh:mm:ss.000;;q")))
    set vcWorkbook = concat(vcWorkbook,vcDT,LF)
end
 
subroutine addString(data, style)
    declare vcString = vc with protect
    set _d1 = addCell(style)
    set vcString = replace(replace(vcData,"__TYPE__",typeString),"__DATA__",data)
    set vcWorkbook = concat(vcWorkbook,vcString,LF)
end
 
subroutine addDouble(data)
    declare vcDouble = vc with protect
    set _d1 = addCell(" ")
    set vcDouble = replace(replace(vcData,"__TYPE__",typeNumber),"__DATA__",build(data))
    set vcWorkbook = concat(vcWorkbook,vcDouble,LF)
end
 
subroutine addInt(data)
    declare vcInt = vc with protect
    set _d1 = addCell(" ")
    set vcInt = replace(replace(vcData,"__TYPE__",typeNumber),"__DATA__",build(data))
    set vcWorkbook = concat(vcWorkbook,vcInt,LF)
end
 
subroutine addFormula(formula,data)
    declare vcForm = vc with protect
    set _d1 = addCell(concat(~ss:Formula="=~,trim(formula),~)"~))
    set vcForm = replace(replace(vcData,"__TYPE__",typeNumber),"__DATA__",build(data))
    set vcWorkbook = concat(vcWorkbook,vcForm,LF)
end
subroutine writeWorkbook(filename)
    record frec(
       1 file_desc = i4
       1 file_offset = i4
       1 file_dir = i4
       1 file_name = vc
       1 file_buf = vc
     )
     declare _stat = i4
     set frec->file_name = filename
     set frec->file_buf = "w"
     set _stat = CCLIO("OPEN",frec)
     set frec->file_buf = notrim(vcWorkbook)
     set _stat = CCLIO("WRITE",frec)
     set _stat = CCLIO("CLOSE",frec)
end
 

