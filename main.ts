import { ItemView, MarkdownView, WorkspaceLeaf, TFile, App, View, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';

interface CommentsSettings {
	SHOW_RIBBON: boolean;
	DEFAULT_COLOR: string;
	DEFAULT_BACKGROUND_COLOR: string;
}

const DEFAULT_SETTINGS: CommentsSettings = {
	SHOW_RIBBON: true,
	DEFAULT_COLOR: '#b30202',
	DEFAULT_BACKGROUND_COLOR: '#FFDE5C'
}

// Delay passed function for specified timeout
function debounce(func: any, wait?: number, immediate?: boolean) {
  let timeout: number;

  return function executedFunction() {
	let context = this;
	let args = arguments;
		
	let later = function() {
	  timeout = null;
	  if (!immediate) func.apply(context, args);
	};
	let callNow = immediate && !timeout;
	clearTimeout(timeout);
	timeout = +setTimeout(later, wait);
	if (callNow) func.apply(context, args);
  };
};

const VIEW_TYPE_OB_COMMENTS = 'ob_comments';
class CommentsView extends ItemView {

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.redraw = this.redraw.bind(this);
		this.redraw_debounced = this.redraw_debounced.bind(this);
		this.containerEl = this.containerEl;
		this.registerEvent(this.app.workspace.on("layout-ready", this.redraw_debounced));
		this.registerEvent(this.app.workspace.on("file-open", this.redraw_debounced));
		this.registerEvent(this.app.workspace.on("quick-preview", this.redraw_debounced));
		this.registerEvent(this.app.vault.on("delete", this.redraw));
	}

	getViewType(): string {
		return VIEW_TYPE_OB_COMMENTS;
	}

	getDisplayText(): string {
		return "Comments";
	}

	getIcon(): string {
		return "lines-of-text";
	}

	onClose(): Promise<void> {
		return Promise.resolve();
	}

	async onOpen(): Promise<void> {
		this.redraw();
	}

	redraw_debounced = debounce(function() {
		this.redraw();        
	}, 1000);

	async redraw() {
		let active_leaf = this.app.workspace.getActiveFile();
		this.containerEl.empty();
		this.containerEl.setAttribute('class', 'comment-panel')
		
		// Condition if current leaf is present
		if(active_leaf){	
			let page_content = await this.app.vault.read(active_leaf); 
			// Convert into HTML element 
			let page_html = document.createElement('Div')
			page_html.innerHTML = page_content;
			// Use HTML parser to find the desired elements
			// Get all .ob-comment elements
			let comment_list = page_html.querySelectorAll<HTMLElement>("label[class='ob-comment']");

			let El = document.createElement("h3");
			El.setAttribute('class', 'comment-count')
			this.containerEl.appendChild(El);
			El.setText('Comments: ' + comment_list.length);

			for (let i = 0; i < comment_list.length; i++) {
				let div = document.createElement('Div');
				div.setAttribute('class', 'comment-pannel-bubble')

				let labelEl = document.createElement("label");
				let pEl = document.createElement("p");
				pEl.setAttribute('class', 'comment-pannel-p1')

				// Check if user specified a title for this comment
				if (!comment_list[i].title || comment_list[i].title === ""){
					// if no title specified, use the line number
					pEl.setText('--')
				} else {
					// Use the given title
					pEl.setText(comment_list[i].title)
				}
				labelEl.appendChild(pEl)

				let inputEl = document.createElement("input");
				inputEl.setAttribute('type', 'checkbox')
				inputEl.setAttribute('style', 'display:none;')
				labelEl.appendChild(inputEl)

				pEl = document.createElement("p");
				pEl.setAttribute('class', 'comment-pannel-p2')
				pEl.setText(comment_list[i].innerHTML.substring(0, comment_list[i].innerHTML.length  - comment_list[i].querySelector('input[type=checkbox]+span').outerHTML.length - comment_list[i].querySelector('input[type=checkbox]').outerHTML.length - 1))
				labelEl.appendChild(pEl)
				div.appendChild(labelEl)


				labelEl = document.createElement("label");
				inputEl = document.createElement("input");
				inputEl.setAttribute('type', 'checkbox')
				inputEl.setAttribute('style', 'display:none;')
				labelEl.appendChild(inputEl)
				pEl = document.createElement("p");
				pEl.setAttribute('class', 'comment-pannel-p3')
				// Check if user specified additional style for this note
				if (!comment_list[i].style.cssText){
					// if no style was assigned, use default
					pEl.setText(comment_list[i].querySelector('input[type=checkbox]+span').innerHTML)
				} else {
					// Add the new style
					pEl.setText(comment_list[i].querySelector('input[type=checkbox]+span').innerHTML)
					pEl.setAttribute('style', comment_list[i].style.cssText)
				}
				labelEl.appendChild(pEl)
				div.appendChild(labelEl)
				this.containerEl.appendChild(div)
				}
			}
	}
}

export default class CommentsPlugin extends Plugin {
	settings: CommentsSettings;
	view: View;

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Comments Plugin');
		this.addSettingTab(new CommentsSettingTab(this.app, this));

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

		if(this.settings.SHOW_RIBBON){
			this.addRibbonIcon('lines-of-text', "Show Comments Panel", (e) => this.showPanel());
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

class CommentsSettingTab extends PluginSettingTab {
	plugin: CommentsPlugin;

	constructor(app: App, plugin: CommentsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Comments Plugin Settings'});

		new Setting(containerEl)
			.setName('Default text color')
			.setDesc("Change from the style.css in the package folder")
			.addText(text => text
				.setPlaceholder("....")
				.setValue('')
				.onChange(async (value) => {
					this.plugin.settings.DEFAULT_COLOR = value;
				}));

		new Setting(containerEl)
			.setName('Default background color')
			.setDesc('Change from the style.css in the package folder')
			.addText(text => text
				.setPlaceholder("....")
				.setValue('')
				.onChange(async (value) => {
					this.plugin.settings.DEFAULT_BACKGROUND_COLOR = value;
				}));

		new Setting(containerEl)
			.setName('Hide Comment Plugin Ribbon')
			.setDesc('After changing this setting unload then reload the plugin for the change to take place')
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.SHOW_RIBBON);
				toggle.onChange(async (value) => {
					this.plugin.settings.SHOW_RIBBON = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
