/**
 * Copyright (c) 2009 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris dot leonello at gmail 
 * dot com or see http://www.jqplot.com/info.php .  This is, of course, 
 * not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * Thanks for using jqPlot!
 * 
 */
(function($) {
    // class: $.jqplot.MarkerRenderer
    // The default jqPlot marker renderer, rendering the points on the line.
    $.jqplot.MarkerRenderer = function(options){
        // Group: Properties
        // prop: show
        // wether or not to show the marker.
        this.show = true;
        // prop: style
        // One of diamond, circle, square, x, plus, dash, filledDiamond, filledCircle, filledSquare
        this.style = 'filledCircle';
        // prop: lineWidth
        // size of the line for non-filled markers.
        this.lineWidth = 2;
        // prop: size
        // Size of the marker (diameter or circle, length of edge of square, etc.)
        this.size = 9.0;
        // prop: color
        // color of marker.  Will be set to color of series by default on init.
        this.color = '#666666';
        // prop: shadow
        // wether or not to draw a shadow on the line
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        // prop: shadowRenderer
        // Renderer that will draws the shadows on the marker.
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
        // prop: shapeRenderer
        // Renderer that will draw the marker.
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
		// prop: whiskerColor
		// line color for a whisker line if drawn.
		this.whiskerColor = "#000000";
		// prop: whiskerData
		// data that is converted into whisker lines according to the "x" values passed in.
		// format: [[x, y1, y2],...]]
		this.whiskerData = [];
		// prop: _whiskerData
		// data (in pixels) that is converted into whisker lines according to the "x" values passed in.
		// format: [[x, y1, y2],...]]
		this._whiskerData = [];
	
        $.extend(true, this, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.init = function(options) {
		$.extend(true, this, options);
        var sdopt = {angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, lineWidth:this.lineWidth, depth:this.shadowDepth, closePath:true};
        if (this.style.indexOf('filled') != -1) {
            sdopt.fill = true;
        }
        if (this.style.indexOf('ircle') != -1) {
            sdopt.isarc = true;
            sdopt.closePath = false;
        }
        this.shadowRenderer.init(sdopt);
        var shopt = {fill:false, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:true};
        if (this.style.indexOf('filled') != -1) {
            shopt.fill = true;
        }
        if (this.style.indexOf('ircle') != -1) {
            shopt.isarc = true;
            shopt.closePath = false;
        }
        this.shapeRenderer.init(shopt);
    };
	
	$.jqplot.MarkerRenderer.prototype.drawLine = function(x1, y1, x2, y2, ctx){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.restore();
	};
	
	$.jqplot.MarkerRenderer.prototype.drawUpVee = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/1/stretch;
        var dy = this.size/1*stretch;
		var opts = $.extend(true, {}, this.options, {closePath:false});
        var points = [[x+dx,y+dy],[x,y],[x-dx,y+dy]];
		if (this.shadow) {
            this.shadowRenderer.draw(ctx, points, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points, opts);

		ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawDownVee = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/1/stretch;
        var dy = this.size/1*stretch;
		var opts = $.extend(true, {}, this.options, {closePath:false});
        var points = [[x+dx,y-dy],[x,y],[x-dx,y-dy]];
		if (this.shadow) {
            this.shadowRenderer.draw(ctx, points, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points, opts);

		ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawDiamond = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y], [x, y+dy], [x+dx, y], [x, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawStar = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = 0-(this.size/2*stretch);
		var dyE = 0-(this.size/1.5*stretch);
        var points = [[x,y+dyE],[x+(dx/3),y+(dy/2)],[x+dx,y+(dy/2)],[x+(dx/2),y],[x+dx,y-dy],[x,y-(dy/2)],[x-dx,y-dy],[x-(dx/2),y],[x-dx,y+(dy/2)],[x-(dx/3),y+(dy/2)]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawRectangleDiag = function(x, y, ctx, fill, options, direction) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = null;
		switch (direction)
		{
			case "l":
				points = [[x, y+dy], [x+dx, y+(dy/2)], [x, y-dx], [x-dx,y-(dy/2)]];
				break;
			default: //right
				points = [[x, y+dy], [x+dx, y-(dy/2)], [x, y-dx], [x-dx,y+(dy/2)]];
				break;
		}
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
    
	$.jqplot.MarkerRenderer.prototype.drawTriangle = function(x, y, ctx, fill, options, direction) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = null;
		switch (direction)
		{
			case "r":
				points = [[x+dx, y], [x-dx, y-dy], [x-dx, y+dx]];
				break;
			case "l":
				points = [[x-dx, y], [x+dx, y-dy], [x+dx, y+dx]];
				break;
			case "d":
				points = [[x, y+dy], [x-dx, y-dy], [x+dx, y-dx]];
				break;
			default: //up
				points = [[x, y-dy], [x-dx, y+dy], [x+dx, y+dx]];
				break;
		}
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawRectangle = function(x, y, ctx, fill, options, direction) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
		switch (direction)
		{
			case "v":
				dx = this.size/4*stretch;
				break;
			default: //horizontal
				dy = this.size/4*stretch;
				break;
		}
        var points = [[x-dx, y-dy], [x-dx, y+dy], [x+dx, y+dy], [x+dx, y-dy]];
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawHeart = function(x, y, ctx, fill, options) {
        var stretch = 1.5;
        var dx = this.size/2*stretch;
        var dy = 0-(this.size/2*stretch);
        var points = [[x, y+(dy/2)], [x+(dx/3), y+dy], [x+dx, y+dy], [x+dx, y], [x, y-dy], [x-dx, y], [x-dx, y+dy], [x-(dx/3), y+dy]];
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
    $.jqplot.MarkerRenderer.prototype.drawPlus = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points1 = [[x, y-dy], [x, y+dy]];
        var points2 = [[x+dx, y], [x-dx, y]];
        var opts = $.extend(true, {}, this.options, {closePath:false});
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points1, {closePath:false});
            this.shadowRenderer.draw(ctx, points2, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points1, opts);
        this.shapeRenderer.draw(ctx, points2, opts);

        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawX = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var opts = $.extend(true, {}, this.options, {closePath:false});
        var points1 = [[x-dx, y-dy], [x+dx, y+dy]];
        var points2 = [[x-dx, y+dy], [x+dx, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points1, {closePath:false});
            this.shadowRenderer.draw(ctx, points2, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points1, opts);
        this.shapeRenderer.draw(ctx, points2, opts);

        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawDash = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y], [x+dx, y]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawSquare = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y-dy], [x-dx, y+dy], [x+dx, y+dy], [x+dx, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
		
        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawCircle = function(x, y, ctx, fill, options) {
        var radius = this.size/2;
        var end = 2*Math.PI;
        var points = [x, y, radius, 0, end, true];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
        
        ctx.restore();
    };
	$.jqplot.MarkerRenderer.prototype.drawWhiskerLine = function( x, y, ctx, fill, options )
	{
		var y1 = y, y2 = y, wLen = (this._whiskerData)?this._whiskerData.length:0;
		for (var cnt = 0; cnt < wLen; cnt++) {
			if (this._whiskerData[cnt][0] == x) {
				y1 = this._whiskerData[cnt][1];
				y2 = this._whiskerData[cnt][2];
				break;
			}
		}
		var points = [];
		if (y1 !== y || y2 !== y) {		
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x,y1);
			ctx.lineTo(x,y2);
			ctx.strokeStyle = this.whiskerColor;
			ctx.stroke();
			ctx.restore();
		}
	};
	
    $.jqplot.MarkerRenderer.prototype.draw = function(x, y, ctx, options) {
        options = options || {};
		this.drawWhiskerLine(x,y,ctx, false, options);
        switch (this.style) {
			case 'upVee':
				this.drawUpVee(x,y,ctx, false, options);
				break;
			case 'downVee':
				this.drawDownVee(x,y,ctx, false, options);
				break;
			case 'diamond':
				this.drawDiamond(x,y,ctx, false, options);
				break;
			case 'filledDiamond':
				this.drawDiamond(x,y,ctx, true, options);
				break;
			case 'star':
				this.drawStar(x,y,ctx, false, options);
				break;
			case 'filledStar':
				this.drawStar(x,y,ctx, true, options);
				break;
			case 'rectDiagRight':
				this.drawRectangleDiag(x,y,ctx, false, options, "r");
				break;
			case 'filledRectDiagRight':
				this.drawRectangleDiag(x,y,ctx, true, options, "r");
				break;
			case 'rectDiagLeft':
				this.drawRectangleDiag(x,y,ctx, false, options, "l");
				break;
			case 'filledRectDiagLeft':
				this.drawRectangleDiag(x,y,ctx, true, options, "l");
				break;
			case 'triangleRight':
				this.drawTriangle(x,y,ctx, false, options, "r");
				break;
			case 'filledTriangleRight':
				this.drawTriangle(x,y,ctx, true, options, "r");
				break;
			case 'triangleLeft':
				this.drawTriangle(x,y,ctx, false, options, "l");
				break;
			case 'filledTriangleLeft':
				this.drawTriangle(x,y,ctx, true, options, "l");
				break;
			case 'triangleUp':
				this.drawTriangle(x,y,ctx, false, options, "u");
				break;
			case 'filledTriangleUp':
				options = {fill:true, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:true};
				this.drawTriangle(x,y,ctx, true, options, "u");
				break;
			case 'triangleDown':
				this.drawTriangle(x,y,ctx, false, options, "d");
				break;
			case 'filledTriangleDown':
				this.drawTriangle(x,y,ctx, true, options, "d");
				break;	
			case 'rectHorizontal':
				this.drawRectangle(x,y,ctx, false, options, "h");
				break;
			case 'filledRectHorizontal':
				this.drawRectangle(x,y,ctx, true, options, "h");
				break;	
			case 'rectVertical':
				this.drawRectangle(x,y,ctx, false, options, "v");
				break;
			case 'filledRectVertical':
				this.drawRectangle(x,y,ctx, true, options, "v");
				break;	
			case 'heart':
				this.drawHeart(x,y,ctx, false, options);
				break;
			case 'filledHeart':
				this.drawHeart(x,y,ctx, true, options);
				break;
			case 'circle':
				this.drawCircle(x,y,ctx, false, options);
				break;
			case 'filledCircle':
				this.drawCircle(x,y,ctx, true, options);
				break;
			case 'square':
				this.drawSquare(x,y,ctx, false, options);
				break;
			case 'filledSquare':
				this.drawSquare(x,y,ctx, true, options);
				break;
			case 'x':
				this.drawX(x,y,ctx, true, options);
				break;
			case 'plus':
				this.drawPlus(x,y,ctx, true, options);
				break;
			case 'dash':
				this.drawDash(x,y,ctx, true, options);
				break;
			default:
				this.drawDiamond(x,y,ctx, false, options);
				break;
        }
    };
})(jQuery);