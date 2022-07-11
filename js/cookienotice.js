/***************************************** COOKIE NOTICE *****************************************/

void(function(root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.CookieNotice = factory()
}(this, function() {
  function CookieNotice() {
    ready(run)
  }

  CookieNotice.options = {
    message: '<p>We use cookies to ensure that we give you the best functional experience on our website. We don’t use advertising or tracking cookies or any kind of cookies that pass your data on to third parties. <a href="https://headlesshorse.notion.site/Privacy-3da531bfce1d4f4094afa4e9c138a5ca" target="_blank">More info.</a></p>',
    dismiss: 'Accept'
  }

  function run() {
    if (window.localStorage.cookieNoticeDismissed) return
    show()
  }

  function dismiss() {
    var notice = document.getElementById('cookie-notice')
    if (notice) notice.parentNode.removeChild(notice)
    window.localStorage.cookieNoticeDismissed = true
  }

  function undismiss() {
    delete window.localStorage.cookieNoticeDismissed
  }

  function show() {
    var $div = document.createElement('div')
    $div.className = 'cookie-notice'
    $div.id = 'cookie-notice'

    var $message = document.createElement('div')
    $message.className = 'cookie-notice-message'
    $message.innerHTML = CookieNotice.options.message
    $div.appendChild($message)

    var $dismiss = document.createElement('button')
    $dismiss.innerHTML = CookieNotice.options.dismiss
    $dismiss.onclick = dismiss
    $div.appendChild($dismiss)

    document.getElementById("nav-bottom").before($div)
  }

  function ready(fn) {
    if (document.readyState === 'complete') {
      return fn()
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn)
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'interactive') fn()
      })
    }
  }

  CookieNotice.run = run
  CookieNotice.dismiss = dismiss
  CookieNotice.undismiss = undismiss

  return CookieNotice
}));

/*
  CookieNotice.undismiss() // just so it always shows
*/

CookieNotice()
