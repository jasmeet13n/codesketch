$(document).ready(function(){
	var mouseDown = 0;
	$(document).mousedown(function() { 
		++mouseDown;
	});
	$(document).mouseup(function() {
		--mouseDown;
	});

	var sketchEditor = new SketchEditor($("#sketch"),{
		width:650,
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

  $("#undo-button").click(function(){
    sketchEditor.undo();
  });

	$("#clear-button").click(function(){
    sketchEditor.clear();
  });

	$("#code-switch").click(function(){
    if ($("#code-switch").hasClass("btn-success")) {
      return;
    }
    $("#code-switch").toggleClass("btn-success");
    $("#code-switch").toggleClass("btn-default");
    sketchEditor.changeContextTo(0);
    $("#comment-switch").toggleClass("btn-default");
    $("#comment-switch").toggleClass("btn-success");
  });

  $("#comment-switch").click(function(){
    if ($("#comment-switch").hasClass("btn-success")) {
      return;
    }
    $("#comment-switch").toggleClass("btn-default");
    $("#comment-switch").toggleClass("btn-success");
    sketchEditor.changeContextTo(1);
    $("#code-switch").toggleClass("btn-success");
    $("#code-switch").toggleClass("btn-default");
  });
});