import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

export default function createModal(url) {
  const instance = basicLightbox.create(`<img class="lightbox__img" src="${url}" alt="" />`);
  instance.show();
}
