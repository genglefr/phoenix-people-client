(function ($) {
  $(document).ready(function () {

    // Open sidemenu panel
    $('.js-display-controls').on('click', function (e) {
      var target = this.getAttribute('aria-controls');
      var state = this.getAttribute('aria-expanded') === 'false' ? false : true;

      if (!state) {
        $('#' + target).removeAttr('aria-hidden');
        this.setAttribute('aria-expanded', true);
      } else {
        $('#' + target).attr('aria-hidden', true);
        this.setAttribute('aria-expanded', false);
      }

      e.preventDefault();
      e.stopPropagation();
    });

    // Close sidemenu on click on a link
    $('.sidepanel-menu-link').on('click', function (e) {
      $('.js-sidemenu').click();

      e.stopPropagation();
    });

    // Close sidemenu on click outside
    $('html').click(function () {
      if (document.getElementById('sidepanel1') != null) {
        if (!document.getElementById('sidepanel1').hasAttribute('aria-hidden')) {
          if (event.srcElement) {
            var sidepanel = document.getElementById('sidepanel1');
            if (!sidepanel.contains(event.srcElement)) {
              $('.js-sidemenu').click();
            }
          } else {
            $('.js-sidemenu').click();
          }
        }
      }
    });

    // Sidepanel content
    // Expand click to the header
    $('.sidepanel-header').on('click', function (e) {
      $(this).find('.sidepanel-expand').click();
    });
  });
})
(jQuery);


window.zeusCloseSidemenu = function (sidepanel) {
  if (!document.getElementById(sidepanel).hasAttribute('aria-hidden')) {
    document.getElementsByClassName("js-sidemenu")[0].click();
  }
}


window.moreButtonStayOpen = function () {
  $('#moreDropdownButton').click(function (e) {
    e.stopPropagation();
  });
}
