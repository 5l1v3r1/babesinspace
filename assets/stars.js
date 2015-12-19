(function() {

  var LAG_TIME = 500;
  var LAG_REPLACE = 50;
  var STAR_COUNT_PER_PIXEL = 0.00005555555556;

  var MIN_DURATION = 60000;
  var DURATION_DEVIATION = 30000;

  var MIN_RADIUS = 0.5;
  var RADIUS_DEVIATION = 1;

  var STAR_FILL = 'rgba(200, 200, 255, 0.7)';

  function Stars(canvas) {
    this.canvas = canvas;
    this.lastTime = null;
    this.stars = [];

    window.addEventListener('resize', this.resize.bind(this));

    var boundDraw;
    boundDraw = function(t) {
      window.requestAnimationFrame(boundDraw);
      this.draw(t);
    }.bind(this);
    window.requestAnimationFrame(boundDraw);

    this.resize();

    var idealCount = idealStarCount();
    for (var i = 0; i < idealCount; ++i) {
      this.generateStar();
      this.stars[this.stars.length-1].remainingTime -= MIN_DURATION;
    }
  }

  Stars.prototype.resize = function() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.draw(this.lastTime);
  };

  Stars.prototype.draw = function(time) {
    if (this.lastTime === null) {
      this.lastTime = time;
      return;
    }

    var elapsed = time - this.lastTime;
    this.lastTime = time;

    if (elapsed > LAG_TIME) {
      elapsed = LAG_REPLACE;
    }

    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = STAR_FILL;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    for (var i = 0; i < this.stars.length; ++i) {
      var star = this.stars[i];
      star.remainingTime -= elapsed;
      if (star.remainingTime <= 0) {
        this.stars.splice(i, 1);
        --i;
      } else {
        var pos = starPosition(star);
        var r = star.radius;
        ctx.beginPath();
        ctx.arc(pos.x*this.canvas.width, pos.y*this.canvas.height, r, 0, Math.PI*2);
        ctx.fill();
      }
    }

    var idealCount = idealStarCount();
    while (this.stars.length < idealCount) {
      this.generateStar();
    }
  };

  Stars.prototype.generateStar = function() {
    var startPoint = this.randomPoint();
    var endPoint = this.randomPoint();
    while (colinear(startPoint, endPoint)) {
      endPoint = this.randomPoint();
    }
    var duration = MIN_DURATION + DURATION_DEVIATION*Math.random();
    var star = {
      x: startPoint.x,
      y: startPoint.y,
      endX: endPoint.x,
      endY: endPoint.y,
      totalTime: duration,
      remainingTime: duration,
      radius: MIN_RADIUS + RADIUS_DEVIATION*Math.random()
    };
    this.stars.push(star);
  };

  Stars.prototype.randomPoint = function() {
    var width = 1;
    var height = 1;
    var randomSpot = Math.random() * (width*2 + height*2);
    var x = 0;
    var y = 0;
    if (randomSpot < width) {
      x = randomSpot;
    } else if (randomSpot < width+height) {
      x = width;
      y = randomSpot - width;
    } else if (randomSpot < width*2+height) {
      y = height;
      x = randomSpot - width - height;
    } else {
      x = 0;
      y = randomSpot - width*2 - height;
    }
    return {x: x, y: y};
  };

  function starPosition(star) {
    var t = star.remainingTime / star.totalTime;
    return {
      x: t*star.x + (1-t)*star.endX,
      y: t*star.y + (1-t)*star.endY
    };
  }

  function colinear(p1, p2) {
    return (p1.x === 0 && p2.x === 0) ||
      (p1.x === 1 && p2.x === 1) ||
      (p1.y === 0 && p2.y === 0) ||
      (p1.y === 1 && p2.y === 1);
  }

  function idealStarCount() {
    var pixelCount = window.innerWidth * window.innerHeight;
    return Math.ceil(pixelCount * STAR_COUNT_PER_PIXEL);
  }

  window.addEventListener('load', function() {
    new Stars(document.getElementById('stars'));
  });

})();
