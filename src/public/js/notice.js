function createNotice() {
    if (localStorage.noticeClose) return;
  
    const notice = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'cookies', innerHTML: `<a href="https://withcabin.com/privacy/headless.horse" target="_blank">We don't use cookies.</a> <a href="#" id="cookies-close">Close</a>` }));
  
    notice.querySelector('#cookies-close').addEventListener('click', (e) => {
      e.preventDefault();
      notice.remove();
      localStorage.noticeClose = true;
    });
  }
  
  createNotice();