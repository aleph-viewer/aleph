import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State
} from "@stencil/core";

type HTMLIonTabElement = any;
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

  @Element() el!: HTMLStencilElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab?: HTMLIonTabElement;

  @Prop({ context: "document" }) doc!: Document;

  /**
   * Emitted when the navigation will load a component.
   * @internal
   */
  @Event() ionNavWillLoad!: EventEmitter<void>;

  /**
   * Emitted when the navigation is about to transition to a new component.
   */
  @Event({ bubbles: false }) ionTabsWillChange!: EventEmitter<{ tab: string }>;

  /**
   * Emitted when the navigation has finished transitioning to a new component.
   */
  @Event({ bubbles: false }) ionTabsDidChange!: EventEmitter<{ tab: string }>;

  async componentWillLoad() {
    this.tabs = Array.from(this.el.querySelectorAll("ion-tab"));
    this.ionNavWillLoad.emit();
    this.componentWillUpdate();
  }

  componentDidLoad() {
    this.initSelect();
  }

  componentDidUnload() {
    this.tabs.length = 0;
    this.selectedTab = this.leavingTab = undefined;
  }

  componentWillUpdate() {
    const tabBar: any = this.el.querySelector("ion-tab-bar");
    if (tabBar) {
      const tab = this.selectedTab ? this.selectedTab.tab : undefined;
      tabBar.selectedTab = tab;
    }
  }

  // componentDidUpdate() {
  //   this.el.style.height = this.el.parentElement.clientHeight + "px";
  // }

  @Listen("ionTabButtonClick")
  protected onTabClicked(ev: CustomEvent<TabButtonClickEventDetail>) {
    const { tab } = ev.detail;
    const selectedTab = this.tabs.find(t => t.tab === tab);
    if (selectedTab) {
      this.select(selectedTab);
    }
  }

  /**
   * Index or the Tab instance, of the tab to select.
   */
  @Method()
  async select(tab: string | HTMLIonTabElement): Promise<boolean> {
    const selectedTab = await this.getTab(tab);
    if (!this.shouldSwitch(selectedTab)) {
      return false;
    }
    await this.setActive(selectedTab);
    this.tabSwitch();

    return true;
  }

  /**
   * Get the tab element given the tab name
   */
  @Method()
  async getTab(
    tab: string | HTMLIonTabElement
  ): Promise<HTMLIonTabElement | undefined> {
    const tabEl =
      typeof tab === "string" ? this.tabs.find(t => t.tab === tab) : tab;

    if (!tabEl) {
      console.error(`tab with id: "${tabEl}" does not exist`);
    }
    return tabEl;
  }

  /**
   * Get the currently selected tab
   */
  @Method()
  getSelected(): Promise<string | undefined> {
    return Promise.resolve(this.selectedTab ? this.selectedTab.tab : undefined);
  }

  private async initSelect(): Promise<void> {
    // wait for all tabs to be ready
    await Promise.all(this.tabs.map(tab => tab.componentOnReady()));
    await this.select(this.tabs[0]);
  }

  private setActive(selectedTab: HTMLIonTabElement): Promise<void> {
    if (this.transitioning) {
      return Promise.reject("transitioning already happening");
    }

    this.transitioning = true;
    this.leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;
    this.ionTabsWillChange.emit({ tab: selectedTab.tab });
    return selectedTab.setActive();
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

  render() {
    return [
      <slot name="top" />,
      <div class="tabs-inner">
        <slot />
      </div>,
      <slot name="bottom" />
    ];
  }
}
