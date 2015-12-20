(function() {

  var rocket;

  function updateRocketRotation() {
    var scrollOffset = window.scrollY;
    var maxOffset = window.innerHeight - 130;
    var angle = 180 - Math.min(1, scrollOffset/maxOffset)*180;
    rocket.style.transform = 'rotate(' + angle + 'deg)';
    rocket.style.webkitTransform = 'rotate(' + angle + 'deg)';
    rocket.style.MozTransform = 'rotate(' + angle + 'deg)';
  }

  window.addEventListener('load', function() {
    rocket = document.getElementById('rocket');
    updateRocketRotation();
    window.addEventListener('scroll', updateRocketRotation);
  });

})();
