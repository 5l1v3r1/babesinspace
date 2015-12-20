(function() {

  var rocket;
  var oldSize;

  function updateRocketRotation() {
    var scrollOffset = window.scrollY;
    var maxOffset = window.innerHeight - 130;
    var angle = 180 - Math.min(1, scrollOffset/maxOffset)*180;
    rocket.style.transform = 'rotate(' + angle + 'deg)';
    rocket.style.webkitTransform = 'rotate(' + angle + 'deg)';
    rocket.style.MozTransform = 'rotate(' + angle + 'deg)';
  }

  function handleResize() {
    if (Math.abs(window.scrollY) < 10) {
      return 0;
    }
    var heightDiff = window.innerHeight - oldSize;
    window.scrollTo(0, window.scrollY+heightDiff);
    oldSize = window.innerHeight;
    updateRocketRotation();
  }

  window.addEventListener('load', function() {
    oldSize = window.innerHeight;
    rocket = document.getElementById('rocket');
    updateRocketRotation();
    window.addEventListener('scroll', updateRocketRotation);
    window.addEventListener('resize', handleResize);
  });

})();
