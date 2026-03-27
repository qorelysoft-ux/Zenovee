# Zenovee Chrome Extension

This is the Zenovee Chrome Extension (Manifest v3).

## What it does
- Lets users login with their Zenovee account
- Shows their category entitlements (access) from the Zenovee API
- Provides quick-access links to premium tools
- Adds a right-click context menu to open selected text in Zenovee Tools

## Build (developer)
```bash
npm -w @zenovee/extension run build
```

Output is written to:
`apps/extension/dist`

## Chrome Web Store packaging
Chrome Web Store requires a **zip** file of the built extension.

1) Build
2) Zip the contents of `apps/extension/dist`

## Current browser helper features

- popup login/logout
- entitlement visibility
- premium quick-launch buttons
- open dashboard/tools/pricing quickly
- context-menu action for highlighted text
- search selected text directly into the Zenovee tools directory
- manual popup search box for matching tools
- marketing-specific search shortcut from the popup

## Required assets for the store
You must provide images:
- Icon: 16x16, 48x48, 128x128 (PNG)
- At least 1 screenshot (recommended: 1280x800)
- (Optional) Promotional tile images
