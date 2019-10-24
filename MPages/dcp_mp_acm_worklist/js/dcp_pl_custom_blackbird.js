
( function() {
	
	window.attachEvent("onload",
	function() {
		function exportLog() {
			m_controller.exportLogData();
		}
		function selectAllText() {
			var text = document.getElementsByClassName('mainBody')[0];
			var range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		}	
        var $bbFilter=$("#bbFilters");
        if($bbFilter.length > 0){
			var $exportLink = $('<a></a>', {
			  id: 'exportLink',
			  href: '#'
			}).text('Export')
			  .click(exportLog);

			var $selectAllTextLink = $('<a></a>', {
			  id: 'selectAll',
			  href: '#'
			}).text('Select All')
			  .click(selectAllText);

			var customButtons = [
			  $exportLink,
			  $selectAllTextLink
			];
			
			customButtons.forEach(function(button){
				var $customButtonsWrapper = $('<div></div>',{
				class:'alignDivLeft'
				}).append(button);
				$('#bbFilters').append($customButtonsWrapper);
			});
			$('#bbControls > .clear').toggleClass('clear bbClearButton'); //change class name of clear button as it conflicts with ckeditor class,causing it to be hidden.
		}
	});
})();
	