// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { remark } from 'remark';
import { admonitions } from 'remark-admonitions';
import * as html from 'remark-html';
import * as vscode from 'vscode';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {
	console.log('Démarrage !');

	// commandId
	const SIDE_PREVIEW_COMMAND = 'remark.sidePreview';

	const disposableSidePreview = vscode.commands.registerCommand(SIDE_PREVIEW_COMMAND, async () => {
			initMarkdownPreview(context);
	});

	context.subscriptions.push(disposableSidePreview);
}

async function initMarkdownPreview(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
			// Webview id
			'liveHTMLPreviewer',
			// Webview title
			'[Preview]',
			// This will open the second column for preview inside editor
			2,
			{
					// Enable scripts in the webview
					enableScripts: true,
					retainContextWhenHidden: true,
					// And restrict the webview to only loading content from our extension's `assets` directory.
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
			}
	);
	console.log("ICI : " + JSON.stringify(vscode.window.activeTextEditor?.document.getText()));

	await editFile("Contenu");
	

	/*
	// Contenu du fichier
	let bpFileContent : string = vscode.window.activeTextEditor?.document.getText();

	// Affichage du contenu
	panel.webview.html = vscode.window.activeTextEditor?.document.getText() ?? "RIEN";
	*/
}

/**
 * Permet d'assigner le contenu du fichier actif
 * @param content Contenu a mettre dans le fichier
 */
async function editFile(content : string) {
	let lineCount: number = vscode.window.activeTextEditor?.document.lineCount ?? 0;
	const edit = new vscode.WorkspaceEdit();
	edit.replace(vscode.window.activeTextEditor?.document.uri!, new vscode.Range(0, 0, lineCount, 0), content);
	let success = await vscode.workspace.applyEdit(edit);
	await vscode.workspace.saveAll();
}

function bluePrintHtml() : string {
	return ``;
}

function markdownCompiler() {
	const admonitionsOptions = {};
	return remark()
			.use(html, [])
			.use(admonitions, admonitionsOptions);
}

// This method is called when your extension is deactivated
export function deactivate() {}
