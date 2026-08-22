# Brave YouTube Playlist-Safe Scriptlet v6

Reporter / maintainer: **Skeiver** — https://github.com/Skeiver

This branch contains the working Brave custom scriptlet developed while debugging a YouTube anti-adblock / playback compatibility issue in Brave Desktop.

## Validated result

The final v6 build was confirmed in the real Brave browser to:

- restore normal YouTube playback in the affected setup;
- avoid the previous anti-adblock enforcement failure;
- work with normal single videos;
- work with YouTube playlists and SPA navigation;
- avoid the playlist regression where the next video stayed at `0:00 / 0:00` or `0:00 / <duration>`;
- avoid broad `Promise.prototype.then` and `Map.prototype.has` hooks;
- avoid a whole-document `characterData` observer;
- restrict request rewriting to YouTube player endpoints and only while a recovery marker is active.

## Brave baseline used during validation

Optional Brave filter lists were reduced to a clean baseline. The only optional list left enabled was:

- **German website ad blocker / EasyList Germany**

Other optional blocker lists, including the experimental ad blocker and optional YouTube-specific lists, were disabled during isolation/testing. Brave's built-in/default Shields filtering remained enabled.

## Scriptlet

File:

`youtube-brave-playlist-safe-2026-08-22-v6.js`

Brave scriptlet name:

`youtube-brave-playlist-safe-2026-08-22-v6`

Activation rule:

```text
www.youtube.com##+js(user-youtube-brave-playlist-safe-2026-08-22-v6.js)
```

## Key fixes in v6

1. Anti-adblock DOM renderers are considered active only when they are **actually visible**. Hidden/stale SPA nodes are ignored.
2. Recovery is disabled during `yt-navigate-start`.
3. A 1600 ms post-navigation grace period is used after `yt-navigate-finish`.
4. Recovery state is reset for each new video ID.
5. `Promise.prototype.then` and `Map.prototype.has` are left untouched.
6. The MutationObserver is scoped to YouTube's relevant page/player subtree.
7. Fetch/XHR rewriting is restricted to `/youtubei/v1/player` / `/player` and only when a recovery marker is active.
8. If media is already playing, only the visible anti-adblock renderer is hidden; the player is not reloaded.
9. Recovery is limited to two attempts and uses `lactmilli` then `channel`.
10. The recovery request can apply `params=8AUB`, `lactMilliseconds`, `clientScreen=CHANNEL`, and `#reloadxhr` only in the narrow recovery path.

## Playlist regression found in v5

The earlier v5 version could treat a stale anti-adblock renderer that remained in YouTube's SPA DOM as if it were still active. That triggered an unnecessary recovery during normal playlist navigation and called `loadVideoById()` while the next item was still initializing.

Observed result:

- black player;
- no audio;
- `0:00 / 0:00` or `0:00 / <duration>`;
- playlist entry metadata sometimes appeared later, but playback did not start.

v6 fixes that state-handling bug.

## Chromium validation

The final v6 logic was tested in Chromium 144 via DevTools/CDP using a deterministic YouTube player/runtime harness.

Result: **21/21 PASS**.

See `youtube-brave-playlist-safe-2026-08-22-v6-chromium-test.txt` for the full test list.

## Purpose of publication

This source is published so Brave developers can review the exact compatibility workaround that resolved the issue in the reporter's Brave setup and use the relevant state-safety principles in Brave's own YouTube/Shields handling.

This is an experimental user scriptlet/workaround, not an official Brave component.
