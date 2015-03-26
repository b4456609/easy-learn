
$( document ).on( "pagebeforecreate", "#home", function() {
  testLocalStorage();
});

$( document ).on( "pageinit", "#home", function() {
  localStorageLookUp();
});
var headerHeight;

$( document ).on( "pageshow", "#home", function() {
    headerHeight = $(".ui-header").outerHeight();
});
