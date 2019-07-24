'use strict';

(function () {
  var formHashtagInput = document.querySelector('.text__hashtags');

  var validate = function (hashtag, hashtags) {
    var checkRepeatingHashtag = function () {
      var numberOfRepeating = hashtags.slice().filter(function (hashtagItem) {
        return hashtagItem.toLowerCase() === hashtag.toLowerCase();
      }).length;
      return numberOfRepeating > 1;
    };

    if (hashtag.indexOf('#') !== 0) {
      formHashtagInput.setCustomValidity('хэш-тег должен начинаться с символа # (решётка)');
      return false;
    } else if (hashtag.length === 1) {
      formHashtagInput.setCustomValidity('хеш-тег не может состоять только из одной решётки');
      return false;
    } else if (hashtag.lastIndexOf('#') !== 0) {
      formHashtagInput.setCustomValidity('хэш-теги должны разделяться пробелами');
      return false;
    } else if (checkRepeatingHashtag()) {
      formHashtagInput.setCustomValidity('хэш-теги не должны повторяться');
      return false;
    } else if (hashtags.length > 5) {
      formHashtagInput.setCustomValidity('хэш-тегов не может быть более пяти');
      return false;
    } else if (hashtag.length > 20) {
      formHashtagInput.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
      return false;
    } else {
      formHashtagInput.setCustomValidity('');
      return true;
    }
  };

  formHashtagInput.addEventListener('input', function (evt) {
    var hashtags = evt.target.value.split(' ');

    for (var i = 0; i < hashtags.length; i++) {
      if (!validate(hashtags[i], hashtags)) {
        break;
      }
    }
  });
})();
