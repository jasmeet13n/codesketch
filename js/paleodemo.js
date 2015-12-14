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
	sketchEditor.start();

  sketchEditor.setOnStrokeListener(function(currentStroke){
		var options = [];
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

  $("#undo-button").button().click(function(){
    sketchEditor.undo();
  });

	$("#clear-button").button().click(function(){
    sketchEditor.clear();
  });
});