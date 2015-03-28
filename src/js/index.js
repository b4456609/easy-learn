$(document).on("pagebeforecreate", "#home", function() {
  localStorage.clear();
  testLocalStorage();
});
$(document).on("pageinit", "#home", function() {});
var headerHeight;

$(document).on("pageshow", "#home", function() {

  headerHeight = $(".ui-header").outerHeight();

  //refresh every visit home page
  display_all_pack();

  //update count in panel page
  display_folder();

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(folder_click_handler);
  $("li[packid]").click(go_pack_handler);
});

//remember the pack to display
var viewPackId;

function folder_click_handler() {
  var folderArray = JSON.parse(localStorage.folder);

  var packArray;
  //find current folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].id == $(this).attr('folderid')) {
      packArray = folderArray[i].pack;
      break;
    }
  }

  display_pack(packArray);

  $("#menu_panel").panel("close");
  go_pack_handler();
}

function go_pack_handler() {
  viewPackId = $(this).attr('packid');

    console.log('click on pack:' + viewPackId);
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

//display folder in left panel
function display_folder() {
  $("li:has([folderid])").remove();

  //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = "";
  var i;
  for (i in folderArray) {
    var folder_templete = '<li><a href="#" class="folder ui-btn ui-btn-icon-left ui-nodisc-icon ui-alt-icon ui-icon-carat-r" folderid="' + folderArray[i].id + '"><h2>' + folderArray[i].name + '</h2><span class="ui-li-count ui-body-inherit">' + folderArray[i].pack.length + '</span></a></li>';
    result += folder_templete;
  }
  $(result).insertAfter('#folder_display');
  $("#left_panel").listview("refresh");
}

//display default all page
function display_all_pack() {
  var folderArray = JSON.parse(localStorage.folder);

  var packArray;
  //find current folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].name == 'All') {
      packArray = folderArray[i].pack;
      break;
    }
  }
  display_pack(packArray);
}

//display pack in content
function display_pack(packArray) {
  //generate pack html code
  var result = "";
  var j;
  for (j in packArray) {
    var pack = JSON.parse(localStorage.getItem(packArray[j]));

    var pack_templete = '<li packid= "' + packArray[j] + '"><a href="#"><img src="img/chrome.png"><h2>' + pack.name + '</h2><p>' + pack.description + '</p></a></li>';
    result += pack_templete;
  }

  //display pack
  $('#pack_display_area').html(result);
  $("#pack_display_area").listview("refresh");
}
