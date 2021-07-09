//////////////////////////  Black dot producer  //////////////////////////////


var vector = {
    _x: 0,
    _y: 1,

    create: function (x, y) {
      var obj = Object.create(this);

      obj.setX(x);
      obj.setY(y);

      return obj;
    },

    setX: function(value) {
      this._x = value;
    },
    getX: function () {
      return this._x;
    },

    setY: function (value) {
      this._y = value;
    },
    getY: function () {
      return this._y;
    },

    setAngle: function (value) {
      var length = this.getLength();

      this._x = Math.cos(value) * length;
      this._y = Math.sin(value) * length;
    },
    getAngle: function () {
      return Math.atan2(this._y, this._x);
    },

    setLength: function (value) {
      var angle = this.getAngle();

      this._x = Math.cos(angle) * value;
      this._y = Math.sin(angle) * value;
    },
    getLength: function () {
      return Math.sqrt(this._x * this._x + this._y * this._y);
    },

    add: function (v2) {
      return vector.create(this._x + v2.getX(), this._y + v2.getY());
    },
    subtract: function (v2) {
      return vector.create(this._x - v2.getX(), this._y - v2.getY());
    },
    multiply: function (scalar) {
      return vector.create(this._x * scalar, this._y * scalar);
    },
    devide: function (scalar) {
      return vector.create(this._x / scalar, this._y / scalar);
    },

    addTo: function (v2) {
      this._x += v2.getX();
      this._y += v2.getY();
    },
    subtractFrom: function (v2) {
      this._x -= v2.getX();
      this._y -= v2.getY();
    },
    multiplyBy: function (scalar) {
      this._x *= scalar;
      this._y *= scalar;
    },
    devideBy: function (scalar) {
      this._x /= scalar;
      this._y /= scalar;
    }
  };

  // particle class
  var particle = {
    position: null,
    velocity: null,
    mass: 1,
    radius: 0,
    bounce: -1,
    gravity: 0,

    create: function(x, y, speed, direction, grav) {
      var obj = Object.create(this);
      obj.position = vector.create(x, y);
      obj.velocity = vector.create(0, 0);
      obj.velocity.setLength(speed);
      obj.velocity.setAngle(direction);
      obj.gravity = vector.create(0, grav || 0);
      return obj;
    },

    accelerate: function(accel) {
      this.velocity.addTo(accel);
    },

    update: function() {
      this.velocity.addTo(this.gravity);
      this.position.addTo(this.velocity);
    },

    angleTo: function(p2) {
      return Math.atan2(p2.position.getY() - this.position.getY(), p2.position.getX() - this.position.getX());
    },

    distanceTo: function(p2) {
      var dx = p2.position.getX() - this.position.getX(),
        dy = p2.position.getY() - this.position.getY();

      return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function(p2) {
      var grav = vector.create(0, 0),
        dist = this.distanceTo(p2);

      grav.setLength(p2.mass / (dist * dist));
      grav.setAngle(this.angleTo(p2));
      this.velocity.addTo(grav);
    }
  };

  // main code
  window.onload = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;
    var startX =  3 * width / 4;
    var startY = height;
    var particles = [];
    var center = particle.create(width / 2, height / 2, 0, 0, 0);


    update();

    document.body.addEventListener('mousedown', function (e) {
      // if click in created particle
      for (var i = 0; i < particles.length; i++) {
        var p1 = particles[i];

        if ((e.clientX >= (p1.position.getX() - p1.radius)) &&
            (e.clientX <= (p1.position.getX() + p1.radius)) &&
            (e.clientY >= (p1.position.getY() - p1.radius)) &&
            (e.clientY <= (p1.position.getY() + p1.radius))) {
          particles.splice(i, 1);
          return;
        }
      }

      var grav = Math.random() * 0.5 + 0.1;
      var p = particle.create(e.clientX, e.clientY, Math.random() * 8 + 3, Math.random() * Math.PI * 2, 0.1);
      p.radius = Math.random() * 10 + 5;
      p.bounce = -(Math.random() * 0.9 + 0.1);

      particles.push(p);
    });

    function update() {
      context.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.update();
        p.gravity.setAngle(p.angleTo(center));

        context.beginPath();
        context.arc(p.position.getX(), p.position.getY(), p.radius, 0, Math.PI * 2, false);
        context.fill();

        if (p.position.getX() + p.radius > width) {
          p.position.setX(width - p.radius);
          p.velocity.setX(p.velocity.getX() * p.bounce);
        }
        if (p.position.getX() - p.radius < 0) {
          p.position.setX(p.radius);
          p.velocity.setX(p.velocity.getX() * p.bounce);
        }
        if (p.position.getY() + p.radius > height) {
          p.position.setY(height - p.radius);
          p.velocity.setY(p.velocity.getY() * p.bounce);
        }
        if (p.position.getY() - p.radius < 0) {
          p.position.setY(p.radius);
          p.velocity.setY(p.velocity.getY() * p.bounce);
        }
      }

      requestAnimationFrame(update);
    }
  };