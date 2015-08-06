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
    navigator.notification.confirm("是否要離開APP ?", onConfirm, "Confirmation", "是,否");
    // Prompt the user with the choice
  }

  function onConfirm(button) {
    if (button != 2) { //If User selected No, then we just do nothing
      navigator.app.exitApp(); // Otherwise we quit the app.
    } else {
      return;
    }
  }

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

  FILE_STORAGE_PATH = cordova.file.externalDataDirectory;
  headerHeight = $(".ui-header").outerHeight();
  console.log(cordova.file);
  console.log(FileTransfer);


  if (localStorage.getItem('user') === null) {
    login();
  } else {
    $('#home_title').text(folderName);
    display_pack();
    display_folder();
    $('#user_name').text((JSON.parse(localStorage.user)).name);
    navigator.splashscreen.hide();
  }

  $('#logout').click(logout);
}

$(document).on("pageshow", "#home", function() {
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
  $("[class~='sidebar-folder-listview']").remove();

  //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result = "";
  var i;
  for (i in folderArray) {
    var folder_templete = '<li class="sidebar-folder-listview">' +
      '<a href="#" class=" ui-btn ui-btn-icon-left ui-nodisc-icon ui-alt-icon ui-icon-carat-r" onclick="folder_click_handler(\'' + folderArray[i].id + '\')">' +
      '<h2>' + folderArray[i].name + '</h2>' +
      '<span class="ui-li-count ui-body-inherit">' + folderArray[i].pack.length + '</span>' +
      '</a></li>';

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
    var pack = new Pack();
    pack.getPack(packArray[j]);

    if (pack.cover_filename !== "") {
      pack_templete = '<li onclick= "go_pack_handler(\'' + pack.id + '\')"><a href="#"><img src="' + FILE_STORAGE_PATH + pack.id + '/' + pack.cover_filename + '"><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></a></li>';
    } else {
      //default img
      pack_templete = '<li onclick= "go_pack_handler(\'' + pack.id + '\')"><a href="#"><img src="img/light102.png"><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></a></li>';
    }
    result += pack_templete;
  }

  //display pack
  $('#pack_display_area').html(result);
  $("#pack_display_area").listview("refresh");
}

function folder_click_handler(folderId) {
  var folderArray = JSON.parse(localStorage.folder);

  var packArray;
  //find current folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].id == folderId) {
      folderName = folderArray[i].name;
      packArray = folderArray[i].pack;
      $('#home_title').text(folderName);
      break;
    }
  }

  display_pack_content(packArray);
  $("#menu_panel").panel("close");
}

function go_pack_handler(packid) {
  viewPackId = packid;

  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function search_pack() {
  var input = $('#search').val().trim();

  //if no input do nothing
  if (input === "") {
    $('#search-result').html("<li>請輸入關鍵字查詢</li>");
    $('#search-result').listview('refresh');
    return;
  }

  $.ajax({
    type: "GET",
    url: SERVER_URL + "easylearn/search",
    data: {
      search_text: input,
    },
    success: function(data) {
      console.log('success search');
      console.log(data);
      if (data.length === 0) {
        $('#search-result').html("<li>找不到符合的懶人包</li>");
        $('#search-result').listview('refresh');
        return;
      }

      var result = '';
      for (var i in data) {
        //cover img
        var img;
        if (data[i].cover_filename !== '')
          img = '<img src="' + SERVER_URL + 'easylearn/download?filename=' + data[i].cover_filename + '&pack_id=' + data[i].id + '">';
        else
          img = '<img src="img/light102.png">';

        var templete = '<li onclick=\"checkout_pack(\'' + data[i].id + '\')\">' +
          '<a href="#">' + img +
          '<h2>' + data[i].name + '</h2>' +
          '<p>' + data[i].description + '</p>' +
          '</a>' +
          '</li>';
        result += templete;
      }
      $('#search-result').html(result);
      $('#search-result').listview('refresh');
    }
  });
}

function checkout_pack(packId) {
  var callback = function() {
    viewPackId = packId;
    $.mobile.changePage("search_view_pack.html", {
      transition: "pop",
    });
  };
  getPack(packId, callback);
}

function export_popup() {
  //prepare popup
  var result = '<li data-role="list-divider" id="zip">選擇輸出的項目</li>';
  result += '<li><a href="#" onclick="export_data()">輸出全部</a></li>';

  //prepare item
  for (var key in localStorage) {
    if (key.indexOf('pack') != -1) {
      var pack = new Pack();
      pack.getPack(key);
      var templete = '<li><a href="#" onclick="export_pack(\'' + key + '\')">' + pack.name + '</a></li>';
      result += templete;
    }
  }

  //resfresh result listview
  $('#export_listview').html(result).listview('refresh');
  $('#export_popup').popup('open');
}

document.addEventListener("deviceready", function(){
  var pushNotification = window.plugins.pushNotification;
     pushNotification.register(
          successHandler,
          errorHandler, {
            'senderID':'277155669423',
            'ecb':'onNotificationGCM' // callback function
      }
      );


});
    function successHandler(result) {
        console.log('Success: '+ result);
     }
     function errorHandler(error) {
        console.log('Error: '+ error);
      }

  function onNotificationGCM(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
            alert("foreground");

        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                alert("cold start");
            }
            else
            {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                alert("except cold start");
            }
        }

       $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
           //Only works for GCM
       $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');

    break;

    case 'error':
        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}
