// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var dateFormat = require('dateformat');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "timestamp-conversion" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('timestamp-conversion.conversion', runConversion(insertResult));

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

interface IEditMaker {
	(edit: vscode.TextEditorEdit, selection: vscode.Selection, result: string): void;
}


let insertResult: IEditMaker = function (edit: vscode.TextEditorEdit, selection: vscode.Selection, result: string) {
	edit.insert(selection.end, "->" + strFormat(result));
}


function runConversion(editMaker: IEditMaker) {
	return () => {
		var win = vscode.window;

		var activeTextEditor = win.activeTextEditor;

		if (activeTextEditor === undefined) {
			return false;
		}

		activeTextEditor.edit((textEditorEdit) => {
			if (activeTextEditor === undefined) {
				return false;
			}
			activeTextEditor.selections.forEach((selection, index) => {
				if (activeTextEditor === undefined) {
					return false;
				}
				var selectedText = activeTextEditor.document.getText(selection).replace(/\$i/g, String(index + 1));

				if (selectedText === "") {
					return;
				}

				try {
					var evaluatedMath = selectedText.toString();
					editMaker(textEditorEdit, selection, evaluatedMath);
				} catch (e) {
				}
			});
		});
	}
}

// 暂时就支持这两种
function strFormat(str: string) {
	if (str.includes("-")) {
		return Date.parse(new Date(str).toString())
	}
	var data: Date
	if (str.length == 10) {
		data = new Date(parseInt(str) * 1000)
	} else {
		data = new Date(parseInt(str))
	}
	return dateFormat(data, "yyyy-mm-dd HH:MM:ss")
}
