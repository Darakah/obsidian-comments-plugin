import { ItemView, WorkspaceLeaf, TFile, App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	SHOW_RIBBON: boolean;
	DEFAULT_COLOR: string;
	DEFAULT_BACKGROUND_COLOR: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	SHOW_RIBBON: true,
	DEFAULT_COLOR: '#b30202',
	DEFAULT_BACKGROUND_COLOR: '#FFDE5C'
}

// Create element of specified type
function element(name: string) {
    return document.createElement(name);
}

// Append node to target
function append(target: any, node: any) {
    target.appendChild(node);
}

// Set node attribute to value
function attr(node: any, attribute: string, value: string) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}

// Delay passed function for specified timeout
function debounce(func: any, wait?: any, immediate?: any) {
  var timeout: number;

  return function executedFunction() {
    var context = this;
    var args = arguments;
        
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    
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
    	var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.setAttribute('class', 'comment-panel')

        let i, z, w, x, y, j;
        // Condition if current leaf is present
        if(this.app.workspace.getActiveFile() != null)
        {
        	var text = (this.app.workspace.getActiveFile() as any).cachedData;
        	// Convert into HTML element 
        	var tmp = element("div")
        	tmp.innerHTML = text;
        	// Use HTML parser to find the desired elements
        	// Get all .ob-comment elements
        	var comment_list = tmp.querySelectorAll("label[class='ob-comment']");

        	var El = element("h3");
        	attr(El, 'class', 'comment-count');
        	append(containerEl, El);
        	El.setText('Comments: ' + comment_list.length);

	        for (i = 0; i < comment_list.length; i++) {
	            w = element("div");
	            attr(w, 'class', 'comment-pannel-bubble')

	            x = element("label");
	            y = element("p")
	            attr(y, 'class', 'comment-pannel-p1')
	            // Check if user specified a title for this comment
	            if ((comment_list[i] as any).title == ""){
	                // if no title specified, use the line number
	                y.setText('--')
	            } else {
	                // Use the given title
	                y.setText((comment_list[i] as any).title)}
	            append(x, y)

	            j = element("input")
	            attr(j, 'type', 'checkbox')
	            attr(j, 'style', 'display:none;')
	            append(x, j);

	            y = element("p")
	            attr(y, 'class', 'comment-pannel-p2')
	            y.setText(comment_list[i].innerHTML.substring(0, comment_list[i].innerHTML.length  - comment_list[i].querySelector('input[type=checkbox]+span').outerHTML.length - comment_list[i].querySelector('input[type=checkbox]').outerHTML.length - 1))
	            append(x, y)
	            append(w, x)


	            x = element("label");
	            j = element("input")
	            attr(j, 'type', 'checkbox')
	            attr(j, 'style', 'display:none;')
	            append(x, j);
	            y = element("p")
	            attr(y, 'class', 'comment-pannel-p3')
	            // Check if user specified additional style for this note
	            if ((comment_list[i] as any).style.cssText == ""){
	                // if no style was assigned, use default
	                y.innerHTML = comment_list[i].querySelector('input[type=checkbox]+span').outerHTML
	            } else {
	                // Add the new style
	                y.innerHTML = comment_list[i].querySelector('input[type=checkbox]+span').outerHTML;
	                attr(y, 'style', (comment_list[i] as any).style.cssText)
	            }
	            append(x, y)

	            append(w, x)
	            append(containerEl, w);

	        	}
	        }
        
    }, 1000);

    redraw() {
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.setAttribute('class', 'comment-panel')

        let i, z, w, x, y, j;
        // Condition if current leaf is present
        if(this.app.workspace.getActiveFile() != null)
        {
        	var text = (this.app.workspace.getActiveFile() as any).cachedData;
        	// Convert into HTML element 
        	var tmp = element("div")
        	tmp.innerHTML = text;
        	// Use HTML parser to find the desired elements
        	// Get all .ob-comment elements
        	var comment_list = tmp.querySelectorAll("label[class='ob-comment']");

        	var El = element("h3");
        	attr(El, 'class', 'comment-count');
        	append(containerEl, El);
        	El.setText('Comments: ' + comment_list.length);

	        for (i = 0; i < comment_list.length; i++) {
	            w = element("div");
	            attr(w, 'class', 'comment-pannel-bubble')

	            x = element("label");
	            y = element("p")
	            attr(y, 'class', 'comment-pannel-p1')
	            // Check if user specified a title for this comment
	            if ((comment_list[i] as any).title == ""){
	                // if no title specified, use the line number
	                y.setText('--')
	            } else {
	                // Use the given title
	                y.setText((comment_list[i] as any).title)}
	            append(x, y)

	            j = element("input")
	            attr(j, 'type', 'checkbox')
	            attr(j, 'style', 'display:none;')
	            append(x, j);

	            y = element("p")
	            attr(y, 'class', 'comment-pannel-p2')
	            y.setText(comment_list[i].innerHTML.substring(0, comment_list[i].innerHTML.length  - comment_list[i].querySelector('input[type=checkbox]+span').outerHTML.length - comment_list[i].querySelector('input[type=checkbox]').outerHTML.length - 1))
	            append(x, y)
	            append(w, x)


	            x = element("label");
	            j = element("input")
	            attr(j, 'type', 'checkbox')
	            attr(j, 'style', 'display:none;')
	            append(x, j);
	            y = element("p")
	            attr(y, 'class', 'comment-pannel-p3')
	            // Check if user specified additional style for this note
	            if ((comment_list[i] as any).style.cssText == ""){
	                // if no style was assigned, use default
	                y.innerHTML = comment_list[i].querySelector('input[type=checkbox]+span').outerHTML
	            } else {
	                // Add the new style
	                y.innerHTML = comment_list[i].querySelector('input[type=checkbox]+span').outerHTML;
	                attr(y, 'style', (comment_list[i] as any).style.cssText)
	            }
	            append(x, y)

	            append(w, x)
	            append(containerEl, w);

	        	}
	        }
    }
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		var _this = this;
        // Load message
        await this.loadSettings();
        console.log('Loaded Comments Plugin');

        this.addSettingTab(new SampleSettingTab(this.app, this));

        this.registerView(VIEW_TYPE_OB_COMMENTS, (leaf) => (this as any).view = new CommentsView(leaf));
        this.addCommand({
            id: "show-comments-panel",
            name: "Open Comments Panel",
            callback: () => (this as any).showPanel()
        });

        if(this.settings.SHOW_RIBBON){
        	this.addRibbonIcon('lines-of-text', "Show Comments Panel", (e) => (this as any).showPanel());
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
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
