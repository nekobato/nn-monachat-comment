import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('nn-monachat-comment')
export class NNMonachatComment extends LitElement {
  @property({ type: String }) from: string = '';
  @property({ type: Number }) to: number = 0;
  @state() rootPosition?: { x: number; y: number } = { x: 0, y: 0 };
  @state() rise: number = 0;

  updated(props: Map<string, any>) {
    if (props.has('from')) {
      const rootElement = document.querySelector(this.from) as HTMLElement;
      if (rootElement) {
        this.rootPosition = {
          x: rootElement.offsetLeft,
          y: rootElement.offsetTop,
        };
      }
    }
  }

  firstUpdated() {
    this.increaseRise();
  }

  protected increaseRise() {
    this.rise += 1;
    if (this.rise === this.to) {
      this.dispatchEvent(new Event('ended'));
      return;
    }
    (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(
      this.increaseRise.bind(this)
    );
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    const style = `transform: translateY(-${this.rise}px);`;
    return html`
      <style>
        :host {
          position: fixed;
          top: ${this.rootPosition ? this.rootPosition.y : 0}px;
          left: ${this.rootPosition ? this.rootPosition.x : 0}px;
          display: inline-flex;
        }
        .container {
          position: relative;
          left: -50%;
          top: -52px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 21px;
          padding: 6px 16px;
          background: #fff;
          border: 1px solid #888;
          border-radius: 50%;
          font-size: 14px;
          font-weight: normal;
          animation: appearance 0.1s cubic-bezier(0.65, 0.05, 0.36, 1) 0s 1
            running;
        }
        .container:before {
          border: solid transparent;
          content: '';
          height: 0;
          width: 0;
          pointer-events: none;
          position: absolute;
          border-color: rgba(0, 153, 255, 0);
          border-top-width: 16px;
          border-bottom-width: 16px;
          border-left-width: 4px;
          border-right-width: 4px;
          margin-left: -4px;
          border-top-color: #888;
          top: 34px;
          left: 50%;
        }
        .container:after {
          border: solid transparent;
          content: '';
          height: 0;
          width: 0;
          pointer-events: none;
          position: absolute;
          border-top-width: 12px;
          border-bottom-width: 12px;
          border-left-width: 3px;
          border-right-width: 3px;
          margin-left: -3px;
          border-top-color: #fff;
          top: 33px;
          left: 50%;
        }

        @keyframes appearance {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      </style>
      <div id="container" class="container" tabindex="0" style=${style}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nn-monachat-comment': NNMonachatComment;
  }
}
