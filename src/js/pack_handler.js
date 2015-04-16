//for comment display use
var noteText;

var newPackTemp = {
  id: '',
  content: '', //new pack content
  youtube: [],
  versionId: '',
  file: []
};

//for new pack and save to localStorage
var new_pack = null;

//for new version bug
var packName;

$(document).on("pageinit", "#version_pack", function() {
  //get pack from localStorage
  var version = JSON.parse(localStorage.getItem(viewPackId)).version;
  console.log(version);
  console.log(viewPackVersion.index);

  //generate display code
  var html = '';
  var i = 0;
  for (i = 0; i < version.length; i++) {
    console.log(i);
    // get version's create time
    var time = new Date(version[i].create_time);

    if (i === viewPackVersion.index) {
      html += '<li data-role="list-divider" version_index="' + i + '">目前版本  ' +
        time.toLocaleString(navigator.language, {
          hour: '2-digit',
          minute: 'numeric',
          day: "numeric",
          month: "numeric",
          year: 'numeric'
        }) +
        '   ' + version[i].creator_user_id + ' </li>';
    } else {
      html += '  <li version_index="' + i + '"><a href="#">' +
        time.toLocaleString(navigator.language, {
          hour: '2-digit',
          minute: 'numeric',
          day: "numeric",
          month: "numeric",
          year: 'numeric'
        }) +
        '   ' + version[i].creator_user_id + '</a></li>';
    }
  }
  console.log(html);
  $('#version_pack_content').html(html);
  $('#version_pack_content').listview("refresh");
});

$(document).on("pageshow", "#version_pack", function() {
  $("li[version_index]").click(go_version_handler);
});

$(document).on("pageinit", "#co_pack", function() {
  //set editor height
  $('#iframe1').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });
});

$(document).on('pageshow', "#co_pack", function() { //  Test co work  the mean edit !!

  //get pack from localStorage
  var pack = JSON.parse(localStorage.getItem(viewPackId));

  //get version from pack
  var version = pack.version[viewPackVersion.index];

  //set pack title
  $('#pack_title').html(pack.name);

  // set edit content
  $('#iframe1').contents().find('#edit').editable("insertHTML", version.content, true);
  editor_button_handler();

  //header button handler
  //$('#pack_comple').click(savePackHandler_edit);
  $('#pack_branch').click(function() {
    saveNewVersionHandler(pack);
  });

});

$(document).on("pageinit", "#new_pack_edit", function() {
  //set editor height
  $('#iframe1').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });
});

$(document).on("pageshow", "#new_pack_edit", function() {

  //show saved html
  if (newPackTemp.content !== '') {
    $('#iframe1').contents().find('#edit').editable("insertHTML", newPackTemp.content, true);
  }

  //save pack in localStorage
  $('#save_pack').click(savePackHandler);
  $('#edit_back').click(function() {
    newPackTemp.content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false);
  });

  editor_button_handler();
});


$(document).on('pageinit', "#new_pack", function() {
  //check is user back from edit page
  if (newPackTemp.id === '') {
    //get current time
    var time = new Date().getTime();

    //initail the pack setting
    newPackTemp.id = 'pack' + time;

    //set versin id
    newPackTemp.versionId = "version" + time;

    new_pack = {
      "creator_user_id": JSON.parse(localStorage.user).id,
      "create_time": time,
      "name": '',
      "is_public": false,
      "description": '',
      "tags": '',
      "cover_filename": '',
      "version": []
    };
  } else { //set saved value
    $('#new_pack_title').val(new_pack.name);
    $('#is_public').prop('checked', new_pack.is_public).checkboxradio("refresh");
    $('#new_pack_description').val(new_pack.description);
    $('#tags').val(new_pack.tags);
    if (new_pack.cover_filename !== '') {
      getImgNode(newPackTemp.id, null, new_pack.cover_filename, function(packId, img) {
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
  $('#choose_photo').click(function() {
    getPhotoWithModifySize('', displayCoverImg);
  });
});

$(document).on('pageinit', "#view_pack", function() {
  var pack = JSON.parse(localStorage.getItem(viewPackId));

  //set look's version's index, check if index exits
  if (viewPackVersion.index >= pack.version.length || viewPackVersion.index < 0) {
    viewPackVersion.index = 0;
  }
  //set look version's id
  viewPackVersion.id = pack.version[viewPackVersion.index].id;

  console.log('view pack ID:' + viewPackId);
  console.log('view pack name:' + pack.name);
  packName = pack.name;

  $('#veiw_pack_content').html(pack.version[viewPackVersion.index].content);
});

$(document).on('pageshow', "#view_pack", function() {
  //show pack's title
  $('#pack_title').text(packName);
  //note initail
  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //click and show note hanlder
  $(".note").click(showNoteHandler);

  showPackImg();
});

function showPackImg() {
  var imgArray = $("div.ui-content img[imgname]");
  var i;

  $("div.ui-content img[imgname]").map(function() {
    displayPackImg(viewPackId, viewPackVersion.id, $(this), $(this).attr('imgname'));
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
  var noteArray = pack.version[viewPackVersion.index].note;

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

function getPhotoWithModifySize(versionId, successCallback) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(function(imageData) {
    window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
      addFileToPack(newPackTemp.id, fileEntry, versionId, successCallback);
    }, fail);
  }, onFail, {
    quality: 70,
    targetWidth: 800,
    targetHeight: 800,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
  });
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
  content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false).replace(/src[^>]*"/g, "");
  console.log(content);
  console.log(newPackTemp.youtube);

  var i;
  for (i = 0; i < newPackTemp.youtube.length; i++) {
    var index = content.indexOf('<div class="video-container" id="' + i + '">');
    var endIndex = content.indexOf('</div>', index);
    content = content.replace(content.substring(index, endIndex + 6), newPackTemp.youtube[i]);
    console.log(i);
    console.log(index);
    console.log(content);
  }

  content = content.replace('<div class="video-container" id="0"><br></div>', '');

  //get current time
  var time = new Date().getTime();

  //create this page's information add it in pack
  new_pack.version[new_pack.version.length] = {
    "creator_user_id": JSON.parse(localStorage.user).id,
    "bookmark": [],
    "note": [],
    "file": newPackTemp.file,
    "create_time": time,
    "is_public": new_pack.is_public,
    "id": newPackTemp.versionId,
    "content": content,
  };

  //set new pack in localStorage
  localStorage.setItem(newPackTemp.id, JSON.stringify(new_pack));

  //add it in folder all
  var folderArray = JSON.parse(localStorage.folder);

  //find all folder in data
  var j;
  for (j in folderArray) {
    if (folderArray[j].name == 'All') {
      folderArray[j].pack[folderArray[j].pack.length] = newPackTemp.id;
      break;
    }
  }
  localStorage.setItem("folder", JSON.stringify(folderArray));

  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "index.html");

  // reset parameter
  newPackTemp = {
    id: '',
    content: '', //new pack content
    youtube: [],
    file: []
  };

  changeModifyStroageTime();
}

function savePackHandler_edit() {
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  console.log(viewPackId);
  //get editor word and replace the img
  content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false).replace(/src[^>]*"/g, "");


  console.log(pack);
  pack.version[0] = {
    'content': content
  };



  //set new pack in localStorage
  localStorage.setItem(viewPackId, JSON.stringify(pack));
  var pack1 = JSON.parse(localStorage.getItem(viewPackId));
  console.log(pack1);
}




function load_editor() {
  $('#iframe1').contents().find('#edit').editable({
    'buttons': ['bold', 'italic', 'underline', 'color', 'strikeThrough', 'fontFamily',
      'fontSize', 'formatBlock', 'blockStyle', 'align', 'insertOrderedList',
      'insertUnorderedList', 'outdent', 'indent', 'undo', 'redo', 'html',
      'insertHorizontalRule', 'table', 'slideshare', 'youtube', 'imageUrlAndFile',
      'createLink'
    ],
    inlineMode: false,
    toolbarFixed: false,
    useFrTag: false,
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
          //open popup slideshare setting
          $("#popup_slideshare").popup("open");
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
        callback: function() {
          //open popup slideshare setting
          $("#popup_youtube").popup("open");

        },
        refresh: function() {}
      },
      imageUrlAndFile: {
        title: 'insert youtube',
        icon: {
          type: 'font',

          // Font Awesome icon class fa fa-*.
          value: 'fa fa-image'
        },
        callback: function() {
          $("#popup_image").popup("open");

        },
        refresh: function() {}
      }
    }
  });
}

function image_submit_handler() {
  //get img url
  var imgUrl = $('#image_url').val();
  //close popup
  $('#popup_image').popup("close");
  //download img and display in editor
  downloadImgByUrl(imgUrl, newPackTemp.id, newPackTemp.versionId, 'user', displayImgInEditor);
}

function youtube_submit_handler() {
  // get youtube url
  var user_url = $("#youtube_url").val();
  var start = $('#youtube_start_time').val();
  var end = $('#youtube_end_time').val();

  //save embed parameter
  var startPar = '',
    endPar = '';

  // error input hanlder
  if (start !== 0 && start > 0) {
    startPar += '&start=' + start;
  }
  if (end !== 0 && end > 0 && end > start) {
    endPar += '&end=' + end;
  }

  //close popup
  $('#popup_youtube').popup("close");

  //get input id
  var videoId = youtube_parser(user_url);

  //set embed code
  var embedCode = '<p><div class="video-container" id="' + newPackTemp.youtube.length + '">' +
    '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoId +
    '?controls=1&disablekb=1&modestbranding=1&showinfo=0&rel=0' + startPar + endPar + '" frameborder="0" allowfullscreen></iframe>' + '</div></p>';

  //push to globle array
  newPackTemp.youtube.push(embedCode);

  //insert to html
  $('#iframe1').contents().find('#edit').editable("insertHTML", embedCode, true);
}

//parse youtube url to id
function youtube_parser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[7].length == 11) {
    return match[7];
  } else {
    alert("Url incorrecta");
  }
}

function slideshare_submit_handler() {
  // get slideshare url
  var user_url = $("#slideshare_url").val();
  var start = $('#slideshare_start_page ').val();
  var end = $('#slideshare_end_page').val();

  //close popup
  $('#popup_slideshare').popup("close");

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

      console.log(start + '  ' + end);

      //download img to localStorage
      for (; start <= end; start++) {
        var http = 'http:' + data.slide_image_baseurl + start + data.slide_image_baseurl_suffix;
        console.log(http);
        downloadImgByUrl(http, newPackTemp.id, newPackTemp.versionId, 'slideshare', displayImgInEditor);
      }
    });
}

function displayImgInEditor(fileEntry) {
  fileEntry.file(function(file) {

    var reader = new FileReader();
    reader.onloadend = function() {
      var img = "<img imgname='" + file.name + "' src='" + reader.result + "'>";
      $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
    };

    reader.readAsDataURL(file);
  }, fail);
}

function editor_button_handler() {
  //image button
  //submit handler
  $("#image_submit").click(image_submit_handler);
  $("#image_choose").click(function() {
    $('#popup_image').popup("close");
    getPhotoWithModifySize(newPackTemp.versionId, displayImgInEditor);
  });
  //cancel handler
  $('#image_cancel').click(function() {
    $('#popup_image').popup("close");
  });

  //slideshare button
  //submit handler
  $("#slideshare_submit").click(slideshare_submit_handler);

  //cancel handler
  $('#slideshare_cancel').click(function() {
    $('#popup_slideshare').popup("close");
  });

  //youtube button
  //submit handler
  $("#youtube_submit").click(youtube_submit_handler);

  //cancel handler
  $('#youtube_cancel').click(function() {
    $('#popup_youtube').popup("close");
  });
}

function saveNewVersionHandler(pack) {

  //get editor word and replace the img
  content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false).replace(/src[^>]*"/g, "");
  console.log(content);

  //get current time
  var time = new Date().getTime();
  var versionId = 'version' + time;
  var new_index = pack.version.length;

  //create this page's information add it in pack
  pack.version[new_index] = {
    "creator_user_id": JSON.parse(localStorage.user).id,
    "bookmark": [],
    "note": pack.version[viewPackVersion.index].note,
    "file": pack.version[viewPackVersion.index].file,
    "create_time": time,
    "is_public": true,
    "id": versionId,
    "content": content,
  };

  //set new pack in localStorage
  localStorage.setItem(viewPackId, JSON.stringify(pack));

  //set view this version
  viewPackVersion.index = new_index;

  changeModifyStroageTime();

  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function go_version_handler() {
  viewPackVersion.index = parseInt($(this).attr('version_index'));
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}
