/* Sketch.js*/

/* Global functions*/
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
  var sketch = new Code(50);

  var currentStroke = null;
  var newThingsToBeDrawn = true;

  var onStrokeListener = function() {};

  var downFunction;
  var moveFunction;
  var upFunction;

  downFunction = function(x, y) {
  	// console.log("In down function " + x + ", " + y);
    currentStroke = new Stroke();
    currentStroke.style = new Style();
    currentStroke.style.stroke = new Color(100, 0, 200);
    currentStroke.style.strokeWidth = 3;
    currentStroke.addPoint(new Point(x, y));
    editor.newThingsAddedForDrawing();
  };

  moveFunction = function(x, y) {
  	// console.log("In move function " + x + ", " + y);
    if (currentStroke != null) {
      currentStroke.addPoint(new Point(x, y));
      editor.newThingsAddedForDrawing();
    }
  };

  upFunction = function(x, y) {
  	// console.log("In up function " + x + ", " + y);
    if (currentStroke != null) {
      currentStroke.addPoint(new Point(x, y));
      sketch.addStroke(currentStroke);
      //onStrokeListener(currentStroke);
      editor.newThingsAddedForDrawing();
      currentStroke = null;
    } 	
  };

  // Mouse Listeners (@jasmeet13n add touch listeners)
  var setMouseListeners;
  setMouseListeners = function () {
  	var started = false;
    $(canvas).mousedown(function (e) {
    	started = true;
    	downFunction(e.offsetX, e.offsetY)
    });
    $(canvas).mousemove(function (e) {
    	if (started == false) {
    		return;
    	}
    	moveFunction(e.offsetX, e.offsetY);
    });
    $(canvas).mouseup(function (e) {
    	started = false;
    	upFunction(e.offsetX, e.offsetY);
    });
  };

  var setTouchListeners;
  setTouchListeners = function () {
  	var rect = canvas.getBoundingClientRect();
  	var started = false;
 	canvas.addEventListener('touchstart', function (e) {
 		started = true;
 		if (e.target == canvas) {e.preventDefault();}
 		var touchObj = e.touches[0];
 		downFunction(touchObj.clientX - rect.left, touchObj.clientY - rect.top);
 	}, false);
	canvas.addEventListener('touchmove', function (e) {
		if (e.target == canvas) {e.preventDefault();}
		if (started == false) {
			return;
		}
 		var touchObj = e.touches[0];
 		moveFunction(touchObj.clientX - rect.left, touchObj.clientY - rect.top);
	}, false);
	canvas.addEventListener('touchend', function (e) {
		started = false;
 		if (e.target == canvas) {e.preventDefault();}
 		var touchObj = e.changedTouches[0];
 		upFunction(touchObj.clientX - rect.left, touchObj.clientY - rect.top);
	}, false);
  };

  // Enable mouse listeners if config says so.
  if(config.enabled){
    setMouseListeners();
    setTouchListeners();
  }

  // Clear the current  sketch.
  this.clear = function() {
    sketch = new Code(1);
    ctx.clearRect(0, 0, $(canvas).width(), $(canvas).height());
    drawGrid(ctx);
    currentStroke = null;
  };

  this.undo = function() {
    sketch.undo();
    ctx.clearRect(0, 0, $(canvas).width(), $(canvas).height());
    drawGrid(ctx);
    currentStroke = null;
    ctx.save();
    sketch.draw(ctx);
    ctx.restore();
  };

  // Draw functions
  var interval;
  this.newThingsAddedForDrawing = function() {
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
        currentStroke.continueDraw(ctx);
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
  this.lastEditedLine = [];
  this.lines = [];
  var strokesById = {};

  this.addLines = function(numLinesToAdd) {
    for (var i = 0; i < numLinesToAdd; ++i) {
      this.lines.push(new Line());
      var curLineNumber = this.lines.length - 1;
      this.lines[curLineNumber].lineNumber = curLineNumber;
      $("#result-panel").append("<div id='lineNumber" + curLineNumber + "' class='resultLine' >" +
        "<span class='lineNumberText'>" + (curLineNumber + 1) + "</span>" +
        "<span class='lineText'></span></div>");
    }
  };
  this.increaseLinesLengthTo = function(expectedNumLines) {
    if (this.lines.length < expectedNumLines) {
      this.addLines(expectedNumLines - this.lines.length);
    }
  };
  if (numLines > 0) {
    this.increaseLinesLengthTo(numLines);
  }

  var predictLineNumber;
  predictLineNumber = function(stroke) {
    var bb = stroke.getBoundingBox();
    var lineNumber = Math.floor(bb.cy/40);
    //console.log("Predicted Line Number: " + lineNumber);
    return lineNumber;
  };

  this.addStroke = function(stroke) {
    var predictedLineNumber = predictLineNumber(stroke);
    this.addStrokeToLine(stroke, predictedLineNumber);
  };

  this.addStrokeToLine = function(stroke, lineNumber){
    if (lineNumber >= this.lines.length) {
      this.increaseLinesLengthTo(lineNumber + 1);
    }
    this.lines[lineNumber].addStroke(stroke);
    strokesById[stroke.id] = stroke;
    this.lastEditedLine.push(lineNumber);
  };

  this.undo = function() {
    if (this.lastEditedLine.length == 0) {
      return;
    }
    var lastLineIndex = this.lastEditedLine.pop();
    var lastLine = this.lines[lastLineIndex];
    lastLine.undo();
  };

  this.getStrokeById = function(id){
    return strokesById[id];
  };

  this.draw = function(ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    this.setStyle(ctx);
    for(var i = 0; i < this.lines.length; ++i){
      var component = this.lines[i];
      component.draw(ctx);
    }
  };

  this.setStyle = function(ctx){
    if(this.style != null){
      if(this.style.strokeWidth)
        ctx.lineWidth = this.style.strokeWidth;
      if(this.style.stroke)
        ctx.strokeStyle = this.style.stroke.toString();
    }
  };

  this.print = function() {
    console.log("Printing Stroke\n");
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      line.print();
    }
  }
};


/******************************************
 * L I N E
 ******************************************/
Line = function() {
  this.lineNumber = -1;
  this.strokeHistory = [];
  this.strokes = [];
  this.mergedStrokes = [];
  var strokesById = {};

  var canMergeWithLastStroke;
  canMergeWithLastStroke = function(stroke1, stroke2) {
    var bb1 = stroke1.getBoundingBox();
    var bb2 = stroke2.getBoundingBox();
    var result = false;

    // Check if bounding boxes overlap significantly, then return true;
    if (bb1.x > bb2.x + bb2.width || bb2.x > bb1.x + bb1.width) {
      result = false;
    } else if (bb1.x < bb2.x && bb1.x + bb1.width > bb2.x + bb2.width) {
      result = true;
    } else if (bb2.x < bb1.x && bb2.x + bb2.width > bb1.x + bb1.width) {
      result = true;
    }

    return result;
  };

  var mergeStrokes;
  mergeStrokes = function(stroke1, stroke2) {
    var mergedStroke = new Stroke();

    // Add all points of first stroke to merged stroke.
    for (var i = 0; i < stroke1.points.length; ++i) {
      var curPoint = stroke1.points[i];
      var newPoint = new Point(curPoint.x, curPoint.y, curPoint.time);
      mergedStroke.addPoint(newPoint);
    }

    // Add all points of second stroke to merged stroke.
    for (var i = 0; i < stroke2.points.length; ++i) {
      var curPoint = stroke2.points[i];
      var newPoint = new Point(curPoint.x, curPoint.y, curPoint.time);
      mergedStroke.addPoint(newPoint);
    }

    return mergedStroke;
  };

  this.getStrokeAtIndex = function(index) {
    if (this.strokes[index].mergedWith == 0) {
      return this.strokes[index];
    }
    return this.mergedStrokes[index];
  };

  this.addStroke = function(stroke) {
    this.strokes.push(stroke);
    strokesById[stroke.id] = stroke;
    this.strokeHistory.push(stroke.id);

    var numStrokes = this.strokes.length;
    if (numStrokes > 1 && canMergeWithLastStroke(this.getStrokeAtIndex(numStrokes - 1), this.getStrokeAtIndex(numStrokes - 2))) {
      console.log('Strokes intersect ' + (numStrokes-1) + " and " + (numStrokes - 2));

      var mergedStroke = mergeStrokes(this.getStrokeAtIndex(numStrokes - 1), this.getStrokeAtIndex(numStrokes - 2));
      this.strokes[numStrokes - 1].mergedWith = 1;

      var i = numStrokes - 2 - (this.strokes[numStrokes - 2].mergedWith + 1);
      while (i >= 0 && canMergeWithLastStroke(mergedStroke, this.getStrokeAtIndex(i))) {
        console.log('Recurssive intersection with ', i);
        mergedStroke = mergeStrokes(mergedStroke, this.getStrokeAtIndex(i));
        i -= (this.strokes[i].mergedWith + 1);
      }
      this.strokes[numStrokes - 1].mergedWith = numStrokes - i - 2;
      console.log("Merged with : " + this.strokes[numStrokes - 1].mergedWith);
      this.mergedStrokes.push(mergedStroke);
    } else {
      this.mergedStrokes.push(stroke);
    }
    // get interpretation

    var multiStroke = [];
    var num = this.strokes[this.strokes.length - 1].mergedWith;
    for (var i = this.strokes.length - num - 1; i < this.strokes.length; ++i) {
      multiStroke.push(this.strokes[i]);
    }

    // make merged stroke to json object
    var json = JSON.stringify(multiStroke);

    // get interpretation

    // print line to text area
    var result = [];
    for (var i = this.strokes.length - 1; i >= 0; ) {
      result.push("A");

      var left = 0;
      if (i > 0) {
        var bbLeft = this.strokes[i - 1].getBoundingBox();
        left = bbLeft.x + bbLeft.width;
      }
      var right;
      var bbRight = this.strokes[i].getBoundingBox();
      right = bbRight.x;
      var num = Math.floor((right - left)/30);
      for (var j = 0; j < num; ++j) {
        result.push("&nbsp;");
      }
      i -= (this.strokes[i].mergedWith + 1);
    }

    result.reverse();

    var selector = "#lineNumber" + this.lineNumber + " span.lineText";
    $(selector).html(result.join(""));
  };

  this.getStrokeById = function(id){
    return strokesById[id];
  };

  this.draw = function(ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    this.setStyle(ctx);
    for(var i = 0; i < this.strokes.length; ++i){
      var component = this.strokes[i];
      component.draw(ctx);
    }
  };

  this.undo = function() {
    var lastStroke = this.strokeHistory.pop();
    this.strokes.pop();
    this.mergedStrokes.pop();
    delete strokesById[lastStroke.id];
  };

  this.setStyle = function(ctx){
    if(this.style != null){
      if(this.style.strokeWidth)
        ctx.lineWidth = this.style.strokeWidth;
      if(this.style.stroke)
        ctx.strokeStyle = this.style.stroke.toString();
    }
  };

  this.print = function() {
    for (var i = 0; i < this.strokes.length; ++i) {
      var stroke = this.strokes[i];
      stroke.print();
    }
  }
};


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
};


/******************************************
 * S T R O K E
 ******************************************/
Stroke = function(){
  this.points = [];
  this.id = getUUID();
  this.drawFrom = 0;
  this.mergedWith = 0;

  this.print = function() {
    console.log(this.id + "\n");
  };

  this.interpretations = [];
  var boundingBox = new BoundingBox();

  this.addPoint = function(pt) {
    boundingBox.addPoint(pt);
    this.points.push(pt);
  };

  this.copy = function(stroke) {
    this.points = [];
    this.id = stroke.id;

    for(var i = 0; i < stroke.points.length; ++i) {
      var otherPoint = stroke.points[i];
      this.addPoint(new Point(otherPoint.x, otherPoint.y, otherPoint.time));
    }
    interpretations = stroke.getInterpretations();
  };

  this.setInterpretations = function(newInterpretations) {
    interpretations = newInterpretations;
  };

  this.getInterpretations = function() {
    return interpretations;
  };

  this.getLabel = function() {
    if(interpretations.length > 0)
      return interpretations[0].label;
    else
      return "";
  };

  this.getBoundingBox = function() {
    return boundingBox;
  };

  this.setStyle = function(ctx) {
    if(this.style != null){
      if(this.style.strokeWidth)
        ctx.lineWidth = this.style.strokeWidth;
      if(this.style.stroke){
        ctx.strokeStyle = this.style.stroke.toString();
      }
    }
  };

  this.continueDraw = function(ctx) {
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
  };

  this.draw = function(ctx) {
    ctx.beginPath();
    for(var j = 0; j < this.points.length; ++j){
      var point = this.points[j];
      if(j == 0)
        ctx.moveTo(point.x,point.y);
      else
        ctx.lineTo(point.x,point.y);
    }
    this.drawFrom = this.points.length - 1;
    this.setStyle(ctx);
    ctx.stroke();
  }
};


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
  };

  this.addPoint = function(pt) {
    minX = Math.min(pt.x, minX);
    maxX = Math.max(pt.x, maxX);
    minY = Math.min(pt.y, minY);
    maxY = Math.max(pt.y, maxY);
    this.recalculate();
  };

  this.recalculate = function(){
    this.x = minX;
    this.width = maxX - minX;
    this.y = minY;
    this.height = maxY - minY;
    this.cx = minX + this.width/2;
    this.cy = minY + this.height/2;
  };
};


/******************************************
 * S T Y L E   A N D   C O L O R
 ******************************************/
Style = function(stroke, fill, strokeWidth){
  this.stroke = stroke;
  this.fill = fill;
  this.strokeWidth = strokeWidth;
};

Color = function(red, green, blue){
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.toString = function(){
    return "rgb("+this.red+","+this.green+","+this.blue+")";
  }
};