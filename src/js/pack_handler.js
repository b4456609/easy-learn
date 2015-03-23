$(document).on("pageinit", "#new_pack_edit", function() {
  var height = $(window).height * 0.8;
  $('textarea#edit').editable({
    'buttons': ['bold', 'italic', 'slideshare', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'createLink', 'insertImage', 'insertVideo', 'undo', 'redo', 'html', 'insertHorizontalRule', 'table', 'uploadFile'],
    inlineMode: false,
    toolbarFixed: false,
    customButtons: {
      // Alert button with Font Awesome icon.
      slideshare: {
        title: 'insert Slideshare',
        icon: {
          type: 'font',

          // Font Awesome icon class fa fa-*.
          value: 'fa fa-slideshare'
        },
        callback: function() {
          $.get("http://www.slideshare.net/api/oembed/2?url=http://www.slideshare.net/haraldf/business-quotes-for-2011&format=json",
            function(data) {
              alert(JSON.stringify(data));
              var http = 'http:' + data.slide_image_baseurl + '1' + data.slide_image_baseurl_suffix;
              var img = "<img src=" + http + ">";
              console.log(img);
              $('textarea#edit').editable("insertHTML", img, true);
            });
            //<img style="-webkit-user-select: none; cursor: zoom-in;" src="http://image.slidesharecdn.com/110103quotes2010-12-110103073149-phpapp01/95/slide-1-1024.jpg" width="809" height="607">
        },
        refresh: function() {}
      }
    }
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
