$(document).on("pageinit", "#new_pack_edit", function() {
  var height = $(window).height * 0.8;
  $('textarea#edit').editable({
    inlineMode: false,
    toolbarFixed: false
  });
});

$(document).on('pageinit', "#new_pack", function() {
  var width = $(window).width;
  $('#tag').tagsInput({
    'height': '100px',
    'width': width + 'px',
    'delimiter': [',', ';'],
    'removeWithBackspace': true,
    'defaultText': 'add a tag',
  });
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
  $(":mobile-pagecontainer").pagecontainer("change", "comment.html");
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
