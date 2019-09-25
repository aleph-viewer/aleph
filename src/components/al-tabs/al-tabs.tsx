import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  State
} from "@stencil/core";

// tslint:disable-next-line: no-any
type HTMLIonTabElement = any;
// tslint:disable-next-line: no-any
type HTMLIonTabsElement = any;
// tslint:disable-next-line: no-any
type TabButtonClickEventDetail = any;

/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot top - Content is placed at the top of the screen.
 * @slot bottom - Content is placed at the bottom of the screen.
 */
@Component({
  tag: "al-tabs",
  styleUrl: "al-tabs.css",
  shadow: true
})
export class Tabs {
  private transitioning = false;
  private leavingTab?: HTMLIonTabElement;

  @Element() public el!: HTMLIonTabsElement;

  @State() public selectedTab?: HTMLIonTabElement;

  /**
   * Emitted when the navigation will load a component.
   * @internal
   */
  @Event() public ionNavWillLoad!: EventEmitter<void>;

  /**
   * Emitted when the navigation is about to transition to a new component.
   */
  @Event({ bubbles: false }) public ionTabsWillChange!: EventEmitter<{
    tab: string;
  }>;

  /**
   * Emitted when the navigation has finished transitioning to a new component.
   */
  @Event({ bubbles: false }) public ionTabsDidChange!: EventEmitter<{
    tab: string;
  }>;

  public async componentWillLoad() {
    const tabs = this.tabs;
    await this.select(tabs[0]);
    this.ionNavWillLoad.emit();
  }

  public componentWillRender() {
    const tabBar = this.el.querySelector("ion-tab-bar");
    if (tabBar) {
      const tab = this.selectedTab ? this.selectedTab.tab : undefined;
      tabBar.selectedTab = tab;
    }
  }

  /**
   * Select a tab by the value of its `tab` property or an element reference.
   *
   * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
   */
  @Method()
  public async select(tab: string | HTMLIonTabElement): Promise<boolean> {
    const selectedTab = await this.getTab(tab);

    if (selectedTab) {
      if (!this.shouldSwitch(selectedTab)) {
        return false;
      }
      this.setActive(selectedTab);
      this.tabSwitch();

      return true;
    }

    return false;
  }

  /**
   * Get a specific tab by the value of its `tab` property or an element reference.
   *
   * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
   */
  @Method()
  public async getTab(
    tab: string | HTMLIonTabElement
  ): Promise<HTMLIonTabElement | undefined> {
    const tabEl =
      typeof tab === "string" ? this.tabs.find(t => t.tab === tab) : tab;

    return tabEl;
  }

  /**
   * Get the currently selected tab.
   */
  @Method()
  public getSelected(): Promise<string | undefined> {
    return Promise.resolve(this.selectedTab ? this.selectedTab.tab : undefined);
  }

  private setActive(selectedTab: HTMLIonTabElement) {
    if (this.transitioning) {
      return Promise.reject("transitioning already happening");
    }

    this.transitioning = true;
    this.leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;
    this.ionTabsWillChange.emit({ tab: selectedTab.tab });
    try {
      selectedTab.setActive();
    } catch (e) {
      // do nothing
    }

    return true;
  }

  private tabSwitch() {
    const selectedTab = this.selectedTab;
    const leavingTab = this.leavingTab;

    this.leavingTab = undefined;
    this.transitioning = false;
    if (!selectedTab) {
      return;
    }

    if (leavingTab !== selectedTab) {
      if (leavingTab) {
        leavingTab.active = false;
      }
      this.ionTabsDidChange.emit({ tab: selectedTab.tab });
    }
  }

  private shouldSwitch(
    selectedTab: HTMLIonTabElement | undefined
  ): selectedTab is HTMLIonTabElement {
    const leavingTab = this.selectedTab;
    return (
      selectedTab !== undefined &&
      selectedTab !== leavingTab &&
      !this.transitioning
    );
  }

  private get tabs(): any[] {
    return Array.from(this.el.querySelectorAll("ion-tab"));
  }

  private onTabClicked = (ev: CustomEvent<TabButtonClickEventDetail>) => {
    const { tab } = ev.detail;
    this.select(tab);
  };

  public render() {
    return (
      <Host onIonTabButtonClick={this.onTabClicked}>
        <slot name="top"></slot>
        <div class="tabs-inner">
          <slot></slot>
        </div>
        <slot name="bottom"></slot>
      </Host>
    );
  }
}
