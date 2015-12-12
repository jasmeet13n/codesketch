/* Sketch.js*/

// Global functions
var getUUID;
getUUID = function () {
  var S4;
  S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

var getTime;
getTime = function () {
	return new Date().getTime();
};

/******************************************
 * S K E T C H    E D I T O R
 ******************************************/
SketchEditor = function(el, options) {
	// configurations
	var config = {
		// default width and height of the canvas.
		width:700,
		height:500,

		// enable grid and grid options
		enabled:true,
		grid:{
			show:true,
			scale:{
				major: 40,
				minor: 20
			},
			colors:{
				major : "#444",
				minor : "#eee"
			}
		}
	};

	$.extend(config, options);

	// Initialization
	var editor = this;
	var rootElement = el;

	$(el).append('<div><canvas class="sketch-canvas" width="' + config.width + 'px" height="' + config.height + 'px"></canvas></div>');

	var canvas = $(".sketch-canvas",rootElement)[0];
	var ctx = canvas.getContext("2d");
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	var sketch = new Code(100);

  var undoArray;
  undoArray = new Array();
  var redoArray;
  redoArray = new Array();

	var currentStroke = null;
	var newThingsToBeDrawn = true;

	var onStrokeListener = function() {};

	// Mouse Listeners (@jasmeet13n add touch listeners)
	var setMouseListeners;
	setMouseListeners = function () {
		// Mouse down event listener.
		$(canvas).mousedown(function (e) {
			currentStroke = new Stroke();
			currentStroke.style = new Style();
			currentStroke.style.stroke = new Color(100, 0, 200);
			currentStroke.style.strokeWidth = 3;
			currentStroke.addPoint(new Point(e.offsetX, e.offsetY));
			editor.newThingsAddedForDrawing();
		});

		// Mouse move event listener.
		$(canvas).mousemove(function (e) {
			if (currentStroke != null) {
				currentStroke.addPoint(new Point(e.offsetX, e.offsetY));
				editor.newThingsAddedForDrawing();
			}
		});

		// Mouse up event listener.
		$(canvas).mouseup(function (e) {
			if (currentStroke != null) {
        currentStroke.addPoint(new Point(e.offsetX, e.offsetY));
        sketch.addStrokeToLine(currentStroke, 0);
				onStrokeListener(currentStroke);
				editor.newThingsAddedForDrawing();
				currentStroke = null;
			}
		});
	};

	// Enable mouse listeners if config says so.
	if(config.enabled){
		setMouseListeners();
	}

	// Clear the current  sketch.
	this.clear = function(){
		sketch = new Code(100);
    ctx.clearRect(0, 0, $(canvas).width(), $(canvas).height());
		currentStroke = null;
		editor.newThingsAddedForDrawing();
	};

	// Draw functions
	var interval;
	this.newThingsAddedForDrawing = function(){
		newThingsToBeDrawn = true;
		//draw();
	};
	this.start = function(){
		interval = setInterval(draw, 50);
	};
	this.stop = function() {
		clearInterval(interval);
	};
	var draw = function(){
		if(newThingsToBeDrawn){
			ctx.save();
			if(currentStroke)
				currentStroke.draw(ctx);
			ctx.restore();
			ctx.save();
			newThingsToBeDrawn = false;
			ctx.restore();
		}
	};

  var drawGrid;
  drawGrid = function (ctx) {
    ctx.save();
    var firstColor;
    firstColor = config.grid.colors.major;
    var secondColor;
    secondColor = config.grid.colors.minor;
    for (var i = 0; i < config.height; i += config.grid.scale.major) {
      ctx.strokeStyle = firstColor;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(config.width, i);
      ctx.stroke();
    }

    for (var i = 0; i < config.width; i += config.grid.scale.minor) {
      ctx.strokeStyle = secondColor;
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, config.height);
      ctx.stroke();
    }

    for (var i = 0; i < config.height; i += config.grid.scale.minor) {
      ctx.strokeStyle = secondColor;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(config.width, i);
      ctx.stroke();
    }
    ctx.restore();
  };

  if(config.grid.show) {
    drawGrid(ctx);
  }

  // Other Functions.
	this.setOnStrokeListener = function(listener) {
		onStrokeListener = listener;
	};
	this.setSketch = function(newSketch) {
		sketch = newSketch;
		editor.invalidate();
	};
	this.getSketch = function() {
		return sketch;
	};
	this.getWidth = function() {
		return config.width;
	};
	this.getHeight = function() {
		return config.height;
	};
	this.setShowGrid = function(enabled) {
		if(enabled)
			config.grid.show = true;
		else
			config.grid.show = false;
		this.invalidate();
	}
};

/******************************************
 * C O D E
 ******************************************/
Code = function(numLines) {
  this.lines = [];
  var strokesById = {};
  this.addLines = function(numLinesToAdd) {
    for (var i = 0; i < numLinesToAdd; ++i) {
      this.lines.push(new Line());
    }
  };
  this.increaseLinesLengthTo = function(expectedNumLines) {
    if (this.lines.length < expectedNumLines) {
      this.addLines(expectedNumLines - this.lines.length);
    }
  };
  if (numLines > 0) {
    this.addLines(numLines);
  }

  this.addStrokeToLine = function(stroke, lineNumber){
    if (lineNumber >= this.lines.length) {
      this.increaseLinesLengthTo(lineNumber + 1);
    }
    this.lines[lineNumber].addStroke(stroke);
    strokesById[stroke.id] = stroke;
  }

  this.getStrokeById = function(id){
    return strokesById[id];
  }

  this.draw = function(ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    this.setStyle(ctx);
    for(var i = 0; i < this.contents.length; ++i){
      var component = this.contents[i];
      component.draw(ctx);
    }
  }

  this.setStyle = function(ctx){
    if(this.style != null){
      if(this.style.strokeWidth)
        ctx.lineWidth = this.style.strokeWidth;
      if(this.style.stroke)
        ctx.strokeStyle = this.style.stroke.toString();
    }
  }
}

/******************************************
 * L I N E
 ******************************************/
Line = function() {
  this.strokes = [];
  var strokesById = {};
  this.addStroke = function(stroke){
    this.strokes.push(stroke);
    strokesById[stroke.id] = stroke;
  }
  this.getStrokeById = function(id){
    return strokesById[id];
  }
  this.draw = function(ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    this.setStyle(ctx);
    for(var i = 0; i < this.contents.length; ++i){
      var component = this.contents[i];
      component.draw(ctx);
    }
  }
  this.setStyle = function(ctx){
    if(this.style != null){
      if(this.style.strokeWidth)
        ctx.lineWidth = this.style.strokeWidth;
      if(this.style.stroke)
        ctx.strokeStyle = this.style.stroke.toString();
    }
  }
}


/******************************************
 * P O I N T
 ******************************************/
Point = function(x, y, time) {
	this.x = x;
	this.y = y;
	if (time) {
		this.time = time;
	}
	else
		this.time = getTime();
}


/******************************************
 * S T R O K E
 ******************************************/
Stroke = function(){
	this.points = [];
	this.id = getUUID();
  this.drawFrom = 0;

	var interpretations = [];
	var boundingBox = new BoundingBox();

	this.addPoint = function(pt) {
		boundingBox.addPoint(pt);
		this.points.push(pt);
	}

	this.copy = function(stroke) {
		this.points = [];
		this.id = stroke.id;

		for(var i = 0; i < stroke.points.length; ++i) {
			var otherPoint = stroke.points[i];
			this.addPoint(new Point(otherPoint.x, otherPoint.y, otherPoint.time));
		}
		interpretations = stroke.getInterpretations();
	}

	this.setInterpretations = function(newInterpretations) {
		interpretations = newInterpretations;
	}

	this.getInterpretations = function() {
		 return interpretations;
	}

	this.getLabel = function() {
		if(interpretations.length > 0)
			return interpretations[0].label;
		else
			return "";
	}

	this.getBoundingBox = function() {
		return boundingBox;
	}

	this.setStyle = function(ctx) {
		if(this.style != null){
			if(this.style.strokeWidth)
				ctx.lineWidth = this.style.strokeWidth;
			if(this.style.stroke){
				ctx.strokeStyle = this.style.stroke.toString();
			}
		}
	}

	this.draw = function(ctx) {
		ctx.beginPath();
		for(var j = this.drawFrom; j < this.points.length; ++j){
			var point = this.points[j];
			if(j == this.drawFrom)
				ctx.moveTo(point.x,point.y);
			else
				ctx.lineTo(point.x,point.y);
		}
    this.drawFrom = this.points.length - 1;
		this.setStyle(ctx);
		ctx.stroke();
	}
}

/******************************************
 * B O U N D I N G    B O X
 ******************************************/
BoundingBox = function(){
	var minX = Number.MAX_VALUE;
	var maxX = Number.MIN_VALUE;
	var minY = Number.MAX_VALUE;
	var maxY = Number.MIN_VALUE;

	this.x = 0;
	this.y = 0;
	this.cx = 0;
	this.cy = 0;
	this.width = 0;
	this.height = 0;

  this.reinitialize = function() {
    minX = Number.MAX_VALUE;
    maxX = Number.MIN_VALUE;
    minY = Number.MAX_VALUE;
    maxY = Number.MIN_VALUE;
    this.x = 0;
    this.y = 0;
    this.cx = 0;
    this.cy = 0;
    this.width = 0;
    this.height = 0;
  }

	this.addPoint = function(pt) {
		minX = Math.min(pt.x, minX);
		maxX = Math.max(pt.x, maxX);
		minY = Math.min(pt.y, minY);
		maxY = Math.max(pt.y, maxY);
		this.recalculate();
	}

	this.recalculate = function(){
		this.x = minX;
		this.width = maxX - minX;
		this.y = minY;
		this.height = maxY - minY;
		this.cx = minX+ this.width/2;
		this.cy = minY+ this.height/2;
	}
}

/******************************************
 * S T Y L E   A N D   C O L O R
 ******************************************/
Style = function(stroke, fill, strokeWidth){
  this.stroke = stroke;
  this.fill = fill;
  this.strokeWidth = strokeWidth;
}

Color = function(red, green, blue){
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.toString = function(){
    return "rgb("+this.red+","+this.green+","+this.blue+")";
  }
}