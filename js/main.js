var baseURL = "http://localhost:8000";
var testURL = baseURL + "/test";
var trainURL = baseURL + "/train";
var gSketchEditor;

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
  gSketchEditor = sketchEditor;
	sketchEditor.start();

	$(document).keypress(function (e) {
		if (e.which == 13) {
      e.preventDefault();
			sketchEditor.clear();
		} else if (e.which == 32) {
      e.preventDefault();
      sketchEditor.undo();
    }
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
    if ($("#comment-switch").hasClass("btn-success")) {
      $("#comment-switch").toggleClass("btn-success");
      $("#comment-switch").toggleClass("btn-default");

    }
    if ($("#command-switch").hasClass("btn-success")) {
      $("#command-switch").toggleClass("btn-success");
      $("#command-switch").toggleClass("btn-default");
    }
  });

  $("#comment-switch").click(function(){
    if ($("#comment-switch").hasClass("btn-success")) {
      return;
    }
    $("#comment-switch").toggleClass("btn-default");
    $("#comment-switch").toggleClass("btn-success");
    sketchEditor.changeContextTo(1);
    if ($("#code-switch").hasClass("btn-success")) {
      $("#code-switch").toggleClass("btn-success");
      $("#code-switch").toggleClass("btn-default");

    }
    if ($("#command-switch").hasClass("btn-success")) {
      $("#command-switch").toggleClass("btn-success");
      $("#command-switch").toggleClass("btn-default");
    }
  });

  $("#command-switch").click(function(){
    if ($("#command-switch").hasClass("btn-success")) {
      return;
    }
    $("#command-switch").toggleClass("btn-success");
    $("#command-switch").toggleClass("btn-default");
    sketchEditor.changeContextTo(2);
    if ($("#code-switch").hasClass("btn-success")) {
      $("#code-switch").toggleClass("btn-success");
      $("#code-switch").toggleClass("btn-default");

    }
    if ($("#comment-switch").hasClass("btn-success")) {
      $("#comment-switch").toggleClass("btn-success");
      $("#comment-switch").toggleClass("btn-default");
    }
  });
});