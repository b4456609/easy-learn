

$( document ).on( "pageinit", "#home", function() {
    // $( document ).on( "swipeleft swiperight", "#home", function( e ) {
    //     // We check if there is no open panel on the page because otherwise
    //     // a swipe to close the left panel would also open the right panel (and v.v.).
    //     // We do this by checking the data that the framework stores on the page element (panel: open).
    //     if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
    //         if ( e.type === "swipeleft"  ) {
    //             $( "#search_panel" ).panel( "open" );
    //         } else if ( e.type === "swiperight" ) {
    //             $( "#menu_panel" ).panel( "open" );
    //         }
    //     }
    // });
    // test_prepare_data();
});
var headerHeight;
$( document ).on( "pageshow", "#home", function() {
    // $( document ).on( "swipeleft swiperight", "#home", function( e ) {
    //     // We check if there is no open panel on the page because otherwise
    //     // a swipe to close the left panel would also open the right panel (and v.v.).
    //     // We do this by checking the data that the framework stores on the page element (panel: open).
    //     if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
    //         if ( e.type === "swipeleft"  ) {
    //             $( "#search_panel" ).panel( "open" );
    //         } else if ( e.type === "swiperight" ) {
    //             $( "#menu_panel" ).panel( "open" );
    //         }
    //     }
    // });
    // test_prepare_data();
    headerHeight = $(".ui-header").outerHeight();
});
