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

$(document).on("pageinit", "#version_pack", function() {
  display_version_info();
});



$(document).on('pageinit', "#new_pack", function() {
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
      getImgNode(newPackTemp.id, NEW_PACK.cover_filename, function(packId, img) {
        $("#cover_photo_area").html(img.outerHTML);
      });
    }
  }

});

function new_pack_next() {
  NEW_PACK.name = $('#new_pack_title').val().trim();
  if (NEW_PACK.name === "") {
    navigator.notification.alert('標題不可為空', null, '錯誤', '確定');
    return;
  }

  NEW_PACK.is_public = document.getElementById("is_public").checked;
  NEW_PACK.description = $('#new_pack_description').val();
  NEW_PACK.tags = $('#tags').val();
  $(":mobile-pagecontainer").pagecontainer("change", "new_pack_edit.html");
}

$(document).on('pageshow', "#new_pack", function() {
  // choose cover image file hanlder
  $('#choose_photo').click(function() {
    getPhotoWithModifySize(displayCoverImg);
  });
});

$(document).on('pageinit', "#view_pack", function() {
  //stop spinner notification
  navigator.notification.activityStart('觀看懶人包', '載入中');

  var pack = new Pack();
  pack.getPack(viewPackId);


  //set look's version's index, check if index exits
  if (viewPackVersion.index >= pack.version.length || viewPackVersion.index < 0) {
    var version_time = 0;
    var version_index_temp = null;
    for (var i in pack.version) {
      if (pack.version[i].create_time > version_time) {
        version_time = pack.version[i].create_time;
        version_index_temp = i;
      }
    }
    viewPackVersion.index = version_index_temp;
  }

  //if index is on private and old set to lastest verison
  var viewPrivateId = pack.version[viewPackVersion.index].private_id;
  if (viewPrivateId !== '') {
    for (var j in pack.version) {
      if (pack.version[j].private_id == viewPrivateId) {
        if (pack.version[j].version > pack.version[viewPackVersion.index].version) {
          viewPackVersion.index = j;
        }
      }
    }
  }


  //set look version's id
  viewPackVersion.id = pack.version[viewPackVersion.index].id;

  console.log('view pack ID:' + viewPackId);
  console.log('view pack name:' + pack.name);

  //prepare content
  var content = pack.version[viewPackVersion.index].content;
  content = replacePackImgPath(content);
  $('#veiw_pack_content').html(content);

});

$(document).on('pageshow', "#view_pack", function() {

  var pack = new Pack();
  pack.getPack(viewPackId);

  //show pack's title
  $('#pack_title').text(pack.name);
  //note initail
  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //note hold handler
  $('#veiw_pack_content').on("taphold", function() {
    console.log('[viewPack]hold content');
    var sel = window.getSelection();
    console.log('[viewPack]isCollapsed' + sel.isCollapsed);

    if (!sel.isCollapsed) {
      var next = '<a href="new_note.html" id="note_choose_next" class="ui-btn ui-btn-inline ui-mini ui-corner-all" onclick="note_next_handler(\'#veiw_pack_content\')">新增便利貼</a>';
      $('.ui-btn-right').html(next);
      $('#note_choose_next').button();
    }
  });

  //note hold handler
  $('#veiw_pack_content').on("tap", function() {
    console.log('[viewPack]tap content');

    var menu = '<a href="#popupMenu" id="app-bar-menu-btn" class="ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-bullets" data-rel="popup">選單</a>';
    $('.ui-btn-right').html(menu);
    $('#app-bar-menu-btn').button();

  });

  //click and show note hanlder
  $(".note").click(showNoteHandler);

  //stop spinner notification
  navigator.notification.activityStop();

  //add version view count
  pack.version[viewPackVersion.index].user_view_count++;
  pack.save();
});

$(document).on('pageinit', "#search_view_pack", function() {
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
  $('#veiw_pack_content').html(content);

  // $('#view_pack_content').onselect(function(){
  //   console.log('selected');
  // })
});


$(document).on('pageshow', "#view_pack", function() {
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
  var find = 'FILE_STORAGE_PATH' + viewPackId + '/';
  var re = new RegExp(find, 'g');

  content = content.replace(re, url);
  return content;
}

function replacePackImgPath(content) {
  var find = 'FILE_STORAGE_PATH';
  var re = new RegExp(find, 'g');
  return content.replace(re, FILE_STORAGE_PATH);
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

function onFail(message) {
  navigator.notification.alert(
    message, // message
    null, // callback
    '錯誤', // title
    '確定' // buttonName
  );
  console.log('Failed because: ' + message);
}

function displayCoverImg(packfileEntry) {
  NEW_PACK.cover_filename = packfileEntry.name;
  var imgsrc = packfileEntry.toURL();
  var img = "<img src='" + imgsrc + "' width='100%' >";
  $("#cover_photo_area").html(img);
}

function go_version_handler(index) {
  viewPackVersion.index = index;
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function display_version_info() {
  //get pack from localStorage
  var version = JSON.parse(localStorage.getItem(viewPackId)).version;
  //console.log(version);
  console.log(viewPackVersion.index);

  //get user info
  var user = new User();

  //delete duplicate private version
  var i;
  for (i = 0; i < version.length; i++) {
    //if version if private
    if (!version[i].is_public) {
      for (j = i; j < version.length; j++) {
        //id are same compare version size
        if (version[i].private_id == version[j].private_id && version[i].version < version[j].version) {
          //mark as null for not break array index arrange
          version[i] = null;
          break;
        } else if (version[i].private_id == version[j].private_id && version[i].version > version[j].version) {
          //mark as null for not break array index arrange
          version[j] = null;
          break;
        }
      }
    }
  }

  //generate display code
  var html = '';
  for (i = 0; i < version.length; i++) {
    //null as not display
    if (version[i] === null) {
      continue;
    }

    //other private version not display
    if (!version[i].is_public && version[i].creator_user_id != user.id) {
      //it's not this user's private version don't display
      continue;
    }

    //display private icon
    var privateIcon = '';
    if (!version[i].is_public) {
      privateIcon = '<i class="fa fa-lock" style="float: right; margin: 2px;"></i>';
    }

    // get version's create time
    var time = new Date(version[i].create_time);
    var timeString = time.toLocaleString("zh-TW", {
      hour: '2-digit',
      minute: 'numeric',
      day: "numeric",
      month: "numeric",
      year: 'numeric'
    });
    var userName = version[i].creator_user_name;
    var text = getVersionInfo(version[i]);

    if (i == viewPackVersion.index) {
      html += '<li class="version_col version-look" data-role="collapsible" version_index="' + i + '"><h2>' + timeString + '   ' + userName + privateIcon + ' </h2><p>' + text + '</p></li>';
    } else {
      html += '<li class="version_col" data-role="collapsible" version_index="' + i + '"><h2>' + timeString + '   ' + userName + privateIcon + ' </h2><p>' + text + '</p><a href="#" class="ui-btn" onclick="go_version_handler(\'' + i + '\')">觀看此版本</a></li>';
    }
  }
  $('#version_pack_content').html(html);
  $('.version_col').collapsible();
  $('#version_pack_content').collapsibleset("refresh");
}

function getVersionInfo(version) {
  var charCount = version.content.length;
  var viewCount = version.user_view_count + version.view_count;
  var bookmarkCount = version.bookmark.length;
  var pic = version.content.match(/jpg/g);
  var youtube = version.content.match(/video-container/g);
  var slideShare = version.content.match(/slideshare-img/g);

  var picCount = 0;
  var youtubeCount = 0;
  var slideShareCount = 0;

  if (pic !== null)
    picCount = pic.length;
  if (youtube !== null)
    youtubeCount = youtube.length;
  if (slideShare !== null)
    slideShareCount = slideShare.length;

  var status = "不公開";
  if (version.is_public) {
    status = "公開";
  }

  var result = '懶人包狀態: ' + status + '<br>';
  result += '字元數量: ' + charCount + '<br>';
  result += '圖片數量: ' + picCount + '<br>';
  result += '影片數量: ' + youtubeCount + '<br>';
  result += '投影片數量: ' + slideShareCount + '<br>';
  result += '書籤數量: ' + bookmarkCount + '<br>';
  result += '瀏覽次數: ' + viewCount;
  return result;
}

function save_to_folder() {
  var folder = new Folder();
  folder.addAPack(viewPackId);
}
