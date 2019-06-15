'use strict';

var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var amount = 25;

var photoListElement = document.querySelector('.pictures');

var photosTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var getRandom = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var getPhoto = function (index) {
  var photo = {};
  photo.url = 'photos/' + index + '.jpg';
  photo.likes = getRandom(15, 200);
  photo.comments = comments[getRandom(0, comments.length - 1)];

  return photo;
};

var getPhotos = function () {
  var photos = [];
  for (var i = 0; i < amount; i++) {
    photos[i] = getPhoto(i + 1);
  }

  return photos;
};

var renderPhotos = function (photo) {
  var photoElement = photosTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').setAttribute('src', photo.url);
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments;

  return photoElement;
};

var showPhotos = function (photos) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhotos(photos[i]));
  }

  photoListElement.appendChild(fragment);
};

var photos = getPhotos();

showPhotos(photos);
