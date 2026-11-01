# Excalidraw

Excalidraw runs inside its own desktop window. Use its main menu to open drawings from My files;
use Files to upload `.excalidraw` files from a computer. Save writes to My
files on the device and then syncs with the account server. The main menu has
Save drawing, Save drawing as, and folder-selection actions. Existing files require confirmation,
and version conflicts are reported without silently overwriting another copy.
Only one account-file or folder choice can be active in a window. Other file
actions cannot start until that choice finishes; cancelling leaves the destination
unchanged. Closing the window invalidates a pending choice.
The editor's main menu keeps canvas search, reset, background, theme and help.
The standard image picker is replaced by **Insert image from My files**; upload
computer files through Files first. A saved drawing is associated with its
window so the desktop can restore it after signing in again.

A failed open leaves the current drawing intact. The app validates the outer
file structure before loading; this does not guarantee every possible drawing
or embedded image is compatible. Local and live viewport tests cover basic
shape editing and save/reopen, not every Excalidraw feature or a physical phone.
Embedded third-party services and AI features remain disabled.

Opening a drawing whose visible image refers to missing embedded data is
refused before the existing scene is replaced. Deleted image elements do not
need their old data. Local desktop and emulated-phone account tests cover the
refusal, retaining a prior shape, embedded PNG save and server sync/reopen;
they do not validate every image encoding or physical touch.

Changing the saved canvas background or grid settings marks the drawing as
unsaved; panning and zooming do not. Save the drawing to retain those settings.

Install the pinned app dependencies with `npm ci --ignore-scripts` before
building. Runtime bundles and `node_modules` are generated, not source files.

Saving captures the destination and drawing snapshot before waiting for storage. Later edits remain unsaved. A separate notice reports mirror-detected changes, conflicts or unavailability while the current drawing stays open; resolve conflicts in Files or save a copy. Overwrite checks use metadata. Local desktop, emulated-phone and 4K and live emulated-phone account tests cover two drawings, delayed saves, conflicts, sync and fresh-session recovery. A separate unit check detects embedded image data changes even when their lengths match; broader embedded-image workflows remain unverified.

Use **Insert image from My files** for PNG, JPEG or WebP images already in the
account drive; upload from the computer in Files first. The image is embedded
in the `.excalidraw` document, so the saved drawing does not depend on the
original image remaining in My files. Image data expands when embedded; the
entire drawing must fit the 128 MiB file limit and large images can require
substantial browser memory. The app checks the image signature and asks the
browser to decode it before adding it. Animated PNG and WebP are rejected on
insertion because PNG/SVG exports are static; choose a still image instead.
The animation check inspects container headers and is not a complete image
integrity check. Previously saved drawings are not revalidated for animation.
Local registered-account desktop and emulated-phone tests cover both animated
formats, invalid and corrupt images, still PNG insertion and export, server
sync, fresh-session reopening and separate-account isolation. Physical touch
and other image variants remain unverified. Opened drawings are brought into view
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

**Export PNG** in the main menu creates a separate image in My files; choose its
filename in the prompt or select a PNG folder from the menu. The PNG is a snapshot, not an editable drawing, so keep the
`.excalidraw` file too. Export is rendered locally, with the longest dimension
bounded to 4096 pixels. Replacing an existing image asks for confirmation;
changes made during export remain in the drawing and are not included in the
earlier PNG. Local desktop, emulated-phone and 4K and live emulated-phone
account tests cover a delayed export, overwrite cancellation, project sync and
opening the result in Image Editor. A separate local and live phone-sized test
checks that an inserted image appears in the exported PNG. Large or complex
scenes and physical touch remain unverified.

The local shortcut candidate uses Ctrl/Command+S for My files save and
Ctrl/Command+Shift+S for the themed Save As prompt when the drawing is focused.
It ignores other windows, dialogs and active input-method composition, and
removes its listener on close. Real drawing, account sync and saved content were
tested in a browser; physical macOS and phone behavior remain unverified.

An invalid directly opened drawing reports the error and starts an independent
Untitled canvas without changing the original. Local desktop and emulated-phone
account tests cover editing and syncing that fallback; physical touch is unverified.

Closing while a drawing save or PNG export is in progress asks for confirmation,
including when the drawing was clean at the start. Declining close lets the
operation continue. Local desktop and emulated-phone tests cover the prompts,
save completion, and PNG signature; physical touch is not verified. Closing
cannot guarantee cancellation of a file write already dispatched to storage.

The upstream shape-library interface is temporarily disabled because its local
import/export is not connected to My files and its public browsing/publishing
uses Excalidraw's service. Deferred features: reusable personal shapes with
account-backed storage; library file import and export through My files; and
public library browsing and publishing if a future integration is approved.
Drawings, local image insertion and PNG export remain available. Local desktop
and emulated-phone checks exercise the context menu and library shortcut, save
a drawing to My files, and record no third-party requests during those flows.
The controls are suppressed in the embedded UI; this is not a network security
boundary. Physical touch and every upstream feature are not covered.

If a saved drawing is temporarily unavailable while restoring a window, the
original remains associated with the window and **Retry saved drawing** appears
in its My files menu. Retrying asks before discarding unsaved scratch edits. A
scratch drawing saves separately, including when the original is named
`Untitled.excalidraw`; saving a new drawing clears the restore target. Local
registered-account desktop and emulated-phone tests injected a read failure,
drew a rectangle, cancelled retry, synced the separate scratch copy, verified
the original server bytes and retried the original. Invalid drawing handling
was tested separately. Physical touch and other storage failure modes remain
unverified.

PNG export suggests a filename next to the saved drawing (for example,
`/Projects/Lab.excalidraw` suggests `/Projects/Lab.png`). Saving or opening a
new drawing updates that suggestion until you choose a different PNG name or
folder; an explicitly chosen export destination stays in that window. Local
registered-account desktop and emulated-phone tests covered drawing, saving,
PNG export and server sync, a custom destination, and fresh-session reopen.
Physical touch remains unverified.

For a first exercise, choose **Try a flow diagram** from the main menu. The
example opens as an unsaved, editable drawing with its own suggested filename;
move or add shapes, save it in My files, and export a PNG if desired. Opening
the example asks before discarding unsaved drawing work and keeps a saved
original separate. Local registered-account desktop and emulated-phone tests
covered editing, cancel, save, sync, fresh-session reopen, PNG export and close.
The tests used mouse automation at phone dimensions; physical touch is unverified.

**Export SVG** in the native menu writes a separate vector image to My files;
it suggests a name alongside the saved drawing and lets you choose another
folder or filename. Keep the editable `.excalidraw` drawing too. Existing SVGs
require confirmation before replacement and an export captures a snapshot;
changes made while it is being created remain unsaved in the drawing. Local
registered-account desktop and emulated-phone tests drew a rectangle, exported
valid SVG, cancelled a replacement, synced it, opened the vector in SVG Editor
and reopened the drawing in a fresh browser session. The existing PNG workflow
also passed both sizes. Complex scenes, embedded images and fonts in SVG export,
SVG Editor round-trip fidelity, and physical touch remain unverified.

The native menu's **Export background** switch controls both PNG and SVG
exports for this window. It starts On, preserving the drawing background; turn it
Off for transparent exported artwork. This affects the exported copy, not the
editable drawing's canvas background. Local registered-account desktop and
emulated-phone tests checked PNG corner alpha, SVG background presence, server
sync and fresh-session drawing reopen. Complex scenes and physical touch remain
unverified.

Before replacing the current drawing, the editor now checks that each
referenced embedded image can be decoded. A corrupt embedded image is refused
and the original file and current scene are kept. Local registered-account
desktop and phone-sized tests covered corrupt-image refusal, retained canvas,
account sync and a valid embedded-image drawing reopen. A separate workflow
saved a drawing containing a real PNG, exported PNG and SVG, opened the PNG in
Image Editor, resized and saved it, and checked colored pixels and server sync.
This does not establish every image format, huge-image memory behavior, complex
SVG fidelity or physical touch.

Embedded images are checked before the browser decodes them: a single image is
limited to 40 megapixels, drawings to 80 megapixels total across 256 unique
images. PNG, JPEG, WebP, GIF and simple SVG dimensions are checked; GIF frame
sizes count towards the image limit; animated PNG and WebP are refused.
SVGs containing embedded images or foreign
content, unusually complex SVG dimensions and unrecognized image formats cannot
currently be safely checked and are refused, leaving the drawing unchanged.
JPEG headers must fit within the first MiB, GIF data must fit within 24 MiB of
encoded input, and SVG source within one MiB. These limits reduce bitmap memory
risk; complex SVG rendering and browser decoder memory use are not fully bounded.

The bundled editor silently drops element types it cannot restore, including
transient `selection` records. Opening such a drawing is now refused before
the current canvas or original file is changed, rather than allowing a later
Save to overwrite it with missing elements. The known legacy `draw` type remains
supported and is migrated by Excalidraw to `line`. Local registered-account
desktop and emulated-phone tests cover refused future/selection types, original
preservation, editing and syncing a separate drawing, fresh-session reopening,
and legacy migration. This check does not guarantee preservation of every
future field or element semantic; physical touch remains unverified.

**Insert image from My files** also accepts simple, static SVG artwork. It is
embedded as an image, so edit its individual shapes in SVG Editor and reinsert
it if needed. To keep insertion bounded and self-contained, SVGs over 1 MiB,
oversized dimensions, embedded images, scripts, animation, `<use>`, linked
styles or nonlocal references are refused. Some otherwise valid SVGs therefore
need simplification before insertion. Local registered-account desktop and
emulated-phone tests saved an SVG Editor example, inserted it, exported a PNG,
checked colored pixels and server sync, and reopened the drawing with the image
visible. Tests also rejected oversized, animated and linked SVGs, including marker,
cursor and escaped CSS URL attributes, without changing the drawing. These
checks are not a comprehensive SVG security audit. Complex SVG effects, all
possible input encodings and
physical touch remain unverified.
