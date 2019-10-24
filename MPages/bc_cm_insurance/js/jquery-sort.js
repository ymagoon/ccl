(function(jQuery) {
	$.fn.qsort = function(o) {
		qlog = function(m) {
			if(window.console && console.log) {
				console.log(m);
			}else {
				alert(m);
			}
		};
		function partition(array, begin, end, pivot)
		{
			var pvt=array[pivot];
			array = swap(array, pivot, end-1);
			var store=begin;
			var ptr;
			for(ptr=begin; ptr<end-1; ++ptr) {
				if(array[ptr]<=pvt) {
					array = swap(array, store, ptr);
					++store;
				}
			}
			array = swap(array, end-1, store);
			return store;
		};
		function qsort(array, begin, end)
		{
			if(end-1>begin) {
				var pivot=begin+Math.floor(Math.random()*(end-begin));
	
				pivot=partition(array, begin, end, pivot);
	
				qsort(array, begin, pivot);
				qsort(array, pivot+1, end);
			}
		};
		function quick_sort(array)
		{
			qsort(array, 0, array.length);
		};
		function swap(array, a, b) {
			var tmp=array[a];
			array[a]=array[b];
			array[b]=tmp;
			return array;
		};
		function convertToLower(arr) {
			var igAr = new Array();
			$(arr).each(function(i) {
				igAr.push(this.toString().toLowerCase());
			});
			return igAr;
		};
		var defaults = {
				order: "asc",
				attr: "value",
				ignoreCase: false,
				digits: false
			};
		o = $.extend(defaults, o);
		try{
			var values = new Array();
			var oldValues = new Array();
			var elems = new Array();
			var i = 0;
			$(this).each(function() {
				elems.push($(this));
				var v = $(this).attr(o.attr);
				if(o.digits == true) {
					v = parseInt(v);
				}
				oldValues.push(v);
				values.push(v);
			});
			if(o.ignoreCase == true) {
				values = convertToLower(values);
				oldValues = convertToLower(oldValues);
			}
			quick_sort(values);
			var sortedElems = new Array();
			$(values).each(function() {
				var loc = -1;
				if(o.digits==true) {
					loc = $.inArray(parseInt(this.toString()), oldValues);
				}else {
					loc = $.inArray(this.toString(), oldValues);
				}
				sortedElems.push(elems[loc]);
				oldValues[loc] = null;
			});
			if(o.order == "desc") {
				for(i = 0; i < oldValues.length - 1; i++) {
					$(sortedElems[i]).before($(sortedElems[i+1]));			
				}	
			}else {
				for(i = 0; i < oldValues.length - 1; i++) {
					$(sortedElems[i]).after($(sortedElems[i+1]));			
				}			
			}
			return $(this);
		}catch(e) {
			qlog("qsort says: There was an error while selecting elements or the options.");
		}
	}
})(jQuery);
