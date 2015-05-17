var MANERGE_FOLDER_ID;
var MANERGE_PACK_ID;
var ACTION_SELECT = 0;

$(document).on("pageinit", "#delete_pack", function () {
  displayAllPack();
});

$(document).on("pageinit", "#folder", function () {
  displayFolder();

  $("#rename_folder_btn").click(function () {
    ACTION_SELECT = 1;
    $("#folder_action").popup('close');
  });

  $("#delete_folder_btn").click(function () {
    ACTION_SELECT = 2;
    $("#folder_action").popup('close');
  });
  
  //user select action and open popup
  $("#folder_action").on("popupafterclose", function () {
    //any action you want like opening another popup
    if (ACTION_SELECT === 1) {
      $('#folder_rename').popup('open');
    }
    else if (ACTION_SELECT === 2) {
      $('#delete_folder').popup('open');
    }
    ACTION_SELECT = 0;
  });

});


$(document).on("pageinit", "#folder_pack", function () {
  displayPackInFolder(MANERGE_FOLDER_ID);
  preparePopup();
  displayFolderInPopup(MANERGE_FOLDER_ID);
});

function preparePopup() {
  $('#choose_folder_popup').listview();

  var result = '<li data-role="list-divider">選擇資料夾</li>';
  var folder = new Folder();

  for (var i in folder.folderArray) {
    var templete = '<li class="change_folder" folderid="' + folder.folderArray[i].id + '"><a href="#">' + folder.folderArray[i].name + '</a></li>';
    result += templete;
  }

  $('.change_folder').click();
}

function displayPackInFolder(folderId) {
  console.log('displayPackInFolder ' + folderId)
  var folder = new Folder();
  var packInFolder = folder.getPacks(folderId);
  var result = '';

  var copyOrMove = '<li><a href="#move_pack" data-rel="popup" data-position-to="window" data-transition="pop">移動此懶人包</a></li>';
  if (folderId === 'allPackId') {
    copyOrMove = '<li><a href="#move_pack" data-rel="popup" data-position-to="window" data-transition="pop">複製此懶人包</a></li>';
  }

  for (var i in packInFolder) {
    var pack = new Pack();
    pack.getPack(packInFolder[i]);
    var templete = '<li onclick="select_pack(\'' + pack.id + '\')" class="pack_coll" data-role="collapsible" data-iconpos="right">' +
      '<h2>' + pack.name + '</h2>' +
      '<ul class="pack_listview" data-role="listview" data-theme="b" data-inset="false">' +
      copyOrMove +
      '<li><a href="#delete_pack" data-rel="popup" data-position-to="window" data-transition="pop">刪除此懶人包</a></li>' +
      '</ul></li>';
    result += templete;
  }
  $('#pack_in_folder').html(result);
  $('#pack_in_folder').collapsibleset("refresh");
  $('.pack_coll').collapsible();
  $('.pack_listview').listview();
}

function select_pack(packId) {
  MANERGE_PACK_ID = packId;
}

function displayFolder() {
  //remove previous
  $("li[folderid]").remove();
  
	 //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var systemFolder = '<li data-role="list-divider">系統資料夾</li>';
  var result = '<li data-role="list-divider">我的資料夾</li>';
  var i;
  for (i in folderArray) {
    if (folderArray[i].name === 'All') {
      var folder_templete = '<li folderid="' + folderArray[i].id + '"><a href="folder_pack.html">' + folderArray[i].name + '</a></li>';
      systemFolder += folder_templete;
    }
    else {
      var folder_templete = '<li folderid="' + folderArray[i].id + '"><a href="folder_pack.html">' + folderArray[i].name + '</a>' +
        '<a href="#folder_action" data-rel="popup" data-position-to="window" data-transition="pop"></a></li>';
      result += folder_templete;
    }
  }
  systemFolder += result;
  systemFolder += '<li><a href="#add_folder" data-rel="popup" data-position-to="window" data-transition="pop">+ 新增資料夾</a></li>';
  $('#my_folder').html(systemFolder);
  $("#my_folder").listview("refresh");

  $("li[folderid]").click(select_folder);
}

function select_delete(folderId) {
  MANERGE_FOLDER_ID = folderId;
}

function delete_folder() {
  var folder = new Folder();
  folder.deleteFolder(MANERGE_FOLDER_ID);
  
  //refresh view
  displayFolder();
}

function select_folder() {
  MANERGE_FOLDER_ID = $(this).attr('folderid');
  console.log('select_folder ' + MANERGE_FOLDER_ID);
}

function add_folder_handler() {
  var newFolder = $('#fn').val();
  var folder = new Folder();
  folder.addFolder(newFolder);
  
  //refresh view
  displayFolder();
}

function delete_pack_in_folder() {
  var folder = new Folder();
  console.log('delete_pack_in_folder ' + MANERGE_FOLDER_ID + ' ' + MANERGE_PACK_ID);
  folder.deleteAPack(MANERGE_PACK_ID);

  displayPackInFolder(MANERGE_FOLDER_ID);
}

function displayFolderInPopup(folderId) {
	 //display folder
   
  //get local storage 
  var folderArray = JSON.parse(localStorage.folder);
  
  //generate ui code
  var result = '<li data-role="list-divider">選擇資料夾</li>';
  for (var i in folderArray) {
    //don't display all folder and current folder
    if (folderArray[i].id === 'allPackId') { }
    else if (folderId !== folderArray[i].id) {
      var folder_templete = '<li folderid="' + folderArray[i].id + '" class="folder"><a data-rel="back" href="#">' + folderArray[i].name + '</a></li>';
      result += folder_templete;
    }
  }
  
  //refresh view
  $("#choose_folder_popup").html(result);
  $("#choose_folder_popup").listview("refresh");

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(change_pack_folder);
}

function change_pack_folder() {
  var folderId = $(this).attr('folderid');
  console.log('change_pack_folder ' + MANERGE_PACK_ID + ' from ' + MANERGE_FOLDER_ID + ' to ' + folderId);

  var folder = new Folder();
  folder.changePackTo(MANERGE_FOLDER_ID, MANERGE_PACK_ID, folderId);


  displayPackInFolder(MANERGE_FOLDER_ID);
}

function displayAllPack() {
  var result = '';

  for (var key in localStorage) {
    if (key === 'user') { }
    else if (key === 'folder') { }
    else {
      var pack = new Pack();
      pack.getPack(key);
      var templete = '<input type="checkbox" name="' + pack.id + '" id="' + pack.id + '">' +
        '<label for="' + pack.id + '">' + pack.name + '</label>';

      $("fieldset").controlgroup("container").append(templete);
    }
  }

  $('input[type=checkbox]').checkboxradio();
  $('fieldset').controlgroup('refresh');
}

function delete_pack_handler() {
  var elements = document.querySelectorAll('input[type="checkbox"]:checked');
  var checkedElements = Array.prototype.map.call(elements, function (el, i) {
    return el.name;
  });

  var folder = new Folder();
  for (var i in checkedElements) {
    console.log('[delete_pack_handler] packId:' + checkedElements[i]);
    folder.deleteAPack(checkedElements[i]);
  }
}

function call_delete_folder_popup() {
  $('#folder_action').popup("close");
  $('#delete_folder').popup("open");
}

function rename_btn() {
  var name = $("#new_folder_name").val();
  var folder = new Folder();
  folder.renameFolder(MANERGE_FOLDER_ID, name);
  $("#folder_rename").popup('close');
  
  //refresh folder
  displayFolder();
}