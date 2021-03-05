import { MarkdownView, View, Plugin } from 'obsidian';
import CommentsSettingTab from './settings'
import type { CommentsSettings } from './types'
import { DEFAULT_SETTINGS, VIEW_TYPE_OB_COMMENTS } from './constants'
import { CommentsView } from './view'

export default class CommentsPlugin extends Plugin {
	settings: CommentsSettings;
	view: View;

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Comments Plugin');
		this.addSettingTab(new CommentsSettingTab(this.app, this));

		this.positionComment = this.positionComment.bind(this);
		this.registerEvent(this.app.workspace.on("click", this.positionComment));

		this.registerView(VIEW_TYPE_OB_COMMENTS, (leaf) => this.view = new CommentsView(leaf));
		this.addCommand({
			id: "show-comments-panel",
			name: "Open Comments Panel",
			callback: () => this.showPanel()
		});

		this.addCommand({
			id: "add-comment",
			name: "Add Comment",
			callback: () => this.addComment()
		});

		if (this.settings.SHOW_RIBBON) {
			this.addRibbonIcon('lines-of-text', "Show Comments Panel", (e) => this.showPanel());
		}
	}

	async positionComment() {
		let ob_elements = document.querySelectorAll('.ob-comment')

		for (let el = 0; el < ob_elements.length; el++) {
			let elements = ob_elements[el].querySelector('input') as HTMLInputElement

			if (elements) {
				elements.addEventListener('change', function () {
					if (this.checked) {
						let elSpan = ob_elements[el].querySelector('span');
						if (elSpan) {
							elSpan.style.setProperty('position', 'fixed')
							elSpan.style.setProperty('top', `${Math.round(ob_elements[el].getBoundingClientRect().top)}px`)
							elSpan.style.setProperty('right', '0px')
						}
					}
				});
			}
		}
	}

	showPanel = function () {
		this.app.workspace.getRightLeaf(true)
			.setViewState({ type: VIEW_TYPE_OB_COMMENTS });
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addComment() {
		let editor = this.getEditor();
		const lines = this.getLines(editor);
		if (!lines) return;
		this.setLines(editor, ['<label class="ob-comment" title="" style=""> ' + lines + ' <input type="checkbox"> <span style=""> Comment </span></label>']);
	}

	getEditor(): CodeMirror.Editor {
		let view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		let cm = view.sourceMode.cmEditor;
		return cm;
	}

	getLines(editor: CodeMirror.Editor): string[] {
		if (!editor) return;
		const selection = editor.getSelection();
		return [selection];
	}

	setLines(editor: CodeMirror.Editor, lines: string[]) {
		const selection = editor.getSelection();
		if (selection != "") {
			editor.replaceSelection(lines.join("\n"));
		} else {
			editor.setValue(lines.join("\n"));
		}
	}
}