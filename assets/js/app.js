/***************************************** Loader *****************************************/
$('#horseshoe, #main, #main--copy, #main--iframe, #wall-image--cover, #wall-image').each(function() {
  $(this).hide();
});

$('body').append(`
  <div id="loader">
    <p id="loader--percentage"></p>
    <p>To navigate pages, click on the Horseshoe.<br>To open a case, click on selected wall areas.</p>
  </div>
`);

$('body').css({
  'cursor': 'wait'
});

width = 100,
  perfData = window.performance.timing,
  EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
  time = parseInt((EstimatedTime / 1000) % 60) * 100 + 2000;

var loader_percentageID = $('#loader--percentage'),
  start = 0,
  end = 100,
  durataion = time;
animateValue(loader_percentageID, start, end, durataion);

function animateValue(id, start, end, duration) {

  var range = end - start,
    current = start,
    increment = end > start ? 1 : -1,
    stepTime = Math.abs(Math.floor(duration / range)),
    obj = $(id);

  var timer = setInterval(function() {
    current += increment;
    $(obj).text('LOADING ' + current + '%');
    // obj.innerHTML = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

setTimeout(function() {
  $('#horseshoe').fadeIn(3000);
  $('#loader').delay(1000).fadeOut(3000);
  $('#wall-image').delay(3000).fadeIn(3000);
  setTimeout(function() {
    $('#wall-image').removeClass('wall-image--filter');
  }, 5000);
  $('body').css({
    'cursor': 'default'
  });
}, time);

/***************************************** Navigation *****************************************/
$('#horseshoe').click(function() {
  $('#main, #wall-image--cover').fadeToggle(1000);
  $('#main--iframe').fadeOut(1000);
  $('#main--copy').delay(200).fadeIn(3000);
  $('#wall-image').toggleClass('wall-image--filter');
  $('#horseshoe').toggleClass('horseshoe--cursor');
});

$('*[target="main--iframe"]').click(function() {
  $('#main, #main--iframe, #wall-image--cover').delay(200).fadeIn(3000);
  $('#main--copy').hide();
  $('#wall-image').toggleClass('wall-image--filter');
  $('#horseshoe').toggleClass('horseshoe--cursor');
});

/***************************************** Typing *****************************************/
$(document).ready(function() {
  $.fn.typewriter = function() {
    this.each(function() {
      var $ele = $(this),
        str = $ele.html(),
        progress = 0,
        offset = 0;
      $ele.html('');

      var typewriting = function() {
        $ele.html(str.substring(offset, progress++));
        if (progress >= str.length + 1) {
          return;
        } else {
          setTimeout(typewriting, 4 + Math.random() * 3);
        }
      }
      typewriting();
    });
    return this;
  };
  $('#loader p').typewriter();
});

$('#horseshoe').one('click', function() {
  $.fn.typewriter = function() {
    this.each(function() {
      var $ele = $(this),
        str = $ele.html(),
        progress = 0,
        offset = 0;
      $ele.html('');

      var typewriting = function() {
        $ele.html(str.substring(offset, progress++));
        if (progress >= str.length) {
          return;
        } else {
          setTimeout(typewriting, 4 + Math.random() * 3);
        }
      }
      typewriting();
    });
    return this;
  };
  $('section').typewriter();
});

/***************************************** Office Hours *****************************************/
var now = new Date();
var day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
var hour = now.getUTCHours(); // 0-23

if (day === 0 || day === 6) {
  document.querySelector('h1 + p').innerHTML += `<br>We are currently out of office and will return on Monday morning. Our hours of operation are Monday to Friday, from 09:00 to 18:00 GMT.`;
} else {
  hour += 1; // Adjust for GMT+1 timezone
  if (hour >= 9 && hour < 18) {
    document.querySelector('h1 + p').innerHTML += `<br>The studio is open today from 09:00-18:00 GMT.`;
  } else {
    document.querySelector('h1 + p').innerHTML += `<br>We are currently out of office, our hours of operation are Monday—Friday, 09:00—18:00 GMT.`;
  }
}

/***************************************** Notion *****************************************/
fetch("https://potion-api.now.sh/html?id=f97f1af964fe48989650aae62609bf37")
  .then(res => res.text())
  .then(text => {
    document.querySelector('#latest + ul').innerHTML += text
  })

/***************************************** Wall Image *****************************************/
var acceleration = 0.01;

var img = {
  element: document.querySelector('#wall-image'),
  xMax: 0,
  yMax: 0,
  x: 0,
  y: 0
};

var mouse = {
  x: 0,
  y: 0
};

var vw = 0;
var vh = 0;

function init() {
  resize();
  TweenLite.set(img.element, {
    x: 0,
    y: 0
  });

  var pos = img.element._gsTransform;

  TweenMax.to(img.element, 1000, {
    x: 0,
    y: 0,
    repeat: -1,
    ease: Linear.easeNone,
    modifiers: {
      x: function() {
        img.x = map(mouse.x, 0, vw, 0, img.xMax);
        return pos.x + (img.x - pos.x) * acceleration;
      },
      y: function() {
        img.y = map(mouse.y, 0, vh, 0, img.yMax);
        return pos.y + (img.y - pos.y) * acceleration;
      }
    }
  });

  window.addEventListener('mousemove', moveAction);
  window.addEventListener('touchmove', moveAction);
  window.addEventListener('resize', resize);
}

function map(x, a, b, c, d) {
  return c + (d - c) * ((x - a) / (b - a)) || 0;
}

function resize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  img.xMax = vw - img.element.naturalWidth;
  img.yMax = vh - img.element.naturalHeight;
}

function moveAction(event) {
  if (event.targetTouches && event.targetTouches[0]) {
    event.preventDefault();
    mouse.x = event.targetTouches[0].clientX;
    mouse.y = event.targetTouches[0].clientY;
  } else {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
}

/***************************************** Tooltip *****************************************/
window.addEventListener('load', init);

(function() {
  var ID = 'tooltip',
    CLS_ON = 'tooltip_ON',
    FOLLOW = true,
    DATA = '_tooltip',
    OFFSET_X = 20,
    OFFSET_Y = 10,
    showAt = function(e) {
      var ntop = e.pageY + OFFSET_Y,
        nleft = e.pageX + OFFSET_X;
      $('#' + ID).html($(e.target).data(DATA)).css({
        position: 'absolute',
        top: ntop,
        left: nleft
      }).show();
    };

  $('#wall-image--map').on('mouseenter', '*[title]', function(e) {
    $(this).data(DATA, $(this).attr('title'));
    $(this).removeAttr('title').addClass(CLS_ON);
    $('<div id="' + ID + '" />').appendTo('body');
    showAt(e);
  });

  $('#wall-image--map').on('mouseleave', '.' + CLS_ON, function(e) {
    $(this).attr('title', $(this).data(DATA)).removeClass(CLS_ON);
    $('#' + ID).remove();
  });

  if (FOLLOW) {
    $('#wall-image--map').on('mousemove', '.' + CLS_ON, showAt);
  }
}());

/***************************************** Cookie Notice *****************************************/
const cookieNotice = document.createElement('div');
cookieNotice.setAttribute('id', 'cookie-notice');
cookieNotice.innerHTML = `<p>We use cookies. <a href="https://www.iubenda.com/privacy-policy/86096520" target="_blank">Read Policy.</a> <a onclick="acceptCookies()">Accept.</a></p>`;
document.body.appendChild(cookieNotice);

function setCookie(cookieName, cookieValue, expirationDays) {
  const d = new Date();
  d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

function acceptCookies() {
  setCookie('HHcookienotice', 'true', 365);
  const cookieNoticeDiv = document.getElementById('cookie-notice');
  cookieNoticeDiv.style.display = 'none';
}

if (getCookie('HHcookienotice') === 'true') {
  const cookieNoticeDiv = document.getElementById('cookie-notice');
  cookieNoticeDiv.style.display = 'none';
}
