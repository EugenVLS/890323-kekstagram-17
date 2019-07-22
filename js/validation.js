'use strict';

(function () {
  var formHashtagInput = document.querySelector('.text__hashtags');

  formHashtagInput.addEventListener('input', function (evt) {
    var hashtags = evt.target.value.split(' ');

    hashtags.forEach(function (hashtag) {
      console.log(hashtag);
      validate(hashtags, hashtag);
    });

  });

  var validate = function (hashtags, hashtag) {
    var hasRepeatHashtag = function () {
      var numberOfRepeating = hashtags.slice().filter(function (hashtagItem) {
        return hashtagItem.toLowerCase() === hashtag.toLowerCase();
      }).length;
      console.log(numberOfRepeating);
      return numberOfRepeating > 1;
    };

    if (hashtag.indexOf('#') !== 0) {
      formHashtagInput.setCustomValidity('хэш-тег должен начинаться с символа # (решётка)');
    } else if (hashtag.length === 1) {
      formHashtagInput.setCustomValidity('хеш-тег не может состоять только из одной решётки');
    } else if (hashtag.lastIndexOf('#') !== 0) {
      formHashtagInput.setCustomValidity('хэш-теги должны разделяться пробелами');
    } else if (hasRepeatHashtag()) {
      formHashtagInput.setCustomValidity('хэш-теги не должны повторяться');
    } else if (hashtags.length > 5) {
      formHashtagInput.setCustomValidity('хэш-тегов не может быть более пяти');
    } else if (hashtag.length > 20) {
      formHashtagInput.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
    } else {
      formHashtagInput.setCustomValidity('');
    }
  };
})();
