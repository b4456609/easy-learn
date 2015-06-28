
//for editing img
var editingPackId = null;
var editingFile = [];
var SLIDESHARE_PATH;

$(document).on("pageinit", "#co_pack", function () {
  //set editor height
  $('#iframe1').load(function () {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width('100%');
  });

});

$(document).on('pageshow', "#co_pack", function () {
  //get pack from localStorage
  var pack = new Pack();
  pack.getPack(viewPackId);

  var content = pack.version[viewPackVersion.index].content;
  content = replacePackImgPath(content);

  //set pack title
  $('#pack_title').html(pack.name);

  // set edit content
  $('#iframe1').contents().find('#edit').editable("insertHTML", content, true);
  editor_button_handler();

  //header button handler
  $('#pack_branch').click(function () {
    saveNewVersionHandler(pack, true);
  });


  $('#save_draft').click(function () {
    saveNewVersionHandler(pack, false);
  });

  editingPackId = viewPackId;
});

$(document).on("pageinit", "#new_pack_edit", function () {
  //set editor height
  $('#iframe1').load(function () {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width('100%');
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


function savePackHandler() {
  //start loading spinner
  navigator.notification.activityStart('新增懶人包', '儲存中');

  //get editor word and replace the img
  var content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false);

  var find = FILE_STORAGE_PATH;
  var re = new RegExp(find, 'g');
  content = content.replace(re, 'FILE_STORAGE_PATH');

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

  //stop spinner
  navigator.notification.activityStop();

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
  var embedCode = '<p><div id="'+ videoId +'" class="youtube video-container">' +
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

  //set slide share path variable
  var indexOfSlash = user_url.lastIndexOf('/');
  indexOfSlash = user_url.lastIndexOf('/', indexOfSlash);
  SLIDESHARE_PATH = user_url.substr(indexOfSlash).replace('/', '-');

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
        var imgUrl = 'http:' + data.slide_image_baseurl + start + data.slide_image_baseurl_suffix;
        console.log(imgUrl);
        downloadImgByUrl(imgUrl, editingPackId, 'slideshare', displayImgInEditor);
      }
    });
}

function displayImgInEditor(fileEntry) {
  var imgsrc = fileEntry.toURL();
  var img = "<img src='" + imgsrc + "' width='100%' >";

  //if the image is slideshare insert id in to html code to display reference
  if(imgsrc.indexOf('slide')!==0){
    img = "<img class='"+ slide +' ' + SLIDESHARE_PATH +"' src='" + imgsrc + "' width='100%' >";
  }
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

function saveNewVersionHandler(pack, isPublic) {

  //get editor word and replace the img
  var content = $('#iframe1').contents().contents().find('#edit').editable("getHTML", true, false);

  //replace file path
  var re = new RegExp(FILE_STORAGE_PATH, 'g');
  content = content.replace(re, 'FILE_STORAGE_PATH');

  var originVersion = pack.version[viewPackVersion.index];

  //get files and concate it to new one
  var files = originVersion.file;
  editingFile = editingFile.concat(files);

  //new version
  var newVersion = new Version();
  newVersion.initial();
  newVersion.note = originVersion.note;
  newVersion.file = editingFile;
  newVersion.is_public = isPublic;
  newVersion.content = content;

  console.log('[publicInfo]oldVersion ' + originVersion.is_public + ' newVersion ' + isPublic);
  //remain one not public
  if (!originVersion.is_public && !isPublic) {
    // modify origin to second one
    originVersion.id = originVersion.id.replace(/_./i, '');
    newVersion.id = originVersion.id;

    //remove the other backup
    re = new RegExp(originVersion.id, 'i');
    for (var index in pack.version) {
      if (index == viewPackVersion.index) { }//do nothing
      else if (pack.version[index].id.search(re) != -1) {
        pack.version.splice(index, 1);
        break;
        //should be only one
      }
    }

    //mark as old
    originVersion.id = originVersion.id + "_1";
  }
  //public version, remove all old version
  else if (!originVersion.is_public && isPublic) {
    // modify origin to second one
    originVersion.id = originVersion.id.replace(/_./i, '');
    newVersion.id = originVersion.id;

    //remove the other backup
    re = new RegExp(originVersion.id, 'i');
    console.log('originVersion.id:' + originVersion.id);
    var i = 0;
    for (; i < pack.version.length; i++) {
      console.log('for:' + pack.version[i].id);
      if (pack.version[i].id.search(re) != -1) {
        console.log('delete:' + pack.version[i].id);
        pack.version.splice(i, 1);
        //because delete one i
        i--;
      }
    }
    //version is public the pack will be public
    pack.is_public = true;
  }

  var new_index = pack.version.length;

  //add new version in pack
  pack.version[new_index] = newVersion.get();

  //set new pack in localStorage
  pack.save();

  //set view this version
  viewPackVersion.index = new_index;
  editingFile = [];

  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}
