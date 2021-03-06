import * as vscode from "vscode";

const CONFIG_SECTION = "gistpad";

export function get(key: "treeIcons"): boolean;
export function get(key: "apiUrl"): string;
export function get(key: "gitSSO"): boolean;
export function get(key: "images.markdownPasteFormat"): "markdown" | "html";
export function get(key: "images.pasteType"): "file" | "base64";
export function get(key: "images.directoryName"): string;
export function get(key: "playgrounds.autoRun"): "onEdit" | "onSave" | "never";
export function get(key: "playgrounds.autoSave"): boolean;
export function get(
  key: "playgrounds.layout"
): "grid" | "splitLeft" | "splitRight" | "splitTop";
export function get(key: "playgrounds.includeMarkup"): boolean;
export function get(key: "playgrounds.includeScript"): boolean;
export function get(key: "playgrounds.includeStylesheet"): boolean;
export function get(key: "playgrounds.markupLanguage"): "html" | "pug";
export function get(
  key: "playgrounds.readmeBehavior"
): "none" | "previewFooter" | "previewHeader";
export function get(
  key: "playgrounds.scriptLanguage"
): "javascript" | "javascriptreact" | "typescript" | "typescriptreact";
export function get(
  key: "playgrounds.stylesheetLanguage"
): "css" | "less" | "sass" | "scss";
export function get(key: "playgrounds.showConsole"): boolean;
export function get(key: "playgrounds.templateGalleries"): string[];
export function get(key: "scratchNotes.directoryFormat"): string;
export function get(key: "scratchNotes.fileExtension"): string;
export function get(key: "scratchNotes.fileFormat"): string;
export function get(key: "scratchNotes.show"): boolean;
export function get(key: "showcaseUrl"): string;
export function get(key: "comments.showThread"): string;
export function get(key: any) {
  const extensionConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return extensionConfig.get(key);
}

export async function set(key: string, value: any) {
  const extensionConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return extensionConfig.update(key, value, true);
}
