'use strict';

(function () {
  var effects = [{
    effect: 'chrome',
    property: 'grayscale',
    min: 0,
    max: 1
  }, {
    effect: 'sepia',
    property: 'sepia',
    min: 0,
    max: 1
  }, {
    effect: 'marvin',
    property: 'invert',
    min: 0,
    max: 100
  }, {
    effect: 'phobos',
    property: 'blur',
    min: 0,
    max: 3
  }, {
    effect: 'heat',
    property: 'brightness',
    min: 1,
    max: 3
  }];

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
  var form = document.querySelector('.img-upload__form');
  var formHashtagInput = form.querySelector('.text__hashtags');

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

  var getEffectValue = function (property, min, max, pinValue) {
    var effectValue = min + (max - min) / 100 * pinValue;
    var value = '';

    switch (property) {
      case 'grayscale':
        value = property + '(' + effectValue + ')';
        break;
      case 'sepia':
        value = property + '(' + effectValue + ')';
        break;
      case 'invert':
        value = property + '(' + effectValue + '%)';
        break;
      case 'blur':
        value = property + '(' + effectValue + 'px)';
        break;
      case 'brightness':
        value = property + '(' + effectValue + ')';
        break;
    }

    return value;
  };

  var setEffectSaturation = function (effect) {
    var pinValue = effectLevelValue.value;

    for (var i = 0; i < effects.length; i++) {
      if (effects[i].effect === effect) {
        var effectValue = getEffectValue(effects[i].property, effects[i].min, effects[i].max, pinValue);

        uploadPreview.style.filter = effectValue;
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

      var insideEffectLine = effectLevelPin.offsetLeft - shift.x >= 0 && effectLevelPin.offsetLeft - shift.x <= width;

      if (insideEffectLine) {
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

  formHashtagInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });

  formHashtagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscPress);
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), successHandler, errorHandler);
  });

  var successHandler = function () {
    editPhotoForm.classList.add('hidden');
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
})();
