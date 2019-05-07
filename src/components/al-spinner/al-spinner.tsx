import { Component, Prop } from "@stencil/core";

@Component({
  tag: "al-spinner",
  styleUrl: "al-spinner.css",
  shadow: true
})
export class AlSpinner {
  @Prop() src: string | null;
  @Prop() srcLoaded: boolean;

  render() {
    if (this.src && !this.srcLoaded) {
      return (
        <div id="spinner">
          <div class="square" />
        </div>
      );
    }

    return null;
  }
}
