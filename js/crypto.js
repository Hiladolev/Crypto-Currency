//Main function that activates after the page DOM is ready:
$(function () {
  //Mousemove event is fired at an element when a pointing device is moved
  $(document).mousemove(function (event) {
    $("#spinner").css({
      left: event.pageX,
      top: event.pageY,
    });
  });
  //Show spinner every HTTP (Ajax) request
  $(document).ajaxStart(function () {
    $("#spinner").show();
  });
  //Hide spinner every HTTP (Ajax) request
  $(document).ajaxStop(function () {
    $("#spinner").hide();
  });
  //Catch an error while fetching and displaying coins is rejected
  renderCoins().catch((error) => {
    console.error("Error while fetching and displaying coins", error);
  });
  //Close button inside the modal
  $(".close").click(closeModal);
  //Search button-onclick
  $(".navbar").on("click", "#search-btn", function () {
    handleSearchBar(displayCoins);
    $("#search-result").val("");
  });
  //More info button-onclick
  $("#container").on("click", ".more-info", function (event) {
    getCoinDetailsFromClick(event);
  });
  //Toggle button switches to on/off
  $("#container").on("change", ".my-toggle", function () {
    handleToggleChange(this);
  });

  // Add the "active" class to the current nav item
  $(".nav-link").each(function () {
    let url = window.location.href;
    if ($(this).attr("href") == url) {
      $(this).addClass("active");
    }
  });
  // Remove the "active" class from other nav items
  $(".nav-link").not(".active").removeClass("active");
  // Update the "active" class when the user clicks a nav item
  $(".nav-link").click(function () {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });
  // clicking on the homepage
  $("#homePage").click(async function () {
    coinsModalArray = [];
    $("#container").empty();
    displayCoins = [];
    renderCoins().catch((error) => {
      console.error("Error while fetching and displaying coins", error);
    });
  });
  //clicking on about page
  $("#about").on("click", function () {
    $("#container").empty();
    aboutMe();
  });
});
