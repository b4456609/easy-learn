// use for new note temp variable
var note_selection = {
  id: '',
  word: '',
  new_version_content: '',
  range: null
};

var viewNoteArrayIndex;

$(document).on('pageinit', "#comment", function() {
  //get pack for comment content
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  var currentNote = pack.version[viewPackVersion.index].note[viewNoteArrayIndex];

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
    var pack = JSON.parse(localStorage.getItem(viewPackId));
    var currentNote = pack.version[viewPackVersion.index].note[viewNoteArrayIndex];
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
  $("#color_choose").checkboxradio({
    defaults: true
  });
  //show choose content
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  $('#choose_pack_content').html(pack.version[viewPackVersion.index].content);
});

$(document).on('pageshow', "#new_note_choose", function() {
  //button for next step
  $('#note_choose_next').click(note_next_handler);
});

function save_note_handler() {
  //get current time
  var time = new Date();

  // get color class
  var colorClassName = $('input[name=color_choose]:checked', '#color_choose').val();

  //set color to content
  note_selection.new_version_content = note_selection.new_version_content.replace('class="note"', 'class="note ' + colorClassName + '"');

  //save in localStorage
  var pack = JSON.parse(localStorage.getItem(viewPackId));

  //update version
  pack.version[viewPackVersion.index].content = note_selection.new_version_content;

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
  pack.version[viewPackVersion.index].note[pack.version[viewPackVersion.index].note.length] = newNote;

  //write in localStorage
  localStorage.setItem(viewPackId, JSON.stringify(pack));
}

function note_next_handler() {

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
  note_selection.new_version_content = $('#choose_pack_content').html();

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
  var pack = JSON.parse(localStorage.getItem(viewPackId));

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
    time.toLocaleString(navigator.language, {
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
  var currentNote = pack.version[viewPackVersion.index].note[viewNoteArrayIndex];

  //add new comment
  currentNote.comment[currentNote.comment.length] = newComment;

  //update pack in localStorage
  localStorage.setItem(viewPackId, JSON.stringify(pack));

  //save to server
  postComment(currentNote.id, newComment);
}

function getNewerComment(currentNoteId, commentArray) {
  console.log('getNewerComment');

  //get the newst comment date for ajax
  var lastestCreateTime = 0;
  var i;
  for (i in commentArray) {
    var commentTime = new Date(commentArray[i].create_time).getTime();
    if (commentTime > lastestCreateTime) {
      lastestCreateTime = commentArray[i].create_time;
    }
  }
  getComment(currentNoteId, lastestCreateTime);
}

function displayComment(commentArray) {
  //create comment html code
  var i;
  var commentTemplate = '';
  for (i in commentArray) {
    var time = new Date(commentArray[i].create_time);

    commentTemplate += '<li><h2>' + commentArray[i].user_name + '</h2><font style="white-space:normal; font-size: small">' + commentArray[i].content + '</font><p class="ui-li-aside" style="margin-top: 9px">' + time.toLocaleString(navigator.language, {
      hour: '2-digit',
      minute: 'numeric',
      day: "numeric",
      month: "numeric"
    }) + '</p></li>';
  }

  // display comment
  $('#comment_display_area').append(commentTemplate);
  $("#comment_display_area").listview("refresh");
}
