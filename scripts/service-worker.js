/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["//quayso.xemayvinhtruong.vn/favicon.ico","3d76a73c0bae3b3db6323580251e4000"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Bold-webfont.eot","37ba7acdef2a5522c3b49e223ffc6f68"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Bold-webfont.svg","a472389ef7d974dbf6eb95bf0b2299ce"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Bold-webfont.ttf","4122c979a8919eb890597f6b2db8945a"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Bold-webfont.woff","82485d0e9b2a3fecf830eefafce4cf3c"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Regular-webfont.eot","2188cd844eaca4c4608da41d173167f8"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Regular-webfont.svg","4845f32a6cd0405de153b18295d1df5b"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Regular-webfont.ttf","d935cabb2c8228fd185def6da4308cf1"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/NotoSans-Regular-webfont.woff","b018dace1e0450ee8ef15ffc53435be8"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/ionicons.eot","2c2ae068be3b089e0a5b59abb1831550"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/ionicons.svg","621bd386841f74e0053cb8e67f8a0604"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/ionicons.ttf","24712f6c47821394fba7942fbb52c3b2"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/ionicons.woff","05acfdb568b3df49ad31355b19495d4a"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/utm-avobold-webfont.woff","da6dbc907e5143d39117ede88c835426"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/utm-avobold-webfont.woff2","e7d5927ccbaf43f871b15d1d93cc55bc"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/utmavo-webfont.woff","a8cdea51239454ea2b9c10dbf635bda7"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/fonts/utmavo-webfont.woff2","1f5155097c20de41dd081ea808b9ca60"],["/images/12.png","f2fd6e9839e25d05738ef83d59b9901f"],["/images/backgrounds/5lights_131_half_cut.jpg","ec477e5df7b7938c2c4a6df43ede6726"],["/images/btn-yellow-bg-alt.png","d928912015b409587beccc2e0af4922a"],["/images/btn-yellow-bg.jpg","9da67e92589797f15e328f66750dfe47"],["//quayso.xemayvinhtruong.vn/favicon.ico","3d76a73c0bae3b3db6323580251e4000"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/guides/edit-id-vi.png","29118efa8dc9231f9c00962fded60b11"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/loader-small.png","8186b8d73be53236d14313ab771ecaa3"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/loader.svg","b7013dbe4b3d2c52cae72b8da573b935"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/luckydraw-v1.png","e8de68ed41bdf15199695b7f6b86d81c"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/bronze-icon.svg","84812668a39af058db7f7a7c7a144a80"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/bronze-prize.svg","975587e4a6373777b76999b3b577ae81"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/cards.jpg","cd4644c2854cdd89c3d02b940af9d330"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/coin.svg","e383a072b2dd96527788fe35c120f2ae"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/custom-icon.svg","88c211f8b60635c449edf28c1642ac3b"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/custom-prize.svg","88c211f8b60635c449edf28c1642ac3b"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/diamond-icon.svg","0b5b0d271b2a7302f03495c6c0e1687f"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/diamond-prize.svg","c81d45af0a43d92b12f6732cc4b3ec7c"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-china.jpg","8e9be7b7798c423446cbb68e9c90d44f"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-fr.jpg","013427c3a25011f93ea3c61531e03f98"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-gb.jpg","7b30b0afb74b3f3c04945823cd71ae14"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-korea.jpg","59383ffe3cd4562bf99ac263a16981ff"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-por.jpg","f410ac0ecbf229ceb50efb87421e6f52"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/flag-vietnam.jpg","0d34e5c005f4af46f87805feab0d10b5"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/gold-icon.svg","b29f4150001554f42980a8a2337703ad"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/gold-prize.svg","fcb8131bbcacd989c99dd2110c846354"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/numbers.svg","47cb4c641f3270c330bc5e72369b4691"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/photo-small.svg","5ef3a6b7272b5d7cad278207f0c10340"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/session-photo.jpg","44481f6ac23cba261a7fec14746d4d10"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/silver-icon.svg","9492a93f741c2d0c0d1c57d22bfadd3f"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/silver-prize.svg","5ff943a699ec7f37c0372014e6b9befb"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/x-icon.svg","6d1db4cea17666e353cdfe5c0e3419dd"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/images/x-prize.svg","5c0f0fa9c2ef4a970c7676006a959047"],["/index.html","68292f18ddb2cfd1179e2c1ff4fe25d1"],["/scripts/app-717293a702.js","b6cc192ce3d2654a76e54dd4a66a5c72"],["/scripts/vendor-6980eb934c.js","dff10a781d5e0ae95e820df1fd56f102"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/scripts/appv1x.css","3393b3305c11405ee017e8a81a4cb4c2"],["//cdn.jsdelivr.net/gh/nhanhdep/luckydraw/scripts/vendorv1.css","9b01e8f31140a496e05c8255277af755"]];
var cacheName = 'sw-precache-v2--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {
                credentials: 'same-origin',
                redirect: 'follow'
              }));
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







