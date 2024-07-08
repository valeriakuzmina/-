// Цель: Разработать веб-приложение, которое будет отображать новое случайное изображение из коллекции Unsplash, давая пользователю возможность узнать больше о фотографе и сделать "лайк" изображению.

// Регистрация на Unsplash:

// • Перейдите на веб-сайт Unsplash (https://unsplash.com/).
// • Зарегистрируйтесь или войдите в свой аккаунт. (если у вас не было регистрации до этого, новый аккаунт создавать не нужно).

// Создание приложения:

// • Перейдите на страницу разработчика Unsplash (https://unsplash.com/developers).
// • Нажмите "New Application".
// • Заполните необходимую информацию о приложении (можете использовать http://localhost для тестирования).
// • Получите свой API-ключ после создания приложения.

// Разработка веб-приложения:

// • Создайте HTML-страницу с элементами: изображение, имя фотографа, кнопка "лайк" и счетчик лайков.
// • Используя JavaScript и ваш API-ключ, получите случайное изображение из Unsplash каждый раз, когда пользователь загружает страницу. Обратите внимание, что должно подгружаться всегда случайное изображение, для этого есть отдельная ручка (эндпоинт) у API.
// • Отобразите информацию о фотографе под изображением.
// • Реализуйте функционал "лайка". Каждый раз, когда пользователь нажимает кнопку "лайк", счетчик должен увеличиваться на единицу. Одну фотографию пользователь может лайкнуть только один раз. Также должна быть возможность снять лайк, если ему разонравилась картинка.
// • Добавьте функцию сохранения количества лайков в локальное хранилище, чтобы при новой загрузке страницы счетчик не сбрасывался, если будет показана та же самая картинка.
// • Реализуйте возможность просмотра предыдущих фото с сохранением их в истории просмотров в localstorage.
// • Реализовать все с помощью async/await, без цепочем then.

// Получаем случайное изображение из Unsplash
const photoContainer = document.querySelector('#photo-container');
const photographerElement = document.querySelector('.photographer');
const likeButton = document.getElementById('like-button');
const likeCountElement = document.querySelector('.like-count');
const apiKey = "_rd7b_H3a2Y1hLEJWXFsc1ScEleiH78X8FCZ0-ToWPY";
const likeKey = '';

async function fetchRandomPhoto() {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`);
    }
    const photo = await response.json();
    return photo;
  } catch (error) {
    console.error("Ошибка при загрузке фотографии: ", error);
    return null;
  }
}

 // Отображение фото на странице 
 async function updatePhotoOfTheDay() {
  const photo = await fetchRandomPhoto();
  if (photo) {
      const photoElement = document.createElement('div');
      photoElement.classList.add('photo');
      const img = document.createElement('img');
      img.src = photo.urls.small;
      img.alt = photo.alt_description;
      photoElement.appendChild(img);
      photoContainer.innerHTML = '';
      photoContainer.appendChild(photoElement);

      photographerElement.textContent = `By ${photo.user.name}`;

      const savedLikes = loadLikes(photo.id);
      likeCountElement.textContent = savedLikes !== null ? savedLikes : 0;
      likeButton.dataset.photoId = photo.id;

      likeButton.addEventListener('click', () => {
          const photoId = likeButton.dataset.photoId;
          const currentLikes = parseInt(likeCountElement.textContent, 10);
          const newLikes = currentLikes + 1;
          likeCountElement.textContent = newLikes;
          saveLikes(photoId, newLikes);
      });
  }
}

// Загрузка количества лайков из localStorage
function loadLikes(photoId) {
  const savedLikes = localStorage.getItem(`${likeKey}_${photoId}`);
  return savedLikes ? parseInt(savedLikes, 10) : 0;
}

// Сохранение количества лайков в localStorage
function saveLikes(photoId, likes) {
  localStorage.setItem(`${likeKey}_${photoId}`, likes);
}

window.addEventListener('load', () => {
  updatePhotoOfTheDay();
});


