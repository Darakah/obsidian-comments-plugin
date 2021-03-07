
# Obsidian Comments Plugin
![GitHub release)](https://img.shields.io/github/v/release/Darakah/obsidian-comments-plugin)
![GitHub all releases](https://img.shields.io/github/downloads/Darakah/obsidian-comments-plugin/total)

**_Brief Description:_** PDF comments for obsidian notes

**_Detailed Description:_**
1. Command that adds a comment syntax for the selected text (in edit mode)
2. Selected text will be highlighted with a certain text color & background color in preview mode
3. Clicking the highlighted text in preview mode will reveal a pop-up containing the comment related to it
4. A side panel that lists all comments for the current active note

## Usage
### Insert a comment:
----

1. Select the text that you want to add a comment to
2. cmd/ctrl + p -> 'add comment' command -> enter
3. the selected text will be replaced with the following:
```<label class="ob-comment" title="..." style="..."> SELECTED TEXT <input type="checkbox"> <span> COMMENT </span></label>```
- binding the add comment to a hotkey (settings -> hotkeys) can make its usage faster e.g. cmd/ctrl + C

### Example
----

![example](https://raw.githubusercontent.com/Darakah/obsidian-comments-plugin/main/images/example_2.png)

**----> Old View but still valid annotations:**

![example](https://raw.githubusercontent.com/Darakah/obsidian-comments-plugin/main/images/example_1.png)

### Comment Properties
----
1. Title (optional): Text to be shown in the side panel above the comment. If a title is not specified a default place holder will be used as the title. Possible use cases:
  - to specify the line of text where this comment appears (if you have editor mode line number active) which can be useful in very large notes as currently side panel links don't cause the page to jump to it ;(
  - Q/A -> the question can be the title and clicking it in the sidebar will reveal the highlighted text (can be used to review key ideas of the note just from the side pannel)
  - Note to remember the reason for the comment 
2. Style (optional): as shown by the example above, as it is simple html syntax style can be defined as one desires. keep in mind there are !!! **2 STYLES** !!! the one placed inside ```<label class="ob-comment" style="...">``` will specify style for the highlighted text while ```<input type="checkbox"> <span style="">``` will specify the style for the comment pop-up (this style is used the same for the side pannel. 
3. COMMENT section: as the comment is identified using ```<input type="checkbox"> <span>``` to identify the content, the actual COMMENT can include more divs / spans / HTML elements to further custimise it and it will be rendered properly in-line and in the side-panel.

### Comment Ribbon & Comment Panel:
----
#### Comment Ribbon
A ribbon is added by default, when clicked it will open the side panel comment list. The ribbon can be hidden through the plugin settings tab (NEED TO UNLOAD / RELOAD THE PLUGIN AFTER THIS OPTION IS MODIFED FOR THE CHANGE TO TAKE PLACE!!!)
#### Comment Panel
Can be opened in 2 ways:
- Clicking the comment ribbon
- Using a command `comment panel` 

### Default background color & Text color
----
As all in-line highlights / pop-ups are done using css, it can all be customized as one wishes by modifying the `style.css` in the `obsidian-comments-plugin` folder. 
to modify the default background color / text color for highlighted text:

```
.ob-comment {
  color: #8f0303;
  background-color: #CCA300;
}
```
to modify the default background color / text color for comment bubble:

```
.ob-comment span {
  background-color: #FFDE5C;
  color: #b30202;
}
```

to modify the highlight color when it is hovered over:
```
.ob-comment:hover {
  background-color: #FFDE5C;
}
```

### Settings:
----
![settings](https://raw.githubusercontent.com/Darakah/obsidian-comments-plugin/main/settings.png)

## Release Notes:


### v0.2.0
- Sticky bookmark-like display of comment pop-ups

## To-Do:
- [x] Sticky better display of comment pop-ups
- [ ] Find a way to make links work from sidepanel to jump to section of origin


## Support

[![Github Sponsorship](https://raw.githubusercontent.com/Darakah/Darakah/e0fe245eaef23cb4a5f19fe9a09a9df0c0cdc8e1/icons/github_sponsor_btn.svg)](https://github.com/sponsors/Darakah) [<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/darakah)

## Credits:
Thanks to the obsidian discord community that helped me put this together, especially the developers that put up with my questions.
