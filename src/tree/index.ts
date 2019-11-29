import { reaction } from "mobx";
import {
  Disposable,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  window
} from "vscode";
import { EXTENSION_ID } from "../constants";
import { IStore } from "../store";
import { getGistLabel } from "../utils";
import {
  CreateNewGistNode,
  GistFileNode,
  GistNode,
  GistsNode,
  LoadingNode,
  NoStarredGistsNode,
  OpenGistNode,
  SignInNode,
  StarredGistNode,
  StarredGistsNode,
  TreeNode
} from "./nodes";

class GistTreeProvider implements TreeDataProvider<TreeNode>, Disposable {
  private _disposables: Disposable[] = [];

  private _onDidChangeTreeData = new EventEmitter<TreeNode>();
  public readonly onDidChangeTreeData: Event<TreeNode> = this
    ._onDidChangeTreeData.event;

  constructor(private store: IStore, private extensionPath: string) {
    reaction(
      () => [
        store.gists.map(gist => gist.description),
        store.starredGists.length,
        store.isLoading,
        store.isSignedIn
      ],
      () => {
        this._onDidChangeTreeData.fire();
      }
    );
  }

  getTreeItem(node: TreeNode): TreeItem {
    return node;
  }

  getChildren(element?: TreeNode): ProviderResult<TreeNode[]> {
    if (!element) {
      if (!this.store.isSignedIn) {
        return [new OpenGistNode(), new SignInNode()];
      } else {
        if (this.store.isLoading) {
          return [new LoadingNode()];
        } else {
          return [
            new GistsNode(this.extensionPath),
            new StarredGistsNode(this.extensionPath)
          ];
        }
      }
    } else if (element instanceof GistsNode) {
      if (this.store.gists.length === 0) {
        return [new CreateNewGistNode()];
      } else {
        return this.store.gists
          .sort((a, b) => {
            return getGistLabel(a).localeCompare(getGistLabel(b));
          })
          .map(gist => new GistNode(gist));
      }
    } else if (element instanceof StarredGistsNode) {
      if (this.store.starredGists.length === 0) {
        return [new NoStarredGistsNode()];
      } else {
        return this.store.starredGists.map(gist => new StarredGistNode(gist));
      }
    } else if (element instanceof GistNode) {
      return Object.entries(element.gist.files).map(
        ([_, file]) => new GistFileNode(element.gist.id, file.filename!)
      );
    } else if (element instanceof StarredGistNode) {
      return Object.entries(element.gist.files).map(
        ([_, file]) => new GistFileNode(element.gist.id, file.filename!)
      );
    }
  }

  dispose() {
    this._disposables.forEach(disposable => disposable.dispose());
  }
}

export function registerTreeProvider(store: IStore, extensionPath: string) {
  const treeDataProvider = new GistTreeProvider(store, extensionPath);
  window.createTreeView(`${EXTENSION_ID}.gists`, {
    showCollapseAll: true,
    treeDataProvider
  });
}