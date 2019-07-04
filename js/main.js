'use strict';

var comments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var photosTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var getRandomValue = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var getComments = function () {
  var photoComments = [];
  var numberOfComments = getRandomValue(0, comments.length);
  for (var i = 0; i < numberOfComments; i++) {
    var numberOfPhrases = getRandomValue(1, 2);

    if (numberOfPhrases === 1) {
      photoComments[i] = comments[getRandomValue(0, comments.length - 1)];
    } else {
      photoComments[i] = comments[getRandomValue(0, comments.length - 1)] + comments[getRandomValue(0, comments.length - 1)];
    }

  }
  return photoComments;
};

var renderPhoto = function (index) {
  var photo = {};
  photo.url = 'photos/' + index + '.jpg';
  photo.likes = getRandomValue(15, 200);
  photo.comments = getComments();

  return photo;
};

var getData = function (amount) {
  var photos = [];
  for (var i = 0; i < amount; i++) {
    photos[i] = renderPhoto(i + 1);
  }

  return photos;
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

var ESC_KEYCODE = 27;

var inputUpload = document.querySelector('#upload-file');
var editPhotoForm = document.querySelector('.img-upload__overlay');
var uploadCancel = editPhotoForm.querySelector('#upload-cancel');
var uploadPreview = editPhotoForm.querySelector('.img-upload__preview img');
var radioEffects = editPhotoForm.querySelectorAll('.effects__radio');
var pin = editPhotoForm.querySelector('.effect-level__pin');
var effectLevelLine = editPhotoForm.querySelector('.effect-level__depth');
var effectLevelValue = editPhotoForm.querySelector('.effect-level__value');
var sliderEffect = editPhotoForm.querySelector('.effect-level');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  editPhotoForm.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  sliderEffect.style.visibility = 'hidden';
};

var closePopup = function () {
  editPhotoForm.classList.add('hidden');
  inputUpload.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
};

var putEffect = function (evt) {
  uploadPreview.classList = '';
  uploadPreview.classList.add('effects__preview--' + evt.target.value);
};

var resetFilter = function (evt) {
  pin.style.left = '100%';
  effectLevelLine.style.width = '100%';
  effectLevelValue.value = 100;
  sliderEffect.style.visibility = '';
  if (evt.target.value === 'none') {
    sliderEffect.style.visibility = 'hidden';
  }
};

var getPinValue = function (evt) {
  var width = evt.target.offsetParent.offsetWidth;
  var coordX = evt.target.offsetLeft;
  var value = Math.round(coordX / width * 100);
  return value;
};

var putEffectSaturation = function (value) {
  return value;
};

for (var i = 0; i < radioEffects.length; i++) {
  radioEffects[i].addEventListener('change', function (evt) {
    resetFilter(evt);
    putEffect(evt);
  });
}

pin.addEventListener('mouseup', function (evt) {
  var pinValue = getPinValue(evt);
  putEffectSaturation(pinValue);
});

inputUpload.addEventListener('change', function () {
  openPopup();
});

uploadCancel.addEventListener('click', function () {
  closePopup();
});
