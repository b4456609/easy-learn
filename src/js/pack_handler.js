$(document).on("pageinit", "#new_pack_edit", function() {

  $('#iframe1').load(function() {
    console.log(headerHeight);
    $(this).height($(window).height()-headerHeight-8);
    $(this).width($(window).width());

  });

  

});

function load_editor(){
  $('#iframe1').contents().find('#edit').editable({
      'buttons': ['bold', 'italic', 'underline', 'color', 'strikeThrough', 'fontFamily',
       'fontSize', 'formatBlock', 'blockStyle', 'align', 'insertOrderedList',
        'insertUnorderedList', 'outdent', 'indent', 'undo', 'redo', 'html',
         'insertHorizontalRule', 'table', 'slideshare', 'insertVideo', 'insertImage',
        'createLink'
      ],
      inlineMode: false,
      toolbarFixed: false,
      customButtons: {
        // new slideshare button
        slideshare: {
          title: 'insert Slideshare',
          icon: {
            type: 'font',

            // Font Awesome icon class fa fa-*.
            value: 'fa fa-slideshare'
          },
          callback: function() {
            $("#popup_slideshare").popup("open");
            var user_url = $("#slideshare_url").val();
            console.log(user_url);
            $("#slideshare_submit").click({
              user_url: user_url
            }, slideshare_submit_handler);
          },
          refresh: function() {}
        }
      }
    });
}

function slideshare_submit_handler(event) {
  var url = "http://www.slideshare.net/api/oembed/2?url=" + event.data.user_url + "&format=json";
  $.get(url,
    function(data) {
      alert(JSON.stringify(data));
      var i;
      var img = "";
      for (i = 1; i <= data.total_slides; i++) {
        var http = 'http:' + data.slide_image_baseurl + i + data.slide_image_baseurl_suffix;
        img += "<img src=" + http + ">";
      }
      console.log(img);
      $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
    });
}

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
