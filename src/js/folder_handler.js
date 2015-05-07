var MANERGE_FOLDER_ID;

$(document).on("pageinit", "#folder", function () {
  displayFolder();
});


$(document).on("pageinit", "#folder", function () {
  displayFolder();
});

function displayFolder(){
  //remove previous
  $("li[folderid]").remove();
  
	 //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = "";
  var i;
  for (i in folderArray) {
    var folder_templete = '<li folderid="' + folderArray[i].id + ' class="folder"><a href="folder_pack.html">' + folderArray[i].name + '</a><a href="#delte_folder" data-rel="popup" data-position-to="window" data-transition="pop">Delte Folder</a></li>';
    result += folder_templete;
  }
  $('#my_folder_divider').after(result);
  $("#my_folder").listview("refresh");

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(manage_folder);
}

function deletePack(folderId, packId) {
  var folder = new Folder();
  folder.deletePack(folderId, packId);
}

function manage_folder(event) {
   MANERGE_FOLDER_ID = $(this).attr('folderid');
   $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function add_folder_handler() {
  var newFolder = $('#fn').val();
  var folder = new Folder();
  folder.addFolder(newFolder);
  
  //refresh view
  displayFolder();
}