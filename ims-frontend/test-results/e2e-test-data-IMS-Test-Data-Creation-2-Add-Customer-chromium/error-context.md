# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-test-data.spec.ts >> IMS Test Data Creation >> 2. Add Customer
- Location: e2e-test-data.spec.ts:33:3

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Test ended.
```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> /etc/profiles/per-user/ivan/bin/google-chrome-stable --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-x2Hh0X --remote-debugging-pipe --no-startup-window
<launched> pid=42143
[pid=42143][err] [42143:42143:0524/185024.523000:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.Properties.GetAll: object_path= /org/freedesktop/UPower/devices/DisplayDevice: org.freedesktop.DBus.Error.ServiceUnknown: The name org.freedesktop.UPower was not provided by any .service files
[pid=42143][err] MESA-INTEL: warning: Ivy Bridge Vulkan support is incomplete
[pid=42143][err] [42186:42186:0524/185024.617137:ERROR:media/gpu/vaapi/vaapi_wrapper.cc:1628] vaInitialize failed: unknown libva error
[pid=42143][err] [42143:42143:0524/185028.241376:ERROR:ui/ozone/platform/wayland/host/wayland_wp_image_description.cc:219] Incomplete image description info from compositor.
[pid=42143][err] [42143:42143:0524/185028.599802:ERROR:ui/ozone/platform/wayland/host/wayland_wp_image_description.cc:219] Incomplete image description info from compositor.
[pid=42143] <gracefully close start>
```