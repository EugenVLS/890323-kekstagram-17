'use strict';

(function () {
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
    var bigPicture = document.querySelector('.big-picture');
    var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
    var bigPictureLikes = bigPicture.querySelector('.likes-count');
    var bigPictureCommentsCounter = bigPicture.querySelector('.comments-count');
    var bigPictureComments = bigPicture.querySelector('.social__comments');
    var bigPictureDescription = bigPicture.querySelector('.social__caption');
    var bigPictureCommentsCount = bigPicture.querySelector('.social__comment-count');
    var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');

    bigPictureCommentsCount.classList.add('visually-hidden');
    bigPictureCommentsLoader.classList.add('visually-hidden');

    bigPicture.classList.remove('hidden');
    bigPictureImg.src = photo.url;
    bigPictureLikes.textContent = photo.likes;
    bigPictureCommentsCounter.textContent = photo.comments.length;
    bigPictureComments.innerHTML = '';

    photo.comments.forEach(function (comment) {
      bigPictureComments.appendChild(getCommentTemplate(comment));
    });

    bigPictureDescription.textContent = photo.description;
  };
})();
