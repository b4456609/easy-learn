
$(document).on('pageshow', "#new_pack", function () {
    $("#myTags").tagit();

});

$(document).on('pageinit', "#view_pack", function() {
  findNote();

});

$(document).on('pageshow', "#view_pack", function() {
  //    initial footer widget
  $("#note-display").toolbar({
    disabled: true,
    position: "fixed",
    visibleOnPageShow: false
  });

  //    click and show note hanlder
  $(".note").click(showNoteHandler);

  //    hide note button action
  $(".note-left-button").click(hideButtonHandler);

  $("#show_comment").click(show_comment);
});

function show_comment() {
  console.log('show_comment');
  $( ":mobile-pagecontainer" ).pagecontainer( "change", "comment.html");
}

function showNoteHandler() {
  $("#note-display").toolbar("show");
}

function hideButtonHandler() {
  $("#note-display").toolbar("hide");
  //    $("#note-display").hide().trigger("updatelayout");
}

function findNote() {
  var count = $('.note');
  //    console.log(count.length);
}
