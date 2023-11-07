//Main function that activates after the page DOM is ready:
$(function () {
  //Mousemove event is fired at an element when a pointing device is moved
  $(document).mousemove(function (event) {
    $("#spinner").css({
      left: event.pageX,
      top: event.pageY,
    });
  });

  //Show spinner every Ajax request
  $(document).ajaxStart(function () {
    $("#spinner").show();
  });

  //Hide spinner every Ajax request stop
  $(document).ajaxStop(function () {
    $("#spinner").hide();
  });

  //Displaying all 100 coins
  renderCoins();

  //Onclick event when user has clicked the "Close" button to cancel coins changes inside the modal
  $(".close").click(closeModal);

  //On click event that triggers handleSearchBar function for user search
  $(".navbar").on("click", "#search-btn", function () {
    handleSearchBar(displayCoins);
    $("#search-result").val("");
  });

  // On click event for showing more info when a "more-info" button is clicked
  $("#container").on("click", ".more-info", function (event) {
    getCoinDetailsFromClick(event);
  });

  //On click event when toggle clicked (on/off)
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

  // Update the "active" class when the user clicks a nav item
  $(".nav-link").click(function () {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });

  // Click event when user has clicked the homepage("Coins")
  $("#homePage").click(async function () {
    coinsModalArray = [];
    $("#container").empty();
    displayCoins = [];
    renderCoins();
  });

  //On click event when user has clicked the "About me" page
  $("#about").on("click", function () {
    $("#container").empty();
    aboutMe();
  });
});
