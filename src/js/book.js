//var real_position = 0;
//var height1;
var bookmark_top = 0;

function showBookmark(pack) {
  var MarkArray = pack.version[viewStorage.versionIndex].bookmark;
  var real_width = $(document).width();
  var height1 = $(document).height();
  if (MarkArray === "") {} else {
    for (var i in MarkArray) {
      $("#veiw_pack_content").append("<img src='img/mark.png' alt='Smiley face' width='100' height='70' style='position:absolute;top:" + (MarkArray[i].position * height1) + "px;left:" + (real_width - 70) + "px;opacity:0.5;'/>");

    }
  }
  $("#new_mark").click(Remind);
}

function scrollToBookmarkPos(pos) {
    //comment submit button
    var height1 = $(document).height();
    $.mobile.silentScroll((pos * height1));
}

function bookmarkSubmitHandler(){

  $('#submit').click(MarkThePosition);

  console.log(bookmark_top);
  $("#view_pack").on("panelbeforeclose", function() {
    $(".remind_img").remove();
  });

  $(document).on("scrollstart", function() {
    $("#drag").draggable({
      start: function() {
        //$("#drag p").html("<p>用滑鼠拖曳</p>拖曳已開始!");
      },
      drag: function() {
        //$("#info").html("拖曳事件已觸發了 " + count + " 次");
      },
      stop: function() {
        console.log($(document).scrollTop());
        var offset = $(this).offset();
        var yPos = offset.top;
        console.log(yPos);
        bookmark_top = yPos;

      }
    });

  });
}

function Remind() {
  var real_width = $(document).width();
  var hight = ($(document).scrollTop()) + real_width / 2;
  $("#veiw_pack_content").append("<div  style='position: fixed;z-index:10000000;top:100px;'><img id='drag'; class ='remind_img' src='img/mark_remind.png' alt='Smiley face' width='" + real_width + "' height='70' style='position:absolute;top:" + hight + "px;opacity:0.5;'/></div>");
}

function MarkThePosition() {
  var real_height = $(document).height();
  var real_width = $(document).width();
  console.log(real_height);
  console.log(real_width);
  var hight = ($(document).scrollTop()) + (real_width / 2) + 250; //取得目前卷軸畫面的Y座標
  console.log(hight);

  $("#veiw_pack_content").append("<img src='img/mark.png' alt='Smiley face' width='100' height='70' style='position:absolute;top:" + bookmark_top + "px;left:" + (real_width - 70) + "px;opacity:0.5;'/>");

  var relative_position = hight / real_height;
  console.log(hight / real_height);
  save_book_mark_handler();
}

$(document).on('pageinit', "#bookmark", function() {
  //get pack for comment content
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));
  var MarkArray = pack.version[viewStorage.versionIndex].bookmark;

  //create comment html code
  var i;
  var commentTemplate = '<ul data-role="listview" class="ui-listview">';
  for (i in MarkArray) {
    if (MarkArray[i].name === "")
      continue;
    else {
      commentTemplate += '<li Markindex="' + i + '" data-iconshadow="true" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-c"               data-theme="c" ><a href="#" class="ui-btn">' + MarkArray[i].name + '</a></li>';
    }
  }
  commentTemplate += '</ul>';
    // display comment

  $('#book_mark_content').append(commentTemplate);
  // $("#book_mark_content").listview("refresh");

});

$(document).on("pageshow", "#bookmark", function() {
  $("li[Markindex]").click(back2read);
});

function back2read() {
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));
  var MarkArray = pack.version[viewStorage.versionIndex].bookmark;

  var temp = parseInt($(this).attr('Markindex'));
  var position = MarkArray[temp].position;
  //real_position = position;
  viewStorage.setBookmarkPos(position);
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function save_book_mark_handler() {
  var real_height = $(document).height();
  var hight = bookmark_top;
  var relative_position = hight / real_height;
  //save in localStorage
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));

  //prepare new note
  var mark = {
    id: note_selection.id,
    name: $('#mark_name').val(),
    position: relative_position
  };

  console.log($('#mark_name').val());
  console.log(relative_position);


  //append note in pack's version
  pack.version[viewStorage.versionIndex].bookmark[pack.version[viewStorage.versionIndex].bookmark.length] = mark;

  //write in localStorage
  localStorage.setItem(viewStorage.getViewPackId(), JSON.stringify(pack));
  changeModifyStroageTime();
}
