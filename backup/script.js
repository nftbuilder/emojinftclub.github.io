function r(from, to) {
  return ~~(Math.random() * (to - from + 1) + from);
}
function pick() {
  return arguments[r(0, arguments.length - 1)];
}
function getChar() {
  return String.fromCharCode(pick(
    r(0x3041, 0x30ff),
    r(0x2000, 0x206f),
    r(0x0020, 0x003f)
  ));
}
function loop(fn, delay) {
  let stamp = Date.now();
  function _loop() {
    if (Date.now() - stamp >= delay) {
      fn(); stamp = Date.now();
    }
    requestAnimationFrame(_loop);
  }
  requestAnimationFrame(_loop);
}
class Char {
  constructor() {
    this.element = document.createElement('span');
    this.mutate();
  }
  mutate() {
    this.element.textContent = getChar();
  }
}
class Trail {
  constructor(list = [], options) {
    this.list = list;
    this.options = Object.assign(
      { size: 10, offset: 0 }, options
    );
    this.body = [];
    this.move();
  }
  traverse(fn) {
    this.body.forEach((n, i) => {
      let last = (i == this.body.length - 1);
      if (n) fn(n, i, last);
    });
  }
  move() {
    this.body = [];
    let { offset, size } = this.options;
    for (let i = 0; i < size; ++i) {
      let item = this.list[offset + i - size + 1];
      this.body.push(item);
    }
    this.options.offset = 
      (offset + 1) % (this.list.length + size - 1);
  }
}
class Rain {
  constructor({ target, row }) {
    this.element = document.createElement('p');
    this.build(row);
    if (target) {
      target.appendChild(this.element);
    }
    this.drop();
  }
  build(row = 20) {
    let root = document.createDocumentFragment();
    let chars = [];
    for (let i = 0; i < row; ++i) {
      let c = new Char();
      root.appendChild(c.element);
      chars.push(c);
      if (Math.random() < .5) {
        loop(() => c.mutate(), r(1e3, 5e3));
      }
    }
    this.trail = new Trail(chars, { 
      size: r(10, 30), offset: r(0, 100) 
    });
    this.element.appendChild(root); 
  }
  drop() {
    let trail = this.trail;
    let len = trail.body.length;
    let delay = r(10, 100);
    loop(() => {
      trail.move();
      trail.traverse((c, i, last) => {
        c.element.style = `
          color: hsl(136, 100%, ${85 / len * (i + 1)}%)
        `;
        if (last) {
          c.mutate();
          c.element.style = `
            color: hsl(136, 100%, 85%);
            text-shadow:
              0 0 .5em #fff,
              0 0 .5em currentColor;
          `;
        }
      });
    }, delay);
  }
}

const main = document.querySelector('main');
for (let i = 0; i < 50; ++i) {
  new Rain({ target: main, row: 50 });
}

(function() {
  var settings = {
    rainbowLength: 64,
    rainbowMultiplier: 2,
    rainbowClass: 'rainbow-text',
    delay: 24, //not using it cuz rAF
    repeat: true,
    numberAches: {
      topWeeoo: function(tI, k){
        return Math.sin((tI + k) / 6) * 20 + 'px';
      },
      leftWeeoo: function(tI, k){
        return Math.cos((tI + k) / 6) * 15 + 'px';
      },
      spacingWeeoo: function(tI, k){
        return Math.sin((tI + k) / 15) * 6 + 'px';
      },
      sizeWeeoo: function(tI, k){
        return ((Math.sin( ((tI/2) + k)/10 )*16) + 72 ) + 'px';
      },
      opacityWeeoo: function(tI, k){
        return Math.cos(tI + k)/8 + .8125;
      }
    }
  };

  var Δ = {
    rainbow: makeMeARainbow(settings.rainbowLength),
    init: function() {
      var sourceElement = document.querySelector('.' + settings.rainbowClass);

      this.element = this.dissectText(sourceElement);
      sourceElement.parentNode.insertBefore(this.element, sourceElement);
      sourceElement.remove();

      this.update(this.draw(this.element));

      return this;
    },
    draw: function(el) {
      if (!el) return;
      var _self = this;

      var spans = el.querySelectorAll('span');
      [].forEach.call(spans, function(v, k) {
        v.style.color = _self.rainbow[k % _self.rainbow.length];
        v.style.position = 'relative';
      });

      return spans;
    },
    dissectText: function(sourceEl) {
      var textSource = sourceEl.textContent,
        headingContainer = document.createElement('h1');

      textSource.split('').forEach(function(v, k, c) {
        var span = document.createElement('span'),
          destText = document.createTextNode(v);

        span.appendChild(destText);
        headingContainer.appendChild(span);
      });

      headingContainer.className = settings.rainbowClass;

      return headingContainer;
    },
    update: function(spans) {
      if (!spans) return;
      var _self = this,
        delay = settings.delay,
        nanana = settings.numberAches,
        tI = _self.totalIterations = 0;

      //_self.updater && window.clearTimeout(_self.updater);
      //_self.updater = window.setTimeout(animateText.bind(_self, spans), delay);
      requestAnimationFrame(animateText.bind(_self, spans, tI));

      function animateText(spans, tI) {
        [].forEach.call(spans, function(v, k) {
          v.style.color = _self.rainbow[(tI + k) % _self.rainbow.length];
          v.style.top = nanana.topWeeoo(tI, k); //Math.sin((tI + k) / 6) * 20 + 'px';
          v.style.left = nanana.leftWeeoo(tI, k); //Math.cos((tI + k) / 6) * 15 + 'px';
          v.style.letterSpacing = nanana.spacingWeeoo(tI, k); //Math.sin((tI + k) / 15) * 10 + 'px';
          v.style.fontSize = nanana.sizeWeeoo(tI, k); //((Math.sin( ((tI/2) + k)/10 )*16) + 72 ) + 'px';
          v.style.opacity = nanana.opacityWeeoo(tI, k); //Math.cos(tI + k)/8 + .8125;
        });

        if (settings.repeat) requestAnimationFrame(animateText.bind(_self, spans, ++tI));
        //if (settings.repeat) _self.updater = window.setTimeout(animateText.bind(_self, spans), delay);
      };

      return _self;
      //return _self.updater;
    }
  }.init();

  function makeMeARainbow(length) {
    var length = length || 64;

    return (function generateRainbow(arr, amount) {
      if (--amount < 0) return arr;
      arr.push(generateColor(((length - amount+1) % length), length, settings.rainbowMultiplier));
      return generateRainbow(arr, amount);
    })([], length);

    function generateColor(amount, total, multiplier) {
      return 'hsla\(' + ((amount * multiplier) * (360 / total)) + ',100%,60%,0.90\)'
    }
  }

})();

(function() {
  window.randomCanvas = (function(global) {
    var q = global.document.querySelector.bind(global.document),
      rand = Math.random,
      TWO_PI = 2 * Math.PI;

    var __self = RandomCanvas = {
      options: {
        canvas: 'canvas',
        starAmount: 600
      },
      init: function(optionsObj) {
        var _self = this,
          options = extend(_self.options, optionsObj || {}),
          canvas;

        _self.canvas = canvas = q(options.canvas);
        _self.ctx = canvas.getContext('2d');
        _self.stars = _self.drawCircles();

        _self.resize();
        _self.addListeners();

        return _self;
      },
      drawCircles: function(starAmount) {
        var amount = starAmount || __self.options.starAmount,
          starArray = [];

        if (amount <= 0) return;

        (function drawCircle() {
          if (!amount--) return;
          starArray.push(new Circle(__self.ctx, {
            position: __self.randomPosition(),
            color: __self.randomWashedColor('rgba'),
            radius: __self.randomRadius()
          }).draw());
          drawCircle();
        })();

        return starArray;
      },
      addListeners: function() {
        global.addEventListener('resize', __self.resize, false);
      },
      resize: function() {
        var dimensions = getWindowDimensions();

        __self.canvas.width = dimensions.width;
        __self.canvas.height = dimensions.height;

        if (__self.stars) {
          __self.stars.forEach(function(c) {
            c.draw(true)
          });
        }
      },
      randomWashedColor: function(type) {
        var color,
          channels = 3,
          colorsPerChannel = [];

        for (; --channels > -1;) {
          colorsPerChannel.push(generateSingleChannel());
        }

        function generateSingleChannel() {
          return (rand() * 75 + 180) << 0;
        }

        switch (type) {
          case 'rgb':
            color = colorsPerChannel;
            break;
          case 'rgba':
            color = colorsPerChannel.slice();
            color.push(rand());
            break;
          case 'hex':
          default:
            color = '#' + (
              colorsPerChannel[0] << 16 |
              colorsPerChannel[1] << 8 |
              colorsPerChannel[2]
            ).toString(16);
        }

        return color;
      },
      randomRadius: function() {
        return randMinMax(0, 2);
      },
      randomPosition: function() {
        var _self = this,
          dimensions = getWindowDimensions(),
          x = rand() * dimensions.width << 0,
          y = rand() * dimensions.height << 0;

        return {
          x: x,
          originX: x,
          percentageX: x / dimensions.width,
          y: y,
          originY: y,
          percentageY: y / dimensions.height,
        }
      }
    };

    function randMinMax(min, max) {
      return rand() * (max - min) + min;
    }

    function getWindowDimensions() {
      return {
        width: global.innerWidth,
        height: global.innerHeight
      }
    }

    function Circle(ctx, options) {
      if (!ctx) return;

      var _self = this,
        options = _self.options = extend({
          //defaults
          position: undefined,
          radius: undefined,
          color: undefined
        }, options || {});

      _self.draw = function(redraw, position, radius, color) {
        var opt = _self.options,
          redraw = !!redraw || false,
          pos = position || opt.position || __self.randomPosition(),
          rad = radius || opt.radius || __self.randomRadius(),
          col = color || opt.color || __self.randomWashedColor('rgba');

        if (redraw) {
          var wDim = getWindowDimensions();
          pos.x = pos.percentageX * wDim.width;
          pos.y = pos.percentageY * wDim.height;
        }

        requestAnimationFrame(function() {
          //temp blurry effect
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, rad * 1.8, 0, TWO_PI, false);
          ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + col[3] * 0.2 + ')';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, rad, 0, TWO_PI, false);
          ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + col[3] * 0.5 + ')';
          ctx.fill();
        });

        return _self;
      }
    }

    return __self.init();
  })(window || this);

  // UTILS
  function extend(target) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      Object.getOwnPropertyNames(source).forEach(function(name) {
        target[name] = source[name]
      })
    })
    return target
  }
})();