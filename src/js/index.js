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
  
  //disable back button
  document.addEventListener("backbutton", onBackKeyDown, false);
  function onBackKeyDown(e) {
    e.preventDefault();
    navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No"); 
    // Prompt the user with the choice
  }

  function onConfirm(button) {
    if (button == 2) {//If User selected No, then we just do nothing
      return;
    } else {
      navigator.app.exitApp();// Otherwise we quit the app.
    }
  }
}

/**
 * Catch "mobileinit" event which is fired when a jQueryMobile is loaded.
 * Ensure that we respond to this event only once.
 */
$(document).one("mobileinit", function () {
  jqmReady.resolve();
});

/**
 * Run your App Logic only when both frameworks have loaded
 */
$.when(gapReady, jqmReady).then(myAppLogic);

var headerHeight;

//remember the pack to display
var viewPackId;
var viewPackVersion = {
  index: 0,
  id: ''
};

var folderName = 'All';
var FILE_STORAGE_PATH;


// App Logic
function myAppLogic() {
  headerHeight = $(".ui-header").outerHeight();
  console.log(cordova.file);
  console.log(FileTransfer);

  //localStorage.clear();
  //testLocalStorage();
  if (localStorage.getItem('user') === null) {
    login();
  }
  else {
    $('#home_title').text(folderName);
    display_pack();
    display_folder();
    $('#user_name').text((JSON.parse(localStorage.user)).name);
  }

  $('#logout').click(logout);
  FILE_STORAGE_PATH = cordova.file.externalDataDirectory;
}

$(document).on("pageshow", "#home", function () {
  //if device not ready deferred exec
  //this will happened when user first open app
  if (gapReady.state() != "pending") {
    $('#home_title').text(folderName);

    console.log('Home:pageshow');
    //refresh every visit home page
    display_pack();

    //update count in panel page
    display_folder();
    $('#user_name').text((JSON.parse(localStorage.user)).name);
  }

});


//display folder in left panel
function display_folder() {
  $("li:has([folderid])").remove();

  //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = "";
  var i;
  for (i in folderArray) {
    var folder_templete = '<li><a href="#" class="folder ui-btn ui-btn-icon-left ui-nodisc-icon ui-alt-icon ui-icon-carat-r" folderid="' +
      folderArray[i].id + '"><h2>' + folderArray[i].name + '</h2><span class="ui-li-count ui-body-inherit">' +
      folderArray[i].pack.length + '</span></a></li>';
    result += folder_templete;
  }
  $(result).insertAfter('#folder_display');
  $("#left_panel").listview("refresh");

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(folder_click_handler);
}

//display default all page
function display_pack() {
  var folderArray = JSON.parse(localStorage.folder);

  var packArray;
  //find current folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].name === folderName) {
      packArray = folderArray[i].pack;
      break;
    }
  }
  display_pack_content(packArray);
}

//display pack in content
function display_pack_content(packArray) {
  //generate pack html code
  var result = "";
  var pack_templete = "";
  var j;


  for (j in packArray) {
    //get pack from localStorage
    var pack = JSON.parse(localStorage.getItem(packArray[j]));

    //get pack's id
    var packId = packArray[j];

    if (pack.cover_filename !== "") {
      //display cover image while its finished
      getImgNode(packId, pack.cover_filename, displayCoverImgAtHome);
      pack_templete = '<li packid= "' + packId + '"><a href="#"><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></a></li>';
    } else {
      pack_templete = '<li packid= "' + packId + '"><a href="#"><img src="img/light102.png"><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></a></li>';
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

function folder_click_handler() {
  var folderArray = JSON.parse(localStorage.folder);

  var packArray;
  //find current folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].id == $(this).attr('folderid')) {
      folderName = folderArray[i].name;
      packArray = folderArray[i].pack;
      $('#home_title').text(folderName);
      break;
    }
  }

  display_pack_content(packArray);

  $("#menu_panel").panel("close");
}

function go_pack_handler() {
  viewPackId = $(this).attr('packid');

  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function search_pack() {
  var input = $('#search').val();
  var result = '';

  $.ajax({
    type: "GET",
    url: SERVER_URL + "easylearn/search",
    data: {
      search_text: input,
    },
    success: function (data) {
      console.log('success search');
      console.log(data);
      for (var i in data) {
        var templete = '<li>' +
          '<a href="#">' +
          '<img src="' + data[i].name + '">' +
          '<h2>' + data[i].name + '</h2>' +
          '<p>' + data[i].description + '</p>' +
          '</a>' +
          '</li>';
        result += templete;
      }
      $('#saerch-result').html(result);

      $('#saerch-result').listview('refresh');
    }
  });
}