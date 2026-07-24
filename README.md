# TeX Word Count

A small Visual Studio Code extension that counts the words in a LaTeX
document and shows the total in the status bar. LaTeX commands and comments
are excluded from the count, so the number reflects the prose you have
actually written.

## Features

- Live word **and character** count for `.tex` files, shown in the status bar.
- **Selection mode**: when you select text, the counts update to reflect only
  the selection (shown with a `(selection)` label). Multiple selections are
  supported.
- Ignores LaTeX commands (`\section`, `\textbf`, …) and their optional
  arguments.
- Ignores comments (anything after an unescaped `%`).
- Ignores mathematics (`$…$`, `$$…$$`, `\[…\]`, `\(…\)`) and verbatim
  environments.
- Ignores the contents of `\begin{comment}...\end{comment}` blocks in the
  document count. (They are still counted if they fall inside a selection.)
- Counts the text inside command braces (for example the title in
  `\section{Introduction}`). This can be turned off.
- Click the status bar item, or run **TeX Word Count: Show Word Count** from
  the Command Palette, to see the counts in a notification.

The character count excludes spaces (a "characters without spaces" figure) and,
like the word count, ignores commands and comments.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `texWordCount.countBracedArguments` | `true` | Count the text inside command braces, such as `\section{...}`. |
| `texWordCount.showCharacters` | `true` | Also show a character count alongside the word count. |

## Requirements

The status bar item appears for documents whose language is set to `latex`.
VS Code recognises `.tex` files as LaTeX automatically; installing a LaTeX
extension such as **LaTeX Workshop** is recommended but not required.

## Development

```bash
npm test        # run the word-counting unit tests
```

Press `F5` in VS Code to launch an Extension Development Host and try the
extension against a real `.tex` file.

## License

MIT
