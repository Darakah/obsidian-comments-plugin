import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_OB_COMMENTS } from './constants'
import { debounce } from './utils'

export class CommentsView extends ItemView {

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

    redraw_debounced = debounce(function () {
        this.redraw();
    }, 1000);

    async redraw() {
        let active_leaf = this.app.workspace.getActiveFile();
        this.containerEl.empty();
        this.containerEl.setAttribute('class', 'comment-panel')

        // Condition if current leaf is present
        if (active_leaf) {
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
                if (!comment_list[i].title || comment_list[i].title === "") {
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
                pEl.setText(comment_list[i].innerHTML.substring(0, comment_list[i].innerHTML.length - comment_list[i].querySelector('input[type=checkbox]+span').outerHTML.length - comment_list[i].querySelector('input[type=checkbox]').outerHTML.length - 1))
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
                if (!comment_list[i].style.cssText) {
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