(function() {

  var DEGREES_PER_SECOND = 25;

  function Parallax() {
    this.element = document.getElementById('background');

    this.currentXRotation = 0;
    this.currentYRotation = 0;
    this.targetXRotation = 0;
    this.targetYRotation = 0;

    var boundDraw;
    boundDraw = function(t) {
      window.requestAnimationFrame(boundDraw);
      this.draw(t);
    }.bind(this);

    this.lastTime = null;

    window.requestAnimationFrame(boundDraw);
    window.addEventListener('mousemove', this.mouseMovement.bind(this));
  }

  Parallax.prototype.draw = function(t) {
    if (this.lastTime === null) {
      this.lastTime = t;
      return;
    }

    var maxDiff = DEGREES_PER_SECOND * ((t - this.lastTime) / 1000);
    this.lastTime = t;

    var xDiff = Math.abs(this.targetXRotation - this.currentXRotation);
    xDiff = Math.min(xDiff, maxDiff);
    if (this.targetXRotation < this.currentXRotation) {
      xDiff = -xDiff;
    }

    var yDiff = Math.abs(this.targetYRotation - this.currentYRotation);
    yDiff = Math.min(yDiff, maxDiff);
    if (this.targetYRotation < this.currentYRotation) {
      yDiff = -yDiff;
    }

    this.currentXRotation += xDiff;
    this.currentYRotation += yDiff;

    var transform = 'perspective(600px) ' +
      'rotateY(' + this.currentYRotation.toFixed(2) + 'deg) rotateX(' +
      this.currentXRotation.toFixed(2) + 'deg)';
    this.element.style.webkitTransform = transform;
    this.element.style.MozTransform = transform;
    this.element.style.transform = transform;
  };

  Parallax.prototype.mouseMovement = function(e) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var x = Math.min(width, Math.max(0, e.clientX));
    var y = Math.min(height, Math.max(0, e.clientY));
    this.targetYRotation = 20 * (x - width/2) / width;
    this.targetXRotation = 20 * (y - height/2) / height;
  };

  window.addEventListener('load', function() {
    window.Parallax = new Parallax();
  });

})();
