// Sketch.js
SketchEditor = function(el,options){

	var config = {
		width:700,
		height:500,
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
	}
	
	$.extend(config,options);
	
	//INITIALIZATION
	var editor = this;
	var rootElement = el;
	$(el).append('\
	<div><canvas class="sketch-canvas" width="'+config.width+'"px height="'+config.height+'px"></canvas></div>'
	);
	var canvas = $(".sketch-canvas",rootElement)[0];
	var ctx=canvas.getContext("2d");
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	
	var sketch = new Sketch();
	var currentStroke = null;
	var canvasInvalid = true;
	var onStrokeListener = function(){};
	var transforms = [];
	var layers = [];
	
	/*
	 *	MOUSE LISTENERS
	 */
	 
	 
	var setMouseListeners = function(){
		$(canvas).mousedown(function(e){
			currentStroke = new Stroke();
			currentStroke.style = new Style();
			currentStroke.style.stroke = new Color(100,0,200);
			currentStroke.style.strokeWidth = 3;
			currentStroke.addPoint(new Point(e.offsetX,e.offsetY));
			editor.invalidate();
		});
		$(canvas).mousemove(function(e){
			if(currentStroke!=null){
				currentStroke.addPoint(new Point(e.offsetX,e.offsetY));
				editor.invalidate();
			}
		});
		$(canvas).mouseup(function(e){
			if(currentStroke!=null){
				sketch.addStroke(currentStroke);
				onStrokeListener(currentStroke);
				editor.invalidate();
				currentStroke=null;
			}
		});
	}
	if(config.enabled){
		setMouseListeners();
	}
	
	this.clear = function(){
		sketch = new Sketch();
		currentStroke = null;
		editor.invalidate();
	}
	
	/*
	 * DRAW FUNCTIONS
	 */
	var interval;
	var showGrid = true;
	
	this.invalidate = function(){
		canvasInvalid = true;
		//draw();
	}
	this.start = function(){
		interval = setInterval(draw,50);
	}
	this.stop = function(){
		clearInterval(interval);
	}
	var draw = function(){
		if(canvasInvalid){
			
			ctx.save();
			ctx.clearRect ( 0 , 0 , $(canvas).width() , $(canvas).height() );
			
			if(config.grid.show)
				drawGrid(ctx);
			
			for(var i=0; i<transforms.length; i++){
				transforms[i].applyTransform(ctx);
			}
			if(currentStroke)
				currentStroke.draw(ctx);
			
			sketch.draw(ctx);
			for(var i=0; i<layers.length; i++){
				layers[i].draw(ctx);
			}
			ctx.restore();
			ctx.save();
			canvasInvalid=false;
			ctx.restore();
		}
	}
	
	var drawGrid = function(ctx){
		var firstColor = config.grid.colors.major;
		var secondColor = config.grid.colors.minor;
		// for(var i=0; i<config.width; i+=config.grid.scale.major){
		// 	ctx.strokeStyle=firstColor;
		// 	ctx.beginPath();
		// 	ctx.moveTo(i,0);
		// 	ctx.lineTo(i,config.height);
		// 	ctx.stroke();
		// }
		for(var i=0; i<config.height; i+=config.grid.scale.major){
			ctx.strokeStyle=firstColor;
			ctx.beginPath();
			ctx.moveTo(0,i);
			ctx.lineTo(config.width,i);
			ctx.stroke();
		}
		
		for(var i=0; i<config.width; i+=config.grid.scale.minor){
			ctx.strokeStyle=secondColor;
			ctx.beginPath();
			ctx.moveTo(i,0);
			ctx.lineTo(i,config.height);
			ctx.stroke();
		}
		for(var i=0; i<config.height; i+=config.grid.scale.minor){
			ctx.strokeStyle=secondColor;
			ctx.beginPath();
			ctx.moveTo(0,i);
			ctx.lineTo(config.width,i);
			ctx.stroke();
		}
	}
	
	/*
	 * OTHER FUNCTIONS
	 */
	this.setOnStrokeListener = function(listener){
		onStrokeListener = listener;
	}
	this.setSketch = function(newSketch){
		sketch = newSketch;
		editor.invalidate();
	}
	this.getSketch = function(){
		return sketch;
	}
	this.setTransforms = function(newTransforms){
		transforms = newTransforms;
	}
	this.getWidth = function(){
		return config.width;
	}
	this.getHeight = function(){
		return config.height;
	}
	this.addLayer = function(layer){
		layers.push(layer);
	}
	this.setShowGrid = function(enabled){
		if(enabled)
			config.grid.show = true;
		else
			config.grid.show = false;
		this.invalidate();
	}
}

var getUUID = function(){
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
var getTime = function(){
	return new Date().getTime();
}

Sketch = function(){
	this.contents = [];
	var strokesById = {};
	this.addStroke = function(stroke){
		this.contents.push(stroke);
		strokesById[stroke.id] = stroke;
	}
	this.getStrokeById = function(id){
		return strokesById[id];
	}
	this.draw = function(ctx){
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		this.setStyle(ctx);
		for(var i=0; i<this.contents.length; i++){
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
Messaging.registerType("Sketch",Sketch);

Shape = function(){
	this.contents = [];
	this.style = null;
	this.draw = function(ctx){
		this.setStyle(ctx);
		for(var i=0; i<this.contents.length; i++){
			var stroke = this.contents[i];
			stroke.draw(ctx);
		}
	}
	this.setStyle = function(ctx){
		if(this.style != null){
			if(this.style.strokeWidth)
  			ctx.lineWidth = this.style.strokeWidth;
  		if(this.style.stroke){
  			var color = this.style.stroke.toString();
				ctx.strokeStyle = color;
			}
		}
	}
}
Messaging.registerType("Shape",Shape);

Point = function(x,y,time){
	this.x = x;
	this.y = y;
	if(time){
		this.time = time;
	}
	else 
		this.time = getTime();
}
Messaging.registerType("Point",Point);

Style = function(stroke,fill,strokeWidth){
	this.stroke = stroke;
	this.fill = fill;
	this.strokeWidth = strokeWidth;
}
Messaging.registerType("Style",Style);

Color = function(red,green,blue){
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.toString = function(){
		return "rgb("+this.red+","+this.green+","+this.blue+")";
	}
}
Messaging.registerType("Color",Color);

/**********************************************************
 * 											S T R O K E
 **********************************************************/

Stroke = function(){
	this.points = [];
	this.id=getUUID();
	
	var interpretations = [];
	var enabledShapes = [];
	var boundingBox = new BoundingBox();
	
	this.addPoint = function(pt){
		boundingBox.addPoint(pt);
		this.points.push(pt);
	}
	
	this.copy = function(stroke){
		this.points = [];
		this.id = stroke.id;
		
		for(var i=0; i<stroke.points.length; i++){
			var otherPoint = stroke.points[i];
			this.addPoint(new Point(otherPoint.x, otherPoint.y, otherPoint.time));
		}
		
		interpretations = stroke.getInterpretations();
		enabledShapes = stroke.getEnabledShapes();
	}
	
	this.setEnabledShapes = function(newEnabledShapes){
		enabledShapes = newEnabledShapes;
	}
	
	this.getEnabledShapes = function(){
		return enabledShapes;
	}
	
	this.setInterpretations = function(newInterpretations){
		interpretations = newInterpretations;
	}
	
	this.getInterpretations = function(){
		 return interpretations;
	}
	
	this.getLabel = function(){
		if(interpretations.length > 0)
			return interpretations[0].label;
		else
			return "";
	}
	
	this.getBoundingBox = function(){
		return boundingBox;
	}
	this.setStyle = function(ctx){
		if(this.style != null){
			if(this.style.strokeWidth)
  			ctx.lineWidth = this.style.strokeWidth;
  		if(this.style.stroke){
				ctx.strokeStyle = this.style.stroke.toString();
			}
		}
	}
	this.draw = function(ctx){
		ctx.beginPath();
		for(var j=0; j<this.points.length; j++){
			var point = this.points[j];
			if(j==0)
				ctx.moveTo(point.x,point.y);
			else
				ctx.lineTo(point.x,point.y);
		}
		this.setStyle(ctx);
		ctx.stroke();
		ctx.font = "12pt Arial";
		ctx.fillText(this.getLabel(),boundingBox.x+(boundingBox.width/2),boundingBox.y+(boundingBox.height/2));
	}
}
Messaging.registerType("Stroke",Stroke);


BoundingBox = function(){
	var minX=Number.MAX_VALUE;
	var maxX=Number.MIN_VALUE;
	var minY=Number.MAX_VALUE;
	var maxY=Number.MIN_VALUE;
	
	this.x = 0;
	this.y = 0;
	this.cx = 0;
	this.cy = 0;
	this.width = 0;
	this.height = 0;
	
	this.addPoint = function(pt){
		minX = Math.min(pt.x,minX);
		maxX = Math.max(pt.x,maxX);
		minY = Math.min(pt.y,minY);
		maxY = Math.max(pt.y,maxY);
		this.recalculate();
	}
	this.recalculate = function(){
		this.x = minX;
		this.width = maxX-minX;
		this.y = minY;
		this.height = maxY-minY;
		this.cx = minX+ this.width/2;
		this.cy = minY+ this.height/2;
	}
}

Scale = function(x,y){
	this.x = x;
	this.y = y;
	this.applyTransform = function(ctx){
		ctx.scale(this.x,this.y);
	}
}
Translate = function(x,y){
	this.x = x;
	this.y = y;
	this.applyTransform = function(ctx){
		ctx.translate(this.x,this.y);
	}
}