'use strict';

(function () {
  var photosTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var getTemplate = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      var photoElement = photosTemplate.cloneNode(true);
      photoElement.querySelector('.picture__img').setAttribute('src', photos[i].url);
      photoElement.querySelector('.picture__likes').textContent = photos[i].likes;
      photoElement.querySelector('.picture__comments').textContent = photos[i].comments.length;
      fragment.appendChild(photoElement);
    }

    return fragment;
  };

  var successHandler = function (photos) {
    document.querySelector('.pictures').appendChild(getTemplate(photos));
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(successHandler, errorHandler);
})();
