function showBookmark(pack) {
  var MarkArray = pack.version[viewStorage.versionIndex].bookmark;
  var width = document.body.scrollWidth;
  var height = document.body.scrollHeight;
  if (MarkArray === "") {} else {
    for (var i in MarkArray) {
      $("#veiw_pack_content").append("<img src='img/mark.png' alt='Smiley face' width='100' height='70' style='position:absolute;top:" + (MarkArray[i].position * height) + "px;left:" + (width - 70) + "px;opacity:0.5;'/>");
    }
  }
}

function scrollToBookmarkPos(pos) {
  //comment submit button
  var height = document.body.scrollHeight - 50;
  $.mobile.silentScroll((pos * height));
}

function showNewBookmarkPrompt() {
  navigator.notification.prompt(
    '請輸入書籤名稱', // message
    onNewBookmarkPrompt, // callback to invoke
    '新增書籤', // title
    ['Ok', 'Exit'], // buttonLabels
    '' // defaultText
  );
}

function onNewBookmarkPrompt(result) {
  console.log('[onNewBookmarkPrompt]', result);

  if (result.buttonIndex === 1) {
    var bodyHeight = document.body.scrollHeight;
    var bodyWidth = document.body.scrollWidth;
    var scrollHeight = document.body.scrollTop + 50;
    var relative_position = scrollHeight / bodyHeight;

    $("#veiw_pack_content").append("<img src='img/mark.png' alt='Smiley face' width='100' height='70' style='position:absolute;top:" + relative_position * bodyHeight + "px;left:" + (bodyWidth - 70) + "px;opacity:0.5;'/>");

    console.log('[onNewBookmarkPrompt]', bodyHeight, scrollHeight);
    save_book_mark_handler(relative_position, result.input1);
  }
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

  viewStorage.setBookmarkPos(position);
  $(":mobile-pagecontainer").pagecontainer("change", "view_pack.html");
}

function save_book_mark_handler(pos, title) {
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));

  //get current time
  var time = new Date().getTime();

  //prepare new note
  var mark = {
    id: 'bookmark' + time,
    name: title,
    position: pos
  };

  //append note in pack's version
  pack.version[viewStorage.versionIndex].bookmark[pack.version[viewStorage.versionIndex].bookmark.length] = mark;

  //write in localStorage
  localStorage.setItem(viewStorage.getViewPackId(), JSON.stringify(pack));
}
