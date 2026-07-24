'use strict';

const vscode = require('vscode');
const { analyse } = require('./wordcount');

/** @type {vscode.StatusBarItem} */
let statusBarItem;

/**
 * Returns true when the given document is a LaTeX document.
 * @param {vscode.TextDocument | undefined} document
 */
function isTexDocument(document) {
  return !!document && document.languageId === 'latex';
}

/**
 * Reads the extension's options from the workspace configuration.
 */
function getOptions() {
  const config = vscode.workspace.getConfiguration('texWordCount');
  return {
    countBracedArguments: config.get('countBracedArguments', true),
    showCharacters: config.get('showCharacters', true),
  };
}

/**
 * Returns the text to count for the active editor: the current selection when
 * one (non-empty) exists, otherwise the whole document. The boolean flags
 * whether we are in "selection mode".
 * @param {vscode.TextEditor} editor
 * @returns {{ text: string, isSelection: boolean }}
 */
function getTextToCount(editor) {
  const selections = editor.selections.filter((s) => !s.isEmpty);
  if (selections.length > 0) {
    const text = selections
      .map((s) => editor.document.getText(s))
      .join('\n');
    return { text, isSelection: true };
  }
  return { text: editor.document.getText(), isSelection: false };
}

/**
 * Recomputes the counts for the active editor and updates the status bar.
 */
function updateStatusBar() {
  const editor = vscode.window.activeTextEditor;

  if (!editor || !isTexDocument(editor.document)) {
    statusBarItem.hide();
    return;
  }

  const options = getOptions();
  const { text, isSelection } = getTextToCount(editor);
  const { words, characters } = analyse(text, options);

  const parts = [`${words} ${words === 1 ? 'word' : 'words'}`];
  if (options.showCharacters) {
    parts.push(`${characters} ${characters === 1 ? 'char' : 'chars'}`);
  }

  statusBarItem.text = `$(book) ${parts.join(', ')}${isSelection ? ' (selection)' : ''}`;
  statusBarItem.tooltip = isSelection
    ? 'LaTeX word count of the selection (commands and comments excluded)'
    : 'LaTeX word count of the document (commands and comments excluded)';
  statusBarItem.show();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'texWordCount.showCount';
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand('texWordCount.showCount', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || !isTexDocument(editor.document)) {
        vscode.window.showInformationMessage(
          'Open a LaTeX (.tex) file to see its word count.'
        );
        return;
      }
      const { text, isSelection } = getTextToCount(editor);
      const { words, characters } = analyse(text, getOptions());
      const scope = isSelection ? 'The selection' : 'This LaTeX document';
      vscode.window.showInformationMessage(
        `${scope} has ${words} ${words === 1 ? 'word' : 'words'} ` +
          `and ${characters} ${characters === 1 ? 'character' : 'characters'}.`
      );
    })
  );

  // Recompute when the editor, its selection, its contents, or the settings
  // change.
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBar),
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (event.textEditor === vscode.window.activeTextEditor) {
        updateStatusBar();
      }
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        updateStatusBar();
      }
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('texWordCount')) {
        updateStatusBar();
      }
    })
  );

  updateStatusBar();
}

function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

module.exports = { activate, deactivate };
