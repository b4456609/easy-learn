// use for new note temp variable
var note_selection = {
  id: '',
  word: '',
  new_version_content: '',
  range: null
};

var viewNoteArrayIndex;

function noteInit() {
  //note initail
  $("#note-display").toolbar("option", "position", "fixed");
  $("#note-display").toolbar("option", "tapToggle", false);

  //note hold handler
  $('#veiw_pack_content').on("taphold", function() {
    console.log('[viewPack]hold content');
    var sel = window.getSelection();
    console.log('[viewPack]isCollapsed' + sel.isCollapsed);

    if (!sel.isCollapsed) {
      var next = '<a href="new_note.html" id="note_choose_next" class="ui-btn ui-btn-inline ui-mini ui-corner-all" onclick="note_next_handler(\'#veiw_pack_content\')">新增便利貼</a>';
      $('.ui-btn-right').html(next);
      $('#note_choose_next').button();
    }
  });

  //note hold handler
  $('#veiw_pack_content').on("tap", function() {
    console.log('[viewPack]tap content');

    var menu = '<a href="#popupMenu" id="app-bar-menu-btn" class="ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-bullets" data-rel="popup">選單</a>';
    $('.ui-btn-right').html(menu);
    $('#app-bar-menu-btn').button();

  });

  //click and show note hanlder
  $(".note").click(showNoteHandler);

}

$(document).on('pageinit', "#comment", function() {
  //get pack for comment content
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));
  var currentNote = pack.version[viewStorage.versionIndex].note[viewNoteArrayIndex];

  //display note word
  $('#note_word').html(noteText);

  //display selection word
  $('#display_note_area').html(currentNote.content);

  //find current note's comment array
  var commentArray = currentNote.comment;

  //display comment on screen
  displayComment(commentArray);
  getNewerComment(currentNote.id, commentArray);

});


$(document).on('pageshow', "#comment", function() {
  //comment submit button
  $('#comment_submit').click(comment_submit_handler);
  $('#reload_comment').click(function() {
    var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));
    var currentNote = pack.version[viewStorage.versionIndex].note[viewNoteArrayIndex];
    var commentArray = currentNote.comment;
    getNewerComment(currentNote.id, commentArray);
  });
});


$(document).on('pageinit', "#new_note", function() {
  //display selection word
  $('#new_note_word').html(note_selection.word);
});

$(document).on('pageshow', "#new_note", function() {
  //save note handler
  $('#save_note').click(save_note_handler);
});

$(document).on('pageinit', "#new_note_choose", function() {
  console.log("#new_note_choose pageinit");
  //show choose content
  var pack = new Pack();
  pack.getPack(viewStorage.getViewPackId());
  //prepare content
  var content = pack.version[viewStorage.versionIndex].content;
  content = replacePackImgPath(content);
  $('#choose_pack_content').html(content);
});

function save_note_handler() {
  //get current time
  var time = new Date();

  // get color class
  var colorClassName = $('input[name=color_choose]:checked', '#color_choose').val();

  //set color to content
  note_selection.new_version_content = note_selection.new_version_content.replace('class="note"', 'class="note ' + colorClassName + '"');

  //replace file path
  var find = FILE_STORAGE_PATH;
  var re = new RegExp(find, 'g');
  note_selection.new_version_content = note_selection.new_version_content.replace(re, 'FILE_STORAGE_PATH');

  //save in localStorage
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));

  //update version
  var currentVersion = pack.version[viewStorage.versionIndex];
  currentVersion.content = note_selection.new_version_content;

  //update modified
  currentVersion.modified = "true";

  //prepare new note
  var newNote = {
    id: note_selection.id,
    content: $('#note_content').val(),
    user_id: JSON.parse(localStorage.user).id,
    user_name: JSON.parse(localStorage.user).name,
    create_time: time.getTime(),
    comment: []
  };

  //append note in pack's version
  currentVersion.note.push(newNote);

  //write in localStorage
  localStorage.setItem(viewStorage.getViewPackId(), JSON.stringify(pack));
}

function note_next_handler(sel) {

  //get current time
  var time = new Date();

  //create note id
  var noteId = "note" + time.getTime();
  note_selection.id = noteId;

  var selection = window.getSelection();

  // write in object for next page use
  note_selection.word = selection.toString();
  note_selection.range = selection.getRangeAt(0);

  //paint note for next step conveient use
  paintNote(selection, noteId);

  //get new version's code save into temp variable
  note_selection.new_version_content = $(sel).html();

}

function paintNote(selection, noteId) {
  var range = selection.getRangeAt(0);

  var span = document.createElement("span");
  span.className = "note";
  span.setAttribute('noteid', noteId);
  range.surroundContents(span);
}

function comment_submit_handler() {

  //get pack for comment content
  var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));

  //get text from user input
  var commentContent = $('#comment_text').val();

  //clear textarea
  $('#comment_text').val('');

  //get current time
  var time = new Date();

  //display comment instant
  var commentTemplate = '<li><h2>' + JSON.parse(localStorage.user).name +
    '</h2><font style="white-space:normal; font-size: small">' +
    commentContent + '</font><p class="ui-li-aside" style="margin-top: 9px">' +
    time.toLocaleString("zh-TW", {
      hour: '2-digit',
      minute: 'numeric',
      day: "numeric",
      month: "numeric"
    }) + '</p></li>';
  // display comment
  $('#comment_display_area').append(commentTemplate);
  $("#comment_display_area").listview("refresh");

  //prepare new comment
  var newComment = {
    id: 'comment' + time.getTime(),
    content: commentContent,
    create_time: time.getTime(),
    user_id: JSON.parse(localStorage.user).id,
    user_name: JSON.parse(localStorage.user).name
  };


  //get current note
  var currentNote = pack.version[viewStorage.versionIndex].note[viewNoteArrayIndex];

  //add new comment
  currentNote.comment[currentNote.comment.length] = newComment;

  //update pack in localStorage
  localStorage.setItem(viewStorage.getViewPackId(), JSON.stringify(pack));

  //save to server
  postComment(currentNote.id, newComment);
}

function getNewerComment(currentNoteId, commentArray) {
  console.log('getNewerComment');

  //get the newst comment date for ajax
  getComment(currentNoteId);
}

function displayComment(commentArray) {
  //create comment html code
  var i;
  var commentTemplate = '';
  commentArray.sort(function(a, b) {
    return a.create_time - b.create_time;
  });
  for (i in commentArray) {
    var time = new Date(commentArray[i].create_time);

    commentTemplate += '<li><h2>' + commentArray[i].user_name + '</h2><font style="white-space:normal; font-size: small">' + commentArray[i].content + '</font><p class="ui-li-aside" style="margin-top: 9px">' + time.toLocaleString("zh-TW", {
      hour: '2-digit',
      minute: 'numeric',
      day: "numeric",
      month: "numeric"
    }) + '</p></li>';
  }

  // display comment
  $('#comment_display_area').html(commentTemplate);
  $("#comment_display_area").listview("refresh");
}
