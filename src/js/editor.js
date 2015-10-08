//for editing img
var editingPackId = null;
var editingFile = [];
var SLIDESHARE_PATH;
var lastVersionIndex;
var currentIndex;

$(document).on("pageinit", "#co_pack", function() {
  //set editor height
  $('#iframe1').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width('100%');
  });

});

$(document).on('pageshow', "#co_pack", function() {
  //get pack from localStorage
  var pack = new Pack();
  pack.getPack(viewStorage.getViewPackId());

  //save index for checkout use
  currentIndex = viewPackVersion.index;

  //prepare content
  var content = pack.version[viewPackVersion.index].content;
  content = replacePackImgPath(content);
  var r = new Reference();
  content = r.deleteRef(content);

  //set pack title
  $('#pack_title').html(pack.name);

  // set edit content
  $('#iframe1').contents().find('#edit').editable("insertHTML", content, true);
  editor_button_handler();

  //add backup button
  //find backup version index
  for (var i in pack.version) {
    //id are same compare version size
    if (i != viewPackVersion.index && pack.version[i].private_id == pack.version[viewPackVersion.index].private_id && pack.version[i].modified !== 'delete') {
      console.log('[coPack]find old version');
      var buckupBtn = '<li><a href="#" id="last-btn" onclick="checkout();">上次編輯內容</a></li>';

      lastVersionIndex = i;

      $(buckupBtn).prependTo('#co_pack_menu');
      $('#co_pack_menu').listview();
      $('#co_pack_menu').listview('refresh');
    }
  }

  //header button handler
  $('#pack_branch').click(function() {
    saveNewVersionHandler(pack, true);
  });


  $('#save_draft').click(function() {
    saveNewVersionHandler(pack, false);
  });

  editingPackId = viewStorage.getViewPackId();
});


$(document).on("pageinit", "#new_pack_edit", function() {
  //set editor height
  $('#iframe1').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width('100%');
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


function checkout() {
  $('#popupMenu').popup('close');
  var pack = new Pack();
  pack.getPack(viewStorage.getViewPackId());

  //checkout other version
  if (viewPackVersion.index == currentIndex) {
    currentIndex = lastVersionIndex;
  } else {
    currentIndex = viewPackVersion.index;
  }

  //prepare content
  var content = pack.version[currentIndex].content;
  content = replacePackImgPath(content);
  var r = new Reference();
  content = r.deleteRef(content);

  // set edit content
  $('#iframe1').contents().find('#edit').editable("setHTML", '', true);
  $('#iframe1').contents().find('#edit').editable("insertHTML", content, true);

  //change the button name
  toogleLastBtn();
}

function toogleLastBtn() {
  if ($('#last-btn').text() == '上次編輯內容') {
    $('#last-btn').text('較新內容');
  } else {
    $('#last-btn').text('上次編輯內容');
  }
}


function getPhotoWithModifySize(successCallback) {
  var errorHandler = function () {
    navigator.notification.activityStop();
    navigator.notification.alert(
      '發生錯誤', // message
      null, // callback
      '錯誤', // title
      '確定' // buttonName
    );
  };

  // Retrieve image file location from specified source
  navigator.camera.getPicture(function(imageData) {
    navigator.notification.activityStart('處理中', '請稍後...');
    window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function() {
          //upload to server
          var base64 = reader.result;
          base64= base64.substring(base64.indexOf(',')+1);
          uploadImgUseBase64(base64, function (item) {
            navigator.notification.activityStop();
            var filename = item.link.substring(item.link.lastIndexOf('/')+1);
            downloadImgByUrl(item.link, editingPackId, filename, successCallback ,function () {
              navigator.notification.activityStop();
            });
          })
        };
        reader.readAsDataURL(file);
      }, errorHandler);
    }, errorHandler);
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

  //replace file path
  var find = FILE_STORAGE_PATH;
  var re = new RegExp(find, 'g');
  content = content.replace(re, 'FILE_STORAGE_PATH');

  //add reference information
  var r = new Reference();
  var deffer = r.getInfo(content);
  $.when(deffer).then(function() {
    content += r.get();

    //add new version
    var version = new Version();
    version.initial();

    version.file = editingFile;
    version.is_public = NEW_PACK.is_public;
    version.id = newPackTemp.versionId;
    version.content = content;

    //is private version
    if (!version.is_public) {
      //set new private id
      version.newPrivateId();
    }

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
  });
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
  navigator.notification.activityStart('處理中', '請稍後...');
  //get img url
  var imgUrl = $('#image_url').val().trim();
  //close popup
  $('#popup_image').popup("close");
  //download img and display in editor

  uploadImgUseUrl(imgUrl, function(item) {
    var filename = item.link.substring(item.link.lastIndexOf('/')+1);
    downloadImgByUrl(item.link, editingPackId, filename, function(fileEntry) {
      navigator.notification.activityStop();
      var imgsrc = fileEntry.toURL();
      var img = "<img id='" + item.id + " ' src='" + imgsrc + "' style='max-width:100% !important; height:auto;' >";

      $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
    },function () {
      navigator.notification.activityStop();
    });
  });
}

function youtube_submit_handler() {
  // get youtube url
  var user_url = $("#youtube_url").val().trim();
  var start = $('#youtube_start_time').val().trim();
  var end = $('#youtube_end_time').val().trim();

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
  var embedCode = '<p><div id="' + videoId + '" class="youtube video-container">' +
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
  indexOfSlash = user_url.lastIndexOf('/', indexOfSlash - 1);
  SLIDESHARE_PATH = user_url.substr(indexOfSlash + 1).replace('/', '_');

  navigator.notification.activityStart('處理中', '請稍後...');

  //ajax
  $.get(url,
    function(data) {
      //error check
      if (start <= 0 || start === null || start > data.total_slides) {
        start = 1;
      }
      if (end < start) {
        end = start;
      } else if (end > data.total_slides) {
        end = data.total_slides;
      }

      //download img to localStorage
      for (; start <= end; start++) {
        var imgUrl = 'http:' + data.slide_image_baseurl + start + data.slide_image_baseurl_suffix;
        uploadImgUseUrl(imgUrl, function(item) {
          var filename = item.link.substring(item.link.lastIndexOf('/')+1);
          downloadImgByUrl(item.link, editingPackId, filename, function(fileEntry) {
            navigator.notification.activityStop();
            var imgsrc = fileEntry.toURL();
            var img = "<img id='" + item.id + "' class='slideshare-img " + SLIDESHARE_PATH + " ' src='" + imgsrc + "' style='max-width:100% !important; height:auto;' >";

            $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
          },function () {
            navigator.notification.activityStop();
          });
        });
      }
    });
}

function displayImgInEditor(fileEntry) {
  var imgsrc = fileEntry.toURL();
  var img = "<img src='" + imgsrc + "' style='max-width:100% !important; height:auto;' >";

  //if the image is slideshare insert id in to html code to display reference
  if (imgsrc.indexOf('slide') !== -1) {
    img = "<img class='slideshare-img " + SLIDESHARE_PATH + " " + "' src='" + imgsrc + "' style='max-width:100% !important; height:auto;' >";
  }
  console.log(img);
  $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
}

function editor_button_handler() {
  //image button
  //submit handler
  $("#image_submit").click(image_submit_handler);
  $("#image_choose").click(function() {
    $('#popup_image').popup("close");
    getPhotoWithModifySize(displayImgInEditor);
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

function saveNewVersionHandler(pack, isPublic) {
  //start loading spinner
  navigator.notification.activityStart('新增懶人包', '儲存中');

  //get editor word and replace the img
  var content = $('#iframe1').contents().contents().find('#edit').editable("getHTML", true, false);

  //replace file path
  var re = new RegExp(FILE_STORAGE_PATH, 'g');
  content = content.replace(re, 'FILE_STORAGE_PATH');


  //add reference information
  var r = new Reference();
  var deffer = r.getInfo(content);
  $.when(deffer).then(function() {
    content += r.get();

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
    newVersion.version = originVersion.version;
    newVersion.private_id = originVersion.private_id;


    console.log('[publicInfo]oldVersion ' + originVersion.is_public + ' newVersion ' + isPublic);

    //origin is private, new is private
    //remain one not public
    if (!originVersion.is_public && !isPublic) {
      // modify origin to second one
      var find = originVersion.private_id;
      newVersion.version++;

      //remove the other backup
      for (var index in pack.version) {
        if (pack.version[index].id == originVersion.id) {
          continue;
        }
        if (pack.version[index].private_id === find) {
          pack.version[index].modified = "delete";
        }
      }
    }
    //public version, remove all old version
    else if (!originVersion.is_public && isPublic) {
      newVersion.version++;

      for (var j in pack.version) {
        if (pack.version[j].private_id === originVersion.private_id) {
          pack.version[j].modified = "delete";
        }
      }
      //version is public the pack will be public
      pack.is_public = true;
    }
    // old is public and new private
    else if (originVersion.is_public && !isPublic) {
      //set new private id
      newVersion.newPrivateId();
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

    //stop spinner
    navigator.notification.activityStop();
  });
}
