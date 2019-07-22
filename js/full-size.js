'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var photoComments = '';

  var getCommentTemplate = function (comment) {
    var templateComment = document.createElement('li');
    var templateImg = document.createElement('img');
    var templateMessage = document.createElement('p');

    templateComment.classList.add('social__comment');

    templateImg.classList.add('social__picture');
    templateImg.src = 'img/avatar-' + window.util.getRandomValue(1, 6) + '.svg';
    templateImg.alt = 'Аватар комментатора фотографии';
    templateImg.width = 35;
    templateImg.height = 35;

    templateComment.appendChild(templateImg);

    templateMessage.classList.add('social__text');
    templateMessage.textContent = comment.message;

    templateComment.appendChild(templateMessage);

    return templateComment;
  };

  var loadComments = function () {
    var DEFAULT_COMMENTS_NUMBER = 5;
    var bigPictureComments = bigPicture.querySelector('.social__comments');
    var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');

    bigPictureCommentsLoader.classList.remove('hidden');
    var fragment = document.createDocumentFragment();
    var onBigPictureCommentsLoaderClick = loadComments;

    if (photoComments.length > DEFAULT_COMMENTS_NUMBER) {
      bigPictureCommentsLoader.addEventListener('click', onBigPictureCommentsLoaderClick);

      for (var i = 0; i < DEFAULT_COMMENTS_NUMBER; i++) {
        fragment.appendChild(getCommentTemplate(photoComments[i]));
      }

      bigPictureComments.appendChild(fragment);
    } else {
      photoComments.forEach(function (comment) {
        fragment.appendChild(getCommentTemplate(comment));
      });

      bigPictureComments.appendChild(fragment);
    }

    photoComments.splice(0, DEFAULT_COMMENTS_NUMBER);

    if (photoComments.length === 0) {
      bigPictureCommentsLoader.classList.add('hidden');
      bigPictureCommentsLoader.removeEventListener('click', onBigPictureCommentsLoaderClick);
    }
  };

  window.showBigPicture = function (photo) {
    var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
    var bigPictureLikes = bigPicture.querySelector('.likes-count');
    var bigPictureCommentsCounter = bigPicture.querySelector('.social__comment-count');
    var bigPictureDescription = bigPicture.querySelector('.social__caption');
    var bigPictureComments = bigPicture.querySelector('.social__comments');
    photoComments = photo.comments.slice();

    bigPictureCommentsCounter.classList.add('hidden');
    bigPicture.classList.remove('hidden');
    bigPictureImg.src = photo.url;
    bigPictureLikes.textContent = photo.likes;
    bigPictureComments.textContent = '';
    loadComments();
    bigPictureDescription.textContent = photo.description;

    var onBigPictureEscPress = function (evt) {
      window.util.isEscEvent(evt, closePopup);
    };

    var closePopup = function () {
      bigPicture.classList.add('hidden');
      document.removeEventListener('keydown', onBigPictureEscPress);
    };

    document.addEventListener('keydown', onBigPictureEscPress);

    bigPictureClose.addEventListener('click', function () {
      closePopup();
    });
  };
})();
