'use strict';

(function () {
  var phrases = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var names = ['Василий', 'Петр', 'Артем', 'Ольга', 'Николай', 'Дарья'];

  var photosTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var getPhrases = function (numberOfPhrases) {
    var result = '';
    var localPhrases = phrases.concat([]);

    for (var index = 0; index < numberOfPhrases; index++) {
      var indexOfPhrase = window.util.getRandomValue(0, localPhrases.length - 1);
      var phrase = localPhrases[indexOfPhrase];

      result = result + phrase;
      localPhrases.splice(indexOfPhrase, 1);
    }

    return result;
  };

  var getComments = function () {
    var arr = [];
    var numberOfComments = window.util.getRandomValue(1, 6);
    var avatars = window.util.getRandomNumbersArray(6);

    for (var index = 0; index < numberOfComments; index++) {
      arr.push({
        avatar: 'img/avatar-' + avatars[index] + '.svg',
        message: getPhrases(window.util.getRandomValue(1, 2)),
        name: names[window.util.getRandomValue(0, names.length - 1)]
      });
    }

    return arr;
  };

  var getData = function (number) {
    var arr = [];
    var photoNumbers = window.util.getRandomNumbersArray(number);

    for (var i = 0; i < number; i++) {
      arr.push({
        url: 'photos/' + photoNumbers[i] + '.jpg',
        likes: window.util.getRandomValue(15, 200),
        comments: getComments()
      });
    }

    return arr;
  };

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

  document.querySelector('.pictures').appendChild(getTemplate(getData(25)));
})();
