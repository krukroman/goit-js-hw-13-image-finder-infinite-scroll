import API from './api-service/api-service';
import getRefs from './components/get-refs';
import searchFormTmp from '../templates/search-form.hbs';
import galleryTmp from '../templates/gallery';
import pageInit from './components/page-init';
import OnTopBtn from './components/on-top-btn';
import notify from './components/notify';
import createModal from './components/lightbox';

const refs = getRefs();
const apiService = new API();

const onTopBtn = new OnTopBtn({
  selector: '.js-on-top-btn',
  hidden: true,
});

const setntinelObserver = new IntersectionObserver(onInfiniteScroll, {
  rootMargin: '70px',
});

const searchFormObserver = new IntersectionObserver(enableOnTopBtn, {
  rootMargin: '800px',
});

pageInit(refs.searchForm, searchFormTmp());

refs.searchForm.addEventListener('submit', onSearch);
onTopBtn.refs.button.addEventListener('click', onToTopBtnClick);
refs.gallery.addEventListener('click', openModal);

setntinelObserver.observe(refs.sentinel);
searchFormObserver.observe(refs.searchForm);

function onSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.query.value;
  if (apiService.query.length === 0 || !apiService.query.trim()) {
    notify('Пустая строка ввода. Введите запрос');
    e.currentTarget.elements.query.value = '';
    return;
  }
  apiService.pageNumberReset();
  clearGalleryMarkup();
  appendGalleryMarkup();
}

function onInfiniteScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '' && refs.gallery.children.length >= 12) {
      appendGalleryMarkup();
    }
  });
}

async function appendGalleryMarkup() {
  try {
    const images = await apiService.fetchImagesCollection({});
    createGalleryMarkup(images);
  } catch (error) {
    notify(`${error.stack}`);
  }
}

function createGalleryMarkup(collection) {
  if (collection.total === 0) {
    notify('По вашему запросу ничего ненайдено. Введите другой запрос');
    return;
  } else if (collection.hits.length < 12) {
    notify('Это всё, что было найдено по вашему запросу');
  }
  refs.gallery.insertAdjacentHTML('beforeend', galleryTmp(collection));
}

function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}

function enableOnTopBtn(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      onTopBtn.show();
    } else if (entry.isIntersecting) {
      onTopBtn.hide();
    }
  });
}

function onToTopBtnClick() {
  refs.searchForm.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function openModal(e) {
  e.preventDefault();
  if (!e.target.classList.contains('js-gallery__img')) return;
  const url = e.target.dataset.source;
  createModal(url);
}
