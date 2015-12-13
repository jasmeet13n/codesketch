$(document).ready(function(){
	var mouseDown = 0;
	$(document).mousedown(function() { 
		++mouseDown;
	});
	$(document).mouseup(function() {
		--mouseDown;
	});

	var sketchEditor = new SketchEditor($("#sketch"),{
		width:600,
		height:1000
	});
	
	var strokeViewer = new SketchEditor($("#stroke-holder"),{width:600,height:600,editable:false, grid:{show:false}});
	strokeViewer.start();
	
	var optionsChanged = false;
	
	sketchEditor.start();
	sketchEditor.setOnStrokeListener(function(currentStroke){
		var options = [];
		// $("#paleo-options .option.selected").each(function(){
		// 	options.push($(this).attr("value"));
		// });
		// currentStroke.setEnabledShapes(options);
	
		var recognizeRequest = new RecognizeStrokeRequest(currentStroke, options).success(
			function(response){
				var bestShape = response.bestShape;
				if(bestShape)
					currentStroke.setInterpretations(bestShape.interpretations);
				showResult(currentStroke);
				sketchEditor.invalidate();
			}
		);
		
		recognizeRequest.send();
	});
	
	Messaging.registerDefaultResponseHandler(PaleoOptionsResponse,function(response){
		console.log(response.enabledOptions);
		$("#paleo-options").html(Templates["select-multi"]({"name":"Enable Shapes",options:response.allOptions}));
		$("#paleo-options .option").click(function(){
			$(this).toggleClass("selected");
			optionsChanged = true;
		});
		/*$("#paleo-options .option").mouseenter(function(e){
			if(mouseDown){
				$(this).toggleClass("selected");
				optionsChanged = true;
			}
		});*/
		optionsChanged = false;
		for(var i=0; i<response.enabledOptions.length; i++){
			var option = response.enabledOptions[i];
			$("#paleo-options .option[value='"+option+"']").toggleClass("selected",true);
		}
		$(".select").bind('selectstart', function(e) { e.preventDefault(); return false; }, false);
	});

  $("#undo-button").button().click(function(){
    sketchEditor.undo();
  });

	$("#clear-button").button().click(function(){
    sketchEditor.clear();
  });

	new PaleoOptionsRequest().send();
	
	var showStrokeInViewer = function(stroke,viewer){
		var bbox = stroke.getBoundingBox();
		var transforms = [];
		var viewerWidth = viewer.getWidth();
		var viewerHeight = viewer.getHeight();
		
		var scaleFactor = 1;
		if(bbox.width > bbox.height){
			scaleFactor = Math.min(viewerWidth/bbox.width,scaleFactor);
		}
		else{
			scaleFactor = Math.min(viewerHeight/bbox.height,scaleFactor);
		}
		
		var dx = -1*bbox.x;
		var dy = -1*bbox.y;
		
		var sketch = new Sketch();
		sketch.addStroke(stroke);
		
		viewer.setSketch(sketch);
		viewer.setTransforms([
			new Scale(scaleFactor,scaleFactor),
			new Translate(dx, dy),
			new Translate((viewerWidth/2)-(bbox.width/2*scaleFactor),
				(viewerHeight/2)-(bbox.height/2*scaleFactor))
		]);
	}
	
	var showResult = function(stroke){
		$("#recognition-result").show();
		$("#feedback-buttons").show();
		$("#feedback-thanks").hide();
		var error = new PaleoRecognitionErrorRequest(stroke);
		$("#dialog").html(Templates["paleo-error"](error));
		var confirmViewer = new SketchEditor($("#confirm-stroke-holder"),
			{width:200,height:200,editable:false});
		confirmViewer.start();
		$(".recognition-button").button();
		$(".recognition-button.incorrect").click(function(){
			$("#dialog").dialog(
			{
				width:500,
				height:500,
				modal: true,
				draggable: false,
				buttons:{
					"Cancel":function(){
						$(this).dialog("close");
						confirmViewer.stop()
					},
					"Submit":function(){
						error.correctLabel = $("#correct-label").val();
						error.description = $("#error-description").val();
						error.send();
						$(this).dialog("close");
						confirmViewer.stop();
						$("#feedback-buttons").hide();
						$("#feedback-thanks").show();
					}
				}
			});
		});
		$(".recognition-button.correct").click(function(){
			$("#feedback-buttons").hide();
			$("#feedback-thanks").show();
			new PaleoRecognitionSuccessRequest(stroke).send();
		});
		
		showStrokeInViewer(stroke,strokeViewer);
		showStrokeInViewer(stroke,confirmViewer);
	}
	
});