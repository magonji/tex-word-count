# Change Log

## 0.3.0

- Ignore the contents of `\begin{comment}...\end{comment}` blocks in the
  document count (they are still counted when they fall inside an explicit
  selection).
- Updated the extension icon.

## 0.2.0

- Added a character count (without spaces) alongside the word count, with a
  `texWordCount.showCharacters` setting to toggle it.
- Added selection mode: counts reflect the current selection when there is one.
- Added an extension icon.

## 0.1.0

- Initial release.
- Live LaTeX word count in the status bar, excluding commands and comments.
- Ignores mathematics and verbatim environments.
- `texWordCount.countBracedArguments` setting to include or exclude braced
  argument text.
