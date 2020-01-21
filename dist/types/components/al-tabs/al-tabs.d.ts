import { EventEmitter } from "../../stencil.core";
declare type HTMLIonTabElement = any;
declare type HTMLIonTabsElement = any;
/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot top - Content is placed at the top of the screen.
 * @slot bottom - Content is placed at the bottom of the screen.
 */
export declare class Tabs {
    private transitioning;
    private leavingTab?;
    el: HTMLIonTabsElement;
    selectedTab?: HTMLIonTabElement;
    /**
     * Emitted when the navigation will load a component.
     * @internal
     */
    ionNavWillLoad: EventEmitter<void>;
    /**
     * Emitted when the navigation is about to transition to a new component.
     */
    ionTabsWillChange: EventEmitter<{
        tab: string;
    }>;
    /**
     * Emitted when the navigation has finished transitioning to a new component.
     */
    ionTabsDidChange: EventEmitter<{
        tab: string;
    }>;
    componentWillLoad(): Promise<void>;
    componentWillRender(): void;
    /**
     * Select a tab by the value of its `tab` property or an element reference.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    select(tab: string | HTMLIonTabElement): Promise<boolean>;
    /**
     * Get a specific tab by the value of its `tab` property or an element reference.
     *
     * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
     */
    getTab(tab: string | HTMLIonTabElement): Promise<HTMLIonTabElement | undefined>;
    /**
     * Get the currently selected tab.
     */
    getSelected(): Promise<string | undefined>;
    private setActive;
    private tabSwitch;
    private shouldSwitch;
    private readonly tabs;
    private onTabClicked;
    render(): any;
}
export {};
