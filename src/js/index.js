$(document).on("pagebeforecreate", "#home", function() {
  testLocalStorage();

});



$(document).on("pageinit", "#home", function() {});
var headerHeight;

$(document).on("pageshow", "#home", function() {
  headerHeight = $(".ui-header").outerHeight();

  //refresh every visit home page
  display_pack();

  //update count in panel page
  display_folder();

  //click event on folder
  //display the folder pack in home page
  $('.folder').click(function() {
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

    //generate pack html code
    var result = "";
    var j;
    for (j in packArray) {
      var pack = JSON.parse(localStorage.getItem(packArray[j]));

      var pack_templete = '<li><a href="#"><img src="img/chrome.png"><h2>' + pack.name + '</h2><p>' + pack.description + '</p></a></li>';
      result += pack_templete;
    }

    //display pack
    $('#pack_display_area').html(result);
    $("#pack_display_area").listview("refresh");

    $( "#menu_panel" ).panel( "close" );
  });
});

function display_folder(){
  $("li:has([folderid])").remove();

  //display folder
  var folderArray = JSON.parse(localStorage.folder);
  var result="";
  var i;
  for (i in folderArray) {
    var folder_templete = '<li><a href="#" class="folder ui-btn ui-btn-icon-left ui-nodisc-icon ui-alt-icon ui-icon-carat-r" folderid="' + folderArray[i].id + '"><h2>' + folderArray[i].name + '</h2><span class="ui-li-count ui-body-inherit">' + folderArray[i].pack.length + '</span></a></li>';
    result+=folder_templete;
  }
  $(result).insertAfter('#folder_display');
  $("#left_panel").listview("refresh");
}

function display_pack(){
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

  //generate pack html code
  var result = "";
  var j;
  for (j in packArray) {
    var pack = JSON.parse(localStorage.getItem(packArray[j]));

    var pack_templete = '<li><a href="#"><img src="img/chrome.png"><h2>' + pack.name + '</h2><p>' + pack.description + '</p></a></li>';
    result += pack_templete;
  }

  //display pack
  $('#pack_display_area').html(result);
  $("#pack_display_area").listview("refresh");
}
