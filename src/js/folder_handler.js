var MANERGE_FOLDER_ID;
var MANERGE_PACK_ID;

$(document).on("pageinit", "#folder", function () {
  displayFolder();
});


$(document).on("pageinit", "#folder_pack", function () {
  displayPackInFolder(MANERGE_FOLDER_ID);
});

function displayPackInFolder(folderId) {
  var folder = new Folder();
  var packInFolder = folder.getPacks(folderId);
  var result = '';
  for (var i in packInFolder) {
    var pack = new Pack();
    pack.getPack(packInFolder[i]);
    var templete = '<li data-role="collapsible" data-iconpos="right" data-inset="false"><h2>' + pack.name + '</h2><ul data-role="listview" data-theme="b">' +
      '<li packid="' + pack.id + '" onclick="select_pack()"><a href="#move_pack" data-rel="popup" data-position-to="window" data-transition="pop">移動此懶人包</a></li>' +
      '<li packid="' + pack.id + '" onclick="select_pack()"> <a href="#delte_pack" data- rel="popup" data- position - to="window" data- transition="pop" > 刪除此懶人包 < /a></li >' +
      '</ul>< /li>';
    result += templete;
  }
  $('#pack_in_folder').html(result);
  $('#pack_in_folder').listview("refresh");
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
    var folder_templete = '<li folderid="' + folderArray[i].id + '"><a href="folder_pack.html">' + folderArray[i].name + '</a><a href="#delete_folder" data-rel="popup" data-position-to="window" data-transition="pop">Delte Folder</a></li>';
    result += folder_templete;
  }
  $('#my_folder_divider').after(result);
  $("#my_folder").listview("refresh");
  
  $("li[folderid]").click(select_folder);
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