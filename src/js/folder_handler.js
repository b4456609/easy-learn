var MANERGE_FOLDER_ID;
var MANERGE_PACK_ID;

$(document).on("pageinit", "#folder", function () {
  displayFolder();
});


$(document).on("pageinit", "#folder_pack", function () {
  displayPackInFolder(MANERGE_FOLDER_ID);
  preparePopup();
});

function preparePopup() {
  $('#choose_folder_popup').listview();

  var result = '<li data-role="list-divider">選擇資料夾</li>';
  var folder = new Folder();

  for (var i in folder.folderArray) {
    var templete = '<li class="change_folder" folderid="'+folder.folderArray[i].id+'"><a href="#">' + folder.folderArray[i].name + '</a></li>';
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
    var templete = '<li class="pack_coll" data-role="collapsible" data-iconpos="right" data-inset="false"><h2>' + pack.name + '</h2><ul class="pack_listview" data-role="listview" data-theme="b">' +
      '<li packid="' + pack.id + '" onclick="select_pack()"><a href="#move_pack" data-rel="popup" data-position-to="window" data-transition="pop">移動此懶人包</a></li>' +
      '<li packid="' + pack.id + '" onclick="select_pack()"> <a href="#delte_pack" data- rel="popup" data- position - to="window" data- transition="pop" > 刪除此懶人包 </a></li>' +
      '</ul></li>';
    result += templete;
  }
  $('#pack_in_folder').html(result);
  $('.pack_coll').collapsible({
    inset: false,
    mini: false
  });
  $('#pack_in_folder').listview("refresh");
  $('.pack_listview').listview();
}

function select_pack() {
  MANERGE_PACK_ID = $(this).attr('packid');
}

function displayFolder() {
  //remove previous
  $("li[folderid]").remove();
  
	 //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = "";
  var i;
  for (i in folderArray) {
    var folder_templete = '<li folderid="' + folderArray[i].id + '"><a href="folder_pack.html">' + folderArray[i].name + '</a><a href="#delete_folder" data-rel="popup" data-position-to="window" data-transition="pop" onclick"select_delete(\''+ folderArray[i].id +'\')">Delete Folder</a></li>';
    result += folder_templete;
  }
  $('#my_folder_divider').after(result);
  $("#my_folder").listview("refresh");

  $("li[folderid]").click(select_folder);
}

function select_delete(folderId){
  MANERGE_FOLDER_ID = folderId;
}

function delete_folder(){
  var folder = new Folder();
  folder.deleteFolder(MANERGE_FOLDER_ID);
  
  //refresh view
  displayFolder();
}

function deletePack(folderId, packId) {
  var folder = new Folder();
  folder.deletePack(folderId, packId);
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
  folder.deletePack(MANERGE_FOLDER_ID, MANERGE_PACK_ID);
}

function displayFolderInPopup() {
	 //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = '<li data-role="list-divider">選擇資料夾</li>';
  var i;
  for (i in folderArray) {
    var folder_templete = '<li folderid="' + folderArray[i].id + ' class="folder"><a href="#">' + folderArray[i].name + '</a></li>';
    result += folder_templete;
  }

  $("#choose_folder_popup").html(result);
  $("#choose_folder_popup").listview("refresh");

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(manage_folder);
}