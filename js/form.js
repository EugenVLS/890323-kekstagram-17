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
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var SCALE_STEP = 25;
  var DEFAULT_SCALE = 100;
  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var currentEffect = '';
  var inputUpload = document.querySelector('#upload-file');
  var editPhotoForm = document.querySelector('.img-upload__overlay');
  var uploadCancel = editPhotoForm.querySelector('#upload-cancel');
  var uploadPreview = editPhotoForm.querySelector('.img-upload__preview img');
  var controlSizeSmaller = editPhotoForm.querySelector('.scale__control--smaller');
  var controlSizeBigger = editPhotoForm.querySelector('.scale__control--bigger');
  var sizeValue = editPhotoForm.querySelector('.scale__control--value');
  var radioEffects = editPhotoForm.querySelectorAll('.effects__radio');
  var effectLevelPin = editPhotoForm.querySelector('.effect-level__pin');
  var effectLevelLine = editPhotoForm.querySelector('.effect-level__depth');
  var effectLevelValue = editPhotoForm.querySelector('.effect-level__value');
  var sliderEffect = editPhotoForm.querySelector('.effect-level');
  var form = document.querySelector('.img-upload__form');
  var formHashtagInput = form.querySelector('.text__hashtags');
  var formCommentInput = form.querySelector('.text__description');
  var main = document.querySelector('main');
  var successMessage = successMessageTemplate.cloneNode(true);
  var errorMessage = errorMessageTemplate.cloneNode(true);

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

  var onSizeControlSmallerClick = function () {
    var valueInInteger = parseInt(sizeValue.value.substring(0, sizeValue.value.length - 1), 10);

    if (valueInInteger !== MIN_SCALE) {
      var newScale = valueInInteger - SCALE_STEP;
      sizeValue.value = newScale + '%';
      uploadPreview.style.transform = 'scale(' + newScale / 100 + ')';
    }
  };

  var onSizeControlBiggerClick = function () {
    var valueInInteger = parseInt(sizeValue.value.substring(0, sizeValue.value.length - 1), 10);

    if (valueInInteger !== MAX_SCALE) {
      var newScale = valueInInteger + SCALE_STEP;
      sizeValue.value = newScale + '%';
      uploadPreview.style.transform = 'scale(' + newScale / 100 + ')';
    }
  };

  controlSizeSmaller.addEventListener('click', onSizeControlSmallerClick);
  controlSizeBigger.addEventListener('click', onSizeControlBiggerClick);

  var putEffect = function (evt) {
    currentEffect = evt.target.value;
    uploadPreview.classList.add('effects__preview--' + currentEffect);
  };

  var resetFilter = function (evt) {
    effectLevelPin.style.left = '100%';
    effectLevelLine.style.width = '100%';
    effectLevelValue.value = DEFAULT_SCALE;
    uploadPreview.classList = '';
    uploadPreview.style.filter = '';
    sliderEffect.style.visibility = '';
    if (evt !== undefined && evt.target.value === 'none') {
      sliderEffect.style.visibility = 'hidden';
    }
  };

  var resetForm = function () {
    formHashtagInput.value = '';
    formCommentInput.value = '';
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

  var deleteElement = function (container, element) {
    container.removeChild(element);
    document.removeEventListener('keydown', onMessageEcsPress);
    document.removeEventListener('click', onDocumentClick);
  };

  var onMessageEcsPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (main.contains(errorMessage)) {
        deleteElement(main, errorMessage);
      }
      if (main.contains(successMessage)) {
        deleteElement(main, successMessage);
      }
    }
  };

  var onDocumentClick = function (evt) {
    if (main.contains(errorMessage) && evt.target === errorMessage) {
      deleteElement(main, errorMessage);
    }
    if (main.contains(successMessage) && evt.target === successMessage) {
      deleteElement(main, successMessage);
    }
  };

  var onMessageButtonClick = function () {
    if (main.contains(errorMessage)) {
      deleteElement(main, errorMessage);
    }
    if (main.contains(successMessage)) {
      deleteElement(main, successMessage);
    }
  };

  var showMessage = function (container, element) {
    container.appendChild(element);

    document.addEventListener('keydown', onMessageEcsPress);
    document.addEventListener('click', onDocumentClick);
    element.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', onMessageButtonClick);
    });
  };

  var successHandler = function () {
    editPhotoForm.classList.add('hidden');
    resetFilter();
    resetForm();
    showMessage(main, successMessage);
  };

  var errorHandler = function () {
    editPhotoForm.classList.add('hidden');
    showMessage(main, errorMessage);
  };
})();
