/***************************************** Site Title *****************************************/

function initScrollTitle() {
  var space = ' | ';
  var pos = 0;
  var msg = 'HEADLESS HORSE | FULL-SERVICE CREATIVE STUDIO';

  function title_scroll() {
    document.title = msg.substring(pos, msg.length) + space + msg.substring(0, pos);
    pos++;
    if (pos > msg.length) pos = 0;
    setTimeout(function() {
      requestAnimationFrame(title_scroll);
    }, 300);
  }
  title_scroll();
}

initScrollTitle();

/***************************************** Audio *****************************************/

var audioPad = document.createElement('audio');
audioPad.setAttribute('src', './assets/media/audio/pad.wav');
audioPad.setAttribute('autoplay', 'autoplay', );
audioPad.setAttribute('loop', 'loop', );
audioPad.addEventListener('load', function() {
  audioPad.play();
}, true);

var audioProject = document.createElement('audio');
audioProject.setAttribute('src', './assets/media/audio/select.mp3');
audioProject.addEventListener('load', function() {
  audioProject.play();
}, true);

var audioClick = document.createElement('audio');
audioClick.setAttribute('src', './assets/media/audio/click.mp3');
audioClick.addEventListener('load', function() {
  audioClick.play();
}, true);

$('.project-link').click(function() {
  audioProject.play();
});

$('.click-sound').click(function() {
  audioClick.play();
});

/***************************************** Screensaver *****************************************/

$('#screensaver').hide();
var i = null;
$('body, #screensaver').mousemove(function() {
  clearTimeout(i);
  $('#screensaver').fadeOut();
  i = setTimeout('$("#screensaver").fadeIn(2000);', 20000);
});

class PinterestFeed {
  constructor(...slug) {
    this.slugs = [];
    this.feed = [];
    this.getFeeds();
  }
  reflect(promise) {
    return promise.then(v => v.pins).catch(e => e);
  }
  getFeed(slug) {
    const api = `https://widgets.pinterest.com/v3/pidgets/boards/${slug}/pins/`;
    return new Promise((resolve, reject) => {
      $.ajax({
        dataType: 'jsonp',
        type: 'GET',
        url: api
      }).done((response) => {
        resolve(response.data);
      }).fail((error) => {
        reject(error);
      });
    });
  }
  getFeeds(...slug) {
    return Promise.all(slug.map(v => this.reflect(this.getFeed(v))));
  }
}

const list = document.querySelector('#pinterest-board');
const board1 = 'headless_horse/direction';
const board2 = 'headless_horse/fashion';
const board3 = 'headless_horse/space';
const feed = new PinterestFeed();
let feedItems = [];

feed.getFeeds(board1, board2, board3).then((response) => {
  feedItems = response.flat();
  feedItems.forEach(item => {
    const imageUrl = item.images['237x'].url;
    const li = document.createElement('li');
    li.style.backgroundImage = `url(${imageUrl})`;
    list.appendChild(li);
  });

  function htmlShuffle(elem) {
    function shuffle(arr) {
      var len = arr.length;
      var d = len;
      var array = [];
      var k, i;
      for (i = 0; i < d; i++) {
        k = Math.floor(Math.random() * len);
        array.push(arr[k]);
        arr.splice(k, 1);
        len = arr.length;
      }
      for (i = 0; i < d; i++) {
        arr[i] = array[i];
      }
      return arr;
    }

    var el = document.querySelectorAll('#pinterest-board > li');

    let pos = [];
    for (let i = 0; i < el.length; i++) {
      pos.push(i);
    }

    pos = shuffle(pos);
    for (let i = 0; i < pos.length; i++) {
      document.querySelector(elem).appendChild(el[pos[i]]);
    }
  }
  htmlShuffle('#pinterest-board');

}).catch((error) => {
  console.log(error);
});

/***************************************** Navigation *****************************************/

$('#nav-top--close, .project-link').click(function() {
  $('#terminal, #wall-image--cover').delay(200).fadeToggle(2000);
  $('#wall-image').toggleClass('wall-image--filter');
});

$('#nav-top--close').click(function() {
  $('#nav-top--close--status').html($('#nav-top--close--status').html() == 'Open' ? 'Close' : 'Open');
  $('#terminal--copy, #nav-bottom--new-project').delay(200).fadeIn(2000);
  $('#terminal--iframe').delay(200).fadeOut(2000);
  $('#terminal').addClass('terminal--mix-blend-mode');
});

$('#nav-bottom--new-project, .project-link').click(function() {
  $('#nav-top--close--status').html('[-]');
  $('#terminal--iframe, #terminal, #wall-image--cover').delay(200).fadeIn(2000);
  $('#terminal--copy').delay(200).fadeOut(2000);
});

$('#nav-bottom--new-project').click(function() {
  $('#nav-bottom--new-project').delay(200).fadeOut(2000);
  $('#terminal').addClass('terminal--mix-blend-mode');
});

$('.project-link').click(function() {
  $('#terminal').removeClass('terminal--mix-blend-mode');
});

/***************************************** Clock *****************************************/

const locations = document.querySelectorAll('#nav-top--hh--clock')

setInterval(function() {
  // for each output tag
  locations.forEach(location => {

    // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    const tz = location.getAttribute('data_tz')

    // get the time in that timezone.
    const now = luxon.DateTime.now().setZone(tz)

    // hour in 24-hour time, no padding.
    const hour = parseInt(now.toFormat('H'), 10)
    console.log(hour)

    // day of the week as number. Monday is 1, Sunday is 7.
    const hourday = now.toFormat('c')
    console.log(hourday)

    // timezone. GMT.
    const timezone = now.toFormat('ZZZZ')
    console.log(timezone)

    const clock = document.getElementById('nav-top--hh--clock');
    const list = document.getElementById('hours-list');
    const open = hour >= 8 && hour < 18 && hourday >= 1 && hourday < 6
    if (clock) clock.innerHTML = open ? 'Online' : 'Out of office';
    if (list) list.innerHTML = open ? `The studio is open today from 08:00–18:00 ${timezone}.` : `The studio is now closed. We are open Monday—Friday 08:00–18:00 ${timezone}.`;
  })
}, 1000)

/***************************************** Preload *****************************************/

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let repos = JSON.parse(this.responseText);
    repos.forEach((repo) => {
      document.getElementById('preload').innerHTML += `
        <p>Initialising... ${repo.homepage}.</p>
        <br>
        <p>Connecting address: ${repo.html_url}.</p>
        <p>Repo name: ${repo.name}.</p>
        <br>
        <p>Last updated: ${new Date(repo.pushed_at)}.</p>
        <p>Total size downloading: ${repo.size}kb... done.</p>
        <p>Finished early booting sequence.</p>
        `;
    });
  }
};
xhttp.open('GET', 'https://api.github.com/users/headlesshorse/repos', true);
xhttp.send();

/***************************************** Cookie Visit Record *****************************************/

var days = 365; // when the cookie will expire
var lastvisit = new Object();

lastvisit.getCookie = function(Name) {
  var re = new RegExp(Name + '=[^;]+', 'i');
  if (document.cookie.match(re))
    return document.cookie.match(re)[0].split('=')[1];
  return '';
}

lastvisit.setCookie = function(name, value, days) {
  var expireDate = new Date();

  var expstring = expireDate.setDate(expireDate.getDate() + parseInt(days));
  document.cookie = name + '=' + value + '; expires=' + expireDate.toGMTString() + '; path=/';
}

lastvisit.showmessage = function() {
  var wh = new Date();
  if (lastvisit.getCookie('HHvisitrecord') == '') {
    lastvisit.setCookie('HHvisitrecord', wh, days);
    document.getElementById('firstuse-message').innerHTML = "To see a list of index commands of type 'list'.";

  } else {
    var lv = lastvisit.getCookie('HHvisitrecord');
    var lvp = Date.parse(lv);
    var now = new Date();
    now.setTime(lvp);
    var month = new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
    var dd = now.getDate();
    if (dd < 10) {
      dd = '0' + dd
    }
    var mn = now.getMonth();
    mn = month[mn];
    yy = now.getFullYear();
    var hh = now.getHours();
    if (hh == 0) {
      hh = 12
    }
    if (hh < 10) {
      hh = '0' + hh
    };
    var mins = now.getMinutes();
    if (mins < 10) {
      mins = '0' + mins
    }
    var dispDate = dd + '.' + mn + '.' + yy + ' at ' + hh + ':' + mins
    document.getElementById('welcome-back').innerHTML = 'back ';
    document.getElementById('lastvisit-message').innerHTML = 'Your last visit was on ' + dispDate + '.';
  }
  lastvisit.setCookie('HHvisitrecord', wh, days);

}
lastvisit.showmessage();

/***************************************** Loader *****************************************/

width = 100,
  perfData = window.performance.timing,
  EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
  time = parseInt((EstimatedTime / 1000) % 60) * 100 + 4000;

$('#nav-top--loader-bar').animate({
  width: width + '%'
}, time);

var loader_percentageID = $('#nav-top--hh--percentage'),
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
    $(obj).text(' ' + current + '%');
    // obj.innerHTML = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

setTimeout(function() {
  $('#nav-top--hh--percentage').fadeOut(2000);
  $('#nav-top--hh--clock, #nav-top--close, #nav-bottom, #terminal--copy').delay(1000).fadeIn(2000);
  $('#wall-image').delay(3000).fadeIn(2000);
}, time);

/***************************************** Typing *****************************************/

(function(e) {
  'use strict';
  e.fn.textTyper = function(t) {
    var n = {
        typingClass: 'typing',
        beforeAnimation: function() {},
        afterAnimation: function() {},
        speed: 50,
        nextLineDelay: 400,
        startsFrom: 0,
        repeatAnimation: false,
        repeatDelay: 4e3,
        repeatTimes: 1,
        cursorHtml: '<span class="cursor">|</span>'
      },
      r = e.extend({}, n, t);
    this.each(function() {
      var t = e(this),
        n = 1,
        i = 'typingCursor';
      var s = t,
        o = s.length,
        u = [];
      while (o--) {
        u[o] = e.trim(e(s[o]).html());
        e(s[o]).html('')
      }
      t.init = function(e) {
        var n = r.beforeAnimation;
        if (n) n();
        t.animate(0)
      };
      t.animate = function(o) {
        var a = s[o],
          f = r.typingClass,
          l = r.startsFrom;
        e(a).addClass(f);
        var c = setInterval(function() {
          var f = r.cursorHtml;
          f = e('<div>').append(e(f).addClass(i)).html();
          e(a).html(u[o].substr(0, l) + f);
          l++;
          if (u[o].length < l) {
            clearInterval(c);
            o++;
            if (s[o]) {
              setTimeout(function() {
                e(a).html(u[o - 1]);
                t.animate(o)
              }, r.nextLineDelay)
            } else {
              e(a).find('.' + i).remove();
              if (r.repeatAnimation && (r.repeatTimes == 0 || n < r.repeatTimes)) {
                setTimeout(function() {
                  t.animate(0);
                  n++
                }, r.repeatDelay)
              } else {
                var h = r.afterAnimation;
                if (h) h()
              }
            }
          }
        }, r.speed)
      };
      t.init()
    });
    return this
  }
})(jQuery)

/***************************************** Terminal Command *****************************************/

if (window.screen.width > 800) {
  $(document).ready(function() {
    $('#command').hide();
    $('#preload').addClass('open');
    $('#preload').textTyper({
      speed: 5,
      afterAnimation: function() {
        $('#preload').removeClass('open');
        $('#home').addClass('open');
        $('#home').textTyper({
          speed: 20,
          afterAnimation: function() {
            $('#command').fadeIn();
            $('#command--input[type="text"]').val('');
            $('#command--input[type="text"]').focus();
          }
        });
      }
    });

    // get array of section ids, that exist in DOM
    var sectionArray = [];
    $('section').each(function(i, e) {
      // you can use e.id instead of $(e).attr('id')
      sectionArray.push($(e).attr('id'));
    });

    // command input
    $('#command--input[type="text"]').keyup(function(e) {

      if (e.which == 13) {

        $('#command').hide();
        var destination = $('input[type="text"]').val();

        // display section with id == destination
        $('section[id="' + destination + '"]').addClass('open').siblings().removeClass('open');

        // display error
        if ($.inArray(destination, sectionArray) == -1) {
          $('#error').addClass('open');
          $('#error').siblings().removeClass('open');
        }

        $('.open').textTyper({
          speed: 10,
          afterAnimation: function() {
            $('#command').fadeIn();
            $('#command--input[type="text"]').val('');
            $('#command--input[type="text"]').focus();
          }
        });
      } // end if 'enter' key pressed
    }); // end keyup function
  });
}

$('#terminal').click(function() {
  $('#command--input[type="text"]').focus();
});

/***************************************** Wall Image *****************************************/

var acceleration = 0.01; // acceleration value between 0 and 1 smaller values = smoother motion

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

/*
 * @param {number} x value to map
 * @param {number} a source min value
 * @param {number} b source max value
 * @param {number} c destination min value
 * @param {number} d destination max value
 */
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

$('#nav-top--close, #nav-bottom--new-project, .project-link').click(function() {
  let Termtitle = $(this).attr('alt');
  $('#nav-top--close--title').html(Termtitle);
});

$('.project-link').hover(function() {
  $this = $(this);
  if (!$this.attr('alt') && $this.attr('title')) {
    $this.attr('alt', $this.attr('title'));
  }
})

/***************************************** Newsletter *****************************************/

function showError(el, err) {
  $('#newsletter--subscribe').attr('disabled', false);
  $('#newsletter--subscribe').css('display', 'inline')
  if (err) {
    $('#newsletter--subscribe').attr('disabled', true)
    $('#newsletter--subscribe').css('display', 'none')
  }
}

var isValidEmailAddress = function(emailAddress) {
  var pattern = new RegExp( // regexes validate email
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
  );
  return pattern.test(emailAddress);
};

function validate_email(el, val) {
  var err = !isValidEmailAddress(val);
  showError(el, err);
}

$('#newsletter--email').on('keyup', function() {
  validate_email(this, this.value);
});

/***************************************** Translate *****************************************/

function Translate(elm) {
  window.location = 'https://translate.google.com/translate?sl=en&tl=' + elm.value + '&u=https://headless.horse';
}

/***************************************** Mobile Accordion *****************************************/

let accHeading = document.querySelectorAll('.accordion');
let accPanel = document.querySelectorAll('.accordion--panel');

for (let i = 0; i < accHeading.length; i++) {

  accHeading[i].onclick = function() {
    if (this.nextElementSibling.style.maxHeight) {
      hidePanels();
    } else {
      showPanel(this);
    }
  };
}

function showPanel(elem) {
  hidePanels();
  elem.classList.add('active');
  elem.nextElementSibling.style.maxHeight = elem.nextElementSibling.scrollHeight + 'px';
}

function hidePanels() {
  for (let i = 0; i < accPanel.length; i++) {
    accPanel[i].style.maxHeight = null;
    accHeading[i].classList.remove('active');
  }
}

/***************************************** Cookie Notice *****************************************/

void(function(root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.CookieNotice = factory()
}(this, function() {
  function CookieNotice() {
    ready(run)
  }

  CookieNotice.options = {
    message: 'We use cookies to ensure that we give you the best functional experience on our website. We don’t use advertising or tracking cookies that pass your data on to third parties. <a href="https://www.iubenda.com/privacy-policy/86096520" target="_blank">More info.</a>',
    dismiss: 'Accept'
  }

  function run() {
    if (window.localStorage.HHcookienotice) return
    show()
  }

  function dismiss() {
    var notice = document.getElementById('cookie-notice')
    if (notice) notice.parentNode.removeChild(notice)
    window.localStorage.HHcookienotice = true
  }

  function undismiss() {
    delete window.localStorage.HHcookienotice
  }

  function show() {
    var $div = document.createElement('div')
    $div.id = 'cookie-notice'

    var $message = document.createElement('p')
    $message.id = 'cookie-notice--message'
    $message.innerHTML = CookieNotice.options.message
    $div.appendChild($message)

    var $dismiss = document.createElement('button')
    $dismiss.id = 'cookie-notice--dismiss'
    $dismiss.innerHTML = CookieNotice.options.dismiss
    $dismiss.onclick = dismiss
    $div.appendChild($dismiss)

    document.body.appendChild($div)
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
  CookieNotice.undismiss() // just to make it always show
*/

CookieNotice()
