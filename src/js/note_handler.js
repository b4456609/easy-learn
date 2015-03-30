// use for new note temp variable
var note_selection = {
  id: '',
  word: '',
  new_version_content: '',
  //  position: 0,
  //  position_length: 0,
};

var viewNoteArrayIndex;

$(document).on('pageinit', "#comment", function() {
  //get pack for comment content
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  var currentNote = pack.version[viewPackVersion].note[viewNoteArrayIndex];

  //display selection word
  $('#note_word').html(noteText);

  //display selection word
  $('#display_note_area').html(currentNote.content);

  //find current note
  var commentArray = currentNote.comment;

  //create comment html code
  var i;
  var commentTemplate = '';
  for (i in commentArray) {
    var time = new Date(commentArray[i].create_time);
    console.log(commentArray[i]);
    console.log(commentArray[i].create_time);
    console.log(time);
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
});

$(document).on('pageshow', "#comment", function() {

  $('#comment_submit').click(function() {
    comment_submit_handler();
  });
});

function comment_submit_handler() {

  //get pack for comment content
  var pack = JSON.parse(localStorage.getItem(viewPackId));

  //get text from user input
  var commentContent = $('#comment_text').val();

  //clear textarea
  $('#comment_text').val('');

  //get current time
  var time = new Date().getTime();
  var display_time = new Date(time);

  //display comment instant
  var commentTemplate = '<li><h2>' + JSON.parse(localStorage.user).name + '</h2><font style="white-space:normal; font-size: small">' + commentContent + '</font><p class="ui-li-aside" style="margin-top: 9px">' + display_time.toLocaleString(navigator.language, {
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
    id: 'comment' + time,
    content: commentContent,
    create_time: time,
    user_id: JSON.parse(localStorage.user).id,
    user_name: JSON.parse(localStorage.user).name
  };
  console.log(newComment);

  //get current note
  var currentNote = pack.version[viewPackVersion].note[viewNoteArrayIndex];

  //add new comment
  currentNote.comment[currentNote.comment.length] = newComment;


  //update pack in localStorage
  localStorage.setItem(viewPackId, JSON.stringify(pack));
}

$(document).on('pageinit', "#new_note", function() {
  //display selection word
  $('#new_note_word').html(note_selection.word);
});

$(document).on('pageshow', "#new_note", function() {
  //save note handler
  $('#save_note').click(function() {


    //save in localStorage
    var pack = JSON.parse(localStorage.getItem(viewPackId));

    //update version
    pack.version[viewPackVersion].content = note_selection.new_version_content;

    //prepare new note
    var newNote = {
      id: note_selection.id,
      color: $('#note_color').val(),
      content: $('#note_content').val(),
      user_id: JSON.parse(localStorage.user).id,
      user_name: JSON.parse(localStorage.user).name,
      comment: []
    };

    //append note in pack's version
    pack.version[viewPackVersion].note[pack.version[viewPackVersion].note.length] = newNote;

    //write in localStorage
    localStorage.setItem(viewPackId, JSON.stringify(pack));

  });

});


$(document).on('pageinit', "#new_note_choose", function() {
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  $('#choose_pack_content').html(pack.version[viewPackVersion].content);
});

$(document).on('pagebeforeshow', "#new_note_choose", function() {});


$(document).on('pageshow', "#new_note_choose", function() {

  //get selection word
  $('#note_choose_next').click(function() {
    var selectionWord = window.getSelection();

    console.log('\nSelection text:');
    console.log(selectionWord);
    console.log('anchorNode ');
    console.log(selectionWord.anchorNode);
    console.log('anchorOffset ' + selectionWord.anchorOffset);
    console.log('focusNode ');
    console.log(selectionWord.focusNode);
    console.log('focusOffset ' + selectionWord.focusOffset);
    console.log('isCollapsed ' + selectionWord.isCollapsed);
    console.log('rangeCount ' + selectionWord.rangeCount);
    console.log('getRangeAt');
    console.log(selectionWord.getRangeAt(0));

    var el = document.getElementById("choose_pack_content");
    var range = window.getSelection().getRangeAt(0);
    console.log('END_TO_START' + getCharacterOffsetWithin(range, el));
    //console.log(getCaretCharacterOffsetWithin(el));
    console.log('');


    // write in object for next page use
    //    note_selection.position = getCharacterOffsetWithin(range, el);
    //    note_selection.position_length = selectionWord.toString().length;
    note_selection.word = selectionWord.toString();
    note_selection.user_id = JSON.parse(localStorage.user).id;
    note_selection.user_name = JSON.parse(localStorage.user).name;

    //create note id
    //get current time
    var time = new Date().getTime();
    var noteId = "note" + time;
    note_selection.id = noteId;

    // insert html code surround the note
    paintNote(noteId);

    //get new version's code save into temp variable
    note_selection.new_version_content = $('#choose_pack_content').html();
  });
});

function paintNote(noteId) {
  var range = window.getSelection().getRangeAt(0);
  //var selectionContents = range.extractContents();
  var span = document.createElement("span");
  span.className = "note";
  span.setAttribute('noteid', noteId);
  range.surroundContents(span);
}

function getCharacterOffsetWithin(range, node) {
  var treeWalker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_ALL,
    function(node) {
      var nodeRange = document.createRange();
      nodeRange.selectNodeContents(node);

      return nodeRange.compareBoundaryPoints(Range.START_TO_END, range) < 1 ?
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
    false
  );

  var charCount = 0;
  while (treeWalker.nextNode()) {
    charCount += treeWalker.currentNode.length;
  }
  if (range.startContainer.nodeType == 3) {
    charCount += range.startOffset;
  }
  return charCount;
}


function getCaretCharacterOffsetWithin(element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}
