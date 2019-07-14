'use strict';

(function () {
  var photosTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var pictures = document.querySelector('.pictures');
  var buttons = document.querySelectorAll('.img-filters__button');
  var photos = [];

  var removeActiveClass = function (allButtons) {
    allButtons.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
  };

  var sortPhotos = function (id) {
    switch (id) {
      case 'filter-new':
        return photos.slice().sort(function () {
          return window.util.getRandomValue(-1, 1);
        }).slice(0, 10);
      case 'filter-discussed':
        return photos.slice().sort(function (a, b) {
          return a.comments.length < b.comments.length ? 1 : -1;
        });
      default:
        return photos;
    }
  };

  var deletePhotos = function () {
    pictures.querySelectorAll('.picture').forEach(function (item) {
      pictures.removeChild(item);
    });
  };

  var onFilterChange = window.debounce(function (button) {
    pictures.appendChild(getTemplate(sortPhotos(button.id)));
  });

  buttons.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      evt.preventDefault();
      removeActiveClass(buttons);
      deletePhotos();
      onFilterChange(button);
      button.classList.add('img-filters__button--active');
    });
  });

  var getTemplate = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var photoElement = photosTemplate.cloneNode(true);
      photoElement.querySelector('.picture__img').setAttribute('src', data[i].url);
      photoElement.querySelector('.picture__likes').textContent = data[i].likes;
      photoElement.querySelector('.picture__comments').textContent = data[i].comments.length;
      fragment.appendChild(photoElement);
    }

    return fragment;
  };

  var successHandler = function (data) {
    photos = data;
    pictures.appendChild(getTemplate(photos));
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
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
