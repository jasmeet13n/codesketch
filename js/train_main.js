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

  $(document).keypress(function (e) {
    if (e.which == 13) {
      sketchEditor.clear();
    }
  });

  $(document).keypress(function (e) {
    if (e.which == 32) {
      e.preventDefault();
      var char = $("#char-value").val();
      var myurl = "http://10.202.136.29:8000/train?char="+char;
      var jsonData = JSON.stringify(sketchEditor.multiStroke);
      console.log(jsonData);
      var ans = $.ajax({
        type: 'POST',
        url: myurl,
        data: jsonData,
        context: sketchEditor,
        success: function(data, success) {
          //#sketchEditor.clear();
        },
        async:true
      });
      sketchEditor.clear();
    }
  });

  $("#send-button").click(function() {
    var char = $("#char-value").val();
    var jsonData = JSON.stringify(sketchEditor.multiStroke);
    var myurl = "http://10.202.136.29:8080/train?char="+char;
    console.log(jsonData);
    var ans = $.ajax({
      type: 'POST',
      url: myurl,
      data: jsonData,
      context: sketchEditor,
      success: function(data, success) {
        //#sketchEditor.clear();
      },
      async:true
    });
    sketchEditor.clear();
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
});/**
 * Created by jasmeet13n on 12/15/15.
 */
