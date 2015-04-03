//for comment display use
var noteText;

//for picture use
var newPackId;

//for new file use
var cover_filename = null;

//for new pack use
var new_pack;

$(document).on("pageinit", "#new_pack_edit", function() {

  //set editor height
  $('#iframe1').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });

  //save pack in localStorage
  $('#save_pack').click(savePackHandler);

});

$(document).on('pageinit', "#new_pack", function() {

  //get current time
  var time = new Date().getTime();
  newPackId = 'pack' + time;
  // $('#tags').tagsInput({
  //   'height': '100px',
  //   'width': $(window).width() + 'px',
  //   'delimiter': [',', ';', ' '],
  //   'removeWithBackspace': true,
  //   'defaultText': 'add a tag',
  // });

  // save new pack storage for next page use
  $('#new_pack_next').click(function() {

    //construct new pack object
    new_pack = {
      "creator_user_id": JSON.parse(localStorage.user).id,
      "create_time": time.toString(),
      "name": $('#new_pack_title').val(),
      "is_public": document.getElementById("is_public").checked,
      "description": $('#new_pack_description').val(),
      "tags": $('#tags').val(),
      "cover_filename": cover_filename,
      "version": [],
    };
  });


  $('#choose_photo').click(getPhotoWithModifySize);
});

$(document).on('pageinit', "#view_pack", function() {
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  console.log('view pack ID:' + viewPackId);
  console.log('view pack name:' + pack.name);
  $('#veiw_pack_content').html(pack.version[viewPackVersion].content);
  $('#pack_title').html(pack.name);


});


$(document).on('pageshow', "#view_pack", function() {


  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //    click and show note hanlder
  $(".note").click(showNoteHandler);


});


function show_comment() {
  $(":mobile-pagecontainer").pagecontainer("change", "comment.html");
}

function showNoteHandler() {
  console.log("click on note event");
  //display the note
  $("#note-display").toolbar("show");

  //get note id
  var noteId = $(this).attr('noteid');
  noteText = $(this).text();

  //get pack for note content
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  var noteArray = pack.version[viewPackVersion].note;

  //find current note
  var i;
  for (i in noteArray) {
    if (noteArray[i].id == noteId) {
      break;
    }
  }

  // insert html into note area
  //var template = '<h4>'+noteText+'</h4><div class="note-content"><p>Chromium是一個由Google主導開發的網頁瀏覽器，以BSD授權條款等多重自由版權發行並開放原始碼。Chromium的開發可能早自2006年即開始[1]，2008年12月11日釋出1.0版本，設計思想基於簡單、高速、穩定、安全等理念，在架構上使用了蘋果發展出來的WebKit排版引擎（自28版起改為由WebKit所分支的Blink排版引擎）、Safari的部份原始碼與Firefox的成果，並採用Google獨家開發出的V8引擎以提升解譯JavaScript的效率，而且設計了「沙盒」、「黑名單」、「無痕瀏覽」等功能來實現穩定與安全的網頁瀏覽環境。</p></div><div class="note-function-button"><a class="ui-btn note-left-button">返回</a><a id="show_comment" class="ui-btn note-right-button">查看留言</a></div>';
  var noteTemplate = '<h4>' + noteText + '</h4><div class="note-content"><p>' + noteArray[i].content + '</p></div><div class="note-function-button"><a class="ui-btn note-left-button">返回</a><a id="show_comment" class="ui-btn note-right-button">查看留言</a></div>';

  $("#note-display").html(noteTemplate);

  //refresh footer for diiplay
  $("#note-display").toolbar("refresh");

  //hide note button action
  $(".note-left-button").click(hideButtonHandler);

  //show comment button action
  $("#show_comment").click(show_comment);

  //save array index for comment page quick find current note
  viewNoteArrayIndex = i;
}

function hideButtonHandler() {
  //hide the note
  $("#note-display").toolbar("hide");

  //clear html
  $("#note-display").html("");
  $("#note-display").toolbar("refresh");
}

function getPhotoWithModifySize() {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 80,
    targetWidth: 800,
    targetHeight: 800,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
  });
}

function onSuccess(imageData) {
  console.log('onSuccess');
  console.log(imageData);

  window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
    addFileToPack(newPackId, fileEntry);
  }, fail);
}

function onFail(message) {
  alert('Failed because: ' + message);
  console.log('Failed because: ' + message);
}

function displayCoverImg(packfileEntry) {
  console.log(packfileEntry);
  packfileEntry.file(function(file) {

    console.log('fileEntry.file');
    console.log('return' + file);
    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onloadend = function() {
      img.src = reader.result;
    };
    img.style.width = '100%';

    console.log('fileEntry.file.readAsDataURL');
    reader.readAsDataURL(file);
    $("#cover_photo_area").html(img);
  }, fail);
}

function savePackHandler() {
  //get editor word
  var content = $('#iframe1').contents().find('#edit').editable("getHTML", true, false);

  console.log(content);

  //change page
  $(":mobile-pagecontainer").pagecontainer("change", "index.html");
  console.log('after change index');

  //get current time
  var time = new Date().getTime();

  //create this page's information add it in pack
  new_pack.version[new_pack.version.length] = {
    "creator_user_id": JSON.parse(localStorage.user).id,
    "bookmark": [],
    "note": [],
    "file": [],
    "create_time": time.toString(),
    "is_public": new_pack.is_public,
    "id": "version" + time,
    "content": content,
  };

  console.log(new_pack);

  //set new pack in localStorage
  localStorage.setItem(newPackId, JSON.stringify(new_pack));

  //add it in folder all
  var folderArray = JSON.parse(localStorage.folder);

  //find all folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].name == 'All') {
      folderArray[i].pack[folderArray[i].pack.length] = newPackId;
      break;
    }
  }
  localStorage.setItem("folder", JSON.stringify(folderArray));
}

function load_editor() {
  $('#iframe1').contents().find('#edit').editable({
    'buttons': ['bold', 'italic', 'underline', 'color', 'strikeThrough', 'fontFamily',
      'fontSize', 'formatBlock', 'blockStyle', 'align', 'insertOrderedList',
      'insertUnorderedList', 'outdent', 'indent', 'undo', 'redo', 'html',
      'insertHorizontalRule', 'table', 'slideshare', 'insertVideo', 'insertImage',
      'createLink'
    ],
    inlineMode: false,
    toolbarFixed: false,
    customButtons: {
      // new slideshare button
      slideshare: {
        title: 'insert Slideshare',
        icon: {
          type: 'font',

          // Font Awesome icon class fa fa-*.
          value: 'fa fa-slideshare'
        },
        callback: function() {
          $("#popup_slideshare").popup("open");
          var user_url = $("#slideshare_url").val();

          $("#slideshare_submit").click({
            user_url: user_url
          }, slideshare_submit_handler);
        },
        refresh: function() {}
      }
    }
  });
}

function slideshare_submit_handler(event) {
  var url = "http://www.slideshare.net/api/oembed/2?url=" + event.data.user_url + "&format=json";
  $.get(url,
    function(data) {
      var start = $('#slideshare_start_page ').val();
      var end = $('#slideshare_end_page').val();

      console.log(start);
      console.log(typeof start);
      console.log(end);


      //error check
      if (start <=0 |start === null | start > data.total_slides){
        start = 1;
      }
      if (end < start){
        end = start;
      }
      else if(end > data.total_slides){
        end = data.total_slides;
      }

      var img = "";
      for (; start <= end; start++) {
        var http = 'http:' + data.slide_image_baseurl + start + data.slide_image_baseurl_suffix;
        img += "<img src=" + http + " style='width:100%;'>";
      }

      $('#iframe1').contents().find('#edit').editable("insertHTML", img, true);
    });

}
