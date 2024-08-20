import { TRANSITION } from '../../constants';

const mask = () => {
  let inTime = 0;
  let maskEl: HTMLElement | null = null;

  const create = () => {
    if (!maskEl) {
      maskEl = document.createElement('div');
      maskEl.className = 'pc__header-mask';
      maskEl.setAttribute(
        'style',
        `pointer-events:none;position:fixed;width:100%;height:100%;left:0;top:0;background: #000;z-index:10;opacity:0;transition: opacity ${TRANSITION}s ease-out;`,
      );
      document.body.appendChild(maskEl);
    }
  };
  const hide = () => {
    setTimeout(() => {
      maskEl && (maskEl.style.opacity = '0');
      setTimeout(() => {
        if ((Date.now() - inTime) / 1000 > TRANSITION * 2) {
          remove();
        }
      }, TRANSITION * 1000);
    }, 100);
  };

  const show = () => {
    inTime = Date.now();
    setTimeout(() => {
      maskEl && (maskEl.style.opacity = '0.7');
    }, 100);
  };

  const remove = () => {
    inTime = 0;
    maskEl && document.body.removeChild(maskEl);
    maskEl = null;
  };
  return {
    create,
    hide,
    show,
    remove,
  };
};

export default mask;
