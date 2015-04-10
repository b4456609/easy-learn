//THIS CODE SHOULD BE PART OF A FILE WHICH IS LOADED BEFORE jQueryMobile

/**
 * Create couple of jQuery Deferred Objects to catch the
 * firing of the two events associated with the loading of
 * the two frameworks.
 */
var gapReady = $.Deferred();
var jqmReady = $.Deferred();

//Catch "deviceready" event which is fired when PhoneGap is ready
document.addEventListener("deviceReady", deviceReady, false);

//Resolve gapReady in reponse to deviceReady event
function deviceReady() {
  gapReady.resolve();
}

/**
 * Catch "mobileinit" event which is fired when a jQueryMobile is loaded.
 * Ensure that we respond to this event only once.
 */
$(document).one("mobileinit", function() {
  jqmReady.resolve();
});

/**
 * Run your App Logic only when both frameworks have loaded
 */
$.when(gapReady, jqmReady).then(myAppLogic);

// App Logic
function myAppLogic() {
  console.log(cordova.file);
  console.log(FileTransfer);

  localStorage.clear();
  testLocalStorage();
  display_all_pack();
  display_folder();
  loggin();
}

var headerHeight;

//remember the pack to display
var viewPackId;
var viewPackVersion = {
  index: 0,
  id: ''
};


$(document).on("pageshow", "#home", function() {

  headerHeight = $(".ui-header").outerHeight();

  console.log('Home:pageshow');

  //if device not ready deferred exec
  //this will happened when user first open app
  if (gapReady.state() != "pending") {
    //refresh every visit home page
    display_all_pack();

    //update count in panel page
    display_folder();
  }
});



//display folder in left panel
function display_folder() {
  console.log('display_folder');
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

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(folder_click_handler);
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
  console.log('display_pack');
  //generate pack html code
  var result = "";
  var pack_templete = "";
  var j;

  console.log(packArray);

  for (j in packArray) {
    //get pack from localStorage
    var pack = JSON.parse(localStorage.getItem(packArray[j]));

    //get pack's id
    var packId = packArray[j];

    console.log(pack.cover_filename);

    if (pack.cover_filename !== null) {
      console.log('getImgNode' + packId + pack.cover_filename);
      //display cover image while its finished
      getImgNode(packId, null, pack.cover_filename, displayCoverImgAtHome);
      pack_templete = '<li packid= "' + packId + '"><a href="#"><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></a></li>';
    } else {
      pack_templete = '<li packid= "' + packId + '"><a href="#"><img src="img/chrome.png"><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></a></li>';
    }
    result += pack_templete;
  }

  //display pack
  $('#pack_display_area').html(result);
  $("#pack_display_area").listview("refresh");

  //register click handler
  $("li[packid]").click(go_pack_handler);
}

function displayCoverImgAtHome(packId, img) {
  $('li[packid=' + packId + ']').prepend(img);
  $("#pack_display_area").listview("refresh");
}

// function getFileDisplayAtHome(file){
//   console.log('display_pack.file');
//   console.log('return' + file);
//   var img = document.createElement("img");
//   var reader = new FileReader();
//   reader.onloadend = function() {
//     img.src = reader.result;
//   };
//
//   reader.readAsDataURL(file);
//
//   var pack_templete = '<li packid= "' + packArray[j] + '"><a href="#">' + img.toString() + '<h2>' + pack.name + '</h2><p>' + pack.description + '</p></a></li>';
//   result += pack_templete;
//}


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
}

function go_pack_handler() {
  viewPackId = $(this).attr('packid');

  console.log('click on pack:' + viewPackId);
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function loggin(){

$.mobile.changePage( "loggin.html", {
		transition: "pop",
		reverse: false,
		changeHash: false
});

}
