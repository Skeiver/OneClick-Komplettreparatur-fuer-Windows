# Brave report: YouTube anti-adblock playback failure and playlist/SPA regression

Reporter: **Skeiver** — https://github.com/Skeiver

## Description

On Brave Desktop / Windows, YouTube displayed the anti-adblock enforcement screen:

> Werbeblocker verstoßen gegen die YouTube-Nutzungsbedingungen

The problem was isolated with a reduced Brave filter baseline. Optional blocker lists were disabled except **German website ad blocker / EasyList Germany**. Brave's built-in/default Shields filtering remained enabled.

During debugging, a workaround restored normal playback, but an earlier version introduced a second issue during YouTube SPA/playlist navigation: the next playlist item could become stuck at `0:00 / 0:00` or `0:00 / <duration>` with a black player and no playback.

The final **playlist-safe v6** resolves both the anti-adblock state and the playlist regression in the reporter's Brave setup.

## Full working v6 source

**Full scriptlet source:**

https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/blob/brave-youtube-scriptlet-v6/brave-youtube-scriptlet-v6/youtube-brave-playlist-safe-2026-08-22-v6.js

**Documentation / setup:**

https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/blob/brave-youtube-scriptlet-v6/brave-youtube-scriptlet-v6/README.md

**Chromium 144 validation report (21/21 PASS):**

https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/blob/brave-youtube-scriptlet-v6/brave-youtube-scriptlet-v6/youtube-brave-playlist-safe-2026-08-22-v6-chromium-test.txt

Brave activation rule used during validation:

```text
www.youtube.com##+js(user-youtube-brave-playlist-safe-2026-08-22-v6.js)
```

## Root cause found during debugging

The playlist regression was caused by treating an old anti-adblock renderer that remained in YouTube's SPA DOM as an active visible failure.

That false positive could trigger a recovery during a normal `yt-navigate-start` / playlist transition and call `loadVideoById()` while the next video was still initializing.

This matched the observed failure pattern:

1. playlist item changes;
2. stale hidden anti-adblock DOM node still exists;
3. recovery is incorrectly triggered;
4. player reload occurs during SPA initialization;
5. player falls back to `0:00 / 0:00`;
6. metadata may later restore duration, but playback remains stuck.

## What v6 changes

The working v6 applies the following safeguards:

1. Anti-adblock renderers are considered active only when **actually visible**.
   - checks `hidden`;
   - checks `aria-hidden`;
   - checks computed `display`, `visibility`, `opacity`;
   - checks client rects / element size;
   - uses `checkVisibility()` when available.
2. Recovery is completely suppressed during `yt-navigate-start`.
3. A **1600 ms grace period** is applied after `yt-navigate-finish`.
4. Recovery state is reset for each new `videoId`.
5. Global `Promise.prototype.then` and `Map.prototype.has` hooks are not used.
6. MutationObserver is scoped to `#page-manager`, `ytd-watch-flexy`, or `ytd-app` instead of observing `characterData` across the entire document.
7. Fetch/XHR rewriting is limited to `/youtubei/v1/player` / `/player`.
8. Player requests are rewritten only while a recovery marker is active.
9. If media is already playing and only the anti-adblock UI remains visible, v6 hides only that visible renderer instead of reloading the player.
10. Recovery is limited to two attempts.

## Narrow recovery mechanism

Only after a confirmed anti-adblock state, v6 can use:

- `lactmilli`
- `channel`
- `clientScreen = CHANNEL`
- `params = 8AUB`
- `lactMilliseconds`
- `#reloadxhr`
- `all_web_enable_network_machine = false`
- `all_web_network_machine_raw_request = false`

The request modifications are not applied during normal playlist navigation.

## Steps to reproduce the original problem

1. Open Brave Desktop on Windows.
2. Use YouTube with Shields enabled.
3. Reduce optional filter lists to a clean baseline; during isolation only **German website ad blocker / EasyList Germany** remained enabled.
4. Open a normal YouTube video.
5. In affected sessions, YouTube displays the anti-adblock enforcement screen and blocks playback.
6. With an earlier recovery implementation, open a playlist and switch between entries in the same tab.
7. The next entry may remain at `0:00 / 0:00` or `0:00 / <duration>` with black video / no playback.
8. Install the playlist-safe v6 scriptlet and repeat the same single-video and playlist tests.
9. Playback and playlist navigation work normally in the reporter's Brave setup.

## Actual result before v6

- Anti-adblock enforcement UI could block YouTube playback while Brave Shields were active.
- A broad workaround could interfere with same-tab YouTube SPA/playlist navigation.
- Stale hidden enforcement DOM nodes could be mistaken for an active error state.

## Expected result

Brave Shields should handle YouTube filtering without triggering the enforcement screen, and any Brave-side compatibility recovery should not:

- react to stale hidden SPA DOM nodes;
- interfere with `yt-navigate-start` / playlist initialization;
- reload the player during a normal video-ID transition;
- hook unrelated global async/prototype behavior.

## Validation

The final v6 runtime logic was tested in Chromium 144 through DevTools/CDP with a deterministic YouTube player/runtime harness.

**Result: 21/21 PASS.**

Key validation cases:

- scriptlet loads correctly;
- network-machine flags are changed only as intended;
- Fetch and XHR hooks are installed;
- `Promise.prototype.then` remains unchanged;
- `Map.prototype.has` remains unchanged;
- observer remains scoped to the watch/page area;
- normal playback never triggers `loadVideoById()` recovery;
- stale hidden anti-adblock DOM nodes are ignored;
- playlist SPA navigation does not trigger false recovery;
- video ID updates cleanly on playlist transitions;
- visible anti-adblock UI with active media is hidden without player reload;
- genuinely blocked/inactive playback can trigger a single narrow recovery;
- first recovery marker is `lactmilli`;
- recovery request can receive `params=8AUB`;
- `lactMilliseconds` is set;
- referer can receive `#reloadxhr`;
- non-player Fetch requests remain unchanged;
- server-contract recovery runs only after the navigation protection window;
- SSAP ad handling is targeted and deduplicated.

The reporter then confirmed in the real Brave browser that v6 works for both normal videos and playlists.

## Environment notes

- OS: Windows 11 24H2 (previously captured build 26100.9168)
- Brave stable, Chromium-based, x64
- Earlier captured Brave version before a later update: 1.93.129 / Chromium 151.0.7922.71
- Exact post-update Brave build should be re-captured from `brave://version` if maintainers need the current build number.

## Suggested Brave-side fix

Please consider applying the same state-safety principles to YouTube-specific Shields compatibility handling:

1. distinguish visible enforcement UI from stale hidden SPA DOM nodes;
2. do not trigger recovery during `yt-navigate-start`;
3. add a short post-navigation stabilization window;
4. scope any request interception to YouTube player endpoints only;
5. avoid broad prototype hooks that affect unrelated YouTube async code;
6. reset recovery state whenever the video ID changes;
7. if media is already playing, avoid reloading the player merely to remove stale enforcement UI.

The scriptlet is an experimental user workaround, not an official Brave component. It is published to make the exact working behavior available for review.
