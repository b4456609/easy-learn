//for comment display use
var noteText;

var newPackTemp = {
  id: '',
  content: '', //new pack content
  versionId: ''
};

//for new pack and save to localStorage
var NEW_PACK = null;

//for new version bug
var packName;

//for editing img
var editingPackId = null;
var editingFile = [];

$(document).on("pageinit", "#version_pack", function () {
  display_version_info();
});

$(document).on("pageshow", "#version_pack", function () {
  $("li[version_index]").click(go_version_handler);
});

$(document).on("pageinit", "#co_pack", function () {
  //set editor height
  $('#iframe1').load(function () {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });

});

$(document).on('pageshow', "#co_pack", function () { //  Test co work  the mean edit !!

  //get pack from localStorage
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  var content = pack.version[viewPackVersion.index].content;
  content = replacePackImgPath(content);

  //set pack title
  $('#pack_title').html(pack.name);

  // set edit content
  $('#iframe1').contents().find('#edit').editable("insertHTML", content, true);
  editor_button_handler();

  //header button handler
  //$('#pack_comple').click(savePackHandler_edit);
  $('#pack_branch').click(function () {
    saveNewVersionHandler(pack);
  });

  editingPackId = viewPackId;
});

$(document).on("pageinit", "#new_pack_edit", function () {
  //set editor height
  $('#iframe1').load(function () {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });
});

$(document).on("pageshow", "#new_pack_edit", function () {

  //show saved html
  if (newPackTemp.content !== '') {
    $('#iframe1').contents().find('#edit').editable("insertHTML", newPackTemp.content, true);
  }

  //save pack in localStorage
  $('#save_pack').click(savePackHandler);
  $('#edit_back').click(function () {
    newPackTemp.content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false);
  });

  editor_button_handler();
});


$(document).on('pageinit', "#new_pack", function () {
  //check is user back from edit page
  //initial form
  if (newPackTemp.id === '') {

    NEW_PACK = new Pack();
    NEW_PACK.initial();

    //initail the pack setting
    newPackTemp.id = NEW_PACK.id;

    //initial editor's setting
    editingPackId = NEW_PACK.id;

    //set versin id
    var time = new Date().getTime();
    newPackTemp.versionId = "version" + time;
  } else { //set saved value
    $('#new_pack_title').val(NEW_PACK.name);
    $('#is_public').prop('checked', NEW_PACK.is_public).checkboxradio("refresh");
    $('#new_pack_description').val(NEW_PACK.description);
    $('#tags').val(NEW_PACK.tags);
    if (NEW_PACK.cover_filename !== '') {
      getImgNode(newPackTemp.id, NEW_PACK.cover_filename, function (packId, img) {
        $("#cover_photo_area").html(img.outerHTML);
      });
    }
  }

});

$(document).on('pageshow', "#new_pack", function () {
  // save new pack storage for next page use
  $('#new_pack_next').click(function () {
    //save user data
    NEW_PACK.name = $('#new_pack_title').val();
    NEW_PACK.is_public = document.getElementById("is_public").checked;
    NEW_PACK.description = $('#new_pack_description').val();
    NEW_PACK.tags = $('#tags').val();
  });

  // choose cover image file hanlder
  $('#choose_photo').click(function () {
    getPhotoWithModifySize(displayCoverImg);
  });
});

$(document).on('pageinit', "#view_pack", function () {
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

  var content = pack.version[viewPackVersion.index].content;
  content = replacePackImgPath(content);
  console.log(content);
  $('#veiw_pack_content').html(content);
});

$(document).on('pageshow', "#view_pack", function () {
  //show pack's title
  $('#pack_title').text(packName);
  //note initail
  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //click and show note hanlder
  $(".note").click(showNoteHandler);
});

$(document).on('pageinit', "#search_view_pack", function () {
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

  var content = pack.version[viewPackVersion.index].content;
  //get image by server
  content = replaceSearchPackImgPath(content);
  console.log(content);
  $('#veiw_pack_content').html(content);
});


$(document).on('pageshow', "#view_pack", function () {
  //show pack's title
  $('#pack_title').text(packName);
  //note initail
  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //click and show note hanlder
  $(".note").click(showNoteHandler);
});

function replaceSearchPackImgPath(content) {
  var url = SERVER_URL + 'easylearn/download?pack_id=' + viewPackId + '&filename=';
  while (content.indexOf('FILE_STORAGE_PATH') != -1) {
    content = content.replace('FILE_STORAGE_PATH', url);
    content = content.replace(viewPackId, '');
  }
  return content;
}

function replacePackImgPath(content) {  
  while (content.indexOf('FILE_STORAGE_PATH') != -1) {
    content = content.replace('FILE_STORAGE_PATH', FILE_STORAGE_PATH);
  }
  return content;
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

function getPhotoWithModifySize(successCallback) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(function (imageData) {
    window.resolveLocalFileSystemURL(imageData, function (fileEntry) {
      addFileToPack(newPackTemp.id, fileEntry, successCallback);
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
  packfileEntry.file(function (file) {

    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onloadend = function () {
      img.src = reader.result;
    };
    img.style.width = '100%';

    reader.readAsDataURL(file);
    $("#cover_photo_area").html(img);
  }, fail);
}

function savePackHandler() {
  //get editor word and replace the img
  var content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false);
  
  //replace file path
  while (content.indexOf(FILE_STORAGE_PATH) != -1) {
    content = content.replace(FILE_STORAGE_PATH, 'FILE_STORAGE_PATH');
  }
  console.log(content);

  var version = new Version();
  version.initial();

  version.file = editingFile;
  version.is_public = NEW_PACK.is_public;
  version.id = newPackTemp.versionId;
  version.content = content;

  //create first version
  NEW_PACK.version[0] = version.get();
  
  //save to local sotrage
  NEW_PACK.save();

  var folder = new Folder();
  folder.addToAllFolder(NEW_PACK.id);

  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "index.html");

  // reset parameter
  newPackTemp = {
    id: '',
    content: '', //new pack content
    file: []
  };

  NEW_PACK = null;
  editingFile = [];
}

function load_editor() {
  $('#iframe1').contents().find('#edit').editable({
    'buttons': ['bold', 'italic', 'underline', 'color', 'strikeThrough', 'fontFamily',
      'fontSize', 'formatBlock', 'blockStyle', 'align', 'insertOrderedList',
      'insertUnorderedList', 'outdent', 'indent', 'undo', 'redo', 'html',
      'insertHorizontalRule', 'table', 'slideshare', 'youtube', 'imageUrlAndFile',
      'createLink'
    ],
    allowedAttrs: ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'width', 'wrap'],
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
        callback: function () {
          //open popup slideshare setting
          $("#popup_slideshare").popup("open");
        },
        refresh: function () { }
      },
      youtube: {
        title: 'insert youtube',
        icon: {
          type: 'font',

          // Font Awesome icon class fa fa-*.
          value: 'fa fa-youtube'
        },
        callback: function () {
          //open popup slideshare setting
          $("#popup_youtube").popup("open");

        },
        refresh: function () { }
      },
      imageUrlAndFile: {
        title: 'insert youtube',
        icon: {
          type: 'font',

          // Font Awesome icon class fa fa-*.
          value: 'fa fa-image'
        },
        callback: function () {
          $("#popup_image").popup("open");

        },
        refresh: function () { }
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
  downloadImgByUrl(imgUrl, editingPackId, 'user', displayImgInEditor);
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
  var embedCode = '<p><div class="video-container">' +
    '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoId +
    '?controls=1&disablekb=1&modestbranding=1&showinfo=0&rel=0' + startPar + endPar + '" frameborder="0" allowfullscreen></iframe>' + '</div></p>';
    
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
    function (data) {
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
        downloadImgByUrl(http, editingPackId, 'slideshare', displayImgInEditor);
      }
    });
}

function displayImgInEditor(fileEntry) {
  var img = "<img src='" + fileEntry.toURL() + "' width='100%' >";
  console.log(img);
  $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
}

function editor_button_handler() {
  //image button
  //submit handler
  $("#image_submit").click(image_submit_handler);
  $("#image_choose").click(function () {
    $('#popup_image').popup("close");
    getPhotoWithModifySize(displayImgInEditor);
  });
  //cancel handler
  $('#image_cancel').click(function () {
    $('#popup_image').popup("close");
  });

  //slideshare button
  //submit handler
  $("#slideshare_submit").click(slideshare_submit_handler);

  //cancel handler
  $('#slideshare_cancel').click(function () {
    $('#popup_slideshare').popup("close");
  });

  //youtube button
  //submit handler
  $("#youtube_submit").click(youtube_submit_handler);

  //cancel handler
  $('#youtube_cancel').click(function () {
    $('#popup_youtube').popup("close");
  });
}

function saveNewVersionHandler(pack) {

  //get editor word and replace the img
  var content = $('#iframe1').contents().contents().find('#edit').editable("getHTML", true, false);

//replace file path
  while (content.indexOf(FILE_STORAGE_PATH) != -1) {
    content = content.replace(FILE_STORAGE_PATH, 'FILE_STORAGE_PATH');
  }
  console.log(content);
  
  //get files and concate it to new one
  var files = pack.version[viewPackVersion.index].file;
  editingFile = editingFile.concat(files);

  //new version
  var newVersion = new Version();
  newVersion.initial();
  newVersion.note = pack.version[viewPackVersion.index].note;
  newVersion.file = editingFile;
  newVersion.is_public = true;
  newVersion.content = content;

  var new_index = pack.version.length;
   
  //add new version in pack
  pack.version[pack.version.length] = newVersion.get();

  //set new pack in localStorage
  localStorage.setItem(viewPackId, JSON.stringify(pack));

  //set view this version
  viewPackVersion.index = new_index;
  editingFile = [];
  
  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function go_version_handler() {
  viewPackVersion.index = parseInt($(this).attr('version_index'));
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function display_version_info() {
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

    var userName = version[i].creator_user_name;
    //if (version[i].creator_user_id === 'b4456609') userName = "Bernie";
    //if (version[i].creator_user_id === 'loko') userName = '洛林';

    if (i === viewPackVersion.index) {
      html += '<li data-role="list-divider" version_index="' + i + '">目前版本  ' +
      time.toLocaleString(navigator.language, {
        hour: '2-digit',
        minute: 'numeric',
        day: "numeric",
        month: "numeric",
        year: 'numeric'
      }) +
      '   ' + userName + ' </li>';
    } else {
      html += '  <li version_index="' + i + '"><a href="#">' +
      time.toLocaleString(navigator.language, {
        hour: '2-digit',
        minute: 'numeric',
        day: "numeric",
        month: "numeric",
        year: 'numeric'
      }) +
      '   ' + userName + '</a></li>';
    }
  }
  console.log(html);
  $('#version_pack_content').html(html);
  $('#version_pack_content').listview("refresh");
}

function save_to_folder(){
  var folder = new Folder();
  folder.addAPack(viewPackId);
}