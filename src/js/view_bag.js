$(document).on('pageinit', "#view_bag", function () {
    findNote();

});

$(document).on('pageshow', "#view_bag", function () {
    //    initial footer widget
    $("#note-display").toolbar({
        disabled: true,
        position: "fixed",
        visibleOnPageShow: false
    });

    //    click and show note hanlder
    $(".note").click(showNoteHandler);

    //    hide note button action
    $(".note-left-button").click(hideButtonHandler);
});

function showNoteHandler() {
    $("#note-display").toolbar("show");
}

function hideButtonHandler() {
    $("#note-display").toolbar("hide");
//    $("#note-display").hide().trigger("updatelayout");
}

function findNote() {
    var count = $('.note');
    //    console.log(count.length);
}