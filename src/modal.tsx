import { Cross } from './cross';
import { IModal, IModalOptions, modalDefaultOptions } from './modal';
import { useCallback, useEffect, useRef, useState } from 'react';

export const Modal = ({
  options: defaultOptions,
  isOpened = false,
  onClose,
  onOpen,
  children,
  title,
}: IModal) => {
  const [body, setBody] = useState<HTMLElement>();
  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState<boolean>();
  const blocker = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<IModalOptions>(defaultOptions);

  // initialize body and options
  useEffect(() => {
    if (!document) return;

    setBody(document.body);

    setOptions({
      ...modalDefaultOptions,
      ...options,
      doFade: !isNaN(parseInt(options.fadeDuration, 10)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptions]);

  // displays the background (aka block) behind the modal + disable body scrolling
  const block = useCallback(() => {
    if (!body) return;

    body.style.overflow = 'hidden';

    if (!blocker.current) return;

    if (options.doFade) {
      blocker.current.style.opacity = '0';
      blocker.current.animate([{ opacity: '0' }, { opacity: '1' }], {
        duration: +options.fadeDuration,
        fill: 'forwards',
      });
    } else {
      blocker.current.style.opacity = '1';
    }
  }, [blocker, body, options.doFade, options.fadeDuration]);

  // removes the background (aka block) behind the modal + enable body scrolling
  const unblock = useCallback(
    async (now: boolean = false) => {
      return new Promise((resolve) => {
        if (!body) return;
        if (!blocker.current) return;

        if (!now && options.doFade) {
          blocker.current.style.opacity = '1';
          const animation = blocker.current.animate([{ opacity: '1' }, { opacity: '0' }], {
            duration: +options.fadeDuration,
            fill: 'forwards',
          });
          animation.onfinish = resolve;
        } else {
          blocker.current.style.opacity = '0';
          resolve(undefined);
        }

        if (body) {
          body.style.overflow = '';
        }
      });
    },
    [body, options.doFade, options.fadeDuration]
  );

  // displays the modal
  const show = useCallback(() => {
    if (!modal.current) return;

    if (options.showClose) {
      setIsCloseButtonVisible(true);
    }

    if (options.doFade) {
      modal.current.animate(
        [{ opacity: '0', display: 'inline-block' }, { opacity: '1' }],
        +options.fadeDuration
      );
    } else {
      modal.current.style.display = 'inline-block';
      modal.current.style.opacity = '1';
    }
  }, [options.doFade, options.fadeDuration, options.showClose]);

  // handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent, callback: () => void) => {
      if (event.code === 'Escape' && options.escapeClose) callback();
    },
    [options.escapeClose]
  );

  // call all the closing functions
  const close = useCallback(() => {
    // TODO: debug hide
    Promise.all([unblock()]).then(() => {
      if (onClose) onClose();
    });

    document.removeEventListener('keydown', (e) => handleKeyDown(e, close));
  }, [handleKeyDown, onClose, unblock]);

  // call all the opening functions
  const open = useCallback(() => {
    block();
    if (options?.doFade) {
      setTimeout(() => {
        show();
      }, +options.fadeDuration * options.fadeDelay);
    } else {
      show();
    }
    document.removeEventListener('keydown', (e) => handleKeyDown(e, close));
    document.addEventListener('keydown', (e) => handleKeyDown(e, close));
    if (options.clickClose) {
      blocker.current?.addEventListener('click', (event: MouseEvent) => {
        if (event.target === blocker.current) {
          close();
        }
      });
    }

    if (onOpen) onOpen();
  }, [
    block,
    options?.doFade,
    options.clickClose,
    options.fadeDuration,
    options.fadeDelay,
    handleKeyDown,
    onOpen,
    show,
    close,
  ]);

  useEffect(() => {
    if (isOpened) {
      open();
      return;
    }

    close();
  }, [close, isOpened, open]);

  return (
    <div
      ref={blocker}
      className={`${
        options.blockerClass ?? ''
      } blocker current fixed inset-0 z-[9999] opacity-0 flex items-center justify-center bg-black/80`}>
      <div
        ref={modal}
        className={`${
          options.modalClass ?? ''
        } bg-white w-full max-w-lg h-fit max-h-[600px] rounded-lg shadow-lg`}>
        <header className='border-b border-black/20 p-4 flex items-center'>
          {title}

          {options.showClose && isCloseButtonVisible && (
            <button onClick={close} className={`close-modal ml-auto ${options.closeClass ?? ''}`}>
              <Cross />
            </button>
          )}
        </header>

        <div className='p-4'>{children}</div>
      </div>
    </div>
  );
};
