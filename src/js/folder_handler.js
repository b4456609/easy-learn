var MANERGE_FOLDER_ID;
var MANERGE_PACK_ID;

$(document).on("pageinit", "#delete_pack", function () {
  displayAllPack();
});

$(document).on("pageinit", "#folder", function () {
  displayFolder();
});


$(document).on("pageinit", "#folder_pack", function () {
  displayPackInFolder(MANERGE_FOLDER_ID);
  preparePopup();
  displayFolderInPopup();
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
  var folder = new Folder();
  var packInFolder = folder.getPacks(folderId);
  var result = '';
  for (var i in packInFolder) {
    var pack = new Pack();
    pack.getPack(packInFolder[i]);
    var templete = '<li onclick="select_pack(\'' + pack.id + '\')" class="pack_coll" data-role="collapsible" data-iconpos="right">' +
      '<h2>' + pack.name + '</h2>' +
      '<ul class="pack_listview" data-role="listview" data-theme="b" data-inset="false">' +
      '<li><a href="#move_pack" data-rel="popup" data-position-to="window" data-transition="pop">移動此懶人包</a></li>' +
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
        '<a href="#delete_folder" data-rel="popup" data-position-to="window" data-transition="pop" onclick"select_delete(\'' + folderArray[i].id + '\')">Delete Folder</a></li>';
      result += folder_templete;
    }
  }
  systemFolder += result;
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
  folder.deletePack(MANERGE_FOLDER_ID, MANERGE_PACK_ID);

  displayPackInFolder(MANERGE_FOLDER_ID);
}

function displayFolderInPopup() {
	 //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = '<li data-role="list-divider">選擇資料夾</li>';
  var i;
  for (i in folderArray) {
    var folder_templete = '<li folderid="' + folderArray[i].id + '" class="folder"><a data-rel="back" href="#">' + folderArray[i].name + '</a></li>';
    result += folder_templete;
  }

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


  displayPackInFolder(MANERGE_FOLDER_ID);;
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