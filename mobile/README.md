# promptdojo-mobile

native ios + android shell for promptdojo. wraps the next.js static export
(`../out/`) in capacitor 7. pyodide ships bundled offline — zero remote js
loads on launch.

the web app stays online as a free-preview funnel. the app is the paid product.

---

## prerequisites

before you can build anything:

- **macOS** (required for ios — xcode is mac-only)
- **xcode 15+** — install from the mac app store, then run `xcode-select --install`
  and `sudo xcodebuild -license accept`
- **android studio hedgehog (2023.1.1) or newer** — install jdk 17 from inside
  android studio's sdk manager. set `ANDROID_HOME` in your shell rc.
- **cocoapods** — `sudo gem install cocoapods` (apple silicon: `arch -x86_64 sudo gem install cocoapods`)
- **node 20+** and **pnpm 9+**
- **apple developer account** ($99/yr) — required to install on real devices,
  testflight, or app store submission. enroll early: it takes 1-3 weeks for
  paid-apps agreement + tax forms to clear.
- **google play console account** ($25 one-time) — required for play store submission.
- **revenuecat account** (free tier fine for launch) — for in-app purchase entitlement.

---

## install

```bash
cd /Users/joshernst/Developer/code-killa/mobile
pnpm install
```

then add the native platforms. **this only happens once** — both `ios/` and
`android/` directories get committed to the repo afterward:

```bash
# build the web app first so cap has something to point at
pnpm build:web

# add platforms — generates ios/ and android/ directories
npx cap add ios
npx cap add android

# install ios pods
cd ios/App && pod install && cd ../..
```

create three sandbox iap accounts in app store connect → users and access →
sandbox testers. needed for testing the paywall without real charges.

---

## first run

```bash
# build the web bundle and sync it into the native shells
pnpm sync

# launch ios simulator
pnpm ios

# launch android emulator
pnpm android
```

expected on first launch:
1. splash screen renders (ink-950 background, no flash of white)
2. homepage loads from the bundled `out/index.html`
3. tap into a chapter → pyodide boots in 4-8s
4. `print("hi")` in any read step renders `hi`

if pyodide hangs at "booting python…" the webview probably hit a network
fetch — confirm `public/pyodide/` shipped inside the bundle.

---

## daily dev loop

```bash
# edit web app code in ../ as usual
# when you want to see changes on device:
pnpm sync     # builds the web app + copies into both native shells

# then either:
pnpm ios      # rebuild + launch in simulator
pnpm android  # rebuild + launch in emulator

# or open the native ide for signing / capabilities / native debugging:
pnpm open:ios
pnpm open:android
```

for tight js-only iteration, set a `server.url` block in `capacitor.config.ts`
pointing at `http://<your-lan-ip>:3000`, run `pnpm -C .. dev`, then `pnpm sync:only`.
**remove that block before any production build** — apple §4.7 will reject if
the app loads js from the network on launch.

---

## release — ios

1. open the project in xcode: `pnpm open:ios`
2. select the `App` scheme, target `Any iOS Device (arm64)`
3. xcode → product → archive
4. distribute app → app store connect → upload
5. wait ~15 min for processing → testflight tab shows the build
6. submit for app review. include this note verbatim:

   > promptdojo includes pyodide, an open-source cpython 3.12 runtime compiled
   > to webassembly. all python code entered by users runs in-process within
   > the bundled webassembly interpreter inside wkwebview. no code is
   > downloaded at runtime. this pattern matches existing approved apps:
   > pythonista, pyto, carnets, swift playgrounds. the pyodide bundle ships
   > in the app binary; lesson content is json metadata, not executable code.

review takes 1-3 days typical. budget 5-7 for first submission.

### iap subscription disclosure (required by §3.1.2)

near every iap cta, the visible copy must include term + price + auto-renew language:

> "$9.99/mo. auto-renews until canceled. cancel anytime in settings."

failing to include this verbatim is the #1 §3.1.2 rejection cause.

---

## release — android

1. open in android studio: `pnpm open:android`
2. build → generate signed bundle / apk → android app bundle (`.aab`)
3. first time only: create a keystore. store it OUTSIDE the repo at
   `~/.android/promptdojo-release.keystore`. **back this file up immediately —
   if you lose it you cannot ship updates to existing installs, ever.**
4. upload the `.aab` to play console → release → production → create new release
5. fill in store listing, content rating (4+, educational), data safety form,
   target audience (13+ to keep coppa simple)
6. submit. review takes 1-7 days.

---

## troubleshooting

### xcode "no account for team xxxxxxx"
xcode → settings → accounts → add your apple id. assign your team in the
target's signing & capabilities tab.

### "couldn't find provisioning profile"
in target → signing & capabilities, toggle "automatically manage signing".
xcode will generate a profile against the bundle id `dev.promptdojo.app`.
your apple developer enrollment must be active.

### keystore location
`~/.android/promptdojo-release.keystore`. password lives in 1password under
"promptdojo android keystore". **never** commit the keystore to git
(`.gitignore` already excludes `*.keystore`).

### play console "you uploaded a debuggable apk"
in `android/app/build.gradle` confirm `debuggable false` in the `release` block.
clean + rebuild + re-upload.

### play console "expected sdk 34+, got 33"
in `android/variables.gradle` bump `targetSdkVersion` to the current play
requirement and re-sync.

### "cap: command not found"
`pnpm install` inside `mobile/`, then use `npx cap ...` or `pnpm cap ...` —
the cli is local-only, not global.

### pyodide loads forever
1. confirm the `out/pyodide/` directory exists in the next.js build output
2. confirm `pnpm sync` was run after the latest `pnpm build:web`
3. open safari → develop → simulator → inspect the webview console for the
   real failure (404 on `pyodide.asm.wasm`, MIME type mismatch, etc.)

### android emulator: "this app requires google play services"
in android studio avd manager, recreate the emulator with a system image that
includes google apis (the row with the play icon, not the bare aosp row).

### universal links don't fire in simulator
this is a known apple limitation. test on a real device via testflight.
`apple-app-site-association` must be served at `/.well-known/` with
`application/json` content-type — cloudflare pages needs a `_headers` rule.
