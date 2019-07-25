'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  window.util = {
    getRandomValue: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);

      return Math.floor(rand);
    },
    getRandomNumbersArray: function (number) {
      var result = [];

      for (var i = 1; i <= number; i++) {
        result.push(i);
      }

      var compareRandom = function () {
        return Math.random() - 0.5;
      };

      return result.sort(compareRandom);
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    debounce: function (cb) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
