# Excalidraw

Excalidraw runs inside its own desktop window. Open drawings from My files;
use Files to upload `.excalidraw` files from a computer. Save writes to My
files on the device and then syncs with the account server. Expand Save
location to choose a folder or filename. Existing files require confirmation,
and version conflicts are reported without silently overwriting another copy.

A failed open leaves the current drawing intact. The app validates the outer
file structure before loading; this does not guarantee every possible drawing
or embedded image is compatible. Local and live viewport tests cover basic
shape editing and save/reopen, not every Excalidraw feature or a physical phone.
Embedded third-party services and AI features remain disabled.

Install the pinned app dependencies with `npm ci --ignore-scripts` before
building. Runtime bundles and `node_modules` are generated, not source files.

Saving captures the destination and drawing snapshot before waiting for storage. Later edits remain unsaved. A separate notice reports mirror-detected changes, conflicts or unavailability while the current drawing stays open; resolve conflicts in Files or save a copy. Overwrite checks use metadata. Local desktop, emulated-phone and 4K and live emulated-phone account tests cover two drawings, delayed saves, conflicts, sync and fresh-session recovery. A separate unit check detects embedded image data changes even when their lengths match; broader embedded-image workflows remain unverified.

Use **Insert image from My files** for PNG, JPEG or WebP images already in the
account drive; upload from the computer in Files first. The image is embedded
in the `.excalidraw` document, so the saved drawing does not depend on the
original image remaining in My files. Image data expands when embedded; the
entire drawing must fit the 128 MiB file limit and large images can require
substantial browser memory. The app checks the image signature and asks the
browser to decode it before adding it. Opened drawings are brought into view
when moving between differently sized windows. Local desktop, emulated-phone
and 4K account tests cover PNG upload, invalid-image recovery, embedded save,
original deletion and visible fresh-session reopen; JPEG and WebP round trips
were also checked locally. The PNG workflow passed live at phone size. Physical
touch, large-image performance and every supported image variant remain unverified.

While an image is being selected and decoded, file actions are disabled until
it is ready; canvas editing remains available. A delayed-decoding test covers
saving a canvas edit and the inserted image, then using the editor's Undo and
Redo buttons. The test passed locally on desktop, emulated phone and 4K, and on
the live site at emulated-phone size. Keyboard undo and physical touch have not
been established by that test.

**Export PNG** creates a separate image in My files; set its filename or folder
under Save location. The PNG is a snapshot, not an editable drawing, so keep the
`.excalidraw` file too. Export is rendered locally, with the longest dimension
bounded to 4096 pixels. Replacing an existing image asks for confirmation;
changes made during export remain in the drawing and are not included in the
earlier PNG. Local desktop, emulated-phone and 4K and live emulated-phone
account tests cover a delayed export, overwrite cancellation, project sync and
opening the result in Image Editor. A separate local and live phone-sized test
checks that an inserted image appears in the exported PNG. Large or complex
scenes and physical touch remain unverified.
