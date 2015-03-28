$(document).on("pageinit", "#new_pack_edit", function() {

  //set editor height
  $('#iframe1').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });

  //save pack in localStorage
  $('#save_pack').click(function() {

    //get current time
    var time = new Date().getTime();

    //get new pack from local storage
    var new_pack = JSON.parse(localStorage.new_pack);

    //create this page's information
    var version = [{
      "creator_user_id":  JSON.parse(localStorage.user).id,
      "bookmark": [],
      "note": [],
      "file": [],
      "create_time": time.toString(),
      "is_public": JSON.parse(localStorage.new_pack).is_public,
      "id": "version" + time,
      "content": $('#iframe1').contents().find('#edit').editable("getHTML", true, false)
    }];

    //add version to pack
    new_pack.version = version;

    //store in localStorage
    var packId = "pack" + time;
    localStorage.setItem(packId, JSON.stringify(new_pack));

    //remove temp item in localStorage
    localStorage.removeItem("new_pack");

    //add it in all folder
    var folderArray = JSON.parse(localStorage.folder);

    //find current folder in data
    var i;
    for (i in folderArray) {
      if (folderArray[i].name == 'All') {
        folderArray[i].pack[folderArray[i].pack.length] = packId;
        break;
      }
    }
    localStorage.setItem("folder", JSON.stringify(folderArray));
  });

});

function load_editor() {
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

      $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
    });
}

$(document).on('pageinit', "#new_pack", function() {
  // $('#tags').tagsInput({
  //   'height': '100px',
  //   'width': $(window).width() + 'px',
  //   'delimiter': [',', ';', ' '],
  //   'removeWithBackspace': true,
  //   'defaultText': 'add a tag',
  // });

  // save new pack storage for next page use
  $('#new_pack_next').click(function() {

    //get current time
    var time = new Date().getTime();

    //construct new pack object
    var new_pack = {
      "creator_user_id": JSON.parse(localStorage.user).id,
      "create_time": time.toString(),
      "name": $('#new_pack_title').val(),
      "is_public": document.getElementById("is_public").checked,
      "description": $('#new_pack_description').val(),
      "tags": $('#tags').val(),
      "cover_filename": $('#cover_image').val()
    };

    //sotre new pack object in local storage
    localStorage.new_pack = JSON.stringify(new_pack);
  });
});

$(document).on('pageinit', "#view_pack", function() {
  findNote();
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  console.log('view pack ID:' + viewPackId);
  console.log('view pack name:' + pack.name);
  $('#veiw_pack_content').html(pack.version[0].content);
  $('#pack_title').html(pack.name);
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
}
