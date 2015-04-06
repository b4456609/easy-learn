//for comment display use
var noteText;

//for picture use
var newPackId = null;

//for new pack and save to localStorage
var new_pack = null;

//new pack content
var new_pack_content = null;

$(document).on("pageinit", "#new_pack_edit", function() {
  load_editor();
});

$(document).on("pagebeforeshow", "#new_pack_edit", function() {});
$(document).on("pageshow", "#new_pack_edit", function() {
  //show saved html
  if (new_pack_content !== null) {
    $('#edit').editable("insertHTML", new_pack_content, true);
  }
  //save pack in localStorage
  $('#save_pack').click(savePackHandler);
  $('#edit_back').click(function() {
    new_pack_content = $('#edit').editable("getHTML", true, false);
  });
});

$(document).on('pageinit', "#new_pack", function() {
  //check is user back from edit page
  if (newPackId === null) {
    //get current time
    var time = new Date().getTime();

    //initail the pack setting
    newPackId = 'pack' + time;
    new_pack = {
      "creator_user_id": JSON.parse(localStorage.user).id,
      "create_time": time.toString(),
      "name": null,
      "is_public": null,
      "description": null,
      "tags": null,
      "cover_filename": null,
      "version": []
    };
  } else { //set saved value
    $('#new_pack_title').val(new_pack.name);
    $('#is_public').prop('checked', new_pack.is_public).checkboxradio("refresh");
    $('#new_pack_description').val(new_pack.description);
    $('#tags').val(new_pack.tags);
    if (new_pack.cover_filename !== null) {
      getImgNode(newPackId, new_pack.cover_filename, function(packId, img) {
        $("#cover_photo_area").html(img.outerHTML);
      });
    }
  }

});

$(document).on('pageshow', "#new_pack", function() {
  // save new pack storage for next page use
  $('#new_pack_next').click(function() {
    //save user data
    new_pack.name = $('#new_pack_title').val();
    new_pack.is_public = document.getElementById("is_public").checked;
    new_pack.description = $('#new_pack_description').val();
    new_pack.tags = $('#tags').val();

  });

  // choose cover image file hanlder
  $('#choose_photo').click(getPhotoWithModifySize);
});

$(document).on('pageinit', "#view_pack", function() {
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  console.log('view pack ID:' + viewPackId);
  console.log('view pack name:' + pack.name);
  $('#veiw_pack_content').html(pack.version[viewPackVersion].content);
  $('#pack_title').html(pack.name);
});


$(document).on('pageshow', "#view_pack", function() {

  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //    click and show note hanlder
  $(".note").click(showNoteHandler);

  showPackImg();
});

function showPackImg() {
  var imgArray = $("div.ui-content img[imgname]");
  var i;

  $("div.ui-content img[imgname]").map(function() {
    displayPackImg(viewPackId, $(this), $(this).attr('imgname'));
  });

}

function show_comment() {
  $(":mobile-pagecontainer").pagecontainer("change", "comment.html");
}

function showNoteHandler() {
  console.log("click on note event");
  //display the note
  $("#note-display").toolbar("show");

  //get note id
  var noteId = $(this).attr('noteid');
  noteText = $(this).text();

  //get pack for note content
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  var noteArray = pack.version[viewPackVersion].note;

  //find current note
  var i;
  for (i in noteArray) {
    if (noteArray[i].id == noteId) {
      break;
    }
  }

  // insert html into note area
  var noteTemplate = '<h4>' + noteText + '</h4>';
  noteTemplate += '<div class="note-content"><p>' + noteArray[i].content + '</p></div>';
  noteTemplate += '<div class="note-function-button"><a class="ui-btn note-left-button">返回</a>';
  noteTemplate += '<a id="show_comment" class="ui-btn note-right-button">查看留言</a></div>';

  $("#note-display").html(noteTemplate);

  //refresh footer for diiplay
  $("#note-display").toolbar("refresh");

  //hide note button action
  $(".note-left-button").click(hideButtonHandler);

  //show comment button action
  $("#show_comment").click(show_comment);

  //save array index for comment page quick find current note
  viewNoteArrayIndex = i;
}

function hideButtonHandler() {
  //hide the note
  $("#note-display").toolbar("hide");

  //clear html
  $("#note-display").html("");
  $("#note-display").toolbar("refresh");
}

function getPhotoWithModifySize() {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 70,
    targetWidth: 800,
    targetHeight: 800,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
  });
}

function onSuccess(imageData) {
  console.log('onSuccess');
  console.log(imageData);

  window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
    addFileToPack(newPackId, fileEntry);
  }, fail);
}

function onFail(message) {
  alert('Failed because: ' + message);
  console.log('Failed because: ' + message);
}

function displayCoverImg(packfileEntry) {
  packfileEntry.file(function(file) {

    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onloadend = function() {
      img.src = reader.result;
    };
    img.style.width = '100%';

    reader.readAsDataURL(file);
    $("#cover_photo_area").html(img);
  }, fail);
}

function savePackHandler() {

  //get editor word and replace the img
  var content = $('#edit').editable("getHTML", true, false).replace(/src[^>]*"/g, "");
  console.log(content);

  //get current time
  var time = new Date().getTime();

  //create this page's information add it in pack
  new_pack.version[new_pack.version.length] = {
    "creator_user_id": JSON.parse(localStorage.user).id,
    "bookmark": [],
    "note": [],
    "file": [],
    "create_time": time.toString(),
    "is_public": new_pack.is_public,
    "id": "version" + time,
    "content": content,
  };

  //set new pack in localStorage
  localStorage.setItem(newPackId, JSON.stringify(new_pack));

  //add it in folder all
  var folderArray = JSON.parse(localStorage.folder);

  //find all folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].name == 'All') {
      folderArray[i].pack[folderArray[i].pack.length] = newPackId;
      break;
    }
  }
  localStorage.setItem("folder", JSON.stringify(folderArray));

  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "index.html");

  // reset parameter
  new_pack = null;
  newPackId = null;
  new_pack_content = null;
}

function load_editor() {
  $('#edit').editable({
    'buttons': ['bold', 'italic', 'underline', 'color', 'strikeThrough', 'fontFamily',
      'fontSize', 'formatBlock', 'blockStyle', 'align', 'insertOrderedList',
      'insertUnorderedList', 'outdent', 'indent', 'undo', 'redo', 'html',
      'insertHorizontalRule', 'table', 'slideshare', 'youtube', 'insertVideo', 'insertImage',
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
          //save put img position
          $("#edit").editable("saveSelection");
          //open popup slideshare setting
          $("#popup_slideshare").popup("open");

          //submit handler
          $("#slideshare_submit").click(slideshare_submit_handler);

          //cancel handler
          $('#slideshare_cancel').click(function() {
            $('#popup_slideshare').popup("close");
          });
        },
        refresh: function() {}
      },
      youtube: {
        title: 'insert youtube',
        icon: {
          type: 'font',

          // Font Awesome icon class fa fa-*.
          value: 'fa fa-youtube'
        },
        callback: function() {},
        refresh: function() {}
      }
    }
  });
}

function slideshare_submit_handler() {
  // get slideshare url
  var user_url = $("#slideshare_url").val();
  var start = $('#slideshare_start_page ').val();
  var end = $('#slideshare_end_page').val();

  //close popup
  $('#popup_slideshare').popup("close");
  $('#edit').editable("restoreSelection");

  // set slideshare url
  var url = "http://www.slideshare.net/api/oembed/2?url=" + user_url + "&format=json";

  //ajax
  $.get(url,
    function(data) {
      //error check
      if (start <= 0 | start === null | start > data.total_slides) {
        start = 1;
      }
      if (end < start) {
        end = start;
      } else if (end > data.total_slides) {
        end = data.total_slides;
      }

      //download img to localStorage
      var img = "";
      for (; start <= end; start++) {
        var http = 'http:' + data.slide_image_baseurl + start + data.slide_image_baseurl_suffix;
        downloadSlideShareByUrl(http, newPackId, displaySlideShareImgInEditor);
      }
    });
}

function displaySlideShareImgInEditor(fileEntry) {
  fileEntry.file(function(file) {

    var reader = new FileReader();
    reader.onloadend = function() {
      var img = "<img imgname='" + file.name + "' src='" + reader.result + "'>";
      $('#edit').editable("insertHTML", img, true);
    };

    reader.readAsDataURL(file);
  }, fail);
}
