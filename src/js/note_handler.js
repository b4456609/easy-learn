$(document).on('pageinit', "#new_note", function() {
  //display selection word
  $('#new_note_word').html(note_selection.word);

  //save note handler
  $('#save_note').click(function() {

    //get user input
    note_selection.content = $('#note_content').val();
    note_selection.color = $('#note_color').val();
    console.log(note_selection);

    //save in localStorage
    var pack = JSON.parse(localStorage.getItem(viewPackId));
    //append note in pack's version
    pack.version[viewPackVersion].note[pack.version[viewPackVersion].note.length] = note_selection;

    //write in localStorage
    localStorage.setItem(viewPackId, JSON.stringify(pack));
  });

});


$(document).on('pageinit', "#new_note_choose", function() {
  var pack = JSON.parse(localStorage.getItem(viewPackId));
  $('#choose_pack_content').html(pack.version[viewPackVersion].content);
});

$(document).on('pagebeforeshow', "#new_note_choose", function() {
});
var note_selection = {
  id: '',
  word: '',
  color: '',
  content: '',
  user_id: '',
  user_name: '',
  position: 0,
  position_length: 0,
};

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

    //get current time
    var time = new Date().getTime();

    // write in object for next page use
    note_selection.position = getCharacterOffsetWithin(range, el);
    note_selection.position_length = selectionWord.toString().length;
    note_selection.word = selectionWord.toString();
    note_selection.user_id = JSON.parse(localStorage.user).id;
    note_selection.user_name = JSON.parse(localStorage.user).name;
    note_selection.id = "note" + time;

  });
});

function getCharacterOffsetWithin(range, node) {
  var treeWalker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_ALL,
    function(node) {
      var nodeRange = document.createRange();
      nodeRange.selectNodeContents(node);

      return nodeRange.compareBoundaryPoints(Range.START_TO_END , range) < 1 ?
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
