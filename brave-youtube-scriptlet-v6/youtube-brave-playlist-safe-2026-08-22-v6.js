(() => {
  'use strict';

  const VERSION = '2026.08.22-playlist-safe-v6';
  const GUARD = '__YT_BRAVE_PLAYLIST_SAFE_20260822_V6__';
  if (globalThis[GUARD]) return;

  try {
    Object.defineProperty(globalThis, GUARD, {
      value: VERSION,
      configurable: false
    });
  } catch {
    globalThis[GUARD] = VERSION;
  }

  const DIAG = globalThis.__YT_BRAVE_PLAYLIST_SAFE_V6_DIAG__ = {
    version: VERSION,
    loaded: true,
    flagsPatched: false,
    xhrWrapped: false,
    fetchWrapped: false,
    observerInstalled: false,
    observerTarget: '',
    navigating: false,
    navigationGraceMs: 0,
    visibleAntiAdblock: false,
    visibleAntiAdblockNodes: 0,
    playerResponseSource: 'none',
    mediaActive: false,
    playerRequestRewrites: 0,
    recoveryAttempts: 0,
    successfulReloadCalls: 0,
    visualRecoveries: 0,
    ssapSkips: 0,
    playlistSafeResets: 0,
    ignoredDuringNavigation: 0,
    lastVideoId: '',
    lastMarker: '',
    lastEvent: 'loaded',
    lastError: ''
  };

  const XHR = globalThis.XMLHttpRequest;
  const NativeRequest = globalThis.Request;
  const nativeFetch = globalThis.fetch;
  const nativeXHROpen = XHR?.prototype?.open;
  const nativeXHRSend = XHR?.prototype?.send;
  const nativeJSONParse = JSON.parse;
  const nativeJSONStringify = JSON.stringify;
  const xhrUrl = new WeakMap();

  const RECOVERY_MARKERS = ['lactmilli', 'channel'];
  const NAV_GRACE_MS = 1600;
  const RECOVERY_COOLDOWN_MS = 3200;
  const MAX_RECOVERY_ATTEMPTS = 2;

  const ERROR_SELECTORS = [
    'yt-playability-error-supported-renderers#error-screen',
    '#player-error-message-container',
    'ytd-enforcement-message-view-model',
    'yt-enforcement-message-view-model',
    '#movie_player .ytp-error',
    '#movie_player .ytp-error-content-wrap'
  ];

  let originalUA = '';
  let currentVideoId = '';
  let navigating = false;
  let navigationGraceUntil = 0;
  let recoveryAttempt = 0;
  let lastRecoveryAt = 0;
  let recoveryTimer = 0;
  let runTimer = 0;
  let observer = null;
  let observerTarget = null;
  let startupTries = 0;
  let lastSSAPSkipAt = 0;
  const hiddenNodes = new Map();

  function fail(where, error) {
    try {
      DIAG.lastError = `${where}: ${String(error?.message || error || '')}`;
    } catch {}
  }

  function getCfg() {
    try {
      return globalThis.ytcfg?.data_ || null;
    } catch {
      return null;
    }
  }

  function getClient() {
    try {
      return getCfg()?.INNERTUBE_CONTEXT?.client || null;
    } catch {
      return null;
    }
  }

  function getPlayer() {
    try {
      return document.getElementById('movie_player');
    } catch {
      return null;
    }
  }

  function getVideo() {
    try {
      return document.querySelector(
        'video.html5-main-video, #movie_player video, ytd-player video, video'
      );
    } catch {
      return null;
    }
  }

  function urlVideoId() {
    try {
      return new URL(location.href).searchParams.get('v') || '';
    } catch {
      return '';
    }
  }

  function isWatchPage() {
    try {
      return location.pathname === '/watch' && !!urlVideoId();
    } catch {
      return false;
    }
  }

  function patchFlags() {
    try {
      const flags = getCfg()?.EXPERIMENT_FLAGS;
      if (!flags) return false;

      flags.all_web_enable_network_machine = false;
      flags.all_web_network_machine_raw_request = false;
      DIAG.flagsPatched = true;
      return true;
    } catch (error) {
      fail('patchFlags', error);
      return false;
    }
  }

  function captureOriginalUA() {
    try {
      const client = getClient();
      if (!client) return false;

      if (!originalUA) {
        originalUA = String(client.userAgent || navigator.userAgent || '');
      }
      return true;
    } catch (error) {
      fail('captureOriginalUA', error);
      return false;
    }
  }

  function setMarker(marker) {
    try {
      if (!captureOriginalUA()) return false;
      const client = getClient();
      if (!client) return false;

      client.userAgent = marker
        ? originalUA.replace(/(Mozilla\/5\.0 \([^)]+)/, `$1; ${marker}`)
        : originalUA;

      DIAG.lastMarker = marker || '';
      DIAG.lastEvent = `marker:${marker || 'none'}`;
      return true;
    } catch (error) {
      fail('setMarker', error);
      return false;
    }
  }

  function clearMarker() {
    try {
      if (originalUA) setMarker('');
    } catch {}
  }

  function appendReloadMarker(value) {
    if (typeof value !== 'string') return value;
    return value.replace(/(?:#reloadxhr)?$/, '#reloadxhr');
  }

  function patchReferers(value, seen = new WeakSet()) {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);

    if (Array.isArray(value)) {
      for (const item of value) patchReferers(item, seen);
      return;
    }

    for (const key of Object.keys(value)) {
      if (key === 'referer' && typeof value[key] === 'string') {
        value[key] = appendReloadMarker(value[key]);
      } else {
        patchReferers(value[key], seen);
      }
    }
  }

  function isPlayerEndpoint(url) {
    try {
      const raw = String(url || '');
      const absolute = /^https?:\/\//i.test(raw);
      const parsed = new URL(raw, location.href);

      if (
        parsed.pathname !== '/youtubei/v1/player' &&
        parsed.pathname !== '/player'
      ) {
        return false;
      }

      if (absolute && !/(^|\.)youtube\.com$/i.test(parsed.hostname)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  function rewritePlayerBody(body, url) {
    if (!isPlayerEndpoint(url) || typeof body !== 'string') return body;
    const trimmed = body.trim();
    if (!trimmed.startsWith('{')) return body;

    try {
      const obj = nativeJSONParse(body);
      const client = obj?.context?.client;
      const ua = String(client?.userAgent || '');
      const hasChannel = ua.includes('channel');
      const hasLactmilli = ua.includes('lactmilli');

      if (!hasChannel && !hasLactmilli) return body;

      if (hasChannel && client?.clientName === 'WEB') {
        client.clientScreen = 'CHANNEL';
      }

      if (hasLactmilli) {
        obj.params = '8AUB';
        const playback = obj?.playbackContext?.contentPlaybackContext;
        if (playback) {
          playback.lactMilliseconds = String(Date.now());
        }
      }

      patchReferers(obj);
      const out = nativeJSONStringify(obj);

      if (out !== body) {
        DIAG.playerRequestRewrites++;
        DIAG.lastEvent = hasLactmilli
          ? 'request-rewrite:lactmilli'
          : 'request-rewrite:channel';
      }

      return out;
    } catch (error) {
      fail('rewritePlayerBody', error);
      return body;
    }
  }

  function targetUrlFromFetchArgs(args) {
    try {
      const input = args?.[0];
      if (typeof input === 'string' || input instanceof URL) return String(input);
      return String(input?.url || '');
    } catch {
      return '';
    }
  }

  async function rewriteFetchArgs(args) {
    const url = targetUrlFromFetchArgs(args);
    if (!isPlayerEndpoint(url)) return args;

    const out = Array.from(args);
    const input = out[0];
    const init = out[1] ? { ...out[1] } : {};

    if (typeof init.body === 'string') {
      const rewritten = rewritePlayerBody(init.body, url);
      if (rewritten !== init.body) {
        init.body = rewritten;
        out[1] = init;
      }
      return out;
    }

    if (NativeRequest && input instanceof NativeRequest) {
      try {
        const clone = input.clone();
        const bodyText = await clone.text();
        const rewritten = rewritePlayerBody(bodyText, url);
        if (rewritten !== bodyText) {
          out[0] = new NativeRequest(input, { body: rewritten });
        }
      } catch {}
    }

    return out;
  }

  function installFetchLayer() {
    if (typeof nativeFetch !== 'function') return;
    if (globalThis.fetch?.__ytBravePlaylistSafeV6Fetch) {
      DIAG.fetchWrapped = true;
      return;
    }

    try {
      const wrapped = new Proxy(nativeFetch, {
        async apply(target, thisArg, args) {
          const url = targetUrlFromFetchArgs(args);
          if (!isPlayerEndpoint(url)) {
            return Reflect.apply(target, thisArg, args);
          }
          const rewritten = await rewriteFetchArgs(args);
          return Reflect.apply(target, thisArg, rewritten);
        }
      });

      Object.defineProperty(wrapped, '__ytBravePlaylistSafeV6Fetch', {
        value: VERSION
      });

      globalThis.fetch = wrapped;
      DIAG.fetchWrapped = true;
    } catch (error) {
      fail('installFetchLayer', error);
    }
  }

  function installXHRLayer() {
    if (!XHR || typeof nativeXHROpen !== 'function' || typeof nativeXHRSend !== 'function') {
      return;
    }

    if (XHR.prototype.__ytBravePlaylistSafeV6XHR) {
      DIAG.xhrWrapped = true;
      return;
    }

    try {
      XHR.prototype.open = new Proxy(nativeXHROpen, {
        apply(target, thisArg, args) {
          try {
            xhrUrl.set(thisArg, String(args?.[1] || ''));
          } catch {}
          return Reflect.apply(target, thisArg, args);
        }
      });

      XHR.prototype.send = new Proxy(nativeXHRSend, {
        apply(target, thisArg, args) {
          try {
            const url = xhrUrl.get(thisArg) || '';
            if (isPlayerEndpoint(url) && typeof args?.[0] === 'string') {
              args[0] = rewritePlayerBody(args[0], url);
            }
          } catch (error) {
            fail('xhrSend', error);
          }
          return Reflect.apply(target, thisArg, args);
        }
      });

      Object.defineProperty(XHR.prototype, '__ytBravePlaylistSafeV6XHR', {
        value: VERSION
      });

      DIAG.xhrWrapped = true;
    } catch (error) {
      fail('installXHRLayer', error);
    }
  }

  function safePlayerResponse(player) {
    try {
      const live = player?.getPlayerResponse?.();
      if (live && typeof live === 'object') {
        DIAG.playerResponseSource = 'movie_player';
        return live;
      }
    } catch {}

    try {
      const initial = globalThis.ytInitialPlayerResponse;
      if (initial && typeof initial === 'object') {
        const expected = urlVideoId();
        const actual = initial?.videoDetails?.videoId || '';
        if (!expected || !actual || expected === actual) {
          DIAG.playerResponseSource = 'ytInitialPlayerResponse';
          return initial;
        }
      }
    } catch {}

    DIAG.playerResponseSource = 'none';
    return null;
  }

  function errorContractMatches(response) {
    if (response?.playabilityStatus?.status !== 'UNPLAYABLE') return false;

    const error = response?.playabilityStatus?.errorScreen;
    if (error?.playerErrorMessageRenderer?.playerCaptchaViewModel) return false;

    try {
      const candidate =
        error?.playerErrorMessageRenderer?.subreason?.runs ||
        error?.playerInterstitialRenderer?.content?.interstitialViewModel?.description?.commandRuns ||
        error ||
        '';

      const text = nativeJSONStringify(candidate);
      return (
        text.includes('WEB_PAGE_TYPE_UNKNOWN') &&
        text.includes('https://support.google.com/youtube/answer/3037019')
      );
    } catch {
      return false;
    }
  }

  function antiAdblockTextMatches(text) {
    const value = String(text || '').toLowerCase();
    return (
      value.includes('werbeblocker verstoßen gegen die youtube-nutzungsbedingungen') ||
      value.includes('werbeblocker verstoßen gegen die youtube') ||
      value.includes('videowiedergabe ist blockiert') ||
      value.includes('youtube-anzeigen erlauben') ||
      value.includes('ad blockers violate youtube') ||
      value.includes('video playback is blocked') ||
      value.includes('allow youtube ads')
    );
  }

  function nodeIsActuallyVisible(node) {
    try {
      if (!node || !node.isConnected || node.hidden) return false;
      if (node.getAttribute?.('aria-hidden') === 'true') return false;

      if (typeof node.checkVisibility === 'function') {
        try {
          if (!node.checkVisibility({
            checkOpacity: true,
            checkVisibilityCSS: true
          })) {
            return false;
          }
        } catch {}
      }

      const style = getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.visibility === 'collapse' ||
        Number(style.opacity || 1) <= 0.01
      ) {
        return false;
      }

      const rects = node.getClientRects?.();
      if (!rects || rects.length === 0) return false;

      const rect = node.getBoundingClientRect?.();
      if (!rect || rect.width < 2 || rect.height < 2) return false;

      return true;
    } catch {
      return false;
    }
  }

  function findVisibleAntiAdblockNodes() {
    const hits = [];
    const seen = new Set();

    try {
      for (const selector of ERROR_SELECTORS) {
        for (const node of document.querySelectorAll(selector)) {
          if (
            !seen.has(node) &&
            nodeIsActuallyVisible(node) &&
            antiAdblockTextMatches(node.textContent)
          ) {
            seen.add(node);
            hits.push(node);
          }
        }
      }

      for (const link of document.querySelectorAll(
        'a[href*="support.google.com/youtube/answer/3037019"]'
      )) {
        const root = link.closest(
          'yt-playability-error-supported-renderers, #player-error-message-container, ytd-enforcement-message-view-model, yt-enforcement-message-view-model'
        );

        if (
          root &&
          !seen.has(root) &&
          nodeIsActuallyVisible(root) &&
          antiAdblockTextMatches(root.textContent)
        ) {
          seen.add(root);
          hits.push(root);
        }
      }
    } catch (error) {
      fail('findVisibleAntiAdblockNodes', error);
    }

    DIAG.visibleAntiAdblockNodes = hits.length;
    DIAG.visibleAntiAdblock = hits.length > 0;
    return hits;
  }

  function restoreHiddenErrors() {
    for (const [node, originalStyle] of hiddenNodes) {
      try {
        if (originalStyle === null) {
          node.removeAttribute('style');
        } else {
          node.setAttribute('style', originalStyle);
        }
      } catch {}
    }
    hiddenNodes.clear();
  }

  function hideVisibleAntiAdblockNodes(nodes) {
    let changed = false;

    for (const node of nodes) {
      if (hiddenNodes.has(node)) continue;

      try {
        hiddenNodes.set(node, node.getAttribute('style'));
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
        changed = true;
      } catch {}
    }

    if (changed) {
      DIAG.visualRecoveries++;
      DIAG.lastEvent = 'hide-visible-antiadblock';
    }

    return changed;
  }

  function mediaIsActive(player) {
    let active = false;

    try {
      const video = getVideo();
      if (video) {
        const ready = Number(video.readyState || 0) >= 2;
        active = !video.paused && !video.ended && ready;
      }
    } catch {}

    try {
      if (player?.getPlayerState?.() === 1) active = true;
    } catch {}

    DIAG.mediaActive = active;
    return active;
  }

  function currentStartTime(player, response) {
    try {
      const configured = Number(
        response?.playerConfig?.playbackStartConfig?.startSeconds
      );
      if (Number.isFinite(configured) && configured >= 0) return configured;
    } catch {}

    try {
      const now = Number(player?.getCurrentTime?.());
      if (Number.isFinite(now) && now >= 0) return now;
    } catch {}

    return 0;
  }

  function cancelRecoveryTimer() {
    if (!recoveryTimer) return;
    try {
      clearTimeout(recoveryTimer);
    } catch {}
    recoveryTimer = 0;
  }

  function resetForVideo(videoId, reason) {
    restoreHiddenErrors();
    cancelRecoveryTimer();
    clearMarker();

    currentVideoId = videoId || '';
    recoveryAttempt = 0;
    lastRecoveryAt = 0;
    lastSSAPSkipAt = 0;
    navigationGraceUntil = Date.now() + NAV_GRACE_MS;

    DIAG.lastVideoId = currentVideoId;
    DIAG.playlistSafeResets++;
    DIAG.navigationGraceMs = NAV_GRACE_MS;
    DIAG.lastEvent = `${reason}:${currentVideoId || 'none'}`;
  }

  function scheduleRecoveryCheck(delay = RECOVERY_COOLDOWN_MS + 150) {
    cancelRecoveryTimer();
    recoveryTimer = setTimeout(() => {
      recoveryTimer = 0;
      scheduleRun(0);
    }, delay);
  }

  function attemptRecovery(player, response, videoId, source) {
    if (!player || !videoId || navigating) return false;
    if (Date.now() < navigationGraceUntil) return false;
    if (recoveryAttempt >= MAX_RECOVERY_ATTEMPTS) return false;

    const now = Date.now();
    if (now - lastRecoveryAt < RECOVERY_COOLDOWN_MS) return false;

    const marker = RECOVERY_MARKERS[recoveryAttempt];
    recoveryAttempt++;
    lastRecoveryAt = now;
    DIAG.recoveryAttempts++;

    if (!setMarker(marker)) return false;

    try {
      player.loadVideoById?.(
        videoId,
        currentStartTime(player, response)
      );

      DIAG.successfulReloadCalls++;
      DIAG.lastEvent = `${source}:${marker}`;
      scheduleRecoveryCheck();
      return true;
    } catch (error) {
      fail('attemptRecovery', error);
      return false;
    }
  }

  function handleSSAP(player) {
    try {
      const stats = player?.getStatsForNerds?.();
      const progress = player?.getProgressState?.();
      const duration = Number(progress?.duration || 0);

      if (
        !String(stats?.debug_info || '').startsWith('SSAP, AD') ||
        !Number.isFinite(duration) ||
        duration <= 0
      ) {
        return false;
      }

      const now = Date.now();
      if (now - lastSSAPSkipAt < 1500) {
        return true;
      }

      lastSSAPSkipAt = now;
      player.seekTo?.(duration, true);
      DIAG.ssapSkips++;
      DIAG.lastEvent = 'ssap-skip';
      return true;
    } catch (error) {
      fail('handleSSAP', error);
      return false;
    }
  }

  function run() {
    runTimer = 0;
    patchFlags();
    captureOriginalUA();
    attachObserver();

    DIAG.navigating = navigating;
    DIAG.navigationGraceMs = Math.max(0, navigationGraceUntil - Date.now());

    if (!isWatchPage()) {
      restoreHiddenErrors();
      clearMarker();
      DIAG.visibleAntiAdblock = false;
      DIAG.visibleAntiAdblockNodes = 0;
      return;
    }

    const videoId = urlVideoId();

    if (navigating) {
      DIAG.ignoredDuringNavigation++;
      return;
    }

    if (videoId !== currentVideoId) {
      resetForVideo(videoId, 'video-change');
      scheduleRun(NAV_GRACE_MS + 80);
      return;
    }

    if (Date.now() < navigationGraceUntil) {
      DIAG.ignoredDuringNavigation++;
      scheduleRun(Math.max(80, navigationGraceUntil - Date.now() + 50));
      return;
    }

    const player = getPlayer();
    if (!player) return;

    const response = safePlayerResponse(player);

    if (handleSSAP(player)) return;

    const contractBlocked = errorContractMatches(response);
    const visibleNodes = findVisibleAntiAdblockNodes();
    const domBlocked = visibleNodes.length > 0;

    if (!contractBlocked && !domBlocked) {
      if (hiddenNodes.size > 0) restoreHiddenErrors();
      clearMarker();
      recoveryAttempt = 0;
      cancelRecoveryTimer();
      DIAG.lastEvent = 'stable-playback';
      return;
    }

    if (domBlocked && mediaIsActive(player)) {
      hideVisibleAntiAdblockNodes(visibleNodes);
      clearMarker();
      cancelRecoveryTimer();
      return;
    }

    attemptRecovery(
      player,
      response,
      videoId,
      contractBlocked ? 'contract-recovery' : 'visible-dom-recovery'
    );
  }

  function scheduleRun(delay = 100) {
    if (runTimer) return;
    runTimer = setTimeout(run, Math.max(0, delay));
  }

  function desiredObserverTarget() {
    try {
      return (
        document.getElementById('page-manager') ||
        document.querySelector('ytd-watch-flexy') ||
        document.querySelector('ytd-app') ||
        null
      );
    } catch {
      return null;
    }
  }

  function attachObserver() {
    try {
      const target = desiredObserverTarget();
      if (!target) return false;
      if (observer && observerTarget === target) return true;

      observer?.disconnect?.();
      observerTarget = target;
      observer = new MutationObserver(() => {
        if (!navigating) scheduleRun(120);
      });

      observer.observe(target, {
        childList: true,
        subtree: true
      });

      DIAG.observerInstalled = true;
      DIAG.observerTarget =
        target.id || target.tagName?.toLowerCase?.() || 'unknown';
      return true;
    } catch (error) {
      fail('attachObserver', error);
      return false;
    }
  }

  function onNavigateStart() {
    navigating = true;
    DIAG.navigating = true;
    navigationGraceUntil = Number.POSITIVE_INFINITY;
    restoreHiddenErrors();
    cancelRecoveryTimer();
    clearMarker();
    recoveryAttempt = 0;
    lastRecoveryAt = 0;
    DIAG.lastEvent = 'yt-navigate-start';
  }

  function onNavigateFinish() {
    navigating = false;
    DIAG.navigating = false;
    const videoId = urlVideoId();
    resetForVideo(videoId, 'yt-navigate-finish');
    attachObserver();
    scheduleRun(NAV_GRACE_MS + 80);
  }

  function startupProbe() {
    patchFlags();
    captureOriginalUA();
    attachObserver();

    if (!currentVideoId && isWatchPage()) {
      resetForVideo(urlVideoId(), 'startup');
    }

    scheduleRun(NAV_GRACE_MS + 80);

    if (
      (!DIAG.flagsPatched || !originalUA || !observerTarget || !getPlayer()) &&
      startupTries < 20
    ) {
      startupTries++;
      setTimeout(startupProbe, 250);
    }
  }

  installFetchLayer();
  installXHRLayer();

  document.addEventListener('yt-navigate-start', onNavigateStart, true);
  document.addEventListener('yt-navigate-finish', onNavigateFinish, true);
  document.addEventListener('yt-page-data-updated', () => scheduleRun(180), true);
  document.addEventListener('yt-player-updated', () => scheduleRun(180), true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scheduleRun(100);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startupProbe, {
      once: true,
      capture: true
    });
  } else {
    startupProbe();
  }
})();
