'use strict';

var phrases = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var names = ['Василий', 'Петр', 'Артем', 'Ольга', 'Николай', 'Дарья'];

var effects = [{effect: 'chrome',
  property: 'grayscale',
  min: 0,
  max: 1},
{effect: 'sepia',
  property: 'sepia',
  min: 0,
  max: 1},
{effect: 'marvin',
  property: 'invert',
  min: 0,
  max: 100},
{effect: 'phobos',
  property: 'blur',
  min: 0,
  max: 3},
{effect: 'heat',
  property: 'brightness',
  min: 1,
  max: 3}];

var photosTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var getRandomValue = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
};

var getRandomNumbersArray = function (number) {
  var result = [];

  for (var i = 1; i <= number; i++) {
    result.push(i);
  }

  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  return result.sort(compareRandom);
};

var getPhrases = function (numberOfPhrases) {
  var result = '';
  var localPhrases = phrases.concat([]);

  for (var index = 0; index < numberOfPhrases; index++) {
    var indexOfPhrase = getRandomValue(0, localPhrases.length - 1);
    var phrase = localPhrases[indexOfPhrase];

    result = result + phrase;
    localPhrases.splice(indexOfPhrase, 1);
  }

  return result;
};

var getComments = function () {
  var arr = [];
  var numberOfComments = getRandomValue(1, 6);
  var avatars = getRandomNumbersArray(6);

  for (var index = 0; index < numberOfComments; index++) {
    arr.push({
      avatar: 'img/avatar-' + avatars[index] + '.svg',
      message: getPhrases(getRandomValue(1, 2)),
      name: names[getRandomValue(0, names.length - 1)]
    });
  }

  return arr;
};

var getData = function (number) {
  var arr = [];
  var photoNumbers = getRandomNumbersArray(number);

  for (var i = 0; i < number; i++) {
    arr.push({
      url: 'photos/' + photoNumbers[i] + '.jpg',
      likes: getRandomValue(15, 200),
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

var ESC_KEYCODE = 27;

var currentEffect = '';
var inputUpload = document.querySelector('#upload-file');
var editPhotoForm = document.querySelector('.img-upload__overlay');
var uploadCancel = editPhotoForm.querySelector('#upload-cancel');
var uploadPreview = editPhotoForm.querySelector('.img-upload__preview img');
var radioEffects = editPhotoForm.querySelectorAll('.effects__radio');
var effectLevelPin = editPhotoForm.querySelector('.effect-level__pin');
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
  currentEffect = evt.target.value;
  uploadPreview.classList.add('effects__preview--' + currentEffect);
};

var resetFilter = function (evt) {
  effectLevelPin.style.left = '100%';
  effectLevelLine.style.width = '100%';
  effectLevelValue.value = 100;
  uploadPreview.classList = '';
  uploadPreview.style.filter = '';
  sliderEffect.style.visibility = '';
  if (evt.target.value === 'none') {
    sliderEffect.style.visibility = 'hidden';
  }
};

var getPinValue = function (evt) {
  var width = evt.target.offsetParent.offsetWidth;
  var coordX = evt.target.offsetLeft;

  return Math.round(coordX / width * 100);
};

var getEffectValue = function (min, max, pinValue) {
  var value = '';

  value = min + (max - min) / 100 * pinValue;

  return value;
};

var setEffectSaturation = function (effect) {
  var pinValue = effectLevelValue.value;

  for (var i = 0; i < effects.length; i++) {
    if (effects[i].effect === effect) {
      var effectValue = getEffectValue(effects[i].min, effects[i].max, pinValue);

      switch (effects[i].property) {
        case 'grayscale':
          uploadPreview.style.filter = effects[i].property + '(' + effectValue + ')';
          break;
        case 'sepia':
          uploadPreview.style.filter = effects[i].property + '(' + effectValue + ')';
          break;
        case 'invert':
          uploadPreview.style.filter = effects[i].property + '(' + effectValue + '%)';
          break;
        case 'blur':
          uploadPreview.style.filter = effects[i].property + '(' + effectValue + 'px)';
          break;
        case 'brightness':
          uploadPreview.style.filter = effects[i].property + '(' + effectValue + ')';
          break;
      }
    }
  }
};

for (var i = 0; i < radioEffects.length; i++) {
  radioEffects[i].addEventListener('change', function (evt) {
    resetFilter(evt);
    putEffect(evt);
  });
}

effectLevelPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };


  var onMouseMove = function (moveEvt) {
    var width = effectLevelPin.offsetParent.offsetWidth;
    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX
    };

    startCoords = {
      x: moveEvt.clientX
    };

    if (effectLevelPin.offsetLeft - shift.x >= 0 && effectLevelPin.offsetLeft - shift.x <= width) {
      var effectPinValue = getPinValue(evt);
      effectLevelValue.value = effectPinValue;
      effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift.x) + 'px';
      effectLevelLine.style.width = effectPinValue + '%';
      setEffectSaturation(currentEffect);
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

inputUpload.addEventListener('change', function () {
  openPopup();
});

uploadCancel.addEventListener('click', function () {
  closePopup();
});

var commentInput = document.querySelector('.text__description');

commentInput.addEventListener('focus', function () {
  document.removeEventListener('keydown', onPopupEscPress);
});

commentInput.addEventListener('blur', function () {
  document.addEventListener('keydown', onPopupEscPress);
});
