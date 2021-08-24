const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '22968380-c77365a0aacae74fb17ed9f87';

export default class APIPictureService {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
  }

  async fetchImagesCollection() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      q: this.searchQuery,
      page: this.pageNumber,
      per_page: 12,
      key: API_KEY,
    });
    const url = `${BASE_URL}${searchParams}`;
    const response = await fetch(url);
    const imagesCollection = await response.json();
    this.pageNumberIncrement();
    return imagesCollection;
  }

  pageNumberIncrement() {
    this.pageNumber += 1;
  }
  pageNumberReset() {
    this.pageNumber = 1;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  get query() {
    return this.searchQuery;
  }
}
