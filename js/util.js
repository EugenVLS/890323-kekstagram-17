'use strict';

(function () {
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
    }
  };
})();
