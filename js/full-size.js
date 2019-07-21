'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

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

  window.showBigPicture = function (photo) {
    var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
    var bigPictureLikes = bigPicture.querySelector('.likes-count');
    var bigPictureCommentsCounter = bigPicture.querySelector('.social__comment-count');
    var bigPictureComments = bigPicture.querySelector('.social__comments');
    var bigPictureDescription = bigPicture.querySelector('.social__caption');
    var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');
    var photoComments = photo.comments.slice();

    var loadComments = function () {
      if (photoComments.length > 5) {
        bigPictureCommentsLoader.addEventListener('click', loadComments);

        for (var i = 0; i < 5; i++) {
          bigPictureComments.appendChild(getCommentTemplate(photoComments[i]));
        }
      } else {
        photoComments.forEach(function (comment) {
          bigPictureComments.appendChild(getCommentTemplate(comment));
        });
      }

      photoComments.splice(0, 5);

      if (photoComments.length === 0) {
        bigPictureCommentsLoader.classList.add('hidden');
        bigPictureCommentsLoader.removeEventListener('click', loadComments);
      }
    };

    bigPictureCommentsCounter.classList.add('hidden');
    bigPicture.classList.remove('hidden');
    bigPictureCommentsLoader.classList.remove('hidden');
    bigPictureImg.src = photo.url;
    bigPictureLikes.textContent = photo.likes;
    bigPictureCommentsCounter.textContent = photo.comments.length;
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
