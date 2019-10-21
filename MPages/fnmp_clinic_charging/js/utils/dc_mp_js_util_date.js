/*~BB~*************************************************************************
*                                                                       *
*  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
*                              Technology, Inc.                         *
*       Revision      (c) 1984-2009 Cerner Corporation                  *
*                                                                       *
*  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
*  This material contains the valuable properties and trade secrets of  *
*  Cerner Corporation of Kansas City, Missouri, United States of        *
*  America (Cerner), embodying substantial creative efforts and         *
*  confidential information, ideas and expressions, no part of which    *
*  may be reproduced or transmitted in any form or by any means, or     *
*  retained in any storage or retrieval system without the express      *
*  written permission of Cerner.                                        *
*                                                                       *
*  Cerner is a registered mark of Cerner Corporation.                   *
*                                                                       *
* 1. Scope of Restrictions                                              *
*  A.  Us of this Script Source Code shall include the right to:        *
*  (1) copy the Script Source Code for internal purposes;               *
*  (2) modify the Script Source Code;                                   *
*  (3) install the Script Source Code in Client’s environment.          *
*  B. Use of the Script Source Code is for Client’s internal purposes   *
*     only. Client shall not, and shall not cause or permit others, to  *
*     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
*     sublicense or otherwise transfer the Script Source Code, in       *
*     whole or part.                                                    *
* 2. Protection of Script Source Code                                   *
*  A. Script Source Code is a product proprietary to Cerner based upon  *
*     and containing trade secrets and other confidential information   *
*     not known to the public. Client shall protect the Script Source   *
*     Code with security measures adequate to prevent disclosures and   *
*     uses of the Script Source Code.                                   *
*  B. Client agrees that Client shall not share the Script Source Code  *
*     with any person or business outside of Client.                    *
* 3. Client Obligations                                                 *
*  A. Client shall make a copy of the Script Source Code before         *
*     modifying any of the scripts.                                     *
*  B. Client assumes all responsibility for support and maintenance of  *
*     modified Script Source Code.                                      *
*  C. Client assumes all responsibility for any future modifications to *
*     the modified Script Source Code.                                  *
*  D. Client assumes all responsibility for testing the modified Script * 
*     Source Code prior to moving such code into Client’s production    *
*     environment.                                                      *
*  E. Prior to making first productive use of the Script Source Code,   *
*     Client shall perform whatever tests it deems necessary to verify  *
*     and certify that the Script Source Code, as used by Client,       *
*     complies with all FDA and other governmental, accrediting, and    *
*     professional regulatory requirements which are applicable to use  *
*     of the scripts in Client's environment.                           *
*  F. In the event Client requests that Cerner make further             *
*     modifications to the Script Source Code after such code has been  *
*     modified by Client, Client shall notify Cerner of any             *
*     modifications to the code and will provide Cerner with the        *
*     modified Script Source Code. If Client fails to provide Cerner    *
*     with notice and a copy of the modified Script Source Code, Cerner *
*     shall have no liability or responsibility for costs, expenses,    *
*     claims or damages for failure of the scripts to function properly *
*     and/or without interruption.                                      *
* 4. Limitations                                                        *
*  A. Client acknowledges and agrees that once the Script Source Code is*
*     modified, any warranties set forth in the Agreement between Cerner*
*     and Client shall not apply.                                       *
*  B. Cerner assumes no responsibility for any adverse impacts which the*
*     modified Script Source Code may cause to the functionality or     *
*     performance of Client’s System.                                   *
*  C. Client waives, releases, relinquishes, and discharges Cerner from *
*     any and all claims, liabilities, suits, damages, actions, or      *
*     manner of actions, whether in contract, tort, or otherwise which  *
*     Client may have against Cerner, whether the same be in            *
*     administrative proceedings, in arbitration, at law, in equity, or *
*     mixed, arising from or relating to Client’s use of Script Source  *
*     Code.                                                             *
* 5. Retention of Ownership                                             *
*    Cerner retains ownership of all software and source code in this   *
*    service package. Client agrees that Cerner owns the derivative     *
*    works to the modified source code. Furthermore, Client agrees to   *
*    deliver the derivative works to Cerner.                            *
~BE~************************************************************************/
/******************************************************************************
 
Source file name:       dc_mp_js_util_date.js
 
Product:                Discern Content
Product Team:           Discern Content
 
File purpose:           Provides the functions to open a calendar
 
Special Notes:          <add any special notes here>
 
;~DB~**********************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
;**************************************************************************************
;*                                                                            		  *
;*Mod Date       Engineer             		Feature      Comment                      *
;*--- ---------- -------------------- 		------------ -----------------------------*
;*000 11/20/2009 JJ7138					    236373       Initial Release              *
;~DE~**********************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/



var JSCalstart;
var JSCalstop;
function JSCal(name, mode, target_el, multiselect, loffset, toffset, startdate, stopdate, currentdate, onfocusflag)
{

    this.state = 0;
    this.name = name;
    JSCalstart = new Date();
    this.beginDate = new Date();
    this.beginDate.setTime(startdate);
    JSCalstart.setTime(startdate);
    JSCalstop = new Date();
    this.endDate = new Date();
    this.endDate.setTime(stopdate);
    JSCalstop.setTime(stopdate);
    this.curDate = new Date();
    this.curDate.setTime(currentdate);
    this.curDate.setHours(0, 0, 0, 0);
    this.mode = mode;
    this.selectMultiple = (multiselect == true);
    this.selectedDates = new Array();
    this.JSCalendar;
    this.JSCalHeading;
    this.JSCalCells;
    this.rows;
    this.cols;
    this.cells = new Array();
    this.monthSelect;
    this.yearSelect;
    this.mousein = false;
    this.JSCalConfig();
    this.setDays();
    this.displayYear = this.displayYearInitial;
    this.displayMonth = this.displayMonthInitial;
    this.createJSCalendar();
    if (this.mode == 'popup' && target_el && target_el.type == 'text')
    {
        this.tgt = target_el;
        this.JSCalendar.style.position = 'absolute';
        this.topOffset = this.tgt.offsetHeight;
        this.leftOffset = 0;
        this.JSCalendar.style.top = this.getTop(target_el) + 22 + this.topOffset + toffset + 'px';
        this.JSCalendar.style.left = this.getLeft(target_el) + this.leftOffset + loffset + 'px';
        document.body.appendChild(this.JSCalendar);
        this.tgt.JSCalendar = this;
        if (onfocusflag == true)
        {
            this.tgt.onfocus = function ()
            {
                this.JSCalendar.show();
            };
            this.tgt.onblur = function ()
            {
                if (!this.JSCalendar.mousein)
                {
                    this.JSCalendar.hide();
                }
            };
        }

    }
    else
    {
        this.container = target_el;
        this.container.appendChild(this.JSCalendar);
    }
    this.state = 2;
    this.visible ? this.show() : this.hide();

    return;
}

JSCal.prototype.setLeft = function (leftoffset)
{
    this.JSCalendar.style.left = leftoffset + 'px';
    this.JSCalendar.style.zIndex = 1000;
}, JSCal.prototype.setTop = function (topoffset)
{
    this.JSCalendar.style.top = topoffset + 'px';
    this.JSCalendar.style.zIndex = 1000;
}, JSCal.prototype.JSCalConfig = function ()
{
    this.displayYearInitial = this.curDate.getFullYear();
    this.displayMonthInitial = this.curDate.getMonth();
    this.rangeYearLower = this.beginDate.getYear();
    this.rangeYearUpper = this.endDate.getYear();
    this.rangeMonthLower = this.beginDate.getMonth();
    this.rangeMonthUpper = this.endDate.getMonth();
    this.minDate = new Date(this.beginDate.getYear(), this.beginDate.getMonth(), this.beginDate.getDate());
    this.maxDate = new Date(this.endDate.getYear(), this.endDate.getMonth(), this.endDate.getDate());
    this.startDay = 0;
    this.showWeeks = false;
    this.selCurMonthOnly = false;
    this.clearSelectedOnChange = true;
    switch (this.mode)
    {
        case 'popup':
            this.visible = false;
            break;
        case 'flat':
            this.visible = true;
            break;
    }
    this.setLang();
};
JSCal.prototype.setLang = function ()
{
    this.daylist = new Array('Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa');
    this.months_sh = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    this.monthup_title = 'Go to the next month';
    this.monthdn_title = 'Go to the previous month';
    this.clearbtn_caption = '-';
    this.clearbtn_title = 'Clear date selected';
    this.maxrange_caption = 'This is the maximum range';
};
JSCal.prototype.getTop = function (element)
{
    var oNode = element;
    var iTop = 0;
    while (oNode != null && oNode != document.body && oNode != document.documentElement)
    {
        iTop += oNode.offsetTop;
        oNode = oNode.offsetParent;
    }
    return iTop;
};
JSCal.prototype.getLeft = function (element)
{
    var oNode = element;
    var iLeft = 0;
    while (oNode != null && oNode != document.body && oNode != document.documentElement)
    {
        iLeft += oNode.offsetLeft;
        oNode = oNode.offsetParent;
    }
    return iLeft;
};
JSCal.prototype.show = function ()
{
    var x = window.event.clientX + 5;
    var y = window.event.clientY + 10;
    this.JSCalendar.style.left = x;
    this.JSCalendar.style.top = y;
    this.JSCalendar.style.display = 'block';
    this.JSCalendar.style.zIndex = 3500;
    this.visible = true;
};
JSCal.prototype.hide = function ()
{
    this.JSCalendar.style.display = 'none';
    this.visible = false;
};
JSCal.prototype.toggle = function ()
{
    if (this.visible)
    {
        this.hide();
    }
    else
    {
        this.show();
    }
};
JSCal.prototype.setDays = function ()
{
    this.daynames = new Array();
    var j = 0;
    for (var i = this.startDay; i < this.startDay + 7; i++)
    {
        this.daynames[j++] = this.daylist[i];
    }
    this.monthDayCount = new Array(31, ((this.curDate.getFullYear() - 2000) % 4 ? 28 : 29), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
};
JSCal.prototype.setClass = function (element, className)
{
    element.setAttribute('class', className);
    element.setAttribute('className', className);
};
JSCal.prototype.createJSCalendar = function ()
{
    var tbody, tr, td;
    this.JSCalendar = document.createElement('table');
    this.JSCalendar.setAttribute('id', this.name + '_JSCalendar');
    this.setClass(this.JSCalendar, 'JSCalendar');
    this.JSCalendar.onselectstart = function ()
    {
        return false;
    };
    this.JSCalendar.ondrag = function ()
    {
        return false;
    };
    tbody = document.createElement('tbody');
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.appendChild(this.createMainHeading());
    tr.appendChild(td);
    tbody.appendChild(tr);
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.appendChild(this.createDayHeading());
    tr.appendChild(td);
    tbody.appendChild(tr);
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('id', this.name + '_cell_td');
    this.JSCalCellContainer = td;
    td.appendChild(this.createJSCalCells());
    tr.appendChild(td);
    tbody.appendChild(tr);
    this.JSCalendar.appendChild(tbody);
    this.JSCalendar.owner = this;
    this.JSCalendar.onmouseover = function ()
    {
        this.owner.mousein = true;
    };
    this.JSCalendar.onmouseout = function ()
    {
        this.owner.mousein = false;
    };
};
JSCal.prototype.createMainHeading = function ()
{
    var container = document.createElement('div');
    container.setAttribute('id', this.name + '_mainheading');
    this.setClass(container, 'mainheading');
    this.monthSelect = document.createElement('select');
    this.yearSelect = document.createElement('select');
    var clearSelected = document.createElement('input');
    clearSelected.setAttribute('type', 'button');
    clearSelected.setAttribute('value', this.clearbtn_caption);
    clearSelected.setAttribute('title', "Click to clear date");
    clearSelected.style.vertiJSCalAlign = "top";
    clearSelected.style.left = "0px";
    clearSelected.style.marginRight = "30px";
    clearSelected.owner = this;
    clearSelected.onclick = function ()
    {
        this.owner.resetSelections(false);
    };
    container.appendChild(clearSelected);
    var monthDn = document.createElement('input'), monthUp = document.createElement('input');
    var opt, i;
    for (i = 0; i < 12; i++)
    {
        opt = document.createElement('option');
        opt.setAttribute('value', i);
        if (this.state == 0 && this.displayMonth == i)
        {
            opt.setAttribute('selected', 'selected');
        }
        if (i >= this.beginDate.getMonth() && i <= this.endDate.getMonth())
        {
            opt.appendChild(document.createTextNode(this.months_sh[i]));
            this.monthSelect.appendChild(opt);
        }
    }
    for (i = this.rangeYearLower; i <= this.rangeYearUpper; i++)
    {
        opt = document.createElement('option');
        opt.setAttribute('value', i);
        if (this.state == 0 && this.displayYear == i)
        {
            opt.setAttribute('selected', 'selected');
        }
        opt.appendChild(document.createTextNode(i));
        this.yearSelect.appendChild(opt);
    }
    monthUp.setAttribute('type', 'button');
    monthUp.setAttribute('value', '>');
    monthUp.setAttribute('title', this.monthup_title);
    monthDn.setAttribute('type', 'button');
    monthDn.setAttribute('value', '<');
    monthDn.setAttribute('title', this.monthdn_title);
    this.monthSelect.owner = this.yearSelect.owner = monthUp.owner = monthDn.owner = this;
    monthUp.onmouseup = function ()
    {
        this.owner.nextMonth();
    };
    monthDn.onmouseup = function ()
    {
        this.owner.prevMonth();
    };
    this.monthSelect.onchange = function ()
    {
        this.owner.displayMonth = this.value;
        this.owner.displayYear = this.owner.yearSelect.value;
        this.owner.goToMonth(this.owner.displayYear, this.owner.displayMonth);
    };
    this.yearSelect.onchange = function ()
    {
        this.owner.displayMonth = this.owner.monthSelect.value;
        this.owner.displayYear = this.value;
        this.owner.goToMonth(this.owner.displayYear, this.owner.displayMonth);
    };
    container.appendChild(monthDn);
    container.appendChild(this.monthSelect);
    container.appendChild(this.yearSelect);
    container.appendChild(monthUp);
    var exitSelected = document.createElement('input');
    exitSelected.setAttribute('type', 'button');
    exitSelected.setAttribute('value', 'x');
    exitSelected.setAttribute('title', 'Click to exit JSCalendar');
    exitSelected.style.textAlign = 'right';
    exitSelected.style.marginLeft = '30px';
    exitSelected.owner = this;
    exitSelected.onclick = function ()
    {
        this.owner.hide();
    };
    container.appendChild(exitSelected);
    return container;
};
JSCal.prototype.resetSelections = function (returnToDefaultMonth)
{
    this.selectedDates = new Array();
    this.rows = new Array(false, false, false, false, false, false, false);
    this.cols = new Array(false, false, false, false, false, false, false);
    if (this.tgt)
    {
        this.tgt.value = '';
        if (this.mode == 'popup')
        {
            this.hide();
        }
    }
    if (returnToDefaultMonth == true)
    {
        this.goToMonth(this.displayYearInitial, this.displayMonthInitial);
    }
    else
    {
        this.reDraw();
    }
};
JSCal.prototype.createDayHeading = function ()
{
    this.JSCalHeading = document.createElement('table');
    this.JSCalHeading.setAttribute('id', this.name + '_JSCaldayheading');
    this.setClass(this.JSCalHeading, 'JSCaldayheading');
    var tbody, tr, td;
    tbody = document.createElement('tbody');
    tr = document.createElement('tr');
    this.cols = new Array(false, false, false, false, false, false, false);
    if (this.showWeeks)
    {
        td = document.createElement('td');
        td.setAttribute('class', 'wkhead');
        td.innerText = "Wk";
        td.setAttribute('className', 'wkhead');
        tr.appendChild(td);
    }
    for (var dow = 0; dow < 7; dow++)
    {
        td = document.createElement('td');
        td.appendChild(document.createTextNode(this.daynames[dow]));
        if (this.selectMultiple)
        {
            td.headObj = new JSCalHeading(this, td, (dow + this.startDay < 7 ? dow + this.startDay : dow + this.startDay - 7));
        }
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    this.JSCalHeading.appendChild(tbody);
    return this.JSCalHeading;
};
JSCal.prototype.createJSCalCells = function ()
{
    this.rows = new Array(false, false, false, false, false, false);
    this.cells = new Array();
    var row = -1, totalCells = (this.showWeeks ? 48 : 42);
    var beginDate = new Date(this.displayYear, this.displayMonth, 1);
    var endDate = new Date(this.displayYear, this.displayMonth, this.monthDayCount[this.displayMonth]);
    var sdt = new Date(beginDate);
    sdt.setDate(sdt.getDate() + (this.startDay - beginDate.getDay()) - (this.startDay - beginDate.getDay() > 0 ? 7 : 0));
    this.JSCalCells = document.createElement('table');
    this.JSCalCells.setAttribute('id', this.name + '_JSCalcells');
    this.setClass(this.JSCalCells, 'JSCalcells');
    var tbody, tr, td;
    tbody = document.createElement('tbody');
    for (var i = 0; i < totalCells; i++)
    {
        if (this.showWeeks)
        {
            if (i % 8 == 0)
            {
                row++;
                tr = document.createElement('tr');
                td = document.createElement('td');
                if (this.selectMultiple)
                {
                    td.weekObj = new WeekHeading(this, td, sdt.getWeek(), row)
                }
                else
                {
                    td.setAttribute('class', 'wkhead');
                    td.setAttribute('className', 'wkhead');
                }
                td.appendChild(document.createTextNode(sdt.getWeek()));
                tr.appendChild(td);
                i++;
            }
        }
        else
            if (i % 7 == 0)
            {
                row++;
                tr = document.createElement('tr');
            }
        td = document.createElement('td');
        td.appendChild(document.createTextNode(sdt.getDate()));
        var cell = new JSCalCell(this, td, sdt, row);
        this.cells.push(cell);
        td.cellObj = cell;
        sdt.setDate(sdt.getDate() + 1);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    this.JSCalCells.appendChild(tbody);
    this.reDraw();
    return this.JSCalCells;
};
JSCal.prototype.reDraw = function ()
{
    this.state = 1;
    var i, j;
    for (i = 0; i < this.cells.length; i++)
    {
        this.cells[i].selected = false;
    }
    for (i = 0; i < this.cells.length; i++)
    {
        if (this.selectedDates.length == 0)
        {
            if (Math.floor(this.curDate.getTime() - this.cells[i].date.getTime()) == 0)
            {
                this.cells[i].selected = true;
            }
        }
        else
        {
            for (j = 0; j < this.selectedDates.length; j++)
            {
                if (this.cells[i].date.getUeDay() == this.selectedDates[j].getUeDay())
                {
                    this.cells[i].selected = true;
                }
            }
        }
        this.cells[i].setClass();
    }
    this.state = 2;
};
JSCal.prototype.deleteCells = function ()
{
    this.JSCalCellContainer.removeChild(this.JSCalCellContainer.firstChild);
    this.cells = new Array();
};
JSCal.prototype.goToMonth = function (year, month)
{
    this.monthSelect.value = this.displayMonth = month;
    this.yearSelect.value = this.displayYear = year;
    this.deleteCells();
    this.JSCalCellContainer.appendChild(this.createJSCalCells());
};
JSCal.prototype.nextMonth = function ()
{
    if (this.monthSelect.value < 11 && this.monthSelect.value < this.rangeMonthUpper)
    {
        this.monthSelect.value++;
    }
    else
    {
        if (this.yearSelect.value < this.rangeYearUpper)
        {
            this.monthSelect.value = 0;
            this.yearSelect.value++;
        }
    }
    this.displayMonth = this.monthSelect.value;
    this.displayYear = this.yearSelect.value;
    this.deleteCells();
    this.JSCalCellContainer.appendChild(this.createJSCalCells());
};
JSCal.prototype.prevMonth = function ()
{
    if (this.monthSelect.value > 0 && this.monthSelect.value > this.rangeMonthLower)
        this.monthSelect.value--;
    else
    {
        if (this.yearSelect.value > this.rangeYearLower)
        {
            this.monthSelect.value = 11;
            this.yearSelect.value--;
        }
    }
    this.displayMonth = this.monthSelect.value;
    this.displayYear = this.yearSelect.value;
    this.deleteCells();
    this.JSCalCellContainer.appendChild(this.createJSCalCells());
};
JSCal.prototype.addZero = function (vNumber)
{
    return ((vNumber < 10) ? '0' : '') + vNumber;
};
JSCal.prototype.addDates = function (dates, redraw)
{
    var j, in_sd;
    for (var i = 0; i < dates.length; i++)
    {
        in_sd = false;
        for (j = 0; j < this.selectedDates.length; j++)
        {
            if (dates[i].getUeDay() == this.selectedDates[j].getUeDay())
            {
                in_sd = true;
                break;
            }
        }
        if (!in_sd)
        {
            this.selectedDates.push(dates[i]);
        }
    }
    if (redraw != false)
    {
        this.reDraw();
    }
};
JSCal.prototype.removeDates = function (dates, redraw)
{
    var j;
    for (var i = 0; i < dates.length; i++)
    {
        for (j = 0; j < this.selectedDates.length; j++)
        {
            if (dates[i].getUeDay() == this.selectedDates[j].getUeDay())
            {
                this.selectedDates.splice(j, 1);
            }
        }
    }
    if (redraw != false)
    {
        this.reDraw();
    }
};
JSCal.prototype.outputDate = function (vDate, vFormat)
{
    var vDay = this.addZero(vDate.getDate());
    var vMonth = this.addZero(vDate.getMonth() + 1);
    var vYearLong = this.addZero(vDate.getFullYear());
    var vYearShort = this.addZero(vDate.getFullYear().toString().substring(3, 4));
    var vYear = (vFormat.indexOf('yyyy') > -1 ? vYearLong : vYearShort);
    var vHour = this.addZero(vDate.getHours());
    var vMinute = this.addZero(vDate.getMinutes());
    var vSecond = this.addZero(vDate.getSeconds());
    return vFormat.replace(/dd/g, vDay).replace(/mm/g, vMonth).replace(/y{1,4}/g, vYear).replace(/hh/g, vHour).replace(/nn/g, vMinute).replace(/ss/g, vSecond);
};
JSCal.prototype.updatePos = function (target)
{
    this.JSCalendar.style.top = this.getTop(target) + this.topOffset + 'px';
    this.JSCalendar.style.left = this.getLeft(target) + this.leftOffset + 'px'
}, function JSCalHeading(owner, tableCell, dow)
{
    this.owner = owner;
    this.tableCell = tableCell;
    this.dayOfWeek = dow;
    this.tableCell.onclick = this.onclick;
}, JSCalHeading.prototype.onclick = function ()
{
    var owner = this.headObj.owner;
    var sdates = owner.selectedDates;
    var cells = owner.cells;
    owner.cols[this.headObj.dayOfWeek] = !owner.cols[this.headObj.dayOfWeek];
    for (var i = 0; i < cells.length; i++)
    {
        if (cells[i].dayOfWeek == this.headObj.dayOfWeek && (!owner.selCurMonthOnly || cells[i].date.getMonth() == owner.displayMonth && cells[i].date.getFullYear() == owner.displayYear))
        {
            if (owner.cols[this.headObj.dayOfWeek])
            {
                if (owner.selectedDates.arrayIndex(cells[i].date) == -1)
                {
                    sdates.push(cells[i].date);
                }
            }
            else
            {
                for (var j = 0; j < sdates.length; j++)
                {
                    if (cells[i].dayOfWeek == sdates[j].getDay())
                    {
                        sdates.splice(j, 1);
                        break;
                    }
                }
            }
            cells[i].selected = owner.cols[this.headObj.dayOfWeek];
        }
    }
    owner.reDraw();
};
function WeekHeading(owner, tableCell, week, row)
{
    this.owner = owner;
    this.tableCell = tableCell;
    this.week = week;
    this.tableRow = row;
    this.tableCell.setAttribute('class', 'wkhead');
    this.tableCell.setAttribute('className', 'wkhead');
    this.tableCell.onclick = this.onclick;
}

WeekHeading.prototype.onclick = function ()
{
    var owner = this.weekObj.owner;
    var cells = owner.cells;
    var sdates = owner.selectedDates;
    var i, j;
    owner.rows[this.weekObj.tableRow] = !owner.rows[this.weekObj.tableRow];
    for (i = 0; i < cells.length; i++)
    {
        if (cells[i].tableRow == this.weekObj.tableRow)
        {
            if (owner.rows[this.weekObj.tableRow] && (!owner.selCurMonthOnly || cells[i].date.getMonth() == owner.displayMonth && cells[i].date.getFullYear() == owner.displayYear))
            {
                if (owner.selectedDates.arrayIndex(cells[i].date) == -1)
                {
                    sdates.push(cells[i].date);
                }
            }
            else
            {
                for (j = 0; j < sdates.length; j++)
                {
                    if (sdates[j].getTime() == cells[i].date.getTime())
                    {
                        sdates.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
    owner.reDraw();
};
function JSCalCell(owner, tableCell, dateObj, row)
{
    this.owner = owner;
    this.tableCell = tableCell;
    this.cellClass;
    this.selected = false;
    this.date = new Date(dateObj);
    this.dayOfWeek = this.date.getDay();
    this.week = this.date.getWeek();
    this.tableRow = row;
    if ((dateObj.getTime() - JSCalstart.getTime()) >= 0 && (dateObj.getTime() - JSCalstop.getTime()) <= 0)
    {
        this.tableCell.onclick = this.onclick;
        this.tableCell.onmouseover = this.onmouseover;
        this.tableCell.onmouseout = this.onmouseout;
        this.setClass();
    }
    else
    {
        this.disabled = true;
        this.setClass();
    }
}

JSCalCell.prototype.onmouseover = function ()
{
    this.setAttribute('class', this.cellClass + ' hover');
    this.setAttribute('className', this.cellClass + ' hover');
};
JSCalCell.prototype.onmouseout = function ()
{
    this.cellObj.setClass();
};
JSCalCell.prototype.onclick = function ()
{
    var cell = this.cellObj;
    var owner = cell.owner;
    if (!owner.selCurMonthOnly || cell.date.getMonth() == owner.displayMonth && cell.date.getFullYear() == owner.displayYear)
    {
        if (owner.selectMultiple == true)
        {
            if (!cell.selected)
            {
                if (owner.selectedDates.arrayIndex(cell.date) == -1)
                {
                    owner.selectedDates.push(cell.date);
                }
            }
            else
            {
                var tmp = owner.selectedDates;
                for (var i = 0; i < tmp.length; i++)
                {
                    if (tmp[i].getUeDay() == cell.date.getUeDay())
                    {
                        tmp.splice(i, 1);
                    }
                }
            }
        }
        else
        {
            owner.selectedDates = new Array(cell.date);
            if (owner.tgt)
            {
                owner.tgt.value = owner.selectedDates[0].dateFormat();
                if (owner.mode == 'popup')
                {
                    owner.hide();
                }
            }
        }
        owner.reDraw();
    }
};
JSCalCell.prototype.setClass = function ()
{
    if (this.disabled)
    {
        this.cellClass = 'notallowed';
    }
    else
        if (this.selected)
        {
            this.cellClass = 'cell_selected';
        }
        else
            if (this.owner.displayMonth != this.date.getMonth())
            {
                this.cellClass = 'notmnth';
            }
            else
                if (this.date.getDay() > 0 && this.date.getDay() < 6)
                {
                    this.cellClass = 'wkday';
                }
                else
                {
                    this.cellClass = 'wkend';
                }
    if (this.date.getFullYear() == this.owner.curDate.getFullYear() && this.date.getMonth() == this.owner.curDate.getMonth() && this.date.getDate() == this.owner.curDate.getDate())
    {
        this.cellClass = this.cellClass + ' curdate';
    }
    this.tableCell.setAttribute('class', this.cellClass);
    this.tableCell.setAttribute('className', this.cellClass);
};
Date.prototype.getDayOfYear = function ()
{
    return parseInt((this.getTime() - new Date(this.getFullYear(), 0, 1).getTime()) / 86400000 + 1);
};
Date.prototype.getWeek = function ()
{
    return parseInt((this.getTime() - new Date(this.getFullYear(), 0, 1).getTime()) / 604800000 + 1);
};
Date.prototype.getUeDay = function ()
{
    return parseInt(Math.floor((this.getTime() - this.getTimezoneOffset() * 60000) / 86400000));
};
Date.prototype.dateFormat = function (format)
{
    if (!format)
    {
        format = 'm/d/Y';
    }
    LZ = function (x)
    {
        return (x < 0 || x > 9 ? '' : '0') + x
    };
    var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    format = format + "";
    var result = "";
    var i_format = 0;
    var c = "";
    var token = "";
    var y = this.getFullYear().toString();
    var M = this.getMonth() + 1;
    var d = this.getDate();
    var E = this.getDay();
    var H = this.getHours();
    var m = this.getMinutes();
    var s = this.getSeconds();
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    var value = new Object();
    value['Y'] = y.toString();
    value['y'] = y.substring(2);
    value['n'] = M;
    value['m'] = LZ(M);
    value['F'] = MONTH_NAMES[M - 1];
    value['M'] = MONTH_NAMES[M + 11];
    value['j'] = d;
    value['d'] = LZ(d);
    value['D'] = DAY_NAMES[E + 7];
    value['l'] = DAY_NAMES[E];
    value['G'] = H;
    value['H'] = LZ(H);
    if (H == 0)
    {
        value['g'] = 12;
    }
    else
        if (H > 12)
        {
            value['g'] = H - 12;
        }
        else
        {
            value['g'] = H;
        }
    value['h'] = LZ(value['g']);
    if (H > 11)
    {
        value['a'] = 'pm';
        value['A'] = 'PM';
    }
    else
    {
        value['a'] = 'am';
        value['A'] = 'AM';
    }
    value['i'] = LZ(m);
    value['s'] = LZ(s);
    while (i_format < format.length)
    {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length))
        {
            token += format.charAt(i_format++);
        }
        if (value[token] != null)
        {
            result = result + value[token];
        }
        else
        {
            result = result + token;
        }
    }
    return result;
};
Array.prototype.arrayIndex = function (searchVal, startIndex)
{
    startIndex = (startIndex != null ? startIndex : 0);
    for (var i = startIndex; i < this.length; i++)
    {
        if (searchVal == this[i])
        {
            return i;
        }
    }
    return -1;
};
