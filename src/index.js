import './sass/main.scss';
import { fetchImages } from './js/fetch-images';
import { renderGallery } from './js/render-gallery';
// import { onScroll, onToTopBtn } from './js/scroll';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

// onScroll();
// onToTopBtn();

function onSearchForm(e) {
  e.preventDefault();
  // window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

// import { fetchImages } from './js/gallery-service';
// import { markupGallery } from './js/markup-gallery';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import './sass/index.scss';

// const searchForm = document.querySelector('#search-form');
// const searchBtn = document.querySelector('button[type="submit"]');
// const loadMoreBtn = document.querySelector('.load-more');
// // const gallery = document.querySelector('.gallery');

// const galleryApiService = new GalleryApiService();
// // console.log(galleryApiService);

// searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.addEventListener('click', onLoadMore);

// function onSearch(e) {
//   e.preventDefault();

//   galleryApiService.query = e.currentTarget.elements.searchQuery.value;

//   galleryApiService.resetPage();
//   galleryApiService.fetchImages().then(hits => {
//     clearMarkupGallery();
//     appendMarkupGallery(hits);
//   });
// }

// function onLoadMore() {
//   galleryApiService.fetchImages().then(appendMarkupGallery);
// }

// function appendMarkupGallery(hits) {
//   gallery.insertAdjacentHTML('beforeend', createMarkupGallery(hits));
// }

// function clearMarkupGallery() {
//   gallery.innerHTML = '';
// }

// function createMarkupGallery(card) {
//   return card
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `<div class="photo-card">
//     <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
//     <div class="info">
//       <p class="info-item">
//         <b>Likes</b> ${likes}
//       </p>
//       <p class="info-item">
//         <b>Views</b> ${views}
//       </p>
//       <p class="info-item">
//         <b>Comments</b> ${comments}
//       </p>
//       <p class="info-item">
//         <b>Downloads</b> ${downloads}
//       </p>
//     </div>
//   </div>`
//     )
//     .join('');
// }
