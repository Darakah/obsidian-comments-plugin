import { App, PluginSettingTab, Setting } from 'obsidian'
import CommentsPlugin from './main'

export default class CommentsSettingTab extends PluginSettingTab {
    plugin: CommentsPlugin;

    constructor(app: App, plugin: CommentsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Comments Plugin Settings' });

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