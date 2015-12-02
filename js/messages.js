ClearSketch = {
	Request : function(){
	},
	Response : function(){
	}
}
Messaging.registerRequest("srl.distributed.messages.ClearSketchRequest",ClearSketch.Request);
Messaging.registerType("srl.distribtued.messages.ClearSketchResponse",
ClearSketch.Response);


GetSketch = {
	Request : function(){
	},
	Response : function(){
		sketch = null;
	}
}
Messaging.registerRequest("srl.distributed.messages.GetSketchRequest",GetSketch.Request);
Messaging.registerType("srl.distribtued.messages.GetSketchResponse",
GetSketch.Response);


RecognizeStrokeRequest = function(stroke,options){
	this.stroke = stroke;
	this.options = options;
}
Messaging.registerRequest("srl.distributed.messages.RecognizeStrokeRequest",RecognizeStrokeRequest);


RecognizeStrokeResponse = function(){
}
Messaging.registerType("srl.distributed.messages.RecognizeStrokeResponse",RecognizeStrokeResponse);


PaleoOptionsRequest = function(){
}
Messaging.registerRequest("srl.distributed.messages.PaleoOptionsRequest",PaleoOptionsRequest);


PaleoOptionsResponse = function(){
	this.options = [];
}
Messaging.registerType("srl.distributed.messages.PaleoOptionsResponse",PaleoOptionsResponse);


ConfigurePaleoRequest = function(options){
	this.enabledOptions = options;
}
Messaging.registerRequest("srl.distributed.messages.ConfigurePaleoRequest",ConfigurePaleoRequest);


PaleoRecognitionErrorRequest = function(stroke){
	this.id = stroke.id;
	this.timestamp = new Date().getTime();
	this.correctLabel = "";
	this.description = "";
	this.stroke = stroke;
	this.wrongLabel = stroke.getLabel();
	this.activeConfiguration = stroke.getEnabledShapes();
}
Messaging.registerRequest("srl.distributed.messages.PaleoRecognitionErrorRequest",
PaleoRecognitionErrorRequest);


PaleoRecognitionErrorResponse = function(){}
Messaging.registerType("srl.distributed.messages.PaleoRecognitionErrorResponse",PaleoRecognitionErrorResponse);

PaleoRecognitionSuccessRequest = function(stroke, correctLabel){
	this.id = stroke.id;
	this.timestamp = new Date().getTime();
	this.stroke = stroke;
	this.label = stroke.getLabel();
	this.activeConfiguration = stroke.getEnabledShapes();
}
Messaging.registerRequest("srl.distributed.messages.PaleoRecognitionSuccessRequest",
PaleoRecognitionSuccessRequest);


PaleoRecognitionSuccessResponse = function(){}
Messaging.registerType("srl.distributed.messages.PaleoRecognitionSuccessResponse",PaleoRecognitionSuccessResponse);

/*
 * Free Body Recognition
 */

FreeBodyDiagram = function(){
	this.closedShape = null;
	this.allClosedShapes = [];
	this.sketch = null;
}

Messaging.registerType("srl.distributed.messages.FreeBodyRecognitionResponse",FreeBodyDiagram);

FreeBodyRecognitionRequest = function(stroke){
	this.stroke = stroke;
}

Messaging.registerRequest("srl.distributed.messages.FreeBodyRecognitionRequest",FreeBodyRecognitionRequest);

FreeBodyRecognitionResponse = function(){
	this.sketch = null;
	this.fbd = null;
}

Messaging.registerType("srl.distributed.messages.FreeBodyRecognitionResponse",FreeBodyRecognitionResponse);