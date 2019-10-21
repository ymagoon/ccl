 	$(function() {
	
		$('.innerTable').each(function(){
		var numRows = $(this).find('tr').length;
			if (numRows >= 12) {
			$(this).parent().css('height', '16em');
			}
			else {
			$(this).parent().css('height', 'auto');
			}
		});	
		
		for(var i = 1; i <= graphCount; i++){
			
			$('#flotTable' + i + ' .dateHead').each(function () {
				var valDate = $(this).text();
				var year = parseInt(valDate.slice(0,4), 10);
				var month = parseInt(valDate.slice(5,7), 10);
				month = month - 1;
				var day = parseInt(valDate.slice(8,10), 10);
				var hours = parseInt(valDate.slice(11,13), 10);
				var minutes = parseInt(valDate.slice(14,17), 10);
				var tempDate = Date.UTC(year,month,day,hours,minutes);
				$(this).text(tempDate);
			});
					
			$('#flotTable'+i).each(function () {
				
				var tableMin = parseFloat($(this).find('td:first').text());
				var tableMax = 0;
				
				$(this).find('td').each(function () {
					if (parseFloat($(this).text()) < tableMin) {
						tableMin = parseFloat($(this).text());
					}
					if (parseFloat($(this).text()) > tableMax) {
						tableMax = parseFloat($(this).text());
					}
				});
			
				tableMin = tableMin - 5;
				tableMax = tableMax + 5;
				
				if ($(this).hasClass('bpTable')) {
					
					$(this).graphTable({graphNum: i, series: 'columns', width: '650px', height: '200px', min: tableMin, max: tableMax},
									   {series:{lines:{show:true}, points:{show: true}}, 
									   grid:{hoverable: true, backgroundColor: { colors: ["##DBE9CF", "#fff"]}}, 
									   xaxis:{mode: "time"}, 
									   legend:{show: true, noColumns: 2},selection: { mode: "x" }});					
				}
				else {
					$(this).graphTable({graphNum: i, series: 'columns', width: '650px', height: '200px',min: tableMin, max: tableMax},
									   {series:{lines:{show:true}, points:{show: true}},
										grid:{hoverable: true, backgroundColor: { colors: ["##DBE9CF", "#fff"]}}, 
										xaxis:{mode: "time"}, 
										legend:{show: false } , selection: { mode: "x" }});	
				}
			
			});
	 
			$('#flotTable' + i + ' th.dateHead').each(function () {
		 
				var ms =  parseFloat($(this).text());
				var d = new Date();
				localOffset = d.getTimezoneOffset() * 60000;
				offSet = ms + localOffset
				var dNow = new Date(offSet);
				var yr = dNow.getFullYear();
				yr = yr.toString().slice(2);
				var valDate = (dNow.getMonth()+1) + "/" + (dNow.getDate()) + "/" + yr;
				$(this).text(valDate);
			});
	 
			function showTooltip(x, y, contents) {
				$('<div id="tooltip">' + contents + '</div>').css( {
					position: 'absolute',
					display: 'none',
					top: y - 30,
					left: x - 20,
					border: '1px solid #000',
					padding: '2px',
					'background-color': '#FFFFCC',
					opacity: 0.80
				}).appendTo("body").fadeIn(200);
			}
	 
			var previousPoint = null;
			$(".flot-graph").bind("plothover", function (event, pos, item) {
				$("#x").text(pos.x.toFixed(2));
				$("#y").text(pos.y.toFixed(2));
		 

					if (item) {
						if (previousPoint != item.datapoint) {
							previousPoint = item.datapoint;
		 
							$("#tooltip").remove();
							var x = item.datapoint[0],
								y = item.datapoint[1];
	
							var ms = x;
							var d = new Date();
							localOffset = d.getTimezoneOffset() * 60000;
							offSet = ms + localOffset
							var dNow = new Date(offSet);
							var yr = dNow.getFullYear();
							yr = yr.toString().slice(2);
							var minutes = dNow.getMinutes();
							if(minutes < 10){
								minutes = "0" + minutes;
							}
		 
							showTooltip(item.pageX, item.pageY,
									  y + " " + item.series.label    + " | " + "Date: " + (dNow.getMonth()+1) + "/" + (dNow.getDate()) + "/" + yr + " " + (dNow.getHours()) + ":" + minutes );
						}
					}
					else {
						$("#tooltip").remove();
						previousPoint = null;
					}
		 
			});
	 
		} 
    });
 
 