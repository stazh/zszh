import { P as Polymer, h as html, x as resolveUrl, f as IronResizableBehavior, B as Base, d as dom, b as IronButtonState, I as IronControlState, T as Templatizer, y as flush, z as PaperInkyFocusBehavior, A as DomModule, D as Debouncer, C as idlePeriod, n as enqueueDebouncer, g as get, t as translate } from './paper-checkbox-ea000977.js';
import { d as directive, N as NodePart, i as isPrimitive, p as pbMixin, L as LitElement, h as html$1, c as css$1, a as cmpVersion, r as resolveURL } from './pb-mixin-ae9e2885.js';

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
`iron-image` is an element for displaying an image that provides useful sizing and
preloading options not found on the standard `<img>` tag.

The `sizing` option allows the image to be either cropped (`cover`) or
letterboxed (`contain`) to fill a fixed user-size placed on the element.

The `preload` option prevents the browser from rendering the image until the
image is fully loaded.  In the interim, either the element's CSS `background-color`
can be be used as the placeholder, or the `placeholder` property can be
set to a URL (preferably a data-URI, for instant rendering) for an
placeholder image.

The `fade` option (only valid when `preload` is set) will cause the placeholder
image/color to be faded out once the image is rendered.

Examples:

  Basically identical to `<img src="...">` tag:

    <iron-image src="http://lorempixel.com/400/400"></iron-image>

  Will letterbox the image to fit:

    <iron-image style="width:400px; height:400px;" sizing="contain"
      src="http://lorempixel.com/600/400"></iron-image>

  Will crop the image to fit:

    <iron-image style="width:400px; height:400px;" sizing="cover"
      src="http://lorempixel.com/600/400"></iron-image>

  Will show light-gray background until the image loads:

    <iron-image style="width:400px; height:400px; background-color: lightgray;"
      sizing="cover" preload src="http://lorempixel.com/600/400"></iron-image>

  Will show a base-64 encoded placeholder image until the image loads:

    <iron-image style="width:400px; height:400px;" placeholder="data:image/gif;base64,..."
      sizing="cover" preload src="http://lorempixel.com/600/400"></iron-image>

  Will fade the light-gray background out once the image is loaded:

    <iron-image style="width:400px; height:400px; background-color: lightgray;"
      sizing="cover" preload fade src="http://lorempixel.com/600/400"></iron-image>

Custom property | Description | Default
----------------|-------------|----------
`--iron-image-placeholder` | Mixin applied to #placeholder | `{}`
`--iron-image-width` | Sets the width of the wrapped image | `auto`
`--iron-image-height` | Sets the height of the wrapped image | `auto`

@group Iron Elements
@element iron-image
@demo demo/index.html
*/

Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        overflow: hidden;
        position: relative;
      }

      #baseURIAnchor {
        display: none;
      }

      #sizedImgDiv {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;

        display: none;
      }

      #img {
        display: block;
        width: var(--iron-image-width, auto);
        height: var(--iron-image-height, auto);
      }

      :host([sizing]) #sizedImgDiv {
        display: block;
      }

      :host([sizing]) #img {
        display: none;
      }

      #placeholder {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;

        background-color: inherit;
        opacity: 1;

        @apply --iron-image-placeholder;
      }

      #placeholder.faded-out {
        transition: opacity 0.5s linear;
        opacity: 0;
      }
    </style>

    <a id="baseURIAnchor" href="#"></a>
    <div id="sizedImgDiv" role="img" hidden$="[[_computeImgDivHidden(sizing)]]" aria-hidden$="[[_computeImgDivARIAHidden(alt)]]" aria-label$="[[_computeImgDivARIALabel(alt, src)]]"></div>
    <img id="img" alt$="[[alt]]" hidden$="[[_computeImgHidden(sizing)]]" crossorigin$="[[crossorigin]]" on-load="_imgOnLoad" on-error="_imgOnError">
    <div id="placeholder" hidden$="[[_computePlaceholderHidden(preload, fade, loading, loaded)]]" class$="[[_computePlaceholderClassName(preload, fade, loading, loaded)]]"></div>
`,
  is: 'iron-image',
  properties: {
    /**
     * The URL of an image.
     */
    src: {
      type: String,
      value: ''
    },

    /**
     * A short text alternative for the image.
     */
    alt: {
      type: String,
      value: null
    },

    /**
     * CORS enabled images support:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
     */
    crossorigin: {
      type: String,
      value: null
    },

    /**
     * When true, the image is prevented from loading and any placeholder is
     * shown.  This may be useful when a binding to the src property is known to
     * be invalid, to prevent 404 requests.
     */
    preventLoad: {
      type: Boolean,
      value: false
    },

    /**
     * Sets a sizing option for the image.  Valid values are `contain` (full
     * aspect ratio of the image is contained within the element and
     * letterboxed) or `cover` (image is cropped in order to fully cover the
     * bounds of the element), or `null` (default: image takes natural size).
     */
    sizing: {
      type: String,
      value: null,
      reflectToAttribute: true
    },

    /**
     * When a sizing option is used (`cover` or `contain`), this determines
     * how the image is aligned within the element bounds.
     */
    position: {
      type: String,
      value: 'center'
    },

    /**
     * When `true`, any change to the `src` property will cause the
     * `placeholder` image to be shown until the new image has loaded.
     */
    preload: {
      type: Boolean,
      value: false
    },

    /**
     * This image will be used as a background/placeholder until the src image
     * has loaded.  Use of a data-URI for placeholder is encouraged for instant
     * rendering.
     */
    placeholder: {
      type: String,
      value: null,
      observer: '_placeholderChanged'
    },

    /**
     * When `preload` is true, setting `fade` to true will cause the image to
     * fade into place.
     */
    fade: {
      type: Boolean,
      value: false
    },

    /**
     * Read-only value that is true when the image is loaded.
     */
    loaded: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },

    /**
     * Read-only value that tracks the loading state of the image when the
     * `preload` option is used.
     */
    loading: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },

    /**
     * Read-only value that indicates that the last set `src` failed to load.
     */
    error: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },

    /**
     * Can be used to set the width of image (e.g. via binding); size may also
     * be set via CSS.
     */
    width: {
      observer: '_widthChanged',
      type: Number,
      value: null
    },

    /**
     * Can be used to set the height of image (e.g. via binding); size may also
     * be set via CSS.
     *
     * @attribute height
     * @type number
     * @default null
     */
    height: {
      observer: '_heightChanged',
      type: Number,
      value: null
    }
  },
  observers: ['_transformChanged(sizing, position)', '_loadStateObserver(src, preventLoad)'],
  created: function () {
    this._resolvedSrc = '';
  },
  _imgOnLoad: function () {
    if (this.$.img.src !== this._resolveSrc(this.src)) {
      return;
    }

    this._setLoading(false);

    this._setLoaded(true);

    this._setError(false);
  },
  _imgOnError: function () {
    if (this.$.img.src !== this._resolveSrc(this.src)) {
      return;
    }

    this.$.img.removeAttribute('src');
    this.$.sizedImgDiv.style.backgroundImage = '';

    this._setLoading(false);

    this._setLoaded(false);

    this._setError(true);
  },
  _computePlaceholderHidden: function () {
    return !this.preload || !this.fade && !this.loading && this.loaded;
  },
  _computePlaceholderClassName: function () {
    return this.preload && this.fade && !this.loading && this.loaded ? 'faded-out' : '';
  },
  _computeImgDivHidden: function () {
    return !this.sizing;
  },
  _computeImgDivARIAHidden: function () {
    return this.alt === '' ? 'true' : undefined;
  },
  _computeImgDivARIALabel: function () {
    if (this.alt !== null) {
      return this.alt;
    } // Polymer.ResolveUrl.resolveUrl will resolve '' relative to a URL x to
    // that URL x, but '' is the default for src.


    if (this.src === '') {
      return '';
    } // NOTE: Use of `URL` was removed here because IE11 doesn't support
    // constructing it. If this ends up being problematic, we should
    // consider reverting and adding the URL polyfill as a dev dependency.


    var resolved = this._resolveSrc(this.src); // Remove query parts, get file name.


    return resolved.replace(/[?|#].*/g, '').split('/').pop();
  },
  _computeImgHidden: function () {
    return !!this.sizing;
  },
  _widthChanged: function () {
    this.style.width = isNaN(this.width) ? this.width : this.width + 'px';
  },
  _heightChanged: function () {
    this.style.height = isNaN(this.height) ? this.height : this.height + 'px';
  },
  _loadStateObserver: function (src, preventLoad) {
    var newResolvedSrc = this._resolveSrc(src);

    if (newResolvedSrc === this._resolvedSrc) {
      return;
    }

    this._resolvedSrc = '';
    this.$.img.removeAttribute('src');
    this.$.sizedImgDiv.style.backgroundImage = '';

    if (src === '' || preventLoad) {
      this._setLoading(false);

      this._setLoaded(false);

      this._setError(false);
    } else {
      this._resolvedSrc = newResolvedSrc;
      this.$.img.src = this._resolvedSrc;
      this.$.sizedImgDiv.style.backgroundImage = 'url("' + this._resolvedSrc + '")';

      this._setLoading(true);

      this._setLoaded(false);

      this._setError(false);
    }
  },
  _placeholderChanged: function () {
    this.$.placeholder.style.backgroundImage = this.placeholder ? 'url("' + this.placeholder + '")' : '';
  },
  _transformChanged: function () {
    var sizedImgDivStyle = this.$.sizedImgDiv.style;
    var placeholderStyle = this.$.placeholder.style;
    sizedImgDivStyle.backgroundSize = placeholderStyle.backgroundSize = this.sizing;
    sizedImgDivStyle.backgroundPosition = placeholderStyle.backgroundPosition = this.sizing ? this.position : '';
    sizedImgDivStyle.backgroundRepeat = placeholderStyle.backgroundRepeat = this.sizing ? 'no-repeat' : '';
  },
  _resolveSrc: function (testSrc) {
    var resolved = resolveUrl(testSrc, this.$.baseURIAnchor.href); // NOTE: Use of `URL` was removed here because IE11 doesn't support
    // constructing it. If this ends up being problematic, we should
    // consider reverting and adding the URL polyfill as a dev dependency.

    if (resolved.length >= 2 && resolved[0] === '/' && resolved[1] !== '/') {
      // In IE location.origin might not work
      // https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
      resolved = (location.origin || location.protocol + '//' + location.host) + resolved;
    }

    return resolved;
  }
});

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
Material design:
[Cards](https://www.google.com/design/spec/components/cards.html)

`paper-card` is a container with a drop shadow.

Example:

    <paper-card heading="Card Title">
      <div class="card-content">Some content</div>
      <div class="card-actions">
        <paper-button>Some action</paper-button>
      </div>
    </paper-card>

Example - top card image:

    <paper-card heading="Card Title" image="/path/to/image.png" alt="image">
      ...
    </paper-card>

### Accessibility

By default, the `aria-label` will be set to the value of the `heading`
attribute.

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-card-background-color` | The background color of the card | `--primary-background-color`
`--paper-card-header-color` | The color of the header text | `#000`
`--paper-card-header` | Mixin applied to the card header section | `{}`
`--paper-card-header-text` | Mixin applied to the title in the card header section | `{}`
`--paper-card-header-image` | Mixin applied to the image in the card header section | `{}`
`--paper-card-header-image-text` | Mixin applied to the text overlapping the image in the card header section | `{}`
`--paper-card-content` | Mixin applied to the card content section| `{}`
`--paper-card-actions` | Mixin applied to the card action section | `{}`
`--paper-card` | Mixin applied to the card | `{}`

@group Paper Elements
@element paper-card
@demo demo/index.html
*/

Polymer({
  _template: html`
    <style include="paper-material-styles">
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        background-color: var(--paper-card-background-color, var(--primary-background-color));
        border-radius: 2px;

        @apply --paper-font-common-base;
        @apply --paper-card;
      }

      /* IE 10 support for HTML5 hidden attr */
      :host([hidden]), [hidden] {
        display: none !important;
      }

      .header {
        position: relative;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        overflow: hidden;

        @apply --paper-card-header;
      }

      .header iron-image {
        display: block;
        width: 100%;
        --iron-image-width: 100%;
        pointer-events: none;

        @apply --paper-card-header-image;
      }

      .header .title-text {
        padding: 16px;
        font-size: 24px;
        font-weight: 400;
        color: var(--paper-card-header-color, #000);

        @apply --paper-card-header-text;
      }

      .header .title-text.over-image {
        position: absolute;
        bottom: 0px;

        @apply --paper-card-header-image-text;
      }

      :host ::slotted(.card-content) {
        padding: 16px;
        position:relative;

        @apply --paper-card-content;
      }

      :host ::slotted(.card-actions) {
        border-top: 1px solid #e8e8e8;
        padding: 5px 16px;
        position:relative;

        @apply --paper-card-actions;
      }

      :host([elevation="1"]) {
        @apply --paper-material-elevation-1;
      }

      :host([elevation="2"]) {
        @apply --paper-material-elevation-2;
      }

      :host([elevation="3"]) {
        @apply --paper-material-elevation-3;
      }

      :host([elevation="4"]) {
        @apply --paper-material-elevation-4;
      }

      :host([elevation="5"]) {
        @apply --paper-material-elevation-5;
      }
    </style>

    <div class="header">
      <iron-image hidden\$="[[!image]]" aria-hidden\$="[[_isHidden(image)]]" src="[[image]]" alt="[[alt]]" placeholder="[[placeholderImage]]" preload="[[preloadImage]]" fade="[[fadeImage]]"></iron-image>
      <div hidden\$="[[!heading]]" class\$="title-text [[_computeHeadingClass(image)]]">[[heading]]</div>
    </div>

    <slot></slot>
`,
  is: 'paper-card',
  properties: {
    /**
     * The title of the card.
     */
    heading: {
      type: String,
      value: '',
      observer: '_headingChanged'
    },

    /**
     * The url of the title image of the card.
     */
    image: {
      type: String,
      value: ''
    },

    /**
     * The text alternative of the card's title image.
     */
    alt: {
      type: String
    },

    /**
     * When `true`, any change to the image url property will cause the
     * `placeholder` image to be shown until the image is fully rendered.
     */
    preloadImage: {
      type: Boolean,
      value: false
    },

    /**
     * When `preloadImage` is true, setting `fadeImage` to true will cause the
     * image to fade into place.
     */
    fadeImage: {
      type: Boolean,
      value: false
    },

    /**
     * This image will be used as a background/placeholder until the src image
     * has loaded. Use of a data-URI for placeholder is encouraged for instant
     * rendering.
     */
    placeholderImage: {
      type: String,
      value: null
    },

    /**
     * The z-depth of the card, from 0-5.
     */
    elevation: {
      type: Number,
      value: 1,
      reflectToAttribute: true
    },

    /**
     * Set this to true to animate the card shadow when setting a new
     * `z` value.
     */
    animatedShadow: {
      type: Boolean,
      value: false
    },

    /**
     * Read-only property used to pass down the `animatedShadow` value to
     * the underlying paper-material style (since they have different names).
     */
    animated: {
      type: Boolean,
      reflectToAttribute: true,
      readOnly: true,
      computed: '_computeAnimated(animatedShadow)'
    }
  },

  /**
   * Format function for aria-hidden. Use the ! operator results in the
   * empty string when given a falsy value.
   */
  _isHidden: function (image) {
    return image ? 'false' : 'true';
  },
  _headingChanged: function (heading) {
    var currentHeading = this.getAttribute('heading'),
        currentLabel = this.getAttribute('aria-label');

    if (typeof currentLabel !== 'string' || currentLabel === currentHeading) {
      this.setAttribute('aria-label', heading);
    }
  },
  _computeHeadingClass: function (image) {
    return image ? ' over-image' : '';
  },
  _computeAnimated: function (animatedShadow) {
    return animatedShadow;
  }
});

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// unsafeHTML directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeHTML. If not, we'll always re-render the
// value passed to unsafeHTML.

const previousValues = new WeakMap();
/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */

const unsafeHTML = directive(value => part => {
  if (!(part instanceof NodePart)) {
    throw new Error('unsafeHTML can only be used in text bindings');
  }

  const previousValue = previousValues.get(part);

  if (previousValue !== undefined && isPrimitive(value) && value === previousValue.value && part.value === previousValue.fragment) {
    return;
  }

  const template = document.createElement('template');
  template.innerHTML = value; // innerHTML casts to string internally

  const fragment = document.importNode(template.content, true);
  part.setValue(fragment);
  previousValues.set(part, {
    value,
    fragment
  });
});

/**
@license
Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**

`iron-icons` is a utility import that includes the definition for the
`iron-icon` element, `iron-iconset-svg` element, as well as an import for the
default icon set.

The `iron-icons` directory also includes imports for additional icon sets that
can be loaded into your project.

Example loading icon set:

    <script type="module">
      import '@polymer/iron-icons/maps-icons.js';
    </script>

To use an icon from one of these sets, first prefix your `iron-icon` with the
icon set name, followed by a colon, ":", and then the icon id.

Example using the directions-bus icon from the maps icon set:

    <iron-icon icon="maps:directions-bus"></iron-icon>

See [iron-icon](https://www.webcomponents.org/element/@polymer/iron-icon) for
more information about working with icons.

See [iron-iconset](https://www.webcomponents.org/element/@polymer/iron-iconset)
and
[iron-iconset-svg](https://www.webcomponents.org/element/@polymer/iron-iconset-svg)
for more information about how to create a custom iconset.

@group Iron Elements
@pseudoElement iron-icons
@demo demo/index.html
*/

const template = html`<iron-iconset-svg name="icons" size="24">
<svg><defs>
<g id="3d-rotation"><path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32zm.89-6.52c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44s.42-.43.55-.72c.13-.29.2-.61.2-.97 0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46.05-.16.07-.32.07-.48 0-.36-.06-.68-.18-.96-.12-.28-.29-.51-.51-.69-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.41-.51.67-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34c.11-.09.23-.17.38-.22.15-.05.3-.08.48-.08.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49-.05.15-.14.27-.25.37-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09H7.5v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4.07.16.1.35.1.57 0 .41-.12.72-.35.93-.23.23-.55.33-.95.33zm8.55-5.92c-.32-.33-.7-.59-1.14-.77-.43-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27.45-.18.84-.43 1.16-.76.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57-.18-.47-.43-.87-.75-1.2zm-.39 3.16c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zM12 0l-.66.03 3.81 3.81 1.33-1.33c3.27 1.55 5.61 4.72 5.96 8.48h1.5C23.44 4.84 18.29 0 12 0z"></path></g>
<g id="accessibility"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"></path></g>
<g id="accessible"><circle cx="12" cy="4" r="2"></circle><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"></path></g>
<g id="account-balance"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"></path></g>
<g id="account-balance-wallet"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g>
<g id="account-box"><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"></path></g>
<g id="account-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></g>
<g id="add"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></g>
<g id="add-alert"><path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"></path></g>
<g id="add-box"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g>
<g id="add-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g>
<g id="add-circle-outline"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="add-shopping-cart"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path></g>
<g id="alarm"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path></g>
<g id="alarm-add"><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"></path></g>
<g id="alarm-off"><path d="M12 6c3.87 0 7 3.13 7 7 0 .84-.16 1.65-.43 2.4l1.52 1.52c.58-1.19.91-2.51.91-3.92 0-4.97-4.03-9-9-9-1.41 0-2.73.33-3.92.91L9.6 6.43C10.35 6.16 11.16 6 12 6zm10-.28l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM2.92 2.29L1.65 3.57 2.98 4.9l-1.11.93 1.42 1.42 1.11-.94.8.8C3.83 8.69 3 10.75 3 13c0 4.97 4.02 9 9 9 2.25 0 4.31-.83 5.89-2.2l2.2 2.2 1.27-1.27L3.89 3.27l-.97-.98zm13.55 16.1C15.26 19.39 13.7 20 12 20c-3.87 0-7-3.13-7-7 0-1.7.61-3.26 1.61-4.47l9.86 9.86zM8.02 3.28L6.6 1.86l-.86.71 1.42 1.42.86-.71z"></path></g>
<g id="alarm-on"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-1.46-5.47L8.41 12.4l-1.06 1.06 3.18 3.18 6-6-1.06-1.06-4.93 4.95z"></path></g>
<g id="all-out"><path d="M16.21 4.16l4 4v-4zm4 12l-4 4h4zm-12 4l-4-4v4zm-4-12l4-4h-4zm12.95-.95c-2.73-2.73-7.17-2.73-9.9 0s-2.73 7.17 0 9.9 7.17 2.73 9.9 0 2.73-7.16 0-9.9zm-1.1 8.8c-2.13 2.13-5.57 2.13-7.7 0s-2.13-5.57 0-7.7 5.57-2.13 7.7 0 2.13 5.57 0 7.7z"></path></g>
<g id="android"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"></path></g>
<g id="announcement"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"></path></g>
<g id="apps"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></g>
<g id="archive"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"></path></g>
<g id="arrow-back"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></g>
<g id="arrow-downward"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path></g>
<g id="arrow-drop-down"><path d="M7 10l5 5 5-5z"></path></g>
<g id="arrow-drop-down-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 12l-4-4h8l-4 4z"></path></g>
<g id="arrow-drop-up"><path d="M7 14l5-5 5 5z"></path></g>
<g id="arrow-forward"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></g>
<g id="arrow-upward"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></g>
<g id="aspect-ratio"><path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"></path></g>
<g id="assessment"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></g>
<g id="assignment"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g>
<g id="assignment-ind"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></g>
<g id="assignment-late"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 15h-2v-2h2v2zm0-4h-2V8h2v6zm-1-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></g>
<g id="assignment-return"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3l-5-5 5-5v3h4v4z"></path></g>
<g id="assignment-returned"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-5-5h3V9h4v4h3l-5 5z"></path></g>
<g id="assignment-turned-in"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></g>
<g id="attachment"><path d="M2 12.5C2 9.46 4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v2H9.41c-.55 0-.55 1 0 1H18c1.1 0 2-.9 2-2s-.9-2-2-2H7.5C5.57 9 4 10.57 4 12.5S5.57 16 7.5 16H17v2H7.5C4.46 18 2 15.54 2 12.5z"></path></g>
<g id="autorenew"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"></path></g>
<g id="backspace"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"></path></g>
<g id="backup"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></g>
<g id="block"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path></g>
<g id="book"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></g>
<g id="bookmark"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></g>
<g id="bookmark-border"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"></path></g>
<g id="bug-report"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"></path></g>
<g id="build"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g>
<g id="cached"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"></path></g>
<g id="camera-enhance"><path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-1l1.25-2.75L16 13l-2.75-1.25L12 9l-1.25 2.75L8 13l2.75 1.25z"></path></g>
<g id="cancel"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></g>
<g id="card-giftcard"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"></path></g>
<g id="card-membership"><path d="M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2zm0 13H4v-2h16v2zm0-5H4V4h16v6z"></path></g>
<g id="card-travel"><path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z"></path></g>
<g id="change-history"><path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"></path></g>
<g id="check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></g>
<g id="check-box"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></g>
<g id="check-box-outline-blank"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></g>
<g id="check-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></g>
<g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>
<g id="chevron-right"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g>
<g id="chrome-reader-mode"><path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"></path></g>
<g id="class"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></g>
<g id="clear"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
<g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
<g id="cloud"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path></g>
<g id="cloud-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C8.58 8.28 10.13 7 12 7c2.21 0 4 1.79 4 4h.5c1.38 0 2.5 1.12 2.5 2.5S17.88 16 16.5 16z"></path></g>
<g id="cloud-done"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z"></path></g>
<g id="cloud-download"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></g>
<g id="cloud-off"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"></path></g>
<g id="cloud-queue"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"></path></g>
<g id="cloud-upload"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></g>
<g id="code"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></g>
<g id="compare-arrows"><path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"></path></g>
<g id="content-copy"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></g>
<g id="content-cut"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"></path></g>
<g id="content-paste"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path></g>
<g id="copyright"><path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91 1.05.34 1.7.34c.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23-.25-.16-.45-.37-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="create"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></g>
<g id="create-new-folder"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"></path></g>
<g id="credit-card"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path></g>
<g id="dashboard"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></g>
<g id="date-range"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path></g>
<g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
<g id="delete-forever"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></g>
<g id="delete-sweep"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z"></path></g>
<g id="description"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></g>
<g id="dns"><path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
<g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></g>
<g id="done-all"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"></path></g>
<g id="donut-large"><path d="M11 5.08V2c-5 .5-9 4.81-9 10s4 9.5 9 10v-3.08c-3-.48-6-3.4-6-6.92s3-6.44 6-6.92zM18.97 11H22c-.47-5-4-8.53-9-9v3.08C16 5.51 18.54 8 18.97 11zM13 18.92V22c5-.47 8.53-4 9-9h-3.03c-.43 3-2.97 5.49-5.97 5.92z"></path></g>
<g id="donut-small"><path d="M11 9.16V2c-5 .5-9 4.79-9 10s4 9.5 9 10v-7.16c-1-.41-2-1.52-2-2.84s1-2.43 2-2.84zM14.86 11H22c-.48-4.75-4-8.53-9-9v7.16c1 .3 1.52.98 1.86 1.84zM13 14.84V22c5-.47 8.52-4.25 9-9h-7.14c-.34.86-.86 1.54-1.86 1.84z"></path></g>
<g id="drafts"><path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"></path></g>
<g id="eject"><path d="M5 17h14v2H5zm7-12L5.33 15h13.34z"></path></g>
<g id="error"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></g>
<g id="error-outline"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="euro-symbol"><path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"></path></g>
<g id="event"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></g>
<g id="event-seat"><path d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"></path></g>
<g id="exit-to-app"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></g>
<g id="expand-less"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></g>
<g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
<g id="explore"><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"></path></g>
<g id="extension"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"></path></g>
<g id="face"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"></path></g>
<g id="favorite"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></g>
<g id="favorite-border"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></g>
<g id="feedback"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path></g>
<g id="file-download"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g>
<g id="file-upload"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"></path></g>
<g id="filter-list"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></g>
<g id="find-in-page"><path d="M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"></path></g>
<g id="find-replace"><path d="M11 6c1.38 0 2.63.56 3.54 1.46L12 10h6V4l-2.05 2.05C14.68 4.78 12.93 4 11 4c-3.53 0-6.43 2.61-6.92 6H6.1c.46-2.28 2.48-4 4.9-4zm5.64 9.14c.66-.9 1.12-1.97 1.28-3.14H15.9c-.46 2.28-2.48 4-4.9 4-1.38 0-2.63-.56-3.54-1.46L10 12H4v6l2.05-2.05C7.32 17.22 9.07 18 11 18c1.55 0 2.98-.51 4.14-1.36L20 21.49 21.49 20l-4.85-4.86z"></path></g>
<g id="fingerprint"><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"></path></g>
<g id="first-page"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path></g>
<g id="flag"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"></path></g>
<g id="flight-land"><path d="M2.5 19h19v2h-19zm7.18-5.73l4.35 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l1.6.43 5.31 1.43z"></path></g>
<g id="flight-takeoff"><path d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"></path></g>
<g id="flip-to-back"><path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0-8c-1.11 0-2 .9-2 2h2V3zm4 12h-2v2h2v-2zm6-12v2h2c0-1.1-.9-2-2-2zm-6 0h-2v2h2V3zM9 17v-2H7c0 1.1.89 2 2 2zm10-4h2v-2h-2v2zm0-4h2V7h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zM5 7H3v12c0 1.1.89 2 2 2h12v-2H5V7zm10-2h2V3h-2v2zm0 12h2v-2h-2v2z"></path></g>
<g id="flip-to-front"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm2 4v-2H3c0 1.1.89 2 2 2zM3 9h2V7H3v2zm12 12h2v-2h-2v2zm4-18H9c-1.11 0-2 .9-2 2v10c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H9V5h10v10zm-8 6h2v-2h-2v2zm-4 0h2v-2H7v2z"></path></g>
<g id="folder"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></g>
<g id="folder-open"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path></g>
<g id="folder-shared"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"></path></g>
<g id="font-download"><path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"></path></g>
<g id="forward"><path d="M12 8V4l8 8-8 8v-4H4V8z"></path></g>
<g id="fullscreen"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></g>
<g id="fullscreen-exit"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></g>
<g id="g-translate"><path d="M20 5h-9.12L10 2H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h7l1 3h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM7.17 14.59c-2.25 0-4.09-1.83-4.09-4.09s1.83-4.09 4.09-4.09c1.04 0 1.99.37 2.74 1.07l.07.06-1.23 1.18-.06-.05c-.29-.27-.78-.59-1.52-.59-1.31 0-2.38 1.09-2.38 2.42s1.07 2.42 2.38 2.42c1.37 0 1.96-.87 2.12-1.46H7.08V9.91h3.95l.01.07c.04.21.05.4.05.61 0 2.35-1.61 4-3.92 4zm6.03-1.71c.33.6.74 1.18 1.19 1.7l-.54.53-.65-2.23zm.77-.76h-.99l-.31-1.04h3.99s-.34 1.31-1.56 2.74c-.52-.62-.89-1.23-1.13-1.7zM21 20c0 .55-.45 1-1 1h-7l2-2-.81-2.77.92-.92L17.79 18l.73-.73-2.71-2.68c.9-1.03 1.6-2.25 1.92-3.51H19v-1.04h-3.64V9h-1.04v1.04h-1.96L11.18 6H20c.55 0 1 .45 1 1v13z"></path></g>
<g id="gavel"><path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.83 2.83-5.654-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z"></path></g>
<g id="gesture"><path d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"></path></g>
<g id="get-app"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g>
<g id="gif"><path d="M11.5 9H13v6h-1.5zM9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1zm10 1.5V9h-4.5v6H16v-2h2v-1.5h-2v-1z"></path></g>
<g id="grade"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></g>
<g id="group-work"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g>
<g id="help"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></g>
<g id="help-outline"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path></g>
<g id="highlight-off"><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="history"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g>
<g id="home"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></g>
<g id="hourglass-empty"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"></path></g>
<g id="hourglass-full"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"></path></g>
<g id="http"><path d="M4.5 11h-2V9H1v6h1.5v-2.5h2V15H6V9H4.5v2zm2.5-.5h1.5V15H10v-4.5h1.5V9H7v1.5zm5.5 0H14V15h1.5v-4.5H17V9h-4.5v1.5zm9-1.5H18v6h1.5v-2h2c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5zm0 2.5h-2v-1h2v1z"></path></g>
<g id="https"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></g>
<g id="important-devices"><path d="M23 11.01L18 11c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-9c0-.55-.45-.99-1-.99zM23 20h-5v-7h5v7zM20 2H2C.89 2 0 2.89 0 4v12c0 1.1.89 2 2 2h7v2H7v2h8v-2h-2v-2h2v-2H2V4h18v5h2V4c0-1.11-.9-2-2-2zm-8.03 7L11 6l-.97 3H7l2.47 1.76-.94 2.91 2.47-1.8 2.47 1.8-.94-2.91L15 9h-3.03z"></path></g>
<g id="inbox"><path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"></path></g>
<g id="indeterminate-check-box"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path></g>
<g id="info"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></g>
<g id="info-outline"><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path></g>
<g id="input"><path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z"></path></g>
<g id="invert-colors"><path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"></path></g>
<g id="label"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"></path></g>
<g id="label-outline"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"></path></g>
<g id="language"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></g>
<g id="last-page"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path></g>
<g id="launch"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g>
<g id="lightbulb-outline"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"></path></g>
<g id="line-style"><path d="M3 16h5v-2H3v2zm6.5 0h5v-2h-5v2zm6.5 0h5v-2h-5v2zM3 20h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zM3 12h8v-2H3v2zm10 0h8v-2h-8v2zM3 4v4h18V4H3z"></path></g>
<g id="line-weight"><path d="M3 17h18v-2H3v2zm0 3h18v-1H3v1zm0-7h18v-3H3v3zm0-9v4h18V4H3z"></path></g>
<g id="link"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
<g id="list"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path></g>
<g id="lock"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></g>
<g id="lock-open"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"></path></g>
<g id="lock-outline"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z"></path></g>
<g id="low-priority"><path d="M14 5h8v2h-8zm0 5.5h8v2h-8zm0 5.5h8v2h-8zM2 11.5C2 15.08 4.92 18 8.5 18H9v2l3-3-3-3v2h-.5C6.02 16 4 13.98 4 11.5S6.02 7 8.5 7H12V5H8.5C4.92 5 2 7.92 2 11.5z"></path></g>
<g id="loyalty"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7zm11.77 8.27L13 19.54l-4.27-4.27C8.28 14.81 8 14.19 8 13.5c0-1.38 1.12-2.5 2.5-2.5.69 0 1.32.28 1.77.74l.73.72.73-.73c.45-.45 1.08-.73 1.77-.73 1.38 0 2.5 1.12 2.5 2.5 0 .69-.28 1.32-.73 1.77z"></path></g>
<g id="mail"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
<g id="markunread"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
<g id="markunread-mailbox"><path d="M20 6H10v6H8V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"></path></g>
<g id="menu"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g>
<g id="more-horiz"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="more-vert"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="motorcycle"><path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></g>
<g id="move-to-inbox"><path d="M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm-3-5h-2V7h-4v3H8l4 4 4-4z"></path></g>
<g id="next-week"><path d="M20 7h-4V5c0-.55-.22-1.05-.59-1.41C15.05 3.22 14.55 3 14 3h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm1 13.5l-1-1 3-3-3-3 1-1 4 4-4 4z"></path></g>
<g id="note-add"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"></path></g>
<g id="offline-pin"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 16H7v-2h10v2zm-6.7-4L7 10.7l1.4-1.4 1.9 1.9 5.3-5.3L17 7.3 10.3 14z"></path></g>
<g id="opacity"><path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"></path></g>
<g id="open-in-browser"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z"></path></g>
<g id="open-in-new"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g>
<g id="open-with"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g>
<g id="pageview"><path d="M11.5 9C10.12 9 9 10.12 9 11.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S12.88 9 11.5 9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-3.21 14.21l-2.91-2.91c-.69.44-1.51.7-2.39.7C9.01 16 7 13.99 7 11.5S9.01 7 11.5 7 16 9.01 16 11.5c0 .88-.26 1.69-.7 2.39l2.91 2.9-1.42 1.42z"></path></g>
<g id="pan-tool"><path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"></path></g>
<g id="payment"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path></g>
<g id="perm-camera-mic"><path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v-2.09c-2.83-.48-5-2.94-5-5.91h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 2.97-2.17 5.43-5 5.91V21h7c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-6 8c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v4z"></path></g>
<g id="perm-contact-calendar"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"></path></g>
<g id="perm-data-setting"><path d="M18.99 11.5c.34 0 .67.03 1 .07L20 0 0 20h11.56c-.04-.33-.07-.66-.07-1 0-4.14 3.36-7.5 7.5-7.5zm3.71 7.99c.02-.16.04-.32.04-.49 0-.17-.01-.33-.04-.49l1.06-.83c.09-.08.12-.21.06-.32l-1-1.73c-.06-.11-.19-.15-.31-.11l-1.24.5c-.26-.2-.54-.37-.85-.49l-.19-1.32c-.01-.12-.12-.21-.24-.21h-2c-.12 0-.23.09-.25.21l-.19 1.32c-.3.13-.59.29-.85.49l-1.24-.5c-.11-.04-.24 0-.31.11l-1 1.73c-.06.11-.04.24.06.32l1.06.83c-.02.16-.03.32-.03.49 0 .17.01.33.03.49l-1.06.83c-.09.08-.12.21-.06.32l1 1.73c.06.11.19.15.31.11l1.24-.5c.26.2.54.37.85.49l.19 1.32c.02.12.12.21.25.21h2c.12 0 .23-.09.25-.21l.19-1.32c.3-.13.59-.29.84-.49l1.25.5c.11.04.24 0 .31-.11l1-1.73c.06-.11.03-.24-.06-.32l-1.07-.83zm-3.71 1.01c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g>
<g id="perm-device-information"><path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm4-9.99L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></g>
<g id="perm-identity"><path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path></g>
<g id="perm-media"><path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z"></path></g>
<g id="perm-phone-msg"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z"></path></g>
<g id="perm-scan-wifi"><path d="M12 3C6.95 3 3.15 4.85 0 7.23L12 22 24 7.25C20.85 4.87 17.05 3 12 3zm1 13h-2v-6h2v6zm-2-8V6h2v2h-2z"></path></g>
<g id="pets"><circle cx="4.5" cy="9.5" r="2.5"></circle><circle cx="9" cy="5.5" r="2.5"></circle><circle cx="15" cy="5.5" r="2.5"></circle><circle cx="19.5" cy="9.5" r="2.5"></circle><path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"></path></g>
<g id="picture-in-picture"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"></path></g>
<g id="picture-in-picture-alt"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path></g>
<g id="play-for-work"><path d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2zm-5 9c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z"></path></g>
<g id="polymer"><path d="M19 4h-4L7.11 16.63 4.5 12 9 4H5L.5 12 5 20h4l7.89-12.63L19.5 12 15 20h4l4.5-8z"></path></g>
<g id="power-settings-new"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></g>
<g id="pregnant-woman"><path d="M9 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm7 9c-.01-1.34-.83-2.51-2-3 0-1.66-1.34-3-3-3s-3 1.34-3 3v7h2v5h3v-5h3v-4z"></path></g>
<g id="print"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path></g>
<g id="query-builder"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></g>
<g id="question-answer"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></g>
<g id="radio-button-checked"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="radio-button-unchecked"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="receipt"><path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"></path></g>
<g id="record-voice-over"><circle cx="9" cy="9" r="4"></circle><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"></path></g>
<g id="redeem"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"></path></g>
<g id="redo"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"></path></g>
<g id="refresh"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></g>
<g id="remove"><path d="M19 13H5v-2h14v2z"></path></g>
<g id="remove-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"></path></g>
<g id="remove-circle-outline"><path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="remove-shopping-cart"><path d="M22.73 22.73L2.77 2.77 2 2l-.73-.73L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38c-.5.36-.83.95-.83 1.62 0 1.1.89 2 1.99 2 .67 0 1.26-.33 1.62-.84L21.46 24l1.27-1.27zM7.42 15c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h2.36l2 2H7.42zm8.13-2c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H6.54l9.01 9zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"></path></g>
<g id="reorder"><path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"></path></g>
<g id="reply"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></g>
<g id="reply-all"><path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4zm6 1V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></g>
<g id="report"><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"></path></g>
<g id="report-problem"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g>
<g id="restore"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g>
<g id="restore-page"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"></path></g>
<g id="room"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g>
<g id="rounded-corner"><path d="M19 19h2v2h-2v-2zm0-2h2v-2h-2v2zM3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm0-4h2V3H3v2zm4 0h2V3H7v2zm8 16h2v-2h-2v2zm-4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-8 0h2v-2H7v2zm-4 0h2v-2H3v2zM21 8c0-2.76-2.24-5-5-5h-5v2h5c1.65 0 3 1.35 3 3v5h2V8z"></path></g>
<g id="rowing"><path d="M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5zM15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 20.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z"></path></g>
<g id="save"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></g>
<g id="schedule"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></g>
<g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g>
<g id="select-all"><path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2zM7 17h10V7H7v10zm2-8h6v6H9V9z"></path></g>
<g id="send"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></g>
<g id="settings"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g>
<g id="settings-applications"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-7H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-1.75 9c0 .23-.02.46-.05.68l1.48 1.16c.13.11.17.3.08.45l-1.4 2.42c-.09.15-.27.21-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.26 1.85c-.03.17-.18.3-.35.3h-2.8c-.17 0-.32-.13-.35-.29l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.74.7c-.16.06-.34 0-.43-.15l-1.4-2.42c-.09-.15-.05-.34.08-.45l1.48-1.16c-.03-.23-.05-.46-.05-.69 0-.23.02-.46.05-.68l-1.48-1.16c-.13-.11-.17-.3-.08-.45l1.4-2.42c.09-.15.27-.21.43-.15l1.74.7c.36-.28.76-.51 1.18-.69l.26-1.85c.03-.17.18-.3.35-.3h2.8c.17 0 .32.13.35.29l.26 1.85c.43.18.82.41 1.18.69l1.74-.7c.16-.06.34 0 .43.15l1.4 2.42c.09.15.05.34-.08.45l-1.48 1.16c.03.23.05.46.05.69z"></path></g>
<g id="settings-backup-restore"><path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"></path></g>
<g id="settings-bluetooth"><path d="M11 24h2v-2h-2v2zm-4 0h2v-2H7v2zm8 0h2v-2h-2v2zm2.71-18.29L12 0h-1v7.59L6.41 3 5 4.41 10.59 10 5 15.59 6.41 17 11 12.41V20h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 3.83l1.88 1.88L13 7.59V3.83zm1.88 10.46L13 16.17v-3.76l1.88 1.88z"></path></g>
<g id="settings-brightness"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02zM8 16h2.5l1.5 1.5 1.5-1.5H16v-2.5l1.5-1.5-1.5-1.5V8h-2.5L12 6.5 10.5 8H8v2.5L6.5 12 8 13.5V16zm4-7c1.66 0 3 1.34 3 3s-1.34 3-3 3V9z"></path></g>
<g id="settings-cell"><path d="M7 24h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zM16 .01L8 0C6.9 0 6 .9 6 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2c0-1.1-.9-1.99-2-1.99zM16 16H8V4h8v12z"></path></g>
<g id="settings-ethernet"><path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"></path></g>
<g id="settings-input-antenna"><path d="M12 5c-3.87 0-7 3.13-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.87-3.13-7-7-7zm1 9.29c.88-.39 1.5-1.26 1.5-2.29 0-1.38-1.12-2.5-2.5-2.5S9.5 10.62 9.5 12c0 1.02.62 1.9 1.5 2.29v3.3L7.59 21 9 22.41l3-3 3 3L16.41 21 13 17.59v-3.3zM12 1C5.93 1 1 5.93 1 12h2c0-4.97 4.03-9 9-9s9 4.03 9 9h2c0-6.07-4.93-11-11-11z"></path></g>
<g id="settings-input-component"><path d="M5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2zm-8 0c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM21 6V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2zm-8-4c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2z"></path></g>
<g id="settings-input-composite"><path d="M5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2zm-8 0c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM21 6V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2zm-8-4c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2z"></path></g>
<g id="settings-input-hdmi"><path d="M18 7V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H5v6l3 6v3h8v-3l3-6V7h-1zM8 4h8v3h-2V5h-1v2h-2V5h-1v2H8V4z"></path></g>
<g id="settings-input-svideo"><path d="M8 11.5c0-.83-.67-1.5-1.5-1.5S5 10.67 5 11.5 5.67 13 6.5 13 8 12.33 8 11.5zm7-5c0-.83-.67-1.5-1.5-1.5h-3C9.67 5 9 5.67 9 6.5S9.67 8 10.5 8h3c.83 0 1.5-.67 1.5-1.5zM8.5 15c-.83 0-1.5.67-1.5 1.5S7.67 18 8.5 18s1.5-.67 1.5-1.5S9.33 15 8.5 15zM12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm5.5-11c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path></g>
<g id="settings-overscan"><path d="M12.01 5.5L10 8h4l-1.99-2.5zM18 10v4l2.5-1.99L18 10zM6 10l-2.5 2.01L6 14v-4zm8 6h-4l2.01 2.5L14 16zm7-13H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"></path></g>
<g id="settings-phone"><path d="M13 9h-2v2h2V9zm4 0h-2v2h2V9zm3 6.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 9v2h2V9h-2z"></path></g>
<g id="settings-power"><path d="M7 24h2v-2H7v2zm4 0h2v-2h-2v2zm2-22h-2v10h2V2zm3.56 2.44l-1.45 1.45C16.84 6.94 18 8.83 18 11c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 4.44C5.36 5.88 4 8.28 4 11c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56zM15 24h2v-2h-2v2z"></path></g>
<g id="settings-remote"><path d="M15 9H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm-3 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7.05 6.05l1.41 1.41C9.37 6.56 10.62 6 12 6s2.63.56 3.54 1.46l1.41-1.41C15.68 4.78 13.93 4 12 4s-3.68.78-4.95 2.05zM12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41C7.26 3.01 9.51 2 12 2s4.74 1.01 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0z"></path></g>
<g id="settings-voice"><path d="M7 24h2v-2H7v2zm5-11c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3zm-1 11h2v-2h-2v2zm4 0h2v-2h-2v2zm4-14h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"></path></g>
<g id="shop"><path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"></path></g>
<g id="shop-two"><path d="M3 9H1v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2H3V9zm15-4V3c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H5v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5h-5zm-6-2h4v2h-4V3zm0 12V8l5.5 3-5.5 4z"></path></g>
<g id="shopping-basket"><path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
<g id="shopping-cart"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="sort"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></g>
<g id="speaker-notes"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-3H6V9h2v2zm0-3H6V6h2v2zm7 6h-5v-2h5v2zm3-3h-8V9h8v2zm0-3h-8V6h8v2z"></path></g>
<g id="speaker-notes-off"><path d="M10.54 11l-.54-.54L7.54 8 6 6.46 2.38 2.84 1.27 1.73 0 3l2.01 2.01L2 22l4-4h9l5.73 5.73L22 22.46 17.54 18l-7-7zM8 14H6v-2h2v2zm-2-3V9l2 2H6zm14-9H4.08L10 7.92V6h8v2h-7.92l1 1H18v2h-4.92l6.99 6.99C21.14 17.95 22 17.08 22 16V4c0-1.1-.9-2-2-2z"></path></g>
<g id="spellcheck"><path d="M12.45 16h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3zm-6.02-5L8.5 5.48 10.57 11H6.43zm15.16.59l-8.09 8.09L9.83 16l-1.41 1.41 5.09 5.09L23 13l-1.41-1.41z"></path></g>
<g id="star"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></g>
<g id="star-border"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></g>
<g id="star-half"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></g>
<g id="stars"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"></path></g>
<g id="store"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"></path></g>
<g id="subdirectory-arrow-left"><path d="M11 9l1.42 1.42L8.83 14H18V4h2v12H8.83l3.59 3.58L11 21l-6-6 6-6z"></path></g>
<g id="subdirectory-arrow-right"><path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"></path></g>
<g id="subject"><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"></path></g>
<g id="supervisor-account"><path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"></path></g>
<g id="swap-horiz"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path></g>
<g id="swap-vert"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"></path></g>
<g id="swap-vertical-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.5 9L10 5.5 13.5 9H11v4H9V9H6.5zm11 6L14 18.5 10.5 15H13v-4h2v4h2.5z"></path></g>
<g id="system-update-alt"><path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4zm9-13h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z"></path></g>
<g id="tab"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"></path></g>
<g id="tab-unselected"><path d="M1 9h2V7H1v2zm0 4h2v-2H1v2zm0-8h2V3c-1.1 0-2 .9-2 2zm8 16h2v-2H9v2zm-8-4h2v-2H1v2zm2 4v-2H1c0 1.1.9 2 2 2zM21 3h-8v6h10V5c0-1.1-.9-2-2-2zm0 14h2v-2h-2v2zM9 5h2V3H9v2zM5 21h2v-2H5v2zM5 5h2V3H5v2zm16 16c1.1 0 2-.9 2-2h-2v2zm0-8h2v-2h-2v2zm-8 8h2v-2h-2v2zm4 0h2v-2h-2v2z"></path></g>
<g id="text-format"><path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z"></path></g>
<g id="theaters"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"></path></g>
<g id="thumb-down"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></g>
<g id="thumb-up"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path></g>
<g id="thumbs-up-down"><path d="M12 6c0-.55-.45-1-1-1H5.82l.66-3.18.02-.23c0-.31-.13-.59-.33-.8L5.38 0 .44 4.94C.17 5.21 0 5.59 0 6v6.5c0 .83.67 1.5 1.5 1.5h6.75c.62 0 1.15-.38 1.38-.91l2.26-5.29c.07-.17.11-.36.11-.55V6zm10.5 4h-6.75c-.62 0-1.15.38-1.38.91l-2.26 5.29c-.07.17-.11.36-.11.55V18c0 .55.45 1 1 1h5.18l-.66 3.18-.02.24c0 .31.13.59.33.8l.79.78 4.94-4.94c.27-.27.44-.65.44-1.06v-6.5c0-.83-.67-1.5-1.5-1.5z"></path></g>
<g id="timeline"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></g>
<g id="toc"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"></path></g>
<g id="today"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path></g>
<g id="toll"><path d="M15 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM3 12c0-2.61 1.67-4.83 4-5.65V4.26C3.55 5.15 1 8.27 1 12s2.55 6.85 6 7.74v-2.09c-2.33-.82-4-3.04-4-5.65z"></path></g>
<g id="touch-app"><path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"></path></g>
<g id="track-changes"><path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.9 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V2h-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z"></path></g>
<g id="translate"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></g>
<g id="trending-down"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"></path></g>
<g id="trending-flat"><path d="M22 12l-4-4v3H3v2h15v3z"></path></g>
<g id="trending-up"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path></g>
<g id="turned-in"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></g>
<g id="turned-in-not"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"></path></g>
<g id="unarchive"><path d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z"></path></g>
<g id="undo"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"></path></g>
<g id="unfold-less"><path d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"></path></g>
<g id="unfold-more"><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"></path></g>
<g id="update"><path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79 2.73 2.71 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58 3.51-3.47 9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"></path></g>
<g id="verified-user"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></g>
<g id="view-agenda"><path d="M20 13H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm0-10H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"></path></g>
<g id="view-array"><path d="M4 18h3V5H4v13zM18 5v13h3V5h-3zM8 18h9V5H8v13z"></path></g>
<g id="view-carousel"><path d="M7 19h10V4H7v15zm-5-2h4V6H2v11zM18 6v11h4V6h-4z"></path></g>
<g id="view-column"><path d="M10 18h5V5h-5v13zm-6 0h5V5H4v13zM16 5v13h5V5h-5z"></path></g>
<g id="view-day"><path d="M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z"></path></g>
<g id="view-headline"><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"></path></g>
<g id="view-list"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"></path></g>
<g id="view-module"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"></path></g>
<g id="view-quilt"><path d="M10 18h5v-6h-5v6zm-6 0h5V5H4v13zm12 0h5v-6h-5v6zM10 5v6h11V5H10z"></path></g>
<g id="view-stream"><path d="M4 18h17v-6H4v6zM4 5v6h17V5H4z"></path></g>
<g id="view-week"><path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm14 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-7 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"></path></g>
<g id="visibility"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></g>
<g id="visibility-off"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></g>
<g id="warning"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g>
<g id="watch-later"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"></path></g>
<g id="weekend"><path d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z"></path></g>
<g id="work"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></g>
<g id="youtube-searched-for"><path d="M17.01 14h-.8l-.27-.27c.98-1.14 1.57-2.61 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5s-6.5 3-6.5 6.5H2l3.84 4 4.16-4H6.51C6.51 7 8.53 5 11.01 5s4.5 2.01 4.5 4.5c0 2.48-2.02 4.5-4.5 4.5-.65 0-1.26-.14-1.82-.38L7.71 15.1c.97.57 2.09.9 3.3.9 1.61 0 3.08-.59 4.22-1.57l.27.27v.79l5.01 4.99L22 19l-4.99-5z"></path></g>
<g id="zoom-in"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"></path></g>
<g id="zoom-out"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"></path></g>
</defs></svg>
</iron-iconset-svg>`;
document.head.appendChild(template.content);

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
`iron-collapse` creates a collapsible block of content.  By default, the content
will be collapsed.  Use `opened` or `toggle()` to show/hide the content.

    <button on-click="toggle">toggle collapse</button>

    <iron-collapse id="collapse">
      <div>Content goes here...</div>
    </iron-collapse>

    ...

    toggle: function() {
      this.$.collapse.toggle();
    }

`iron-collapse` adjusts the max-height/max-width of the collapsible element to
show/hide the content.  So avoid putting padding/margin/border on the
collapsible directly, and instead put a div inside and style that.

    <style>
      .collapse-content {
        padding: 15px;
        border: 1px solid #dedede;
      }
    </style>

    <iron-collapse>
      <div class="collapse-content">
        <div>Content goes here...</div>
      </div>
    </iron-collapse>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--iron-collapse-transition-duration` | Animation transition duration | `300ms`

@group Iron Elements
@hero hero.svg
@demo demo/index.html
@element iron-collapse
*/

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        transition-duration: var(--iron-collapse-transition-duration, 300ms);
        /* Safari 10 needs this property prefixed to correctly apply the custom property */
        -webkit-transition-duration: var(--iron-collapse-transition-duration, 300ms);
        overflow: visible;
      }

      :host(.iron-collapse-closed) {
        display: none;
      }

      :host(:not(.iron-collapse-opened)) {
        overflow: hidden;
      }
    </style>

    <slot></slot>
`,
  is: 'iron-collapse',
  behaviors: [IronResizableBehavior],
  properties: {
    /**
     * If true, the orientation is horizontal; otherwise is vertical.
     *
     * @attribute horizontal
     */
    horizontal: {
      type: Boolean,
      value: false,
      observer: '_horizontalChanged'
    },

    /**
     * Set opened to true to show the collapse element and to false to hide it.
     *
     * @attribute opened
     */
    opened: {
      type: Boolean,
      value: false,
      notify: true,
      observer: '_openedChanged'
    },

    /**
     * When true, the element is transitioning its opened state. When false,
     * the element has finished opening/closing.
     *
     * @attribute transitioning
     */
    transitioning: {
      type: Boolean,
      notify: true,
      readOnly: true
    },

    /**
     * Set noAnimation to true to disable animations.
     *
     * @attribute noAnimation
     */
    noAnimation: {
      type: Boolean
    },

    /**
     * Stores the desired size of the collapse body.
     * @private
     */
    _desiredSize: {
      type: String,
      value: ''
    }
  },

  get dimension() {
    return this.horizontal ? 'width' : 'height';
  },

  /**
   * `maxWidth` or `maxHeight`.
   * @private
   */
  get _dimensionMax() {
    return this.horizontal ? 'maxWidth' : 'maxHeight';
  },

  /**
   * `max-width` or `max-height`.
   * @private
   */
  get _dimensionMaxCss() {
    return this.horizontal ? 'max-width' : 'max-height';
  },

  hostAttributes: {
    role: 'group',
    'aria-hidden': 'true'
  },
  listeners: {
    transitionend: '_onTransitionEnd'
  },

  /**
   * Toggle the opened state.
   *
   * @method toggle
   */
  toggle: function () {
    this.opened = !this.opened;
  },
  show: function () {
    this.opened = true;
  },
  hide: function () {
    this.opened = false;
  },

  /**
   * Updates the size of the element.
   * @param {string} size The new value for `maxWidth`/`maxHeight` as css property value, usually `auto` or `0px`.
   * @param {boolean=} animated if `true` updates the size with an animation, otherwise without.
   */
  updateSize: function (size, animated) {
    // Consider 'auto' as '', to take full size.
    size = size === 'auto' ? '' : size;
    var willAnimate = animated && !this.noAnimation && this.isAttached && this._desiredSize !== size;
    this._desiredSize = size;

    this._updateTransition(false); // If we can animate, must do some prep work.


    if (willAnimate) {
      // Animation will start at the current size.
      var startSize = this._calcSize(); // For `auto` we must calculate what is the final size for the animation.
      // After the transition is done, _transitionEnd will set the size back to
      // `auto`.


      if (size === '') {
        this.style[this._dimensionMax] = '';
        size = this._calcSize();
      } // Go to startSize without animation.


      this.style[this._dimensionMax] = startSize; // Force layout to ensure transition will go. Set scrollTop to itself
      // so that compilers won't remove it.

      this.scrollTop = this.scrollTop; // Enable animation.

      this._updateTransition(true); // If final size is the same as startSize it will not animate.


      willAnimate = size !== startSize;
    } // Set the final size.


    this.style[this._dimensionMax] = size; // If it won't animate, call transitionEnd to set correct classes.

    if (!willAnimate) {
      this._transitionEnd();
    }
  },

  /**
   * enableTransition() is deprecated, but left over so it doesn't break
   * existing code. Please use `noAnimation` property instead.
   *
   * @method enableTransition
   * @deprecated since version 1.0.4
   */
  enableTransition: function (enabled) {
    Base._warn('`enableTransition()` is deprecated, use `noAnimation` instead.');

    this.noAnimation = !enabled;
  },
  _updateTransition: function (enabled) {
    this.style.transitionDuration = enabled && !this.noAnimation ? '' : '0s';
  },
  _horizontalChanged: function () {
    this.style.transitionProperty = this._dimensionMaxCss;
    var otherDimension = this._dimensionMax === 'maxWidth' ? 'maxHeight' : 'maxWidth';
    this.style[otherDimension] = '';
    this.updateSize(this.opened ? 'auto' : '0px', false);
  },
  _openedChanged: function () {
    this.setAttribute('aria-hidden', !this.opened);

    this._setTransitioning(true);

    this.toggleClass('iron-collapse-closed', false);
    this.toggleClass('iron-collapse-opened', false);
    this.updateSize(this.opened ? 'auto' : '0px', true); // Focus the current collapse.

    if (this.opened) {
      this.focus();
    }
  },
  _transitionEnd: function () {
    this.style[this._dimensionMax] = this._desiredSize;
    this.toggleClass('iron-collapse-closed', !this.opened);
    this.toggleClass('iron-collapse-opened', this.opened);

    this._updateTransition(false);

    this.notifyResize();

    this._setTransitioning(false);
  },
  _onTransitionEnd: function (event) {
    if (dom(event).rootTarget === this) {
      this._transitionEnd();
    }
  },
  _calcSize: function () {
    return this.getBoundingClientRect()[this.dimension] + 'px';
  }
});

/**
 * A collapsible block: in collapsed state it only shows a header and expands if clicked.
 * The header should go into slot `collapse-trigger`, the content into `collapse-content`.
 * Example:
 * 
 * ```html
 * <pb-collapse>
 *   <div slot="collapse-trigger">
 *       Metadata
 *   </div>
 *   <pb-view slot="collapse-content" src="document1" subscribe="transcription" xpath="//teiHeader"></pb-view>
 * </pb-collapse>
 * ```
 *
 * @slot collapse-trigger - trigger toggling collapsed content on/off
 * @slot collapse-content - content to be collapsed
 * @cssprop [--pb-collapse-icon-padding=0 4px 0 0] - padding in px for the "caret-down" icon left to the collapsible item
 * @fires pb-collapse-open - Fires opening the collapsed section
 */

class PbCollapse extends pbMixin(LitElement) {
  static get properties() {
    return Object.assign(Object.assign({}, super.properties), {}, {
      /**
       * @deprecated
       * Corresponds to the iron-collapse's horizontal property.
       */
      horizontal: {
        type: Boolean
      },

      /**
       * Corresponds to the iron-collapse's noAnimation property.
       *
       */
      noAnimation: {
        type: Boolean,
        attribute: 'no-animation'
      },

      /**
       * Whether currently expanded.
       *
       */
      opened: {
        type: Boolean
      },

      /**
       * By default, an open collapse is closed if another pb-collapse is expanded on the same event channel.
       * Set to true to keep multiple pb-collapse open at the same time.
       */
      toggles: {
        type: Boolean
      },

      /**
       * The iron-icon when collapsed. Value must be one of the icons defined by iron-icons
       */
      expandIcon: {
        type: String,
        attribute: 'expand-icon'
      },

      /**
       * The icon when expanded.
       */
      collapseIcon: {
        type: String,
        attribute: 'collapse-icon'
      },

      /**
       * Whether to hide the expand/collapse icon.
       */
      noIcons: {
        type: Boolean,
        attribute: 'no-icons'
      }
    });
  }

  constructor() {
    super();
    this.horizontal = false;
    this.noAnimation = false;
    this.opened = false;
    this.expandIcon = 'icons:expand-more';
    this.collapseIcon = 'icons:expand-less';
    this.noIcons = false;
    this.toggles = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pb-collapse-open', () => {
      this.open();
    });

    if (this.toggles) {
      this.subscribeTo('pb-collapse-open', ev => {
        if (!ev.detail || ev.detail._source === this) {
          return;
        }

        for (const collapse of this.querySelectorAll('pb-collapse')) {
          if (collapse === ev.detail._source) {
            return;
          }
        }

        this.close();
      });
    }
  }
  /**
           * opens the collapsible section
           */


  open() {
    if (this.opened) {
      return;
    }

    this.opened = true;
    this.emitTo('pb-collapse-open', this);
  }
  /**
   * closes the collapsible section
   */


  close() {
    if (this.opened) {
      this.opened = false;
    }
  }
  /**
   * toggles the collapsible state
   */


  toggle() {
    this.opened = !this.opened;

    if (this.opened) {
      this.emitTo('pb-collapse-open', this.data);
    }
  }

  render() {
    return html$1`
            <div id="trigger" @click="${this.toggle}" class="collapse-trigger">
                ${!this.noIcons ? html$1`<iron-icon icon="${this.opened ? this.collapseIcon : this.expandIcon}"></iron-icon>` : null}
                <slot id="collapseTrigger" name="collapse-trigger"></slot>
            </div>
            <iron-collapse id="collapse" horizontal="${this.horizontal}" no-animation="${this.noAnimation}" .opened="${this.opened}">
                <slot name="collapse-content"></slot>
            </iron-collapse>
        `;
  }

  static get styles() {
    return css$1`
            :host {
                display: block;
            }

            #trigger {
                display: table-row;
            }

            #trigger iron-icon {
                display: table-cell;
                padding: var(--pb-collapse-icon-padding, 0 4px 0 0);
            }

            slot[name="collapse-trigger"] {
                display: table-cell;
            }
        `;
  }

}
customElements.define('pb-collapse', PbCollapse);

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');
$_documentContainer.innerHTML = `<dom-module id="paper-item-shared-styles">
  <template>
    <style>
      :host, .paper-item {
        display: block;
        position: relative;
        min-height: var(--paper-item-min-height, 48px);
        padding: 0px 16px;
      }

      .paper-item {
        @apply --paper-font-subhead;
        border:none;
        outline: none;
        background: white;
        width: 100%;
        text-align: left;
      }

      :host([hidden]), .paper-item[hidden] {
        display: none !important;
      }

      :host(.iron-selected), .paper-item.iron-selected {
        font-weight: var(--paper-item-selected-weight, bold);

        @apply --paper-item-selected;
      }

      :host([disabled]), .paper-item[disabled] {
        color: var(--paper-item-disabled-color, var(--disabled-text-color));

        @apply --paper-item-disabled;
      }

      :host(:focus), .paper-item:focus {
        position: relative;
        outline: 0;

        @apply --paper-item-focused;
      }

      :host(:focus):before, .paper-item:focus:before {
        @apply --layout-fit;

        background: currentColor;
        content: '';
        opacity: var(--dark-divider-opacity);
        pointer-events: none;

        @apply --paper-item-focused-before;
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer.content);

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/*
`PaperItemBehavior` is a convenience behavior shared by <paper-item> and
<paper-icon-item> that manages the shared control states and attributes of
the items.
*/

/** @polymerBehavior PaperItemBehavior */

const PaperItemBehaviorImpl = {
  hostAttributes: {
    role: 'option',
    tabindex: '0'
  }
};
/** @polymerBehavior */

const PaperItemBehavior = [IronButtonState, IronControlState, PaperItemBehaviorImpl];

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
Material design:
[Lists](https://www.google.com/design/spec/components/lists.html)

`<paper-item>` is an interactive list item. By default, it is a horizontal
flexbox.

    <paper-item>Item</paper-item>

Use this element with `<paper-item-body>` to make Material Design styled
two-line and three-line items.

    <paper-item>
      <paper-item-body two-line>
        <div>Show your status</div>
        <div secondary>Your status is visible to everyone</div>
      </paper-item-body>
      <iron-icon icon="warning"></iron-icon>
    </paper-item>

To use `paper-item` as a link, wrap it in an anchor tag. Since `paper-item` will
already receive focus, you may want to prevent the anchor tag from receiving
focus as well by setting its tabindex to -1.

    <a href="https://www.polymer-project.org/" tabindex="-1">
      <paper-item raised>Polymer Project</paper-item>
    </a>

If you are concerned about performance and want to use `paper-item` in a
`paper-listbox` with many items, you can just use a native `button` with the
`paper-item` class applied (provided you have correctly included the shared
styles):

    <style is="custom-style" include="paper-item-shared-styles"></style>

    <paper-listbox>
      <button class="paper-item" role="option">Inbox</button>
      <button class="paper-item" role="option">Starred</button>
      <button class="paper-item" role="option">Sent mail</button>
    </paper-listbox>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-item-min-height` | Minimum height of the item | `48px`
`--paper-item` | Mixin applied to the item | `{}`
`--paper-item-selected-weight` | The font weight of a selected item | `bold`
`--paper-item-selected` | Mixin applied to selected paper-items | `{}`
`--paper-item-disabled-color` | The color for disabled paper-items | `--disabled-text-color`
`--paper-item-disabled` | Mixin applied to disabled paper-items | `{}`
`--paper-item-focused` | Mixin applied to focused paper-items | `{}`
`--paper-item-focused-before` | Mixin applied to :before focused paper-items | `{}`

### Accessibility

This element has `role="listitem"` by default. Depending on usage, it may be
more appropriate to set `role="menuitem"`, `role="menuitemcheckbox"` or
`role="menuitemradio"`.

    <paper-item role="menuitemcheckbox">
      <paper-item-body>
        Show your status
      </paper-item-body>
      <paper-checkbox></paper-checkbox>
    </paper-item>

@group Paper Elements
@element paper-item
@demo demo/index.html
*/

Polymer({
  _template: html`
    <style include="paper-item-shared-styles">
      :host {
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --paper-font-subhead;

        @apply --paper-item;
      }
    </style>
    <slot></slot>
`,
  is: 'paper-item',
  behaviors: [PaperItemBehavior]
});

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const template$1 = html`
<dom-module id="paper-material-shared-styles">
  <template>
    <style>
      :host {
        display: block;
        position: relative;
      }

      :host([elevation="1"]) {
        @apply --shadow-elevation-2dp;
      }

      :host([elevation="2"]) {
        @apply --shadow-elevation-4dp;
      }

      :host([elevation="3"]) {
        @apply --shadow-elevation-6dp;
      }

      :host([elevation="4"]) {
        @apply --shadow-elevation-8dp;
      }

      :host([elevation="5"]) {
        @apply --shadow-elevation-16dp;
      }
    </style>
  </template>
</dom-module>
`;
template$1.setAttribute('style', 'display: none;');
document.body.appendChild(template$1.content);

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
Material design:
[Cards](https://www.google.com/design/spec/components/cards.html)

`paper-material` is a container that renders two shadows on top of each other to
create the effect of a lifted piece of paper.

Example:

    <paper-material elevation="1">
      ... content ...
    </paper-material>

@group Paper Elements
@demo demo/index.html
*/

Polymer({
  _template: html`
    <style include="paper-material-shared-styles"></style>
    <style>
      :host([animated]) {
        @apply --shadow-transition;
      }
      :host {
        @apply --paper-material;
      }
    </style>

    <slot></slot>
`,
  is: 'paper-material',
  properties: {
    /**
     * The z-depth of this element, from 0-5. Setting to 0 will remove the
     * shadow, and each increasing number greater than 0 will be "deeper"
     * than the last.
     *
     * @attribute elevation
     * @type number
     * @default 1
     */
    elevation: {
      type: Number,
      reflectToAttribute: true,
      value: 1
    },

    /**
     * Set this to true to animate the shadow when setting a new
     * `elevation` value.
     *
     * @attribute animated
     * @type boolean
     * @default false
     */
    animated: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    }
  }
});

var DIRECTION = {
  UP: 'up',
  DOWN: 'down'
};
var KEY_CODES = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ENTER: 13,
  ESCAPE: 27
};
/**
  `paper-autocomplete-suggestions`

  **From v4.x.x, this component only works with Polymer 3.0+.**

  [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@cwmr/paper-autocomplete)

  Allows to add autocomplete capabilities to any input field. This is desirable when you have an input field with custom
  logic and you just want to add the feature to help users with the selection. If you want to use it in combination with
  a regular `<paper-input>`, you can use `<paper-autocomplete>`.

  Example:
  ```
  <div class="autocomplete-wrapper">
    <paper-input id="myInput" label="Select State"></paper-input>

    <paper-autocomplete-suggestions
      for="myInput"
      source="[[accounts]]"></paper-autocomplete-suggestions>
  </div>
  ```

  It is **important to provide both `textProperty` and `valueProperty` when working with a custom search function and
  or custom templates.** They are needed to keep the component accessible and for the events (e.g. onSelect) to keep
  working.

  ### Custom search
  This component has the public method `queryFn` that is called in each key stroke and it is responsible to query
  all items in the `source` and returns only those items that matches certain filtering criteria. By default, this
  component search for items that start with the recent query (case insensitive).
  You can override this behavior providing your own query function, as long as these two requirements are fulfill:

  - The query function is synchronous.
  - The API is respected and the method always return an Array.

  The template use to render each suggestion depends on the structure of each object that this method returns. For the
  default template, each suggestion should follow this object structure:

  ```
    {
      text: objText,
      value: objValue
    }
  ```

  This function is only used when a local data source is used. When using a `remoteDataSource` user is responsible of
  doing the search and specify suggestions manually.

  ### Custom templates
  A template for each suggestion can be provided, but for now, there are limitations in the way you can customize
  the template. Please read the the following sections carefully.
  In order to set your own template, you need to add a `<template>` tag with the slot name
  `autocomplete-custom-template` and a structure equivalent to the one shown in the `<account-autocomplete>` component in
  the demo.

  You need to always maintain this structure. Then you can customize the content of paper-item. These are the reasons
  why you need to maintain it:

  - `onSelectHandler` it is very important because it will notify the `autocomplete` component when user selects one item.
  If you don't add this option, when user clicks in one of the items, nothing will happen.
  - `id`, `role` and `aria-selected` need to be there for accessibility reasons. If you don't set them, the component
  will continue working but it will not be accessible for user with disabilities.

  It is important to clarify that methods `_onSelect` and `_getSuggestionId` do not need to be implemented. They are
  part of the logic of `paper-autocomplete-suggestions`.

  When providing your own custom template, you might also need to provide your own custom search function. The reason
  for that is that the default search function only exposes text and value in the results. If each item in your data
  source contains more information, then you won't be able to access it. See the code of `<address-autocomplete>`
  element in the demo folder for a complete example.

  Another important thing to point out is related to the height of each suggestion item in the results. The height of
  the suggestion template changes dynamically depending on the height of a suggestion item. However, the following
  assumptions were made:
  - All suggestions items have the same height
  - The height of each item is fixed and can be determined at any time. For example, if you want to use images in the
  results, make sure they have a placeholder or a fixed height.

  ### Styling

  `<paper-autocomplete-suggestions>` provides the following custom properties and mixins
  for styling:

  Custom property | Description | Default
  ----------------|-------------|----------
  `--paper-item-min-height` | paper item min height | `36px`
  `--suggestions-wrapper` | mixin to apply to the suggestions container | `{}`
  `--suggestions-item` | mixin to apply to the suggestions items | `{}`

  ### Accessibility
  This component exposes certain necessary values in order to make your component accessible. When checking the ARIA
  specs, it is said that you need to inform users of the following changes:
  - Whether the popup with suggestions is open or not.
  - Id of the currently highlighted element

 You can access these values using the following properties: `isOpen` and `highlightedSuggestion`. The id of each
 element in highlightedSuggestion a random and unique id.

 In addition, as long as developers follow the general structure of each suggestion template, the following A11Y
 features are set in each suggestion:
 - `role="option"`
 - `aria-selected="true|false"`. This value will be false for all suggestion except in the one which is currently
 highlighted.

 By default, suggestions are only displayed after the user types, even if the current input should display them. If
  you want to show suggestions on focus (when available), you should add the property `show-results-on-focus`.

  @demo demo/paper-autocomplete-suggestions-demo.html
*/

Polymer({
  _template: html`
    <style>
      paper-material {
        display: none;
        position: absolute;
        width: 100%;
        z-index: 1000;
        background-color: white;
        max-height: 252px;
        overflow-y: auto;

        @apply --suggestions-wrapper;
      }

      paper-item,
      :host ::slotted(paper-item) {
        min-height: var(--paper-item-min-height, 36px);
        padding: 0 16px;
        position: relative;
        line-height: 18px;

        @apply --suggestions-item;
      }

      paper-item:hover,
      :host ::slotted(paper-item:hover) {
        background: #eee;
        color: #333;
        cursor: pointer;
      }

      paper-item.active,
      :host ::slotted(paper-item.active) {
        background: #eee;
        color: #333;
      }

      /**
       * IE11 paper-item min-height bug: https://github.com/PolymerElements/paper-item/issues/35
       */
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        paper-item {
          height: var(--paper-item-min-height, 36px);
        }
      }
    </style>
    <div>
      <!-- unselectable is needed to fix an issue related to the focus being taken away when clicking in the
       results scrollbar -->
      <paper-material elevation="1" id="suggestionsWrapper" unselectable="on"></paper-material>

      <!-- Default suggestion template -->
      <template id="defaultTemplate">
        <paper-item id\$="[[_getSuggestionId(index)]]" role="option" aria-selected="false" on-tap="_onSelect">
          <div>[[_getItemText(item)]]</div>
          <paper-ripple></paper-ripple>
        </paper-item>
      </template>

  <!-- Custom template -->
  <slot id="templates" name="autocomplete-custom-template"></slot>
  </div>
`,
  is: 'paper-autocomplete-suggestions',
  behaviors: [Templatizer],
  properties: {
    /**
     * Id of input
     */
    'for': {
      type: String
    },

    /**
     * `true` if the suggestions list is open, `false otherwise`
     */
    isOpen: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * Minimum length to trigger suggestions
     */
    minLength: {
      type: Number,
      value: 1
    },

    /**
     * Max number of suggestions to be displayed without scrolling
     */
    maxViewableItems: {
      type: Number,
      value: 7
    },

    /**
     * Property of local datasource to as the text property
     */
    textProperty: {
      type: String,
      value: 'text'
    },

    /**
     * Property of local datasource to as the value property
     */
    valueProperty: {
      type: String,
      value: 'value'
    },

    /**
     * `source` Array of objects with the options to execute the autocomplete feature
     */
    source: {
      type: Array
    },

    /**
     *  Object containing information about the current selected option. The structure of the object depends on the
     *  structure of each element in the data source.
     */
    selectedOption: {
      type: Object,
      notify: true
    },

    /**
     * Binds to a remote data source
     */
    remoteSource: {
      type: Boolean,
      value: false
    },

    /**
     * Event type separator
     */
    eventNamespace: {
      type: String,
      value: '-'
    },

    /**
     * Current highlighted suggestion. The structure of the object is:
     * ```
     * {
     *    elementId: ID // id of the highlighted DOM element
     *    option: // highlighted option data
     * }
     * ```
     */
    highlightedSuggestion: {
      type: Object,
      value: {},
      notify: true
    },

    /**
     * Function used to filter available items. This function is actually used by paper-autocomplete-suggestions,
     * it is also exposed here so it is possible to provide a custom queryFn.
     */
    queryFn: {
      type: Function
    },

    /**
     * If `true`, it will always highlight the first result each time new suggestions are presented.
     */
    highlightFirst: {
      type: Boolean,
      value: false
    },

    /**
     * Set to `true` to show available suggestions on focus. This overrides the default behavior that only shows
     * notifications after user types
     */
    showResultsOnFocus: {
      type: Boolean,
      value: false
    },

    /**
     * `_suggestions` Array with the actual suggestions to display
     */
    _suggestions: {
      type: Array,
      observer: '_onSuggestionsChanged'
    },

    /**
     * Indicates the position in the suggestions popup of the currently highlighted element, being `0` the first one,
     * and `this._suggestions.length - 1` the position of the last one.
     */
    _currentIndex: {
      type: Number,
      value: -1
    },

    /**
     * Indicates the current position of the scroll. Then the `scrollTop` position is calculated multiplying the
     * `_itemHeight` with the current index.
     */
    _scrollIndex: {
      type: Number,
      value: 0
    },

    /**
     * Height of each suggestion element in pixels
     */
    _itemHeight: {
      type: Number,
      value: 36,
      observer: '_itemHeightChanged'
    },
    _value: {
      value: undefined
    },
    _text: {
      value: undefined
    },

    /**
     * This value is used as a base to generate unique individual ids that need to be added to each suggestion for
     * accessibility reasons.
     */
    _idItemSeed: {
      type: String,
      value: 'aria-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000),
      readOnly: true
    },

    /**
     * Reference to binded functions so we can call removeEventListener on element detached
     */
    _bindedFunctions: {
      type: Object,
      value: function () {
        return {
          _onKeypress: null,
          _onFocus: null,
          _onBlur: null
        };
      }
    },

    /**
     * Indicates if the the height of each suggestion item has been already calculated.
     * The assumption is that item height is fixed and it will not change.
     */
    _hasItemHighBeenCalculated: {
      type: Boolean,
      value: false
    },

    /**
     * To avoid unnecessary access to the DOM, we keep a reference to the current template being used
     */
    __customTplRef: Object
  },
  // Element Lifecycle
  ready: function () {
    this._value = this.value; // This is important to be able to access component methods inside the templates used with Templatizer

    this.dataHost = this; // Need to capture mousedown to prevent the focus to switch from input field when user clicks in the scrollbar
    // and the autosuggest is a child of an element with tabindex.

    this.$.suggestionsWrapper.addEventListener('mousedown', function (event) {
      event.preventDefault();
    }); // We need to enforce that dataHost is the suggestions and not the custom polymer element where the template
    // is defined. If we do not do this, it won't be possible to access paperSuggestions from the custom template
    // TODO: find a way to achieve this without modifying Polymer internal properties

    this._suggestionTemplate.__dataHost = this;
    this.templatize(this._suggestionTemplate);
  },
  attached: function () {
    this._input = this.parentNode.querySelector('#' + this.for);

    if (this._input === null) {
      throw new Error('Cannot find input field with id: ' + this.for);
    }

    this._bindedFunctions._onKeypress = this._onKeypress.bind(this);
    this._bindedFunctions._onFocus = this._onFocus.bind(this);
    this._bindedFunctions._onBlur = this._onBlur.bind(this);

    this._input.addEventListener('keyup', this._bindedFunctions._onKeypress);

    this._input.addEventListener('focus', this._bindedFunctions._onFocus);

    this._input.addEventListener('blur', this._bindedFunctions._onBlur);
  },
  detached: function () {
    this.cancelDebouncer('_onSuggestionChanged');

    this._input.removeEventListener('keyup', this._bindedFunctions._onKeypress);

    this._input.removeEventListener('focus', this._bindedFunctions._onFocus);

    this._input.removeEventListener('blur', this._bindedFunctions._onBlur);

    this._input = null;
    this.__customTplRef = null;
  },
  // Element Behavior

  /**
   * Get the text property from the suggestion
   * @param {Object} suggestion The suggestion item
   * @return {String}
   */
  _getItemText: function (suggestion) {
    return suggestion[this.textProperty];
  },

  /**
   * Show the suggestions wrapper
   */
  _showSuggestionsWrapper: function () {
    var suggestionsWrapper = this.$.suggestionsWrapper;
    suggestionsWrapper.style.display = 'block';
    suggestionsWrapper.setAttribute('role', 'listbox');
    this.isOpen = true;
  },

  /**
   * Hide the suggestions wrapper
   */
  _hideSuggestionsWrapper: function () {
    var suggestionsWrapper = this.$.suggestionsWrapper;
    suggestionsWrapper.style.display = 'none';
    suggestionsWrapper.removeAttribute('role');
    this.isOpen = false;
    this.highlightedSuggestion = {};

    this._clearSuggestions();
  },
  _handleSuggestions: function (event) {
    if (!this.remoteSource) this._createSuggestions(event);else this._remoteSuggestions();
  },
  _remoteSuggestions: function () {
    var value = this._input.value;
    var option = {
      text: value,
      value: value
    };

    if (value && value.length >= this.minLength) {
      this._fireEvent(option, 'change');
    } else {
      this._suggestions = [];
    }
  },
  _bindSuggestions: function (arr) {
    if (arr.length && arr.length > 0) {
      this._suggestions = arr;
      this._currentIndex = -1;
      this._scrollIndex = 0;
    } else {
      this._suggestions = [];
    }
  },
  _createSuggestions: function (event) {
    this._currentIndex = -1;
    this._scrollIndex = 0;
    var value = event.target.value;

    if (value !== null && value.length >= this.minLength) {
      value = value.toLowerCase(); // Search for the word in the source properties.

      if (this.source && this.source.length > 0) {
        // Call queryFn. User can override queryFn() to provide custom search functionality
        this._suggestions = this.queryFn(this.source, value);
      }
    } else {
      this._suggestions = [];
    }
  },

  get _suggestionTemplate() {
    if (this.__customTplRef) {
      return this.__customTplRef;
    }

    var customTemplate = this.getEffectiveChildren();
    this.__customTplRef = customTemplate.length > 0 ? customTemplate[0] : this.$.defaultTemplate;
    return this.__customTplRef;
  },

  /**
   * Render suggestions in the suggestionsWrapper container
   * @param {Array} suggestions An array containing the suggestions to be rendered. This value is not optional, so
   *    in case no suggestions need to be rendered, you should either not call this method or provide an empty array.
   */
  _renderSuggestions: function (suggestions) {
    var suggestionsContainer = dom(this.$.suggestionsWrapper);

    this._clearSuggestions();

    [].slice.call(suggestions).forEach(function (result, index) {
      // clone the template and bind with the model
      var clone = this.stamp();
      clone.item = result;
      clone.index = index;
      suggestionsContainer.appendChild(clone.root);
    }.bind(this));
  },
  _clearSuggestions: function () {
    var suggestionsContainer = dom(this.$.suggestionsWrapper),
        last;

    while (last = suggestionsContainer.lastChild) suggestionsContainer.removeChild(last);
  },

  /**
   * Listener to changes to _suggestions state
   */
  _onSuggestionsChanged: function () {
    this.debounce('_onSuggestionChanged', () => {
      this._renderSuggestions(this._suggestions);

      if (this._suggestions.length > 0) {
        this._showSuggestionsWrapper();
      } else {
        this._hideSuggestionsWrapper();
      }

      flush();

      this._resetScroll();

      if (!this._hasItemHighBeenCalculated) {
        var firstSuggestionElement = this.$.suggestionsWrapper.querySelector('paper-item');

        if (firstSuggestionElement !== null) {
          // Update maxHeight of suggestions wrapper depending on the height of each item result
          this._itemHeight = firstSuggestionElement.offsetHeight;
          this._hasItemHighBeenCalculated = true;
        }
      }

      if (this.highlightFirst) {
        this._moveHighlighted(DIRECTION.DOWN);
      }
    }, 100);
  },
  _selection: function (index) {
    var selectedOption = this._suggestions[index];
    this._input.value = selectedOption[this.textProperty];
    this.selectedOption = selectedOption;
    this._value = this.value;
    this._text = this.text;

    this._emptyItems();

    this._fireEvent(selectedOption, 'selected');

    this.hideSuggestions();
  },

  /**
   * Get all suggestion elements
   * @return {Array} a list of all suggestion elements
   */
  _getItems: function () {
    return this.$.suggestionsWrapper.querySelectorAll('paper-item');
  },

  /**
   * Empty the list of current suggestions being displayed
   */
  _emptyItems: function () {
    this._suggestions = [];
  },
  _getId: function () {
    var id = this.getAttribute('id');
    if (!id) id = this.dataset.id;
    return id;
  },

  /**
   * Remove the the active state from all suggestion items
   */
  _removeActive: function (items) {
    [].slice.call(items).forEach(function (item) {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
  },

  /**
   * Key press event handler
   */
  _onKeypress: function (event) {
    var keyCode = event.which || event.keyCode;

    switch (keyCode) {
      case KEY_CODES.DOWN_ARROW:
        this._moveHighlighted(DIRECTION.DOWN);

        break;

      case KEY_CODES.UP_ARROW:
        this._moveHighlighted(DIRECTION.UP);

        break;

      case KEY_CODES.ENTER:
        this._keyenter();

        break;

      case KEY_CODES.ESCAPE:
        this._hideSuggestionsWrapper();

        break;
      // For left and right arrow, component should do nothing

      case KEY_CODES.LEFT_ARROW: // fall through

      case KEY_CODES.RIGHT_ARROW:
        break;

      default:
        this._handleSuggestions(event);

    }
  },

  /**
   * Event handler for the key ENTER press event
   */
  _keyenter: function () {
    if (this.$.suggestionsWrapper.style.display === 'block' && this._currentIndex > -1) {
      var index = this._currentIndex;

      this._selection(index);
    }
  },

  /**
   *  Move the current highlighted suggestion up or down
   *  @param {string} direction Possible values are DIRECTION.UP or DIRECTION.DOWN
   */
  _moveHighlighted: function (direction) {
    var items = this._getItems();

    if (items.length === 0) {
      return;
    }

    var numberOfItems = items.length - 1;
    var isFirstItem = this._currentIndex === 0;
    var isLastItem = this._currentIndex === numberOfItems;
    var isNoItemHighlighted = this._currentIndex === -1;

    if ((isNoItemHighlighted || isFirstItem) && direction === DIRECTION.UP) {
      this._currentIndex = numberOfItems;
    } else if (isLastItem && direction === DIRECTION.DOWN) {
      this._currentIndex = 0;
    } else {
      var modifier = direction === DIRECTION.DOWN ? 1 : -1;
      this._currentIndex = this._currentIndex + modifier;
    }

    var highlightedOption = this._suggestions[this._currentIndex];
    var highlightedItem = items[this._currentIndex];

    this._removeActive(items);

    highlightedItem.classList.add('active');
    highlightedItem.setAttribute('aria-selected', 'true');

    this._setHighlightedSuggestion(highlightedOption, highlightedItem.id);

    this._scroll(direction);
  },

  /**
   * Move scroll (if needed) to display the active element in the suggestions list.
   * @param {string} direction Direction to scroll. Possible values are `DIRECTION.UP` and `DIRECTION.DOWN`.
   */
  _scroll: function (direction) {
    var newScrollValue, isSelectedOutOfView;
    var viewIndex = this._currentIndex - this._scrollIndex; // This happens only when user switch from last item to first one

    var isFirstItemAndOutOfView = this._currentIndex === 0 && viewIndex < 0; // This happens only when user switch from first or no item to last one

    var isLastItemAndOutOfView = this._currentIndex === this._suggestions.length - 1 && viewIndex >= this.maxViewableItems;

    if (isFirstItemAndOutOfView && direction === DIRECTION.DOWN) {
      newScrollValue = 0;
      isSelectedOutOfView = true;
    } else if (isLastItemAndOutOfView && direction === DIRECTION.UP) {
      newScrollValue = this._suggestions.length - this.maxViewableItems;
      isSelectedOutOfView = true;
    } else if (direction === DIRECTION.UP) {
      newScrollValue = this._scrollIndex - 1;
      isSelectedOutOfView = viewIndex < 0;
    } else {
      newScrollValue = this._scrollIndex + 1;
      isSelectedOutOfView = viewIndex >= this.maxViewableItems;
    } // Only when the current active element is out of view, we need to move the position of the scroll


    if (isSelectedOutOfView) {
      this._scrollIndex = newScrollValue;
      this.$.suggestionsWrapper.scrollTop = this._scrollIndex * this._itemHeight;
    }
  },

  /**
   * Reset scroll back to zero
   */
  _resetScroll: function () {
    this.$.suggestionsWrapper.scrollTop = 0;
  },

  /**
   * Set the current highlighted suggestion
   * @param {Object} option Data of the highlighted option
   * @param {string} elementId id of the highlighted dom element.
   */
  _setHighlightedSuggestion: function (option, elementId) {
    this.highlightedSuggestion = {
      option: option,
      elementId: elementId,
      textValue: option[this.textProperty],
      value: option[this.valueProperty]
    };
  },
  _fireEvent: function (option, evt) {
    var id = this._getId();

    var event = 'autocomplete' + this.eventNamespace + evt;
    this.fire(event, {
      id: id,
      value: option[this.valueProperty] || option.value,
      text: option[this.textProperty] || option.text,
      target: this,
      option: option
    });
  },
  _onSelect: function (event) {
    var index = this.modelForElement(event.currentTarget).index;

    this._selection(index);
  },

  /**
   * Event handler for the onBlur event
   */
  _onBlur: function () {
    var option = {
      text: this.text,
      value: this.value
    };

    this._fireEvent(option, 'blur');

    this.hideSuggestions();
  },

  /**
   * Event handler for the onFocus event
   */
  _onFocus: function (event) {
    var option = {
      text: this.text,
      value: this.value
    };

    if (this.showResultsOnFocus) {
      this._handleSuggestions(event);
    }

    this._fireEvent(option, 'focus');
  },

  /**
   * Generate a suggestion id for a certain index
   * @param {number} index Position of the element in the suggestions list
   * @returns {string} a unique id based on the _idItemSeed and the position of that element in the suggestions popup
   * @private
   */
  _getSuggestionId: function (index) {
    return this._idItemSeed + '-' + index;
  },

  /**
   * When item height is changed, the maxHeight of the suggestionWrapper need to be updated
   */
  _itemHeightChanged: function () {
    this.$.suggestionsWrapper.style.maxHeight = this._itemHeight * this.maxViewableItems + 'px';
  },

  /****************************
   * PUBLIC
   ****************************/

  /**
   * Sets the component's current suggestions
   * @param {Array} arr
   */
  suggestions: function (arr) {
    this._bindSuggestions(arr);
  },

  /**
   * Hides the suggestions popup
   */
  hideSuggestions: function () {
    setTimeout(function () {
      this._hideSuggestionsWrapper();
    }.bind(this), 0);
  },

  /**
   * Query function is called on each keystroke to query the data source and returns the suggestions that matches
   * with the filtering logic included.
   * @param {Array} datasource An array containing all items before filtering
   * @param {string} query Current value in the input field
   * @returns {Array} an array containing only those items in the data source that matches the filtering logic.
   */
  queryFn: function (datasource, query) {
    var queryResult = [];
    datasource.forEach(function (item) {
      var objText, objValue;

      if (typeof item === 'object') {
        objText = item[this.textProperty];
        objValue = item[this.valueProperty];
      } else {
        objText = item.toString();
        objValue = objText;
      }

      if (objText.toLowerCase().indexOf(query) === 0) {
        // NOTE: the structure of the result object matches with the current template. For custom templates, you
        // might need to return more data
        var resultItem = {};
        resultItem[this.textProperty] = objText;
        resultItem[this.valueProperty] = objValue;
        queryResult.push(resultItem);
      }
    }.bind(this));
    return queryResult;
  }
  /**
   * Fired when a selection is made
   *
   * @event autocomplete-selected
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input change
   *
   * @event autocomplete-change
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input focus
   *
   * @event autocomplete-focus
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input blur
   *
   * @event autocomplete-blur
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input reset/clear
   *
   * @event autocomplete-reset-blur
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

});

/*!
 * hotkeys-js v3.8.7
 * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies.
 * 
 * Copyright (c) 2021 kenny wong <wowohoo@qq.com>
 * http://jaywcjlove.github.io/hotkeys
 * 
 * Licensed under the MIT license.
 */
var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

function addEvent(object, event, method) {
  if (object.addEventListener) {
    object.addEventListener(event, method, false);
  } else if (object.attachEvent) {
    object.attachEvent("on".concat(event), function () {
      method(window.event);
    });
  }
} // 修饰键转换成对应的键码


function getMods(modifier, key) {
  var mods = key.slice(0, key.length - 1);

  for (var i = 0; i < mods.length; i++) {
    mods[i] = modifier[mods[i].toLowerCase()];
  }

  return mods;
} // 处理传的key字符串转换成数组


function getKeys(key) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

  var keys = key.split(','); // 同时设置多个快捷键，以','分割

  var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

  for (; index >= 0;) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }

  return keys;
} // 比较修饰键的数组


function compareArray(a1, a2) {
  var arr1 = a1.length >= a2.length ? a1 : a2;
  var arr2 = a1.length >= a2.length ? a2 : a1;
  var isIndex = true;

  for (var i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }

  return isIndex;
}

var _keyMap = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220
}; // Modifier Keys

var _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91
};
var modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
};
var _mods = {
  16: false,
  18: false,
  17: false,
  91: false
};
var _handlers = {}; // F1~F12 special key

for (var k = 1; k < 20; k++) {
  _keyMap["f".concat(k)] = 111 + k;
}

var _downKeys = []; // 记录摁下的绑定键

var _scope = 'all'; // 默认热键范围

var elementHasBindEvent = []; // 已绑定事件的节点记录
// 返回键码

var code = function code(x) {
  return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
}; // 设置获取当前范围（默认为'所有'）


function setScope(scope) {
  _scope = scope || 'all';
} // 获取当前范围


function getScope() {
  return _scope || 'all';
} // 获取摁下绑定键的键值


function getPressedKeyCodes() {
  return _downKeys.slice(0);
} // 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true


function filter(event) {
  var target = event.target || event.srcElement;
  var tagName = target.tagName;
  var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

  if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
    flag = false;
  }

  return flag;
} // 判断摁下的键是否为某个键，返回true或者false


function isPressed(keyCode) {
  if (typeof keyCode === 'string') {
    keyCode = code(keyCode); // 转换成键码
  }

  return _downKeys.indexOf(keyCode) !== -1;
} // 循环删除handlers中的所有 scope(范围)


function deleteScope(scope, newScope) {
  var handlers;
  var i; // 没有指定scope，获取scope

  if (!scope) scope = getScope();

  for (var key in _handlers) {
    if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
      handlers = _handlers[key];

      for (i = 0; i < handlers.length;) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
      }
    }
  } // 如果scope被删除，将scope重置为all


  if (getScope() === scope) setScope(newScope || 'all');
} // 清除修饰键


function clearModifier(event) {
  var key = event.keyCode || event.which || event.charCode;

  var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


  if (i >= 0) {
    _downKeys.splice(i, 1);
  } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


  if (event.key && event.key.toLowerCase() === 'meta') {
    _downKeys.splice(0, _downKeys.length);
  } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


  if (key === 93 || key === 224) key = 91;

  if (key in _mods) {
    _mods[key] = false; // 将修饰键重置为false

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = false;
    }
  }
}

function unbind(keysInfo) {
  // unbind(), unbind all keys
  if (!keysInfo) {
    Object.keys(_handlers).forEach(function (key) {
      return delete _handlers[key];
    });
  } else if (Array.isArray(keysInfo)) {
    // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
    keysInfo.forEach(function (info) {
      if (info.key) eachUnbind(info);
    });
  } else if (typeof keysInfo === 'object') {
    // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
    if (keysInfo.key) eachUnbind(keysInfo);
  } else if (typeof keysInfo === 'string') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    } // support old method
    // eslint-disable-line


    var scope = args[0],
        method = args[1];

    if (typeof scope === 'function') {
      method = scope;
      scope = '';
    }

    eachUnbind({
      key: keysInfo,
      scope: scope,
      method: method,
      splitKey: '+'
    });
  }
} // 解除绑定某个范围的快捷键


var eachUnbind = function eachUnbind(_ref) {
  var key = _ref.key,
      scope = _ref.scope,
      method = _ref.method,
      _ref$splitKey = _ref.splitKey,
      splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
  var multipleKeys = getKeys(key);
  multipleKeys.forEach(function (originKey) {
    var unbindKeys = originKey.split(splitKey);
    var len = unbindKeys.length;
    var lastKey = unbindKeys[len - 1];
    var keyCode = lastKey === '*' ? '*' : code(lastKey);
    if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

    if (!scope) scope = getScope();
    var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
    _handlers[keyCode] = _handlers[keyCode].map(function (record) {
      // 通过函数判断，是否解除绑定，函数相等直接返回
      var isMatchingMethod = method ? record.method === method : true;

      if (isMatchingMethod && record.scope === scope && compareArray(record.mods, mods)) {
        return {};
      }

      return record;
    });
  });
}; // 对监听对应快捷键的回调函数进行处理


function eventHandler(event, handler, scope) {
  var modifiersMatch; // 看它是否在当前范围

  if (handler.scope === scope || handler.scope === 'all') {
    // 检查是否匹配修饰符（如果有返回true）
    modifiersMatch = handler.mods.length > 0;

    for (var y in _mods) {
      if (Object.prototype.hasOwnProperty.call(_mods, y)) {
        if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
          modifiersMatch = false;
        }
      }
    } // 调用处理程序，如果是修饰键不做处理


    if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
      if (handler.method(event, handler) === false) {
        if (event.preventDefault) event.preventDefault();else event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.cancelBubble) event.cancelBubble = true;
      }
    }
  }
} // 处理keydown事件


function dispatch(event) {
  var asterisk = _handlers['*'];
  var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

  if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
  // Webkit左右 command 键值不一样

  if (key === 93 || key === 224) key = 91;
  /**
   * Collect bound keys
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
   * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   */

  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  /**
   * Jest test cases are required.
   * ===============================
   */

  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
    var keyNum = modifierMap[keyName];

    if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
      _downKeys.push(keyNum);
    } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
      _downKeys.splice(_downKeys.indexOf(keyNum), 1);
    } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
      /**
       * Fix if Command is pressed:
       * ===============================
       */
      if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
        _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
      }
    }
  });
  /**
   * -------------------------------
   */

  if (key in _mods) {
    _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = true;
    }

    if (!asterisk) return;
  } // 将 modifierMap 里面的修饰键绑定到 event 中


  for (var e in _mods) {
    if (Object.prototype.hasOwnProperty.call(_mods, e)) {
      _mods[e] = event[modifierMap[e]];
    }
  }
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */


  if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }

    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }

    _mods[17] = true;
    _mods[18] = true;
  } // 获取范围 默认为 `all`


  var scope = getScope(); // 对任何快捷键都需要做的处理

  if (asterisk) {
    for (var i = 0; i < asterisk.length; i++) {
      if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
        eventHandler(event, asterisk[i], scope);
      }
    }
  } // key 不在 _handlers 中返回


  if (!(key in _handlers)) return;

  for (var _i = 0; _i < _handlers[key].length; _i++) {
    if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
      if (_handlers[key][_i].key) {
        var record = _handlers[key][_i];
        var splitKey = record.splitKey;
        var keyShortcut = record.key.split(splitKey);
        var _downKeysCurrent = []; // 记录当前按键键值

        for (var a = 0; a < keyShortcut.length; a++) {
          _downKeysCurrent.push(code(keyShortcut[a]));
        }

        if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
          // 找到处理内容
          eventHandler(event, record, scope);
        }
      }
    }
  }
} // 判断 element 是否已经绑定事件


function isElementBind(element) {
  return elementHasBindEvent.indexOf(element) > -1;
}

function hotkeys(key, option, method) {
  _downKeys = [];
  var keys = getKeys(key); // 需要处理的快捷键列表

  var mods = [];
  var scope = 'all'; // scope默认为all，所有范围都有效

  var element = document; // 快捷键事件绑定节点

  var i = 0;
  var keyup = false;
  var keydown = true;
  var splitKey = '+'; // 对为设定范围的判断

  if (method === undefined && typeof option === 'function') {
    method = option;
  }

  if (Object.prototype.toString.call(option) === '[object Object]') {
    if (option.scope) scope = option.scope; // eslint-disable-line

    if (option.element) element = option.element; // eslint-disable-line

    if (option.keyup) keyup = option.keyup; // eslint-disable-line

    if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

    if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
  }

  if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

  for (; i < keys.length; i++) {
    key = keys[i].split(splitKey); // 按键列表

    mods = []; // 如果是组合快捷键取得组合快捷键

    if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

    key = key[key.length - 1];
    key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
    // 判断key是否在_handlers中，不在就赋一个空数组

    if (!(key in _handlers)) _handlers[key] = [];

    _handlers[key].push({
      keyup: keyup,
      keydown: keydown,
      scope: scope,
      mods: mods,
      shortcut: keys[i],
      method: method,
      key: keys[i],
      splitKey: splitKey
    });
  } // 在全局document上设置快捷键


  if (typeof element !== 'undefined' && !isElementBind(element) && window) {
    elementHasBindEvent.push(element);
    addEvent(element, 'keydown', function (e) {
      dispatch(e);
    });
    addEvent(window, 'focus', function () {
      _downKeys = [];
    });
    addEvent(element, 'keyup', function (e) {
      dispatch(e);
      clearModifier(e);
    });
  }
}

var _api = {
  setScope: setScope,
  getScope: getScope,
  deleteScope: deleteScope,
  getPressedKeyCodes: getPressedKeyCodes,
  isPressed: isPressed,
  filter: filter,
  unbind: unbind
};

for (var a in _api) {
  if (Object.prototype.hasOwnProperty.call(_api, a)) {
    hotkeys[a] = _api[a];
  }
}

if (typeof window !== 'undefined') {
  var _hotkeys = window.hotkeys;

  hotkeys.noConflict = function (deep) {
    if (deep && window.hotkeys === hotkeys) {
      window.hotkeys = _hotkeys;
    }

    return hotkeys;
  };

  window.hotkeys = hotkeys;
}

const EXCLUDED_TAGS = ['INPUT', 'SELECT', 'TEXTAREA', 'PAPER-INPUT', 'PAPER-TEXTAREA', 'PB-SEARCH'];
const excluded = new Set(EXCLUDED_TAGS); // disable hotkeys for form elements

let firstLoad = true;

if (firstLoad) {
  hotkeys.filter = event => {
    const tagName = (event.target || event.srcElement).tagName;
    return !(tagName.isContentEditable || excluded.has(tagName));
  };

  firstLoad = false;
}
/**
 * Mixin to register handlers for keyboard shortcuts. Property `hotkeys` should be an object
 * containing a symbolic name for the action as key and a keyboard shortcut as value. Subclasses
 * can then map the symbolic name to a function by calling `registerHotkey`.
 *
 */


const pbHotkeys = superclass => class PbHotkeys extends superclass {
  static get properties() {
    return Object.assign(Object.assign({}, super.properties), {}, {
      hotkeys: {
        type: Object
      }
    });
  }

  constructor() {
    super();
    this.hotkeys = {};
  }
  /**
   * 
   * @param {String} name symbolic name, must be defined in `this.hotkeys`
   * @param {import('hotkeys-js').KeyHandler} callback a callback function
   */


  registerHotkey(name, callback, target) {
    if (name && this.hotkeys[name]) {
      if (target) {
        hotkeys(this.hotkeys[name], {
          element: target
        }, callback);
      } else {
        hotkeys(this.hotkeys[name], callback);
      }
    }
  }

  display(name) {
    if (name && this.hotkeys[name]) {
      let output = [];
      const keys = this.hotkeys[name].split(/\s*,\s*/);
      keys.forEach(key => {
        output.push(key.replace('+', '-'));
      });
      return output.join(', ');
    }

    return '';
  }

};
function registerHotkey(name, callback, target) {
  if (target) {
    hotkeys(name, {
      element: target
    }, callback);
  } else {
    hotkeys(name, callback);
  }
}
window.pbKeyboard = registerHotkey;

/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
Material design: [Icon
toggles](https://www.google.com/design/spec/components/buttons.html#buttons-toggle-buttons)

`paper-icon-button` is a button with an image placed at the center. When the
user touches the button, a ripple effect emanates from the center of the button.

`paper-icon-button` does not include a default icon set. To use icons from the
default set, include `PolymerElements/iron-icons/iron-icons.html`, and use the
`icon` attribute to specify which icon from the icon set to use.

    <paper-icon-button icon="menu"></paper-icon-button>

See [`iron-iconset`](iron-iconset) for more information about
how to use a custom icon set.

Example:

    <script type="module">
      import '@polymer/iron-icons/iron-icons.js';
    </script>

    <paper-icon-button icon="favorite"></paper-icon-button>
    <paper-icon-button src="star.png"></paper-icon-button>

To use `paper-icon-button` as a link, wrap it in an anchor tag. Since
`paper-icon-button` will already receive focus, you may want to prevent the
anchor tag from receiving focus as well by setting its tabindex to -1.

    <a href="https://www.polymer-project.org" tabindex="-1">
      <paper-icon-button icon="polymer"></paper-icon-button>
    </a>

### Styling

Style the button with CSS as you would a normal DOM element. If you are using
the icons provided by `iron-icons`, they will inherit the foreground color of
the button.

    /* make a red "favorite" button *\/
    <paper-icon-button icon="favorite" style="color: red;"></paper-icon-button>

By default, the ripple is the same color as the foreground at 25% opacity. You
may customize the color using the `--paper-icon-button-ink-color` custom
property.

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-icon-button-disabled-text` | The color of the disabled button | `--disabled-text-color`
`--paper-icon-button-ink-color` | Selected/focus ripple color | `--primary-text-color`
`--paper-icon-button` | Mixin for a button | `{}`
`--paper-icon-button-disabled` | Mixin for a disabled button | `{}`
`--paper-icon-button-hover` | Mixin for button on hover | `{}`

@group Paper Elements
@element paper-icon-button
@demo demo/index.html
*/

Polymer({
  is: 'paper-icon-button',
  _template: html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 8px;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        z-index: 0;
        line-height: 1;

        width: 40px;
        height: 40px;

        /*
          NOTE: Both values are needed, since some phones require the value to
          be \`transparent\`.
        */
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;

        /* Because of polymer/2558, this style has lower specificity than * */
        box-sizing: border-box !important;

        @apply --paper-icon-button;
      }

      :host #ink {
        color: var(--paper-icon-button-ink-color, var(--primary-text-color));
        opacity: 0.6;
      }

      :host([disabled]) {
        color: var(--paper-icon-button-disabled-text, var(--disabled-text-color));
        pointer-events: none;
        cursor: auto;

        @apply --paper-icon-button-disabled;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host(:hover) {
        @apply --paper-icon-button-hover;
      }

      iron-icon {
        --iron-icon-width: 100%;
        --iron-icon-height: 100%;
      }
    </style>

    <iron-icon id="icon" src="[[src]]" icon="[[icon]]"
               alt$="[[alt]]"></iron-icon>
  `,
  hostAttributes: {
    role: 'button',
    tabindex: '0'
  },
  behaviors: [PaperInkyFocusBehavior],
  registered: function () {
    this._template.setAttribute('strip-whitespace', '');
  },
  properties: {
    /**
     * The URL of an image for the icon. If the src property is specified,
     * the icon property should not be.
     */
    src: {
      type: String
    },

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon's icon set. If the icon property is specified,
     * the src property should not be.
     */
    icon: {
      type: String
    },

    /**
     * Specifies the alternate text for the button, for accessibility.
     */
    alt: {
      type: String,
      observer: '_altChanged'
    }
  },
  _altChanged: function (newValue, oldValue) {
    var label = this.getAttribute('aria-label'); // Don't stomp over a user-set aria-label.

    if (!label || oldValue == label) {
      this.setAttribute('aria-label', newValue);
    }
  }
});

/**
  `paper-autocomplete`

  **From v4.x.x, this component only works with Polymer 3.0+.**

  [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@cwmr/paper-autocomplete)

  paper-autocomplete extends earlier efforts such as this (https://github.com/rodo1111/paper-input-autocomplete)
  to provide keyboard support, remote binding and results scrolling.

  It is **important to provide both `textProperty` and `valueProperty` when working with a custom search function and
  or custom templates.** They are needed to keep the component accessible and for the events (e.g. onSelect) to keep
  working.

  To integrate with `iron-input`, you must set the `name` option. The selected `value` will be exposed, **not** the
  `text` value,

  ### Custom search
  This component has the public method `queryFn` that is called in each key stroke and it is responsible to query
  all items in the `source` and returns only those items that matches certain filtering criteria. By default, this
  component searches for items that start with the recent query (case insensitive).
  You can override this behavior providing your own query function, as long as these two requirements are fulfilled:
  - The query function is synchronous.
  - The API is respected and the method always returns an Array.
  The template used to render each suggestion depends on the structure of each object that this method returns. For the
  default template, each suggestion should follow this object structure:
  ```
    {
      text: objText,
      value: objValue
    }
  ```

  This function is only used when a local data source is used. When using a `remoteDataSource` user is responsible for
  doing the search and specify suggestions manually.

  ### Custom templates
  A template for each suggestion can be provided, but for now, there are limitations in the way you can customize
  the template. Please, read this section carefully to know them.
  In order to set your own template, you need to add a `<template>` tag with the attribute
  `autocomplete-custom-template` and the following structure:

  ```html
  <paper-autocomplete>
    <template autocomplete-custom-template>
      <paper-item on-tap="_onSelect" id$="[[_getSuggestionId(index)]]" role="option" aria-selected="false">
        <style>
          /** Styles for your custom template here **\/
        </style>

        YOUR CUSTOM TEMPLATE
        <paper-ripple></paper-ripple>
      </paper-item>
    </template>
  </paper-autocomplete>
  ```

  You need to always maintain this structure. Then you can customize the content of paper-item. These are the reasons
  why you need to maintain it:

  - `_onSelect` it is very important because it will notify the `autocomplete` component when user selects one item.
  If you don't add this option, when user clicks in one of the items, nothing will happen.
  - `id`, `role` and `aria-selected` need to be there for accessibility reasons. If you don't set them, the component
  will continue working but it will not be accessible for users with disabilities.

  It is important to clarify that methods `_onSelect` and `_getSuggestionId` do not need to be implemented. They are
  part of the logic of `paper-autocomplete`.

  When providing your own custom template, you might also need to provide your own custom search function. The reason
  for that is that the default search function only exposes text and value in the results. If each item in your data
  source contains more information, then you won't be able to access it. See the code of the `<address-autocomplete>`
  element in the demo folder for a complete example.

  Another important thing to point out is related to the height of each suggestion item in the results. The height of
  the suggestion template changes dynamically depending on the height of a suggestion item. However, the following
  assumptions were made:
  - All suggestions items have the same height
  - The height of each item is fixed and can be determined at any time. For example, if you want to use images in the
  results, make sure they have a placeholder or a fixed height.

  By default, suggestions are only displayed after the user types, even if the current input should display them. If
  you want to show suggestions on focus (when available), you should add the property `show-results-on-focus`.

  ### Styling

  `<paper-autocomplete>` provides the following custom properties and mixins
  for styling:

  Custom property | Description | Default
  ----------------|-------------|----------
  `--paper-input-container-focus-color` | sets the components input container focus color | `var(--primary-color)`
  `--paper-autocomplete-suggestions-item-min-height` | min height of each suggestion item | `36px`
  `--paper-autocomplete-suggestions-wrapper` | mixin to apply to the suggestions container | `{}`

  ### Accessibility

  This component is friendly with screen readers (tested only with VoiceOver and NVDA in Windows): current selection
  and active suggestion are announced.

  @demo demo/index.html
*/

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;
        position: relative;

        --paper-input-container-focus-color: var(--primary-color);

        --paper-icon-button: {
          height: 24px;
          width: 24px;
          padding: 2px;
        }

        --paper-input-container-ms-clear: {
          display: none;
        }
      }

      .input-wrapper {
        @apply --layout-horizontal;
      }

      .input-wrapper paper-input {
        @apply --layout-flex;
      }

      #clear {
        display: none;
        line-height: 8px;
      }

      .sr-only {
        position: absolute;
        clip: rect(1px, 1px, 1px, 1px);
      }

      paper-autocomplete-suggestions {
        --suggestions-wrapper: {
          @apply --paper-autocomplete-suggestions-wrapper;
        };

        --paper-item-min-height: var(--paper-autocomplete-suggestions-item-min-height, 36px);
      }
    </style>

    <div class="input-wrapper" role="combobox" aria-haspopup="true" aria-owns="suggestionsWrapper" aria-expanded\$="[[_isSuggestionsOpened]]">
      <!-- For accessibility, it is needed to have a label or aria-label. Label is preferred -->
      <label for="autocompleteInput" class="sr-only">[[label]]</label>

      <!-- Adding a hidden input to integrate with iron-form, if required -->
      <input type="hidden" name\$="[[name]]" value\$="[[value]]">

      <paper-input id="autocompleteInput" label="[[label]]" autocapitalize="[[autocapitalize]]" no-label-float="[[noLabelFloat]]" disabled="{{disabled}}" readonly="[[readonly]]" focused="{{focused}}" auto-validate\$="[[autoValidate]]" error-message\$="[[errorMessage]]" required\$="[[required]]" value="{{text}}" allowed-pattern="[[allowedPattern]]" pattern="[[pattern]]" always-float-label="[[alwaysFloatLabel]]" char-counter\$="[[charCounter]]" maxlength\$="[[maxlength]]" placeholder="[[placeholder]]" invalid="{{invalid}}" role="textbox" aria-autocomplete="list" aria-multiline="false" aria-activedescendant\$="[[_highlightedSuggestion.elementId]]" aria-disabled\$="[[disabled]]" aria-controls="autocompleteStatus suggestionsWrapper">

        <slot name="prefix" slot="prefix"></slot>
        <!-- TODO: remove tabindex workaround when  is fixed https://github.com/PolymerElements/paper-input/issues/324 -->
        <paper-icon-button slot="suffix" suffix="" id="clear" icon="clear" on-click="_clear" tabindex="-1"></paper-icon-button>
        <slot name="suffix" slot="suffix"></slot>
      </paper-input>
      <!-- to announce current selection to screen reader -->
      <span id="autocompleteStatus" role="status" class="sr-only">[[_highlightedSuggestion.textValue]]</span>
    </div>

    <paper-autocomplete-suggestions for="autocompleteInput" id="paperAutocompleteSuggestions" min-length="[[minLength]]" text-property="[[textProperty]]" value-property="[[valueProperty]]" selected-option="{{selectedOption}}" source="[[source]]" remote-source="[[remoteSource]]" query-fn="[[queryFn]]" event-namespace="[[eventNamespace]]" highlighted-suggestion="{{_highlightedSuggestion}}" is-open="{{_isSuggestionsOpened}}" highlight-first="[[highlightFirst]]" show-results-on-focus="[[showResultsOnFocus]]">

      <slot id="templates" name="autocomplete-custom-template"></slot>

    </paper-autocomplete-suggestions>
`,
  is: 'paper-autocomplete',
  properties: {
    /**
     * `autoValidate` Set to true to auto-validate the input value.
     */
    autoValidate: {
      type: Boolean,
      value: false
    },

    /**
     * Setter/getter manually invalid input
     */
    invalid: {
      type: Boolean,
      notify: true,
      value: false
    },

    /**
     * `autocapitalize` Sets auto-capitalization for the input element.
     */
    autocapitalize: String,

    /**
     * `errorMessage` The error message to display when the input is invalid.
     */
    errorMessage: {
      type: String
    },

    /**
     * `label` Text to display as the input label
     */
    label: String,

    /**
     * `noLabelFloat` Set to true to disable the floating label.
     */
    noLabelFloat: {
      type: Boolean,
      value: false
    },

    /**
     * `alwaysFloatLabel` Set to true to always float label
     */
    alwaysFloatLabel: {
      type: Boolean,
      value: false
    },

    /**
     * The placeholder text
     */
    placeholder: String,

    /**
     * `required` Set to true to mark the input as required.
     */
    required: {
      type: Boolean,
      value: false
    },

    /**
     * `readonly` Set to true to mark the input as readonly.
     */
    readonly: {
      type: Boolean,
      value: false
    },

    /**
     * `focused` If true, the element currently has focus.
     */
    focused: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * `disabled` Set to true to mark the input as disabled.
     */
    disabled: {
      type: Boolean,
      value: false
    },

    /**
     * `source` Array of objects with the options to execute the autocomplete feature
     */
    source: {
      type: Array,
      observer: '_sourceChanged'
    },

    /**
     * Property of local datasource to as the text property
     */
    textProperty: {
      type: String,
      value: 'text'
    },

    /**
     * Property of local datasource to as the value property
     */
    valueProperty: {
      type: String,
      value: 'value'
    },

    /**
     * `value` Selected object from the suggestions
     */
    value: {
      type: Object,
      notify: true
    },

    /**
     * The current/selected text of the input
     */
    text: {
      type: String,
      notify: true,
      value: ''
    },

    /**
     * Disable showing the clear X button
     */
    disableShowClear: {
      type: Boolean,
      value: false
    },

    /**
     * Binds to a remote data source
     */
    remoteSource: {
      type: Boolean,
      value: false
    },

    /**
     * Event type separator
     */
    eventNamespace: {
      type: String,
      value: '-'
    },

    /**
     * Minimum length to trigger suggestions
     */
    minLength: {
      type: Number,
      value: 1
    },

    /**
     * `pattern` Pattern to validate input field
     */
    pattern: String,

    /**
     * allowedPattern` allowedPattern to validate input field
     */
    allowedPattern: String,

    /**
     * Set to `true` to show a character counter.
     */
    charCounter: {
      type: Boolean,
      value: false
    },

    /**
     * The maximum length of the input value.
     */
    maxlength: {
      type: Number
    },

    /**
     * Name to be used by the autocomplete input. This is necessary if wanted to be integrated with iron-form.
     */
    name: String,

    /**
     * Function used to filter available items. This function is actually used by paper-autocomplete-suggestions,
     * it is also exposed here so it is possible to provide a custom queryFn.
     */
    queryFn: {
      type: Function
    },

    /**
     * If `true`, it will always highlight the first result each time new suggestions are presented.
     */
    highlightFirst: {
      type: Boolean,
      value: false
    },

    /**
     * Set to `true` to show available suggestions on focus. This overrides the default behavior that only shows
     * notifications after user types
     */
    showResultsOnFocus: {
      type: Boolean,
      value: false
    },

    /*************
    * PRIVATE
    *************/
    // TODO: check if we need _value and _text properties. It seems they can be removed
    _value: {
      value: undefined
    },
    _text: {
      value: undefined
    },

    /**
     * Indicates whether the clear button is visible or not
     */
    _isClearButtonVisible: {
      type: Boolean,
      value: false
    },

    /**
     * Indicates whether the suggestion popup is visible or not.
     */
    _isSuggestionsOpened: {
      type: Boolean,
      value: false
    },

    /**
     * Object containing the information of the currently selected option
     */
    selectedOption: {
      type: Object,
      notify: true
    }
  },
  observers: ['_textObserver(text)'],
  _sourceChanged: function (newSource) {
    var text = this.text;

    if (!Array.isArray(newSource) || newSource.length === 0 || text === null || text.length < this.minLength) {
      return;
    }

    if (!this.$.autocompleteInput.focused) {
      return;
    }

    this.$.paperAutocompleteSuggestions._handleSuggestions({
      target: {
        value: text
      }
    });
  },
  // Element Lifecycle
  ready: function () {
    this._value = this.value;
    this.addEventListener('autocomplete' + this.eventNamespace + 'selected', this._onAutocompleteSelected.bind(this));
  },

  /**
   * Clears the input text
   */
  _clear: function () {
    var option = {
      text: this.text,
      value: this.value
    };
    this.value = null;
    this._value = null;
    this.text = '';
    this._text = '';

    this._fireEvent(option, 'reset-blur');

    this._hideClearButton(); // Fix: https://github.com/PolymerElements/paper-input/issues/493


    if (!this.$.autocompleteInput.focused) {
      this.$.autocompleteInput.focus();
    }
  },

  /**
   * Dispatches autocomplete events
   */
  _fireEvent: function (option, evt) {
    var id = this._getId();

    var event = 'autocomplete' + this.eventNamespace + evt;
    this.fire(event, {
      id: id,
      value: option[this.valueProperty] || option.value,
      text: option[this.textProperty] || option.text,
      target: this,
      option: option
    });
  },

  /**
   * On text event handler
   */
  _textObserver: function (text) {
    if (text && text.trim()) {
      this._showClearButton();
    } else {
      this._hideClearButton();
    }
  },

  /**
   * On autocomplete selection
   */
  _onAutocompleteSelected: function (event) {
    var selection = event.detail;
    this.value = selection.value;
    this.text = selection.text;
  },

  /**
   * Show the clear button (X)
   */
  _showClearButton: function () {
    if (this.disableShowClear) {
      return;
    }

    if (this._isClearButtonVisible) {
      return;
    }

    this.$.clear.style.display = 'inline-block';
    this._isClearButtonVisible = true;
  },

  /**
   * Hide the clear button (X)
   */
  _hideClearButton: function () {
    if (!this._isClearButtonVisible) {
      return;
    }

    this.$.clear.style.display = 'none';
    this._isClearButtonVisible = false;
  },
  _getId: function () {
    var id = this.getAttribute('id');
    if (!id) id = this.dataset.id;
    return id;
  },

  /****************************
   * PUBLIC
   ****************************/

  /**
   * Gets the current text/value option of the input
   * @returns {Object}
   */
  getOption: function () {
    return {
      text: this.text,
      value: this.value
    };
  },

  /**
   * Sets the current text/value option of the input
   * @param {Object} option
   */
  setOption: function (option) {
    this.text = option[this.textProperty] || option.text;
    this.value = option[this.valueProperty] || option.value;

    this._showClearButton();
  },

  /**
   * Disables the input
   */
  disable: function () {
    this.disabled = true;
  },

  /**
   * Enables the input
   */
  enable: function () {
    this.disabled = false;
  },

  /**
   * Sets the component's current suggestions
   * @param {Array} arr
   */
  suggestions: function (arr) {
    this.$.paperAutocompleteSuggestions.suggestions(arr);
  },

  /**
   * Validates the input
   * @returns {Boolean}
   */
  validate: function () {
    return this.$.autocompleteInput.validate();
  },

  /**
   * Clears the current input
   */
  clear: function () {
    this._value = '';
    this._text = '';

    this._clear();
  },

  /**
   * Resets the current input (DEPRECATED: please use clear)
   */
  reset: function () {
    this._clear();
  },

  /**
   * Hides the suggestions popup
   */
  hideSuggestions: function () {
    this._hideClearButton();

    this.$.paperAutocompleteSuggestions.hideSuggestions();
  },

  /**
   * Allows calling the onSelect function from outside
   * This in time triggers the autocomplete-selected event
   * with all the data required
   */
  onSelectHandler: function (event) {
    this.$.paperAutocompleteSuggestions._onSelect(event);
  }
  /**
   * Fired when a selection is made
   *
   * @event autocomplete-selected
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input change
   *
   * @event autocomplete-change
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input focus
   *
   * @event autocomplete-focus
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input blur
   *
   * @event autocomplete-blur
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

  /**
   * Fired on input reset/clear
   *
   * @event autocomplete-reset-blur
   * @param {String} id
   * @param {String} text
   * @param {Element} target
   * @param {Object} option
   */

});

/**
 * Open eXide to edit a given source document.
 *
 * @slot - unnamed default slot for the link text
 * @slot - unnamed slot for the link text when eXide tab is already opened
 */

class PbEditXml extends pbMixin(LitElement) {
  static get properties() {
    return Object.assign(Object.assign({}, super.properties), {}, {
      /**
       * expects a context-absolute path to the document to edit e.g. '/db/apps/tei-publisher/mytext.xml'
       */
      path: {
        type: String
      },

      /**
       * optional id reference to a pb-document
       */
      src: {
        type: String
      },

      /**
       * HTML title to be used
       */
      title: {
        type: String
      },
      _href: {
        type: String
      }
    });
  }

  constructor() {
    super();
    this.title = '';
  }

  connectedCallback() {
    super.connectedCallback();
    PbEditXml.waitOnce('pb-page-ready', options => {
      if (options.endpoint === '.') {
        this._href = '/exist/apps/eXide/';
      } else {
        const host = /^(.*:\/+[^/]+)\/.*$/.exec(options.endpoint);

        if (host) {
          this._href = `${host[1]}/exist/apps/eXide/`;
        } else {
          this._href = '/exist/apps/eXide/';
        }
      }
    });
  }

  render() {
    // if the target is within the same origin as the current page, we can communicate with an 
    // already opened eXide, if not, only option is to open a new window.
    if (new URL(this._href, window.location.href).origin === this.getUrl().origin) {
      return html$1`<a href="${this._href}" target="eXide" title="${this.title}" @click="${this.open}"><slot></slot></a>`;
    }

    return html$1`<a href="${this._href}/index.html?open=${this.path}" title="${this.title}"><slot></slot></a>`;
  }

  static get styles() {
    return css$1`
            :host {
                display: inline;
            }

            a {
                color: inherit;
                text-decoration: none;
            }
        `;
  }

  setPath(path) {
    this.path = path;
  }

  open(ev) {
    ev.preventDefault();
    let href = this._href;
    let path = this.path;

    if (this.src) {
      const sourceComponent = document.getElementById(this.src);
      path = sourceComponent.getFullPath();
      href = sourceComponent.sourceView;
    } // try to retrieve existing eXide window


    const exide = window.open("", "eXide");

    if (exide && !exide.closed) {
      // check if eXide is really available or it's an empty page
      const app = exide.eXide;

      if (app) {
        console.log("<pb-edit-xml> using existing eXide to open %s", path); // eXide is there

        exide.eXide.app.findDocument(path);
        exide.focus();
      } else {
        console.log("<pb-edit-xml> opening new eXide for %s", path);

        window.eXide_onload = function () {
          exide.eXide.app.findDocument(path);
        }; // empty page


        exide.location = href;
      }
    }
  }

}
customElements.define('pb-edit-xml', PbEditXml);

class Lumo extends HTMLElement {
  static get version() {
    return '1.6.1';
  }

}

customElements.define('vaadin-lumo-styles', Lumo);

const $_documentContainer$1 = document.createElement('template');
$_documentContainer$1.innerHTML = `<custom-style>
  <style>
    @font-face {
      font-family: 'lumo-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEcAAsAAAAAIiwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2MAABd4h9To2WhlYWQAAA3kAAAAMAAAADZa/6SsaGhlYQAADhQAAAAdAAAAJAbpA35obXR4AAAONAAAABAAAACspBAAAGxvY2EAAA5EAAAAWAAAAFh55IAsbWF4cAAADpwAAAAfAAAAIAFKAXBuYW1lAAAOvAAAATEAAAIuUUJZCHBvc3QAAA/wAAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wgc1Z9N0jpNnEL6kbRVS6HA2hQYGh9TGR1CbCqa2rXrWOkQE/sHNJgmtZvoVNZqE1B1DNHxzTQxCehUTYiJTQyENui0qSLezr3PduyQfgmRWOfde8+9551z7rnn/O4jLoJ/bRP0UaKQMLFJjpBAvphLZC3Dk0ok7WBzR2/upJs7Ryw/nfFbln/uuN/apCvwrKLrSvUqRufbm5pn0fs0w4gYxnGVP6qHnO4bWiDQGQgwtS6lm3lB3QoX1M2vwEmuzirF39y+Es2+DJ8d1pkyqBIqoze3D1+Zz4DrFoazxI8dWwMrDlZ2DMqQAR9AROsJU+2cmlTPazTco52F1xTa2a2+K8vvq92dVHmtLoPeQX/AZPRYGthDYOeZjBjKoFsVGulR3lWU95WeCK44qHU7MhWUGUKZDT3oKUcG2GWuh+EDDfUYA/jhAhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgRW95uEtpJ1Vfn9XiLriRBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKiflqHRSoWZc3m11Wa/fJdFgXD4sSYfleJBKd8GMz7J8dZn/cGRCcKGDnA2Ge3fKzcvlnTDNthGWLXzX/WaXtUAmRgeLlHSr30r0G9UTXMb0AtmwzOoy73fkSlHZkduw/TYuU9cAD4YutPoxTTsA3797wVr4Z/1NC5zARHr4vtxJjxIfiZMhMkbWk+14BnJZKwqGZwDfswLyxWDSg11rFLJF7Nopxjd1h1/QOT+oezgfu3Yq+Hk+duf5x+40o1GTkaIgikK/IEnC6aYxCUBaZJSN4XTYFjU/YMNIKqJwhDGOCCI8FDXnXmXjtGhGJyShqjAOnBOkW2JG9S7GgYeMWAU5JzhnWmBOaOM+CKEPoqSfFDC2Unq+DLlUgUVUFFLZGJg6jtlojsdsa8kPObPuJdi5dnBdBsLJMGTWDa4t2JvtwuPo9s+Y86suv/W33QG1rAaOAUV+vx4K6f2D04PVKlC7WLSrZzAi45ZV6lIC7WoXqmRyvUqoVwrzUoVsIjeTXWQv+RH5GTlBXiB/In8ln0IbBCAFOajAJrgZYyOHWqOfUe/aHjI12R6OQo1jCgt215l+4f6XPb+0MNou0V+43n2F77tSfRb24d7zitgnKmvYHs69zugaPvBwv6ioXkb2LdL65Atw51uLkXlu1bhMMRcXSPcYoqKIRlh34lQP8/5JbuUFye4vxD6/6MxFF11C0uVLr9Ulgw44tS3pMViNLUExbycFgLIct+QDMibRimx1ydUz8FXZiuOIDBOMVX2nUZc+huNE5XUJ81uiJoiabwqaVF0uacKbau/pl4R2VW0XXlJra6boVrYG646TF5NYzwy4vjENVrDlcNpZPl8DH6XX8XWCx0mvWVZY6KFLrvsY66/zPict5FnxaNUR/juvZCM3TvD60E2W1tZizbXTPDuabcm0nbbzpWKpmA1ayBQ8giedLUM+A0kNjBjQjmuYz7YrgIXYvmF63ZLBwSXrpn9Tb9wwdd/U1H0PMQK3XcO8ul3WT7PyPPdpy0TemKxNRcJNauiXJnnUDpUppQWs4SnUIy0EESGYqJYQLGHxzaGWwVIaS6Y7mQFM8ZjYDQ3axjf61SWjU33JwOZA1pwaG1L9mzf71aHRdX1JHw6Fp0aXhNwbqyeGNg4NbdzGCBxoz4ZXjy4Nu69Zr6sDY6vMrLU5nA1P8JkbdWXJ6ERfMryvNh1JfQ9+T4dIhGvK9w3dxjBBzatsQ/MlOHVIDnYpDz6odAXlQ01t2Pa5Iafd8MMpxAeDKP0C6CjgVLT5osB6icUx01lWjXxzT/GyRF2welEM5Z/7jG3VjQ1SrNn5IbyzOG5dobB3/QHxyZvsXcoz8IoEwS7plCg+zxHQk424q9BfEpkESJbFHQusDBSWFkuBkoPO0kLKwRVYjxGXlHTcTDQMJ/H6TX9afkO7mnraTO1feTnZAXLu4cp7HAXMmNG1yeFk9TgS/NHhZR/4QoBTr/ZB+6hCgyl15Nq1UbN6nE1/ZnP1U2cizCBpvs8cJQZJ4LkYx5N/yZPAUZNQQ0V4f3BQllWrK3YRzl30dOT6RVn2upNur6woSa8CqpdT/aKnBM4o3jNur9d9xqtUT6veBEt9Ca9at+ERzEEhUkR8sa5mQ4aVvJoVeEA8zI4ei5mULXFGyU7z/6TAeYLVcpzSWZY8PYYF5yrTV60sT0+XV141vX++Wf16V2bFeGVPZXxFpkvyeKTWLlzfW0mnKxsY6Y3294/0998SCfX1blm5pbcvFGlq/r07MRAMhYIDiW5JFKWW3vdrEpCsZSJG+om7Zu/PSScZJhNkLbmW5Wsr12pWqW5zKtlwRS4bFOxUw17mCzy6lskCDl1WYOGWDYrADrMA7BDDweWWNd5koiJnR1dz+ytLP2q0SqPB1lnK2ccB7RYe4FSoPks3iB3t4txTSHctb2sy1ivk0pvHuCNm6w1f6wxv3+OCgN78LqdQnUVh7R0oTAp0zOf2rbW770Vu5C2dIyGdTnHo8zSji7dppj0USoVCz+lhRMTh53Teq9VbGfbjuSbAooSdXayY4PYHg374C6f7gl1B/DXuJ4/QXxOBdJFJspFsI3egpoWUUCjlTIFnNYNl+ZyZKmBeYKGHkD1QyDlhaKbKwKcIJqJ4TLJ2OmdY/JWXae4DdGBw8HZ7eXcgFF2zr2SoalDry5iKqoa0Puhe3hPQ2s3elTYM+MI+n3rK0KgL7/La3GeMLt6m7u912vGnvtORiIa0qBmhqVi+XW9XNBmqb8eVgKzIHfGI5bNoG7X0UCzeISmqIcO/nY8FH7U8avX9fx/ST+hx0sezPw9Qy8Mum3GWf2N4Uy/yIYGVBXbJHWIZp7dfTcptdMTr9Qmq7DaiK/ukqCL4kt4RUfS5XPnMtmT22/mQFqF7emSqtrlu8SVElxDRJrZODkpuwe0VfTfjdEp1f7A7v+fozNBXUJ/6WTuK2TtFlpFVZAZ3LcFvUi1Z2p2YT+EMAkGJVStOzLTAPg4IqWIAlzRSjOBkl2zxj3TKycpzT/MnvX3uaSMWM+gU0rkXjohhefVRMaps3/kLMSKv23lT23uxQrkQjyOJleMDsdhAnD6ZGElWZ5MjCXzCE/hkWX+WF4knzGhVOyK2eQZekV3eyo0zL8kuYWCnDCvjjhAkcTPOBDXVdoav3HVcFnQjLvtV9S2p0zA6JegPwMQxt+yFb3ll9zGlq/5dRKb3cEyQYoaNYpharJ7xCB7AWxsLY3jjZXY0XsZj0Wjwc9I6PP/dKABnCZaqHpaZEACxk4ZeLZSKNgZABl+lYQX1sJQOSX3n6r410evcoud5JeAGUXVP9H1tZOKejTq4Ono0z0erro1FrnOpohva1d/hTdtVsQdKN5W9RlT3NjD0nznyKNTgKAMfWNWcyodV0IGLPIHOF0o4JyqufaK4z6WIIzuGh3d8c8cwQg8ER+OVxyrjdm8vNuhts4LoOihGxIMuUdgzwiYN7xhh1+oZnJNuTG7gQZvu4XWZ9GAZZjGEubwePqYhtKDTH+9VQkl17/iGybsnJ+8+sKtyPrcll9ty65Zsdst/9iqpEKh7M5VdBxh3csOdNc6tW3I1uyM1PzOXegSOrLFsFNI2O27M+TF2ApnN9MUv5ud6LjxIvEQnHRzxIu4IsA9MLFkJn2tcZoZ7ON7dXe7ujrc8HrusPKamlqXwd77lQUuLpilau4PUMapueBb7irU4RoUXEYXuVuIGlRGmOp+2lNkaRPVziOqmlaZvaqG4dFgSj0jxEJWrv12IUWntmw+rfQarRE0Aph4ocI6nlUlGqs+u3/+T/ethW62PpHp2eHbZstnh/wOO95yDAHicY2BkYGAA4pmJ6QHx/DZfGbiZXwBFGGpUNzQi6P+vmacy3QJyORiYQKIANoULVXicY2BkYGAO+p8FJF8wAAHzVAZGBlSgDQBW9gNvAAAAeJxjYGBgYH4xNDAAzwQmjwAAAAAATgCaAOgBCgEsAU4BcAGaAcQB7gIaApwC6ASaBLwE1gTyBQ4FKgV6BdAF/gZEBmYGtgcYB5AIGAhSCGoI/glGCb4J2goECjwKggq4CvALUAuWC7x4nGNgZGBg0GZMYRBlAAEmIOYCQgaG/2A+AwAYlAG8AHicbZE9TsMwGIbf9A/RSggEYmHxAgtq+jN2ZGj3Dt3T1GlTOXHkuBW9AyfgEByCgTNwCA7BW/NJlVBtyd/jx+8XKwmAa3whwnFE6Ib1OBq44O6Pm6Qb4Rb5QbiNHh6FO/RD4S6eMRHu4RaaT4halzR3eBVu4Apvwk36d+EW+UO4jXt8Cnfov4W7WOBHuIen6MXsCtvPU1vWc73emcSdxIkW2tW5LdUoHp7kTJfaJV6v1PKg6v167H2mMmcLNbWl18ZYVTm71amPN95Xk8EgEx+ntoDBDgUs+siRspaoMef7rukNEriziXNuwS7Hmoe9wggxv+e55IzJMqQTeNYV00scuNbY8+YxrUfGfcaMZb/CNPQe04bT0lThbEuT0sfYhK6K/23Amf3Lx+H24hcj4GScAAAAeJxtjtlugzAQRbkJUEJIuu/7vqR8lGNPAcWx0YAb5e/LklR96EgenSufGY038PqKvf9rhgGG8BEgxA4ijBBjjAQTTLGLPezjAIc4wjFOcIoznOMCl7jCNW5wizvc4wGPeMIzXvCKN7zjAzN8eonQRWZSSaYmjvug6ase98hFltexMJmmVNmV2WBvdNgZUc+ujAWzXW3UDnu1w43asStHc8GpzAXX/py0jqTQZJTgkcxJLpaCF0lD32xNt+43tAsn29Dft02uDKS2cjGUNgsk26qK2lFthYoU27INPqmiDqg5goe0pqR5qSoqMdek/CUZFywL46rEsiImleqiqoMyt4baXlu/1GLdNFf5zbcNmdr1YUWCZe47o+zUmb/DoStbw3cVsef9ALjjiPQA) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --lumo-icons-align-center: "\\ea01";
      --lumo-icons-align-left: "\\ea02";
      --lumo-icons-align-right: "\\ea03";
      --lumo-icons-angle-down: "\\ea04";
      --lumo-icons-angle-left: "\\ea05";
      --lumo-icons-angle-right: "\\ea06";
      --lumo-icons-angle-up: "\\ea07";
      --lumo-icons-arrow-down: "\\ea08";
      --lumo-icons-arrow-left: "\\ea09";
      --lumo-icons-arrow-right: "\\ea0a";
      --lumo-icons-arrow-up: "\\ea0b";
      --lumo-icons-bar-chart: "\\ea0c";
      --lumo-icons-bell: "\\ea0d";
      --lumo-icons-calendar: "\\ea0e";
      --lumo-icons-checkmark: "\\ea0f";
      --lumo-icons-chevron-down: "\\ea10";
      --lumo-icons-chevron-left: "\\ea11";
      --lumo-icons-chevron-right: "\\ea12";
      --lumo-icons-chevron-up: "\\ea13";
      --lumo-icons-clock: "\\ea14";
      --lumo-icons-cog: "\\ea15";
      --lumo-icons-cross: "\\ea16";
      --lumo-icons-download: "\\ea17";
      --lumo-icons-dropdown: "\\ea18";
      --lumo-icons-edit: "\\ea19";
      --lumo-icons-error: "\\ea1a";
      --lumo-icons-eye: "\\ea1b";
      --lumo-icons-eye-disabled: "\\ea1c";
      --lumo-icons-menu: "\\ea1d";
      --lumo-icons-minus: "\\ea1e";
      --lumo-icons-ordered-list: "\\ea1f";
      --lumo-icons-phone: "\\ea20";
      --lumo-icons-photo: "\\ea21";
      --lumo-icons-play: "\\ea22";
      --lumo-icons-plus: "\\ea23";
      --lumo-icons-redo: "\\ea24";
      --lumo-icons-reload: "\\ea25";
      --lumo-icons-search: "\\ea26";
      --lumo-icons-undo: "\\ea27";
      --lumo-icons-unordered-list: "\\ea28";
      --lumo-icons-upload: "\\ea29";
      --lumo-icons-user: "\\ea2a";
    }
  </style>
</custom-style>`;
document.head.appendChild($_documentContainer$1.content);

const $_documentContainer$2 = document.createElement('template');
$_documentContainer$2.innerHTML = `<custom-style>
  <style>
    html {
      /* Base (background) */
      --lumo-base-color: #FFF;

      /* Tint */
      --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
      --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
      --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
      --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
      --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
      --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
      --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
      --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
      --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
      --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
      --lumo-tint: #FFF;

      /* Shade */
      --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
      --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
      --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
      --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
      --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
      --lumo-shade-50pct: hsla(214, 45%, 20%, 0.5);
      --lumo-shade-60pct: hsla(214, 43%, 19%, 0.61);
      --lumo-shade-70pct: hsla(214, 42%, 18%, 0.72);
      --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
      --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
      --lumo-shade: hsl(214, 35%, 15%);

      /* Contrast */
      --lumo-contrast-5pct: var(--lumo-shade-5pct);
      --lumo-contrast-10pct: var(--lumo-shade-10pct);
      --lumo-contrast-20pct: var(--lumo-shade-20pct);
      --lumo-contrast-30pct: var(--lumo-shade-30pct);
      --lumo-contrast-40pct: var(--lumo-shade-40pct);
      --lumo-contrast-50pct: var(--lumo-shade-50pct);
      --lumo-contrast-60pct: var(--lumo-shade-60pct);
      --lumo-contrast-70pct: var(--lumo-shade-70pct);
      --lumo-contrast-80pct: var(--lumo-shade-80pct);
      --lumo-contrast-90pct: var(--lumo-shade-90pct);
      --lumo-contrast: var(--lumo-shade);

      /* Text */
      --lumo-header-text-color: var(--lumo-contrast);
      --lumo-body-text-color: var(--lumo-contrast-90pct);
      --lumo-secondary-text-color: var(--lumo-contrast-70pct);
      --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
      --lumo-disabled-text-color: var(--lumo-contrast-30pct);

      /* Primary */
      --lumo-primary-color: hsl(214, 90%, 52%);
      --lumo-primary-color-50pct: hsla(214, 90%, 52%, 0.5);
      --lumo-primary-color-10pct: hsla(214, 90%, 52%, 0.1);
      --lumo-primary-text-color: var(--lumo-primary-color);
      --lumo-primary-contrast-color: #FFF;

      /* Error */
      --lumo-error-color: hsl(3, 100%, 61%);
      --lumo-error-color-50pct: hsla(3, 100%, 60%, 0.5);
      --lumo-error-color-10pct: hsla(3, 100%, 60%, 0.1);
      --lumo-error-text-color: hsl(3, 92%, 53%);
      --lumo-error-contrast-color: #FFF;

      /* Success */
      --lumo-success-color: hsl(145, 80%, 42%); /* hsl(144,82%,37%); */
      --lumo-success-color-50pct: hsla(145, 76%, 44%, 0.55);
      --lumo-success-color-10pct: hsla(145, 76%, 44%, 0.12);
      --lumo-success-text-color: hsl(145, 100%, 32%);
      --lumo-success-contrast-color: #FFF;
    }
  </style>
</custom-style><dom-module id="lumo-color">
  <template>
    <style>
      [theme~="dark"] {
        /* Base (background) */
        --lumo-base-color: hsl(214, 35%, 21%);

        /* Tint */
        --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
        --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
        --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
        --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
        --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
        --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
        --lumo-tint-60pct: hsla(214, 82%, 90%, 0.6);
        --lumo-tint-70pct: hsla(214, 87%, 92%, 0.7);
        --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
        --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
        --lumo-tint: hsl(214, 100%, 98%);

        /* Shade */
        --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
        --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
        --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
        --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
        --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
        --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
        --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
        --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
        --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
        --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
        --lumo-shade: hsl(214, 33%, 13%);

        /* Contrast */
        --lumo-contrast-5pct: var(--lumo-tint-5pct);
        --lumo-contrast-10pct: var(--lumo-tint-10pct);
        --lumo-contrast-20pct: var(--lumo-tint-20pct);
        --lumo-contrast-30pct: var(--lumo-tint-30pct);
        --lumo-contrast-40pct: var(--lumo-tint-40pct);
        --lumo-contrast-50pct: var(--lumo-tint-50pct);
        --lumo-contrast-60pct: var(--lumo-tint-60pct);
        --lumo-contrast-70pct: var(--lumo-tint-70pct);
        --lumo-contrast-80pct: var(--lumo-tint-80pct);
        --lumo-contrast-90pct: var(--lumo-tint-90pct);
        --lumo-contrast: var(--lumo-tint);

        /* Text */
        --lumo-header-text-color: var(--lumo-contrast);
        --lumo-body-text-color: var(--lumo-contrast-90pct);
        --lumo-secondary-text-color: var(--lumo-contrast-70pct);
        --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
        --lumo-disabled-text-color: var(--lumo-contrast-30pct);

        /* Primary */
        --lumo-primary-color: hsl(214, 86%, 55%);
        --lumo-primary-color-50pct: hsla(214, 86%, 55%, 0.5);
        --lumo-primary-color-10pct: hsla(214, 90%, 63%, 0.1);
        --lumo-primary-text-color: hsl(214, 100%, 70%);
        --lumo-primary-contrast-color: #FFF;

        /* Error */
        --lumo-error-color: hsl(3, 90%, 63%);
        --lumo-error-color-50pct: hsla(3, 90%, 63%, 0.5);
        --lumo-error-color-10pct: hsla(3, 90%, 63%, 0.1);
        --lumo-error-text-color: hsl(3, 100%, 67%);

        /* Success */
        --lumo-success-color: hsl(145, 65%, 42%);
        --lumo-success-color-50pct: hsla(145, 65%, 42%, 0.5);
        --lumo-success-color-10pct: hsla(145, 65%, 42%, 0.1);
        --lumo-success-text-color: hsl(145, 85%, 47%);
      }

      html {
        color: var(--lumo-body-text-color);
        background-color: var(--lumo-base-color);
      }

      [theme~="dark"] {
        color: var(--lumo-body-text-color);
        background-color: var(--lumo-base-color);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--lumo-header-text-color);
      }

      a {
        color: var(--lumo-primary-text-color);
      }

      blockquote {
        color: var(--lumo-secondary-text-color);
      }

      code,
      pre {
        background-color: var(--lumo-contrast-10pct);
        border-radius: var(--lumo-border-radius-m);
      }
    </style>
  </template>
</dom-module><dom-module id="lumo-color-legacy">
  <template>
    <style include="lumo-color">
      :host {
        color: var(--lumo-body-text-color) !important;
        background-color: var(--lumo-base-color) !important;
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer$2.content);

const $_documentContainer$3 = document.createElement('template');
$_documentContainer$3.innerHTML = `<custom-style>
  <style>
    html {
      --lumo-size-xs: 1.625rem;
      --lumo-size-s: 1.875rem;
      --lumo-size-m: 2.25rem;
      --lumo-size-l: 2.75rem;
      --lumo-size-xl: 3.5rem;

      /* Icons */
      --lumo-icon-size-s: 1.25em;
      --lumo-icon-size-m: 1.5em;
      --lumo-icon-size-l: 2.25em;
      /* For backwards compatibility */
      --lumo-icon-size: var(--lumo-icon-size-m);
    }
  </style>
</custom-style>`;
document.head.appendChild($_documentContainer$3.content);

const $_documentContainer$4 = document.createElement('template');
$_documentContainer$4.innerHTML = `<custom-style>
  <style>
    html {
      /* Square */
      --lumo-space-xs: 0.25rem;
      --lumo-space-s: 0.5rem;
      --lumo-space-m: 1rem;
      --lumo-space-l: 1.5rem;
      --lumo-space-xl: 2.5rem;

      /* Wide */
      --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
      --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
      --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
      --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
      --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

      /* Tall */
      --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
      --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
      --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
      --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
      --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
    }
  </style>
</custom-style>`;
document.head.appendChild($_documentContainer$4.content);

const $_documentContainer$5 = document.createElement('template');
$_documentContainer$5.innerHTML = `<custom-style>
  <style>
    html {
      /* Border radius */
      --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
      --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
      --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */
      --lumo-border-radius: 0.25em; /* Deprecated */

      /* Shadow */
      --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
      --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
      --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
      --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
      --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

      /* Clickable element cursor */
      --lumo-clickable-cursor: default;
    }
  </style>
</custom-style>`;
document.head.appendChild($_documentContainer$5.content);

const $_documentContainer$6 = document.createElement('template');
$_documentContainer$6.innerHTML = `<custom-style>
  <style>
    html {
      /* Font families */
      --lumo-font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

      /* Font sizes */
      --lumo-font-size-xxs: .75rem;
      --lumo-font-size-xs: .8125rem;
      --lumo-font-size-s: .875rem;
      --lumo-font-size-m: 1rem;
      --lumo-font-size-l: 1.125rem;
      --lumo-font-size-xl: 1.375rem;
      --lumo-font-size-xxl: 1.75rem;
      --lumo-font-size-xxxl: 2.5rem;

      /* Line heights */
      --lumo-line-height-xs: 1.25;
      --lumo-line-height-s: 1.375;
      --lumo-line-height-m: 1.625;
    }

  </style>
</custom-style><dom-module id="lumo-typography">
  <template>
    <style>
      html {
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size, var(--lumo-font-size-m));
        line-height: var(--lumo-line-height-m);
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Can’t combine with the above selector because that doesn’t work in browsers without native shadow dom */
      :host {
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size, var(--lumo-font-size-m));
        line-height: var(--lumo-line-height-m);
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      small,
      [theme~="font-size-s"] {
        font-size: var(--lumo-font-size-s);
        line-height: var(--lumo-line-height-s);
      }

      [theme~="font-size-xs"] {
        font-size: var(--lumo-font-size-xs);
        line-height: var(--lumo-line-height-xs);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 600;
        line-height: var(--lumo-line-height-xs);
        margin-top: 1.25em;
      }

      h1 {
        font-size: var(--lumo-font-size-xxxl);
        margin-bottom: 0.75em;
      }

      h2 {
        font-size: var(--lumo-font-size-xxl);
        margin-bottom: 0.5em;
      }

      h3 {
        font-size: var(--lumo-font-size-xl);
        margin-bottom: 0.5em;
      }

      h4 {
        font-size: var(--lumo-font-size-l);
        margin-bottom: 0.5em;
      }

      h5 {
        font-size: var(--lumo-font-size-m);
        margin-bottom: 0.25em;
      }

      h6 {
        font-size: var(--lumo-font-size-xs);
        margin-bottom: 0;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      p,
      blockquote {
        margin-top: 0.5em;
        margin-bottom: 0.75em;
      }

      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      hr {
        display: block;
        align-self: stretch;
        height: 1px;
        border: 0;
        padding: 0;
        margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
        background-color: var(--lumo-contrast-10pct);
      }

      blockquote {
        border-left: 2px solid var(--lumo-contrast-30pct);
      }

      b,
      strong {
        font-weight: 600;
      }

      /* RTL specific styles */

      blockquote[dir="rtl"] {
        border-left: none;
        border-right: 2px solid var(--lumo-contrast-30pct);
      }

    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer$6.content);

/**
 * @polymerMixin
 */
const ThemePropertyMixin = superClass => class VaadinThemePropertyMixin extends superClass {
  static get properties() {
    return {
      /**
       * Helper property with theme attribute value facilitating propagation
       * in shadow DOM.
       *
       * Enables the component implementation to propagate the `theme`
       * attribute value to the subcomponents in Shadow DOM by binding
       * the subcomponent’s "theme" attribute to the `theme` property of
       * the host.
       *
       * **NOTE:** Extending the mixin only provides the property for binding,
       * and does not make the propagation alone.
       *
       * See [Theme Attribute and Subcomponents](https://github.com/vaadin/vaadin-themable-mixin/wiki/5.-Theme-Attribute-and-Subcomponents).
       * page for more information.
       *
       * @protected
       */
      theme: {
        type: String,
        readOnly: true
      }
    };
  }
  /** @protected */


  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'theme') {
      this._setTheme(newValue);
    }
  }

};

/**
 * @polymerMixin
 * @mixes ThemePropertyMixin
 */

const ThemableMixin = superClass => class VaadinThemableMixin extends ThemePropertyMixin(superClass) {
  /** @protected */
  static finalize() {
    super.finalize();
    const template = this.prototype._template;
    const hasOwnTemplate = this.template && this.template.parentElement && this.template.parentElement.id === this.is;

    const inheritedTemplate = Object.getPrototypeOf(this.prototype)._template;

    if (inheritedTemplate && !hasOwnTemplate) {
      // The element doesn't define its own template -> include the theme modules from the inherited template
      Array.from(inheritedTemplate.content.querySelectorAll('style[include]')).forEach(s => {
        this._includeStyle(s.getAttribute('include'), template);
      });
    }

    this._includeMatchingThemes(template);
  }
  /** @private */


  static _includeMatchingThemes(template) {
    const domModule = DomModule;
    const modules = domModule.prototype.modules;
    let hasThemes = false;
    const defaultModuleName = this.is + '-default-theme';
    Object.keys(modules).sort((moduleNameA, moduleNameB) => {
      const vaadinA = moduleNameA.indexOf('vaadin-') === 0;
      const vaadinB = moduleNameB.indexOf('vaadin-') === 0;
      const vaadinThemePrefixes = ['lumo-', 'material-'];
      const vaadinThemeA = vaadinThemePrefixes.filter(prefix => moduleNameA.indexOf(prefix) === 0).length > 0;
      const vaadinThemeB = vaadinThemePrefixes.filter(prefix => moduleNameB.indexOf(prefix) === 0).length > 0;

      if (vaadinA !== vaadinB) {
        // Include vaadin core styles first
        return vaadinA ? -1 : 1;
      } else if (vaadinThemeA !== vaadinThemeB) {
        // Include vaadin theme styles after that
        return vaadinThemeA ? -1 : 1;
      } else {
        // Lastly include custom styles so they override all vaadin styles
        return 0;
      }
    }).forEach(moduleName => {
      if (moduleName !== defaultModuleName) {
        const themeFor = modules[moduleName].getAttribute('theme-for');

        if (themeFor) {
          themeFor.split(' ').forEach(themeForToken => {
            if (new RegExp('^' + themeForToken.split('*').join('.*') + '$').test(this.is)) {
              hasThemes = true;

              this._includeStyle(moduleName, template);
            }
          });
        }
      }
    });

    if (!hasThemes && modules[defaultModuleName]) {
      // No theme modules found, include the default module if it exists
      this._includeStyle(defaultModuleName, template);
    }
  }
  /** @private */


  static _includeStyle(moduleName, template) {
    if (template && !template.content.querySelector(`style[include="${moduleName}"]`)) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('include', moduleName);
      template.content.appendChild(styleEl);
    }
  }

};

/**
@license
Copyright (c) 2020 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/

/**
 * Helper that provides a set of functions for RTL.
 */
class DirHelper {
  /**
   * Get the scroll type in the current browser view.
   *
   * @return {string} the scroll type. Possible values are `default|reverse|negative`
   */
  static detectScrollType() {
    const dummy = document.createElement('div');
    dummy.textContent = 'ABCD';
    dummy.dir = 'rtl';
    dummy.style.fontSize = '14px';
    dummy.style.width = '4px';
    dummy.style.height = '1px';
    dummy.style.position = 'absolute';
    dummy.style.top = '-1000px';
    dummy.style.overflow = 'scroll';
    document.body.appendChild(dummy);
    let cachedType = 'reverse';

    if (dummy.scrollLeft > 0) {
      cachedType = 'default';
    } else {
      dummy.scrollLeft = 2;

      if (dummy.scrollLeft < 2) {
        cachedType = 'negative';
      }
    }

    document.body.removeChild(dummy);
    return cachedType;
  }
  /**
   * Get the scrollLeft value of the element relative to the direction
   *
   * @param {string} scrollType type of the scroll detected with `detectScrollType`
   * @param {string} direction current direction of the element
   * @param {Element} element
   * @return {number} the scrollLeft value.
  */


  static getNormalizedScrollLeft(scrollType, direction, element) {
    const {
      scrollLeft
    } = element;

    if (direction !== 'rtl' || !scrollType) {
      return scrollLeft;
    }

    switch (scrollType) {
      case 'negative':
        return element.scrollWidth - element.clientWidth + scrollLeft;

      case 'reverse':
        return element.scrollWidth - element.clientWidth - scrollLeft;
    }

    return scrollLeft;
  }
  /**
   * Set the scrollLeft value of the element relative to the direction
   *
   * @param {string} scrollType type of the scroll detected with `detectScrollType`
   * @param {string} direction current direction of the element
   * @param {Element} element
   * @param {number} scrollLeft the scrollLeft value to be set
   */


  static setNormalizedScrollLeft(scrollType, direction, element, scrollLeft) {
    if (direction !== 'rtl' || !scrollType) {
      element.scrollLeft = scrollLeft;
      return;
    }

    switch (scrollType) {
      case 'negative':
        element.scrollLeft = element.clientWidth - element.scrollWidth + scrollLeft;
        break;

      case 'reverse':
        element.scrollLeft = element.scrollWidth - element.clientWidth - scrollLeft;
        break;

      default:
        element.scrollLeft = scrollLeft;
        break;
    }
  }

}

/**
 * Array of Vaadin custom element classes that have been subscribed to the dir changes.
 */

const directionSubscribers = [];

const directionUpdater = function () {
  const documentDir = getDocumentDir();
  directionSubscribers.forEach(element => {
    alignDirs(element, documentDir);
  });
};

let scrollType;
const directionObserver = new MutationObserver(directionUpdater);
directionObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['dir']
});

const alignDirs = function (element, documentDir) {
  if (documentDir) {
    element.setAttribute('dir', documentDir);
  } else {
    element.removeAttribute('dir');
  }
};

const getDocumentDir = function () {
  return document.documentElement.getAttribute('dir');
};
/**
 * @polymerMixin
 */


const DirMixin = superClass => class VaadinDirMixin extends superClass {
  static get properties() {
    return {
      /**
       * @protected
       */
      dir: {
        type: String,
        readOnly: true
      }
    };
  }
  /** @protected */


  static finalize() {
    super.finalize();

    if (!scrollType) {
      scrollType = DirHelper.detectScrollType();
    }
  }
  /** @protected */


  connectedCallback() {
    super.connectedCallback();

    if (!this.hasAttribute('dir')) {
      this.__subscribe();

      alignDirs(this, getDocumentDir());
    }
  }
  /** @protected */


  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name !== 'dir') {
      return;
    } // New value equals to the document direction and the element is not subscribed to the changes


    const newValueEqlDocDir = newValue === getDocumentDir() && directionSubscribers.indexOf(this) === -1; // Value was emptied and the element is not subscribed to the changes

    const newValueEmptied = !newValue && oldValue && directionSubscribers.indexOf(this) === -1; // New value is different and the old equals to document direction and the element is not subscribed to the changes

    const newDiffValue = newValue !== getDocumentDir() && oldValue === getDocumentDir();

    if (newValueEqlDocDir || newValueEmptied) {
      this.__subscribe();

      alignDirs(this, getDocumentDir());
    } else if (newDiffValue) {
      this.__subscribe(false);
    }
  }
  /** @protected */


  disconnectedCallback() {
    super.disconnectedCallback();

    this.__subscribe(false);

    this.removeAttribute('dir');
  }
  /** @private */


  __subscribe(push = true) {
    if (push) {
      directionSubscribers.indexOf(this) === -1 && directionSubscribers.push(this);
    } else {
      directionSubscribers.indexOf(this) > -1 && directionSubscribers.splice(directionSubscribers.indexOf(this), 1);
    }
  }
  /**
   * @param {Element} element
   * @return {number}
   * @protected
   */


  __getNormalizedScrollLeft(element) {
    return DirHelper.getNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', element);
  }
  /**
   * @param {Element} element
   * @param {number} scrollLeft
   * @protected
   */


  __setNormalizedScrollLeft(element, scrollLeft) {
    return DirHelper.setNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', element, scrollLeft);
  }

};

const DEV_MODE_CODE_REGEXP = /\/\*\*\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;
const FlowClients = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;

function isMinified() {
  function test() {
    /** vaadin-dev-mode:start
    return false;
    vaadin-dev-mode:end **/
    return true;
  }

  return uncommentAndRun(test);
}

function isDevelopmentMode() {
  try {
    if (isForcedDevelopmentMode()) {
      return true;
    }

    if (!isLocalhost()) {
      return false;
    }

    if (FlowClients) {
      return !isFlowProductionMode();
    }

    return !isMinified();
  } catch (e) {
    // Some error in this code, assume production so no further actions will be taken
    return false;
  }
}

function isForcedDevelopmentMode() {
  return localStorage.getItem("vaadin.developmentmode.force");
}

function isLocalhost() {
  return ["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0;
}

function isFlowProductionMode() {
  if (FlowClients) {
    const productionModeApps = Object.keys(FlowClients).map(key => FlowClients[key]).filter(client => client.productionMode);

    if (productionModeApps.length > 0) {
      return true;
    }
  }

  return false;
}

function uncommentAndRun(callback, args) {
  if (typeof callback !== 'function') {
    return;
  }

  const match = DEV_MODE_CODE_REGEXP.exec(callback.toString());

  if (match) {
    try {
      // requires CSP: script-src 'unsafe-eval'
      callback = new Function(match[1]);
    } catch (e) {
      // eat the exception
      console.log('vaadin-development-mode-detector: uncommentAndRun() failed', e);
    }
  }

  return callback(args);
} // A guard against polymer-modulizer removing the window.Vaadin
// initialization above.


window['Vaadin'] = window['Vaadin'] || {};
/**
 * Inspects the source code of the given `callback` function for
 * specially-marked _commented_ code. If such commented code is found in the
 * callback source, uncomments and runs that code instead of the callback
 * itself. Otherwise runs the callback as is.
 *
 * The optional arguments are passed into the callback / uncommented code,
 * the result is returned.
 *
 * See the `isMinified()` function source code in this file for an example.
 *
 */

const runIfDevelopmentMode = function (callback, args) {
  if (window.Vaadin.developmentMode) {
    return uncommentAndRun(callback, args);
  }
};

if (window.Vaadin.developmentMode === undefined) {
  window.Vaadin.developmentMode = isDevelopmentMode();
}

/* This file is autogenerated from src/vaadin-usage-statistics.tpl.html */

function maybeGatherAndSendStats() {
  /** vaadin-dev-mode:start
  (function () {
  'use strict';
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
  } : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
  };
  var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
   return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
  }();
  var getPolymerVersion = function getPolymerVersion() {
  return window.Polymer && window.Polymer.version;
  };
  var StatisticsGatherer = function () {
  function StatisticsGatherer(logger) {
    classCallCheck(this, StatisticsGatherer);
     this.now = new Date().getTime();
    this.logger = logger;
  }
   createClass(StatisticsGatherer, [{
    key: 'frameworkVersionDetectors',
    value: function frameworkVersionDetectors() {
      return {
        'Flow': function Flow() {
          if (window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients) {
            var flowVersions = Object.keys(window.Vaadin.Flow.clients).map(function (key) {
              return window.Vaadin.Flow.clients[key];
            }).filter(function (client) {
              return client.getVersionInfo;
            }).map(function (client) {
              return client.getVersionInfo().flow;
            });
            if (flowVersions.length > 0) {
              return flowVersions[0];
            }
          }
        },
        'Vaadin Framework': function VaadinFramework() {
          if (window.vaadin && window.vaadin.clients) {
            var frameworkVersions = Object.values(window.vaadin.clients).filter(function (client) {
              return client.getVersionInfo;
            }).map(function (client) {
              return client.getVersionInfo().vaadinVersion;
            });
            if (frameworkVersions.length > 0) {
              return frameworkVersions[0];
            }
          }
        },
        'AngularJs': function AngularJs() {
          if (window.angular && window.angular.version && window.angular.version) {
            return window.angular.version.full;
          }
        },
        'Angular': function Angular() {
          if (window.ng) {
            var tags = document.querySelectorAll("[ng-version]");
            if (tags.length > 0) {
              return tags[0].getAttribute("ng-version");
            }
            return "Unknown";
          }
        },
        'Backbone.js': function BackboneJs() {
          if (window.Backbone) {
            return window.Backbone.VERSION;
          }
        },
        'React': function React() {
          var reactSelector = '[data-reactroot], [data-reactid]';
          if (!!document.querySelector(reactSelector)) {
            // React does not publish the version by default
            return "unknown";
          }
        },
        'Ember': function Ember() {
          if (window.Em && window.Em.VERSION) {
            return window.Em.VERSION;
          } else if (window.Ember && window.Ember.VERSION) {
            return window.Ember.VERSION;
          }
        },
        'jQuery': function (_jQuery) {
          function jQuery() {
            return _jQuery.apply(this, arguments);
          }
           jQuery.toString = function () {
            return _jQuery.toString();
          };
           return jQuery;
        }(function () {
          if (typeof jQuery === 'function' && jQuery.prototype.jquery !== undefined) {
            return jQuery.prototype.jquery;
          }
        }),
        'Polymer': function Polymer() {
          var version = getPolymerVersion();
          if (version) {
            return version;
          }
        },
        'LitElement': function LitElement() {
          var version = window.litElementVersions && window.litElementVersions[0];
          if (version) {
            return version;
          }
        },
        'LitHtml': function LitHtml() {
          var version = window.litHtmlVersions && window.litHtmlVersions[0];
          if (version) {
            return version;
          }
        },
        'Vue.js': function VueJs() {
          if (window.Vue) {
            return window.Vue.version;
          }
        }
      };
    }
  }, {
    key: 'getUsedVaadinElements',
    value: function getUsedVaadinElements(elements) {
      var version = getPolymerVersion();
      var elementClasses = void 0;
      // NOTE: In case you edit the code here, YOU MUST UPDATE any statistics reporting code in Flow.
      // Check all locations calling the method getEntries() in
      // https://github.com/vaadin/flow/blob/master/flow-server/src/main/java/com/vaadin/flow/internal/UsageStatistics.java#L106
      // Currently it is only used by BootstrapHandler.
      if (version && version.indexOf('2') === 0) {
        // Polymer 2: components classes are stored in window.Vaadin
        elementClasses = Object.keys(window.Vaadin).map(function (c) {
          return window.Vaadin[c];
        }).filter(function (c) {
          return c.is;
        });
      } else {
        // Polymer 3: components classes are stored in window.Vaadin.registrations
        elementClasses = window.Vaadin.registrations || [];
      }
      elementClasses.forEach(function (klass) {
        var version = klass.version ? klass.version : "0.0.0";
        elements[klass.is] = { version: version };
      });
    }
  }, {
    key: 'getUsedVaadinThemes',
    value: function getUsedVaadinThemes(themes) {
      ['Lumo', 'Material'].forEach(function (themeName) {
        var theme;
        var version = getPolymerVersion();
        if (version && version.indexOf('2') === 0) {
          // Polymer 2: themes are stored in window.Vaadin
          theme = window.Vaadin[themeName];
        } else {
          // Polymer 3: themes are stored in custom element registry
          theme = customElements.get('vaadin-' + themeName.toLowerCase() + '-styles');
        }
        if (theme && theme.version) {
          themes[themeName] = { version: theme.version };
        }
      });
    }
  }, {
    key: 'getFrameworks',
    value: function getFrameworks(frameworks) {
      var detectors = this.frameworkVersionDetectors();
      Object.keys(detectors).forEach(function (framework) {
        var detector = detectors[framework];
        try {
          var version = detector();
          if (version) {
            frameworks[framework] = { version: version };
          }
        } catch (e) {}
      });
    }
  }, {
    key: 'gather',
    value: function gather(storage) {
      var storedStats = storage.read();
      var gatheredStats = {};
      var types = ["elements", "frameworks", "themes"];
       types.forEach(function (type) {
        gatheredStats[type] = {};
        if (!storedStats[type]) {
          storedStats[type] = {};
        }
      });
       var previousStats = JSON.stringify(storedStats);
       this.getUsedVaadinElements(gatheredStats.elements);
      this.getFrameworks(gatheredStats.frameworks);
      this.getUsedVaadinThemes(gatheredStats.themes);
       var now = this.now;
      types.forEach(function (type) {
        var keys = Object.keys(gatheredStats[type]);
        keys.forEach(function (key) {
          if (!storedStats[type][key] || _typeof(storedStats[type][key]) != _typeof({})) {
            storedStats[type][key] = { firstUsed: now };
          }
          // Discards any previously logged version number
          storedStats[type][key].version = gatheredStats[type][key].version;
          storedStats[type][key].lastUsed = now;
        });
      });
       var newStats = JSON.stringify(storedStats);
      storage.write(newStats);
      if (newStats != previousStats && Object.keys(storedStats).length > 0) {
        this.logger.debug("New stats: " + newStats);
      }
    }
  }]);
  return StatisticsGatherer;
  }();
  var StatisticsStorage = function () {
  function StatisticsStorage(key) {
    classCallCheck(this, StatisticsStorage);
     this.key = key;
  }
   createClass(StatisticsStorage, [{
    key: 'read',
    value: function read() {
      var localStorageStatsString = localStorage.getItem(this.key);
      try {
        return JSON.parse(localStorageStatsString ? localStorageStatsString : '{}');
      } catch (e) {
        return {};
      }
    }
  }, {
    key: 'write',
    value: function write(data) {
      localStorage.setItem(this.key, data);
    }
  }, {
    key: 'clear',
    value: function clear() {
      localStorage.removeItem(this.key);
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      var storedStats = this.read();
      var empty = true;
      Object.keys(storedStats).forEach(function (key) {
        if (Object.keys(storedStats[key]).length > 0) {
          empty = false;
        }
      });
       return empty;
    }
  }]);
  return StatisticsStorage;
  }();
  var StatisticsSender = function () {
  function StatisticsSender(url, logger) {
    classCallCheck(this, StatisticsSender);
     this.url = url;
    this.logger = logger;
  }
   createClass(StatisticsSender, [{
    key: 'send',
    value: function send(data, errorHandler) {
      var logger = this.logger;
       if (navigator.onLine === false) {
        logger.debug("Offline, can't send");
        errorHandler();
        return;
      }
      logger.debug("Sending data to " + this.url);
       var req = new XMLHttpRequest();
      req.withCredentials = true;
      req.addEventListener("load", function () {
        // Stats sent, nothing more to do
        logger.debug("Response: " + req.responseText);
      });
      req.addEventListener("error", function () {
        logger.debug("Send failed");
        errorHandler();
      });
      req.addEventListener("abort", function () {
        logger.debug("Send aborted");
        errorHandler();
      });
      req.open("POST", this.url);
      req.setRequestHeader("Content-Type", "application/json");
      req.send(data);
    }
  }]);
  return StatisticsSender;
  }();
  var StatisticsLogger = function () {
  function StatisticsLogger(id) {
    classCallCheck(this, StatisticsLogger);
     this.id = id;
  }
   createClass(StatisticsLogger, [{
    key: '_isDebug',
    value: function _isDebug() {
      return localStorage.getItem("vaadin." + this.id + ".debug");
    }
  }, {
    key: 'debug',
    value: function debug(msg) {
      if (this._isDebug()) {
        console.info(this.id + ": " + msg);
      }
    }
  }]);
  return StatisticsLogger;
  }();
  var UsageStatistics = function () {
  function UsageStatistics() {
    classCallCheck(this, UsageStatistics);
     this.now = new Date();
    this.timeNow = this.now.getTime();
    this.gatherDelay = 10; // Delay between loading this file and gathering stats
    this.initialDelay = 24 * 60 * 60;
     this.logger = new StatisticsLogger("statistics");
    this.storage = new StatisticsStorage("vaadin.statistics.basket");
    this.gatherer = new StatisticsGatherer(this.logger);
    this.sender = new StatisticsSender("https://tools.vaadin.com/usage-stats/submit", this.logger);
  }
   createClass(UsageStatistics, [{
    key: 'maybeGatherAndSend',
    value: function maybeGatherAndSend() {
      var _this = this;
       if (localStorage.getItem(UsageStatistics.optOutKey)) {
        return;
      }
      this.gatherer.gather(this.storage);
      setTimeout(function () {
        _this.maybeSend();
      }, this.gatherDelay * 1000);
    }
  }, {
    key: 'lottery',
    value: function lottery() {
      return true;
    }
  }, {
    key: 'currentMonth',
    value: function currentMonth() {
      return this.now.getYear() * 12 + this.now.getMonth();
    }
  }, {
    key: 'maybeSend',
    value: function maybeSend() {
      var firstUse = Number(localStorage.getItem(UsageStatistics.firstUseKey));
      var monthProcessed = Number(localStorage.getItem(UsageStatistics.monthProcessedKey));
       if (!firstUse) {
        // Use a grace period to avoid interfering with tests, incognito mode etc
        firstUse = this.timeNow;
        localStorage.setItem(UsageStatistics.firstUseKey, firstUse);
      }
       if (this.timeNow < firstUse + this.initialDelay * 1000) {
        this.logger.debug("No statistics will be sent until the initial delay of " + this.initialDelay + "s has passed");
        return;
      }
      if (this.currentMonth() <= monthProcessed) {
        this.logger.debug("This month has already been processed");
        return;
      }
      localStorage.setItem(UsageStatistics.monthProcessedKey, this.currentMonth());
      // Use random sampling
      if (this.lottery()) {
        this.logger.debug("Congratulations, we have a winner!");
      } else {
        this.logger.debug("Sorry, no stats from you this time");
        return;
      }
       this.send();
    }
  }, {
    key: 'send',
    value: function send() {
      // Ensure we have the latest data
      this.gatherer.gather(this.storage);
       // Read, send and clean up
      var data = this.storage.read();
      data["firstUse"] = Number(localStorage.getItem(UsageStatistics.firstUseKey));
      data["usageStatisticsVersion"] = UsageStatistics.version;
      var info = 'This request contains usage statistics gathered from the application running in development mode. \n\nStatistics gathering is automatically disabled and excluded from production builds.\n\nFor details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.\n\n\n\n';
      var self = this;
      this.sender.send(info + JSON.stringify(data), function () {
        // Revert the 'month processed' flag
        localStorage.setItem(UsageStatistics.monthProcessedKey, self.currentMonth() - 1);
      });
    }
  }], [{
    key: 'version',
    get: function get$1() {
      return '2.1.0';
    }
  }, {
    key: 'firstUseKey',
    get: function get$1() {
      return 'vaadin.statistics.firstuse';
    }
  }, {
    key: 'monthProcessedKey',
    get: function get$1() {
      return 'vaadin.statistics.monthProcessed';
    }
  }, {
    key: 'optOutKey',
    get: function get$1() {
      return 'vaadin.statistics.optout';
    }
  }]);
  return UsageStatistics;
  }();
  try {
  window.Vaadin = window.Vaadin || {};
  window.Vaadin.usageStatsChecker = window.Vaadin.usageStatsChecker || new UsageStatistics();
  window.Vaadin.usageStatsChecker.maybeGatherAndSend();
  } catch (e) {
  // Intentionally ignored as this is not a problem in the app being developed
  }
  }());
   vaadin-dev-mode:end **/
}

const usageStatistics = function () {
  if (typeof runIfDevelopmentMode === 'function') {
    return runIfDevelopmentMode(maybeGatherAndSendStats);
  }
};

if (!window.Vaadin) {
  window['Vaadin'] = {};
}
/**
 * Array of Vaadin custom element classes that have been finalized.
 */


window['Vaadin'].registrations = window.Vaadin.registrations || []; // Use the hack to prevent polymer-modulizer from converting to exports

window['Vaadin'].developmentModeCallback = window.Vaadin.developmentModeCallback || {};

window['Vaadin'].developmentModeCallback['vaadin-usage-statistics'] = function () {
  if (usageStatistics) {
    usageStatistics();
  }
};

let statsJob;
const registered = new Set();
/**
 * @polymerMixin
 * @mixes DirMixin
 */

const ElementMixin = superClass => class VaadinElementMixin extends DirMixin(superClass) {
  /** @protected */
  static finalize() {
    super.finalize();
    const {
      is
    } = this; // Registers a class prototype for telemetry purposes.

    if (is && !registered.has(is)) {
      window.Vaadin.registrations.push(this);
      registered.add(is);

      if (window.Vaadin.developmentModeCallback) {
        statsJob = Debouncer.debounce(statsJob, idlePeriod, () => {
          window.Vaadin.developmentModeCallback['vaadin-usage-statistics']();
        });
        enqueueDebouncer(statsJob);
      }
    }
  }

  constructor() {
    super();

    if (document.doctype === null) {
      console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.');
    }
  }

};

// Kludges for bugs and behavior differences that can't be feature
// detected are enabled based on userAgent etc sniffing.
let userAgent = navigator.userAgent;
let platform = navigator.platform;
let gecko = /gecko\/\d/i.test(userAgent);
let ie_upto10 = /MSIE \d/.test(userAgent);
let ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
let edge = /Edge\/(\d+)/.exec(userAgent);
let ie = ie_upto10 || ie_11up || edge;
let ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
let webkit = !edge && /WebKit\//.test(userAgent);
let qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
let chrome = !edge && /Chrome\//.test(userAgent);
let presto = /Opera\//.test(userAgent);
let safari = /Apple Computer/.test(navigator.vendor);
let mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
let phantom = /PhantomJS/.test(userAgent);
let ios = safari && (/Mobile\/\w+/.test(userAgent) || navigator.maxTouchPoints > 2);
let android = /Android/.test(userAgent); // This is woefully incomplete. Suggestions for alternative methods welcome.

let mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
let mac = ios || /Mac/.test(platform);
let chromeOS = /\bCrOS\b/.test(userAgent);
let windows = /win/i.test(platform);
let presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
if (presto_version) presto_version = Number(presto_version[1]);

if (presto_version && presto_version >= 15) {
  presto = false;
  webkit = true;
} // Some browsers use the wrong event properties to signal cmd/ctrl on OS X


let flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
let captureRightClick = gecko || ie && ie_version >= 9;

function classTest(cls) {
  return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
}
let rmClass = function (node, cls) {
  let current = node.className;
  let match = classTest(cls).exec(current);

  if (match) {
    let after = current.slice(match.index + match[0].length);
    node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
  }
};
function removeChildren(e) {
  for (let count = e.childNodes.length; count > 0; --count) e.removeChild(e.firstChild);

  return e;
}
function removeChildrenAndAdd(parent, e) {
  return removeChildren(parent).appendChild(e);
}
function elt(tag, content, className, style) {
  let e = document.createElement(tag);
  if (className) e.className = className;
  if (style) e.style.cssText = style;
  if (typeof content == "string") e.appendChild(document.createTextNode(content));else if (content) for (let i = 0; i < content.length; ++i) e.appendChild(content[i]);
  return e;
} // wrapper for elt, which removes the elt from the accessibility tree

function eltP(tag, content, className, style) {
  let e = elt(tag, content, className, style);
  e.setAttribute("role", "presentation");
  return e;
}
let range;
if (document.createRange) range = function (node, start, end, endNode) {
  let r = document.createRange();
  r.setEnd(endNode || node, end);
  r.setStart(node, start);
  return r;
};else range = function (node, start, end) {
  let r = document.body.createTextRange();

  try {
    r.moveToElementText(node.parentNode);
  } catch (e) {
    return r;
  }

  r.collapse(true);
  r.moveEnd("character", end);
  r.moveStart("character", start);
  return r;
};
function contains(parent, child) {
  if (child.nodeType == 3) // Android browser always returns false when child is a textnode
    child = child.parentNode;
  if (parent.contains) return parent.contains(child);

  do {
    if (child.nodeType == 11) child = child.host;
    if (child == parent) return true;
  } while (child = child.parentNode);
}
function activeElt() {
  // IE and Edge may throw an "Unspecified Error" when accessing document.activeElement.
  // IE < 10 will throw when accessed while the page is loading or in an iframe.
  // IE > 9 and Edge will throw when accessed in an iframe if document.body is unavailable.
  let activeElement;

  try {
    activeElement = document.activeElement;
  } catch (e) {
    activeElement = document.body || null;
  }

  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) activeElement = activeElement.shadowRoot.activeElement;

  return activeElement;
}
function addClass(node, cls) {
  let current = node.className;
  if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
}
function joinClasses(a, b) {
  let as = a.split(" ");

  for (let i = 0; i < as.length; i++) if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];

  return b;
}
let selectInput = function (node) {
  node.select();
};
if (ios) // Mobile Safari apparently has a bug where select() is broken.
  selectInput = function (node) {
    node.selectionStart = 0;
    node.selectionEnd = node.value.length;
  };else if (ie) // Suppress mysterious IE10 errors
  selectInput = function (node) {
    try {
      node.select();
    } catch (_e) {}
  };

function bind(f) {
  let args = Array.prototype.slice.call(arguments, 1);
  return function () {
    return f.apply(null, args);
  };
}
function copyObj(obj, target, overwrite) {
  if (!target) target = {};

  for (let prop in obj) if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop))) target[prop] = obj[prop];

  return target;
} // Counts the column offset in a string, taking tabs into account.
// Used mostly to find indentation.

function countColumn(string, end, tabSize, startIndex, startValue) {
  if (end == null) {
    end = string.search(/[^\s\u00a0]/);
    if (end == -1) end = string.length;
  }

  for (let i = startIndex || 0, n = startValue || 0;;) {
    let nextTab = string.indexOf("\t", i);
    if (nextTab < 0 || nextTab >= end) return n + (end - i);
    n += nextTab - i;
    n += tabSize - n % tabSize;
    i = nextTab + 1;
  }
}
class Delayed {
  constructor() {
    this.id = null;
    this.f = null;
    this.time = 0;
    this.handler = bind(this.onTimeout, this);
  }

  onTimeout(self) {
    self.id = 0;

    if (self.time <= +new Date()) {
      self.f();
    } else {
      setTimeout(self.handler, self.time - +new Date());
    }
  }

  set(ms, f) {
    this.f = f;
    const time = +new Date() + ms;

    if (!this.id || time < this.time) {
      clearTimeout(this.id);
      this.id = setTimeout(this.handler, ms);
      this.time = time;
    }
  }

}
function indexOf(array, elt) {
  for (let i = 0; i < array.length; ++i) if (array[i] == elt) return i;

  return -1;
} // Number of pixels added to scroller and sizer to hide scrollbar

let scrollerGap = 50; // Returned or thrown by various protocols to signal 'I'm not
// handling this'.

let Pass = {
  toString: function () {
    return "CodeMirror.Pass";
  }
}; // Reused option objects for setSelection & friends

let sel_dontScroll = {
  scroll: false
},
    sel_mouse = {
  origin: "*mouse"
},
    sel_move = {
  origin: "+move"
}; // The inverse of countColumn -- find the offset that corresponds to
// a particular column.

function findColumn(string, goal, tabSize) {
  for (let pos = 0, col = 0;;) {
    let nextTab = string.indexOf("\t", pos);
    if (nextTab == -1) nextTab = string.length;
    let skipped = nextTab - pos;
    if (nextTab == string.length || col + skipped >= goal) return pos + Math.min(skipped, goal - col);
    col += nextTab - pos;
    col += tabSize - col % tabSize;
    pos = nextTab + 1;
    if (col >= goal) return pos;
  }
}
let spaceStrs = [""];
function spaceStr(n) {
  while (spaceStrs.length <= n) spaceStrs.push(lst(spaceStrs) + " ");

  return spaceStrs[n];
}
function lst(arr) {
  return arr[arr.length - 1];
}
function map(array, f) {
  let out = [];

  for (let i = 0; i < array.length; i++) out[i] = f(array[i], i);

  return out;
}
function insertSorted(array, value, score) {
  let pos = 0,
      priority = score(value);

  while (pos < array.length && score(array[pos]) <= priority) pos++;

  array.splice(pos, 0, value);
}

function nothing() {}

function createObj(base, props) {
  let inst;

  if (Object.create) {
    inst = Object.create(base);
  } else {
    nothing.prototype = base;
    inst = new nothing();
  }

  if (props) copyObj(props, inst);
  return inst;
}
let nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
function isWordCharBasic(ch) {
  return /\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
}
function isWordChar(ch, helper) {
  if (!helper) return isWordCharBasic(ch);
  if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
  return helper.test(ch);
}
function isEmpty(obj) {
  for (let n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;

  return true;
} // Extending unicode characters. A series of a non-extending char +
// any number of extending chars is treated as a single unit as far
// as editing and measuring is concerned. This is not fully correct,
// since some scripts/fonts/browsers also treat other configurations
// of code points as a group.

let extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
function isExtendingChar(ch) {
  return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
} // Returns a number from the range [`0`; `str.length`] unless `pos` is outside that range.

function skipExtendingChars(str, pos, dir) {
  while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos))) pos += dir;

  return pos;
} // Returns the value from the range [`from`; `to`] that satisfies
// `pred` and is closest to `from`. Assumes that at least `to`
// satisfies `pred`. Supports `from` being greater than `to`.

function findFirst(pred, from, to) {
  // At any point we are certain `to` satisfies `pred`, don't know
  // whether `from` does.
  let dir = from > to ? -1 : 1;

  for (;;) {
    if (from == to) return from;
    let midF = (from + to) / 2,
        mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
    if (mid == from) return pred(mid) ? from : to;
    if (pred(mid)) to = mid;else from = mid + dir;
  }
}

function iterateBidiSections(order, from, to, f) {
  if (!order) return f(from, to, "ltr", 0);
  let found = false;

  for (let i = 0; i < order.length; ++i) {
    let part = order[i];

    if (part.from < to && part.to > from || from == to && part.to == from) {
      f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr", i);
      found = true;
    }
  }

  if (!found) f(from, to, "ltr");
}
let bidiOther = null;
function getBidiPartAt(order, ch, sticky) {
  let found;
  bidiOther = null;

  for (let i = 0; i < order.length; ++i) {
    let cur = order[i];
    if (cur.from < ch && cur.to > ch) return i;

    if (cur.to == ch) {
      if (cur.from != cur.to && sticky == "before") found = i;else bidiOther = i;
    }

    if (cur.from == ch) {
      if (cur.from != cur.to && sticky != "before") found = i;else bidiOther = i;
    }
  }

  return found != null ? found : bidiOther;
} // Bidirectional ordering algorithm
// See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
// that this (partially) implements.
// One-char codes used for character types:
// L (L):   Left-to-Right
// R (R):   Right-to-Left
// r (AL):  Right-to-Left Arabic
// 1 (EN):  European Number
// + (ES):  European Number Separator
// % (ET):  European Number Terminator
// n (AN):  Arabic Number
// , (CS):  Common Number Separator
// m (NSM): Non-Spacing Mark
// b (BN):  Boundary Neutral
// s (B):   Paragraph Separator
// t (S):   Segment Separator
// w (WS):  Whitespace
// N (ON):  Other Neutrals
// Returns null if characters are ordered as they appear
// (left-to-right), or an array of sections ({from, to, level}
// objects) in the order in which they occur visually.

let bidiOrdering = function () {
  // Character types for codepoints 0 to 0xff
  let lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN"; // Character types for codepoints 0x600 to 0x6f9

  let arabicTypes = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";

  function charType(code) {
    if (code <= 0xf7) return lowTypes.charAt(code);else if (0x590 <= code && code <= 0x5f4) return "R";else if (0x600 <= code && code <= 0x6f9) return arabicTypes.charAt(code - 0x600);else if (0x6ee <= code && code <= 0x8ac) return "r";else if (0x2000 <= code && code <= 0x200b) return "w";else if (code == 0x200c) return "b";else return "L";
  }

  let bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
  let isNeutral = /[stwN]/,
      isStrong = /[LRr]/,
      countsAsLeft = /[Lb1n]/,
      countsAsNum = /[1n]/;

  function BidiSpan(level, from, to) {
    this.level = level;
    this.from = from;
    this.to = to;
  }

  return function (str, direction) {
    let outerType = direction == "ltr" ? "L" : "R";
    if (str.length == 0 || direction == "ltr" && !bidiRE.test(str)) return false;
    let len = str.length,
        types = [];

    for (let i = 0; i < len; ++i) types.push(charType(str.charCodeAt(i))); // W1. Examine each non-spacing mark (NSM) in the level run, and
    // change the type of the NSM to the type of the previous
    // character. If the NSM is at the start of the level run, it will
    // get the type of sor.


    for (let i = 0, prev = outerType; i < len; ++i) {
      let type = types[i];
      if (type == "m") types[i] = prev;else prev = type;
    } // W2. Search backwards from each instance of a European number
    // until the first strong type (R, L, AL, or sor) is found. If an
    // AL is found, change the type of the European number to Arabic
    // number.
    // W3. Change all ALs to R.


    for (let i = 0, cur = outerType; i < len; ++i) {
      let type = types[i];
      if (type == "1" && cur == "r") types[i] = "n";else if (isStrong.test(type)) {
        cur = type;
        if (type == "r") types[i] = "R";
      }
    } // W4. A single European separator between two European numbers
    // changes to a European number. A single common separator between
    // two numbers of the same type changes to that type.


    for (let i = 1, prev = types[0]; i < len - 1; ++i) {
      let type = types[i];
      if (type == "+" && prev == "1" && types[i + 1] == "1") types[i] = "1";else if (type == "," && prev == types[i + 1] && (prev == "1" || prev == "n")) types[i] = prev;
      prev = type;
    } // W5. A sequence of European terminators adjacent to European
    // numbers changes to all European numbers.
    // W6. Otherwise, separators and terminators change to Other
    // Neutral.


    for (let i = 0; i < len; ++i) {
      let type = types[i];
      if (type == ",") types[i] = "N";else if (type == "%") {
        let end;

        for (end = i + 1; end < len && types[end] == "%"; ++end) {}

        let replace = i && types[i - 1] == "!" || end < len && types[end] == "1" ? "1" : "N";

        for (let j = i; j < end; ++j) types[j] = replace;

        i = end - 1;
      }
    } // W7. Search backwards from each instance of a European number
    // until the first strong type (R, L, or sor) is found. If an L is
    // found, then change the type of the European number to L.


    for (let i = 0, cur = outerType; i < len; ++i) {
      let type = types[i];
      if (cur == "L" && type == "1") types[i] = "L";else if (isStrong.test(type)) cur = type;
    } // N1. A sequence of neutrals takes the direction of the
    // surrounding strong text if the text on both sides has the same
    // direction. European and Arabic numbers act as if they were R in
    // terms of their influence on neutrals. Start-of-level-run (sor)
    // and end-of-level-run (eor) are used at level run boundaries.
    // N2. Any remaining neutrals take the embedding direction.


    for (let i = 0; i < len; ++i) {
      if (isNeutral.test(types[i])) {
        let end;

        for (end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}

        let before = (i ? types[i - 1] : outerType) == "L";
        let after = (end < len ? types[end] : outerType) == "L";
        let replace = before == after ? before ? "L" : "R" : outerType;

        for (let j = i; j < end; ++j) types[j] = replace;

        i = end - 1;
      }
    } // Here we depart from the documented algorithm, in order to avoid
    // building up an actual levels array. Since there are only three
    // levels (0, 1, 2) in an implementation that doesn't take
    // explicit embedding into account, we can build up the order on
    // the fly, without following the level-based algorithm.


    let order = [],
        m;

    for (let i = 0; i < len;) {
      if (countsAsLeft.test(types[i])) {
        let start = i;

        for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}

        order.push(new BidiSpan(0, start, i));
      } else {
        let pos = i,
            at = order.length,
            isRTL = direction == "rtl" ? 1 : 0;

        for (++i; i < len && types[i] != "L"; ++i) {}

        for (let j = pos; j < i;) {
          if (countsAsNum.test(types[j])) {
            if (pos < j) {
              order.splice(at, 0, new BidiSpan(1, pos, j));
              at += isRTL;
            }

            let nstart = j;

            for (++j; j < i && countsAsNum.test(types[j]); ++j) {}

            order.splice(at, 0, new BidiSpan(2, nstart, j));
            at += isRTL;
            pos = j;
          } else ++j;
        }

        if (pos < i) order.splice(at, 0, new BidiSpan(1, pos, i));
      }
    }

    if (direction == "ltr") {
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
        order[0].from = m[0].length;
        order.unshift(new BidiSpan(0, 0, m[0].length));
      }

      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
        lst(order).to -= m[0].length;
        order.push(new BidiSpan(0, len - m[0].length, len));
      }
    }

    return direction == "rtl" ? order.reverse() : order;
  };
}(); // Get the bidi ordering for the given line (and cache it). Returns
// false for lines that are fully left-to-right, and an array of
// BidiSpan objects otherwise.


function getOrder(line, direction) {
  let order = line.order;
  if (order == null) order = line.order = bidiOrdering(line.text, direction);
  return order;
}

// Lightweight event framework. on/off also work on DOM nodes,
// registering native DOM handlers.

const noHandlers = [];
let on = function (emitter, type, f) {
  if (emitter.addEventListener) {
    emitter.addEventListener(type, f, false);
  } else if (emitter.attachEvent) {
    emitter.attachEvent("on" + type, f);
  } else {
    let map = emitter._handlers || (emitter._handlers = {});
    map[type] = (map[type] || noHandlers).concat(f);
  }
};
function getHandlers(emitter, type) {
  return emitter._handlers && emitter._handlers[type] || noHandlers;
}
function off(emitter, type, f) {
  if (emitter.removeEventListener) {
    emitter.removeEventListener(type, f, false);
  } else if (emitter.detachEvent) {
    emitter.detachEvent("on" + type, f);
  } else {
    let map = emitter._handlers,
        arr = map && map[type];

    if (arr) {
      let index = indexOf(arr, f);
      if (index > -1) map[type] = arr.slice(0, index).concat(arr.slice(index + 1));
    }
  }
}
function signal(emitter, type
/*, values...*/
) {
  let handlers = getHandlers(emitter, type);
  if (!handlers.length) return;
  let args = Array.prototype.slice.call(arguments, 2);

  for (let i = 0; i < handlers.length; ++i) handlers[i].apply(null, args);
} // The DOM events that CodeMirror handles can be overridden by
// registering a (non-DOM) handler on the editor for the event name,
// and preventDefault-ing the event in that handler.

function signalDOMEvent(cm, e, override) {
  if (typeof e == "string") e = {
    type: e,
    preventDefault: function () {
      this.defaultPrevented = true;
    }
  };
  signal(cm, override || e.type, cm, e);
  return e_defaultPrevented(e) || e.codemirrorIgnore;
}
function signalCursorActivity(cm) {
  let arr = cm._handlers && cm._handlers.cursorActivity;
  if (!arr) return;
  let set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);

  for (let i = 0; i < arr.length; ++i) if (indexOf(set, arr[i]) == -1) set.push(arr[i]);
}
function hasHandler(emitter, type) {
  return getHandlers(emitter, type).length > 0;
} // Add on and off methods to a constructor's prototype, to make
// registering events on such objects more convenient.

function eventMixin(ctor) {
  ctor.prototype.on = function (type, f) {
    on(this, type, f);
  };

  ctor.prototype.off = function (type, f) {
    off(this, type, f);
  };
} // Due to the fact that we still support jurassic IE versions, some
// compatibility wrappers are needed.

function e_preventDefault(e) {
  if (e.preventDefault) e.preventDefault();else e.returnValue = false;
}
function e_stopPropagation(e) {
  if (e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
}
function e_defaultPrevented(e) {
  return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
}
function e_stop(e) {
  e_preventDefault(e);
  e_stopPropagation(e);
}
function e_target(e) {
  return e.target || e.srcElement;
}
function e_button(e) {
  let b = e.which;

  if (b == null) {
    if (e.button & 1) b = 1;else if (e.button & 2) b = 3;else if (e.button & 4) b = 2;
  }

  if (mac && e.ctrlKey && b == 1) b = 3;
  return b;
}

let dragAndDrop = function () {
  // There is *some* kind of drag-and-drop support in IE6-8, but I
  // couldn't get it to work yet.
  if (ie && ie_version < 9) return false;
  let div = elt('div');
  return "draggable" in div || "dragDrop" in div;
}();
let zwspSupported;
function zeroWidthElement(measure) {
  if (zwspSupported == null) {
    let test = elt("span", "\u200b");
    removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
    if (measure.firstChild.offsetHeight != 0) zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
  }

  let node = zwspSupported ? elt("span", "\u200b") : elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
  node.setAttribute("cm-text", "");
  return node;
} // Feature-detect IE's crummy client rect reporting for bidi text

let badBidiRects;
function hasBadBidiRects(measure) {
  if (badBidiRects != null) return badBidiRects;
  let txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
  let r0 = range(txt, 0, 1).getBoundingClientRect();
  let r1 = range(txt, 1, 2).getBoundingClientRect();
  removeChildren(measure);
  if (!r0 || r0.left == r0.right) return false; // Safari returns null in some cases (#2780)

  return badBidiRects = r1.right - r0.right < 3;
} // See if "".split is the broken IE version, if so, provide an
// alternative way to split lines.

let splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? string => {
  let pos = 0,
      result = [],
      l = string.length;

  while (pos <= l) {
    let nl = string.indexOf("\n", pos);
    if (nl == -1) nl = string.length;
    let line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
    let rt = line.indexOf("\r");

    if (rt != -1) {
      result.push(line.slice(0, rt));
      pos += rt + 1;
    } else {
      result.push(line);
      pos = nl + 1;
    }
  }

  return result;
} : string => string.split(/\r\n?|\n/);
let hasSelection = window.getSelection ? te => {
  try {
    return te.selectionStart != te.selectionEnd;
  } catch (e) {
    return false;
  }
} : te => {
  let range;

  try {
    range = te.ownerDocument.selection.createRange();
  } catch (e) {}

  if (!range || range.parentElement() != te) return false;
  return range.compareEndPoints("StartToEnd", range) != 0;
};
let hasCopyEvent = (() => {
  let e = elt("div");
  if ("oncopy" in e) return true;
  e.setAttribute("oncopy", "return;");
  return typeof e.oncopy == "function";
})();
let badZoomedRects = null;
function hasBadZoomedRects(measure) {
  if (badZoomedRects != null) return badZoomedRects;
  let node = removeChildrenAndAdd(measure, elt("span", "x"));
  let normal = node.getBoundingClientRect();
  let fromRange = range(node, 0, 1).getBoundingClientRect();
  return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
}

let modes = {},
    mimeModes = {}; // Extra arguments are stored as the mode's dependencies, which is
// used by (legacy) mechanisms like loadmode.js to automatically
// load a mode. (Preferred mechanism is the require/define calls.)

function defineMode(name, mode) {
  if (arguments.length > 2) mode.dependencies = Array.prototype.slice.call(arguments, 2);
  modes[name] = mode;
}
function defineMIME(mime, spec) {
  mimeModes[mime] = spec;
} // Given a MIME type, a {name, ...options} config object, or a name
// string, return a mode config object.

function resolveMode(spec) {
  if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
    spec = mimeModes[spec];
  } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
    let found = mimeModes[spec.name];
    if (typeof found == "string") found = {
      name: found
    };
    spec = createObj(found, spec);
    spec.name = found.name;
  } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
    return resolveMode("application/xml");
  } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
    return resolveMode("application/json");
  }

  if (typeof spec == "string") return {
    name: spec
  };else return spec || {
    name: "null"
  };
} // Given a mode spec (anything that resolveMode accepts), find and
// initialize an actual mode object.

function getMode(options, spec) {
  spec = resolveMode(spec);
  let mfactory = modes[spec.name];
  if (!mfactory) return getMode(options, "text/plain");
  let modeObj = mfactory(options, spec);

  if (modeExtensions.hasOwnProperty(spec.name)) {
    let exts = modeExtensions[spec.name];

    for (let prop in exts) {
      if (!exts.hasOwnProperty(prop)) continue;
      if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
      modeObj[prop] = exts[prop];
    }
  }

  modeObj.name = spec.name;
  if (spec.helperType) modeObj.helperType = spec.helperType;
  if (spec.modeProps) for (let prop in spec.modeProps) modeObj[prop] = spec.modeProps[prop];
  return modeObj;
} // This can be used to attach properties to mode objects from
// outside the actual mode definition.

let modeExtensions = {};
function extendMode(mode, properties) {
  let exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
  copyObj(properties, exts);
}
function copyState(mode, state) {
  if (state === true) return state;
  if (mode.copyState) return mode.copyState(state);
  let nstate = {};

  for (let n in state) {
    let val = state[n];
    if (val instanceof Array) val = val.concat([]);
    nstate[n] = val;
  }

  return nstate;
} // Given a mode and a state (for that mode), find the inner mode and
// state at the position that the state refers to.

function innerMode(mode, state) {
  let info;

  while (mode.innerMode) {
    info = mode.innerMode(state);
    if (!info || info.mode == mode) break;
    state = info.state;
    mode = info.mode;
  }

  return info || {
    mode: mode,
    state: state
  };
}
function startState(mode, a1, a2) {
  return mode.startState ? mode.startState(a1, a2) : true;
}

// Fed to the mode parsers, provides helper functions to make
// parsers more succinct.

class StringStream {
  constructor(string, tabSize, lineOracle) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
    this.lineStart = 0;
    this.lineOracle = lineOracle;
  }

  eol() {
    return this.pos >= this.string.length;
  }

  sol() {
    return this.pos == this.lineStart;
  }

  peek() {
    return this.string.charAt(this.pos) || undefined;
  }

  next() {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
  }

  eat(match) {
    let ch = this.string.charAt(this.pos);
    let ok;
    if (typeof match == "string") ok = ch == match;else ok = ch && (match.test ? match.test(ch) : match(ch));

    if (ok) {
      ++this.pos;
      return ch;
    }
  }

  eatWhile(match) {
    let start = this.pos;

    while (this.eat(match)) {}

    return this.pos > start;
  }

  eatSpace() {
    let start = this.pos;

    while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;

    return this.pos > start;
  }

  skipToEnd() {
    this.pos = this.string.length;
  }

  skipTo(ch) {
    let found = this.string.indexOf(ch, this.pos);

    if (found > -1) {
      this.pos = found;
      return true;
    }
  }

  backUp(n) {
    this.pos -= n;
  }

  column() {
    if (this.lastColumnPos < this.start) {
      this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
      this.lastColumnPos = this.start;
    }

    return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
  }

  indentation() {
    return countColumn(this.string, null, this.tabSize) - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
  }

  match(pattern, consume, caseInsensitive) {
    if (typeof pattern == "string") {
      let cased = str => caseInsensitive ? str.toLowerCase() : str;

      let substr = this.string.substr(this.pos, pattern.length);

      if (cased(substr) == cased(pattern)) {
        if (consume !== false) this.pos += pattern.length;
        return true;
      }
    } else {
      let match = this.string.slice(this.pos).match(pattern);
      if (match && match.index > 0) return null;
      if (match && consume !== false) this.pos += match[0].length;
      return match;
    }
  }

  current() {
    return this.string.slice(this.start, this.pos);
  }

  hideFirstChars(n, inner) {
    this.lineStart += n;

    try {
      return inner();
    } finally {
      this.lineStart -= n;
    }
  }

  lookAhead(n) {
    let oracle = this.lineOracle;
    return oracle && oracle.lookAhead(n);
  }

  baseToken() {
    let oracle = this.lineOracle;
    return oracle && oracle.baseToken(this.pos);
  }

}

function getLine(doc, n) {
  n -= doc.first;
  if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
  let chunk = doc;

  while (!chunk.lines) {
    for (let i = 0;; ++i) {
      let child = chunk.children[i],
          sz = child.chunkSize();

      if (n < sz) {
        chunk = child;
        break;
      }

      n -= sz;
    }
  }

  return chunk.lines[n];
} // Get the part of a document between two positions, as an array of
// strings.

function getBetween(doc, start, end) {
  let out = [],
      n = start.line;
  doc.iter(start.line, end.line + 1, line => {
    let text = line.text;
    if (n == end.line) text = text.slice(0, end.ch);
    if (n == start.line) text = text.slice(start.ch);
    out.push(text);
    ++n;
  });
  return out;
} // Get the lines between from and to, as array of strings.

function getLines(doc, from, to) {
  let out = [];
  doc.iter(from, to, line => {
    out.push(line.text);
  }); // iter aborts when callback returns truthy value

  return out;
} // Update the height of a line, propagating the height change
// upwards to parent nodes.

function updateLineHeight(line, height) {
  let diff = height - line.height;
  if (diff) for (let n = line; n; n = n.parent) n.height += diff;
} // Given a line object, find its line number by walking up through
// its parent links.

function lineNo(line) {
  if (line.parent == null) return null;
  let cur = line.parent,
      no = indexOf(cur.lines, line);

  for (let chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
    for (let i = 0;; ++i) {
      if (chunk.children[i] == cur) break;
      no += chunk.children[i].chunkSize();
    }
  }

  return no + cur.first;
} // Find the line at the given vertical position, using the height
// information in the document tree.

function lineAtHeight(chunk, h) {
  let n = chunk.first;

  outer: do {
    for (let i = 0; i < chunk.children.length; ++i) {
      let child = chunk.children[i],
          ch = child.height;

      if (h < ch) {
        chunk = child;
        continue outer;
      }

      h -= ch;
      n += child.chunkSize();
    }

    return n;
  } while (!chunk.lines);

  let i = 0;

  for (; i < chunk.lines.length; ++i) {
    let line = chunk.lines[i],
        lh = line.height;
    if (h < lh) break;
    h -= lh;
  }

  return n + i;
}
function isLine(doc, l) {
  return l >= doc.first && l < doc.first + doc.size;
}
function lineNumberFor(options, i) {
  return String(options.lineNumberFormatter(i + options.firstLineNumber));
}

function Pos(line, ch, sticky = null) {
  if (!(this instanceof Pos)) return new Pos(line, ch, sticky);
  this.line = line;
  this.ch = ch;
  this.sticky = sticky;
} // Compare two positions, return 0 if they are the same, a negative
// number when a is less, and a positive number otherwise.

function cmp(a, b) {
  return a.line - b.line || a.ch - b.ch;
}
function equalCursorPos(a, b) {
  return a.sticky == b.sticky && cmp(a, b) == 0;
}
function copyPos(x) {
  return Pos(x.line, x.ch);
}
function maxPos(a, b) {
  return cmp(a, b) < 0 ? b : a;
}
function minPos(a, b) {
  return cmp(a, b) < 0 ? a : b;
} // Most of the external API clips given positions to make sure they
// actually exist within the document.

function clipLine(doc, n) {
  return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));
}
function clipPos(doc, pos) {
  if (pos.line < doc.first) return Pos(doc.first, 0);
  let last = doc.first + doc.size - 1;
  if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
  return clipToLen(pos, getLine(doc, pos.line).text.length);
}

function clipToLen(pos, linelen) {
  let ch = pos.ch;
  if (ch == null || ch > linelen) return Pos(pos.line, linelen);else if (ch < 0) return Pos(pos.line, 0);else return pos;
}

function clipPosArray(doc, array) {
  let out = [];

  for (let i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);

  return out;
}

class SavedContext {
  constructor(state, lookAhead) {
    this.state = state;
    this.lookAhead = lookAhead;
  }

}

class Context {
  constructor(doc, state, line, lookAhead) {
    this.state = state;
    this.doc = doc;
    this.line = line;
    this.maxLookAhead = lookAhead || 0;
    this.baseTokens = null;
    this.baseTokenPos = 1;
  }

  lookAhead(n) {
    let line = this.doc.getLine(this.line + n);
    if (line != null && n > this.maxLookAhead) this.maxLookAhead = n;
    return line;
  }

  baseToken(n) {
    if (!this.baseTokens) return null;

    while (this.baseTokens[this.baseTokenPos] <= n) this.baseTokenPos += 2;

    let type = this.baseTokens[this.baseTokenPos + 1];
    return {
      type: type && type.replace(/( |^)overlay .*/, ""),
      size: this.baseTokens[this.baseTokenPos] - n
    };
  }

  nextLine() {
    this.line++;
    if (this.maxLookAhead > 0) this.maxLookAhead--;
  }

  static fromSaved(doc, saved, line) {
    if (saved instanceof SavedContext) return new Context(doc, copyState(doc.mode, saved.state), line, saved.lookAhead);else return new Context(doc, copyState(doc.mode, saved), line);
  }

  save(copy) {
    let state = copy !== false ? copyState(this.doc.mode, this.state) : this.state;
    return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
  }

} // Compute a style array (an array starting with a mode generation
// -- for invalidation -- followed by pairs of end positions and
// style strings), which is used to highlight the tokens on the
// line.


function highlightLine(cm, line, context, forceToEnd) {
  // A styles array always starts with a number identifying the
  // mode/overlays that it is based on (for easy invalidation).
  let st = [cm.state.modeGen],
      lineClasses = {}; // Compute the base array of styles

  runMode(cm, line.text, cm.doc.mode, context, (end, style) => st.push(end, style), lineClasses, forceToEnd);
  let state = context.state; // Run overlays, adjust style array.

  for (let o = 0; o < cm.state.overlays.length; ++o) {
    context.baseTokens = st;
    let overlay = cm.state.overlays[o],
        i = 1,
        at = 0;
    context.state = true;
    runMode(cm, line.text, overlay.mode, context, (end, style) => {
      let start = i; // Ensure there's a token end at the current position, and that i points at it

      while (at < end) {
        let i_end = st[i];
        if (i_end > end) st.splice(i, 1, end, st[i + 1], i_end);
        i += 2;
        at = Math.min(end, i_end);
      }

      if (!style) return;

      if (overlay.opaque) {
        st.splice(start, i - start, end, "overlay " + style);
        i = start + 2;
      } else {
        for (; start < i; start += 2) {
          let cur = st[start + 1];
          st[start + 1] = (cur ? cur + " " : "") + "overlay " + style;
        }
      }
    }, lineClasses);
    context.state = state;
    context.baseTokens = null;
    context.baseTokenPos = 1;
  }

  return {
    styles: st,
    classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null
  };
}
function getLineStyles(cm, line, updateFrontier) {
  if (!line.styles || line.styles[0] != cm.state.modeGen) {
    let context = getContextBefore(cm, lineNo(line));
    let resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state);
    let result = highlightLine(cm, line, context);
    if (resetState) context.state = resetState;
    line.stateAfter = context.save(!resetState);
    line.styles = result.styles;
    if (result.classes) line.styleClasses = result.classes;else if (line.styleClasses) line.styleClasses = null;
    if (updateFrontier === cm.doc.highlightFrontier) cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier);
  }

  return line.styles;
}
function getContextBefore(cm, n, precise) {
  let doc = cm.doc,
      display = cm.display;
  if (!doc.mode.startState) return new Context(doc, true, n);
  let start = findStartLine(cm, n, precise);
  let saved = start > doc.first && getLine(doc, start - 1).stateAfter;
  let context = saved ? Context.fromSaved(doc, saved, start) : new Context(doc, startState(doc.mode), start);
  doc.iter(start, n, line => {
    processLine(cm, line.text, context);
    let pos = context.line;
    line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
    context.nextLine();
  });
  if (precise) doc.modeFrontier = context.line;
  return context;
} // Lightweight form of highlight -- proceed over this line and
// update state, but don't save a style array. Used for lines that
// aren't currently visible.

function processLine(cm, text, context, startAt) {
  let mode = cm.doc.mode;
  let stream = new StringStream(text, cm.options.tabSize, context);
  stream.start = stream.pos = startAt || 0;
  if (text == "") callBlankLine(mode, context.state);

  while (!stream.eol()) {
    readToken(mode, stream, context.state);
    stream.start = stream.pos;
  }
}

function callBlankLine(mode, state) {
  if (mode.blankLine) return mode.blankLine(state);
  if (!mode.innerMode) return;
  let inner = innerMode(mode, state);
  if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
}

function readToken(mode, stream, state, inner) {
  for (let i = 0; i < 10; i++) {
    if (inner) inner[0] = innerMode(mode, state).mode;
    let style = mode.token(stream, state);
    if (stream.pos > stream.start) return style;
  }

  throw new Error("Mode " + mode.name + " failed to advance stream.");
}

class Token {
  constructor(stream, type, state) {
    this.start = stream.start;
    this.end = stream.pos;
    this.string = stream.current();
    this.type = type || null;
    this.state = state;
  }

} // Utility for getTokenAt and getLineTokens


function takeToken(cm, pos, precise, asArray) {
  let doc = cm.doc,
      mode = doc.mode,
      style;
  pos = clipPos(doc, pos);
  let line = getLine(doc, pos.line),
      context = getContextBefore(cm, pos.line, precise);
  let stream = new StringStream(line.text, cm.options.tabSize, context),
      tokens;
  if (asArray) tokens = [];

  while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
    stream.start = stream.pos;
    style = readToken(mode, stream, context.state);
    if (asArray) tokens.push(new Token(stream, style, copyState(doc.mode, context.state)));
  }

  return asArray ? tokens : new Token(stream, style, context.state);
}

function extractLineClasses(type, output) {
  if (type) for (;;) {
    let lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
    if (!lineClass) break;
    type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
    let prop = lineClass[1] ? "bgClass" : "textClass";
    if (output[prop] == null) output[prop] = lineClass[2];else if (!new RegExp("(?:^|\\s)" + lineClass[2] + "(?:$|\\s)").test(output[prop])) output[prop] += " " + lineClass[2];
  }
  return type;
} // Run the given mode's parser over a line, calling f for each token.


function runMode(cm, text, mode, context, f, lineClasses, forceToEnd) {
  let flattenSpans = mode.flattenSpans;
  if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
  let curStart = 0,
      curStyle = null;
  let stream = new StringStream(text, cm.options.tabSize, context),
      style;
  let inner = cm.options.addModeClass && [null];
  if (text == "") extractLineClasses(callBlankLine(mode, context.state), lineClasses);

  while (!stream.eol()) {
    if (stream.pos > cm.options.maxHighlightLength) {
      flattenSpans = false;
      if (forceToEnd) processLine(cm, text, context, stream.pos);
      stream.pos = text.length;
      style = null;
    } else {
      style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
    }

    if (inner) {
      let mName = inner[0].name;
      if (mName) style = "m-" + (style ? mName + " " + style : mName);
    }

    if (!flattenSpans || curStyle != style) {
      while (curStart < stream.start) {
        curStart = Math.min(stream.start, curStart + 5000);
        f(curStart, curStyle);
      }

      curStyle = style;
    }

    stream.start = stream.pos;
  }

  while (curStart < stream.pos) {
    // Webkit seems to refuse to render text nodes longer than 57444
    // characters, and returns inaccurate measurements in nodes
    // starting around 5000 chars.
    let pos = Math.min(stream.pos, curStart + 5000);
    f(pos, curStyle);
    curStart = pos;
  }
} // Finds the line to start with when starting a parse. Tries to
// find a line with a stateAfter, so that it can start with a
// valid state. If that fails, it returns the line with the
// smallest indentation, which tends to need the least context to
// parse correctly.


function findStartLine(cm, n, precise) {
  let minindent,
      minline,
      doc = cm.doc;
  let lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);

  for (let search = n; search > lim; --search) {
    if (search <= doc.first) return doc.first;
    let line = getLine(doc, search - 1),
        after = line.stateAfter;
    if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc.modeFrontier)) return search;
    let indented = countColumn(line.text, null, cm.options.tabSize);

    if (minline == null || minindent > indented) {
      minline = search - 1;
      minindent = indented;
    }
  }

  return minline;
}

function retreatFrontier(doc, n) {
  doc.modeFrontier = Math.min(doc.modeFrontier, n);
  if (doc.highlightFrontier < n - 10) return;
  let start = doc.first;

  for (let line = n - 1; line > start; line--) {
    let saved = getLine(doc, line).stateAfter; // change is on 3
    // state on line 1 looked ahead 2 -- so saw 3
    // test 1 + 2 < 3 should cover this

    if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
      start = line + 1;
      break;
    }
  }

  doc.highlightFrontier = Math.min(doc.highlightFrontier, start);
}

// Optimize some code when these features are not used.
let sawReadOnlySpans = false,
    sawCollapsedSpans = false;
function seeReadOnlySpans() {
  sawReadOnlySpans = true;
}
function seeCollapsedSpans() {
  sawCollapsedSpans = true;
}

function MarkedSpan(marker, from, to) {
  this.marker = marker;
  this.from = from;
  this.to = to;
} // Search an array of spans for a span matching the given marker.

function getMarkedSpanFor(spans, marker) {
  if (spans) for (let i = 0; i < spans.length; ++i) {
    let span = spans[i];
    if (span.marker == marker) return span;
  }
} // Remove a span from an array, returning undefined if no spans are
// left (we don't store arrays for lines without spans).

function removeMarkedSpan(spans, span) {
  let r;

  for (let i = 0; i < spans.length; ++i) if (spans[i] != span) (r || (r = [])).push(spans[i]);

  return r;
} // Add a span to a line.

function addMarkedSpan(line, span, op) {
  let inThisOp = op && window.WeakSet && (op.markedSpans || (op.markedSpans = new WeakSet()));

  if (inThisOp && inThisOp.has(line.markedSpans)) {
    line.markedSpans.push(span);
  } else {
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
    if (inThisOp) inThisOp.add(line.markedSpans);
  }

  span.marker.attachLine(line);
} // Used for the algorithm that adjusts markers for a change in the
// document. These functions cut an array of spans at a given
// character position, returning an array of remaining chunks (or
// undefined if nothing remains).

function markedSpansBefore(old, startCh, isInsert) {
  let nw;
  if (old) for (let i = 0; i < old.length; ++i) {
    let span = old[i],
        marker = span.marker;
    let startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);

    if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
      let endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
      (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
    }
  }
  return nw;
}

function markedSpansAfter(old, endCh, isInsert) {
  let nw;
  if (old) for (let i = 0; i < old.length; ++i) {
    let span = old[i],
        marker = span.marker;
    let endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);

    if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
      let startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
      (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh, span.to == null ? null : span.to - endCh));
    }
  }
  return nw;
} // Given a change object, compute the new set of marker spans that
// cover the line in which the change took place. Removes spans
// entirely within the change, reconnects spans belonging to the
// same marker that appear on both sides of the change, and cuts off
// spans partially within the change. Returns an array of span
// arrays with one element for each line in (after) the change.


function stretchSpansOverChange(doc, change) {
  if (change.full) return null;
  let oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
  let oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
  if (!oldFirst && !oldLast) return null;
  let startCh = change.from.ch,
      endCh = change.to.ch,
      isInsert = cmp(change.from, change.to) == 0; // Get the spans that 'stick out' on both sides

  let first = markedSpansBefore(oldFirst, startCh, isInsert);
  let last = markedSpansAfter(oldLast, endCh, isInsert); // Next, merge those two ends

  let sameLine = change.text.length == 1,
      offset = lst(change.text).length + (sameLine ? startCh : 0);

  if (first) {
    // Fix up .to properties of first
    for (let i = 0; i < first.length; ++i) {
      let span = first[i];

      if (span.to == null) {
        let found = getMarkedSpanFor(last, span.marker);
        if (!found) span.to = startCh;else if (sameLine) span.to = found.to == null ? null : found.to + offset;
      }
    }
  }

  if (last) {
    // Fix up .from in last (or move them into first in case of sameLine)
    for (let i = 0; i < last.length; ++i) {
      let span = last[i];
      if (span.to != null) span.to += offset;

      if (span.from == null) {
        let found = getMarkedSpanFor(first, span.marker);

        if (!found) {
          span.from = offset;
          if (sameLine) (first || (first = [])).push(span);
        }
      } else {
        span.from += offset;
        if (sameLine) (first || (first = [])).push(span);
      }
    }
  } // Make sure we didn't create any zero-length spans


  if (first) first = clearEmptySpans(first);
  if (last && last != first) last = clearEmptySpans(last);
  let newMarkers = [first];

  if (!sameLine) {
    // Fill gap with whole-line-spans
    let gap = change.text.length - 2,
        gapMarkers;
    if (gap > 0 && first) for (let i = 0; i < first.length; ++i) if (first[i].to == null) (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));

    for (let i = 0; i < gap; ++i) newMarkers.push(gapMarkers);

    newMarkers.push(last);
  }

  return newMarkers;
} // Remove spans that are empty and don't have a clearWhenEmpty
// option of false.

function clearEmptySpans(spans) {
  for (let i = 0; i < spans.length; ++i) {
    let span = spans[i];
    if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false) spans.splice(i--, 1);
  }

  if (!spans.length) return null;
  return spans;
} // Used to 'clip' out readOnly ranges when making a change.


function removeReadOnlyRanges(doc, from, to) {
  let markers = null;
  doc.iter(from.line, to.line + 1, line => {
    if (line.markedSpans) for (let i = 0; i < line.markedSpans.length; ++i) {
      let mark = line.markedSpans[i].marker;
      if (mark.readOnly && (!markers || indexOf(markers, mark) == -1)) (markers || (markers = [])).push(mark);
    }
  });
  if (!markers) return null;
  let parts = [{
    from: from,
    to: to
  }];

  for (let i = 0; i < markers.length; ++i) {
    let mk = markers[i],
        m = mk.find(0);

    for (let j = 0; j < parts.length; ++j) {
      let p = parts[j];
      if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
      let newParts = [j, 1],
          dfrom = cmp(p.from, m.from),
          dto = cmp(p.to, m.to);
      if (dfrom < 0 || !mk.inclusiveLeft && !dfrom) newParts.push({
        from: p.from,
        to: m.from
      });
      if (dto > 0 || !mk.inclusiveRight && !dto) newParts.push({
        from: m.to,
        to: p.to
      });
      parts.splice.apply(parts, newParts);
      j += newParts.length - 3;
    }
  }

  return parts;
} // Connect or disconnect spans from a line.

function detachMarkedSpans(line) {
  let spans = line.markedSpans;
  if (!spans) return;

  for (let i = 0; i < spans.length; ++i) spans[i].marker.detachLine(line);

  line.markedSpans = null;
}
function attachMarkedSpans(line, spans) {
  if (!spans) return;

  for (let i = 0; i < spans.length; ++i) spans[i].marker.attachLine(line);

  line.markedSpans = spans;
} // Helpers used when computing which overlapping collapsed span
// counts as the larger one.

function extraLeft(marker) {
  return marker.inclusiveLeft ? -1 : 0;
}

function extraRight(marker) {
  return marker.inclusiveRight ? 1 : 0;
} // Returns a number indicating which of two overlapping collapsed
// spans is larger (and thus includes the other). Falls back to
// comparing ids when the spans cover exactly the same range.


function compareCollapsedMarkers(a, b) {
  let lenDiff = a.lines.length - b.lines.length;
  if (lenDiff != 0) return lenDiff;
  let aPos = a.find(),
      bPos = b.find();
  let fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
  if (fromCmp) return -fromCmp;
  let toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
  if (toCmp) return toCmp;
  return b.id - a.id;
} // Find out whether a line ends or starts in a collapsed span. If
// so, return the marker for that span.

function collapsedSpanAtSide(line, start) {
  let sps = sawCollapsedSpans && line.markedSpans,
      found;
  if (sps) for (let sp, i = 0; i < sps.length; ++i) {
    sp = sps[i];
    if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) found = sp.marker;
  }
  return found;
}

function collapsedSpanAtStart(line) {
  return collapsedSpanAtSide(line, true);
}
function collapsedSpanAtEnd(line) {
  return collapsedSpanAtSide(line, false);
}
function collapsedSpanAround(line, ch) {
  let sps = sawCollapsedSpans && line.markedSpans,
      found;
  if (sps) for (let i = 0; i < sps.length; ++i) {
    let sp = sps[i];
    if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) found = sp.marker;
  }
  return found;
} // Test whether there exists a collapsed span that partially
// overlaps (covers the start or end, but not both) of a new span.
// Such overlap is not allowed.

function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
  let line = getLine(doc, lineNo);
  let sps = sawCollapsedSpans && line.markedSpans;
  if (sps) for (let i = 0; i < sps.length; ++i) {
    let sp = sps[i];
    if (!sp.marker.collapsed) continue;
    let found = sp.marker.find(0);
    let fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
    let toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
    if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
    if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0)) return true;
  }
} // A visual line is a line as drawn on the screen. Folding, for
// example, can cause multiple logical lines to appear on the same
// visual line. This finds the start of the visual line that the
// given line is part of (usually that is the line itself).

function visualLine(line) {
  let merged;

  while (merged = collapsedSpanAtStart(line)) line = merged.find(-1, true).line;

  return line;
}
function visualLineEnd(line) {
  let merged;

  while (merged = collapsedSpanAtEnd(line)) line = merged.find(1, true).line;

  return line;
} // Returns an array of logical lines that continue the visual line
// started by the argument, or undefined if there are no such lines.

function visualLineContinued(line) {
  let merged, lines;

  while (merged = collapsedSpanAtEnd(line)) {
    line = merged.find(1, true).line;
    (lines || (lines = [])).push(line);
  }

  return lines;
} // Get the line number of the start of the visual line that the
// given line number is part of.

function visualLineNo(doc, lineN) {
  let line = getLine(doc, lineN),
      vis = visualLine(line);
  if (line == vis) return lineN;
  return lineNo(vis);
} // Get the line number of the start of the next visual line after
// the given line.

function visualLineEndNo(doc, lineN) {
  if (lineN > doc.lastLine()) return lineN;
  let line = getLine(doc, lineN),
      merged;
  if (!lineIsHidden(doc, line)) return lineN;

  while (merged = collapsedSpanAtEnd(line)) line = merged.find(1, true).line;

  return lineNo(line) + 1;
} // Compute whether a line is hidden. Lines count as hidden when they
// are part of a visual line that starts with another line, or when
// they are entirely covered by collapsed, non-widget span.

function lineIsHidden(doc, line) {
  let sps = sawCollapsedSpans && line.markedSpans;
  if (sps) for (let sp, i = 0; i < sps.length; ++i) {
    sp = sps[i];
    if (!sp.marker.collapsed) continue;
    if (sp.from == null) return true;
    if (sp.marker.widgetNode) continue;
    if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp)) return true;
  }
}

function lineIsHiddenInner(doc, line, span) {
  if (span.to == null) {
    let end = span.marker.find(1, true);
    return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
  }

  if (span.marker.inclusiveRight && span.to == line.text.length) return true;

  for (let sp, i = 0; i < line.markedSpans.length; ++i) {
    sp = line.markedSpans[i];
    if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp)) return true;
  }
} // Find the height above the given line.


function heightAtLine(lineObj) {
  lineObj = visualLine(lineObj);
  let h = 0,
      chunk = lineObj.parent;

  for (let i = 0; i < chunk.lines.length; ++i) {
    let line = chunk.lines[i];
    if (line == lineObj) break;else h += line.height;
  }

  for (let p = chunk.parent; p; chunk = p, p = chunk.parent) {
    for (let i = 0; i < p.children.length; ++i) {
      let cur = p.children[i];
      if (cur == chunk) break;else h += cur.height;
    }
  }

  return h;
} // Compute the character length of a line, taking into account
// collapsed ranges (see markText) that might hide parts, and join
// other lines onto it.

function lineLength(line) {
  if (line.height == 0) return 0;
  let len = line.text.length,
      merged,
      cur = line;

  while (merged = collapsedSpanAtStart(cur)) {
    let found = merged.find(0, true);
    cur = found.from.line;
    len += found.from.ch - found.to.ch;
  }

  cur = line;

  while (merged = collapsedSpanAtEnd(cur)) {
    let found = merged.find(0, true);
    len -= cur.text.length - found.from.ch;
    cur = found.to.line;
    len += cur.text.length - found.to.ch;
  }

  return len;
} // Find the longest line in the document.

function findMaxLine(cm) {
  let d = cm.display,
      doc = cm.doc;
  d.maxLine = getLine(doc, doc.first);
  d.maxLineLength = lineLength(d.maxLine);
  d.maxLineChanged = true;
  doc.iter(line => {
    let len = lineLength(line);

    if (len > d.maxLineLength) {
      d.maxLineLength = len;
      d.maxLine = line;
    }
  });
}

// Line objects. These hold state related to a line, including
// highlighting info (the styles array).

class Line {
  constructor(text, markedSpans, estimateHeight) {
    this.text = text;
    attachMarkedSpans(this, markedSpans);
    this.height = estimateHeight ? estimateHeight(this) : 1;
  }

  lineNo() {
    return lineNo(this);
  }

}
eventMixin(Line); // Change the content (text, markers) of a line. Automatically
// invalidates cached information and tries to re-estimate the
// line's height.

function updateLine(line, text, markedSpans, estimateHeight) {
  line.text = text;
  if (line.stateAfter) line.stateAfter = null;
  if (line.styles) line.styles = null;
  if (line.order != null) line.order = null;
  detachMarkedSpans(line);
  attachMarkedSpans(line, markedSpans);
  let estHeight = estimateHeight ? estimateHeight(line) : 1;
  if (estHeight != line.height) updateLineHeight(line, estHeight);
} // Detach a line from the document tree and its markers.

function cleanUpLine(line) {
  line.parent = null;
  detachMarkedSpans(line);
} // Convert a style as returned by a mode (either null, or a string
// containing one or more styles) to a CSS style. This is cached,
// and also looks for line-wide styles.

let styleToClassCache = {},
    styleToClassCacheWithMode = {};

function interpretTokenStyle(style, options) {
  if (!style || /^\s*$/.test(style)) return null;
  let cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
  return cache[style] || (cache[style] = style.replace(/\S+/g, "cm-$&"));
} // Render the DOM representation of the text of a line. Also builds
// up a 'line map', which points at the DOM nodes that represent
// specific stretches of text, and is used by the measuring code.
// The returned object contains the DOM node, this map, and
// information about line-wide styles that were set by the mode.


function buildLineContent(cm, lineView) {
  // The padding-right forces the element to have a 'border', which
  // is needed on Webkit to be able to get line-level bounding
  // rectangles for it (in measureChar).
  let content = eltP("span", null, null, webkit ? "padding-right: .1px" : null);
  let builder = {
    pre: eltP("pre", [content], "CodeMirror-line"),
    content: content,
    col: 0,
    pos: 0,
    cm: cm,
    trailingSpace: false,
    splitSpaces: cm.getOption("lineWrapping")
  };
  lineView.measure = {}; // Iterate over the logical lines that make up this visual line.

  for (let i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
    let line = i ? lineView.rest[i - 1] : lineView.line,
        order;
    builder.pos = 0;
    builder.addToken = buildToken; // Optionally wire in some hacks into the token-rendering
    // algorithm, to deal with browser quirks.

    if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line, cm.doc.direction))) builder.addToken = buildTokenBadBidi(builder.addToken, order);
    builder.map = [];
    let allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
    insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));

    if (line.styleClasses) {
      if (line.styleClasses.bgClass) builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
      if (line.styleClasses.textClass) builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
    } // Ensure at least a single node is present, for measuring.


    if (builder.map.length == 0) builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure))); // Store the map and a cache object for the current logical line

    if (i == 0) {
      lineView.measure.map = builder.map;
      lineView.measure.cache = {};
    } else {
      (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
      (lineView.measure.caches || (lineView.measure.caches = [])).push({});
    }
  } // See issue #2901


  if (webkit) {
    let last = builder.content.lastChild;
    if (/\bcm-tab\b/.test(last.className) || last.querySelector && last.querySelector(".cm-tab")) builder.content.className = "cm-tab-wrap-hack";
  }

  signal(cm, "renderLine", cm, lineView.line, builder.pre);
  if (builder.pre.className) builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
  return builder;
}
function defaultSpecialCharPlaceholder(ch) {
  let token = elt("span", "\u2022", "cm-invalidchar");
  token.title = "\\u" + ch.charCodeAt(0).toString(16);
  token.setAttribute("aria-label", token.title);
  return token;
} // Build up the DOM representation for a single token, and add it to
// the line map. Takes care to render special characters separately.

function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
  if (!text) return;
  let displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text;
  let special = builder.cm.state.specialChars,
      mustWrap = false;
  let content;

  if (!special.test(text)) {
    builder.col += text.length;
    content = document.createTextNode(displayText);
    builder.map.push(builder.pos, builder.pos + text.length, content);
    if (ie && ie_version < 9) mustWrap = true;
    builder.pos += text.length;
  } else {
    content = document.createDocumentFragment();
    let pos = 0;

    while (true) {
      special.lastIndex = pos;
      let m = special.exec(text);
      let skipped = m ? m.index - pos : text.length - pos;

      if (skipped) {
        let txt = document.createTextNode(displayText.slice(pos, pos + skipped));
        if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));else content.appendChild(txt);
        builder.map.push(builder.pos, builder.pos + skipped, txt);
        builder.col += skipped;
        builder.pos += skipped;
      }

      if (!m) break;
      pos += skipped + 1;
      let txt;

      if (m[0] == "\t") {
        let tabSize = builder.cm.options.tabSize,
            tabWidth = tabSize - builder.col % tabSize;
        txt = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
        txt.setAttribute("role", "presentation");
        txt.setAttribute("cm-text", "\t");
        builder.col += tabWidth;
      } else if (m[0] == "\r" || m[0] == "\n") {
        txt = content.appendChild(elt("span", m[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
        txt.setAttribute("cm-text", m[0]);
        builder.col += 1;
      } else {
        txt = builder.cm.options.specialCharPlaceholder(m[0]);
        txt.setAttribute("cm-text", m[0]);
        if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));else content.appendChild(txt);
        builder.col += 1;
      }

      builder.map.push(builder.pos, builder.pos + 1, txt);
      builder.pos++;
    }
  }

  builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32;

  if (style || startStyle || endStyle || mustWrap || css || attributes) {
    let fullStyle = style || "";
    if (startStyle) fullStyle += startStyle;
    if (endStyle) fullStyle += endStyle;
    let token = elt("span", [content], fullStyle, css);

    if (attributes) {
      for (let attr in attributes) if (attributes.hasOwnProperty(attr) && attr != "style" && attr != "class") token.setAttribute(attr, attributes[attr]);
    }

    return builder.content.appendChild(token);
  }

  builder.content.appendChild(content);
} // Change some spaces to NBSP to prevent the browser from collapsing
// trailing spaces at the end of a line when rendering text (issue #1362).


function splitSpaces(text, trailingBefore) {
  if (text.length > 1 && !/  /.test(text)) return text;
  let spaceBefore = trailingBefore,
      result = "";

  for (let i = 0; i < text.length; i++) {
    let ch = text.charAt(i);
    if (ch == " " && spaceBefore && (i == text.length - 1 || text.charCodeAt(i + 1) == 32)) ch = "\u00a0";
    result += ch;
    spaceBefore = ch == " ";
  }

  return result;
} // Work around nonsense dimensions being reported for stretches of
// right-to-left text.


function buildTokenBadBidi(inner, order) {
  return (builder, text, style, startStyle, endStyle, css, attributes) => {
    style = style ? style + " cm-force-border" : "cm-force-border";
    let start = builder.pos,
        end = start + text.length;

    for (;;) {
      // Find the part that overlaps with the start of this text
      let part;

      for (let i = 0; i < order.length; i++) {
        part = order[i];
        if (part.to > start && part.from <= start) break;
      }

      if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, css, attributes);
      inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes);
      startStyle = null;
      text = text.slice(part.to - start);
      start = part.to;
    }
  };
}

function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
  let widget = !ignoreWidget && marker.widgetNode;
  if (widget) builder.map.push(builder.pos, builder.pos + size, widget);

  if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
    if (!widget) widget = builder.content.appendChild(document.createElement("span"));
    widget.setAttribute("cm-marker", marker.id);
  }

  if (widget) {
    builder.cm.display.input.setUneditable(widget);
    builder.content.appendChild(widget);
  }

  builder.pos += size;
  builder.trailingSpace = false;
} // Outputs a number of spans to make up a line, taking highlighting
// and marked text into account.


function insertLineContent(line, builder, styles) {
  let spans = line.markedSpans,
      allText = line.text,
      at = 0;

  if (!spans) {
    for (let i = 1; i < styles.length; i += 2) builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i + 1], builder.cm.options));

    return;
  }

  let len = allText.length,
      pos = 0,
      i = 1,
      text = "",
      style,
      css;
  let nextChange = 0,
      spanStyle,
      spanEndStyle,
      spanStartStyle,
      collapsed,
      attributes;

  for (;;) {
    if (nextChange == pos) {
      // Update current marker set
      spanStyle = spanEndStyle = spanStartStyle = css = "";
      attributes = null;
      collapsed = null;
      nextChange = Infinity;
      let foundBookmarks = [],
          endStyles;

      for (let j = 0; j < spans.length; ++j) {
        let sp = spans[j],
            m = sp.marker;

        if (m.type == "bookmark" && sp.from == pos && m.widgetNode) {
          foundBookmarks.push(m);
        } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
          if (sp.to != null && sp.to != pos && nextChange > sp.to) {
            nextChange = sp.to;
            spanEndStyle = "";
          }

          if (m.className) spanStyle += " " + m.className;
          if (m.css) css = (css ? css + ";" : "") + m.css;
          if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
          if (m.endStyle && sp.to == nextChange) (endStyles || (endStyles = [])).push(m.endStyle, sp.to); // support for the old title property
          // https://github.com/codemirror/CodeMirror/pull/5673

          if (m.title) (attributes || (attributes = {})).title = m.title;

          if (m.attributes) {
            for (let attr in m.attributes) (attributes || (attributes = {}))[attr] = m.attributes[attr];
          }

          if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0)) collapsed = sp;
        } else if (sp.from > pos && nextChange > sp.from) {
          nextChange = sp.from;
        }
      }

      if (endStyles) for (let j = 0; j < endStyles.length; j += 2) if (endStyles[j + 1] == nextChange) spanEndStyle += " " + endStyles[j];
      if (!collapsed || collapsed.from == pos) for (let j = 0; j < foundBookmarks.length; ++j) buildCollapsedSpan(builder, 0, foundBookmarks[j]);

      if (collapsed && (collapsed.from || 0) == pos) {
        buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos, collapsed.marker, collapsed.from == null);
        if (collapsed.to == null) return;
        if (collapsed.to == pos) collapsed = false;
      }
    }

    if (pos >= len) break;
    let upto = Math.min(len, nextChange);

    while (true) {
      if (text) {
        let end = pos + text.length;

        if (!collapsed) {
          let tokenText = end > upto ? text.slice(0, upto - pos) : text;
          builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle, spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", css, attributes);
        }

        if (end >= upto) {
          text = text.slice(upto - pos);
          pos = upto;
          break;
        }

        pos = end;
        spanStartStyle = "";
      }

      text = allText.slice(at, at = styles[i++]);
      style = interpretTokenStyle(styles[i++], builder.cm.options);
    }
  }
} // These objects are used to represent the visible (currently drawn)
// part of the document. A LineView may correspond to multiple
// logical lines, if those are connected by collapsed ranges.


function LineView(doc, line, lineN) {
  // The starting line
  this.line = line; // Continuing lines, if any

  this.rest = visualLineContinued(line); // Number of logical lines in this visual line

  this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
  this.node = this.text = null;
  this.hidden = lineIsHidden(doc, line);
} // Create a range of LineView objects for the given lines.

function buildViewArray(cm, from, to) {
  let array = [],
      nextPos;

  for (let pos = from; pos < to; pos = nextPos) {
    let view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
    nextPos = pos + view.size;
    array.push(view);
  }

  return array;
}

let operationGroup = null;
function pushOperation(op) {
  if (operationGroup) {
    operationGroup.ops.push(op);
  } else {
    op.ownsGroup = operationGroup = {
      ops: [op],
      delayedCallbacks: []
    };
  }
}

function fireCallbacksForOps(group) {
  // Calls delayed callbacks and cursorActivity handlers until no
  // new ones appear
  let callbacks = group.delayedCallbacks,
      i = 0;

  do {
    for (; i < callbacks.length; i++) callbacks[i].call(null);

    for (let j = 0; j < group.ops.length; j++) {
      let op = group.ops[j];
      if (op.cursorActivityHandlers) while (op.cursorActivityCalled < op.cursorActivityHandlers.length) op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
    }
  } while (i < callbacks.length);
}

function finishOperation(op, endCb) {
  let group = op.ownsGroup;
  if (!group) return;

  try {
    fireCallbacksForOps(group);
  } finally {
    operationGroup = null;
    endCb(group);
  }
}
let orphanDelayedCallbacks = null; // Often, we want to signal events at a point where we are in the
// middle of some work, but don't want the handler to start calling
// other methods on the editor, which might be in an inconsistent
// state or simply not expect any other events to happen.
// signalLater looks whether there are any handlers, and schedules
// them to be executed when the last operation ends, or, if no
// operation is active, when a timeout fires.

function signalLater(emitter, type
/*, values...*/
) {
  let arr = getHandlers(emitter, type);
  if (!arr.length) return;
  let args = Array.prototype.slice.call(arguments, 2),
      list;

  if (operationGroup) {
    list = operationGroup.delayedCallbacks;
  } else if (orphanDelayedCallbacks) {
    list = orphanDelayedCallbacks;
  } else {
    list = orphanDelayedCallbacks = [];
    setTimeout(fireOrphanDelayed, 0);
  }

  for (let i = 0; i < arr.length; ++i) list.push(() => arr[i].apply(null, args));
}

function fireOrphanDelayed() {
  let delayed = orphanDelayedCallbacks;
  orphanDelayedCallbacks = null;

  for (let i = 0; i < delayed.length; ++i) delayed[i]();
}

// lineView.changes. This updates the relevant part of the line's
// DOM structure.

function updateLineForChanges(cm, lineView, lineN, dims) {
  for (let j = 0; j < lineView.changes.length; j++) {
    let type = lineView.changes[j];
    if (type == "text") updateLineText(cm, lineView);else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);else if (type == "class") updateLineClasses(cm, lineView);else if (type == "widget") updateLineWidgets(cm, lineView, dims);
  }

  lineView.changes = null;
} // Lines with gutter elements, widgets or a background class need to
// be wrapped, and have the extra elements added to the wrapper div

function ensureLineWrapped(lineView) {
  if (lineView.node == lineView.text) {
    lineView.node = elt("div", null, null, "position: relative");
    if (lineView.text.parentNode) lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
    lineView.node.appendChild(lineView.text);
    if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
  }

  return lineView.node;
}

function updateLineBackground(cm, lineView) {
  let cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
  if (cls) cls += " CodeMirror-linebackground";

  if (lineView.background) {
    if (cls) lineView.background.className = cls;else {
      lineView.background.parentNode.removeChild(lineView.background);
      lineView.background = null;
    }
  } else if (cls) {
    let wrap = ensureLineWrapped(lineView);
    lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
    cm.display.input.setUneditable(lineView.background);
  }
} // Wrapper around buildLineContent which will reuse the structure
// in display.externalMeasured when possible.


function getLineContent(cm, lineView) {
  let ext = cm.display.externalMeasured;

  if (ext && ext.line == lineView.line) {
    cm.display.externalMeasured = null;
    lineView.measure = ext.measure;
    return ext.built;
  }

  return buildLineContent(cm, lineView);
} // Redraw the line's text. Interacts with the background and text
// classes because the mode may output tokens that influence these
// classes.


function updateLineText(cm, lineView) {
  let cls = lineView.text.className;
  let built = getLineContent(cm, lineView);
  if (lineView.text == lineView.node) lineView.node = built.pre;
  lineView.text.parentNode.replaceChild(built.pre, lineView.text);
  lineView.text = built.pre;

  if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
    lineView.bgClass = built.bgClass;
    lineView.textClass = built.textClass;
    updateLineClasses(cm, lineView);
  } else if (cls) {
    lineView.text.className = cls;
  }
}

function updateLineClasses(cm, lineView) {
  updateLineBackground(cm, lineView);
  if (lineView.line.wrapClass) ensureLineWrapped(lineView).className = lineView.line.wrapClass;else if (lineView.node != lineView.text) lineView.node.className = "";
  let textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
  lineView.text.className = textClass || "";
}

function updateLineGutter(cm, lineView, lineN, dims) {
  if (lineView.gutter) {
    lineView.node.removeChild(lineView.gutter);
    lineView.gutter = null;
  }

  if (lineView.gutterBackground) {
    lineView.node.removeChild(lineView.gutterBackground);
    lineView.gutterBackground = null;
  }

  if (lineView.line.gutterClass) {
    let wrap = ensureLineWrapped(lineView);
    lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass, `left: ${cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth}px; width: ${dims.gutterTotalWidth}px`);
    cm.display.input.setUneditable(lineView.gutterBackground);
    wrap.insertBefore(lineView.gutterBackground, lineView.text);
  }

  let markers = lineView.line.gutterMarkers;

  if (cm.options.lineNumbers || markers) {
    let wrap = ensureLineWrapped(lineView);
    let gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", `left: ${cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth}px`);
    gutterWrap.setAttribute("aria-hidden", "true");
    cm.display.input.setUneditable(gutterWrap);
    wrap.insertBefore(gutterWrap, lineView.text);
    if (lineView.line.gutterClass) gutterWrap.className += " " + lineView.line.gutterClass;
    if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"])) lineView.lineNumber = gutterWrap.appendChild(elt("div", lineNumberFor(cm.options, lineN), "CodeMirror-linenumber CodeMirror-gutter-elt", `left: ${dims.gutterLeft["CodeMirror-linenumbers"]}px; width: ${cm.display.lineNumInnerWidth}px`));
    if (markers) for (let k = 0; k < cm.display.gutterSpecs.length; ++k) {
      let id = cm.display.gutterSpecs[k].className,
          found = markers.hasOwnProperty(id) && markers[id];
      if (found) gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", `left: ${dims.gutterLeft[id]}px; width: ${dims.gutterWidth[id]}px`));
    }
  }
}

function updateLineWidgets(cm, lineView, dims) {
  if (lineView.alignable) lineView.alignable = null;
  let isWidget = classTest("CodeMirror-linewidget");

  for (let node = lineView.node.firstChild, next; node; node = next) {
    next = node.nextSibling;
    if (isWidget.test(node.className)) lineView.node.removeChild(node);
  }

  insertLineWidgets(cm, lineView, dims);
} // Build a line's DOM representation from scratch


function buildLineElement(cm, lineView, lineN, dims) {
  let built = getLineContent(cm, lineView);
  lineView.text = lineView.node = built.pre;
  if (built.bgClass) lineView.bgClass = built.bgClass;
  if (built.textClass) lineView.textClass = built.textClass;
  updateLineClasses(cm, lineView);
  updateLineGutter(cm, lineView, lineN, dims);
  insertLineWidgets(cm, lineView, dims);
  return lineView.node;
} // A lineView may contain multiple logical lines (when merged by
// collapsed spans). The widgets for all of them need to be drawn.

function insertLineWidgets(cm, lineView, dims) {
  insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
  if (lineView.rest) for (let i = 0; i < lineView.rest.length; i++) insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
}

function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
  if (!line.widgets) return;
  let wrap = ensureLineWrapped(lineView);

  for (let i = 0, ws = line.widgets; i < ws.length; ++i) {
    let widget = ws[i],
        node = elt("div", [widget.node], "CodeMirror-linewidget" + (widget.className ? " " + widget.className : ""));
    if (!widget.handleMouseEvents) node.setAttribute("cm-ignore-events", "true");
    positionLineWidget(widget, node, lineView, dims);
    cm.display.input.setUneditable(node);
    if (allowAbove && widget.above) wrap.insertBefore(node, lineView.gutter || lineView.text);else wrap.appendChild(node);
    signalLater(widget, "redraw");
  }
}

function positionLineWidget(widget, node, lineView, dims) {
  if (widget.noHScroll) {
    (lineView.alignable || (lineView.alignable = [])).push(node);
    let width = dims.wrapperWidth;
    node.style.left = dims.fixedPos + "px";

    if (!widget.coverGutter) {
      width -= dims.gutterTotalWidth;
      node.style.paddingLeft = dims.gutterTotalWidth + "px";
    }

    node.style.width = width + "px";
  }

  if (widget.coverGutter) {
    node.style.zIndex = 5;
    node.style.position = "relative";
    if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
  }
}

function widgetHeight(widget) {
  if (widget.height != null) return widget.height;
  let cm = widget.doc.cm;
  if (!cm) return 0;

  if (!contains(document.body, widget.node)) {
    let parentStyle = "position: relative;";
    if (widget.coverGutter) parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
    if (widget.noHScroll) parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
    removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
  }

  return widget.height = widget.node.parentNode.offsetHeight;
} // Return true when the given mouse event happened in a widget

function eventInWidget(display, e) {
  for (let n = e_target(e); n != display.wrapper; n = n.parentNode) {
    if (!n || n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true" || n.parentNode == display.sizer && n != display.mover) return true;
  }
}

function paddingTop(display) {
  return display.lineSpace.offsetTop;
}
function paddingVert(display) {
  return display.mover.offsetHeight - display.lineSpace.offsetHeight;
}
function paddingH(display) {
  if (display.cachedPaddingH) return display.cachedPaddingH;
  let e = removeChildrenAndAdd(display.measure, elt("pre", "x", "CodeMirror-line-like"));
  let style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
  let data = {
    left: parseInt(style.paddingLeft),
    right: parseInt(style.paddingRight)
  };
  if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
  return data;
}
function scrollGap(cm) {
  return scrollerGap - cm.display.nativeBarWidth;
}
function displayWidth(cm) {
  return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
}
function displayHeight(cm) {
  return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
} // Ensure the lineView.wrapping.heights array is populated. This is
// an array of bottom offsets for the lines that make up a drawn
// line. When lineWrapping is on, there might be more than one
// height.

function ensureLineHeights(cm, lineView, rect) {
  let wrapping = cm.options.lineWrapping;
  let curWidth = wrapping && displayWidth(cm);

  if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
    let heights = lineView.measure.heights = [];

    if (wrapping) {
      lineView.measure.width = curWidth;
      let rects = lineView.text.firstChild.getClientRects();

      for (let i = 0; i < rects.length - 1; i++) {
        let cur = rects[i],
            next = rects[i + 1];
        if (Math.abs(cur.bottom - next.bottom) > 2) heights.push((cur.bottom + next.top) / 2 - rect.top);
      }
    }

    heights.push(rect.bottom - rect.top);
  }
} // Find a line map (mapping character offsets to text nodes) and a
// measurement cache for the given line number. (A line view might
// contain multiple lines when collapsed ranges are present.)


function mapFromLineView(lineView, line, lineN) {
  if (lineView.line == line) return {
    map: lineView.measure.map,
    cache: lineView.measure.cache
  };

  for (let i = 0; i < lineView.rest.length; i++) if (lineView.rest[i] == line) return {
    map: lineView.measure.maps[i],
    cache: lineView.measure.caches[i]
  };

  for (let i = 0; i < lineView.rest.length; i++) if (lineNo(lineView.rest[i]) > lineN) return {
    map: lineView.measure.maps[i],
    cache: lineView.measure.caches[i],
    before: true
  };
} // Render a line into the hidden node display.externalMeasured. Used
// when measurement is needed for a line that's not in the viewport.

function updateExternalMeasurement(cm, line) {
  line = visualLine(line);
  let lineN = lineNo(line);
  let view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
  view.lineN = lineN;
  let built = view.built = buildLineContent(cm, view);
  view.text = built.pre;
  removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
  return view;
} // Get a {top, bottom, left, right} box (in line-local coordinates)
// for a given character.


function measureChar(cm, line, ch, bias) {
  return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
} // Find a line view that corresponds to the given line number.

function findViewForLine(cm, lineN) {
  if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) return cm.display.view[findViewIndex(cm, lineN)];
  let ext = cm.display.externalMeasured;
  if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) return ext;
} // Measurement can be split in two steps, the set-up work that
// applies to the whole line, and the measurement of the actual
// character. Functions like coordsChar, that need to do a lot of
// measurements in a row, can thus ensure that the set-up work is
// only done once.

function prepareMeasureForLine(cm, line) {
  let lineN = lineNo(line);
  let view = findViewForLine(cm, lineN);

  if (view && !view.text) {
    view = null;
  } else if (view && view.changes) {
    updateLineForChanges(cm, view, lineN, getDimensions(cm));
    cm.curOp.forceUpdate = true;
  }

  if (!view) view = updateExternalMeasurement(cm, line);
  let info = mapFromLineView(view, line, lineN);
  return {
    line: line,
    view: view,
    rect: null,
    map: info.map,
    cache: info.cache,
    before: info.before,
    hasHeights: false
  };
} // Given a prepared measurement object, measures the position of an
// actual character (or fetches it from the cache).

function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
  if (prepared.before) ch = -1;
  let key = ch + (bias || ""),
      found;

  if (prepared.cache.hasOwnProperty(key)) {
    found = prepared.cache[key];
  } else {
    if (!prepared.rect) prepared.rect = prepared.view.text.getBoundingClientRect();

    if (!prepared.hasHeights) {
      ensureLineHeights(cm, prepared.view, prepared.rect);
      prepared.hasHeights = true;
    }

    found = measureCharInner(cm, prepared, ch, bias);
    if (!found.bogus) prepared.cache[key] = found;
  }

  return {
    left: found.left,
    right: found.right,
    top: varHeight ? found.rtop : found.top,
    bottom: varHeight ? found.rbottom : found.bottom
  };
}
let nullRect = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
};
function nodeAndOffsetInLineMap(map, ch, bias) {
  let node, start, end, collapse, mStart, mEnd; // First, search the line map for the text node corresponding to,
  // or closest to, the target character.

  for (let i = 0; i < map.length; i += 3) {
    mStart = map[i];
    mEnd = map[i + 1];

    if (ch < mStart) {
      start = 0;
      end = 1;
      collapse = "left";
    } else if (ch < mEnd) {
      start = ch - mStart;
      end = start + 1;
    } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
      end = mEnd - mStart;
      start = end - 1;
      if (ch >= mEnd) collapse = "right";
    }

    if (start != null) {
      node = map[i + 2];
      if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right")) collapse = bias;
      if (bias == "left" && start == 0) while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
        node = map[(i -= 3) + 2];
        collapse = "left";
      }
      if (bias == "right" && start == mEnd - mStart) while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
        node = map[(i += 3) + 2];
        collapse = "right";
      }
      break;
    }
  }

  return {
    node: node,
    start: start,
    end: end,
    collapse: collapse,
    coverStart: mStart,
    coverEnd: mEnd
  };
}

function getUsefulRect(rects, bias) {
  let rect = nullRect;
  if (bias == "left") for (let i = 0; i < rects.length; i++) {
    if ((rect = rects[i]).left != rect.right) break;
  } else for (let i = rects.length - 1; i >= 0; i--) {
    if ((rect = rects[i]).left != rect.right) break;
  }
  return rect;
}

function measureCharInner(cm, prepared, ch, bias) {
  let place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
  let node = place.node,
      start = place.start,
      end = place.end,
      collapse = place.collapse;
  let rect;

  if (node.nodeType == 3) {
    // If it is a text node, use a range to retrieve the coordinates.
    for (let i = 0; i < 4; i++) {
      // Retry a maximum of 4 times when nonsense rectangles are returned
      while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) --start;

      while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) ++end;

      if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) rect = node.parentNode.getBoundingClientRect();else rect = getUsefulRect(range(node, start, end).getClientRects(), bias);
      if (rect.left || rect.right || start == 0) break;
      end = start;
      start = start - 1;
      collapse = "right";
    }

    if (ie && ie_version < 11) rect = maybeUpdateRectForZooming(cm.display.measure, rect);
  } else {
    // If it is a widget, simply get the box for the whole widget.
    if (start > 0) collapse = bias = "right";
    let rects;
    if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1) rect = rects[bias == "right" ? rects.length - 1 : 0];else rect = node.getBoundingClientRect();
  }

  if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
    let rSpan = node.parentNode.getClientRects()[0];
    if (rSpan) rect = {
      left: rSpan.left,
      right: rSpan.left + charWidth(cm.display),
      top: rSpan.top,
      bottom: rSpan.bottom
    };else rect = nullRect;
  }

  let rtop = rect.top - prepared.rect.top,
      rbot = rect.bottom - prepared.rect.top;
  let mid = (rtop + rbot) / 2;
  let heights = prepared.view.measure.heights;
  let i = 0;

  for (; i < heights.length - 1; i++) if (mid < heights[i]) break;

  let top = i ? heights[i - 1] : 0,
      bot = heights[i];
  let result = {
    left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
    right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
    top: top,
    bottom: bot
  };
  if (!rect.left && !rect.right) result.bogus = true;

  if (!cm.options.singleCursorHeightPerLine) {
    result.rtop = rtop;
    result.rbottom = rbot;
  }

  return result;
} // Work around problem with bounding client rects on ranges being
// returned incorrectly when zoomed on IE10 and below.


function maybeUpdateRectForZooming(measure, rect) {
  if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure)) return rect;
  let scaleX = screen.logicalXDPI / screen.deviceXDPI;
  let scaleY = screen.logicalYDPI / screen.deviceYDPI;
  return {
    left: rect.left * scaleX,
    right: rect.right * scaleX,
    top: rect.top * scaleY,
    bottom: rect.bottom * scaleY
  };
}

function clearLineMeasurementCacheFor(lineView) {
  if (lineView.measure) {
    lineView.measure.cache = {};
    lineView.measure.heights = null;
    if (lineView.rest) for (let i = 0; i < lineView.rest.length; i++) lineView.measure.caches[i] = {};
  }
}
function clearLineMeasurementCache(cm) {
  cm.display.externalMeasure = null;
  removeChildren(cm.display.lineMeasure);

  for (let i = 0; i < cm.display.view.length; i++) clearLineMeasurementCacheFor(cm.display.view[i]);
}
function clearCaches(cm) {
  clearLineMeasurementCache(cm);
  cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
  if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
  cm.display.lineNumChars = null;
}

function pageScrollX() {
  // Work around https://bugs.chromium.org/p/chromium/issues/detail?id=489206
  // which causes page_Offset and bounding client rects to use
  // different reference viewports and invalidate our calculations.
  if (chrome && android) return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
  return window.pageXOffset || (document.documentElement || document.body).scrollLeft;
}

function pageScrollY() {
  if (chrome && android) return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
  return window.pageYOffset || (document.documentElement || document.body).scrollTop;
}

function widgetTopHeight(lineObj) {
  let height = 0;
  if (lineObj.widgets) for (let i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) height += widgetHeight(lineObj.widgets[i]);
  return height;
} // Converts a {top, bottom, left, right} box from line-local
// coordinates into another coordinate system. Context may be one of
// "line", "div" (display.lineDiv), "local"./null (editor), "window",
// or "page".


function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
  if (!includeWidgets) {
    let height = widgetTopHeight(lineObj);
    rect.top += height;
    rect.bottom += height;
  }

  if (context == "line") return rect;
  if (!context) context = "local";
  let yOff = heightAtLine(lineObj);
  if (context == "local") yOff += paddingTop(cm.display);else yOff -= cm.display.viewOffset;

  if (context == "page" || context == "window") {
    let lOff = cm.display.lineSpace.getBoundingClientRect();
    yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
    let xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
    rect.left += xOff;
    rect.right += xOff;
  }

  rect.top += yOff;
  rect.bottom += yOff;
  return rect;
} // Coverts a box from "div" coords to another coordinate system.
// Context may be "window", "page", "div", or "local"./null.

function fromCoordSystem(cm, coords, context) {
  if (context == "div") return coords;
  let left = coords.left,
      top = coords.top; // First move into "page" coordinate system

  if (context == "page") {
    left -= pageScrollX();
    top -= pageScrollY();
  } else if (context == "local" || !context) {
    let localBox = cm.display.sizer.getBoundingClientRect();
    left += localBox.left;
    top += localBox.top;
  }

  let lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
  return {
    left: left - lineSpaceBox.left,
    top: top - lineSpaceBox.top
  };
}
function charCoords(cm, pos, context, lineObj, bias) {
  if (!lineObj) lineObj = getLine(cm.doc, pos.line);
  return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
} // Returns a box for a given cursor position, which may have an
// 'other' property containing the position of the secondary cursor
// on a bidi boundary.
// A cursor Pos(line, char, "before") is on the same visual line as `char - 1`
// and after `char - 1` in writing order of `char - 1`
// A cursor Pos(line, char, "after") is on the same visual line as `char`
// and before `char` in writing order of `char`
// Examples (upper-case letters are RTL, lower-case are LTR):
//     Pos(0, 1, ...)
//     before   after
// ab     a|b     a|b
// aB     a|B     aB|
// Ab     |Ab     A|b
// AB     B|A     B|A
// Every position after the last character on a line is considered to stick
// to the last character on the line.

function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
  lineObj = lineObj || getLine(cm.doc, pos.line);
  if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);

  function get(ch, right) {
    let m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
    if (right) m.left = m.right;else m.right = m.left;
    return intoCoordSystem(cm, lineObj, m, context);
  }

  let order = getOrder(lineObj, cm.doc.direction),
      ch = pos.ch,
      sticky = pos.sticky;

  if (ch >= lineObj.text.length) {
    ch = lineObj.text.length;
    sticky = "before";
  } else if (ch <= 0) {
    ch = 0;
    sticky = "after";
  }

  if (!order) return get(sticky == "before" ? ch - 1 : ch, sticky == "before");

  function getBidi(ch, partPos, invert) {
    let part = order[partPos],
        right = part.level == 1;
    return get(invert ? ch - 1 : ch, right != invert);
  }

  let partPos = getBidiPartAt(order, ch, sticky);
  let other = bidiOther;
  let val = getBidi(ch, partPos, sticky == "before");
  if (other != null) val.other = getBidi(ch, other, sticky != "before");
  return val;
} // Used to cheaply estimate the coordinates for a position. Used for
// intermediate scroll updates.

function estimateCoords(cm, pos) {
  let left = 0;
  pos = clipPos(cm.doc, pos);
  if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
  let lineObj = getLine(cm.doc, pos.line);
  let top = heightAtLine(lineObj) + paddingTop(cm.display);
  return {
    left: left,
    right: left,
    top: top,
    bottom: top + lineObj.height
  };
} // Positions returned by coordsChar contain some extra information.
// xRel is the relative x position of the input coordinates compared
// to the found position (so xRel > 0 means the coordinates are to
// the right of the character position, for example). When outside
// is true, that means the coordinates lie outside the line's
// vertical range.

function PosWithInfo(line, ch, sticky, outside, xRel) {
  let pos = Pos(line, ch, sticky);
  pos.xRel = xRel;
  if (outside) pos.outside = outside;
  return pos;
} // Compute the character position closest to the given coordinates.
// Input must be lineSpace-local ("div" coordinate system).


function coordsChar(cm, x, y) {
  let doc = cm.doc;
  y += cm.display.viewOffset;
  if (y < 0) return PosWithInfo(doc.first, 0, null, -1, -1);
  let lineN = lineAtHeight(doc, y),
      last = doc.first + doc.size - 1;
  if (lineN > last) return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, null, 1, 1);
  if (x < 0) x = 0;
  let lineObj = getLine(doc, lineN);

  for (;;) {
    let found = coordsCharInner(cm, lineObj, lineN, x, y);
    let collapsed = collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 || found.outside > 0 ? 1 : 0));
    if (!collapsed) return found;
    let rangeEnd = collapsed.find(1);
    if (rangeEnd.line == lineN) return rangeEnd;
    lineObj = getLine(doc, lineN = rangeEnd.line);
  }
}

function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
  y -= widgetTopHeight(lineObj);
  let end = lineObj.text.length;
  let begin = findFirst(ch => measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y, end, 0);
  end = findFirst(ch => measureCharPrepared(cm, preparedMeasure, ch).top > y, begin, end);
  return {
    begin,
    end
  };
}

function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
  if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
  let targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
  return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
} // Returns true if the given side of a box is after the given
// coordinates, in top-to-bottom, left-to-right order.

function boxIsAfter(box, x, y, left) {
  return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x;
}

function coordsCharInner(cm, lineObj, lineNo, x, y) {
  // Move y into line-local coordinate space
  y -= heightAtLine(lineObj);
  let preparedMeasure = prepareMeasureForLine(cm, lineObj); // When directly calling `measureCharPrepared`, we have to adjust
  // for the widgets at this line.

  let widgetHeight = widgetTopHeight(lineObj);
  let begin = 0,
      end = lineObj.text.length,
      ltr = true;
  let order = getOrder(lineObj, cm.doc.direction); // If the line isn't plain left-to-right text, first figure out
  // which bidi section the coordinates fall into.

  if (order) {
    let part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo, preparedMeasure, order, x, y);
    ltr = part.level != 1; // The awkward -1 offsets are needed because findFirst (called
    // on these below) will treat its first bound as inclusive,
    // second as exclusive, but we want to actually address the
    // characters in the part's range

    begin = ltr ? part.from : part.to - 1;
    end = ltr ? part.to : part.from - 1;
  } // A binary search to find the first character whose bounding box
  // starts after the coordinates. If we run across any whose box wrap
  // the coordinates, store that.


  let chAround = null,
      boxAround = null;
  let ch = findFirst(ch => {
    let box = measureCharPrepared(cm, preparedMeasure, ch);
    box.top += widgetHeight;
    box.bottom += widgetHeight;
    if (!boxIsAfter(box, x, y, false)) return false;

    if (box.top <= y && box.left <= x) {
      chAround = ch;
      boxAround = box;
    }

    return true;
  }, begin, end);
  let baseX,
      sticky,
      outside = false; // If a box around the coordinates was found, use that

  if (boxAround) {
    // Distinguish coordinates nearer to the left or right side of the box
    let atLeft = x - boxAround.left < boxAround.right - x,
        atStart = atLeft == ltr;
    ch = chAround + (atStart ? 0 : 1);
    sticky = atStart ? "after" : "before";
    baseX = atLeft ? boxAround.left : boxAround.right;
  } else {
    // (Adjust for extended bound, if necessary.)
    if (!ltr && (ch == end || ch == begin)) ch++; // To determine which side to associate with, get the box to the
    // left of the character and compare it's vertical position to the
    // coordinates

    sticky = ch == 0 ? "after" : ch == lineObj.text.length ? "before" : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight <= y == ltr ? "after" : "before"; // Now get accurate coordinates for this place, in order to get a
    // base X position

    let coords = cursorCoords(cm, Pos(lineNo, ch, sticky), "line", lineObj, preparedMeasure);
    baseX = coords.left;
    outside = y < coords.top ? -1 : y >= coords.bottom ? 1 : 0;
  }

  ch = skipExtendingChars(lineObj.text, ch, 1);
  return PosWithInfo(lineNo, ch, sticky, outside, x - baseX);
}

function coordsBidiPart(cm, lineObj, lineNo, preparedMeasure, order, x, y) {
  // Bidi parts are sorted left-to-right, and in a non-line-wrapping
  // situation, we can take this ordering to correspond to the visual
  // ordering. This finds the first part whose end is after the given
  // coordinates.
  let index = findFirst(i => {
    let part = order[i],
        ltr = part.level != 1;
    return boxIsAfter(cursorCoords(cm, Pos(lineNo, ltr ? part.to : part.from, ltr ? "before" : "after"), "line", lineObj, preparedMeasure), x, y, true);
  }, 0, order.length - 1);
  let part = order[index]; // If this isn't the first part, the part's start is also after
  // the coordinates, and the coordinates aren't on the same line as
  // that start, move one part back.

  if (index > 0) {
    let ltr = part.level != 1;
    let start = cursorCoords(cm, Pos(lineNo, ltr ? part.from : part.to, ltr ? "after" : "before"), "line", lineObj, preparedMeasure);
    if (boxIsAfter(start, x, y, true) && start.top > y) part = order[index - 1];
  }

  return part;
}

function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
  // In a wrapped line, rtl text on wrapping boundaries can do things
  // that don't correspond to the ordering in our `order` array at
  // all, so a binary search doesn't work, and we want to return a
  // part that only spans one line so that the binary search in
  // coordsCharInner is safe. As such, we first find the extent of the
  // wrapped line, and then do a flat search in which we discard any
  // spans that aren't on the line.
  let {
    begin,
    end
  } = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
  if (/\s/.test(lineObj.text.charAt(end - 1))) end--;
  let part = null,
      closestDist = null;

  for (let i = 0; i < order.length; i++) {
    let p = order[i];
    if (p.from >= end || p.to <= begin) continue;
    let ltr = p.level != 1;
    let endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right; // Weigh against spans ending before this, so that they are only
    // picked if nothing ends after

    let dist = endX < x ? x - endX + 1e9 : endX - x;

    if (!part || closestDist > dist) {
      part = p;
      closestDist = dist;
    }
  }

  if (!part) part = order[order.length - 1]; // Clip the part to the wrapped line.

  if (part.from < begin) part = {
    from: begin,
    to: part.to,
    level: part.level
  };
  if (part.to > end) part = {
    from: part.from,
    to: end,
    level: part.level
  };
  return part;
}

let measureText; // Compute the default text height.

function textHeight(display) {
  if (display.cachedTextHeight != null) return display.cachedTextHeight;

  if (measureText == null) {
    measureText = elt("pre", null, "CodeMirror-line-like"); // Measure a bunch of lines, for browsers that compute
    // fractional heights.

    for (let i = 0; i < 49; ++i) {
      measureText.appendChild(document.createTextNode("x"));
      measureText.appendChild(elt("br"));
    }

    measureText.appendChild(document.createTextNode("x"));
  }

  removeChildrenAndAdd(display.measure, measureText);
  let height = measureText.offsetHeight / 50;
  if (height > 3) display.cachedTextHeight = height;
  removeChildren(display.measure);
  return height || 1;
} // Compute the default character width.

function charWidth(display) {
  if (display.cachedCharWidth != null) return display.cachedCharWidth;
  let anchor = elt("span", "xxxxxxxxxx");
  let pre = elt("pre", [anchor], "CodeMirror-line-like");
  removeChildrenAndAdd(display.measure, pre);
  let rect = anchor.getBoundingClientRect(),
      width = (rect.right - rect.left) / 10;
  if (width > 2) display.cachedCharWidth = width;
  return width || 10;
} // Do a bulk-read of the DOM positions and sizes needed to draw the
// view, so that we don't interleave reading and writing to the DOM.

function getDimensions(cm) {
  let d = cm.display,
      left = {},
      width = {};
  let gutterLeft = d.gutters.clientLeft;

  for (let n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
    let id = cm.display.gutterSpecs[i].className;
    left[id] = n.offsetLeft + n.clientLeft + gutterLeft;
    width[id] = n.clientWidth;
  }

  return {
    fixedPos: compensateForHScroll(d),
    gutterTotalWidth: d.gutters.offsetWidth,
    gutterLeft: left,
    gutterWidth: width,
    wrapperWidth: d.wrapper.clientWidth
  };
} // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
// but using getBoundingClientRect to get a sub-pixel-accurate
// result.

function compensateForHScroll(display) {
  return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
} // Returns a function that estimates the height of a line, to use as
// first approximation until the line becomes visible (and is thus
// properly measurable).

function estimateHeight(cm) {
  let th = textHeight(cm.display),
      wrapping = cm.options.lineWrapping;
  let perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
  return line => {
    if (lineIsHidden(cm.doc, line)) return 0;
    let widgetsHeight = 0;
    if (line.widgets) for (let i = 0; i < line.widgets.length; i++) {
      if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
    }
    if (wrapping) return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;else return widgetsHeight + th;
  };
}
function estimateLineHeights(cm) {
  let doc = cm.doc,
      est = estimateHeight(cm);
  doc.iter(line => {
    let estHeight = est(line);
    if (estHeight != line.height) updateLineHeight(line, estHeight);
  });
} // Given a mouse event, find the corresponding position. If liberal
// is false, it checks whether a gutter or scrollbar was clicked,
// and returns null if it was. forRect is used by rectangular
// selections, and tries to estimate a character position even for
// coordinates beyond the right of the text.

function posFromMouse(cm, e, liberal, forRect) {
  let display = cm.display;
  if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") return null;
  let x,
      y,
      space = display.lineSpace.getBoundingClientRect(); // Fails unpredictably on IE[67] when mouse is dragged around quickly.

  try {
    x = e.clientX - space.left;
    y = e.clientY - space.top;
  } catch (e) {
    return null;
  }

  let coords = coordsChar(cm, x, y),
      line;

  if (forRect && coords.xRel > 0 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
    let colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
    coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
  }

  return coords;
} // Find the view element corresponding to a given line. Return null
// when the line isn't visible.

function findViewIndex(cm, n) {
  if (n >= cm.display.viewTo) return null;
  n -= cm.display.viewFrom;
  if (n < 0) return null;
  let view = cm.display.view;

  for (let i = 0; i < view.length; i++) {
    n -= view[i].size;
    if (n < 0) return i;
  }
}

// document. From and to are in pre-change coordinates. Lendiff is
// the amount of lines added or subtracted by the change. This is
// used for changes that span multiple lines, or change the way
// lines are divided into visual lines. regLineChange (below)
// registers single-line changes.

function regChange(cm, from, to, lendiff) {
  if (from == null) from = cm.doc.first;
  if (to == null) to = cm.doc.first + cm.doc.size;
  if (!lendiff) lendiff = 0;
  let display = cm.display;
  if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from)) display.updateLineNumbers = from;
  cm.curOp.viewChanged = true;

  if (from >= display.viewTo) {
    // Change after
    if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo) resetView(cm);
  } else if (to <= display.viewFrom) {
    // Change before
    if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
      resetView(cm);
    } else {
      display.viewFrom += lendiff;
      display.viewTo += lendiff;
    }
  } else if (from <= display.viewFrom && to >= display.viewTo) {
    // Full overlap
    resetView(cm);
  } else if (from <= display.viewFrom) {
    // Top overlap
    let cut = viewCuttingPoint(cm, to, to + lendiff, 1);

    if (cut) {
      display.view = display.view.slice(cut.index);
      display.viewFrom = cut.lineN;
      display.viewTo += lendiff;
    } else {
      resetView(cm);
    }
  } else if (to >= display.viewTo) {
    // Bottom overlap
    let cut = viewCuttingPoint(cm, from, from, -1);

    if (cut) {
      display.view = display.view.slice(0, cut.index);
      display.viewTo = cut.lineN;
    } else {
      resetView(cm);
    }
  } else {
    // Gap in the middle
    let cutTop = viewCuttingPoint(cm, from, from, -1);
    let cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);

    if (cutTop && cutBot) {
      display.view = display.view.slice(0, cutTop.index).concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
      display.viewTo += lendiff;
    } else {
      resetView(cm);
    }
  }

  let ext = display.externalMeasured;

  if (ext) {
    if (to < ext.lineN) ext.lineN += lendiff;else if (from < ext.lineN + ext.size) display.externalMeasured = null;
  }
} // Register a change to a single line. Type must be one of "text",
// "gutter", "class", "widget"

function regLineChange(cm, line, type) {
  cm.curOp.viewChanged = true;
  let display = cm.display,
      ext = cm.display.externalMeasured;
  if (ext && line >= ext.lineN && line < ext.lineN + ext.size) display.externalMeasured = null;
  if (line < display.viewFrom || line >= display.viewTo) return;
  let lineView = display.view[findViewIndex(cm, line)];
  if (lineView.node == null) return;
  let arr = lineView.changes || (lineView.changes = []);
  if (indexOf(arr, type) == -1) arr.push(type);
} // Clear the view.

function resetView(cm) {
  cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
  cm.display.view = [];
  cm.display.viewOffset = 0;
}

function viewCuttingPoint(cm, oldN, newN, dir) {
  let index = findViewIndex(cm, oldN),
      diff,
      view = cm.display.view;
  if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size) return {
    index: index,
    lineN: newN
  };
  let n = cm.display.viewFrom;

  for (let i = 0; i < index; i++) n += view[i].size;

  if (n != oldN) {
    if (dir > 0) {
      if (index == view.length - 1) return null;
      diff = n + view[index].size - oldN;
      index++;
    } else {
      diff = n - oldN;
    }

    oldN += diff;
    newN += diff;
  }

  while (visualLineNo(cm.doc, newN) != newN) {
    if (index == (dir < 0 ? 0 : view.length - 1)) return null;
    newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
    index += dir;
  }

  return {
    index: index,
    lineN: newN
  };
} // Force the view to cover a given range, adding empty view element
// or clipping off existing ones as needed.


function adjustView(cm, from, to) {
  let display = cm.display,
      view = display.view;

  if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
    display.view = buildViewArray(cm, from, to);
    display.viewFrom = from;
  } else {
    if (display.viewFrom > from) display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);else if (display.viewFrom < from) display.view = display.view.slice(findViewIndex(cm, from));
    display.viewFrom = from;
    if (display.viewTo < to) display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));else if (display.viewTo > to) display.view = display.view.slice(0, findViewIndex(cm, to));
  }

  display.viewTo = to;
} // Count the number of lines in the view whose DOM representation is
// out of date (or nonexistent).

function countDirtyView(cm) {
  let view = cm.display.view,
      dirty = 0;

  for (let i = 0; i < view.length; i++) {
    let lineView = view[i];
    if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
  }

  return dirty;
}

function updateSelection(cm) {
  cm.display.input.showSelection(cm.display.input.prepareSelection());
}
function prepareSelection(cm, primary = true) {
  let doc = cm.doc,
      result = {};
  let curFragment = result.cursors = document.createDocumentFragment();
  let selFragment = result.selection = document.createDocumentFragment();

  for (let i = 0; i < doc.sel.ranges.length; i++) {
    if (!primary && i == doc.sel.primIndex) continue;
    let range = doc.sel.ranges[i];
    if (range.from().line >= cm.display.viewTo || range.to().line < cm.display.viewFrom) continue;
    let collapsed = range.empty();
    if (collapsed || cm.options.showCursorWhenSelecting) drawSelectionCursor(cm, range.head, curFragment);
    if (!collapsed) drawSelectionRange(cm, range, selFragment);
  }

  return result;
} // Draws a cursor for the given range

function drawSelectionCursor(cm, head, output) {
  let pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);
  let cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
  cursor.style.left = pos.left + "px";
  cursor.style.top = pos.top + "px";
  cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";

  if (pos.other) {
    // Secondary cursor, shown when on a 'jump' in bi-directional text
    let otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
    otherCursor.style.display = "";
    otherCursor.style.left = pos.other.left + "px";
    otherCursor.style.top = pos.other.top + "px";
    otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
  }
}

function cmpCoords(a, b) {
  return a.top - b.top || a.left - b.left;
} // Draws the given range as a highlighted selection


function drawSelectionRange(cm, range, output) {
  let display = cm.display,
      doc = cm.doc;
  let fragment = document.createDocumentFragment();
  let padding = paddingH(cm.display),
      leftSide = padding.left;
  let rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
  let docLTR = doc.direction == "ltr";

  function add(left, top, width, bottom) {
    if (top < 0) top = 0;
    top = Math.round(top);
    bottom = Math.round(bottom);
    fragment.appendChild(elt("div", null, "CodeMirror-selected", `position: absolute; left: ${left}px;
                             top: ${top}px; width: ${width == null ? rightSide - left : width}px;
                             height: ${bottom - top}px`));
  }

  function drawForLine(line, fromArg, toArg) {
    let lineObj = getLine(doc, line);
    let lineLen = lineObj.text.length;
    let start, end;

    function coords(ch, bias) {
      return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
    }

    function wrapX(pos, dir, side) {
      let extent = wrappedLineExtentChar(cm, lineObj, null, pos);
      let prop = dir == "ltr" == (side == "after") ? "left" : "right";
      let ch = side == "after" ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
      return coords(ch, prop)[prop];
    }

    let order = getOrder(lineObj, doc.direction);
    iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, (from, to, dir, i) => {
      let ltr = dir == "ltr";
      let fromPos = coords(from, ltr ? "left" : "right");
      let toPos = coords(to - 1, ltr ? "right" : "left");
      let openStart = fromArg == null && from == 0,
          openEnd = toArg == null && to == lineLen;
      let first = i == 0,
          last = !order || i == order.length - 1;

      if (toPos.top - fromPos.top <= 3) {
        // Single line
        let openLeft = (docLTR ? openStart : openEnd) && first;
        let openRight = (docLTR ? openEnd : openStart) && last;
        let left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
        let right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
        add(left, fromPos.top, right - left, fromPos.bottom);
      } else {
        // Multiple lines
        let topLeft, topRight, botLeft, botRight;

        if (ltr) {
          topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
          topRight = docLTR ? rightSide : wrapX(from, dir, "before");
          botLeft = docLTR ? leftSide : wrapX(to, dir, "after");
          botRight = docLTR && openEnd && last ? rightSide : toPos.right;
        } else {
          topLeft = !docLTR ? leftSide : wrapX(from, dir, "before");
          topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
          botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
          botRight = !docLTR ? rightSide : wrapX(to, dir, "after");
        }

        add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
        if (fromPos.bottom < toPos.top) add(leftSide, fromPos.bottom, null, toPos.top);
        add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
      }

      if (!start || cmpCoords(fromPos, start) < 0) start = fromPos;
      if (cmpCoords(toPos, start) < 0) start = toPos;
      if (!end || cmpCoords(fromPos, end) < 0) end = fromPos;
      if (cmpCoords(toPos, end) < 0) end = toPos;
    });
    return {
      start: start,
      end: end
    };
  }

  let sFrom = range.from(),
      sTo = range.to();

  if (sFrom.line == sTo.line) {
    drawForLine(sFrom.line, sFrom.ch, sTo.ch);
  } else {
    let fromLine = getLine(doc, sFrom.line),
        toLine = getLine(doc, sTo.line);
    let singleVLine = visualLine(fromLine) == visualLine(toLine);
    let leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
    let rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;

    if (singleVLine) {
      if (leftEnd.top < rightStart.top - 2) {
        add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
        add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
      } else {
        add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
      }
    }

    if (leftEnd.bottom < rightStart.top) add(leftSide, leftEnd.bottom, null, rightStart.top);
  }

  output.appendChild(fragment);
} // Cursor-blinking


function restartBlink(cm) {
  if (!cm.state.focused) return;
  let display = cm.display;
  clearInterval(display.blinker);
  let on = true;
  display.cursorDiv.style.visibility = "";
  if (cm.options.cursorBlinkRate > 0) display.blinker = setInterval(() => {
    if (!cm.hasFocus()) onBlur(cm);
    display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
  }, cm.options.cursorBlinkRate);else if (cm.options.cursorBlinkRate < 0) display.cursorDiv.style.visibility = "hidden";
}

function ensureFocus(cm) {
  if (!cm.hasFocus()) {
    cm.display.input.focus();
    if (!cm.state.focused) onFocus(cm);
  }
}
function delayBlurEvent(cm) {
  cm.state.delayingBlurEvent = true;
  setTimeout(() => {
    if (cm.state.delayingBlurEvent) {
      cm.state.delayingBlurEvent = false;
      if (cm.state.focused) onBlur(cm);
    }
  }, 100);
}
function onFocus(cm, e) {
  if (cm.state.delayingBlurEvent && !cm.state.draggingText) cm.state.delayingBlurEvent = false;
  if (cm.options.readOnly == "nocursor") return;

  if (!cm.state.focused) {
    signal(cm, "focus", cm, e);
    cm.state.focused = true;
    addClass(cm.display.wrapper, "CodeMirror-focused"); // This test prevents this from firing when a context
    // menu is closed (since the input reset would kill the
    // select-all detection hack)

    if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
      cm.display.input.reset();
      if (webkit) setTimeout(() => cm.display.input.reset(true), 20); // Issue #1730
    }

    cm.display.input.receivedFocus();
  }

  restartBlink(cm);
}
function onBlur(cm, e) {
  if (cm.state.delayingBlurEvent) return;

  if (cm.state.focused) {
    signal(cm, "blur", cm, e);
    cm.state.focused = false;
    rmClass(cm.display.wrapper, "CodeMirror-focused");
  }

  clearInterval(cm.display.blinker);
  setTimeout(() => {
    if (!cm.state.focused) cm.display.shift = false;
  }, 150);
}

// stored heights to match.

function updateHeightsInViewport(cm) {
  let display = cm.display;
  let prevBottom = display.lineDiv.offsetTop;

  for (let i = 0; i < display.view.length; i++) {
    let cur = display.view[i],
        wrapping = cm.options.lineWrapping;
    let height,
        width = 0;
    if (cur.hidden) continue;

    if (ie && ie_version < 8) {
      let bot = cur.node.offsetTop + cur.node.offsetHeight;
      height = bot - prevBottom;
      prevBottom = bot;
    } else {
      let box = cur.node.getBoundingClientRect();
      height = box.bottom - box.top; // Check that lines don't extend past the right of the current
      // editor width

      if (!wrapping && cur.text.firstChild) width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
    }

    let diff = cur.line.height - height;

    if (diff > .005 || diff < -.005) {
      updateLineHeight(cur.line, height);
      updateWidgetHeight(cur.line);
      if (cur.rest) for (let j = 0; j < cur.rest.length; j++) updateWidgetHeight(cur.rest[j]);
    }

    if (width > cm.display.sizerWidth) {
      let chWidth = Math.ceil(width / charWidth(cm.display));

      if (chWidth > cm.display.maxLineLength) {
        cm.display.maxLineLength = chWidth;
        cm.display.maxLine = cur.line;
        cm.display.maxLineChanged = true;
      }
    }
  }
} // Read and store the height of line widgets associated with the
// given line.

function updateWidgetHeight(line) {
  if (line.widgets) for (let i = 0; i < line.widgets.length; ++i) {
    let w = line.widgets[i],
        parent = w.node.parentNode;
    if (parent) w.height = parent.offsetHeight;
  }
} // Compute the lines that are visible in a given viewport (defaults
// the the current scroll position). viewport may contain top,
// height, and ensure (see op.scrollToPos) properties.


function visibleLines(display, doc, viewport) {
  let top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
  top = Math.floor(top - paddingTop(display));
  let bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
  let from = lineAtHeight(doc, top),
      to = lineAtHeight(doc, bottom); // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
  // forces those lines into the viewport (if possible).

  if (viewport && viewport.ensure) {
    let ensureFrom = viewport.ensure.from.line,
        ensureTo = viewport.ensure.to.line;

    if (ensureFrom < from) {
      from = ensureFrom;
      to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
    } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
      from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
      to = ensureTo;
    }
  }

  return {
    from: from,
    to: Math.max(to, from + 1)
  };
}

// If an editor sits on the top or bottom of the window, partially
// scrolled out of view, this ensures that the cursor is visible.

function maybeScrollWindow(cm, rect) {
  if (signalDOMEvent(cm, "scrollCursorIntoView")) return;
  let display = cm.display,
      box = display.sizer.getBoundingClientRect(),
      doScroll = null;
  if (rect.top + box.top < 0) doScroll = true;else if (rect.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;

  if (doScroll != null && !phantom) {
    let scrollNode = elt("div", "\u200b", null, `position: absolute;
                         top: ${rect.top - display.viewOffset - paddingTop(cm.display)}px;
                         height: ${rect.bottom - rect.top + scrollGap(cm) + display.barHeight}px;
                         left: ${rect.left}px; width: ${Math.max(2, rect.right - rect.left)}px;`);
    cm.display.lineSpace.appendChild(scrollNode);
    scrollNode.scrollIntoView(doScroll);
    cm.display.lineSpace.removeChild(scrollNode);
  }
} // Scroll a given position into view (immediately), verifying that
// it actually became visible (as line heights are accurately
// measured, the position of something may 'drift' during drawing).

function scrollPosIntoView(cm, pos, end, margin) {
  if (margin == null) margin = 0;
  let rect;

  if (!cm.options.lineWrapping && pos == end) {
    // Set pos and end to the cursor positions around the character pos sticks to
    // If pos.sticky == "before", that is around pos.ch - 1, otherwise around pos.ch
    // If pos == Pos(_, 0, "before"), pos and end are unchanged
    end = pos.sticky == "before" ? Pos(pos.line, pos.ch + 1, "before") : pos;
    pos = pos.ch ? Pos(pos.line, pos.sticky == "before" ? pos.ch - 1 : pos.ch, "after") : pos;
  }

  for (let limit = 0; limit < 5; limit++) {
    let changed = false;
    let coords = cursorCoords(cm, pos);
    let endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
    rect = {
      left: Math.min(coords.left, endCoords.left),
      top: Math.min(coords.top, endCoords.top) - margin,
      right: Math.max(coords.left, endCoords.left),
      bottom: Math.max(coords.bottom, endCoords.bottom) + margin
    };
    let scrollPos = calculateScrollPos(cm, rect);
    let startTop = cm.doc.scrollTop,
        startLeft = cm.doc.scrollLeft;

    if (scrollPos.scrollTop != null) {
      updateScrollTop(cm, scrollPos.scrollTop);
      if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
    }

    if (scrollPos.scrollLeft != null) {
      setScrollLeft(cm, scrollPos.scrollLeft);
      if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
    }

    if (!changed) break;
  }

  return rect;
} // Scroll a given set of coordinates into view (immediately).

function scrollIntoView(cm, rect) {
  let scrollPos = calculateScrollPos(cm, rect);
  if (scrollPos.scrollTop != null) updateScrollTop(cm, scrollPos.scrollTop);
  if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
} // Calculate a new scroll position needed to scroll the given
// rectangle into view. Returns an object with scrollTop and
// scrollLeft properties. When these are undefined, the
// vertical/horizontal position does not need to be adjusted.

function calculateScrollPos(cm, rect) {
  let display = cm.display,
      snapMargin = textHeight(cm.display);
  if (rect.top < 0) rect.top = 0;
  let screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
  let screen = displayHeight(cm),
      result = {};
  if (rect.bottom - rect.top > screen) rect.bottom = rect.top + screen;
  let docBottom = cm.doc.height + paddingVert(display);
  let atTop = rect.top < snapMargin,
      atBottom = rect.bottom > docBottom - snapMargin;

  if (rect.top < screentop) {
    result.scrollTop = atTop ? 0 : rect.top;
  } else if (rect.bottom > screentop + screen) {
    let newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen);
    if (newTop != screentop) result.scrollTop = newTop;
  }

  let gutterSpace = cm.options.fixedGutter ? 0 : display.gutters.offsetWidth;
  let screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft - gutterSpace;
  let screenw = displayWidth(cm) - display.gutters.offsetWidth;
  let tooWide = rect.right - rect.left > screenw;
  if (tooWide) rect.right = rect.left + screenw;
  if (rect.left < 10) result.scrollLeft = 0;else if (rect.left < screenleft) result.scrollLeft = Math.max(0, rect.left + gutterSpace - (tooWide ? 0 : 10));else if (rect.right > screenw + screenleft - 3) result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw;
  return result;
} // Store a relative adjustment to the scroll position in the current
// operation (to be applied when the operation finishes).


function addToScrollTop(cm, top) {
  if (top == null) return;
  resolveScrollToPos(cm);
  cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
} // Make sure that at the end of the operation the current cursor is
// shown.

function ensureCursorVisible(cm) {
  resolveScrollToPos(cm);
  let cur = cm.getCursor();
  cm.curOp.scrollToPos = {
    from: cur,
    to: cur,
    margin: cm.options.cursorScrollMargin
  };
}
function scrollToCoords(cm, x, y) {
  if (x != null || y != null) resolveScrollToPos(cm);
  if (x != null) cm.curOp.scrollLeft = x;
  if (y != null) cm.curOp.scrollTop = y;
}
function scrollToRange(cm, range) {
  resolveScrollToPos(cm);
  cm.curOp.scrollToPos = range;
} // When an operation has its scrollToPos property set, and another
// scroll action is applied before the end of the operation, this
// 'simulates' scrolling that position into view in a cheap way, so
// that the effect of intermediate scroll commands is not ignored.

function resolveScrollToPos(cm) {
  let range = cm.curOp.scrollToPos;

  if (range) {
    cm.curOp.scrollToPos = null;
    let from = estimateCoords(cm, range.from),
        to = estimateCoords(cm, range.to);
    scrollToCoordsRange(cm, from, to, range.margin);
  }
}

function scrollToCoordsRange(cm, from, to, margin) {
  let sPos = calculateScrollPos(cm, {
    left: Math.min(from.left, to.left),
    top: Math.min(from.top, to.top) - margin,
    right: Math.max(from.right, to.right),
    bottom: Math.max(from.bottom, to.bottom) + margin
  });
  scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
} // Sync the scrollable area and scrollbars, ensure the viewport
// covers the visible area.

function updateScrollTop(cm, val) {
  if (Math.abs(cm.doc.scrollTop - val) < 2) return;
  if (!gecko) updateDisplaySimple(cm, {
    top: val
  });
  setScrollTop(cm, val, true);
  if (gecko) updateDisplaySimple(cm);
  startWorker(cm, 100);
}
function setScrollTop(cm, val, forceScroll) {
  val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val));
  if (cm.display.scroller.scrollTop == val && !forceScroll) return;
  cm.doc.scrollTop = val;
  cm.display.scrollbars.setScrollTop(val);
  if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
} // Sync scroller and scrollbar, ensure the gutter elements are
// aligned.

function setScrollLeft(cm, val, isScroller, forceScroll) {
  val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth));
  if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) return;
  cm.doc.scrollLeft = val;
  alignHorizontally(cm);
  if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
  cm.display.scrollbars.setScrollLeft(val);
}

// Prepare DOM reads needed to update the scrollbars. Done in one
// shot to minimize update/measure roundtrips.

function measureForScrollbars(cm) {
  let d = cm.display,
      gutterW = d.gutters.offsetWidth;
  let docH = Math.round(cm.doc.height + paddingVert(cm.display));
  return {
    clientHeight: d.scroller.clientHeight,
    viewHeight: d.wrapper.clientHeight,
    scrollWidth: d.scroller.scrollWidth,
    clientWidth: d.scroller.clientWidth,
    viewWidth: d.wrapper.clientWidth,
    barLeft: cm.options.fixedGutter ? gutterW : 0,
    docHeight: docH,
    scrollHeight: docH + scrollGap(cm) + d.barHeight,
    nativeBarWidth: d.nativeBarWidth,
    gutterWidth: gutterW
  };
}

class NativeScrollbars {
  constructor(place, scroll, cm) {
    this.cm = cm;
    let vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
    let horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    vert.tabIndex = horiz.tabIndex = -1;
    place(vert);
    place(horiz);
    on(vert, "scroll", () => {
      if (vert.clientHeight) scroll(vert.scrollTop, "vertical");
    });
    on(horiz, "scroll", () => {
      if (horiz.clientWidth) scroll(horiz.scrollLeft, "horizontal");
    });
    this.checkedZeroWidth = false; // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).

    if (ie && ie_version < 8) this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
  }

  update(measure) {
    let needsH = measure.scrollWidth > measure.clientWidth + 1;
    let needsV = measure.scrollHeight > measure.clientHeight + 1;
    let sWidth = measure.nativeBarWidth;

    if (needsV) {
      this.vert.style.display = "block";
      this.vert.style.bottom = needsH ? sWidth + "px" : "0";
      let totalHeight = measure.viewHeight - (needsH ? sWidth : 0); // A bug in IE8 can cause this value to be negative, so guard it.

      this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
    } else {
      this.vert.style.display = "";
      this.vert.firstChild.style.height = "0";
    }

    if (needsH) {
      this.horiz.style.display = "block";
      this.horiz.style.right = needsV ? sWidth + "px" : "0";
      this.horiz.style.left = measure.barLeft + "px";
      let totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
      this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
    } else {
      this.horiz.style.display = "";
      this.horiz.firstChild.style.width = "0";
    }

    if (!this.checkedZeroWidth && measure.clientHeight > 0) {
      if (sWidth == 0) this.zeroWidthHack();
      this.checkedZeroWidth = true;
    }

    return {
      right: needsV ? sWidth : 0,
      bottom: needsH ? sWidth : 0
    };
  }

  setScrollLeft(pos) {
    if (this.horiz.scrollLeft != pos) this.horiz.scrollLeft = pos;
    if (this.disableHoriz) this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
  }

  setScrollTop(pos) {
    if (this.vert.scrollTop != pos) this.vert.scrollTop = pos;
    if (this.disableVert) this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
  }

  zeroWidthHack() {
    let w = mac && !mac_geMountainLion ? "12px" : "18px";
    this.horiz.style.height = this.vert.style.width = w;
    this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
    this.disableHoriz = new Delayed();
    this.disableVert = new Delayed();
  }

  enableZeroWidthBar(bar, delay, type) {
    bar.style.pointerEvents = "auto";

    function maybeDisable() {
      // To find out whether the scrollbar is still visible, we
      // check whether the element under the pixel in the bottom
      // right corner of the scrollbar box is the scrollbar box
      // itself (when the bar is still visible) or its filler child
      // (when the bar is hidden). If it is still visible, we keep
      // it enabled, if it's hidden, we disable pointer events.
      let box = bar.getBoundingClientRect();
      let elt = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
      if (elt != bar) bar.style.pointerEvents = "none";else delay.set(1000, maybeDisable);
    }

    delay.set(1000, maybeDisable);
  }

  clear() {
    let parent = this.horiz.parentNode;
    parent.removeChild(this.horiz);
    parent.removeChild(this.vert);
  }

}

class NullScrollbars {
  update() {
    return {
      bottom: 0,
      right: 0
    };
  }

  setScrollLeft() {}

  setScrollTop() {}

  clear() {}

}

function updateScrollbars(cm, measure) {
  if (!measure) measure = measureForScrollbars(cm);
  let startWidth = cm.display.barWidth,
      startHeight = cm.display.barHeight;
  updateScrollbarsInner(cm, measure);

  for (let i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
    if (startWidth != cm.display.barWidth && cm.options.lineWrapping) updateHeightsInViewport(cm);
    updateScrollbarsInner(cm, measureForScrollbars(cm));
    startWidth = cm.display.barWidth;
    startHeight = cm.display.barHeight;
  }
} // Re-synchronize the fake scrollbars with the actual size of the
// content.

function updateScrollbarsInner(cm, measure) {
  let d = cm.display;
  let sizes = d.scrollbars.update(measure);
  d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
  d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
  d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";

  if (sizes.right && sizes.bottom) {
    d.scrollbarFiller.style.display = "block";
    d.scrollbarFiller.style.height = sizes.bottom + "px";
    d.scrollbarFiller.style.width = sizes.right + "px";
  } else d.scrollbarFiller.style.display = "";

  if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
    d.gutterFiller.style.display = "block";
    d.gutterFiller.style.height = sizes.bottom + "px";
    d.gutterFiller.style.width = measure.gutterWidth + "px";
  } else d.gutterFiller.style.display = "";
}

let scrollbarModel = {
  "native": NativeScrollbars,
  "null": NullScrollbars
};
function initScrollbars(cm) {
  if (cm.display.scrollbars) {
    cm.display.scrollbars.clear();
    if (cm.display.scrollbars.addClass) rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
  }

  cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](node => {
    cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller); // Prevent clicks in the scrollbars from killing focus

    on(node, "mousedown", () => {
      if (cm.state.focused) setTimeout(() => cm.display.input.focus(), 0);
    });
    node.setAttribute("cm-not-content", "true");
  }, (pos, axis) => {
    if (axis == "horizontal") setScrollLeft(cm, pos);else updateScrollTop(cm, pos);
  }, cm);
  if (cm.display.scrollbars.addClass) addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
}

// state in such a way that each change won't have to update the
// cursor and display (which would be awkward, slow, and
// error-prone). Instead, display updates are batched and then all
// combined and executed at once.

let nextOpId = 0; // Start a new operation.

function startOperation(cm) {
  cm.curOp = {
    cm: cm,
    viewChanged: false,
    // Flag that indicates that lines might need to be redrawn
    startHeight: cm.doc.height,
    // Used to detect need to update scrollbar
    forceUpdate: false,
    // Used to force a redraw
    updateInput: 0,
    // Whether to reset the input textarea
    typing: false,
    // Whether this reset should be careful to leave existing text (for compositing)
    changeObjs: null,
    // Accumulated changes, for firing change events
    cursorActivityHandlers: null,
    // Set of handlers to fire cursorActivity on
    cursorActivityCalled: 0,
    // Tracks which cursorActivity handlers have been called already
    selectionChanged: false,
    // Whether the selection needs to be redrawn
    updateMaxLine: false,
    // Set when the widest line needs to be determined anew
    scrollLeft: null,
    scrollTop: null,
    // Intermediate scroll position, not pushed to DOM yet
    scrollToPos: null,
    // Used to scroll to a specific position
    focus: false,
    id: ++nextOpId,
    // Unique ID
    markArrays: null // Used by addMarkedSpan

  };
  pushOperation(cm.curOp);
} // Finish an operation, updating the display and signalling delayed events

function endOperation(cm) {
  let op = cm.curOp;
  if (op) finishOperation(op, group => {
    for (let i = 0; i < group.ops.length; i++) group.ops[i].cm.curOp = null;

    endOperations(group);
  });
} // The DOM updates done when an operation finishes are batched so
// that the minimum number of relayouts are required.

function endOperations(group) {
  let ops = group.ops;

  for (let i = 0; i < ops.length; i++) // Read DOM
  endOperation_R1(ops[i]);

  for (let i = 0; i < ops.length; i++) // Write DOM (maybe)
  endOperation_W1(ops[i]);

  for (let i = 0; i < ops.length; i++) // Read DOM
  endOperation_R2(ops[i]);

  for (let i = 0; i < ops.length; i++) // Write DOM (maybe)
  endOperation_W2(ops[i]);

  for (let i = 0; i < ops.length; i++) // Read DOM
  endOperation_finish(ops[i]);
}

function endOperation_R1(op) {
  let cm = op.cm,
      display = cm.display;
  maybeClipScrollbars(cm);
  if (op.updateMaxLine) findMaxLine(cm);
  op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
  op.update = op.mustUpdate && new DisplayUpdate(cm, op.mustUpdate && {
    top: op.scrollTop,
    ensure: op.scrollToPos
  }, op.forceUpdate);
}

function endOperation_W1(op) {
  op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
}

function endOperation_R2(op) {
  let cm = op.cm,
      display = cm.display;
  if (op.updatedDisplay) updateHeightsInViewport(cm);
  op.barMeasure = measureForScrollbars(cm); // If the max line changed since it was last measured, measure it,
  // and ensure the document's width matches it.
  // updateDisplay_W2 will use these properties to do the actual resizing

  if (display.maxLineChanged && !cm.options.lineWrapping) {
    op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
    cm.display.sizerWidth = op.adjustWidthTo;
    op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
    op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
  }

  if (op.updatedDisplay || op.selectionChanged) op.preparedSelection = display.input.prepareSelection();
}

function endOperation_W2(op) {
  let cm = op.cm;

  if (op.adjustWidthTo != null) {
    cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
    if (op.maxScrollLeft < cm.doc.scrollLeft) setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
    cm.display.maxLineChanged = false;
  }

  let takeFocus = op.focus && op.focus == activeElt();
  if (op.preparedSelection) cm.display.input.showSelection(op.preparedSelection, takeFocus);
  if (op.updatedDisplay || op.startHeight != cm.doc.height) updateScrollbars(cm, op.barMeasure);
  if (op.updatedDisplay) setDocumentHeight(cm, op.barMeasure);
  if (op.selectionChanged) restartBlink(cm);
  if (cm.state.focused && op.updateInput) cm.display.input.reset(op.typing);
  if (takeFocus) ensureFocus(op.cm);
}

function endOperation_finish(op) {
  let cm = op.cm,
      display = cm.display,
      doc = cm.doc;
  if (op.updatedDisplay) postUpdateDisplay(cm, op.update); // Abort mouse wheel delta measurement, when scrolling explicitly

  if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos)) display.wheelStartX = display.wheelStartY = null; // Propagate the scroll position to the actual DOM scroller

  if (op.scrollTop != null) setScrollTop(cm, op.scrollTop, op.forceScroll);
  if (op.scrollLeft != null) setScrollLeft(cm, op.scrollLeft, true, true); // If we need to scroll a specific position into view, do so.

  if (op.scrollToPos) {
    let rect = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from), clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
    maybeScrollWindow(cm, rect);
  } // Fire events for markers that are hidden/unidden by editing or
  // undoing


  let hidden = op.maybeHiddenMarkers,
      unhidden = op.maybeUnhiddenMarkers;
  if (hidden) for (let i = 0; i < hidden.length; ++i) if (!hidden[i].lines.length) signal(hidden[i], "hide");
  if (unhidden) for (let i = 0; i < unhidden.length; ++i) if (unhidden[i].lines.length) signal(unhidden[i], "unhide");
  if (display.wrapper.offsetHeight) doc.scrollTop = cm.display.scroller.scrollTop; // Fire change events, and delayed event handlers

  if (op.changeObjs) signal(cm, "changes", cm, op.changeObjs);
  if (op.update) op.update.finish();
} // Run the given function in an operation


function runInOp(cm, f) {
  if (cm.curOp) return f();
  startOperation(cm);

  try {
    return f();
  } finally {
    endOperation(cm);
  }
} // Wraps a function in an operation. Returns the wrapped function.

function operation(cm, f) {
  return function () {
    if (cm.curOp) return f.apply(cm, arguments);
    startOperation(cm);

    try {
      return f.apply(cm, arguments);
    } finally {
      endOperation(cm);
    }
  };
} // Used to add methods to editor and doc instances, wrapping them in
// operations.

function methodOp(f) {
  return function () {
    if (this.curOp) return f.apply(this, arguments);
    startOperation(this);

    try {
      return f.apply(this, arguments);
    } finally {
      endOperation(this);
    }
  };
}
function docMethodOp(f) {
  return function () {
    let cm = this.cm;
    if (!cm || cm.curOp) return f.apply(this, arguments);
    startOperation(cm);

    try {
      return f.apply(this, arguments);
    } finally {
      endOperation(cm);
    }
  };
}

function startWorker(cm, time) {
  if (cm.doc.highlightFrontier < cm.display.viewTo) cm.state.highlight.set(time, bind(highlightWorker, cm));
}

function highlightWorker(cm) {
  let doc = cm.doc;
  if (doc.highlightFrontier >= cm.display.viewTo) return;
  let end = +new Date() + cm.options.workTime;
  let context = getContextBefore(cm, doc.highlightFrontier);
  let changedLines = [];
  doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), line => {
    if (context.line >= cm.display.viewFrom) {
      // Visible
      let oldStyles = line.styles;
      let resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc.mode, context.state) : null;
      let highlighted = highlightLine(cm, line, context, true);
      if (resetState) context.state = resetState;
      line.styles = highlighted.styles;
      let oldCls = line.styleClasses,
          newCls = highlighted.classes;
      if (newCls) line.styleClasses = newCls;else if (oldCls) line.styleClasses = null;
      let ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);

      for (let i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];

      if (ischange) changedLines.push(context.line);
      line.stateAfter = context.save();
      context.nextLine();
    } else {
      if (line.text.length <= cm.options.maxHighlightLength) processLine(cm, line.text, context);
      line.stateAfter = context.line % 5 == 0 ? context.save() : null;
      context.nextLine();
    }

    if (+new Date() > end) {
      startWorker(cm, cm.options.workDelay);
      return true;
    }
  });
  doc.highlightFrontier = context.line;
  doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
  if (changedLines.length) runInOp(cm, () => {
    for (let i = 0; i < changedLines.length; i++) regLineChange(cm, changedLines[i], "text");
  });
}

class DisplayUpdate {
  constructor(cm, viewport, force) {
    let display = cm.display;
    this.viewport = viewport; // Store some values that we'll need later (but don't want to force a relayout for)

    this.visible = visibleLines(display, cm.doc, viewport);
    this.editorIsHidden = !display.wrapper.offsetWidth;
    this.wrapperHeight = display.wrapper.clientHeight;
    this.wrapperWidth = display.wrapper.clientWidth;
    this.oldDisplayWidth = displayWidth(cm);
    this.force = force;
    this.dims = getDimensions(cm);
    this.events = [];
  }

  signal(emitter, type) {
    if (hasHandler(emitter, type)) this.events.push(arguments);
  }

  finish() {
    for (let i = 0; i < this.events.length; i++) signal.apply(null, this.events[i]);
  }

}
function maybeClipScrollbars(cm) {
  let display = cm.display;

  if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
    display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
    display.heightForcer.style.height = scrollGap(cm) + "px";
    display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
    display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
    display.scrollbarsClipped = true;
  }
}

function selectionSnapshot(cm) {
  if (cm.hasFocus()) return null;
  let active = activeElt();
  if (!active || !contains(cm.display.lineDiv, active)) return null;
  let result = {
    activeElt: active
  };

  if (window.getSelection) {
    let sel = window.getSelection();

    if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
      result.anchorNode = sel.anchorNode;
      result.anchorOffset = sel.anchorOffset;
      result.focusNode = sel.focusNode;
      result.focusOffset = sel.focusOffset;
    }
  }

  return result;
}

function restoreSelection(snapshot) {
  if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt()) return;
  snapshot.activeElt.focus();

  if (!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) && snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
    let sel = window.getSelection(),
        range = document.createRange();
    range.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    sel.extend(snapshot.focusNode, snapshot.focusOffset);
  }
} // Does the actual updating of the line display. Bails out
// (returning false) when there is nothing to be done and forced is
// false.


function updateDisplayIfNeeded(cm, update) {
  let display = cm.display,
      doc = cm.doc;

  if (update.editorIsHidden) {
    resetView(cm);
    return false;
  } // Bail out if the visible area is already rendered and nothing changed.


  if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && countDirtyView(cm) == 0) return false;

  if (maybeUpdateLineNumberWidth(cm)) {
    resetView(cm);
    update.dims = getDimensions(cm);
  } // Compute a suitable new viewport (from & to)


  let end = doc.first + doc.size;
  let from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
  let to = Math.min(end, update.visible.to + cm.options.viewportMargin);
  if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
  if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);

  if (sawCollapsedSpans) {
    from = visualLineNo(cm.doc, from);
    to = visualLineEndNo(cm.doc, to);
  }

  let different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
  adjustView(cm, from, to);
  display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom)); // Position the mover div to align with the current scroll position

  cm.display.mover.style.top = display.viewOffset + "px";
  let toUpdate = countDirtyView(cm);
  if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo)) return false; // For big changes, we hide the enclosing element during the
  // update, since that speeds up the operations on most browsers.

  let selSnapshot = selectionSnapshot(cm);
  if (toUpdate > 4) display.lineDiv.style.display = "none";
  patchDisplay(cm, display.updateLineNumbers, update.dims);
  if (toUpdate > 4) display.lineDiv.style.display = "";
  display.renderedView = display.view; // There might have been a widget with a focused element that got
  // hidden or updated, if so re-focus it.

  restoreSelection(selSnapshot); // Prevent selection and cursors from interfering with the scroll
  // width and height.

  removeChildren(display.cursorDiv);
  removeChildren(display.selectionDiv);
  display.gutters.style.height = display.sizer.style.minHeight = 0;

  if (different) {
    display.lastWrapHeight = update.wrapperHeight;
    display.lastWrapWidth = update.wrapperWidth;
    startWorker(cm, 400);
  }

  display.updateLineNumbers = null;
  return true;
}
function postUpdateDisplay(cm, update) {
  let viewport = update.viewport;

  for (let first = true;; first = false) {
    if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
      // Clip forced viewport to actual scrollable area.
      if (viewport && viewport.top != null) viewport = {
        top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)
      }; // Updated line heights might result in the drawn area not
      // actually covering the viewport. Keep looping until it does.

      update.visible = visibleLines(cm.display, cm.doc, viewport);
      if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo) break;
    } else if (first) {
      update.visible = visibleLines(cm.display, cm.doc, viewport);
    }

    if (!updateDisplayIfNeeded(cm, update)) break;
    updateHeightsInViewport(cm);
    let barMeasure = measureForScrollbars(cm);
    updateSelection(cm);
    updateScrollbars(cm, barMeasure);
    setDocumentHeight(cm, barMeasure);
    update.force = false;
  }

  update.signal(cm, "update", cm);

  if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
    update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
    cm.display.reportedViewFrom = cm.display.viewFrom;
    cm.display.reportedViewTo = cm.display.viewTo;
  }
}
function updateDisplaySimple(cm, viewport) {
  let update = new DisplayUpdate(cm, viewport);

  if (updateDisplayIfNeeded(cm, update)) {
    updateHeightsInViewport(cm);
    postUpdateDisplay(cm, update);
    let barMeasure = measureForScrollbars(cm);
    updateSelection(cm);
    updateScrollbars(cm, barMeasure);
    setDocumentHeight(cm, barMeasure);
    update.finish();
  }
} // Sync the actual display DOM structure with display.view, removing
// nodes for lines that are no longer in view, and creating the ones
// that are not there yet, and updating the ones that are out of
// date.

function patchDisplay(cm, updateNumbersFrom, dims) {
  let display = cm.display,
      lineNumbers = cm.options.lineNumbers;
  let container = display.lineDiv,
      cur = container.firstChild;

  function rm(node) {
    let next = node.nextSibling; // Works around a throw-scroll bug in OS X Webkit

    if (webkit && mac && cm.display.currentWheelTarget == node) node.style.display = "none";else node.parentNode.removeChild(node);
    return next;
  }

  let view = display.view,
      lineN = display.viewFrom; // Loop over the elements in the view, syncing cur (the DOM nodes
  // in display.lineDiv) with the view as we go.

  for (let i = 0; i < view.length; i++) {
    let lineView = view[i];

    if (lineView.hidden) ; else if (!lineView.node || lineView.node.parentNode != container) {
      // Not drawn yet
      let node = buildLineElement(cm, lineView, lineN, dims);
      container.insertBefore(node, cur);
    } else {
      // Already drawn
      while (cur != lineView.node) cur = rm(cur);

      let updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;

      if (lineView.changes) {
        if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
        updateLineForChanges(cm, lineView, lineN, dims);
      }

      if (updateNumber) {
        removeChildren(lineView.lineNumber);
        lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
      }

      cur = lineView.node.nextSibling;
    }

    lineN += lineView.size;
  }

  while (cur) cur = rm(cur);
}

function updateGutterSpace(display) {
  let width = display.gutters.offsetWidth;
  display.sizer.style.marginLeft = width + "px"; // Send an event to consumers responding to changes in gutter width.

  signalLater(display, "gutterChanged", display);
}
function setDocumentHeight(cm, measure) {
  cm.display.sizer.style.minHeight = measure.docHeight + "px";
  cm.display.heightForcer.style.top = measure.docHeight + "px";
  cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + scrollGap(cm) + "px";
}

// horizontal scrolling.

function alignHorizontally(cm) {
  let display = cm.display,
      view = display.view;
  if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
  let comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
  let gutterW = display.gutters.offsetWidth,
      left = comp + "px";

  for (let i = 0; i < view.length; i++) if (!view[i].hidden) {
    if (cm.options.fixedGutter) {
      if (view[i].gutter) view[i].gutter.style.left = left;
      if (view[i].gutterBackground) view[i].gutterBackground.style.left = left;
    }

    let align = view[i].alignable;
    if (align) for (let j = 0; j < align.length; j++) align[j].style.left = left;
  }

  if (cm.options.fixedGutter) display.gutters.style.left = comp + gutterW + "px";
} // Used to ensure that the line number gutter is still the right
// size for the current document size. Returns true when an update
// is needed.

function maybeUpdateLineNumberWidth(cm) {
  if (!cm.options.lineNumbers) return false;
  let doc = cm.doc,
      last = lineNumberFor(cm.options, doc.first + doc.size - 1),
      display = cm.display;

  if (last.length != display.lineNumChars) {
    let test = display.measure.appendChild(elt("div", [elt("div", last)], "CodeMirror-linenumber CodeMirror-gutter-elt"));
    let innerW = test.firstChild.offsetWidth,
        padding = test.offsetWidth - innerW;
    display.lineGutter.style.width = "";
    display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
    display.lineNumWidth = display.lineNumInnerWidth + padding;
    display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
    display.lineGutter.style.width = display.lineNumWidth + "px";
    updateGutterSpace(cm.display);
    return true;
  }

  return false;
}

function getGutters(gutters, lineNumbers) {
  let result = [],
      sawLineNumbers = false;

  for (let i = 0; i < gutters.length; i++) {
    let name = gutters[i],
        style = null;

    if (typeof name != "string") {
      style = name.style;
      name = name.className;
    }

    if (name == "CodeMirror-linenumbers") {
      if (!lineNumbers) continue;else sawLineNumbers = true;
    }

    result.push({
      className: name,
      style
    });
  }

  if (lineNumbers && !sawLineNumbers) result.push({
    className: "CodeMirror-linenumbers",
    style: null
  });
  return result;
} // Rebuild the gutter elements, ensure the margin to the left of the
// code matches their width.

function renderGutters(display) {
  let gutters = display.gutters,
      specs = display.gutterSpecs;
  removeChildren(gutters);
  display.lineGutter = null;

  for (let i = 0; i < specs.length; ++i) {
    let {
      className,
      style
    } = specs[i];
    let gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
    if (style) gElt.style.cssText = style;

    if (className == "CodeMirror-linenumbers") {
      display.lineGutter = gElt;
      gElt.style.width = (display.lineNumWidth || 1) + "px";
    }
  }

  gutters.style.display = specs.length ? "" : "none";
  updateGutterSpace(display);
}
function updateGutters(cm) {
  renderGutters(cm.display);
  regChange(cm);
  alignHorizontally(cm);
}

// and content drawing. It holds references to DOM nodes and
// display-related state.

function Display(place, doc, input, options) {
  let d = this;
  this.input = input; // Covers bottom-right square when both scrollbars are present.

  d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
  d.scrollbarFiller.setAttribute("cm-not-content", "true"); // Covers bottom of gutter when coverGutterNextToScrollbar is on
  // and h scrollbar is present.

  d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
  d.gutterFiller.setAttribute("cm-not-content", "true"); // Will contain the actual code, positioned to cover the viewport.

  d.lineDiv = eltP("div", null, "CodeMirror-code"); // Elements are added to these to represent selection and cursors.

  d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
  d.cursorDiv = elt("div", null, "CodeMirror-cursors"); // A visibility: hidden element used to find the size of things.

  d.measure = elt("div", null, "CodeMirror-measure"); // When lines outside of the viewport are measured, they are drawn in this.

  d.lineMeasure = elt("div", null, "CodeMirror-measure"); // Wraps everything that needs to exist inside the vertically-padded coordinate system

  d.lineSpace = eltP("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv], null, "position: relative; outline: none");
  let lines = eltP("div", [d.lineSpace], "CodeMirror-lines"); // Moved around its parent to cover visible view.

  d.mover = elt("div", [lines], null, "position: relative"); // Set to the height of the document, allowing scrolling.

  d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
  d.sizerWidth = null; // Behavior of elts with overflow: auto and padding is
  // inconsistent across browsers. This is used to ensure the
  // scrollable area is big enough.

  d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;"); // Will contain the gutters, if any.

  d.gutters = elt("div", null, "CodeMirror-gutters");
  d.lineGutter = null; // Actual scrollable element.

  d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
  d.scroller.setAttribute("tabIndex", "-1"); // The element in which the editor lives.

  d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror"); // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)

  if (ie && ie_version < 8) {
    d.gutters.style.zIndex = -1;
    d.scroller.style.paddingRight = 0;
  }

  if (!webkit && !(gecko && mobile)) d.scroller.draggable = true;

  if (place) {
    if (place.appendChild) place.appendChild(d.wrapper);else place(d.wrapper);
  } // Current rendered range (may be bigger than the view window).


  d.viewFrom = d.viewTo = doc.first;
  d.reportedViewFrom = d.reportedViewTo = doc.first; // Information about the rendered lines.

  d.view = [];
  d.renderedView = null; // Holds info about a single rendered line when it was rendered
  // for measurement, while not in view.

  d.externalMeasured = null; // Empty space (in pixels) above the view

  d.viewOffset = 0;
  d.lastWrapHeight = d.lastWrapWidth = 0;
  d.updateLineNumbers = null;
  d.nativeBarWidth = d.barHeight = d.barWidth = 0;
  d.scrollbarsClipped = false; // Used to only resize the line number gutter when necessary (when
  // the amount of lines crosses a boundary that makes its width change)

  d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null; // Set to true when a non-horizontal-scrolling line widget is
  // added. As an optimization, line widget aligning is skipped when
  // this is false.

  d.alignWidgets = false;
  d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null; // Tracks the maximum line length so that the horizontal scrollbar
  // can be kept static when scrolling.

  d.maxLine = null;
  d.maxLineLength = 0;
  d.maxLineChanged = false; // Used for measuring wheel scrolling granularity

  d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null; // True when shift is held down.

  d.shift = false; // Used to track whether anything happened since the context menu
  // was opened.

  d.selForContextMenu = null;
  d.activeTouch = null;
  d.gutterSpecs = getGutters(options.gutters, options.lineNumbers);
  renderGutters(d);
  input.init(d);
}

// unstandardized between browsers and even browser versions, and
// generally horribly unpredictable, this code starts by measuring
// the scroll effect that the first few mouse wheel events have,
// and, from that, detects the way it can convert deltas to pixel
// offsets afterwards.
//
// The reason we want to know the amount a wheel event will scroll
// is that it gives us a chance to update the display before the
// actual scrolling happens, reducing flickering.

let wheelSamples = 0,
    wheelPixelsPerUnit = null; // Fill in a browser-detected starting value on browsers where we
// know one. These don't have to be accurate -- the result of them
// being wrong would just be a slight flicker on the first wheel
// scroll (if it is large enough).

if (ie) wheelPixelsPerUnit = -.53;else if (gecko) wheelPixelsPerUnit = 15;else if (chrome) wheelPixelsPerUnit = -.7;else if (safari) wheelPixelsPerUnit = -1 / 3;

function wheelEventDelta(e) {
  let dx = e.wheelDeltaX,
      dy = e.wheelDeltaY;
  if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
  if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;else if (dy == null) dy = e.wheelDelta;
  return {
    x: dx,
    y: dy
  };
}

function wheelEventPixels(e) {
  let delta = wheelEventDelta(e);
  delta.x *= wheelPixelsPerUnit;
  delta.y *= wheelPixelsPerUnit;
  return delta;
}
function onScrollWheel(cm, e) {
  let delta = wheelEventDelta(e),
      dx = delta.x,
      dy = delta.y;
  let display = cm.display,
      scroll = display.scroller; // Quit if there's nothing to scroll here

  let canScrollX = scroll.scrollWidth > scroll.clientWidth;
  let canScrollY = scroll.scrollHeight > scroll.clientHeight;
  if (!(dx && canScrollX || dy && canScrollY)) return; // Webkit browsers on OS X abort momentum scrolls when the target
  // of the scroll event is removed from the scrollable element.
  // This hack (see related code in patchDisplay) makes sure the
  // element is kept around.

  if (dy && mac && webkit) {
    outer: for (let cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
      for (let i = 0; i < view.length; i++) {
        if (view[i].node == cur) {
          cm.display.currentWheelTarget = cur;
          break outer;
        }
      }
    }
  } // On some browsers, horizontal scrolling will cause redraws to
  // happen before the gutter has been realigned, causing it to
  // wriggle around in a most unseemly way. When we have an
  // estimated pixels/delta value, we just handle horizontal
  // scrolling entirely here. It'll be slightly off from native, but
  // better than glitching out.


  if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
    if (dy && canScrollY) updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * wheelPixelsPerUnit));
    setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * wheelPixelsPerUnit)); // Only prevent default scrolling if vertical scrolling is
    // actually possible. Otherwise, it causes vertical scroll
    // jitter on OSX trackpads when deltaX is small and deltaY
    // is large (issue #3579)

    if (!dy || dy && canScrollY) e_preventDefault(e);
    display.wheelStartX = null; // Abort measurement, if in progress

    return;
  } // 'Project' the visible viewport to cover the area that is being
  // scrolled into view (if we know enough to estimate it).


  if (dy && wheelPixelsPerUnit != null) {
    let pixels = dy * wheelPixelsPerUnit;
    let top = cm.doc.scrollTop,
        bot = top + display.wrapper.clientHeight;
    if (pixels < 0) top = Math.max(0, top + pixels - 50);else bot = Math.min(cm.doc.height, bot + pixels + 50);
    updateDisplaySimple(cm, {
      top: top,
      bottom: bot
    });
  }

  if (wheelSamples < 20) {
    if (display.wheelStartX == null) {
      display.wheelStartX = scroll.scrollLeft;
      display.wheelStartY = scroll.scrollTop;
      display.wheelDX = dx;
      display.wheelDY = dy;
      setTimeout(() => {
        if (display.wheelStartX == null) return;
        let movedX = scroll.scrollLeft - display.wheelStartX;
        let movedY = scroll.scrollTop - display.wheelStartY;
        let sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
        display.wheelStartX = display.wheelStartY = null;
        if (!sample) return;
        wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
        ++wheelSamples;
      }, 200);
    } else {
      display.wheelDX += dx;
      display.wheelDY += dy;
    }
  }
}

// the selection changes. A selection is one or more non-overlapping
// (and non-touching) ranges, sorted, and an integer that indicates
// which one is the primary selection (the one that's scrolled into
// view, that getCursor returns, etc).

class Selection {
  constructor(ranges, primIndex) {
    this.ranges = ranges;
    this.primIndex = primIndex;
  }

  primary() {
    return this.ranges[this.primIndex];
  }

  equals(other) {
    if (other == this) return true;
    if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;

    for (let i = 0; i < this.ranges.length; i++) {
      let here = this.ranges[i],
          there = other.ranges[i];
      if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) return false;
    }

    return true;
  }

  deepCopy() {
    let out = [];

    for (let i = 0; i < this.ranges.length; i++) out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));

    return new Selection(out, this.primIndex);
  }

  somethingSelected() {
    for (let i = 0; i < this.ranges.length; i++) if (!this.ranges[i].empty()) return true;

    return false;
  }

  contains(pos, end) {
    if (!end) end = pos;

    for (let i = 0; i < this.ranges.length; i++) {
      let range = this.ranges[i];
      if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0) return i;
    }

    return -1;
  }

}
class Range {
  constructor(anchor, head) {
    this.anchor = anchor;
    this.head = head;
  }

  from() {
    return minPos(this.anchor, this.head);
  }

  to() {
    return maxPos(this.anchor, this.head);
  }

  empty() {
    return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
  }

} // Take an unsorted, potentially overlapping set of ranges, and
// build a selection out of it. 'Consumes' ranges array (modifying
// it).

function normalizeSelection(cm, ranges, primIndex) {
  let mayTouch = cm && cm.options.selectionsMayTouch;
  let prim = ranges[primIndex];
  ranges.sort((a, b) => cmp(a.from(), b.from()));
  primIndex = indexOf(ranges, prim);

  for (let i = 1; i < ranges.length; i++) {
    let cur = ranges[i],
        prev = ranges[i - 1];
    let diff = cmp(prev.to(), cur.from());

    if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
      let from = minPos(prev.from(), cur.from()),
          to = maxPos(prev.to(), cur.to());
      let inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
      if (i <= primIndex) --primIndex;
      ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
    }
  }

  return new Selection(ranges, primIndex);
}
function simpleSelection(anchor, head) {
  return new Selection([new Range(anchor, head || anchor)], 0);
}

// refers to the pre-change end).

function changeEnd(change) {
  if (!change.text) return change.to;
  return Pos(change.from.line + change.text.length - 1, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
} // Adjust a position to refer to the post-change position of the
// same text, or the end of the change if the change covers it.

function adjustForChange(pos, change) {
  if (cmp(pos, change.from) < 0) return pos;
  if (cmp(pos, change.to) <= 0) return changeEnd(change);
  let line = pos.line + change.text.length - (change.to.line - change.from.line) - 1,
      ch = pos.ch;
  if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
  return Pos(line, ch);
}

function computeSelAfterChange(doc, change) {
  let out = [];

  for (let i = 0; i < doc.sel.ranges.length; i++) {
    let range = doc.sel.ranges[i];
    out.push(new Range(adjustForChange(range.anchor, change), adjustForChange(range.head, change)));
  }

  return normalizeSelection(doc.cm, out, doc.sel.primIndex);
}

function offsetPos(pos, old, nw) {
  if (pos.line == old.line) return Pos(nw.line, pos.ch - old.ch + nw.ch);else return Pos(nw.line + (pos.line - old.line), pos.ch);
} // Used by replaceSelections to allow moving the selection to the
// start or around the replaced test. Hint may be "start" or "around".


function computeReplacedSel(doc, changes, hint) {
  let out = [];
  let oldPrev = Pos(doc.first, 0),
      newPrev = oldPrev;

  for (let i = 0; i < changes.length; i++) {
    let change = changes[i];
    let from = offsetPos(change.from, oldPrev, newPrev);
    let to = offsetPos(changeEnd(change), oldPrev, newPrev);
    oldPrev = change.to;
    newPrev = to;

    if (hint == "around") {
      let range = doc.sel.ranges[i],
          inv = cmp(range.head, range.anchor) < 0;
      out[i] = new Range(inv ? to : from, inv ? from : to);
    } else {
      out[i] = new Range(from, from);
    }
  }

  return new Selection(out, doc.sel.primIndex);
}

function loadMode(cm) {
  cm.doc.mode = getMode(cm.options, cm.doc.modeOption);
  resetModeState(cm);
}
function resetModeState(cm) {
  cm.doc.iter(line => {
    if (line.stateAfter) line.stateAfter = null;
    if (line.styles) line.styles = null;
  });
  cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
  startWorker(cm, 100);
  cm.state.modeGen++;
  if (cm.curOp) regChange(cm);
}

// By default, updates that start and end at the beginning of a line
// are treated specially, in order to make the association of line
// widgets and marker elements with the text behave more intuitive.

function isWholeLineUpdate(doc, change) {
  return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" && (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
} // Perform a change on the document data structure.

function updateDoc(doc, change, markedSpans, estimateHeight) {
  function spansFor(n) {
    return markedSpans ? markedSpans[n] : null;
  }

  function update(line, text, spans) {
    updateLine(line, text, spans, estimateHeight);
    signalLater(line, "change", line, change);
  }

  function linesFor(start, end) {
    let result = [];

    for (let i = start; i < end; ++i) result.push(new Line(text[i], spansFor(i), estimateHeight));

    return result;
  }

  let from = change.from,
      to = change.to,
      text = change.text;
  let firstLine = getLine(doc, from.line),
      lastLine = getLine(doc, to.line);
  let lastText = lst(text),
      lastSpans = spansFor(text.length - 1),
      nlines = to.line - from.line; // Adjust the line structure

  if (change.full) {
    doc.insert(0, linesFor(0, text.length));
    doc.remove(text.length, doc.size - text.length);
  } else if (isWholeLineUpdate(doc, change)) {
    // This is a whole-line replace. Treated specially to make
    // sure line objects move the way they are supposed to.
    let added = linesFor(0, text.length - 1);
    update(lastLine, lastLine.text, lastSpans);
    if (nlines) doc.remove(from.line, nlines);
    if (added.length) doc.insert(from.line, added);
  } else if (firstLine == lastLine) {
    if (text.length == 1) {
      update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
    } else {
      let added = linesFor(1, text.length - 1);
      added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
      doc.insert(from.line + 1, added);
    }
  } else if (text.length == 1) {
    update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
    doc.remove(from.line + 1, nlines);
  } else {
    update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
    update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
    let added = linesFor(1, text.length - 1);
    if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
    doc.insert(from.line + 1, added);
  }

  signalLater(doc, "change", doc, change);
} // Call f for all linked documents.

function linkedDocs(doc, f, sharedHistOnly) {
  function propagate(doc, skip, sharedHist) {
    if (doc.linked) for (let i = 0; i < doc.linked.length; ++i) {
      let rel = doc.linked[i];
      if (rel.doc == skip) continue;
      let shared = sharedHist && rel.sharedHist;
      if (sharedHistOnly && !shared) continue;
      f(rel.doc, shared);
      propagate(rel.doc, doc, shared);
    }
  }

  propagate(doc, null, true);
} // Attach a document to an editor.

function attachDoc(cm, doc) {
  if (doc.cm) throw new Error("This document is already in use.");
  cm.doc = doc;
  doc.cm = cm;
  estimateLineHeights(cm);
  loadMode(cm);
  setDirectionClass(cm);
  cm.options.direction = doc.direction;
  if (!cm.options.lineWrapping) findMaxLine(cm);
  cm.options.mode = doc.modeOption;
  regChange(cm);
}

function setDirectionClass(cm) {
  (cm.doc.direction == "rtl" ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
}

function directionChanged(cm) {
  runInOp(cm, () => {
    setDirectionClass(cm);
    regChange(cm);
  });
}

function History(prev) {
  // Arrays of change events and selections. Doing something adds an
  // event to done and clears undo. Undoing moves events from done
  // to undone, redoing moves them in the other direction.
  this.done = [];
  this.undone = [];
  this.undoDepth = prev ? prev.undoDepth : Infinity; // Used to track when changes can be merged into a single undo
  // event

  this.lastModTime = this.lastSelTime = 0;
  this.lastOp = this.lastSelOp = null;
  this.lastOrigin = this.lastSelOrigin = null; // Used by the isClean() method

  this.generation = this.maxGeneration = prev ? prev.maxGeneration : 1;
} // Create a history change event from an updateDoc-style change
// object.

function historyChangeFromChange(doc, change) {
  let histChange = {
    from: copyPos(change.from),
    to: changeEnd(change),
    text: getBetween(doc, change.from, change.to)
  };
  attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
  linkedDocs(doc, doc => attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1), true);
  return histChange;
} // Pop all selection events off the end of a history array. Stop at
// a change event.

function clearSelectionEvents(array) {
  while (array.length) {
    let last = lst(array);
    if (last.ranges) array.pop();else break;
  }
} // Find the top change event in the history. Pop off selection
// events that are in the way.


function lastChangeEvent(hist, force) {
  if (force) {
    clearSelectionEvents(hist.done);
    return lst(hist.done);
  } else if (hist.done.length && !lst(hist.done).ranges) {
    return lst(hist.done);
  } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
    hist.done.pop();
    return lst(hist.done);
  }
} // Register a change in the history. Merges changes that are within
// a single operation, or are close together with an origin that
// allows merging (starting with "+") into a single event.


function addChangeToHistory(doc, change, selAfter, opId) {
  let hist = doc.history;
  hist.undone.length = 0;
  let time = +new Date(),
      cur;
  let last;

  if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == "+" && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == "*")) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
    // Merge this change into the last event
    last = lst(cur.changes);

    if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
      // Optimized case for simple insertion -- don't want to add
      // new changesets for every character typed
      last.to = changeEnd(change);
    } else {
      // Add new sub-event
      cur.changes.push(historyChangeFromChange(doc, change));
    }
  } else {
    // Can not be merged, start a new event.
    let before = lst(hist.done);
    if (!before || !before.ranges) pushSelectionToHistory(doc.sel, hist.done);
    cur = {
      changes: [historyChangeFromChange(doc, change)],
      generation: hist.generation
    };
    hist.done.push(cur);

    while (hist.done.length > hist.undoDepth) {
      hist.done.shift();
      if (!hist.done[0].ranges) hist.done.shift();
    }
  }

  hist.done.push(selAfter);
  hist.generation = ++hist.maxGeneration;
  hist.lastModTime = hist.lastSelTime = time;
  hist.lastOp = hist.lastSelOp = opId;
  hist.lastOrigin = hist.lastSelOrigin = change.origin;
  if (!last) signal(doc, "historyAdded");
}

function selectionEventCanBeMerged(doc, origin, prev, sel) {
  let ch = origin.charAt(0);
  return ch == "*" || ch == "+" && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && new Date() - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
} // Called whenever the selection changes, sets the new selection as
// the pending selection in the history, and pushes the old pending
// selection into the 'done' array when it was significantly
// different (in number of selected ranges, emptiness, or time).


function addSelectionToHistory(doc, sel, opId, options) {
  let hist = doc.history,
      origin = options && options.origin; // A new event is started when the previous origin does not match
  // the current, or the origins don't allow matching. Origins
  // starting with * are always merged, those starting with + are
  // merged when similar and close together in time.

  if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))) hist.done[hist.done.length - 1] = sel;else pushSelectionToHistory(sel, hist.done);
  hist.lastSelTime = +new Date();
  hist.lastSelOrigin = origin;
  hist.lastSelOp = opId;
  if (options && options.clearRedo !== false) clearSelectionEvents(hist.undone);
}
function pushSelectionToHistory(sel, dest) {
  let top = lst(dest);
  if (!(top && top.ranges && top.equals(sel))) dest.push(sel);
} // Used to store marked span information in the history.

function attachLocalSpans(doc, change, from, to) {
  let existing = change["spans_" + doc.id],
      n = 0;
  doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), line => {
    if (line.markedSpans) (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
    ++n;
  });
} // When un/re-doing restores text containing marked spans, those
// that have been explicitly cleared should not be restored.


function removeClearedSpans(spans) {
  if (!spans) return null;
  let out;

  for (let i = 0; i < spans.length; ++i) {
    if (spans[i].marker.explicitlyCleared) {
      if (!out) out = spans.slice(0, i);
    } else if (out) out.push(spans[i]);
  }

  return !out ? spans : out.length ? out : null;
} // Retrieve and filter the old marked spans stored in a change event.


function getOldSpans(doc, change) {
  let found = change["spans_" + doc.id];
  if (!found) return null;
  let nw = [];

  for (let i = 0; i < change.text.length; ++i) nw.push(removeClearedSpans(found[i]));

  return nw;
} // Used for un/re-doing changes from the history. Combines the
// result of computing the existing spans with the set of spans that
// existed in the history (so that deleting around a span and then
// undoing brings back the span).


function mergeOldSpans(doc, change) {
  let old = getOldSpans(doc, change);
  let stretched = stretchSpansOverChange(doc, change);
  if (!old) return stretched;
  if (!stretched) return old;

  for (let i = 0; i < old.length; ++i) {
    let oldCur = old[i],
        stretchCur = stretched[i];

    if (oldCur && stretchCur) {
      spans: for (let j = 0; j < stretchCur.length; ++j) {
        let span = stretchCur[j];

        for (let k = 0; k < oldCur.length; ++k) if (oldCur[k].marker == span.marker) continue spans;

        oldCur.push(span);
      }
    } else if (stretchCur) {
      old[i] = stretchCur;
    }
  }

  return old;
} // Used both to provide a JSON-safe object in .getHistory, and, when
// detaching a document, to split the history in two

function copyHistoryArray(events, newGroup, instantiateSel) {
  let copy = [];

  for (let i = 0; i < events.length; ++i) {
    let event = events[i];

    if (event.ranges) {
      copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
      continue;
    }

    let changes = event.changes,
        newChanges = [];
    copy.push({
      changes: newChanges
    });

    for (let j = 0; j < changes.length; ++j) {
      let change = changes[j],
          m;
      newChanges.push({
        from: change.from,
        to: change.to,
        text: change.text
      });
      if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
        if (indexOf(newGroup, Number(m[1])) > -1) {
          lst(newChanges)[prop] = change[prop];
          delete change[prop];
        }
      }
    }
  }

  return copy;
}

// the new cursor position should be scrolled into view after
// modifying the selection.
// If shift is held or the extend flag is set, extends a range to
// include a given position (and optionally a second position).
// Otherwise, simply returns the range between the given positions.
// Used for cursor motion and such.

function extendRange(range, head, other, extend) {
  if (extend) {
    let anchor = range.anchor;

    if (other) {
      let posBefore = cmp(head, anchor) < 0;

      if (posBefore != cmp(other, anchor) < 0) {
        anchor = head;
        head = other;
      } else if (posBefore != cmp(head, other) < 0) {
        head = other;
      }
    }

    return new Range(anchor, head);
  } else {
    return new Range(other || head, head);
  }
} // Extend the primary selection range, discard the rest.

function extendSelection(doc, head, other, options, extend) {
  if (extend == null) extend = doc.cm && (doc.cm.display.shift || doc.extend);
  setSelection(doc, new Selection([extendRange(doc.sel.primary(), head, other, extend)], 0), options);
} // Extend all selections (pos is an array of selections with length
// equal the number of selections)

function extendSelections(doc, heads, options) {
  let out = [];
  let extend = doc.cm && (doc.cm.display.shift || doc.extend);

  for (let i = 0; i < doc.sel.ranges.length; i++) out[i] = extendRange(doc.sel.ranges[i], heads[i], null, extend);

  let newSel = normalizeSelection(doc.cm, out, doc.sel.primIndex);
  setSelection(doc, newSel, options);
} // Updates a single range in the selection.

function replaceOneSelection(doc, i, range, options) {
  let ranges = doc.sel.ranges.slice(0);
  ranges[i] = range;
  setSelection(doc, normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
} // Reset the selection to a single range.

function setSimpleSelection(doc, anchor, head, options) {
  setSelection(doc, simpleSelection(anchor, head), options);
} // Give beforeSelectionChange handlers a change to influence a
// selection update.

function filterSelectionChange(doc, sel, options) {
  let obj = {
    ranges: sel.ranges,
    update: function (ranges) {
      this.ranges = [];

      for (let i = 0; i < ranges.length; i++) this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor), clipPos(doc, ranges[i].head));
    },
    origin: options && options.origin
  };
  signal(doc, "beforeSelectionChange", doc, obj);
  if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
  if (obj.ranges != sel.ranges) return normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1);else return sel;
}

function setSelectionReplaceHistory(doc, sel, options) {
  let done = doc.history.done,
      last = lst(done);

  if (last && last.ranges) {
    done[done.length - 1] = sel;
    setSelectionNoUndo(doc, sel, options);
  } else {
    setSelection(doc, sel, options);
  }
} // Set a new selection.

function setSelection(doc, sel, options) {
  setSelectionNoUndo(doc, sel, options);
  addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
}
function setSelectionNoUndo(doc, sel, options) {
  if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) sel = filterSelectionChange(doc, sel, options);
  let bias = options && options.bias || (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
  setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));
  if (!(options && options.scroll === false) && doc.cm && doc.cm.getOption("readOnly") != "nocursor") ensureCursorVisible(doc.cm);
}

function setSelectionInner(doc, sel) {
  if (sel.equals(doc.sel)) return;
  doc.sel = sel;

  if (doc.cm) {
    doc.cm.curOp.updateInput = 1;
    doc.cm.curOp.selectionChanged = true;
    signalCursorActivity(doc.cm);
  }

  signalLater(doc, "cursorActivity", doc);
} // Verify that the selection does not partially select any atomic
// marked ranges.


function reCheckSelection(doc) {
  setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false));
} // Return a selection that does not partially select any atomic
// ranges.

function skipAtomicInSelection(doc, sel, bias, mayClear) {
  let out;

  for (let i = 0; i < sel.ranges.length; i++) {
    let range = sel.ranges[i];
    let old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
    let newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
    let newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);

    if (out || newAnchor != range.anchor || newHead != range.head) {
      if (!out) out = sel.ranges.slice(0, i);
      out[i] = new Range(newAnchor, newHead);
    }
  }

  return out ? normalizeSelection(doc.cm, out, sel.primIndex) : sel;
}

function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
  let line = getLine(doc, pos.line);
  if (line.markedSpans) for (let i = 0; i < line.markedSpans.length; ++i) {
    let sp = line.markedSpans[i],
        m = sp.marker; // Determine if we should prevent the cursor being placed to the left/right of an atomic marker
    // Historically this was determined using the inclusiveLeft/Right option, but the new way to control it
    // is with selectLeft/Right

    let preventCursorLeft = "selectLeft" in m ? !m.selectLeft : m.inclusiveLeft;
    let preventCursorRight = "selectRight" in m ? !m.selectRight : m.inclusiveRight;

    if ((sp.from == null || (preventCursorLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (preventCursorRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
      if (mayClear) {
        signal(m, "beforeCursorEnter");

        if (m.explicitlyCleared) {
          if (!line.markedSpans) break;else {
            --i;
            continue;
          }
        }
      }

      if (!m.atomic) continue;

      if (oldPos) {
        let near = m.find(dir < 0 ? 1 : -1),
            diff;
        if (dir < 0 ? preventCursorRight : preventCursorLeft) near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null);
        if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0)) return skipAtomicInner(doc, near, pos, dir, mayClear);
      }

      let far = m.find(dir < 0 ? -1 : 1);
      if (dir < 0 ? preventCursorLeft : preventCursorRight) far = movePos(doc, far, dir, far.line == pos.line ? line : null);
      return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
    }
  }
  return pos;
} // Ensure a given position is not inside an atomic range.


function skipAtomic(doc, pos, oldPos, bias, mayClear) {
  let dir = bias || 1;
  let found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, dir, true) || skipAtomicInner(doc, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true);

  if (!found) {
    doc.cantEdit = true;
    return Pos(doc.first, 0);
  }

  return found;
}

function movePos(doc, pos, dir, line) {
  if (dir < 0 && pos.ch == 0) {
    if (pos.line > doc.first) return clipPos(doc, Pos(pos.line - 1));else return null;
  } else if (dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length) {
    if (pos.line < doc.first + doc.size - 1) return Pos(pos.line + 1, 0);else return null;
  } else {
    return new Pos(pos.line, pos.ch + dir);
  }
}

function selectAll(cm) {
  cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
}

// Allow "beforeChange" event handlers to influence a change

function filterChange(doc, change, update) {
  let obj = {
    canceled: false,
    from: change.from,
    to: change.to,
    text: change.text,
    origin: change.origin,
    cancel: () => obj.canceled = true
  };
  if (update) obj.update = (from, to, text, origin) => {
    if (from) obj.from = clipPos(doc, from);
    if (to) obj.to = clipPos(doc, to);
    if (text) obj.text = text;
    if (origin !== undefined) obj.origin = origin;
  };
  signal(doc, "beforeChange", doc, obj);
  if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

  if (obj.canceled) {
    if (doc.cm) doc.cm.curOp.updateInput = 2;
    return null;
  }

  return {
    from: obj.from,
    to: obj.to,
    text: obj.text,
    origin: obj.origin
  };
} // Apply a change to a document, and add it to the document's
// history, and propagating it to all linked documents.


function makeChange(doc, change, ignoreReadOnly) {
  if (doc.cm) {
    if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
    if (doc.cm.state.suppressEdits) return;
  }

  if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
    change = filterChange(doc, change, true);
    if (!change) return;
  } // Possibly split or suppress the update based on the presence
  // of read-only spans in its range.


  let split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);

  if (split) {
    for (let i = split.length - 1; i >= 0; --i) makeChangeInner(doc, {
      from: split[i].from,
      to: split[i].to,
      text: i ? [""] : change.text,
      origin: change.origin
    });
  } else {
    makeChangeInner(doc, change);
  }
}

function makeChangeInner(doc, change) {
  if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
  let selAfter = computeSelAfterChange(doc, change);
  addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
  makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
  let rebased = [];
  linkedDocs(doc, (doc, sharedHist) => {
    if (!sharedHist && indexOf(rebased, doc.history) == -1) {
      rebaseHist(doc.history, change);
      rebased.push(doc.history);
    }

    makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
  });
} // Revert a change stored in a document's history.


function makeChangeFromHistory(doc, type, allowSelectionOnly) {
  let suppress = doc.cm && doc.cm.state.suppressEdits;
  if (suppress && !allowSelectionOnly) return;
  let hist = doc.history,
      event,
      selAfter = doc.sel;
  let source = type == "undo" ? hist.done : hist.undone,
      dest = type == "undo" ? hist.undone : hist.done; // Verify that there is a useable event (so that ctrl-z won't
  // needlessly clear selection events)

  let i = 0;

  for (; i < source.length; i++) {
    event = source[i];
    if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges) break;
  }

  if (i == source.length) return;
  hist.lastOrigin = hist.lastSelOrigin = null;

  for (;;) {
    event = source.pop();

    if (event.ranges) {
      pushSelectionToHistory(event, dest);

      if (allowSelectionOnly && !event.equals(doc.sel)) {
        setSelection(doc, event, {
          clearRedo: false
        });
        return;
      }

      selAfter = event;
    } else if (suppress) {
      source.push(event);
      return;
    } else break;
  } // Build up a reverse change object to add to the opposite history
  // stack (redo when undoing, and vice versa).


  let antiChanges = [];
  pushSelectionToHistory(selAfter, dest);
  dest.push({
    changes: antiChanges,
    generation: hist.generation
  });
  hist.generation = event.generation || ++hist.maxGeneration;
  let filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

  for (let i = event.changes.length - 1; i >= 0; --i) {
    let change = event.changes[i];
    change.origin = type;

    if (filter && !filterChange(doc, change, false)) {
      source.length = 0;
      return;
    }

    antiChanges.push(historyChangeFromChange(doc, change));
    let after = i ? computeSelAfterChange(doc, change) : lst(source);
    makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
    if (!i && doc.cm) doc.cm.scrollIntoView({
      from: change.from,
      to: changeEnd(change)
    });
    let rebased = []; // Propagate to the linked documents

    linkedDocs(doc, (doc, sharedHist) => {
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
        rebaseHist(doc.history, change);
        rebased.push(doc.history);
      }

      makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
    });
  }
} // Sub-views need their line numbers shifted when text is added
// above or below them in the parent document.

function shiftDoc(doc, distance) {
  if (distance == 0) return;
  doc.first += distance;
  doc.sel = new Selection(map(doc.sel.ranges, range => new Range(Pos(range.anchor.line + distance, range.anchor.ch), Pos(range.head.line + distance, range.head.ch))), doc.sel.primIndex);

  if (doc.cm) {
    regChange(doc.cm, doc.first, doc.first - distance, distance);

    for (let d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++) regLineChange(doc.cm, l, "gutter");
  }
} // More lower-level change function, handling only a single document
// (not linked ones).


function makeChangeSingleDoc(doc, change, selAfter, spans) {
  if (doc.cm && !doc.cm.curOp) return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

  if (change.to.line < doc.first) {
    shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
    return;
  }

  if (change.from.line > doc.lastLine()) return; // Clip the change to the size of this doc

  if (change.from.line < doc.first) {
    let shift = change.text.length - 1 - (doc.first - change.from.line);
    shiftDoc(doc, shift);
    change = {
      from: Pos(doc.first, 0),
      to: Pos(change.to.line + shift, change.to.ch),
      text: [lst(change.text)],
      origin: change.origin
    };
  }

  let last = doc.lastLine();

  if (change.to.line > last) {
    change = {
      from: change.from,
      to: Pos(last, getLine(doc, last).text.length),
      text: [change.text[0]],
      origin: change.origin
    };
  }

  change.removed = getBetween(doc, change.from, change.to);
  if (!selAfter) selAfter = computeSelAfterChange(doc, change);
  if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);else updateDoc(doc, change, spans);
  setSelectionNoUndo(doc, selAfter, sel_dontScroll);
  if (doc.cantEdit && skipAtomic(doc, Pos(doc.firstLine(), 0))) doc.cantEdit = false;
} // Handle the interaction of a change to a document with the editor
// that this document is part of.


function makeChangeSingleDocInEditor(cm, change, spans) {
  let doc = cm.doc,
      display = cm.display,
      from = change.from,
      to = change.to;
  let recomputeMaxLength = false,
      checkWidthStart = from.line;

  if (!cm.options.lineWrapping) {
    checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
    doc.iter(checkWidthStart, to.line + 1, line => {
      if (line == display.maxLine) {
        recomputeMaxLength = true;
        return true;
      }
    });
  }

  if (doc.sel.contains(change.from, change.to) > -1) signalCursorActivity(cm);
  updateDoc(doc, change, spans, estimateHeight(cm));

  if (!cm.options.lineWrapping) {
    doc.iter(checkWidthStart, from.line + change.text.length, line => {
      let len = lineLength(line);

      if (len > display.maxLineLength) {
        display.maxLine = line;
        display.maxLineLength = len;
        display.maxLineChanged = true;
        recomputeMaxLength = false;
      }
    });
    if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
  }

  retreatFrontier(doc, from.line);
  startWorker(cm, 400);
  let lendiff = change.text.length - (to.line - from.line) - 1; // Remember that these lines changed, for updating the display

  if (change.full) regChange(cm);else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change)) regLineChange(cm, from.line, "text");else regChange(cm, from.line, to.line + 1, lendiff);
  let changesHandler = hasHandler(cm, "changes"),
      changeHandler = hasHandler(cm, "change");

  if (changeHandler || changesHandler) {
    let obj = {
      from: from,
      to: to,
      text: change.text,
      removed: change.removed,
      origin: change.origin
    };
    if (changeHandler) signalLater(cm, "change", cm, obj);
    if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
  }

  cm.display.selForContextMenu = null;
}

function replaceRange(doc, code, from, to, origin) {
  if (!to) to = from;
  if (cmp(to, from) < 0) [from, to] = [to, from];
  if (typeof code == "string") code = doc.splitLines(code);
  makeChange(doc, {
    from,
    to,
    text: code,
    origin
  });
} // Rebasing/resetting history to deal with externally-sourced changes

function rebaseHistSelSingle(pos, from, to, diff) {
  if (to < pos.line) {
    pos.line += diff;
  } else if (from < pos.line) {
    pos.line = from;
    pos.ch = 0;
  }
} // Tries to rebase an array of history events given a change in the
// document. If the change touches the same lines as the event, the
// event, and everything 'behind' it, is discarded. If the change is
// before the event, the event's positions are updated. Uses a
// copy-on-write scheme for the positions, to avoid having to
// reallocate them all on every rebase, but also avoid problems with
// shared position objects being unsafely updated.


function rebaseHistArray(array, from, to, diff) {
  for (let i = 0; i < array.length; ++i) {
    let sub = array[i],
        ok = true;

    if (sub.ranges) {
      if (!sub.copied) {
        sub = array[i] = sub.deepCopy();
        sub.copied = true;
      }

      for (let j = 0; j < sub.ranges.length; j++) {
        rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
        rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
      }

      continue;
    }

    for (let j = 0; j < sub.changes.length; ++j) {
      let cur = sub.changes[j];

      if (to < cur.from.line) {
        cur.from = Pos(cur.from.line + diff, cur.from.ch);
        cur.to = Pos(cur.to.line + diff, cur.to.ch);
      } else if (from <= cur.to.line) {
        ok = false;
        break;
      }
    }

    if (!ok) {
      array.splice(0, i + 1);
      i = 0;
    }
  }
}

function rebaseHist(hist, change) {
  let from = change.from.line,
      to = change.to.line,
      diff = change.text.length - (to - from) - 1;
  rebaseHistArray(hist.done, from, to, diff);
  rebaseHistArray(hist.undone, from, to, diff);
} // Utility for applying a change to a line by handle or number,
// returning the number and optionally registering the line as
// changed.


function changeLine(doc, handle, changeType, op) {
  let no = handle,
      line = handle;
  if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));else no = lineNo(handle);
  if (no == null) return null;
  if (op(line, no) && doc.cm) regLineChange(doc.cm, no, changeType);
  return line;
}

// chunk of lines in them, and branches, with up to ten leaves or
// other branch nodes below them. The top node is always a branch
// node, and is the document object itself (meaning it has
// additional methods and properties).
//
// All nodes have parent links. The tree is used both to go from
// line numbers to line objects, and to go from objects to numbers.
// It also indexes by height, and is used to convert between height
// and line object, and to find the total height of the document.
//
// See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html

function LeafChunk(lines) {
  this.lines = lines;
  this.parent = null;
  let height = 0;

  for (let i = 0; i < lines.length; ++i) {
    lines[i].parent = this;
    height += lines[i].height;
  }

  this.height = height;
}
LeafChunk.prototype = {
  chunkSize() {
    return this.lines.length;
  },

  // Remove the n lines at offset 'at'.
  removeInner(at, n) {
    for (let i = at, e = at + n; i < e; ++i) {
      let line = this.lines[i];
      this.height -= line.height;
      cleanUpLine(line);
      signalLater(line, "delete");
    }

    this.lines.splice(at, n);
  },

  // Helper used to collapse a small branch into a single leaf.
  collapse(lines) {
    lines.push.apply(lines, this.lines);
  },

  // Insert the given array of lines at offset 'at', count them as
  // having the given height.
  insertInner(at, lines, height) {
    this.height += height;
    this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));

    for (let i = 0; i < lines.length; ++i) lines[i].parent = this;
  },

  // Used to iterate over a part of the tree.
  iterN(at, n, op) {
    for (let e = at + n; at < e; ++at) if (op(this.lines[at])) return true;
  }

};
function BranchChunk(children) {
  this.children = children;
  let size = 0,
      height = 0;

  for (let i = 0; i < children.length; ++i) {
    let ch = children[i];
    size += ch.chunkSize();
    height += ch.height;
    ch.parent = this;
  }

  this.size = size;
  this.height = height;
  this.parent = null;
}
BranchChunk.prototype = {
  chunkSize() {
    return this.size;
  },

  removeInner(at, n) {
    this.size -= n;

    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i],
          sz = child.chunkSize();

      if (at < sz) {
        let rm = Math.min(n, sz - at),
            oldHeight = child.height;
        child.removeInner(at, rm);
        this.height -= oldHeight - child.height;

        if (sz == rm) {
          this.children.splice(i--, 1);
          child.parent = null;
        }

        if ((n -= rm) == 0) break;
        at = 0;
      } else at -= sz;
    } // If the result is smaller than 25 lines, ensure that it is a
    // single leaf node.


    if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
      let lines = [];
      this.collapse(lines);
      this.children = [new LeafChunk(lines)];
      this.children[0].parent = this;
    }
  },

  collapse(lines) {
    for (let i = 0; i < this.children.length; ++i) this.children[i].collapse(lines);
  },

  insertInner(at, lines, height) {
    this.size += lines.length;
    this.height += height;

    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i],
          sz = child.chunkSize();

      if (at <= sz) {
        child.insertInner(at, lines, height);

        if (child.lines && child.lines.length > 50) {
          // To avoid memory thrashing when child.lines is huge (e.g. first view of a large file), it's never spliced.
          // Instead, small slices are taken. They're taken in order because sequential memory accesses are fastest.
          let remaining = child.lines.length % 25 + 25;

          for (let pos = remaining; pos < child.lines.length;) {
            let leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
            child.height -= leaf.height;
            this.children.splice(++i, 0, leaf);
            leaf.parent = this;
          }

          child.lines = child.lines.slice(0, remaining);
          this.maybeSpill();
        }

        break;
      }

      at -= sz;
    }
  },

  // When a node has grown, check whether it should be split.
  maybeSpill() {
    if (this.children.length <= 10) return;
    let me = this;

    do {
      let spilled = me.children.splice(me.children.length - 5, 5);
      let sibling = new BranchChunk(spilled);

      if (!me.parent) {
        // Become the parent node
        let copy = new BranchChunk(me.children);
        copy.parent = me;
        me.children = [copy, sibling];
        me = copy;
      } else {
        me.size -= sibling.size;
        me.height -= sibling.height;
        let myIndex = indexOf(me.parent.children, me);
        me.parent.children.splice(myIndex + 1, 0, sibling);
      }

      sibling.parent = me.parent;
    } while (me.children.length > 10);

    me.parent.maybeSpill();
  },

  iterN(at, n, op) {
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i],
          sz = child.chunkSize();

      if (at < sz) {
        let used = Math.min(n, sz - at);
        if (child.iterN(at, used, op)) return true;
        if ((n -= used) == 0) break;
        at = 0;
      } else at -= sz;
    }
  }

};

class LineWidget {
  constructor(doc, node, options) {
    if (options) for (let opt in options) if (options.hasOwnProperty(opt)) this[opt] = options[opt];
    this.doc = doc;
    this.node = node;
  }

  clear() {
    let cm = this.doc.cm,
        ws = this.line.widgets,
        line = this.line,
        no = lineNo(line);
    if (no == null || !ws) return;

    for (let i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);

    if (!ws.length) line.widgets = null;
    let height = widgetHeight(this);
    updateLineHeight(line, Math.max(0, line.height - height));

    if (cm) {
      runInOp(cm, () => {
        adjustScrollWhenAboveVisible(cm, line, -height);
        regLineChange(cm, no, "widget");
      });
      signalLater(cm, "lineWidgetCleared", cm, this, no);
    }
  }

  changed() {
    let oldH = this.height,
        cm = this.doc.cm,
        line = this.line;
    this.height = null;
    let diff = widgetHeight(this) - oldH;
    if (!diff) return;
    if (!lineIsHidden(this.doc, line)) updateLineHeight(line, line.height + diff);

    if (cm) {
      runInOp(cm, () => {
        cm.curOp.forceUpdate = true;
        adjustScrollWhenAboveVisible(cm, line, diff);
        signalLater(cm, "lineWidgetChanged", cm, this, lineNo(line));
      });
    }
  }

}
eventMixin(LineWidget);

function adjustScrollWhenAboveVisible(cm, line, diff) {
  if (heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop)) addToScrollTop(cm, diff);
}

function addLineWidget(doc, handle, node, options) {
  let widget = new LineWidget(doc, node, options);
  let cm = doc.cm;
  if (cm && widget.noHScroll) cm.display.alignWidgets = true;
  changeLine(doc, handle, "widget", line => {
    let widgets = line.widgets || (line.widgets = []);
    if (widget.insertAt == null) widgets.push(widget);else widgets.splice(Math.min(widgets.length, Math.max(0, widget.insertAt)), 0, widget);
    widget.line = line;

    if (cm && !lineIsHidden(doc, line)) {
      let aboveVisible = heightAtLine(line) < doc.scrollTop;
      updateLineHeight(line, line.height + widgetHeight(widget));
      if (aboveVisible) addToScrollTop(cm, widget.height);
      cm.curOp.forceUpdate = true;
    }

    return true;
  });
  if (cm) signalLater(cm, "lineWidgetAdded", cm, widget, typeof handle == "number" ? handle : lineNo(handle));
  return widget;
}

// Created with markText and setBookmark methods. A TextMarker is a
// handle that can be used to clear or find a marked position in the
// document. Line objects hold arrays (markedSpans) containing
// {from, to, marker} object pointing to such marker objects, and
// indicating that such a marker is present on that line. Multiple
// lines may point to the same marker when it spans across lines.
// The spans will have null for their from/to properties when the
// marker continues beyond the start/end of the line. Markers have
// links back to the lines they currently touch.
// Collapsed markers have unique ids, in order to be able to order
// them, which is needed for uniquely determining an outer marker
// when they overlap (they may nest, but not partially overlap).

let nextMarkerId = 0;
class TextMarker {
  constructor(doc, type) {
    this.lines = [];
    this.type = type;
    this.doc = doc;
    this.id = ++nextMarkerId;
  } // Clear the marker.


  clear() {
    if (this.explicitlyCleared) return;
    let cm = this.doc.cm,
        withOp = cm && !cm.curOp;
    if (withOp) startOperation(cm);

    if (hasHandler(this, "clear")) {
      let found = this.find();
      if (found) signalLater(this, "clear", found.from, found.to);
    }

    let min = null,
        max = null;

    for (let i = 0; i < this.lines.length; ++i) {
      let line = this.lines[i];
      let span = getMarkedSpanFor(line.markedSpans, this);
      if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");else if (cm) {
        if (span.to != null) max = lineNo(line);
        if (span.from != null) min = lineNo(line);
      }
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
      if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm) updateLineHeight(line, textHeight(cm.display));
    }

    if (cm && this.collapsed && !cm.options.lineWrapping) for (let i = 0; i < this.lines.length; ++i) {
      let visual = visualLine(this.lines[i]),
          len = lineLength(visual);

      if (len > cm.display.maxLineLength) {
        cm.display.maxLine = visual;
        cm.display.maxLineLength = len;
        cm.display.maxLineChanged = true;
      }
    }
    if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
    this.lines.length = 0;
    this.explicitlyCleared = true;

    if (this.atomic && this.doc.cantEdit) {
      this.doc.cantEdit = false;
      if (cm) reCheckSelection(cm.doc);
    }

    if (cm) signalLater(cm, "markerCleared", cm, this, min, max);
    if (withOp) endOperation(cm);
    if (this.parent) this.parent.clear();
  } // Find the position of the marker in the document. Returns a {from,
  // to} object by default. Side can be passed to get a specific side
  // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
  // Pos objects returned contain a line object, rather than a line
  // number (used to prevent looking up the same line twice).


  find(side, lineObj) {
    if (side == null && this.type == "bookmark") side = 1;
    let from, to;

    for (let i = 0; i < this.lines.length; ++i) {
      let line = this.lines[i];
      let span = getMarkedSpanFor(line.markedSpans, this);

      if (span.from != null) {
        from = Pos(lineObj ? line : lineNo(line), span.from);
        if (side == -1) return from;
      }

      if (span.to != null) {
        to = Pos(lineObj ? line : lineNo(line), span.to);
        if (side == 1) return to;
      }
    }

    return from && {
      from: from,
      to: to
    };
  } // Signals that the marker's widget changed, and surrounding layout
  // should be recomputed.


  changed() {
    let pos = this.find(-1, true),
        widget = this,
        cm = this.doc.cm;
    if (!pos || !cm) return;
    runInOp(cm, () => {
      let line = pos.line,
          lineN = lineNo(pos.line);
      let view = findViewForLine(cm, lineN);

      if (view) {
        clearLineMeasurementCacheFor(view);
        cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
      }

      cm.curOp.updateMaxLine = true;

      if (!lineIsHidden(widget.doc, line) && widget.height != null) {
        let oldHeight = widget.height;
        widget.height = null;
        let dHeight = widgetHeight(widget) - oldHeight;
        if (dHeight) updateLineHeight(line, line.height + dHeight);
      }

      signalLater(cm, "markerChanged", cm, this);
    });
  }

  attachLine(line) {
    if (!this.lines.length && this.doc.cm) {
      let op = this.doc.cm.curOp;
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1) (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
    }

    this.lines.push(line);
  }

  detachLine(line) {
    this.lines.splice(indexOf(this.lines, line), 1);

    if (!this.lines.length && this.doc.cm) {
      let op = this.doc.cm.curOp;
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
    }
  }

}
eventMixin(TextMarker); // Create a marker, wire it up to the right lines, and

function markText(doc, from, to, options, type) {
  // Shared markers (across linked documents) are handled separately
  // (markTextShared will call out to this again, once per
  // document).
  if (options && options.shared) return markTextShared(doc, from, to, options, type); // Ensure we are in an operation.

  if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);
  let marker = new TextMarker(doc, type),
      diff = cmp(from, to);
  if (options) copyObj(options, marker, false); // Don't connect empty markers unless clearWhenEmpty is false

  if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false) return marker;

  if (marker.replacedWith) {
    // Showing up as a widget implies collapsed (widget replaces text)
    marker.collapsed = true;
    marker.widgetNode = eltP("span", [marker.replacedWith], "CodeMirror-widget");
    if (!options.handleMouseEvents) marker.widgetNode.setAttribute("cm-ignore-events", "true");
    if (options.insertLeft) marker.widgetNode.insertLeft = true;
  }

  if (marker.collapsed) {
    if (conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
    seeCollapsedSpans();
  }

  if (marker.addToHistory) addChangeToHistory(doc, {
    from: from,
    to: to,
    origin: "markText"
  }, doc.sel, NaN);
  let curLine = from.line,
      cm = doc.cm,
      updateMaxLine;
  doc.iter(curLine, to.line + 1, line => {
    if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine) updateMaxLine = true;
    if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
    addMarkedSpan(line, new MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null), doc.cm && doc.cm.curOp);
    ++curLine;
  }); // lineIsHidden depends on the presence of the spans, so needs a second pass

  if (marker.collapsed) doc.iter(from.line, to.line + 1, line => {
    if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
  });
  if (marker.clearOnEnter) on(marker, "beforeCursorEnter", () => marker.clear());

  if (marker.readOnly) {
    seeReadOnlySpans();
    if (doc.history.done.length || doc.history.undone.length) doc.clearHistory();
  }

  if (marker.collapsed) {
    marker.id = ++nextMarkerId;
    marker.atomic = true;
  }

  if (cm) {
    // Sync editor state
    if (updateMaxLine) cm.curOp.updateMaxLine = true;
    if (marker.collapsed) regChange(cm, from.line, to.line + 1);else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title) for (let i = from.line; i <= to.line; i++) regLineChange(cm, i, "text");
    if (marker.atomic) reCheckSelection(cm.doc);
    signalLater(cm, "markerAdded", cm, marker);
  }

  return marker;
} // SHARED TEXTMARKERS
// A shared marker spans multiple linked documents. It is
// implemented as a meta-marker-object controlling multiple normal
// markers.

class SharedTextMarker {
  constructor(markers, primary) {
    this.markers = markers;
    this.primary = primary;

    for (let i = 0; i < markers.length; ++i) markers[i].parent = this;
  }

  clear() {
    if (this.explicitlyCleared) return;
    this.explicitlyCleared = true;

    for (let i = 0; i < this.markers.length; ++i) this.markers[i].clear();

    signalLater(this, "clear");
  }

  find(side, lineObj) {
    return this.primary.find(side, lineObj);
  }

}
eventMixin(SharedTextMarker);

function markTextShared(doc, from, to, options, type) {
  options = copyObj(options);
  options.shared = false;
  let markers = [markText(doc, from, to, options, type)],
      primary = markers[0];
  let widget = options.widgetNode;
  linkedDocs(doc, doc => {
    if (widget) options.widgetNode = widget.cloneNode(true);
    markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));

    for (let i = 0; i < doc.linked.length; ++i) if (doc.linked[i].isParent) return;

    primary = lst(markers);
  });
  return new SharedTextMarker(markers, primary);
}

function findSharedMarkers(doc) {
  return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())), m => m.parent);
}
function copySharedMarkers(doc, markers) {
  for (let i = 0; i < markers.length; i++) {
    let marker = markers[i],
        pos = marker.find();
    let mFrom = doc.clipPos(pos.from),
        mTo = doc.clipPos(pos.to);

    if (cmp(mFrom, mTo)) {
      let subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
      marker.markers.push(subMark);
      subMark.parent = marker;
    }
  }
}
function detachSharedMarkers(markers) {
  for (let i = 0; i < markers.length; i++) {
    let marker = markers[i],
        linked = [marker.primary.doc];
    linkedDocs(marker.primary.doc, d => linked.push(d));

    for (let j = 0; j < marker.markers.length; j++) {
      let subMarker = marker.markers[j];

      if (indexOf(linked, subMarker.doc) == -1) {
        subMarker.parent = null;
        marker.markers.splice(j--, 1);
      }
    }
  }
}

let nextDocId = 0;

let Doc = function (text, mode, firstLine, lineSep, direction) {
  if (!(this instanceof Doc)) return new Doc(text, mode, firstLine, lineSep, direction);
  if (firstLine == null) firstLine = 0;
  BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
  this.first = firstLine;
  this.scrollTop = this.scrollLeft = 0;
  this.cantEdit = false;
  this.cleanGeneration = 1;
  this.modeFrontier = this.highlightFrontier = firstLine;
  let start = Pos(firstLine, 0);
  this.sel = simpleSelection(start);
  this.history = new History(null);
  this.id = ++nextDocId;
  this.modeOption = mode;
  this.lineSep = lineSep;
  this.direction = direction == "rtl" ? "rtl" : "ltr";
  this.extend = false;
  if (typeof text == "string") text = this.splitLines(text);
  updateDoc(this, {
    from: start,
    to: start,
    text: text
  });
  setSelection(this, simpleSelection(start), sel_dontScroll);
};

Doc.prototype = createObj(BranchChunk.prototype, {
  constructor: Doc,
  // Iterate over the document. Supports two forms -- with only one
  // argument, it calls that for each line in the document. With
  // three, it iterates over the range given by the first two (with
  // the second being non-inclusive).
  iter: function (from, to, op) {
    if (op) this.iterN(from - this.first, to - from, op);else this.iterN(this.first, this.first + this.size, from);
  },
  // Non-public interface for adding and removing lines.
  insert: function (at, lines) {
    let height = 0;

    for (let i = 0; i < lines.length; ++i) height += lines[i].height;

    this.insertInner(at - this.first, lines, height);
  },
  remove: function (at, n) {
    this.removeInner(at - this.first, n);
  },
  // From here, the methods are part of the public interface. Most
  // are also available from CodeMirror (editor) instances.
  getValue: function (lineSep) {
    let lines = getLines(this, this.first, this.first + this.size);
    if (lineSep === false) return lines;
    return lines.join(lineSep || this.lineSeparator());
  },
  setValue: docMethodOp(function (code) {
    let top = Pos(this.first, 0),
        last = this.first + this.size - 1;
    makeChange(this, {
      from: top,
      to: Pos(last, getLine(this, last).text.length),
      text: this.splitLines(code),
      origin: "setValue",
      full: true
    }, true);
    if (this.cm) scrollToCoords(this.cm, 0, 0);
    setSelection(this, simpleSelection(top), sel_dontScroll);
  }),
  replaceRange: function (code, from, to, origin) {
    from = clipPos(this, from);
    to = to ? clipPos(this, to) : from;
    replaceRange(this, code, from, to, origin);
  },
  getRange: function (from, to, lineSep) {
    let lines = getBetween(this, clipPos(this, from), clipPos(this, to));
    if (lineSep === false) return lines;
    if (lineSep === '') return lines.join('');
    return lines.join(lineSep || this.lineSeparator());
  },
  getLine: function (line) {
    let l = this.getLineHandle(line);
    return l && l.text;
  },
  getLineHandle: function (line) {
    if (isLine(this, line)) return getLine(this, line);
  },
  getLineNumber: function (line) {
    return lineNo(line);
  },
  getLineHandleVisualStart: function (line) {
    if (typeof line == "number") line = getLine(this, line);
    return visualLine(line);
  },
  lineCount: function () {
    return this.size;
  },
  firstLine: function () {
    return this.first;
  },
  lastLine: function () {
    return this.first + this.size - 1;
  },
  clipPos: function (pos) {
    return clipPos(this, pos);
  },
  getCursor: function (start) {
    let range = this.sel.primary(),
        pos;
    if (start == null || start == "head") pos = range.head;else if (start == "anchor") pos = range.anchor;else if (start == "end" || start == "to" || start === false) pos = range.to();else pos = range.from();
    return pos;
  },
  listSelections: function () {
    return this.sel.ranges;
  },
  somethingSelected: function () {
    return this.sel.somethingSelected();
  },
  setCursor: docMethodOp(function (line, ch, options) {
    setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
  }),
  setSelection: docMethodOp(function (anchor, head, options) {
    setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
  }),
  extendSelection: docMethodOp(function (head, other, options) {
    extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
  }),
  extendSelections: docMethodOp(function (heads, options) {
    extendSelections(this, clipPosArray(this, heads), options);
  }),
  extendSelectionsBy: docMethodOp(function (f, options) {
    let heads = map(this.sel.ranges, f);
    extendSelections(this, clipPosArray(this, heads), options);
  }),
  setSelections: docMethodOp(function (ranges, primary, options) {
    if (!ranges.length) return;
    let out = [];

    for (let i = 0; i < ranges.length; i++) out[i] = new Range(clipPos(this, ranges[i].anchor), clipPos(this, ranges[i].head || ranges[i].anchor));

    if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
    setSelection(this, normalizeSelection(this.cm, out, primary), options);
  }),
  addSelection: docMethodOp(function (anchor, head, options) {
    let ranges = this.sel.ranges.slice(0);
    ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
    setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
  }),
  getSelection: function (lineSep) {
    let ranges = this.sel.ranges,
        lines;

    for (let i = 0; i < ranges.length; i++) {
      let sel = getBetween(this, ranges[i].from(), ranges[i].to());
      lines = lines ? lines.concat(sel) : sel;
    }

    if (lineSep === false) return lines;else return lines.join(lineSep || this.lineSeparator());
  },
  getSelections: function (lineSep) {
    let parts = [],
        ranges = this.sel.ranges;

    for (let i = 0; i < ranges.length; i++) {
      let sel = getBetween(this, ranges[i].from(), ranges[i].to());
      if (lineSep !== false) sel = sel.join(lineSep || this.lineSeparator());
      parts[i] = sel;
    }

    return parts;
  },
  replaceSelection: function (code, collapse, origin) {
    let dup = [];

    for (let i = 0; i < this.sel.ranges.length; i++) dup[i] = code;

    this.replaceSelections(dup, collapse, origin || "+input");
  },
  replaceSelections: docMethodOp(function (code, collapse, origin) {
    let changes = [],
        sel = this.sel;

    for (let i = 0; i < sel.ranges.length; i++) {
      let range = sel.ranges[i];
      changes[i] = {
        from: range.from(),
        to: range.to(),
        text: this.splitLines(code[i]),
        origin: origin
      };
    }

    let newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);

    for (let i = changes.length - 1; i >= 0; i--) makeChange(this, changes[i]);

    if (newSel) setSelectionReplaceHistory(this, newSel);else if (this.cm) ensureCursorVisible(this.cm);
  }),
  undo: docMethodOp(function () {
    makeChangeFromHistory(this, "undo");
  }),
  redo: docMethodOp(function () {
    makeChangeFromHistory(this, "redo");
  }),
  undoSelection: docMethodOp(function () {
    makeChangeFromHistory(this, "undo", true);
  }),
  redoSelection: docMethodOp(function () {
    makeChangeFromHistory(this, "redo", true);
  }),
  setExtending: function (val) {
    this.extend = val;
  },
  getExtending: function () {
    return this.extend;
  },
  historySize: function () {
    let hist = this.history,
        done = 0,
        undone = 0;

    for (let i = 0; i < hist.done.length; i++) if (!hist.done[i].ranges) ++done;

    for (let i = 0; i < hist.undone.length; i++) if (!hist.undone[i].ranges) ++undone;

    return {
      undo: done,
      redo: undone
    };
  },
  clearHistory: function () {
    this.history = new History(this.history);
    linkedDocs(this, doc => doc.history = this.history, true);
  },
  markClean: function () {
    this.cleanGeneration = this.changeGeneration(true);
  },
  changeGeneration: function (forceSplit) {
    if (forceSplit) this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
    return this.history.generation;
  },
  isClean: function (gen) {
    return this.history.generation == (gen || this.cleanGeneration);
  },
  getHistory: function () {
    return {
      done: copyHistoryArray(this.history.done),
      undone: copyHistoryArray(this.history.undone)
    };
  },
  setHistory: function (histData) {
    let hist = this.history = new History(this.history);
    hist.done = copyHistoryArray(histData.done.slice(0), null, true);
    hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
  },
  setGutterMarker: docMethodOp(function (line, gutterID, value) {
    return changeLine(this, line, "gutter", line => {
      let markers = line.gutterMarkers || (line.gutterMarkers = {});
      markers[gutterID] = value;
      if (!value && isEmpty(markers)) line.gutterMarkers = null;
      return true;
    });
  }),
  clearGutter: docMethodOp(function (gutterID) {
    this.iter(line => {
      if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
        changeLine(this, line, "gutter", () => {
          line.gutterMarkers[gutterID] = null;
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
          return true;
        });
      }
    });
  }),
  lineInfo: function (line) {
    let n;

    if (typeof line == "number") {
      if (!isLine(this, line)) return null;
      n = line;
      line = getLine(this, line);
      if (!line) return null;
    } else {
      n = lineNo(line);
      if (n == null) return null;
    }

    return {
      line: n,
      handle: line,
      text: line.text,
      gutterMarkers: line.gutterMarkers,
      textClass: line.textClass,
      bgClass: line.bgClass,
      wrapClass: line.wrapClass,
      widgets: line.widgets
    };
  },
  addLineClass: docMethodOp(function (handle, where, cls) {
    return changeLine(this, handle, where == "gutter" ? "gutter" : "class", line => {
      let prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
      if (!line[prop]) line[prop] = cls;else if (classTest(cls).test(line[prop])) return false;else line[prop] += " " + cls;
      return true;
    });
  }),
  removeLineClass: docMethodOp(function (handle, where, cls) {
    return changeLine(this, handle, where == "gutter" ? "gutter" : "class", line => {
      let prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
      let cur = line[prop];
      if (!cur) return false;else if (cls == null) line[prop] = null;else {
        let found = cur.match(classTest(cls));
        if (!found) return false;
        let end = found.index + found[0].length;
        line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
      }
      return true;
    });
  }),
  addLineWidget: docMethodOp(function (handle, node, options) {
    return addLineWidget(this, handle, node, options);
  }),
  removeLineWidget: function (widget) {
    widget.clear();
  },
  markText: function (from, to, options) {
    return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
  },
  setBookmark: function (pos, options) {
    let realOpts = {
      replacedWith: options && (options.nodeType == null ? options.widget : options),
      insertLeft: options && options.insertLeft,
      clearWhenEmpty: false,
      shared: options && options.shared,
      handleMouseEvents: options && options.handleMouseEvents
    };
    pos = clipPos(this, pos);
    return markText(this, pos, pos, realOpts, "bookmark");
  },
  findMarksAt: function (pos) {
    pos = clipPos(this, pos);
    let markers = [],
        spans = getLine(this, pos.line).markedSpans;
    if (spans) for (let i = 0; i < spans.length; ++i) {
      let span = spans[i];
      if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch)) markers.push(span.marker.parent || span.marker);
    }
    return markers;
  },
  findMarks: function (from, to, filter) {
    from = clipPos(this, from);
    to = clipPos(this, to);
    let found = [],
        lineNo = from.line;
    this.iter(from.line, to.line + 1, line => {
      let spans = line.markedSpans;
      if (spans) for (let i = 0; i < spans.length; i++) {
        let span = spans[i];
        if (!(span.to != null && lineNo == from.line && from.ch >= span.to || span.from == null && lineNo != from.line || span.from != null && lineNo == to.line && span.from >= to.ch) && (!filter || filter(span.marker))) found.push(span.marker.parent || span.marker);
      }
      ++lineNo;
    });
    return found;
  },
  getAllMarks: function () {
    let markers = [];
    this.iter(line => {
      let sps = line.markedSpans;
      if (sps) for (let i = 0; i < sps.length; ++i) if (sps[i].from != null) markers.push(sps[i].marker);
    });
    return markers;
  },
  posFromIndex: function (off) {
    let ch,
        lineNo = this.first,
        sepSize = this.lineSeparator().length;
    this.iter(line => {
      let sz = line.text.length + sepSize;

      if (sz > off) {
        ch = off;
        return true;
      }

      off -= sz;
      ++lineNo;
    });
    return clipPos(this, Pos(lineNo, ch));
  },
  indexFromPos: function (coords) {
    coords = clipPos(this, coords);
    let index = coords.ch;
    if (coords.line < this.first || coords.ch < 0) return 0;
    let sepSize = this.lineSeparator().length;
    this.iter(this.first, coords.line, line => {
      // iter aborts when callback returns a truthy value
      index += line.text.length + sepSize;
    });
    return index;
  },
  copy: function (copyHistory) {
    let doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
    doc.scrollTop = this.scrollTop;
    doc.scrollLeft = this.scrollLeft;
    doc.sel = this.sel;
    doc.extend = false;

    if (copyHistory) {
      doc.history.undoDepth = this.history.undoDepth;
      doc.setHistory(this.getHistory());
    }

    return doc;
  },
  linkedDoc: function (options) {
    if (!options) options = {};
    let from = this.first,
        to = this.first + this.size;
    if (options.from != null && options.from > from) from = options.from;
    if (options.to != null && options.to < to) to = options.to;
    let copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
    if (options.sharedHist) copy.history = this.history;
    (this.linked || (this.linked = [])).push({
      doc: copy,
      sharedHist: options.sharedHist
    });
    copy.linked = [{
      doc: this,
      isParent: true,
      sharedHist: options.sharedHist
    }];
    copySharedMarkers(copy, findSharedMarkers(this));
    return copy;
  },
  unlinkDoc: function (other) {
    if (other instanceof CodeMirror) other = other.doc;
    if (this.linked) for (let i = 0; i < this.linked.length; ++i) {
      let link = this.linked[i];
      if (link.doc != other) continue;
      this.linked.splice(i, 1);
      other.unlinkDoc(this);
      detachSharedMarkers(findSharedMarkers(this));
      break;
    } // If the histories were shared, split them again

    if (other.history == this.history) {
      let splitIds = [other.id];
      linkedDocs(other, doc => splitIds.push(doc.id), true);
      other.history = new History(null);
      other.history.done = copyHistoryArray(this.history.done, splitIds);
      other.history.undone = copyHistoryArray(this.history.undone, splitIds);
    }
  },
  iterLinkedDocs: function (f) {
    linkedDocs(this, f);
  },
  getMode: function () {
    return this.mode;
  },
  getEditor: function () {
    return this.cm;
  },
  splitLines: function (str) {
    if (this.lineSep) return str.split(this.lineSep);
    return splitLinesAuto(str);
  },
  lineSeparator: function () {
    return this.lineSep || "\n";
  },
  setDirection: docMethodOp(function (dir) {
    if (dir != "rtl") dir = "ltr";
    if (dir == this.direction) return;
    this.direction = dir;
    this.iter(line => line.order = null);
    if (this.cm) directionChanged(this.cm);
  })
}); // Public alias.

Doc.prototype.eachLine = Doc.prototype.iter;

// re-fire a series of drag-related events right after the drop (#1551)

let lastDrop = 0;
function onDrop(e) {
  let cm = this;
  clearDragCursor(cm);
  if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;
  e_preventDefault(e);
  if (ie) lastDrop = +new Date();
  let pos = posFromMouse(cm, e, true),
      files = e.dataTransfer.files;
  if (!pos || cm.isReadOnly()) return; // Might be a file drop, in which case we simply extract the text
  // and insert it.

  if (files && files.length && window.FileReader && window.File) {
    let n = files.length,
        text = Array(n),
        read = 0;

    const markAsReadAndPasteIfAllFilesAreRead = () => {
      if (++read == n) {
        operation(cm, () => {
          pos = clipPos(cm.doc, pos);
          let change = {
            from: pos,
            to: pos,
            text: cm.doc.splitLines(text.filter(t => t != null).join(cm.doc.lineSeparator())),
            origin: "paste"
          };
          makeChange(cm.doc, change);
          setSelectionReplaceHistory(cm.doc, simpleSelection(clipPos(cm.doc, pos), clipPos(cm.doc, changeEnd(change))));
        })();
      }
    };

    const readTextFromFile = (file, i) => {
      if (cm.options.allowDropFileTypes && indexOf(cm.options.allowDropFileTypes, file.type) == -1) {
        markAsReadAndPasteIfAllFilesAreRead();
        return;
      }

      let reader = new FileReader();

      reader.onerror = () => markAsReadAndPasteIfAllFilesAreRead();

      reader.onload = () => {
        let content = reader.result;

        if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) {
          markAsReadAndPasteIfAllFilesAreRead();
          return;
        }

        text[i] = content;
        markAsReadAndPasteIfAllFilesAreRead();
      };

      reader.readAsText(file);
    };

    for (let i = 0; i < files.length; i++) readTextFromFile(files[i], i);
  } else {
    // Normal drop
    // Don't do a replace if the drop happened inside of the selected text.
    if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
      cm.state.draggingText(e); // Ensure the editor is re-focused

      setTimeout(() => cm.display.input.focus(), 20);
      return;
    }

    try {
      let text = e.dataTransfer.getData("Text");

      if (text) {
        let selected;
        if (cm.state.draggingText && !cm.state.draggingText.copy) selected = cm.listSelections();
        setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
        if (selected) for (let i = 0; i < selected.length; ++i) replaceRange(cm.doc, "", selected[i].anchor, selected[i].head, "drag");
        cm.replaceSelection(text, "around", "paste");
        cm.display.input.focus();
      }
    } catch (e) {}
  }
}
function onDragStart(cm, e) {
  if (ie && (!cm.state.draggingText || +new Date() - lastDrop < 100)) {
    e_stop(e);
    return;
  }

  if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;
  e.dataTransfer.setData("Text", cm.getSelection());
  e.dataTransfer.effectAllowed = "copyMove"; // Use dummy image instead of default browsers image.
  // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.

  if (e.dataTransfer.setDragImage && !safari) {
    let img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
    img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

    if (presto) {
      img.width = img.height = 1;
      cm.display.wrapper.appendChild(img); // Force a relayout, or Opera won't use our image for some obscure reason

      img._top = img.offsetTop;
    }

    e.dataTransfer.setDragImage(img, 0, 0);
    if (presto) img.parentNode.removeChild(img);
  }
}
function onDragOver(cm, e) {
  let pos = posFromMouse(cm, e);
  if (!pos) return;
  let frag = document.createDocumentFragment();
  drawSelectionCursor(cm, pos, frag);

  if (!cm.display.dragCursor) {
    cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
    cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
  }

  removeChildrenAndAdd(cm.display.dragCursor, frag);
}
function clearDragCursor(cm) {
  if (cm.display.dragCursor) {
    cm.display.lineSpace.removeChild(cm.display.dragCursor);
    cm.display.dragCursor = null;
  }
}

// handler for each editor will cause the editors to never be
// garbage collected.

function forEachCodeMirror(f) {
  if (!document.getElementsByClassName) return;
  let byClass = document.getElementsByClassName("CodeMirror"),
      editors = [];

  for (let i = 0; i < byClass.length; i++) {
    let cm = byClass[i].CodeMirror;
    if (cm) editors.push(cm);
  }

  if (editors.length) editors[0].operation(() => {
    for (let i = 0; i < editors.length; i++) f(editors[i]);
  });
}

let globalsRegistered = false;
function ensureGlobalHandlers() {
  if (globalsRegistered) return;
  registerGlobalHandlers();
  globalsRegistered = true;
}

function registerGlobalHandlers() {
  // When the window resizes, we need to refresh active editors.
  let resizeTimer;
  on(window, "resize", () => {
    if (resizeTimer == null) resizeTimer = setTimeout(() => {
      resizeTimer = null;
      forEachCodeMirror(onResize);
    }, 100);
  }); // When the window loses focus, we want to show the editor as blurred

  on(window, "blur", () => forEachCodeMirror(onBlur));
} // Called when the window resizes


function onResize(cm) {
  let d = cm.display; // Might be a text scaling operation, clear size caches.

  d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
  d.scrollbarsClipped = false;
  cm.setSize();
}

let keyNames = {
  3: "Pause",
  8: "Backspace",
  9: "Tab",
  13: "Enter",
  16: "Shift",
  17: "Ctrl",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Esc",
  32: "Space",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "Left",
  38: "Up",
  39: "Right",
  40: "Down",
  44: "PrintScrn",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Mod",
  92: "Mod",
  93: "Mod",
  106: "*",
  107: "=",
  109: "-",
  110: ".",
  111: "/",
  145: "ScrollLock",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'",
  224: "Mod",
  63232: "Up",
  63233: "Down",
  63234: "Left",
  63235: "Right",
  63272: "Delete",
  63273: "Home",
  63275: "End",
  63276: "PageUp",
  63277: "PageDown",
  63302: "Insert"
}; // Number keys

for (let i = 0; i < 10; i++) keyNames[i + 48] = keyNames[i + 96] = String(i); // Alphabetic keys


for (let i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i); // Function keys


for (let i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;

let keyMap = {};
keyMap.basic = {
  "Left": "goCharLeft",
  "Right": "goCharRight",
  "Up": "goLineUp",
  "Down": "goLineDown",
  "End": "goLineEnd",
  "Home": "goLineStartSmart",
  "PageUp": "goPageUp",
  "PageDown": "goPageDown",
  "Delete": "delCharAfter",
  "Backspace": "delCharBefore",
  "Shift-Backspace": "delCharBefore",
  "Tab": "defaultTab",
  "Shift-Tab": "indentAuto",
  "Enter": "newlineAndIndent",
  "Insert": "toggleOverwrite",
  "Esc": "singleSelection"
}; // Note that the save and find-related commands aren't defined by
// default. User code or addons can define them. Unknown commands
// are simply ignored.

keyMap.pcDefault = {
  "Ctrl-A": "selectAll",
  "Ctrl-D": "deleteLine",
  "Ctrl-Z": "undo",
  "Shift-Ctrl-Z": "redo",
  "Ctrl-Y": "redo",
  "Ctrl-Home": "goDocStart",
  "Ctrl-End": "goDocEnd",
  "Ctrl-Up": "goLineUp",
  "Ctrl-Down": "goLineDown",
  "Ctrl-Left": "goGroupLeft",
  "Ctrl-Right": "goGroupRight",
  "Alt-Left": "goLineStart",
  "Alt-Right": "goLineEnd",
  "Ctrl-Backspace": "delGroupBefore",
  "Ctrl-Delete": "delGroupAfter",
  "Ctrl-S": "save",
  "Ctrl-F": "find",
  "Ctrl-G": "findNext",
  "Shift-Ctrl-G": "findPrev",
  "Shift-Ctrl-F": "replace",
  "Shift-Ctrl-R": "replaceAll",
  "Ctrl-[": "indentLess",
  "Ctrl-]": "indentMore",
  "Ctrl-U": "undoSelection",
  "Shift-Ctrl-U": "redoSelection",
  "Alt-U": "redoSelection",
  "fallthrough": "basic"
}; // Very basic readline/emacs-style bindings, which are standard on Mac.

keyMap.emacsy = {
  "Ctrl-F": "goCharRight",
  "Ctrl-B": "goCharLeft",
  "Ctrl-P": "goLineUp",
  "Ctrl-N": "goLineDown",
  "Ctrl-A": "goLineStart",
  "Ctrl-E": "goLineEnd",
  "Ctrl-V": "goPageDown",
  "Shift-Ctrl-V": "goPageUp",
  "Ctrl-D": "delCharAfter",
  "Ctrl-H": "delCharBefore",
  "Alt-Backspace": "delWordBefore",
  "Ctrl-K": "killLine",
  "Ctrl-T": "transposeChars",
  "Ctrl-O": "openLine"
};
keyMap.macDefault = {
  "Cmd-A": "selectAll",
  "Cmd-D": "deleteLine",
  "Cmd-Z": "undo",
  "Shift-Cmd-Z": "redo",
  "Cmd-Y": "redo",
  "Cmd-Home": "goDocStart",
  "Cmd-Up": "goDocStart",
  "Cmd-End": "goDocEnd",
  "Cmd-Down": "goDocEnd",
  "Alt-Left": "goGroupLeft",
  "Alt-Right": "goGroupRight",
  "Cmd-Left": "goLineLeft",
  "Cmd-Right": "goLineRight",
  "Alt-Backspace": "delGroupBefore",
  "Ctrl-Alt-Backspace": "delGroupAfter",
  "Alt-Delete": "delGroupAfter",
  "Cmd-S": "save",
  "Cmd-F": "find",
  "Cmd-G": "findNext",
  "Shift-Cmd-G": "findPrev",
  "Cmd-Alt-F": "replace",
  "Shift-Cmd-Alt-F": "replaceAll",
  "Cmd-[": "indentLess",
  "Cmd-]": "indentMore",
  "Cmd-Backspace": "delWrappedLineLeft",
  "Cmd-Delete": "delWrappedLineRight",
  "Cmd-U": "undoSelection",
  "Shift-Cmd-U": "redoSelection",
  "Ctrl-Up": "goDocStart",
  "Ctrl-Down": "goDocEnd",
  "fallthrough": ["basic", "emacsy"]
};
keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault; // KEYMAP DISPATCH

function normalizeKeyName(name) {
  let parts = name.split(/-(?!$)/);
  name = parts[parts.length - 1];
  let alt, ctrl, shift, cmd;

  for (let i = 0; i < parts.length - 1; i++) {
    let mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;else if (/^a(lt)?$/i.test(mod)) alt = true;else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;else if (/^s(hift)?$/i.test(mod)) shift = true;else throw new Error("Unrecognized modifier name: " + mod);
  }

  if (alt) name = "Alt-" + name;
  if (ctrl) name = "Ctrl-" + name;
  if (cmd) name = "Cmd-" + name;
  if (shift) name = "Shift-" + name;
  return name;
} // This is a kludge to keep keymaps mostly working as raw objects
// (backwards compatibility) while at the same time support features
// like normalization and multi-stroke key bindings. It compiles a
// new normalized keymap, and then updates the old object to reflect
// this.


function normalizeKeyMap(keymap) {
  let copy = {};

  for (let keyname in keymap) if (keymap.hasOwnProperty(keyname)) {
    let value = keymap[keyname];
    if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) continue;

    if (value == "...") {
      delete keymap[keyname];
      continue;
    }

    let keys = map(keyname.split(" "), normalizeKeyName);

    for (let i = 0; i < keys.length; i++) {
      let val, name;

      if (i == keys.length - 1) {
        name = keys.join(" ");
        val = value;
      } else {
        name = keys.slice(0, i + 1).join(" ");
        val = "...";
      }

      let prev = copy[name];
      if (!prev) copy[name] = val;else if (prev != val) throw new Error("Inconsistent bindings for " + name);
    }

    delete keymap[keyname];
  }

  for (let prop in copy) keymap[prop] = copy[prop];

  return keymap;
}
function lookupKey(key, map, handle, context) {
  map = getKeyMap(map);
  let found = map.call ? map.call(key, context) : map[key];
  if (found === false) return "nothing";
  if (found === "...") return "multi";
  if (found != null && handle(found)) return "handled";

  if (map.fallthrough) {
    if (Object.prototype.toString.call(map.fallthrough) != "[object Array]") return lookupKey(key, map.fallthrough, handle, context);

    for (let i = 0; i < map.fallthrough.length; i++) {
      let result = lookupKey(key, map.fallthrough[i], handle, context);
      if (result) return result;
    }
  }
} // Modifier key presses don't count as 'real' key presses for the
// purpose of keymap fallthrough.

function isModifierKey(value) {
  let name = typeof value == "string" ? value : keyNames[value.keyCode];
  return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
}
function addModifierNames(name, event, noShift) {
  let base = name;
  if (event.altKey && base != "Alt") name = "Alt-" + name;
  if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") name = "Ctrl-" + name;
  if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Mod") name = "Cmd-" + name;
  if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
  return name;
} // Look up the name of a key as indicated by an event object.

function keyName(event, noShift) {
  if (presto && event.keyCode == 34 && event["char"]) return false;
  let name = keyNames[event.keyCode];
  if (name == null || event.altGraphKey) return false; // Ctrl-ScrollLock has keyCode 3, same as Ctrl-Pause,
  // so we'll use event.code when available (Chrome 48+, FF 38+, Safari 10.1+)

  if (event.keyCode == 3 && event.code) name = event.code;
  return addModifierNames(name, event, noShift);
}
function getKeyMap(val) {
  return typeof val == "string" ? keyMap[val] : val;
}

// backspace, delete, and similar functionality.

function deleteNearSelection(cm, compute) {
  let ranges = cm.doc.sel.ranges,
      kill = []; // Build up a set of ranges to kill first, merging overlapping
  // ranges.

  for (let i = 0; i < ranges.length; i++) {
    let toKill = compute(ranges[i]);

    while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
      let replaced = kill.pop();

      if (cmp(replaced.from, toKill.from) < 0) {
        toKill.from = replaced.from;
        break;
      }
    }

    kill.push(toKill);
  } // Next, remove those actual ranges.


  runInOp(cm, () => {
    for (let i = kill.length - 1; i >= 0; i--) replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");

    ensureCursorVisible(cm);
  });
}

function moveCharLogically(line, ch, dir) {
  let target = skipExtendingChars(line.text, ch + dir, dir);
  return target < 0 || target > line.text.length ? null : target;
}

function moveLogically(line, start, dir) {
  let ch = moveCharLogically(line, start.ch, dir);
  return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before");
}
function endOfLine(visually, cm, lineObj, lineNo, dir) {
  if (visually) {
    if (cm.doc.direction == "rtl") dir = -dir;
    let order = getOrder(lineObj, cm.doc.direction);

    if (order) {
      let part = dir < 0 ? lst(order) : order[0];
      let moveInStorageOrder = dir < 0 == (part.level == 1);
      let sticky = moveInStorageOrder ? "after" : "before";
      let ch; // With a wrapped rtl chunk (possibly spanning multiple bidi parts),
      // it could be that the last bidi part is not on the last visual line,
      // since visual lines contain content order-consecutive chunks.
      // Thus, in rtl, we are looking for the first (content-order) character
      // in the rtl chunk that is on the last line (that is, the same line
      // as the last (content-order) character).

      if (part.level > 0 || cm.doc.direction == "rtl") {
        let prep = prepareMeasureForLine(cm, lineObj);
        ch = dir < 0 ? lineObj.text.length - 1 : 0;
        let targetTop = measureCharPrepared(cm, prep, ch).top;
        ch = findFirst(ch => measureCharPrepared(cm, prep, ch).top == targetTop, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
        if (sticky == "before") ch = moveCharLogically(lineObj, ch, 1);
      } else ch = dir < 0 ? part.to : part.from;

      return new Pos(lineNo, ch, sticky);
    }
  }

  return new Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after");
}
function moveVisually(cm, line, start, dir) {
  let bidi = getOrder(line, cm.doc.direction);
  if (!bidi) return moveLogically(line, start, dir);

  if (start.ch >= line.text.length) {
    start.ch = line.text.length;
    start.sticky = "before";
  } else if (start.ch <= 0) {
    start.ch = 0;
    start.sticky = "after";
  }

  let partPos = getBidiPartAt(bidi, start.ch, start.sticky),
      part = bidi[partPos];

  if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
    // Case 1: We move within an ltr part in an ltr editor. Even with wrapped lines,
    // nothing interesting happens.
    return moveLogically(line, start, dir);
  }

  let mv = (pos, dir) => moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir);

  let prep;

  let getWrappedLineExtent = ch => {
    if (!cm.options.lineWrapping) return {
      begin: 0,
      end: line.text.length
    };
    prep = prep || prepareMeasureForLine(cm, line);
    return wrappedLineExtentChar(cm, line, prep, ch);
  };

  let wrappedLineExtent = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);

  if (cm.doc.direction == "rtl" || part.level == 1) {
    let moveInStorageOrder = part.level == 1 == dir < 0;
    let ch = mv(start, moveInStorageOrder ? 1 : -1);

    if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent.begin : ch <= part.to && ch <= wrappedLineExtent.end)) {
      // Case 2: We move within an rtl part or in an rtl editor on the same visual line
      let sticky = moveInStorageOrder ? "before" : "after";
      return new Pos(start.line, ch, sticky);
    }
  } // Case 3: Could not move within this bidi part in this visual line, so leave
  // the current bidi part


  let searchInVisualLine = (partPos, dir, wrappedLineExtent) => {
    let getRes = (ch, moveInStorageOrder) => moveInStorageOrder ? new Pos(start.line, mv(ch, 1), "before") : new Pos(start.line, ch, "after");

    for (; partPos >= 0 && partPos < bidi.length; partPos += dir) {
      let part = bidi[partPos];
      let moveInStorageOrder = dir > 0 == (part.level != 1);
      let ch = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
      if (part.from <= ch && ch < part.to) return getRes(ch, moveInStorageOrder);
      ch = moveInStorageOrder ? part.from : mv(part.to, -1);
      if (wrappedLineExtent.begin <= ch && ch < wrappedLineExtent.end) return getRes(ch, moveInStorageOrder);
    }
  }; // Case 3a: Look for other bidi parts on the same visual line


  let res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
  if (res) return res; // Case 3b: Look for other bidi parts on the next visual line

  let nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);

  if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
    res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
    if (res) return res;
  } // Case 4: Nowhere to move


  return null;
}

// editor, mostly used for keybindings.

let commands = {
  selectAll: selectAll,
  singleSelection: cm => cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll),
  killLine: cm => deleteNearSelection(cm, range => {
    if (range.empty()) {
      let len = getLine(cm.doc, range.head.line).text.length;
      if (range.head.ch == len && range.head.line < cm.lastLine()) return {
        from: range.head,
        to: Pos(range.head.line + 1, 0)
      };else return {
        from: range.head,
        to: Pos(range.head.line, len)
      };
    } else {
      return {
        from: range.from(),
        to: range.to()
      };
    }
  }),
  deleteLine: cm => deleteNearSelection(cm, range => ({
    from: Pos(range.from().line, 0),
    to: clipPos(cm.doc, Pos(range.to().line + 1, 0))
  })),
  delLineLeft: cm => deleteNearSelection(cm, range => ({
    from: Pos(range.from().line, 0),
    to: range.from()
  })),
  delWrappedLineLeft: cm => deleteNearSelection(cm, range => {
    let top = cm.charCoords(range.head, "div").top + 5;
    let leftPos = cm.coordsChar({
      left: 0,
      top: top
    }, "div");
    return {
      from: leftPos,
      to: range.from()
    };
  }),
  delWrappedLineRight: cm => deleteNearSelection(cm, range => {
    let top = cm.charCoords(range.head, "div").top + 5;
    let rightPos = cm.coordsChar({
      left: cm.display.lineDiv.offsetWidth + 100,
      top: top
    }, "div");
    return {
      from: range.from(),
      to: rightPos
    };
  }),
  undo: cm => cm.undo(),
  redo: cm => cm.redo(),
  undoSelection: cm => cm.undoSelection(),
  redoSelection: cm => cm.redoSelection(),
  goDocStart: cm => cm.extendSelection(Pos(cm.firstLine(), 0)),
  goDocEnd: cm => cm.extendSelection(Pos(cm.lastLine())),
  goLineStart: cm => cm.extendSelectionsBy(range => lineStart(cm, range.head.line), {
    origin: "+move",
    bias: 1
  }),
  goLineStartSmart: cm => cm.extendSelectionsBy(range => lineStartSmart(cm, range.head), {
    origin: "+move",
    bias: 1
  }),
  goLineEnd: cm => cm.extendSelectionsBy(range => lineEnd(cm, range.head.line), {
    origin: "+move",
    bias: -1
  }),
  goLineRight: cm => cm.extendSelectionsBy(range => {
    let top = cm.cursorCoords(range.head, "div").top + 5;
    return cm.coordsChar({
      left: cm.display.lineDiv.offsetWidth + 100,
      top: top
    }, "div");
  }, sel_move),
  goLineLeft: cm => cm.extendSelectionsBy(range => {
    let top = cm.cursorCoords(range.head, "div").top + 5;
    return cm.coordsChar({
      left: 0,
      top: top
    }, "div");
  }, sel_move),
  goLineLeftSmart: cm => cm.extendSelectionsBy(range => {
    let top = cm.cursorCoords(range.head, "div").top + 5;
    let pos = cm.coordsChar({
      left: 0,
      top: top
    }, "div");
    if (pos.ch < cm.getLine(pos.line).search(/\S/)) return lineStartSmart(cm, range.head);
    return pos;
  }, sel_move),
  goLineUp: cm => cm.moveV(-1, "line"),
  goLineDown: cm => cm.moveV(1, "line"),
  goPageUp: cm => cm.moveV(-1, "page"),
  goPageDown: cm => cm.moveV(1, "page"),
  goCharLeft: cm => cm.moveH(-1, "char"),
  goCharRight: cm => cm.moveH(1, "char"),
  goColumnLeft: cm => cm.moveH(-1, "column"),
  goColumnRight: cm => cm.moveH(1, "column"),
  goWordLeft: cm => cm.moveH(-1, "word"),
  goGroupRight: cm => cm.moveH(1, "group"),
  goGroupLeft: cm => cm.moveH(-1, "group"),
  goWordRight: cm => cm.moveH(1, "word"),
  delCharBefore: cm => cm.deleteH(-1, "codepoint"),
  delCharAfter: cm => cm.deleteH(1, "char"),
  delWordBefore: cm => cm.deleteH(-1, "word"),
  delWordAfter: cm => cm.deleteH(1, "word"),
  delGroupBefore: cm => cm.deleteH(-1, "group"),
  delGroupAfter: cm => cm.deleteH(1, "group"),
  indentAuto: cm => cm.indentSelection("smart"),
  indentMore: cm => cm.indentSelection("add"),
  indentLess: cm => cm.indentSelection("subtract"),
  insertTab: cm => cm.replaceSelection("\t"),
  insertSoftTab: cm => {
    let spaces = [],
        ranges = cm.listSelections(),
        tabSize = cm.options.tabSize;

    for (let i = 0; i < ranges.length; i++) {
      let pos = ranges[i].from();
      let col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
      spaces.push(spaceStr(tabSize - col % tabSize));
    }

    cm.replaceSelections(spaces);
  },
  defaultTab: cm => {
    if (cm.somethingSelected()) cm.indentSelection("add");else cm.execCommand("insertTab");
  },
  // Swap the two chars left and right of each selection's head.
  // Move cursor behind the two swapped characters afterwards.
  //
  // Doesn't consider line feeds a character.
  // Doesn't scan more than one line above to find a character.
  // Doesn't do anything on an empty line.
  // Doesn't do anything with non-empty selections.
  transposeChars: cm => runInOp(cm, () => {
    let ranges = cm.listSelections(),
        newSel = [];

    for (let i = 0; i < ranges.length; i++) {
      if (!ranges[i].empty()) continue;
      let cur = ranges[i].head,
          line = getLine(cm.doc, cur.line).text;

      if (line) {
        if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);

        if (cur.ch > 0) {
          cur = new Pos(cur.line, cur.ch + 1);
          cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2), Pos(cur.line, cur.ch - 2), cur, "+transpose");
        } else if (cur.line > cm.doc.first) {
          let prev = getLine(cm.doc, cur.line - 1).text;

          if (prev) {
            cur = new Pos(cur.line, 1);
            cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1), Pos(cur.line - 1, prev.length - 1), cur, "+transpose");
          }
        }
      }

      newSel.push(new Range(cur, cur));
    }

    cm.setSelections(newSel);
  }),
  newlineAndIndent: cm => runInOp(cm, () => {
    let sels = cm.listSelections();

    for (let i = sels.length - 1; i >= 0; i--) cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, "+input");

    sels = cm.listSelections();

    for (let i = 0; i < sels.length; i++) cm.indentLine(sels[i].from().line, null, true);

    ensureCursorVisible(cm);
  }),
  openLine: cm => cm.replaceSelection("\n", "start"),
  toggleOverwrite: cm => cm.toggleOverwrite()
};

function lineStart(cm, lineN) {
  let line = getLine(cm.doc, lineN);
  let visual = visualLine(line);
  if (visual != line) lineN = lineNo(visual);
  return endOfLine(true, cm, visual, lineN, 1);
}

function lineEnd(cm, lineN) {
  let line = getLine(cm.doc, lineN);
  let visual = visualLineEnd(line);
  if (visual != line) lineN = lineNo(visual);
  return endOfLine(true, cm, line, lineN, -1);
}

function lineStartSmart(cm, pos) {
  let start = lineStart(cm, pos.line);
  let line = getLine(cm.doc, start.line);
  let order = getOrder(line, cm.doc.direction);

  if (!order || order[0].level == 0) {
    let firstNonWS = Math.max(start.ch, line.text.search(/\S/));
    let inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
    return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
  }

  return start;
}

function doHandleBinding(cm, bound, dropShift) {
  if (typeof bound == "string") {
    bound = commands[bound];
    if (!bound) return false;
  } // Ensure previous input has been read, so that the handler sees a
  // consistent view of the document


  cm.display.input.ensurePolled();
  let prevShift = cm.display.shift,
      done = false;

  try {
    if (cm.isReadOnly()) cm.state.suppressEdits = true;
    if (dropShift) cm.display.shift = false;
    done = bound(cm) != Pass;
  } finally {
    cm.display.shift = prevShift;
    cm.state.suppressEdits = false;
  }

  return done;
}

function lookupKeyForEditor(cm, name, handle) {
  for (let i = 0; i < cm.state.keyMaps.length; i++) {
    let result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
    if (result) return result;
  }

  return cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm) || lookupKey(name, cm.options.keyMap, handle, cm);
} // Note that, despite the name, this function is also used to check
// for bound mouse clicks.


let stopSeq = new Delayed();
function dispatchKey(cm, name, e, handle) {
  let seq = cm.state.keySeq;

  if (seq) {
    if (isModifierKey(name)) return "handled";
    if (/\'$/.test(name)) cm.state.keySeq = null;else stopSeq.set(50, () => {
      if (cm.state.keySeq == seq) {
        cm.state.keySeq = null;
        cm.display.input.reset();
      }
    });
    if (dispatchKeyInner(cm, seq + " " + name, e, handle)) return true;
  }

  return dispatchKeyInner(cm, name, e, handle);
}

function dispatchKeyInner(cm, name, e, handle) {
  let result = lookupKeyForEditor(cm, name, handle);
  if (result == "multi") cm.state.keySeq = name;
  if (result == "handled") signalLater(cm, "keyHandled", cm, name, e);

  if (result == "handled" || result == "multi") {
    e_preventDefault(e);
    restartBlink(cm);
  }

  return !!result;
} // Handle a key from the keydown event.


function handleKeyBinding(cm, e) {
  let name = keyName(e, true);
  if (!name) return false;

  if (e.shiftKey && !cm.state.keySeq) {
    // First try to resolve full name (including 'Shift-'). Failing
    // that, see if there is a cursor-motion command (starting with
    // 'go') bound to the keyname without 'Shift-'.
    return dispatchKey(cm, "Shift-" + name, e, b => doHandleBinding(cm, b, true)) || dispatchKey(cm, name, e, b => {
      if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion) return doHandleBinding(cm, b);
    });
  } else {
    return dispatchKey(cm, name, e, b => doHandleBinding(cm, b));
  }
} // Handle a key from the keypress event


function handleCharBinding(cm, e, ch) {
  return dispatchKey(cm, "'" + ch + "'", e, b => doHandleBinding(cm, b, true));
}

let lastStoppedKey = null;
function onKeyDown(e) {
  let cm = this;
  if (e.target && e.target != cm.display.input.getField()) return;
  cm.curOp.focus = activeElt();
  if (signalDOMEvent(cm, e)) return; // IE does strange things with escape.

  if (ie && ie_version < 11 && e.keyCode == 27) e.returnValue = false;
  let code = e.keyCode;
  cm.display.shift = code == 16 || e.shiftKey;
  let handled = handleKeyBinding(cm, e);

  if (presto) {
    lastStoppedKey = handled ? code : null; // Opera has no cut event... we try to at least catch the key combo

    if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey)) cm.replaceSelection("", null, "cut");
  }

  if (gecko && !mac && !handled && code == 46 && e.shiftKey && !e.ctrlKey && document.execCommand) document.execCommand("cut"); // Turn mouse into crosshair when Alt is held on Mac.

  if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className)) showCrossHair(cm);
}

function showCrossHair(cm) {
  let lineDiv = cm.display.lineDiv;
  addClass(lineDiv, "CodeMirror-crosshair");

  function up(e) {
    if (e.keyCode == 18 || !e.altKey) {
      rmClass(lineDiv, "CodeMirror-crosshair");
      off(document, "keyup", up);
      off(document, "mouseover", up);
    }
  }

  on(document, "keyup", up);
  on(document, "mouseover", up);
}

function onKeyUp(e) {
  if (e.keyCode == 16) this.doc.sel.shift = false;
  signalDOMEvent(this, e);
}
function onKeyPress(e) {
  let cm = this;
  if (e.target && e.target != cm.display.input.getField()) return;
  if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) return;
  let keyCode = e.keyCode,
      charCode = e.charCode;

  if (presto && keyCode == lastStoppedKey) {
    lastStoppedKey = null;
    e_preventDefault(e);
    return;
  }

  if (presto && (!e.which || e.which < 10) && handleKeyBinding(cm, e)) return;
  let ch = String.fromCharCode(charCode == null ? keyCode : charCode); // Some browsers fire keypress events for backspace

  if (ch == "\x08") return;
  if (handleCharBinding(cm, e, ch)) return;
  cm.display.input.onKeyPress(e);
}

const DOUBLECLICK_DELAY = 400;

class PastClick {
  constructor(time, pos, button) {
    this.time = time;
    this.pos = pos;
    this.button = button;
  }

  compare(time, pos, button) {
    return this.time + DOUBLECLICK_DELAY > time && cmp(pos, this.pos) == 0 && button == this.button;
  }

}

let lastClick, lastDoubleClick;

function clickRepeat(pos, button) {
  let now = +new Date();

  if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
    lastClick = lastDoubleClick = null;
    return "triple";
  } else if (lastClick && lastClick.compare(now, pos, button)) {
    lastDoubleClick = new PastClick(now, pos, button);
    lastClick = null;
    return "double";
  } else {
    lastClick = new PastClick(now, pos, button);
    lastDoubleClick = null;
    return "single";
  }
} // A mouse down can be a single click, double click, triple click,
// start of selection drag, start of text drag, new cursor
// (ctrl-click), rectangle drag (alt-drag), or xwin
// middle-click-paste. Or it might be a click on something we should
// not interfere with, such as a scrollbar or widget.


function onMouseDown(e) {
  let cm = this,
      display = cm.display;
  if (signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch()) return;
  display.input.ensurePolled();
  display.shift = e.shiftKey;

  if (eventInWidget(display, e)) {
    if (!webkit) {
      // Briefly turn off draggability, to allow widgets to do
      // normal dragging things.
      display.scroller.draggable = false;
      setTimeout(() => display.scroller.draggable = true, 100);
    }

    return;
  }

  if (clickInGutter(cm, e)) return;
  let pos = posFromMouse(cm, e),
      button = e_button(e),
      repeat = pos ? clickRepeat(pos, button) : "single";
  window.focus(); // #3261: make sure, that we're not starting a second selection

  if (button == 1 && cm.state.selectingText) cm.state.selectingText(e);
  if (pos && handleMappedButton(cm, button, pos, repeat, e)) return;

  if (button == 1) {
    if (pos) leftButtonDown(cm, pos, repeat, e);else if (e_target(e) == display.scroller) e_preventDefault(e);
  } else if (button == 2) {
    if (pos) extendSelection(cm.doc, pos);
    setTimeout(() => display.input.focus(), 20);
  } else if (button == 3) {
    if (captureRightClick) cm.display.input.onContextMenu(e);else delayBlurEvent(cm);
  }
}

function handleMappedButton(cm, button, pos, repeat, event) {
  let name = "Click";
  if (repeat == "double") name = "Double" + name;else if (repeat == "triple") name = "Triple" + name;
  name = (button == 1 ? "Left" : button == 2 ? "Middle" : "Right") + name;
  return dispatchKey(cm, addModifierNames(name, event), event, bound => {
    if (typeof bound == "string") bound = commands[bound];
    if (!bound) return false;
    let done = false;

    try {
      if (cm.isReadOnly()) cm.state.suppressEdits = true;
      done = bound(cm, pos) != Pass;
    } finally {
      cm.state.suppressEdits = false;
    }

    return done;
  });
}

function configureMouse(cm, repeat, event) {
  let option = cm.getOption("configureMouse");
  let value = option ? option(cm, repeat, event) : {};

  if (value.unit == null) {
    let rect = chromeOS ? event.shiftKey && event.metaKey : event.altKey;
    value.unit = rect ? "rectangle" : repeat == "single" ? "char" : repeat == "double" ? "word" : "line";
  }

  if (value.extend == null || cm.doc.extend) value.extend = cm.doc.extend || event.shiftKey;
  if (value.addNew == null) value.addNew = mac ? event.metaKey : event.ctrlKey;
  if (value.moveOnDrag == null) value.moveOnDrag = !(mac ? event.altKey : event.ctrlKey);
  return value;
}

function leftButtonDown(cm, pos, repeat, event) {
  if (ie) setTimeout(bind(ensureFocus, cm), 0);else cm.curOp.focus = activeElt();
  let behavior = configureMouse(cm, repeat, event);
  let sel = cm.doc.sel,
      contained;
  if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() && repeat == "single" && (contained = sel.contains(pos)) > -1 && (cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (cmp(contained.to(), pos) > 0 || pos.xRel < 0)) leftButtonStartDrag(cm, event, pos, behavior);else leftButtonSelect(cm, event, pos, behavior);
} // Start a text drag. When it ends, see if any dragging actually
// happen, and treat as a click if it didn't.


function leftButtonStartDrag(cm, event, pos, behavior) {
  let display = cm.display,
      moved = false;
  let dragEnd = operation(cm, e => {
    if (webkit) display.scroller.draggable = false;
    cm.state.draggingText = false;

    if (cm.state.delayingBlurEvent) {
      if (cm.hasFocus()) cm.state.delayingBlurEvent = false;else delayBlurEvent(cm);
    }

    off(display.wrapper.ownerDocument, "mouseup", dragEnd);
    off(display.wrapper.ownerDocument, "mousemove", mouseMove);
    off(display.scroller, "dragstart", dragStart);
    off(display.scroller, "drop", dragEnd);

    if (!moved) {
      e_preventDefault(e);
      if (!behavior.addNew) extendSelection(cm.doc, pos, null, null, behavior.extend); // Work around unexplainable focus problem in IE9 (#2127) and Chrome (#3081)

      if (webkit && !safari || ie && ie_version == 9) setTimeout(() => {
        display.wrapper.ownerDocument.body.focus({
          preventScroll: true
        });
        display.input.focus();
      }, 20);else display.input.focus();
    }
  });

  let mouseMove = function (e2) {
    moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
  };

  let dragStart = () => moved = true; // Let the drag handler handle this.


  if (webkit) display.scroller.draggable = true;
  cm.state.draggingText = dragEnd;
  dragEnd.copy = !behavior.moveOnDrag;
  on(display.wrapper.ownerDocument, "mouseup", dragEnd);
  on(display.wrapper.ownerDocument, "mousemove", mouseMove);
  on(display.scroller, "dragstart", dragStart);
  on(display.scroller, "drop", dragEnd);
  cm.state.delayingBlurEvent = true;
  setTimeout(() => display.input.focus(), 20); // IE's approach to draggable

  if (display.scroller.dragDrop) display.scroller.dragDrop();
}

function rangeForUnit(cm, pos, unit) {
  if (unit == "char") return new Range(pos, pos);
  if (unit == "word") return cm.findWordAt(pos);
  if (unit == "line") return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
  let result = unit(cm, pos);
  return new Range(result.from, result.to);
} // Normal selection, as opposed to text dragging.


function leftButtonSelect(cm, event, start, behavior) {
  if (ie) delayBlurEvent(cm);
  let display = cm.display,
      doc = cm.doc;
  e_preventDefault(event);
  let ourRange,
      ourIndex,
      startSel = doc.sel,
      ranges = startSel.ranges;

  if (behavior.addNew && !behavior.extend) {
    ourIndex = doc.sel.contains(start);
    if (ourIndex > -1) ourRange = ranges[ourIndex];else ourRange = new Range(start, start);
  } else {
    ourRange = doc.sel.primary();
    ourIndex = doc.sel.primIndex;
  }

  if (behavior.unit == "rectangle") {
    if (!behavior.addNew) ourRange = new Range(start, start);
    start = posFromMouse(cm, event, true, true);
    ourIndex = -1;
  } else {
    let range = rangeForUnit(cm, start, behavior.unit);
    if (behavior.extend) ourRange = extendRange(ourRange, range.anchor, range.head, behavior.extend);else ourRange = range;
  }

  if (!behavior.addNew) {
    ourIndex = 0;
    setSelection(doc, new Selection([ourRange], 0), sel_mouse);
    startSel = doc.sel;
  } else if (ourIndex == -1) {
    ourIndex = ranges.length;
    setSelection(doc, normalizeSelection(cm, ranges.concat([ourRange]), ourIndex), {
      scroll: false,
      origin: "*mouse"
    });
  } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == "char" && !behavior.extend) {
    setSelection(doc, normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), {
      scroll: false,
      origin: "*mouse"
    });
    startSel = doc.sel;
  } else {
    replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
  }

  let lastPos = start;

  function extendTo(pos) {
    if (cmp(lastPos, pos) == 0) return;
    lastPos = pos;

    if (behavior.unit == "rectangle") {
      let ranges = [],
          tabSize = cm.options.tabSize;
      let startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
      let posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
      let left = Math.min(startCol, posCol),
          right = Math.max(startCol, posCol);

      for (let line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
        let text = getLine(doc, line).text,
            leftPos = findColumn(text, left, tabSize);
        if (left == right) ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));else if (text.length > leftPos) ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
      }

      if (!ranges.length) ranges.push(new Range(start, start));
      setSelection(doc, normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex), {
        origin: "*mouse",
        scroll: false
      });
      cm.scrollIntoView(pos);
    } else {
      let oldRange = ourRange;
      let range = rangeForUnit(cm, pos, behavior.unit);
      let anchor = oldRange.anchor,
          head;

      if (cmp(range.anchor, anchor) > 0) {
        head = range.head;
        anchor = minPos(oldRange.from(), range.anchor);
      } else {
        head = range.anchor;
        anchor = maxPos(oldRange.to(), range.head);
      }

      let ranges = startSel.ranges.slice(0);
      ranges[ourIndex] = bidiSimplify(cm, new Range(clipPos(doc, anchor), head));
      setSelection(doc, normalizeSelection(cm, ranges, ourIndex), sel_mouse);
    }
  }

  let editorSize = display.wrapper.getBoundingClientRect(); // Used to ensure timeout re-tries don't fire when another extend
  // happened in the meantime (clearTimeout isn't reliable -- at
  // least on Chrome, the timeouts still happen even when cleared,
  // if the clear happens after their scheduled firing time).

  let counter = 0;

  function extend(e) {
    let curCount = ++counter;
    let cur = posFromMouse(cm, e, true, behavior.unit == "rectangle");
    if (!cur) return;

    if (cmp(cur, lastPos) != 0) {
      cm.curOp.focus = activeElt();
      extendTo(cur);
      let visible = visibleLines(display, doc);
      if (cur.line >= visible.to || cur.line < visible.from) setTimeout(operation(cm, () => {
        if (counter == curCount) extend(e);
      }), 150);
    } else {
      let outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
      if (outside) setTimeout(operation(cm, () => {
        if (counter != curCount) return;
        display.scroller.scrollTop += outside;
        extend(e);
      }), 50);
    }
  }

  function done(e) {
    cm.state.selectingText = false;
    counter = Infinity; // If e is null or undefined we interpret this as someone trying
    // to explicitly cancel the selection rather than the user
    // letting go of the mouse button.

    if (e) {
      e_preventDefault(e);
      display.input.focus();
    }

    off(display.wrapper.ownerDocument, "mousemove", move);
    off(display.wrapper.ownerDocument, "mouseup", up);
    doc.history.lastSelOrigin = null;
  }

  let move = operation(cm, e => {
    if (e.buttons === 0 || !e_button(e)) done(e);else extend(e);
  });
  let up = operation(cm, done);
  cm.state.selectingText = up;
  on(display.wrapper.ownerDocument, "mousemove", move);
  on(display.wrapper.ownerDocument, "mouseup", up);
} // Used when mouse-selecting to adjust the anchor to the proper side
// of a bidi jump depending on the visual position of the head.


function bidiSimplify(cm, range) {
  let {
    anchor,
    head
  } = range,
      anchorLine = getLine(cm.doc, anchor.line);
  if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) return range;
  let order = getOrder(anchorLine);
  if (!order) return range;
  let index = getBidiPartAt(order, anchor.ch, anchor.sticky),
      part = order[index];
  if (part.from != anchor.ch && part.to != anchor.ch) return range;
  let boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
  if (boundary == 0 || boundary == order.length) return range; // Compute the relative visual position of the head compared to the
  // anchor (<0 is to the left, >0 to the right)

  let leftSide;

  if (head.line != anchor.line) {
    leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
  } else {
    let headIndex = getBidiPartAt(order, head.ch, head.sticky);
    let dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
    if (headIndex == boundary - 1 || headIndex == boundary) leftSide = dir < 0;else leftSide = dir > 0;
  }

  let usePart = order[boundary + (leftSide ? -1 : 0)];
  let from = leftSide == (usePart.level == 1);
  let ch = from ? usePart.from : usePart.to,
      sticky = from ? "after" : "before";
  return anchor.ch == ch && anchor.sticky == sticky ? range : new Range(new Pos(anchor.line, ch, sticky), head);
} // Determines whether an event happened in the gutter, and fires the
// handlers for the corresponding event.


function gutterEvent(cm, e, type, prevent) {
  let mX, mY;

  if (e.touches) {
    mX = e.touches[0].clientX;
    mY = e.touches[0].clientY;
  } else {
    try {
      mX = e.clientX;
      mY = e.clientY;
    } catch (e) {
      return false;
    }
  }

  if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
  if (prevent) e_preventDefault(e);
  let display = cm.display;
  let lineBox = display.lineDiv.getBoundingClientRect();
  if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
  mY -= lineBox.top - display.viewOffset;

  for (let i = 0; i < cm.display.gutterSpecs.length; ++i) {
    let g = display.gutters.childNodes[i];

    if (g && g.getBoundingClientRect().right >= mX) {
      let line = lineAtHeight(cm.doc, mY);
      let gutter = cm.display.gutterSpecs[i];
      signal(cm, type, cm, line, gutter.className, e);
      return e_defaultPrevented(e);
    }
  }
}

function clickInGutter(cm, e) {
  return gutterEvent(cm, e, "gutterClick", true);
} // CONTEXT MENU HANDLING
// To make the context menu work, we need to briefly unhide the
// textarea (making it as unobtrusive as possible) to let the
// right-click take effect on it.

function onContextMenu(cm, e) {
  if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) return;
  if (signalDOMEvent(cm, e, "contextmenu")) return;
  if (!captureRightClick) cm.display.input.onContextMenu(e);
}

function contextMenuInGutter(cm, e) {
  if (!hasHandler(cm, "gutterContextMenu")) return false;
  return gutterEvent(cm, e, "gutterContextMenu", false);
}

function themeChanged(cm) {
  cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
  clearCaches(cm);
}

let Init = {
  toString: function () {
    return "CodeMirror.Init";
  }
};
let defaults = {};
let optionHandlers = {};
function defineOptions(CodeMirror) {
  let optionHandlers = CodeMirror.optionHandlers;

  function option(name, deflt, handle, notOnInit) {
    CodeMirror.defaults[name] = deflt;
    if (handle) optionHandlers[name] = notOnInit ? (cm, val, old) => {
      if (old != Init) handle(cm, val, old);
    } : handle;
  }

  CodeMirror.defineOption = option; // Passed to option handlers when there is no old value.

  CodeMirror.Init = Init; // These two are, on init, called from the constructor because they
  // have to be initialized before the editor can start at all.

  option("value", "", (cm, val) => cm.setValue(val), true);
  option("mode", null, (cm, val) => {
    cm.doc.modeOption = val;
    loadMode(cm);
  }, true);
  option("indentUnit", 2, loadMode, true);
  option("indentWithTabs", false);
  option("smartIndent", true);
  option("tabSize", 4, cm => {
    resetModeState(cm);
    clearCaches(cm);
    regChange(cm);
  }, true);
  option("lineSeparator", null, (cm, val) => {
    cm.doc.lineSep = val;
    if (!val) return;
    let newBreaks = [],
        lineNo = cm.doc.first;
    cm.doc.iter(line => {
      for (let pos = 0;;) {
        let found = line.text.indexOf(val, pos);
        if (found == -1) break;
        pos = found + val.length;
        newBreaks.push(Pos(lineNo, found));
      }

      lineNo++;
    });

    for (let i = newBreaks.length - 1; i >= 0; i--) replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length));
  });
  option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, (cm, val, old) => {
    cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
    if (old != Init) cm.refresh();
  });
  option("specialCharPlaceholder", defaultSpecialCharPlaceholder, cm => cm.refresh(), true);
  option("electricChars", true);
  option("inputStyle", mobile ? "contenteditable" : "textarea", () => {
    throw new Error("inputStyle can not (yet) be changed in a running editor"); // FIXME
  }, true);
  option("spellcheck", false, (cm, val) => cm.getInputField().spellcheck = val, true);
  option("autocorrect", false, (cm, val) => cm.getInputField().autocorrect = val, true);
  option("autocapitalize", false, (cm, val) => cm.getInputField().autocapitalize = val, true);
  option("rtlMoveVisually", !windows);
  option("wholeLineUpdateBefore", true);
  option("theme", "default", cm => {
    themeChanged(cm);
    updateGutters(cm);
  }, true);
  option("keyMap", "default", (cm, val, old) => {
    let next = getKeyMap(val);
    let prev = old != Init && getKeyMap(old);
    if (prev && prev.detach) prev.detach(cm, next);
    if (next.attach) next.attach(cm, prev || null);
  });
  option("extraKeys", null);
  option("configureMouse", null);
  option("lineWrapping", false, wrappingChanged, true);
  option("gutters", [], (cm, val) => {
    cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers);
    updateGutters(cm);
  }, true);
  option("fixedGutter", true, (cm, val) => {
    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
    cm.refresh();
  }, true);
  option("coverGutterNextToScrollbar", false, cm => updateScrollbars(cm), true);
  option("scrollbarStyle", "native", cm => {
    initScrollbars(cm);
    updateScrollbars(cm);
    cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
    cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
  }, true);
  option("lineNumbers", false, (cm, val) => {
    cm.display.gutterSpecs = getGutters(cm.options.gutters, val);
    updateGutters(cm);
  }, true);
  option("firstLineNumber", 1, updateGutters, true);
  option("lineNumberFormatter", integer => integer, updateGutters, true);
  option("showCursorWhenSelecting", false, updateSelection, true);
  option("resetSelectionOnContextMenu", true);
  option("lineWiseCopyCut", true);
  option("pasteLinesPerSelection", true);
  option("selectionsMayTouch", false);
  option("readOnly", false, (cm, val) => {
    if (val == "nocursor") {
      onBlur(cm);
      cm.display.input.blur();
    }

    cm.display.input.readOnlyChanged(val);
  });
  option("screenReaderLabel", null, (cm, val) => {
    val = val === '' ? null : val;
    cm.display.input.screenReaderLabelChanged(val);
  });
  option("disableInput", false, (cm, val) => {
    if (!val) cm.display.input.reset();
  }, true);
  option("dragDrop", true, dragDropChanged);
  option("allowDropFileTypes", null);
  option("cursorBlinkRate", 530);
  option("cursorScrollMargin", 0);
  option("cursorHeight", 1, updateSelection, true);
  option("singleCursorHeightPerLine", true, updateSelection, true);
  option("workTime", 100);
  option("workDelay", 100);
  option("flattenSpans", true, resetModeState, true);
  option("addModeClass", false, resetModeState, true);
  option("pollInterval", 100);
  option("undoDepth", 200, (cm, val) => cm.doc.history.undoDepth = val);
  option("historyEventDelay", 1250);
  option("viewportMargin", 10, cm => cm.refresh(), true);
  option("maxHighlightLength", 10000, resetModeState, true);
  option("moveInputWithCursor", true, (cm, val) => {
    if (!val) cm.display.input.resetPosition();
  });
  option("tabindex", null, (cm, val) => cm.display.input.getField().tabIndex = val || "");
  option("autofocus", null);
  option("direction", "ltr", (cm, val) => cm.doc.setDirection(val), true);
  option("phrases", null);
}

function dragDropChanged(cm, value, old) {
  let wasOn = old && old != Init;

  if (!value != !wasOn) {
    let funcs = cm.display.dragFunctions;
    let toggle = value ? on : off;
    toggle(cm.display.scroller, "dragstart", funcs.start);
    toggle(cm.display.scroller, "dragenter", funcs.enter);
    toggle(cm.display.scroller, "dragover", funcs.over);
    toggle(cm.display.scroller, "dragleave", funcs.leave);
    toggle(cm.display.scroller, "drop", funcs.drop);
  }
}

function wrappingChanged(cm) {
  if (cm.options.lineWrapping) {
    addClass(cm.display.wrapper, "CodeMirror-wrap");
    cm.display.sizer.style.minWidth = "";
    cm.display.sizerWidth = null;
  } else {
    rmClass(cm.display.wrapper, "CodeMirror-wrap");
    findMaxLine(cm);
  }

  estimateLineHeights(cm);
  regChange(cm);
  clearCaches(cm);
  setTimeout(() => updateScrollbars(cm), 100);
}

// that user code is usually dealing with.

function CodeMirror(place, options) {
  if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);
  this.options = options = options ? copyObj(options) : {}; // Determine effective options based on given values and defaults.

  copyObj(defaults, options, false);
  let doc = options.value;
  if (typeof doc == "string") doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction);else if (options.mode) doc.modeOption = options.mode;
  this.doc = doc;
  let input = new CodeMirror.inputStyles[options.inputStyle](this);
  let display = this.display = new Display(place, doc, input, options);
  display.wrapper.CodeMirror = this;
  themeChanged(this);
  if (options.lineWrapping) this.display.wrapper.className += " CodeMirror-wrap";
  initScrollbars(this);
  this.state = {
    keyMaps: [],
    // stores maps added by addKeyMap
    overlays: [],
    // highlighting overlays, as added by addOverlay
    modeGen: 0,
    // bumped when mode/overlay changes, used to invalidate highlighting info
    overwrite: false,
    delayingBlurEvent: false,
    focused: false,
    suppressEdits: false,
    // used to disable editing during key handlers when in readOnly mode
    pasteIncoming: -1,
    cutIncoming: -1,
    // help recognize paste/cut edits in input.poll
    selectingText: false,
    draggingText: false,
    highlight: new Delayed(),
    // stores highlight worker timeout
    keySeq: null,
    // Unfinished key sequence
    specialChars: null
  };
  if (options.autofocus && !mobile) display.input.focus(); // Override magic textarea content restore that IE sometimes does
  // on our hidden textarea on reload

  if (ie && ie_version < 11) setTimeout(() => this.display.input.reset(true), 20);
  registerEventHandlers(this);
  ensureGlobalHandlers();
  startOperation(this);
  this.curOp.forceUpdate = true;
  attachDoc(this, doc);
  if (options.autofocus && !mobile || this.hasFocus()) setTimeout(() => {
    if (this.hasFocus() && !this.state.focused) onFocus(this);
  }, 20);else onBlur(this);

  for (let opt in optionHandlers) if (optionHandlers.hasOwnProperty(opt)) optionHandlers[opt](this, options[opt], Init);

  maybeUpdateLineNumberWidth(this);
  if (options.finishInit) options.finishInit(this);

  for (let i = 0; i < initHooks.length; ++i) initHooks[i](this);

  endOperation(this); // Suppress optimizelegibility in Webkit, since it breaks text
  // measuring on line wrapping boundaries.

  if (webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == "optimizelegibility") display.lineDiv.style.textRendering = "auto";
} // The default configuration options.

CodeMirror.defaults = defaults; // Functions to run when options are changed.

CodeMirror.optionHandlers = optionHandlers;

function registerEventHandlers(cm) {
  let d = cm.display;
  on(d.scroller, "mousedown", operation(cm, onMouseDown)); // Older IE's will not fire a second mousedown for a double click

  if (ie && ie_version < 11) on(d.scroller, "dblclick", operation(cm, e => {
    if (signalDOMEvent(cm, e)) return;
    let pos = posFromMouse(cm, e);
    if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
    e_preventDefault(e);
    let word = cm.findWordAt(pos);
    extendSelection(cm.doc, word.anchor, word.head);
  }));else on(d.scroller, "dblclick", e => signalDOMEvent(cm, e) || e_preventDefault(e)); // Some browsers fire contextmenu *after* opening the menu, at
  // which point we can't mess with it anymore. Context menu is
  // handled in onMouseDown for these browsers.

  on(d.scroller, "contextmenu", e => onContextMenu(cm, e));
  on(d.input.getField(), "contextmenu", e => {
    if (!d.scroller.contains(e.target)) onContextMenu(cm, e);
  }); // Used to suppress mouse event handling when a touch happens

  let touchFinished,
      prevTouch = {
    end: 0
  };

  function finishTouch() {
    if (d.activeTouch) {
      touchFinished = setTimeout(() => d.activeTouch = null, 1000);
      prevTouch = d.activeTouch;
      prevTouch.end = +new Date();
    }
  }

  function isMouseLikeTouchEvent(e) {
    if (e.touches.length != 1) return false;
    let touch = e.touches[0];
    return touch.radiusX <= 1 && touch.radiusY <= 1;
  }

  function farAway(touch, other) {
    if (other.left == null) return true;
    let dx = other.left - touch.left,
        dy = other.top - touch.top;
    return dx * dx + dy * dy > 20 * 20;
  }

  on(d.scroller, "touchstart", e => {
    if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(cm, e)) {
      d.input.ensurePolled();
      clearTimeout(touchFinished);
      let now = +new Date();
      d.activeTouch = {
        start: now,
        moved: false,
        prev: now - prevTouch.end <= 300 ? prevTouch : null
      };

      if (e.touches.length == 1) {
        d.activeTouch.left = e.touches[0].pageX;
        d.activeTouch.top = e.touches[0].pageY;
      }
    }
  });
  on(d.scroller, "touchmove", () => {
    if (d.activeTouch) d.activeTouch.moved = true;
  });
  on(d.scroller, "touchend", e => {
    let touch = d.activeTouch;

    if (touch && !eventInWidget(d, e) && touch.left != null && !touch.moved && new Date() - touch.start < 300) {
      let pos = cm.coordsChar(d.activeTouch, "page"),
          range;
      if (!touch.prev || farAway(touch, touch.prev)) // Single tap
        range = new Range(pos, pos);else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) // Double tap
        range = cm.findWordAt(pos);else // Triple tap
        range = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
      cm.setSelection(range.anchor, range.head);
      cm.focus();
      e_preventDefault(e);
    }

    finishTouch();
  });
  on(d.scroller, "touchcancel", finishTouch); // Sync scrolling between fake scrollbars and real scrollable
  // area, ensure viewport is updated when scrolling.

  on(d.scroller, "scroll", () => {
    if (d.scroller.clientHeight) {
      updateScrollTop(cm, d.scroller.scrollTop);
      setScrollLeft(cm, d.scroller.scrollLeft, true);
      signal(cm, "scroll", cm);
    }
  }); // Listen to wheel events in order to try and update the viewport on time.

  on(d.scroller, "mousewheel", e => onScrollWheel(cm, e));
  on(d.scroller, "DOMMouseScroll", e => onScrollWheel(cm, e)); // Prevent wrapper from ever scrolling

  on(d.wrapper, "scroll", () => d.wrapper.scrollTop = d.wrapper.scrollLeft = 0);
  d.dragFunctions = {
    enter: e => {
      if (!signalDOMEvent(cm, e)) e_stop(e);
    },
    over: e => {
      if (!signalDOMEvent(cm, e)) {
        onDragOver(cm, e);
        e_stop(e);
      }
    },
    start: e => onDragStart(cm, e),
    drop: operation(cm, onDrop),
    leave: e => {
      if (!signalDOMEvent(cm, e)) {
        clearDragCursor(cm);
      }
    }
  };
  let inp = d.input.getField();
  on(inp, "keyup", e => onKeyUp.call(cm, e));
  on(inp, "keydown", operation(cm, onKeyDown));
  on(inp, "keypress", operation(cm, onKeyPress));
  on(inp, "focus", e => onFocus(cm, e));
  on(inp, "blur", e => onBlur(cm, e));
}

let initHooks = [];

CodeMirror.defineInitHook = f => initHooks.push(f);

// "add"/null, "subtract", or "prev". When aggressive is false
// (typically set to true for forced single-line indents), empty
// lines are not indented, and places where the mode returns Pass
// are left alone.

function indentLine(cm, n, how, aggressive) {
  let doc = cm.doc,
      state;
  if (how == null) how = "add";

  if (how == "smart") {
    // Fall back to "prev" when the mode doesn't have an indentation
    // method.
    if (!doc.mode.indent) how = "prev";else state = getContextBefore(cm, n).state;
  }

  let tabSize = cm.options.tabSize;
  let line = getLine(doc, n),
      curSpace = countColumn(line.text, null, tabSize);
  if (line.stateAfter) line.stateAfter = null;
  let curSpaceString = line.text.match(/^\s*/)[0],
      indentation;

  if (!aggressive && !/\S/.test(line.text)) {
    indentation = 0;
    how = "not";
  } else if (how == "smart") {
    indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);

    if (indentation == Pass || indentation > 150) {
      if (!aggressive) return;
      how = "prev";
    }
  }

  if (how == "prev") {
    if (n > doc.first) indentation = countColumn(getLine(doc, n - 1).text, null, tabSize);else indentation = 0;
  } else if (how == "add") {
    indentation = curSpace + cm.options.indentUnit;
  } else if (how == "subtract") {
    indentation = curSpace - cm.options.indentUnit;
  } else if (typeof how == "number") {
    indentation = curSpace + how;
  }

  indentation = Math.max(0, indentation);
  let indentString = "",
      pos = 0;
  if (cm.options.indentWithTabs) for (let i = Math.floor(indentation / tabSize); i; --i) {
    pos += tabSize;
    indentString += "\t";
  }
  if (pos < indentation) indentString += spaceStr(indentation - pos);

  if (indentString != curSpaceString) {
    replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
    line.stateAfter = null;
    return true;
  } else {
    // Ensure that, if the cursor was in the whitespace at the start
    // of the line, it is moved to the end of that space.
    for (let i = 0; i < doc.sel.ranges.length; i++) {
      let range = doc.sel.ranges[i];

      if (range.head.line == n && range.head.ch < curSpaceString.length) {
        let pos = Pos(n, curSpaceString.length);
        replaceOneSelection(doc, i, new Range(pos, pos));
        break;
      }
    }
  }
}

// that, when pasting, we know what kind of selections the copied
// text was made out of.

let lastCopied = null;
function setLastCopied(newLastCopied) {
  lastCopied = newLastCopied;
}
function applyTextInput(cm, inserted, deleted, sel, origin) {
  let doc = cm.doc;
  cm.display.shift = false;
  if (!sel) sel = doc.sel;
  let recent = +new Date() - 200;
  let paste = origin == "paste" || cm.state.pasteIncoming > recent;
  let textLines = splitLinesAuto(inserted),
      multiPaste = null; // When pasting N lines into N selections, insert one line per selection

  if (paste && sel.ranges.length > 1) {
    if (lastCopied && lastCopied.text.join("\n") == inserted) {
      if (sel.ranges.length % lastCopied.text.length == 0) {
        multiPaste = [];

        for (let i = 0; i < lastCopied.text.length; i++) multiPaste.push(doc.splitLines(lastCopied.text[i]));
      }
    } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
      multiPaste = map(textLines, l => [l]);
    }
  }

  let updateInput = cm.curOp.updateInput; // Normal behavior is to insert the new text into every selection

  for (let i = sel.ranges.length - 1; i >= 0; i--) {
    let range = sel.ranges[i];
    let from = range.from(),
        to = range.to();

    if (range.empty()) {
      if (deleted && deleted > 0) // Handle deletion
        from = Pos(from.line, from.ch - deleted);else if (cm.state.overwrite && !paste) // Handle overwrite
        to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == textLines.join("\n")) from = to = Pos(from.line, 0);
    }

    let changeEvent = {
      from: from,
      to: to,
      text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
      origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")
    };
    makeChange(cm.doc, changeEvent);
    signalLater(cm, "inputRead", cm, changeEvent);
  }

  if (inserted && !paste) triggerElectric(cm, inserted);
  ensureCursorVisible(cm);
  if (cm.curOp.updateInput < 2) cm.curOp.updateInput = updateInput;
  cm.curOp.typing = true;
  cm.state.pasteIncoming = cm.state.cutIncoming = -1;
}
function handlePaste(e, cm) {
  let pasted = e.clipboardData && e.clipboardData.getData("Text");

  if (pasted) {
    e.preventDefault();
    if (!cm.isReadOnly() && !cm.options.disableInput) runInOp(cm, () => applyTextInput(cm, pasted, 0, null, "paste"));
    return true;
  }
}
function triggerElectric(cm, inserted) {
  // When an 'electric' character is inserted, immediately trigger a reindent
  if (!cm.options.electricChars || !cm.options.smartIndent) return;
  let sel = cm.doc.sel;

  for (let i = sel.ranges.length - 1; i >= 0; i--) {
    let range = sel.ranges[i];
    if (range.head.ch > 100 || i && sel.ranges[i - 1].head.line == range.head.line) continue;
    let mode = cm.getModeAt(range.head);
    let indented = false;

    if (mode.electricChars) {
      for (let j = 0; j < mode.electricChars.length; j++) if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
        indented = indentLine(cm, range.head.line, "smart");
        break;
      }
    } else if (mode.electricInput) {
      if (mode.electricInput.test(getLine(cm.doc, range.head.line).text.slice(0, range.head.ch))) indented = indentLine(cm, range.head.line, "smart");
    }

    if (indented) signalLater(cm, "electricInput", cm, range.head.line);
  }
}
function copyableRanges(cm) {
  let text = [],
      ranges = [];

  for (let i = 0; i < cm.doc.sel.ranges.length; i++) {
    let line = cm.doc.sel.ranges[i].head.line;
    let lineRange = {
      anchor: Pos(line, 0),
      head: Pos(line + 1, 0)
    };
    ranges.push(lineRange);
    text.push(cm.getRange(lineRange.anchor, lineRange.head));
  }

  return {
    text: text,
    ranges: ranges
  };
}
function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
  field.setAttribute("autocorrect", autocorrect ? "" : "off");
  field.setAttribute("autocapitalize", autocapitalize ? "" : "off");
  field.setAttribute("spellcheck", !!spellcheck);
}
function hiddenTextarea() {
  let te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none");
  let div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;"); // The textarea is kept positioned near the cursor to prevent the
  // fact that it'll be scrolled into view on input from scrolling
  // our fake cursor out of view. On webkit, when wrap=off, paste is
  // very slow. So make the area wide instead.

  if (webkit) te.style.width = "1000px";else te.setAttribute("wrap", "off"); // If border: 0; -- iOS fails to open keyboard (issue #1287)

  if (ios) te.style.border = "1px solid black";
  disableBrowserMagic(te);
  return div;
}

// 'wrap f in an operation, performed on its `this` parameter'.
// This is not the complete set of editor methods. Most of the
// methods defined on the Doc type are also injected into
// CodeMirror.prototype, for backwards compatibility and
// convenience.

function addEditorMethods (CodeMirror) {
  let optionHandlers = CodeMirror.optionHandlers;
  let helpers = CodeMirror.helpers = {};
  CodeMirror.prototype = {
    constructor: CodeMirror,
    focus: function () {
      window.focus();
      this.display.input.focus();
    },
    setOption: function (option, value) {
      let options = this.options,
          old = options[option];
      if (options[option] == value && option != "mode") return;
      options[option] = value;
      if (optionHandlers.hasOwnProperty(option)) operation(this, optionHandlers[option])(this, value, old);
      signal(this, "optionChange", this, option);
    },
    getOption: function (option) {
      return this.options[option];
    },
    getDoc: function () {
      return this.doc;
    },
    addKeyMap: function (map, bottom) {
      this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map));
    },
    removeKeyMap: function (map) {
      let maps = this.state.keyMaps;

      for (let i = 0; i < maps.length; ++i) if (maps[i] == map || maps[i].name == map) {
        maps.splice(i, 1);
        return true;
      }
    },
    addOverlay: methodOp(function (spec, options) {
      let mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
      if (mode.startState) throw new Error("Overlays may not be stateful.");
      insertSorted(this.state.overlays, {
        mode: mode,
        modeSpec: spec,
        opaque: options && options.opaque,
        priority: options && options.priority || 0
      }, overlay => overlay.priority);
      this.state.modeGen++;
      regChange(this);
    }),
    removeOverlay: methodOp(function (spec) {
      let overlays = this.state.overlays;

      for (let i = 0; i < overlays.length; ++i) {
        let cur = overlays[i].modeSpec;

        if (cur == spec || typeof spec == "string" && cur.name == spec) {
          overlays.splice(i, 1);
          this.state.modeGen++;
          regChange(this);
          return;
        }
      }
    }),
    indentLine: methodOp(function (n, dir, aggressive) {
      if (typeof dir != "string" && typeof dir != "number") {
        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";else dir = dir ? "add" : "subtract";
      }

      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
    }),
    indentSelection: methodOp(function (how) {
      let ranges = this.doc.sel.ranges,
          end = -1;

      for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];

        if (!range.empty()) {
          let from = range.from(),
              to = range.to();
          let start = Math.max(end, from.line);
          end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;

          for (let j = start; j < end; ++j) indentLine(this, j, how);

          let newRanges = this.doc.sel.ranges;
          if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0) replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
        } else if (range.head.line > end) {
          indentLine(this, range.head.line, how, true);
          end = range.head.line;
          if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
        }
      }
    }),
    // Fetch the parser token for a given character. Useful for hacks
    // that want to inspect the mode state (say, for completion).
    getTokenAt: function (pos, precise) {
      return takeToken(this, pos, precise);
    },
    getLineTokens: function (line, precise) {
      return takeToken(this, Pos(line), precise, true);
    },
    getTokenTypeAt: function (pos) {
      pos = clipPos(this.doc, pos);
      let styles = getLineStyles(this, getLine(this.doc, pos.line));
      let before = 0,
          after = (styles.length - 1) / 2,
          ch = pos.ch;
      let type;
      if (ch == 0) type = styles[2];else for (;;) {
        let mid = before + after >> 1;
        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;else if (styles[mid * 2 + 1] < ch) before = mid + 1;else {
          type = styles[mid * 2 + 2];
          break;
        }
      }
      let cut = type ? type.indexOf("overlay ") : -1;
      return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
    },
    getModeAt: function (pos) {
      let mode = this.doc.mode;
      if (!mode.innerMode) return mode;
      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
    },
    getHelper: function (pos, type) {
      return this.getHelpers(pos, type)[0];
    },
    getHelpers: function (pos, type) {
      let found = [];
      if (!helpers.hasOwnProperty(type)) return found;
      let help = helpers[type],
          mode = this.getModeAt(pos);

      if (typeof mode[type] == "string") {
        if (help[mode[type]]) found.push(help[mode[type]]);
      } else if (mode[type]) {
        for (let i = 0; i < mode[type].length; i++) {
          let val = help[mode[type][i]];
          if (val) found.push(val);
        }
      } else if (mode.helperType && help[mode.helperType]) {
        found.push(help[mode.helperType]);
      } else if (help[mode.name]) {
        found.push(help[mode.name]);
      }

      for (let i = 0; i < help._global.length; i++) {
        let cur = help._global[i];
        if (cur.pred(mode, this) && indexOf(found, cur.val) == -1) found.push(cur.val);
      }

      return found;
    },
    getStateAfter: function (line, precise) {
      let doc = this.doc;
      line = clipLine(doc, line == null ? doc.first + doc.size - 1 : line);
      return getContextBefore(this, line + 1, precise).state;
    },
    cursorCoords: function (start, mode) {
      let pos,
          range = this.doc.sel.primary();
      if (start == null) pos = range.head;else if (typeof start == "object") pos = clipPos(this.doc, start);else pos = start ? range.from() : range.to();
      return cursorCoords(this, pos, mode || "page");
    },
    charCoords: function (pos, mode) {
      return charCoords(this, clipPos(this.doc, pos), mode || "page");
    },
    coordsChar: function (coords, mode) {
      coords = fromCoordSystem(this, coords, mode || "page");
      return coordsChar(this, coords.left, coords.top);
    },
    lineAtHeight: function (height, mode) {
      height = fromCoordSystem(this, {
        top: height,
        left: 0
      }, mode || "page").top;
      return lineAtHeight(this.doc, height + this.display.viewOffset);
    },
    heightAtLine: function (line, mode, includeWidgets) {
      let end = false,
          lineObj;

      if (typeof line == "number") {
        let last = this.doc.first + this.doc.size - 1;
        if (line < this.doc.first) line = this.doc.first;else if (line > last) {
          line = last;
          end = true;
        }
        lineObj = getLine(this.doc, line);
      } else {
        lineObj = line;
      }

      return intoCoordSystem(this, lineObj, {
        top: 0,
        left: 0
      }, mode || "page", includeWidgets || end).top + (end ? this.doc.height - heightAtLine(lineObj) : 0);
    },
    defaultTextHeight: function () {
      return textHeight(this.display);
    },
    defaultCharWidth: function () {
      return charWidth(this.display);
    },
    getViewport: function () {
      return {
        from: this.display.viewFrom,
        to: this.display.viewTo
      };
    },
    addWidget: function (pos, node, scroll, vert, horiz) {
      let display = this.display;
      pos = cursorCoords(this, clipPos(this.doc, pos));
      let top = pos.bottom,
          left = pos.left;
      node.style.position = "absolute";
      node.setAttribute("cm-ignore-events", "true");
      this.display.input.setUneditable(node);
      display.sizer.appendChild(node);

      if (vert == "over") {
        top = pos.top;
      } else if (vert == "above" || vert == "near") {
        let vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
            hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth); // Default to positioning above (if specified and possible); otherwise default to positioning below

        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight) top = pos.top - node.offsetHeight;else if (pos.bottom + node.offsetHeight <= vspace) top = pos.bottom;
        if (left + node.offsetWidth > hspace) left = hspace - node.offsetWidth;
      }

      node.style.top = top + "px";
      node.style.left = node.style.right = "";

      if (horiz == "right") {
        left = display.sizer.clientWidth - node.offsetWidth;
        node.style.right = "0px";
      } else {
        if (horiz == "left") left = 0;else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
        node.style.left = left + "px";
      }

      if (scroll) scrollIntoView(this, {
        left,
        top,
        right: left + node.offsetWidth,
        bottom: top + node.offsetHeight
      });
    },
    triggerOnKeyDown: methodOp(onKeyDown),
    triggerOnKeyPress: methodOp(onKeyPress),
    triggerOnKeyUp: onKeyUp,
    triggerOnMouseDown: methodOp(onMouseDown),
    execCommand: function (cmd) {
      if (commands.hasOwnProperty(cmd)) return commands[cmd].call(null, this);
    },
    triggerElectric: methodOp(function (text) {
      triggerElectric(this, text);
    }),
    findPosH: function (from, amount, unit, visually) {
      let dir = 1;

      if (amount < 0) {
        dir = -1;
        amount = -amount;
      }

      let cur = clipPos(this.doc, from);

      for (let i = 0; i < amount; ++i) {
        cur = findPosH(this.doc, cur, dir, unit, visually);
        if (cur.hitSide) break;
      }

      return cur;
    },
    moveH: methodOp(function (dir, unit) {
      this.extendSelectionsBy(range => {
        if (this.display.shift || this.doc.extend || range.empty()) return findPosH(this.doc, range.head, dir, unit, this.options.rtlMoveVisually);else return dir < 0 ? range.from() : range.to();
      }, sel_move);
    }),
    deleteH: methodOp(function (dir, unit) {
      let sel = this.doc.sel,
          doc = this.doc;
      if (sel.somethingSelected()) doc.replaceSelection("", null, "+delete");else deleteNearSelection(this, range => {
        let other = findPosH(doc, range.head, dir, unit, false);
        return dir < 0 ? {
          from: other,
          to: range.head
        } : {
          from: range.head,
          to: other
        };
      });
    }),
    findPosV: function (from, amount, unit, goalColumn) {
      let dir = 1,
          x = goalColumn;

      if (amount < 0) {
        dir = -1;
        amount = -amount;
      }

      let cur = clipPos(this.doc, from);

      for (let i = 0; i < amount; ++i) {
        let coords = cursorCoords(this, cur, "div");
        if (x == null) x = coords.left;else coords.left = x;
        cur = findPosV(this, coords, dir, unit);
        if (cur.hitSide) break;
      }

      return cur;
    },
    moveV: methodOp(function (dir, unit) {
      let doc = this.doc,
          goals = [];
      let collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
      doc.extendSelectionsBy(range => {
        if (collapse) return dir < 0 ? range.from() : range.to();
        let headPos = cursorCoords(this, range.head, "div");
        if (range.goalColumn != null) headPos.left = range.goalColumn;
        goals.push(headPos.left);
        let pos = findPosV(this, headPos, dir, unit);
        if (unit == "page" && range == doc.sel.primary()) addToScrollTop(this, charCoords(this, pos, "div").top - headPos.top);
        return pos;
      }, sel_move);
      if (goals.length) for (let i = 0; i < doc.sel.ranges.length; i++) doc.sel.ranges[i].goalColumn = goals[i];
    }),
    // Find the word at the given position (as returned by coordsChar).
    findWordAt: function (pos) {
      let doc = this.doc,
          line = getLine(doc, pos.line).text;
      let start = pos.ch,
          end = pos.ch;

      if (line) {
        let helper = this.getHelper(pos, "wordChars");
        if ((pos.sticky == "before" || end == line.length) && start) --start;else ++end;
        let startChar = line.charAt(start);
        let check = isWordChar(startChar, helper) ? ch => isWordChar(ch, helper) : /\s/.test(startChar) ? ch => /\s/.test(ch) : ch => !/\s/.test(ch) && !isWordChar(ch);

        while (start > 0 && check(line.charAt(start - 1))) --start;

        while (end < line.length && check(line.charAt(end))) ++end;
      }

      return new Range(Pos(pos.line, start), Pos(pos.line, end));
    },
    toggleOverwrite: function (value) {
      if (value != null && value == this.state.overwrite) return;
      if (this.state.overwrite = !this.state.overwrite) addClass(this.display.cursorDiv, "CodeMirror-overwrite");else rmClass(this.display.cursorDiv, "CodeMirror-overwrite");
      signal(this, "overwriteToggle", this, this.state.overwrite);
    },
    hasFocus: function () {
      return this.display.input.getField() == activeElt();
    },
    isReadOnly: function () {
      return !!(this.options.readOnly || this.doc.cantEdit);
    },
    scrollTo: methodOp(function (x, y) {
      scrollToCoords(this, x, y);
    }),
    getScrollInfo: function () {
      let scroller = this.display.scroller;
      return {
        left: scroller.scrollLeft,
        top: scroller.scrollTop,
        height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
        width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
        clientHeight: displayHeight(this),
        clientWidth: displayWidth(this)
      };
    },
    scrollIntoView: methodOp(function (range, margin) {
      if (range == null) {
        range = {
          from: this.doc.sel.primary().head,
          to: null
        };
        if (margin == null) margin = this.options.cursorScrollMargin;
      } else if (typeof range == "number") {
        range = {
          from: Pos(range, 0),
          to: null
        };
      } else if (range.from == null) {
        range = {
          from: range,
          to: null
        };
      }

      if (!range.to) range.to = range.from;
      range.margin = margin || 0;

      if (range.from.line != null) {
        scrollToRange(this, range);
      } else {
        scrollToCoordsRange(this, range.from, range.to, range.margin);
      }
    }),
    setSize: methodOp(function (width, height) {
      let interpret = val => typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;

      if (width != null) this.display.wrapper.style.width = interpret(width);
      if (height != null) this.display.wrapper.style.height = interpret(height);
      if (this.options.lineWrapping) clearLineMeasurementCache(this);
      let lineNo = this.display.viewFrom;
      this.doc.iter(lineNo, this.display.viewTo, line => {
        if (line.widgets) for (let i = 0; i < line.widgets.length; i++) if (line.widgets[i].noHScroll) {
          regLineChange(this, lineNo, "widget");
          break;
        }
        ++lineNo;
      });
      this.curOp.forceUpdate = true;
      signal(this, "refresh", this);
    }),
    operation: function (f) {
      return runInOp(this, f);
    },
    startOperation: function () {
      return startOperation(this);
    },
    endOperation: function () {
      return endOperation(this);
    },
    refresh: methodOp(function () {
      let oldHeight = this.display.cachedTextHeight;
      regChange(this);
      this.curOp.forceUpdate = true;
      clearCaches(this);
      scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
      updateGutterSpace(this.display);
      if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5 || this.options.lineWrapping) estimateLineHeights(this);
      signal(this, "refresh", this);
    }),
    swapDoc: methodOp(function (doc) {
      let old = this.doc;
      old.cm = null; // Cancel the current text selection if any (#5821)

      if (this.state.selectingText) this.state.selectingText();
      attachDoc(this, doc);
      clearCaches(this);
      this.display.input.reset();
      scrollToCoords(this, doc.scrollLeft, doc.scrollTop);
      this.curOp.forceScroll = true;
      signalLater(this, "swapDoc", this, old);
      return old;
    }),
    phrase: function (phraseText) {
      let phrases = this.options.phrases;
      return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
    },
    getInputField: function () {
      return this.display.input.getField();
    },
    getWrapperElement: function () {
      return this.display.wrapper;
    },
    getScrollerElement: function () {
      return this.display.scroller;
    },
    getGutterElement: function () {
      return this.display.gutters;
    }
  };
  eventMixin(CodeMirror);

  CodeMirror.registerHelper = function (type, name, value) {
    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {
      _global: []
    };
    helpers[type][name] = value;
  };

  CodeMirror.registerGlobalHelper = function (type, name, predicate, value) {
    CodeMirror.registerHelper(type, name, value);

    helpers[type]._global.push({
      pred: predicate,
      val: value
    });
  };
} // Used for horizontal relative motion. Dir is -1 or 1 (left or
// right), unit can be "codepoint", "char", "column" (like char, but
// doesn't cross line boundaries), "word" (across next word), or
// "group" (to the start of next group of word or
// non-word-non-whitespace chars). The visually param controls
// whether, in right-to-left text, direction 1 means to move towards
// the next index in the string, or towards the character to the right
// of the current position. The resulting position will have a
// hitSide=true property if it reached the end of the document.

function findPosH(doc, pos, dir, unit, visually) {
  let oldPos = pos;
  let origDir = dir;
  let lineObj = getLine(doc, pos.line);
  let lineDir = visually && doc.direction == "rtl" ? -dir : dir;

  function findNextLine() {
    let l = pos.line + lineDir;
    if (l < doc.first || l >= doc.first + doc.size) return false;
    pos = new Pos(l, pos.ch, pos.sticky);
    return lineObj = getLine(doc, l);
  }

  function moveOnce(boundToLine) {
    let next;

    if (unit == "codepoint") {
      let ch = lineObj.text.charCodeAt(pos.ch + (dir > 0 ? 0 : -1));

      if (isNaN(ch)) {
        next = null;
      } else {
        let astral = dir > 0 ? ch >= 0xD800 && ch < 0xDC00 : ch >= 0xDC00 && ch < 0xDFFF;
        next = new Pos(pos.line, Math.max(0, Math.min(lineObj.text.length, pos.ch + dir * (astral ? 2 : 1))), -dir);
      }
    } else if (visually) {
      next = moveVisually(doc.cm, lineObj, pos, dir);
    } else {
      next = moveLogically(lineObj, pos, dir);
    }

    if (next == null) {
      if (!boundToLine && findNextLine()) pos = endOfLine(visually, doc.cm, lineObj, pos.line, lineDir);else return false;
    } else {
      pos = next;
    }

    return true;
  }

  if (unit == "char" || unit == "codepoint") {
    moveOnce();
  } else if (unit == "column") {
    moveOnce(true);
  } else if (unit == "word" || unit == "group") {
    let sawType = null,
        group = unit == "group";
    let helper = doc.cm && doc.cm.getHelper(pos, "wordChars");

    for (let first = true;; first = false) {
      if (dir < 0 && !moveOnce(!first)) break;
      let cur = lineObj.text.charAt(pos.ch) || "\n";
      let type = isWordChar(cur, helper) ? "w" : group && cur == "\n" ? "n" : !group || /\s/.test(cur) ? null : "p";
      if (group && !first && !type) type = "s";

      if (sawType && sawType != type) {
        if (dir < 0) {
          dir = 1;
          moveOnce();
          pos.sticky = "after";
        }

        break;
      }

      if (type) sawType = type;
      if (dir > 0 && !moveOnce(!first)) break;
    }
  }

  let result = skipAtomic(doc, pos, oldPos, origDir, true);
  if (equalCursorPos(oldPos, result)) result.hitSide = true;
  return result;
} // For relative vertical movement. Dir may be -1 or 1. Unit can be
// "page" or "line". The resulting position will have a hitSide=true
// property if it reached the end of the document.


function findPosV(cm, pos, dir, unit) {
  let doc = cm.doc,
      x = pos.left,
      y;

  if (unit == "page") {
    let pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
    let moveAmount = Math.max(pageSize - .5 * textHeight(cm.display), 3);
    y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
  } else if (unit == "line") {
    y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
  }

  let target;

  for (;;) {
    target = coordsChar(cm, x, y);
    if (!target.outside) break;

    if (dir < 0 ? y <= 0 : y >= doc.height) {
      target.hitSide = true;
      break;
    }

    y += dir * 5;
  }

  return target;
}

class ContentEditableInput {
  constructor(cm) {
    this.cm = cm;
    this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
    this.polling = new Delayed();
    this.composing = null;
    this.gracePeriod = false;
    this.readDOMTimeout = null;
  }

  init(display) {
    let input = this,
        cm = input.cm;
    let div = input.div = display.lineDiv;
    div.contentEditable = true;
    disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);

    function belongsToInput(e) {
      for (let t = e.target; t; t = t.parentNode) {
        if (t == div) return true;
        if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) break;
      }

      return false;
    }

    on(div, "paste", e => {
      if (!belongsToInput(e) || signalDOMEvent(cm, e) || handlePaste(e, cm)) return; // IE doesn't fire input events, so we schedule a read for the pasted content in this way

      if (ie_version <= 11) setTimeout(operation(cm, () => this.updateFromDOM()), 20);
    });
    on(div, "compositionstart", e => {
      this.composing = {
        data: e.data,
        done: false
      };
    });
    on(div, "compositionupdate", e => {
      if (!this.composing) this.composing = {
        data: e.data,
        done: false
      };
    });
    on(div, "compositionend", e => {
      if (this.composing) {
        if (e.data != this.composing.data) this.readFromDOMSoon();
        this.composing.done = true;
      }
    });
    on(div, "touchstart", () => input.forceCompositionEnd());
    on(div, "input", () => {
      if (!this.composing) this.readFromDOMSoon();
    });

    function onCopyCut(e) {
      if (!belongsToInput(e) || signalDOMEvent(cm, e)) return;

      if (cm.somethingSelected()) {
        setLastCopied({
          lineWise: false,
          text: cm.getSelections()
        });
        if (e.type == "cut") cm.replaceSelection("", null, "cut");
      } else if (!cm.options.lineWiseCopyCut) {
        return;
      } else {
        let ranges = copyableRanges(cm);
        setLastCopied({
          lineWise: true,
          text: ranges.text
        });

        if (e.type == "cut") {
          cm.operation(() => {
            cm.setSelections(ranges.ranges, 0, sel_dontScroll);
            cm.replaceSelection("", null, "cut");
          });
        }
      }

      if (e.clipboardData) {
        e.clipboardData.clearData();
        let content = lastCopied.text.join("\n"); // iOS exposes the clipboard API, but seems to discard content inserted into it

        e.clipboardData.setData("Text", content);

        if (e.clipboardData.getData("Text") == content) {
          e.preventDefault();
          return;
        }
      } // Old-fashioned briefly-focus-a-textarea hack


      let kludge = hiddenTextarea(),
          te = kludge.firstChild;
      cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
      te.value = lastCopied.text.join("\n");
      let hadFocus = activeElt();
      selectInput(te);
      setTimeout(() => {
        cm.display.lineSpace.removeChild(kludge);
        hadFocus.focus();
        if (hadFocus == div) input.showPrimarySelection();
      }, 50);
    }

    on(div, "copy", onCopyCut);
    on(div, "cut", onCopyCut);
  }

  screenReaderLabelChanged(label) {
    // Label for screenreaders, accessibility
    if (label) {
      this.div.setAttribute('aria-label', label);
    } else {
      this.div.removeAttribute('aria-label');
    }
  }

  prepareSelection() {
    let result = prepareSelection(this.cm, false);
    result.focus = activeElt() == this.div;
    return result;
  }

  showSelection(info, takeFocus) {
    if (!info || !this.cm.display.view.length) return;
    if (info.focus || takeFocus) this.showPrimarySelection();
    this.showMultipleSelections(info);
  }

  getSelection() {
    return this.cm.display.wrapper.ownerDocument.getSelection();
  }

  showPrimarySelection() {
    let sel = this.getSelection(),
        cm = this.cm,
        prim = cm.doc.sel.primary();
    let from = prim.from(),
        to = prim.to();

    if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
      sel.removeAllRanges();
      return;
    }

    let curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
    let curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
    if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && cmp(minPos(curAnchor, curFocus), from) == 0 && cmp(maxPos(curAnchor, curFocus), to) == 0) return;
    let view = cm.display.view;
    let start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || {
      node: view[0].measure.map[2],
      offset: 0
    };
    let end = to.line < cm.display.viewTo && posToDOM(cm, to);

    if (!end) {
      let measure = view[view.length - 1].measure;
      let map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
      end = {
        node: map[map.length - 1],
        offset: map[map.length - 2] - map[map.length - 3]
      };
    }

    if (!start || !end) {
      sel.removeAllRanges();
      return;
    }

    let old = sel.rangeCount && sel.getRangeAt(0),
        rng;

    try {
      rng = range(start.node, start.offset, end.offset, end.node);
    } catch (e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible


    if (rng) {
      if (!gecko && cm.state.focused) {
        sel.collapse(start.node, start.offset);

        if (!rng.collapsed) {
          sel.removeAllRanges();
          sel.addRange(rng);
        }
      } else {
        sel.removeAllRanges();
        sel.addRange(rng);
      }

      if (old && sel.anchorNode == null) sel.addRange(old);else if (gecko) this.startGracePeriod();
    }

    this.rememberSelection();
  }

  startGracePeriod() {
    clearTimeout(this.gracePeriod);
    this.gracePeriod = setTimeout(() => {
      this.gracePeriod = false;
      if (this.selectionChanged()) this.cm.operation(() => this.cm.curOp.selectionChanged = true);
    }, 20);
  }

  showMultipleSelections(info) {
    removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
    removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
  }

  rememberSelection() {
    let sel = this.getSelection();
    this.lastAnchorNode = sel.anchorNode;
    this.lastAnchorOffset = sel.anchorOffset;
    this.lastFocusNode = sel.focusNode;
    this.lastFocusOffset = sel.focusOffset;
  }

  selectionInEditor() {
    let sel = this.getSelection();
    if (!sel.rangeCount) return false;
    let node = sel.getRangeAt(0).commonAncestorContainer;
    return contains(this.div, node);
  }

  focus() {
    if (this.cm.options.readOnly != "nocursor") {
      if (!this.selectionInEditor() || activeElt() != this.div) this.showSelection(this.prepareSelection(), true);
      this.div.focus();
    }
  }

  blur() {
    this.div.blur();
  }

  getField() {
    return this.div;
  }

  supportsTouch() {
    return true;
  }

  receivedFocus() {
    let input = this;
    if (this.selectionInEditor()) this.pollSelection();else runInOp(this.cm, () => input.cm.curOp.selectionChanged = true);

    function poll() {
      if (input.cm.state.focused) {
        input.pollSelection();
        input.polling.set(input.cm.options.pollInterval, poll);
      }
    }

    this.polling.set(this.cm.options.pollInterval, poll);
  }

  selectionChanged() {
    let sel = this.getSelection();
    return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
  }

  pollSelection() {
    if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) return;
    let sel = this.getSelection(),
        cm = this.cm; // On Android Chrome (version 56, at least), backspacing into an
    // uneditable block element will put the cursor in that element,
    // and then, because it's not editable, hide the virtual keyboard.
    // Because Android doesn't allow us to actually detect backspace
    // presses in a sane way, this code checks for when that happens
    // and simulates a backspace press in this case.

    if (android && chrome && this.cm.display.gutterSpecs.length && isInGutter(sel.anchorNode)) {
      this.cm.triggerOnKeyDown({
        type: "keydown",
        keyCode: 8,
        preventDefault: Math.abs
      });
      this.blur();
      this.focus();
      return;
    }

    if (this.composing) return;
    this.rememberSelection();
    let anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
    let head = domToPos(cm, sel.focusNode, sel.focusOffset);
    if (anchor && head) runInOp(cm, () => {
      setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
      if (anchor.bad || head.bad) cm.curOp.selectionChanged = true;
    });
  }

  pollContent() {
    if (this.readDOMTimeout != null) {
      clearTimeout(this.readDOMTimeout);
      this.readDOMTimeout = null;
    }

    let cm = this.cm,
        display = cm.display,
        sel = cm.doc.sel.primary();
    let from = sel.from(),
        to = sel.to();
    if (from.ch == 0 && from.line > cm.firstLine()) from = Pos(from.line - 1, getLine(cm.doc, from.line - 1).length);
    if (to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine()) to = Pos(to.line + 1, 0);
    if (from.line < display.viewFrom || to.line > display.viewTo - 1) return false;
    let fromIndex, fromLine, fromNode;

    if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
      fromLine = lineNo(display.view[0].line);
      fromNode = display.view[0].node;
    } else {
      fromLine = lineNo(display.view[fromIndex].line);
      fromNode = display.view[fromIndex - 1].node.nextSibling;
    }

    let toIndex = findViewIndex(cm, to.line);
    let toLine, toNode;

    if (toIndex == display.view.length - 1) {
      toLine = display.viewTo - 1;
      toNode = display.lineDiv.lastChild;
    } else {
      toLine = lineNo(display.view[toIndex + 1].line) - 1;
      toNode = display.view[toIndex + 1].node.previousSibling;
    }

    if (!fromNode) return false;
    let newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
    let oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));

    while (newText.length > 1 && oldText.length > 1) {
      if (lst(newText) == lst(oldText)) {
        newText.pop();
        oldText.pop();
        toLine--;
      } else if (newText[0] == oldText[0]) {
        newText.shift();
        oldText.shift();
        fromLine++;
      } else break;
    }

    let cutFront = 0,
        cutEnd = 0;
    let newTop = newText[0],
        oldTop = oldText[0],
        maxCutFront = Math.min(newTop.length, oldTop.length);

    while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront)) ++cutFront;

    let newBot = lst(newText),
        oldBot = lst(oldText);
    let maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0), oldBot.length - (oldText.length == 1 ? cutFront : 0));

    while (cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) ++cutEnd; // Try to move start of change to start of selection if ambiguous


    if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) {
      while (cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
        cutFront--;
        cutEnd++;
      }
    }

    newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, "");
    newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
    let chFrom = Pos(fromLine, cutFront);
    let chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);

    if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
      replaceRange(cm.doc, newText, chFrom, chTo, "+input");
      return true;
    }
  }

  ensurePolled() {
    this.forceCompositionEnd();
  }

  reset() {
    this.forceCompositionEnd();
  }

  forceCompositionEnd() {
    if (!this.composing) return;
    clearTimeout(this.readDOMTimeout);
    this.composing = null;
    this.updateFromDOM();
    this.div.blur();
    this.div.focus();
  }

  readFromDOMSoon() {
    if (this.readDOMTimeout != null) return;
    this.readDOMTimeout = setTimeout(() => {
      this.readDOMTimeout = null;

      if (this.composing) {
        if (this.composing.done) this.composing = null;else return;
      }

      this.updateFromDOM();
    }, 80);
  }

  updateFromDOM() {
    if (this.cm.isReadOnly() || !this.pollContent()) runInOp(this.cm, () => regChange(this.cm));
  }

  setUneditable(node) {
    node.contentEditable = "false";
  }

  onKeyPress(e) {
    if (e.charCode == 0 || this.composing) return;
    e.preventDefault();
    if (!this.cm.isReadOnly()) operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
  }

  readOnlyChanged(val) {
    this.div.contentEditable = String(val != "nocursor");
  }

  onContextMenu() {}

  resetPosition() {}

}
ContentEditableInput.prototype.needsContentAttribute = true;

function posToDOM(cm, pos) {
  let view = findViewForLine(cm, pos.line);
  if (!view || view.hidden) return null;
  let line = getLine(cm.doc, pos.line);
  let info = mapFromLineView(view, line, pos.line);
  let order = getOrder(line, cm.doc.direction),
      side = "left";

  if (order) {
    let partPos = getBidiPartAt(order, pos.ch);
    side = partPos % 2 ? "right" : "left";
  }

  let result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
  result.offset = result.collapse == "right" ? result.end : result.start;
  return result;
}

function isInGutter(node) {
  for (let scan = node; scan; scan = scan.parentNode) if (/CodeMirror-gutter-wrapper/.test(scan.className)) return true;

  return false;
}

function badPos(pos, bad) {
  if (bad) pos.bad = true;
  return pos;
}

function domTextBetween(cm, from, to, fromLine, toLine) {
  let text = "",
      closing = false,
      lineSep = cm.doc.lineSeparator(),
      extraLinebreak = false;

  function recognizeMarker(id) {
    return marker => marker.id == id;
  }

  function close() {
    if (closing) {
      text += lineSep;
      if (extraLinebreak) text += lineSep;
      closing = extraLinebreak = false;
    }
  }

  function addText(str) {
    if (str) {
      close();
      text += str;
    }
  }

  function walk(node) {
    if (node.nodeType == 1) {
      let cmText = node.getAttribute("cm-text");

      if (cmText) {
        addText(cmText);
        return;
      }

      let markerID = node.getAttribute("cm-marker"),
          range;

      if (markerID) {
        let found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
        if (found.length && (range = found[0].find(0))) addText(getBetween(cm.doc, range.from, range.to).join(lineSep));
        return;
      }

      if (node.getAttribute("contenteditable") == "false") return;
      let isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
      if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) return;
      if (isBlock) close();

      for (let i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]);

      if (/^(pre|p)$/i.test(node.nodeName)) extraLinebreak = true;
      if (isBlock) closing = true;
    } else if (node.nodeType == 3) {
      addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
    }
  }

  for (;;) {
    walk(from);
    if (from == to) break;
    from = from.nextSibling;
    extraLinebreak = false;
  }

  return text;
}

function domToPos(cm, node, offset) {
  let lineNode;

  if (node == cm.display.lineDiv) {
    lineNode = cm.display.lineDiv.childNodes[offset];
    if (!lineNode) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
    node = null;
    offset = 0;
  } else {
    for (lineNode = node;; lineNode = lineNode.parentNode) {
      if (!lineNode || lineNode == cm.display.lineDiv) return null;
      if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
    }
  }

  for (let i = 0; i < cm.display.view.length; i++) {
    let lineView = cm.display.view[i];
    if (lineView.node == lineNode) return locateNodeInLineView(lineView, node, offset);
  }
}

function locateNodeInLineView(lineView, node, offset) {
  let wrapper = lineView.text.firstChild,
      bad = false;
  if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), true);

  if (node == wrapper) {
    bad = true;
    node = wrapper.childNodes[offset];
    offset = 0;

    if (!node) {
      let line = lineView.rest ? lst(lineView.rest) : lineView.line;
      return badPos(Pos(lineNo(line), line.text.length), bad);
    }
  }

  let textNode = node.nodeType == 3 ? node : null,
      topNode = node;

  if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
    textNode = node.firstChild;
    if (offset) offset = textNode.nodeValue.length;
  }

  while (topNode.parentNode != wrapper) topNode = topNode.parentNode;

  let measure = lineView.measure,
      maps = measure.maps;

  function find(textNode, topNode, offset) {
    for (let i = -1; i < (maps ? maps.length : 0); i++) {
      let map = i < 0 ? measure.map : maps[i];

      for (let j = 0; j < map.length; j += 3) {
        let curNode = map[j + 2];

        if (curNode == textNode || curNode == topNode) {
          let line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
          let ch = map[j] + offset;
          if (offset < 0 || curNode != textNode) ch = map[j + (offset ? 1 : 0)];
          return Pos(line, ch);
        }
      }
    }
  }

  let found = find(textNode, topNode, offset);
  if (found) return badPos(found, bad); // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems

  for (let after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
    found = find(after, after.firstChild, 0);
    if (found) return badPos(Pos(found.line, found.ch - dist), bad);else dist += after.textContent.length;
  }

  for (let before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
    found = find(before, before.firstChild, -1);
    if (found) return badPos(Pos(found.line, found.ch + dist), bad);else dist += before.textContent.length;
  }
}

class TextareaInput {
  constructor(cm) {
    this.cm = cm; // See input.poll and input.reset

    this.prevInput = ""; // Flag that indicates whether we expect input to appear real soon
    // now (after some event like 'keypress' or 'input') and are
    // polling intensively.

    this.pollingFast = false; // Self-resetting timeout for the poller

    this.polling = new Delayed(); // Used to work around IE issue with selection being forgotten when focus moves away from textarea

    this.hasSelection = false;
    this.composing = null;
  }

  init(display) {
    let input = this,
        cm = this.cm;
    this.createField(display);
    const te = this.textarea;
    display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild); // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)

    if (ios) te.style.width = "0px";
    on(te, "input", () => {
      if (ie && ie_version >= 9 && this.hasSelection) this.hasSelection = null;
      input.poll();
    });
    on(te, "paste", e => {
      if (signalDOMEvent(cm, e) || handlePaste(e, cm)) return;
      cm.state.pasteIncoming = +new Date();
      input.fastPoll();
    });

    function prepareCopyCut(e) {
      if (signalDOMEvent(cm, e)) return;

      if (cm.somethingSelected()) {
        setLastCopied({
          lineWise: false,
          text: cm.getSelections()
        });
      } else if (!cm.options.lineWiseCopyCut) {
        return;
      } else {
        let ranges = copyableRanges(cm);
        setLastCopied({
          lineWise: true,
          text: ranges.text
        });

        if (e.type == "cut") {
          cm.setSelections(ranges.ranges, null, sel_dontScroll);
        } else {
          input.prevInput = "";
          te.value = ranges.text.join("\n");
          selectInput(te);
        }
      }

      if (e.type == "cut") cm.state.cutIncoming = +new Date();
    }

    on(te, "cut", prepareCopyCut);
    on(te, "copy", prepareCopyCut);
    on(display.scroller, "paste", e => {
      if (eventInWidget(display, e) || signalDOMEvent(cm, e)) return;

      if (!te.dispatchEvent) {
        cm.state.pasteIncoming = +new Date();
        input.focus();
        return;
      } // Pass the `paste` event to the textarea so it's handled by its event listener.


      const event = new Event("paste");
      event.clipboardData = e.clipboardData;
      te.dispatchEvent(event);
    }); // Prevent normal selection in the editor (we handle our own)

    on(display.lineSpace, "selectstart", e => {
      if (!eventInWidget(display, e)) e_preventDefault(e);
    });
    on(te, "compositionstart", () => {
      let start = cm.getCursor("from");
      if (input.composing) input.composing.range.clear();
      input.composing = {
        start: start,
        range: cm.markText(start, cm.getCursor("to"), {
          className: "CodeMirror-composing"
        })
      };
    });
    on(te, "compositionend", () => {
      if (input.composing) {
        input.poll();
        input.composing.range.clear();
        input.composing = null;
      }
    });
  }

  createField(_display) {
    // Wraps and hides input textarea
    this.wrapper = hiddenTextarea(); // The semihidden textarea that is focused when the editor is
    // focused, and receives input.

    this.textarea = this.wrapper.firstChild;
  }

  screenReaderLabelChanged(label) {
    // Label for screenreaders, accessibility
    if (label) {
      this.textarea.setAttribute('aria-label', label);
    } else {
      this.textarea.removeAttribute('aria-label');
    }
  }

  prepareSelection() {
    // Redraw the selection and/or cursor
    let cm = this.cm,
        display = cm.display,
        doc = cm.doc;
    let result = prepareSelection(cm); // Move the hidden textarea near the cursor to prevent scrolling artifacts

    if (cm.options.moveInputWithCursor) {
      let headPos = cursorCoords(cm, doc.sel.primary().head, "div");
      let wrapOff = display.wrapper.getBoundingClientRect(),
          lineOff = display.lineDiv.getBoundingClientRect();
      result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top));
      result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
    }

    return result;
  }

  showSelection(drawn) {
    let cm = this.cm,
        display = cm.display;
    removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
    removeChildrenAndAdd(display.selectionDiv, drawn.selection);

    if (drawn.teTop != null) {
      this.wrapper.style.top = drawn.teTop + "px";
      this.wrapper.style.left = drawn.teLeft + "px";
    }
  } // Reset the input to correspond to the selection (or to be empty,
  // when not typing and nothing is selected)


  reset(typing) {
    if (this.contextMenuPending || this.composing) return;
    let cm = this.cm;

    if (cm.somethingSelected()) {
      this.prevInput = "";
      let content = cm.getSelection();
      this.textarea.value = content;
      if (cm.state.focused) selectInput(this.textarea);
      if (ie && ie_version >= 9) this.hasSelection = content;
    } else if (!typing) {
      this.prevInput = this.textarea.value = "";
      if (ie && ie_version >= 9) this.hasSelection = null;
    }
  }

  getField() {
    return this.textarea;
  }

  supportsTouch() {
    return false;
  }

  focus() {
    if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
      try {
        this.textarea.focus();
      } catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM

    }
  }

  blur() {
    this.textarea.blur();
  }

  resetPosition() {
    this.wrapper.style.top = this.wrapper.style.left = 0;
  }

  receivedFocus() {
    this.slowPoll();
  } // Poll for input changes, using the normal rate of polling. This
  // runs as long as the editor is focused.


  slowPoll() {
    if (this.pollingFast) return;
    this.polling.set(this.cm.options.pollInterval, () => {
      this.poll();
      if (this.cm.state.focused) this.slowPoll();
    });
  } // When an event has just come in that is likely to add or change
  // something in the input textarea, we poll faster, to ensure that
  // the change appears on the screen quickly.


  fastPoll() {
    let missed = false,
        input = this;
    input.pollingFast = true;

    function p() {
      let changed = input.poll();

      if (!changed && !missed) {
        missed = true;
        input.polling.set(60, p);
      } else {
        input.pollingFast = false;
        input.slowPoll();
      }
    }

    input.polling.set(20, p);
  } // Read input from the textarea, and update the document to match.
  // When something is selected, it is present in the textarea, and
  // selected (unless it is huge, in which case a placeholder is
  // used). When nothing is selected, the cursor sits after previously
  // seen text (can be empty), which is stored in prevInput (we must
  // not reset the textarea when typing, because that breaks IME).


  poll() {
    let cm = this.cm,
        input = this.textarea,
        prevInput = this.prevInput; // Since this is called a *lot*, try to bail out as cheaply as
    // possible when it is clear that nothing happened. hasSelection
    // will be the case when there is a lot of text in the textarea,
    // in which case reading its value would be expensive.

    if (this.contextMenuPending || !cm.state.focused || hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq) return false;
    let text = input.value; // If nothing changed, bail.

    if (text == prevInput && !cm.somethingSelected()) return false; // Work around nonsensical selection resetting in IE9/10, and
    // inexplicable appearance of private area unicode characters on
    // some key combos in Mac (#2689).

    if (ie && ie_version >= 9 && this.hasSelection === text || mac && /[\uf700-\uf7ff]/.test(text)) {
      cm.display.input.reset();
      return false;
    }

    if (cm.doc.sel == cm.display.selForContextMenu) {
      let first = text.charCodeAt(0);
      if (first == 0x200b && !prevInput) prevInput = "\u200b";

      if (first == 0x21da) {
        this.reset();
        return this.cm.execCommand("undo");
      }
    } // Find the part of the input that is actually new


    let same = 0,
        l = Math.min(prevInput.length, text.length);

    while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;

    runInOp(cm, () => {
      applyTextInput(cm, text.slice(same), prevInput.length - same, null, this.composing ? "*compose" : null); // Don't leave long text in the textarea, since it makes further polling slow

      if (text.length > 1000 || text.indexOf("\n") > -1) input.value = this.prevInput = "";else this.prevInput = text;

      if (this.composing) {
        this.composing.range.clear();
        this.composing.range = cm.markText(this.composing.start, cm.getCursor("to"), {
          className: "CodeMirror-composing"
        });
      }
    });
    return true;
  }

  ensurePolled() {
    if (this.pollingFast && this.poll()) this.pollingFast = false;
  }

  onKeyPress() {
    if (ie && ie_version >= 9) this.hasSelection = null;
    this.fastPoll();
  }

  onContextMenu(e) {
    let input = this,
        cm = input.cm,
        display = cm.display,
        te = input.textarea;
    if (input.contextMenuPending) input.contextMenuPending();
    let pos = posFromMouse(cm, e),
        scrollPos = display.scroller.scrollTop;
    if (!pos || presto) return; // Opera is difficult.
    // Reset the current text selection only if the click is done outside of the selection
    // and 'resetSelectionOnContextMenu' option is true.

    let reset = cm.options.resetSelectionOnContextMenu;
    if (reset && cm.doc.sel.contains(pos) == -1) operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);
    let oldCSS = te.style.cssText,
        oldWrapperCSS = input.wrapper.style.cssText;
    let wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
    input.wrapper.style.cssText = "position: static";
    te.style.cssText = `position: absolute; width: 30px; height: 30px;
      top: ${e.clientY - wrapperBox.top - 5}px; left: ${e.clientX - wrapperBox.left - 5}px;
      z-index: 1000; background: ${ie ? "rgba(255, 255, 255, .05)" : "transparent"};
      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);`;
    let oldScrollY;
    if (webkit) oldScrollY = window.scrollY; // Work around Chrome issue (#2712)

    display.input.focus();
    if (webkit) window.scrollTo(null, oldScrollY);
    display.input.reset(); // Adds "Select all" to context menu in FF

    if (!cm.somethingSelected()) te.value = input.prevInput = " ";
    input.contextMenuPending = rehide;
    display.selForContextMenu = cm.doc.sel;
    clearTimeout(display.detectingSelectAll); // Select-all will be greyed out if there's nothing to select, so
    // this adds a zero-width space so that we can later check whether
    // it got selected.

    function prepareSelectAllHack() {
      if (te.selectionStart != null) {
        let selected = cm.somethingSelected();
        let extval = "\u200b" + (selected ? te.value : "");
        te.value = "\u21da"; // Used to catch context-menu undo

        te.value = extval;
        input.prevInput = selected ? "" : "\u200b";
        te.selectionStart = 1;
        te.selectionEnd = extval.length; // Re-set this, in case some other handler touched the
        // selection in the meantime.

        display.selForContextMenu = cm.doc.sel;
      }
    }

    function rehide() {
      if (input.contextMenuPending != rehide) return;
      input.contextMenuPending = false;
      input.wrapper.style.cssText = oldWrapperCSS;
      te.style.cssText = oldCSS;
      if (ie && ie_version < 9) display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos); // Try to detect the user choosing select-all

      if (te.selectionStart != null) {
        if (!ie || ie && ie_version < 9) prepareSelectAllHack();

        let i = 0,
            poll = () => {
          if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && input.prevInput == "\u200b") {
            operation(cm, selectAll)(cm);
          } else if (i++ < 10) {
            display.detectingSelectAll = setTimeout(poll, 500);
          } else {
            display.selForContextMenu = null;
            display.input.reset();
          }
        };

        display.detectingSelectAll = setTimeout(poll, 200);
      }
    }

    if (ie && ie_version >= 9) prepareSelectAllHack();

    if (captureRightClick) {
      e_stop(e);

      let mouseup = () => {
        off(window, "mouseup", mouseup);
        setTimeout(rehide, 20);
      };

      on(window, "mouseup", mouseup);
    } else {
      setTimeout(rehide, 50);
    }
  }

  readOnlyChanged(val) {
    if (!val) this.reset();
    this.textarea.disabled = val == "nocursor";
    this.textarea.readOnly = !!val;
  }

  setUneditable() {}

}
TextareaInput.prototype.needsContentAttribute = false;

function fromTextArea(textarea, options) {
  options = options ? copyObj(options) : {};
  options.value = textarea.value;
  if (!options.tabindex && textarea.tabIndex) options.tabindex = textarea.tabIndex;
  if (!options.placeholder && textarea.placeholder) options.placeholder = textarea.placeholder; // Set autofocus to true if this textarea is focused, or if it has
  // autofocus and no other element is focused.

  if (options.autofocus == null) {
    let hasFocus = activeElt();
    options.autofocus = hasFocus == textarea || textarea.getAttribute("autofocus") != null && hasFocus == document.body;
  }

  function save() {
    textarea.value = cm.getValue();
  }

  let realSubmit;

  if (textarea.form) {
    on(textarea.form, "submit", save); // Deplorable hack to make the submit method do the right thing.

    if (!options.leaveSubmitMethodAlone) {
      let form = textarea.form;
      realSubmit = form.submit;

      try {
        let wrappedSubmit = form.submit = () => {
          save();
          form.submit = realSubmit;
          form.submit();
          form.submit = wrappedSubmit;
        };
      } catch (e) {}
    }
  }

  options.finishInit = cm => {
    cm.save = save;

    cm.getTextArea = () => textarea;

    cm.toTextArea = () => {
      cm.toTextArea = isNaN; // Prevent this from being ran twice

      save();
      textarea.parentNode.removeChild(cm.getWrapperElement());
      textarea.style.display = "";

      if (textarea.form) {
        off(textarea.form, "submit", save);
        if (!options.leaveSubmitMethodAlone && typeof textarea.form.submit == "function") textarea.form.submit = realSubmit;
      }
    };
  };

  textarea.style.display = "none";
  let cm = CodeMirror(node => textarea.parentNode.insertBefore(node, textarea.nextSibling), options);
  return cm;
}

function addLegacyProps(CodeMirror) {
  CodeMirror.off = off;
  CodeMirror.on = on;
  CodeMirror.wheelEventPixels = wheelEventPixels;
  CodeMirror.Doc = Doc;
  CodeMirror.splitLines = splitLinesAuto;
  CodeMirror.countColumn = countColumn;
  CodeMirror.findColumn = findColumn;
  CodeMirror.isWordChar = isWordCharBasic;
  CodeMirror.Pass = Pass;
  CodeMirror.signal = signal;
  CodeMirror.Line = Line;
  CodeMirror.changeEnd = changeEnd;
  CodeMirror.scrollbarModel = scrollbarModel;
  CodeMirror.Pos = Pos;
  CodeMirror.cmpPos = cmp;
  CodeMirror.modes = modes;
  CodeMirror.mimeModes = mimeModes;
  CodeMirror.resolveMode = resolveMode;
  CodeMirror.getMode = getMode;
  CodeMirror.modeExtensions = modeExtensions;
  CodeMirror.extendMode = extendMode;
  CodeMirror.copyState = copyState;
  CodeMirror.startState = startState;
  CodeMirror.innerMode = innerMode;
  CodeMirror.commands = commands;
  CodeMirror.keyMap = keyMap;
  CodeMirror.keyName = keyName;
  CodeMirror.isModifierKey = isModifierKey;
  CodeMirror.lookupKey = lookupKey;
  CodeMirror.normalizeKeyMap = normalizeKeyMap;
  CodeMirror.StringStream = StringStream;
  CodeMirror.SharedTextMarker = SharedTextMarker;
  CodeMirror.TextMarker = TextMarker;
  CodeMirror.LineWidget = LineWidget;
  CodeMirror.e_preventDefault = e_preventDefault;
  CodeMirror.e_stopPropagation = e_stopPropagation;
  CodeMirror.e_stop = e_stop;
  CodeMirror.addClass = addClass;
  CodeMirror.contains = contains;
  CodeMirror.rmClass = rmClass;
  CodeMirror.keyNames = keyNames;
}

// EDITOR CONSTRUCTOR
defineOptions(CodeMirror);
addEditorMethods(CodeMirror);

let dontDelegate = "iter insert remove copy getEditor constructor".split(" ");

for (let prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0) CodeMirror.prototype[prop] = function (method) {
  return function () {
    return method.apply(this.doc, arguments);
  };
}(Doc.prototype[prop]);

eventMixin(Doc); // INPUT HANDLING
CodeMirror.inputStyles = {
  "textarea": TextareaInput,
  "contenteditable": ContentEditableInput
}; // MODE DEFINITION AND QUERYING
// used by (legacy) mechanisms like loadmode.js to automatically
// load a mode. (Preferred mechanism is the require/define calls.)

CodeMirror.defineMode = function (name
/*, mode, …*/
) {
  if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
  defineMode.apply(this, arguments);
};

CodeMirror.defineMIME = defineMIME; // Minimal default mode.

CodeMirror.defineMode("null", () => ({
  token: stream => stream.skipToEnd()
}));
CodeMirror.defineMIME("text/plain", "null"); // EXTENSIONS

CodeMirror.defineExtension = (name, func) => {
  CodeMirror.prototype[name] = func;
};

CodeMirror.defineDocExtension = (name, func) => {
  Doc.prototype[name] = func;
};
CodeMirror.fromTextArea = fromTextArea;
addLegacyProps(CodeMirror);
CodeMirror.version = "5.62.2";

function xquery(CodeMirror) {
  CodeMirror.defineMode("xquery", function () {
    // The keywords object is set to the result of this self executing
    // function. Each keyword is a property of the keywords object whose
    // value is {type: atype, style: astyle}
    var keywords = function () {
      // convenience functions used to build keywords object
      function kw(type) {
        return {
          type: type,
          style: "keyword"
        };
      }

      var operator = kw("operator"),
          atom = {
        type: "atom",
        style: "atom"
      },
          punctuation = {
        type: "punctuation",
        style: null
      },
          qualifier = {
        type: "axis_specifier",
        style: "qualifier"
      }; // kwObj is what is return from this function at the end

      var kwObj = {
        ',': punctuation
      }; // a list of 'basic' keywords. For each add a property to kwObj with the value of
      // {type: basic[i], style: "keyword"} e.g. 'after' --> {type: "after", style: "keyword"}

      var basic = ['after', 'all', 'allowing', 'ancestor', 'ancestor-or-self', 'any', 'array', 'as', 'ascending', 'at', 'attribute', 'base-uri', 'before', 'boundary-space', 'by', 'case', 'cast', 'castable', 'catch', 'child', 'collation', 'comment', 'construction', 'contains', 'content', 'context', 'copy', 'copy-namespaces', 'count', 'decimal-format', 'declare', 'default', 'delete', 'descendant', 'descendant-or-self', 'descending', 'diacritics', 'different', 'distance', 'document', 'document-node', 'element', 'else', 'empty', 'empty-sequence', 'encoding', 'end', 'entire', 'every', 'exactly', 'except', 'external', 'first', 'following', 'following-sibling', 'for', 'from', 'ftand', 'ftnot', 'ft-option', 'ftor', 'function', 'fuzzy', 'greatest', 'group', 'if', 'import', 'in', 'inherit', 'insensitive', 'insert', 'instance', 'intersect', 'into', 'invoke', 'is', 'item', 'language', 'last', 'lax', 'least', 'let', 'levels', 'lowercase', 'map', 'modify', 'module', 'most', 'namespace', 'next', 'no', 'node', 'nodes', 'no-inherit', 'no-preserve', 'not', 'occurs', 'of', 'only', 'option', 'order', 'ordered', 'ordering', 'paragraph', 'paragraphs', 'parent', 'phrase', 'preceding', 'preceding-sibling', 'preserve', 'previous', 'processing-instruction', 'relationship', 'rename', 'replace', 'return', 'revalidation', 'same', 'satisfies', 'schema', 'schema-attribute', 'schema-element', 'score', 'self', 'sensitive', 'sentence', 'sentences', 'sequence', 'skip', 'sliding', 'some', 'stable', 'start', 'stemming', 'stop', 'strict', 'strip', 'switch', 'text', 'then', 'thesaurus', 'times', 'to', 'transform', 'treat', 'try', 'tumbling', 'type', 'typeswitch', 'union', 'unordered', 'update', 'updating', 'uppercase', 'using', 'validate', 'value', 'variable', 'version', 'weight', 'when', 'where', 'wildcards', 'window', 'with', 'without', 'word', 'words', 'xquery'];

      for (var i = 0, l = basic.length; i < l; i++) {
        kwObj[basic[i]] = kw(basic[i]);
      } // a list of types. For each add a property to kwObj with the value of
      // {type: "atom", style: "atom"}


      var types = ['xs:anyAtomicType', 'xs:anySimpleType', 'xs:anyType', 'xs:anyURI', 'xs:base64Binary', 'xs:boolean', 'xs:byte', 'xs:date', 'xs:dateTime', 'xs:dateTimeStamp', 'xs:dayTimeDuration', 'xs:decimal', 'xs:double', 'xs:duration', 'xs:ENTITIES', 'xs:ENTITY', 'xs:float', 'xs:gDay', 'xs:gMonth', 'xs:gMonthDay', 'xs:gYear', 'xs:gYearMonth', 'xs:hexBinary', 'xs:ID', 'xs:IDREF', 'xs:IDREFS', 'xs:int', 'xs:integer', 'xs:item', 'xs:java', 'xs:language', 'xs:long', 'xs:Name', 'xs:NCName', 'xs:negativeInteger', 'xs:NMTOKEN', 'xs:NMTOKENS', 'xs:nonNegativeInteger', 'xs:nonPositiveInteger', 'xs:normalizedString', 'xs:NOTATION', 'xs:numeric', 'xs:positiveInteger', 'xs:precisionDecimal', 'xs:QName', 'xs:short', 'xs:string', 'xs:time', 'xs:token', 'xs:unsignedByte', 'xs:unsignedInt', 'xs:unsignedLong', 'xs:unsignedShort', 'xs:untyped', 'xs:untypedAtomic', 'xs:yearMonthDuration'];

      for (var i = 0, l = types.length; i < l; i++) {
        kwObj[types[i]] = atom;
      } // each operator will add a property to kwObj with value of {type: "operator", style: "keyword"}


      var operators = ['eq', 'ne', 'lt', 'le', 'gt', 'ge', ':=', '=', '>', '>=', '<', '<=', '.', '|', '?', 'and', 'or', 'div', 'idiv', 'mod', '*', '/', '+', '-'];

      for (var i = 0, l = operators.length; i < l; i++) {
        kwObj[operators[i]] = operator;
      } // each axis_specifiers will add a property to kwObj with value of {type: "axis_specifier", style: "qualifier"}


      var axis_specifiers = ["self::", "attribute::", "child::", "descendant::", "descendant-or-self::", "parent::", "ancestor::", "ancestor-or-self::", "following::", "preceding::", "following-sibling::", "preceding-sibling::"];

      for (var i = 0, l = axis_specifiers.length; i < l; i++) {
        kwObj[axis_specifiers[i]] = qualifier;
      }

      return kwObj;
    }();

    function chain(stream, state, f) {
      state.tokenize = f;
      return f(stream, state);
    } // the primary mode tokenizer


    function tokenBase(stream, state) {
      var ch = stream.next(),
          mightBeFunction = false,
          isEQName = isEQNameAhead(stream); // an XML tag (if not in some sub, chained tokenizer)

      if (ch == "<") {
        if (stream.match("!--", true)) return chain(stream, state, tokenXMLComment);

        if (stream.match("![CDATA", false)) {
          state.tokenize = tokenCDATA;
          return "tag";
        }

        if (stream.match("?", false)) {
          return chain(stream, state, tokenPreProcessing);
        }

        var isclose = stream.eat("/");
        stream.eatSpace();
        var tagName = "",
            c;

        while (c = stream.eat(/[^\s\u00a0=<>\"\'\/?]/)) tagName += c;

        return chain(stream, state, tokenTag(tagName, isclose));
      } // start code block
      else if (ch == "{") {
        pushStateStack(state, {
          type: "codeblock"
        });
        return null;
      } // end code block
      else if (ch == "}") {
        popStateStack(state);
        return null;
      } // if we're in an XML block
      else if (isInXmlBlock(state)) {
        if (ch == ">") return "tag";else if (ch == "/" && stream.eat(">")) {
          popStateStack(state);
          return "tag";
        } else return "variable";
      } // if a number
      else if (/\d/.test(ch)) {
        stream.match(/^\d*(?:\.\d*)?(?:E[+\-]?\d+)?/);
        return "atom";
      } // comment start
      else if (ch === "(" && stream.eat(":")) {
        pushStateStack(state, {
          type: "comment"
        });
        return chain(stream, state, tokenComment);
      } // quoted string
      else if (!isEQName && (ch === '"' || ch === "'")) return chain(stream, state, tokenString(ch)); // variable
      else if (ch === "$") {
        return chain(stream, state, tokenVariable);
      } // assignment
      else if (ch === ":" && stream.eat("=")) {
        return "keyword";
      } // open paren
      else if (ch === "(") {
        pushStateStack(state, {
          type: "paren"
        });
        return null;
      } // close paren
      else if (ch === ")") {
        popStateStack(state);
        return null;
      } // open paren
      else if (ch === "[") {
        pushStateStack(state, {
          type: "bracket"
        });
        return null;
      } // close paren
      else if (ch === "]") {
        popStateStack(state);
        return null;
      } else {
        var known = keywords.propertyIsEnumerable(ch) && keywords[ch]; // if there's a EQName ahead, consume the rest of the string portion, it's likely a function

        if (isEQName && ch === '\"') while (stream.next() !== '"') {}
        if (isEQName && ch === '\'') while (stream.next() !== '\'') {} // gobble up a word if the character is not known

        if (!known) stream.eatWhile(/[\w\$_-]/); // gobble a colon in the case that is a lib func type call fn:doc

        var foundColon = stream.eat(":"); // if there's not a second colon, gobble another word. Otherwise, it's probably an axis specifier
        // which should get matched as a keyword

        if (!stream.eat(":") && foundColon) {
          stream.eatWhile(/[\w\$_-]/);
        } // if the next non whitespace character is an open paren, this is probably a function (if not a keyword of other sort)


        if (stream.match(/^[ \t]*\(/, false)) {
          mightBeFunction = true;
        } // is the word a keyword?


        var word = stream.current();
        known = keywords.propertyIsEnumerable(word) && keywords[word]; // if we think it's a function call but not yet known,
        // set style to variable for now for lack of something better

        if (mightBeFunction && !known) known = {
          type: "function_call",
          style: "variable def"
        }; // if the previous word was element, attribute, axis specifier, this word should be the name of that

        if (isInXmlConstructor(state)) {
          popStateStack(state);
          return "variable";
        } // as previously checked, if the word is element,attribute, axis specifier, call it an "xmlconstructor" and
        // push the stack so we know to look for it on the next word


        if (word == "element" || word == "attribute" || known.type == "axis_specifier") pushStateStack(state, {
          type: "xmlconstructor"
        }); // if the word is known, return the details of that else just call this a generic 'word'

        return known ? known.style : "variable";
      }
    } // handle comments, including nested


    function tokenComment(stream, state) {
      var maybeEnd = false,
          maybeNested = false,
          nestedCount = 0,
          ch;

      while (ch = stream.next()) {
        if (ch == ")" && maybeEnd) {
          if (nestedCount > 0) nestedCount--;else {
            popStateStack(state);
            break;
          }
        } else if (ch == ":" && maybeNested) {
          nestedCount++;
        }

        maybeEnd = ch == ":";
        maybeNested = ch == "(";
      }

      return "comment";
    } // tokenizer for string literals
    // optionally pass a tokenizer function to set state.tokenize back to when finished


    function tokenString(quote, f) {
      return function (stream, state) {
        var ch;

        if (isInString(state) && stream.current() == quote) {
          popStateStack(state);
          if (f) state.tokenize = f;
          return "string";
        }

        pushStateStack(state, {
          type: "string",
          name: quote,
          tokenize: tokenString(quote, f)
        }); // if we're in a string and in an XML block, allow an embedded code block

        if (stream.match("{", false) && isInXmlAttributeBlock(state)) {
          state.tokenize = tokenBase;
          return "string";
        }

        while (ch = stream.next()) {
          if (ch == quote) {
            popStateStack(state);
            if (f) state.tokenize = f;
            break;
          } else {
            // if we're in a string and in an XML block, allow an embedded code block in an attribute
            if (stream.match("{", false) && isInXmlAttributeBlock(state)) {
              state.tokenize = tokenBase;
              return "string";
            }
          }
        }

        return "string";
      };
    } // tokenizer for variables


    function tokenVariable(stream, state) {
      var isVariableChar = /[\w\$_-]/; // a variable may start with a quoted EQName so if the next character is quote, consume to the next quote

      if (stream.eat("\"")) {
        while (stream.next() !== '\"') {}

        stream.eat(":");
      } else {
        stream.eatWhile(isVariableChar);
        if (!stream.match(":=", false)) stream.eat(":");
      }

      stream.eatWhile(isVariableChar);
      state.tokenize = tokenBase;
      return "variable";
    } // tokenizer for XML tags


    function tokenTag(name, isclose) {
      return function (stream, state) {
        stream.eatSpace();

        if (isclose && stream.eat(">")) {
          popStateStack(state);
          state.tokenize = tokenBase;
          return "tag";
        } // self closing tag without attributes?


        if (!stream.eat("/")) pushStateStack(state, {
          type: "tag",
          name: name,
          tokenize: tokenBase
        });

        if (!stream.eat(">")) {
          state.tokenize = tokenAttribute;
          return "tag";
        } else {
          state.tokenize = tokenBase;
        }

        return "tag";
      };
    } // tokenizer for XML attributes


    function tokenAttribute(stream, state) {
      var ch = stream.next();

      if (ch == "/" && stream.eat(">")) {
        if (isInXmlAttributeBlock(state)) popStateStack(state);
        if (isInXmlBlock(state)) popStateStack(state);
        return "tag";
      }

      if (ch == ">") {
        if (isInXmlAttributeBlock(state)) popStateStack(state);
        return "tag";
      }

      if (ch == "=") return null; // quoted string

      if (ch == '"' || ch == "'") return chain(stream, state, tokenString(ch, tokenAttribute));
      if (!isInXmlAttributeBlock(state)) pushStateStack(state, {
        type: "attribute",
        tokenize: tokenAttribute
      });
      stream.eat(/[a-zA-Z_:]/);
      stream.eatWhile(/[-a-zA-Z0-9_:.]/);
      stream.eatSpace(); // the case where the attribute has not value and the tag was closed

      if (stream.match(">", false) || stream.match("/", false)) {
        popStateStack(state);
        state.tokenize = tokenBase;
      }

      return "attribute";
    } // handle comments, including nested


    function tokenXMLComment(stream, state) {
      var ch;

      while (ch = stream.next()) {
        if (ch == "-" && stream.match("->", true)) {
          state.tokenize = tokenBase;
          return "comment";
        }
      }
    } // handle CDATA


    function tokenCDATA(stream, state) {
      var ch;

      while (ch = stream.next()) {
        if (ch == "]" && stream.match("]", true)) {
          state.tokenize = tokenBase;
          return "comment";
        }
      }
    } // handle preprocessing instructions


    function tokenPreProcessing(stream, state) {
      var ch;

      while (ch = stream.next()) {
        if (ch == "?" && stream.match(">", true)) {
          state.tokenize = tokenBase;
          return "comment meta";
        }
      }
    } // functions to test the current context of the state


    function isInXmlBlock(state) {
      return isIn(state, "tag");
    }

    function isInXmlAttributeBlock(state) {
      return isIn(state, "attribute");
    }

    function isInXmlConstructor(state) {
      return isIn(state, "xmlconstructor");
    }

    function isInString(state) {
      return isIn(state, "string");
    }

    function isEQNameAhead(stream) {
      // assume we've already eaten a quote (")
      if (stream.current() === '"') return stream.match(/^[^\"]+\"\:/, false);else if (stream.current() === '\'') return stream.match(/^[^\"]+\'\:/, false);else return false;
    }

    function isIn(state, type) {
      return state.stack.length && state.stack[state.stack.length - 1].type == type;
    }

    function pushStateStack(state, newState) {
      state.stack.push(newState);
    }

    function popStateStack(state) {
      state.stack.pop();
      var reinstateTokenize = state.stack.length && state.stack[state.stack.length - 1].tokenize;
      state.tokenize = reinstateTokenize || tokenBase;
    } // the interface for the mode API


    return {
      startState: function () {
        return {
          tokenize: tokenBase,
          cc: [],
          stack: []
        };
      },
      token: function (stream, state) {
        if (stream.eatSpace()) return null;
        var style = state.tokenize(stream, state);
        return style;
      },
      blockCommentStart: "(:",
      blockCommentEnd: ":)"
    };
  });
  CodeMirror.defineMIME("application/xquery", "xquery");
}

function css(CodeMirror) {
  CodeMirror.defineMode("css", function (config, parserConfig) {
    var inline = parserConfig.inline;
    if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");
    var indentUnit = config.indentUnit,
        tokenHooks = parserConfig.tokenHooks,
        documentTypes = parserConfig.documentTypes || {},
        mediaTypes = parserConfig.mediaTypes || {},
        mediaFeatures = parserConfig.mediaFeatures || {},
        mediaValueKeywords = parserConfig.mediaValueKeywords || {},
        propertyKeywords = parserConfig.propertyKeywords || {},
        nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
        fontProperties = parserConfig.fontProperties || {},
        counterDescriptors = parserConfig.counterDescriptors || {},
        colorKeywords = parserConfig.colorKeywords || {},
        valueKeywords = parserConfig.valueKeywords || {},
        allowNested = parserConfig.allowNested,
        lineComment = parserConfig.lineComment,
        supportsAtComponent = parserConfig.supportsAtComponent === true,
        highlightNonStandardPropertyKeywords = config.highlightNonStandardPropertyKeywords !== false;
    var type, override;

    function ret(style, tp) {
      type = tp;
      return style;
    } // Tokenizers


    function tokenBase(stream, state) {
      var ch = stream.next();

      if (tokenHooks[ch]) {
        var result = tokenHooks[ch](stream, state);
        if (result !== false) return result;
      }

      if (ch == "@") {
        stream.eatWhile(/[\w\\\-]/);
        return ret("def", stream.current());
      } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
        return ret(null, "compare");
      } else if (ch == "\"" || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      } else if (ch == "#") {
        stream.eatWhile(/[\w\\\-]/);
        return ret("atom", "hash");
      } else if (ch == "!") {
        stream.match(/^\s*\w*/);
        return ret("keyword", "important");
      } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (ch === "-") {
        if (/[\d.]/.test(stream.peek())) {
          stream.eatWhile(/[\w.%]/);
          return ret("number", "unit");
        } else if (stream.match(/^-[\w\\\-]*/)) {
          stream.eatWhile(/[\w\\\-]/);
          if (stream.match(/^\s*:/, false)) return ret("variable-2", "variable-definition");
          return ret("variable-2", "variable");
        } else if (stream.match(/^\w+-/)) {
          return ret("meta", "meta");
        }
      } else if (/[,+>*\/]/.test(ch)) {
        return ret(null, "select-op");
      } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
        return ret("qualifier", "qualifier");
      } else if (/[:;{}\[\]\(\)]/.test(ch)) {
        return ret(null, ch);
      } else if (stream.match(/^[\w-.]+(?=\()/)) {
        if (/^(url(-prefix)?|domain|regexp)$/i.test(stream.current())) {
          state.tokenize = tokenParenthesized;
        }

        return ret("variable callee", "variable");
      } else if (/[\w\\\-]/.test(ch)) {
        stream.eatWhile(/[\w\\\-]/);
        return ret("property", "word");
      } else {
        return ret(null, null);
      }
    }

    function tokenString(quote) {
      return function (stream, state) {
        var escaped = false,
            ch;

        while ((ch = stream.next()) != null) {
          if (ch == quote && !escaped) {
            if (quote == ")") stream.backUp(1);
            break;
          }

          escaped = !escaped && ch == "\\";
        }

        if (ch == quote || !escaped && quote != ")") state.tokenize = null;
        return ret("string", "string");
      };
    }

    function tokenParenthesized(stream, state) {
      stream.next(); // Must be '('

      if (!stream.match(/^\s*[\"\')]/, false)) state.tokenize = tokenString(")");else state.tokenize = null;
      return ret(null, "(");
    } // Context management


    function Context(type, indent, prev) {
      this.type = type;
      this.indent = indent;
      this.prev = prev;
    }

    function pushContext(state, stream, type, indent) {
      state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
      return type;
    }

    function popContext(state) {
      if (state.context.prev) state.context = state.context.prev;
      return state.context.type;
    }

    function pass(type, stream, state) {
      return states[state.context.type](type, stream, state);
    }

    function popAndPass(type, stream, state, n) {
      for (var i = n || 1; i > 0; i--) state.context = state.context.prev;

      return pass(type, stream, state);
    } // Parser


    function wordAsValue(stream) {
      var word = stream.current().toLowerCase();
      if (valueKeywords.hasOwnProperty(word)) override = "atom";else if (colorKeywords.hasOwnProperty(word)) override = "keyword";else override = "variable";
    }

    var states = {};

    states.top = function (type, stream, state) {
      if (type == "{") {
        return pushContext(state, stream, "block");
      } else if (type == "}" && state.context.prev) {
        return popContext(state);
      } else if (supportsAtComponent && /@component/i.test(type)) {
        return pushContext(state, stream, "atComponentBlock");
      } else if (/^@(-moz-)?document$/i.test(type)) {
        return pushContext(state, stream, "documentTypes");
      } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
        return pushContext(state, stream, "atBlock");
      } else if (/^@(font-face|counter-style)/i.test(type)) {
        state.stateArg = type;
        return "restricted_atBlock_before";
      } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
        return "keyframes";
      } else if (type && type.charAt(0) == "@") {
        return pushContext(state, stream, "at");
      } else if (type == "hash") {
        override = "builtin";
      } else if (type == "word") {
        override = "tag";
      } else if (type == "variable-definition") {
        return "maybeprop";
      } else if (type == "interpolation") {
        return pushContext(state, stream, "interpolation");
      } else if (type == ":") {
        return "pseudo";
      } else if (allowNested && type == "(") {
        return pushContext(state, stream, "parens");
      }

      return state.context.type;
    };

    states.block = function (type, stream, state) {
      if (type == "word") {
        var word = stream.current().toLowerCase();

        if (propertyKeywords.hasOwnProperty(word)) {
          override = "property";
          return "maybeprop";
        } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
          override = highlightNonStandardPropertyKeywords ? "string-2" : "property";
          return "maybeprop";
        } else if (allowNested) {
          override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
          return "block";
        } else {
          override += " error";
          return "maybeprop";
        }
      } else if (type == "meta") {
        return "block";
      } else if (!allowNested && (type == "hash" || type == "qualifier")) {
        override = "error";
        return "block";
      } else {
        return states.top(type, stream, state);
      }
    };

    states.maybeprop = function (type, stream, state) {
      if (type == ":") return pushContext(state, stream, "prop");
      return pass(type, stream, state);
    };

    states.prop = function (type, stream, state) {
      if (type == ";") return popContext(state);
      if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
      if (type == "}" || type == "{") return popAndPass(type, stream, state);
      if (type == "(") return pushContext(state, stream, "parens");

      if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
        override += " error";
      } else if (type == "word") {
        wordAsValue(stream);
      } else if (type == "interpolation") {
        return pushContext(state, stream, "interpolation");
      }

      return "prop";
    };

    states.propBlock = function (type, _stream, state) {
      if (type == "}") return popContext(state);

      if (type == "word") {
        override = "property";
        return "maybeprop";
      }

      return state.context.type;
    };

    states.parens = function (type, stream, state) {
      if (type == "{" || type == "}") return popAndPass(type, stream, state);
      if (type == ")") return popContext(state);
      if (type == "(") return pushContext(state, stream, "parens");
      if (type == "interpolation") return pushContext(state, stream, "interpolation");
      if (type == "word") wordAsValue(stream);
      return "parens";
    };

    states.pseudo = function (type, stream, state) {
      if (type == "meta") return "pseudo";

      if (type == "word") {
        override = "variable-3";
        return state.context.type;
      }

      return pass(type, stream, state);
    };

    states.documentTypes = function (type, stream, state) {
      if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
        override = "tag";
        return state.context.type;
      } else {
        return states.atBlock(type, stream, state);
      }
    };

    states.atBlock = function (type, stream, state) {
      if (type == "(") return pushContext(state, stream, "atBlock_parens");
      if (type == "}" || type == ";") return popAndPass(type, stream, state);
      if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");
      if (type == "interpolation") return pushContext(state, stream, "interpolation");

      if (type == "word") {
        var word = stream.current().toLowerCase();
        if (word == "only" || word == "not" || word == "and" || word == "or") override = "keyword";else if (mediaTypes.hasOwnProperty(word)) override = "attribute";else if (mediaFeatures.hasOwnProperty(word)) override = "property";else if (mediaValueKeywords.hasOwnProperty(word)) override = "keyword";else if (propertyKeywords.hasOwnProperty(word)) override = "property";else if (nonStandardPropertyKeywords.hasOwnProperty(word)) override = highlightNonStandardPropertyKeywords ? "string-2" : "property";else if (valueKeywords.hasOwnProperty(word)) override = "atom";else if (colorKeywords.hasOwnProperty(word)) override = "keyword";else override = "error";
      }

      return state.context.type;
    };

    states.atComponentBlock = function (type, stream, state) {
      if (type == "}") return popAndPass(type, stream, state);
      if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
      if (type == "word") override = "error";
      return state.context.type;
    };

    states.atBlock_parens = function (type, stream, state) {
      if (type == ")") return popContext(state);
      if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
      return states.atBlock(type, stream, state);
    };

    states.restricted_atBlock_before = function (type, stream, state) {
      if (type == "{") return pushContext(state, stream, "restricted_atBlock");

      if (type == "word" && state.stateArg == "@counter-style") {
        override = "variable";
        return "restricted_atBlock_before";
      }

      return pass(type, stream, state);
    };

    states.restricted_atBlock = function (type, stream, state) {
      if (type == "}") {
        state.stateArg = null;
        return popContext(state);
      }

      if (type == "word") {
        if (state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase()) || state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())) override = "error";else override = "property";
        return "maybeprop";
      }

      return "restricted_atBlock";
    };

    states.keyframes = function (type, stream, state) {
      if (type == "word") {
        override = "variable";
        return "keyframes";
      }

      if (type == "{") return pushContext(state, stream, "top");
      return pass(type, stream, state);
    };

    states.at = function (type, stream, state) {
      if (type == ";") return popContext(state);
      if (type == "{" || type == "}") return popAndPass(type, stream, state);
      if (type == "word") override = "tag";else if (type == "hash") override = "builtin";
      return "at";
    };

    states.interpolation = function (type, stream, state) {
      if (type == "}") return popContext(state);
      if (type == "{" || type == ";") return popAndPass(type, stream, state);
      if (type == "word") override = "variable";else if (type != "variable" && type != "(" && type != ")") override = "error";
      return "interpolation";
    };

    return {
      startState: function (base) {
        return {
          tokenize: null,
          state: inline ? "block" : "top",
          stateArg: null,
          context: new Context(inline ? "block" : "top", base || 0, null)
        };
      },
      token: function (stream, state) {
        if (!state.tokenize && stream.eatSpace()) return null;
        var style = (state.tokenize || tokenBase)(stream, state);

        if (style && typeof style == "object") {
          type = style[1];
          style = style[0];
        }

        override = style;
        if (type != "comment") state.state = states[state.state](type, stream, state);
        return override;
      },
      indent: function (state, textAfter) {
        var cx = state.context,
            ch = textAfter && textAfter.charAt(0);
        var indent = cx.indent;
        if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;

        if (cx.prev) {
          if (ch == "}" && (cx.type == "block" || cx.type == "top" || cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
            // Resume indentation from parent context.
            cx = cx.prev;
            indent = cx.indent;
          } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") || ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
            // Dedent relative to current context.
            indent = Math.max(0, cx.indent - indentUnit);
          }
        }

        return indent;
      },
      electricChars: "}",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      blockCommentContinue: " * ",
      lineComment: lineComment,
      fold: "brace"
    };
  });

  function keySet(array) {
    var keys = {};

    for (var i = 0; i < array.length; ++i) {
      keys[array[i].toLowerCase()] = true;
    }

    return keys;
  }

  var documentTypes_ = ["domain", "regexp", "url", "url-prefix"],
      documentTypes = keySet(documentTypes_);
  var mediaTypes_ = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"],
      mediaTypes = keySet(mediaTypes_);
  var mediaFeatures_ = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid", "orientation", "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio", "pointer", "any-pointer", "hover", "any-hover", "prefers-color-scheme"],
      mediaFeatures = keySet(mediaFeatures_);
  var mediaValueKeywords_ = ["landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover", "interlace", "progressive", "dark", "light"],
      mediaValueKeywords = keySet(mediaValueKeywords_);
  var propertyKeywords_ = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "all", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "block-size", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "line-break", "line-height", "line-height-step", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotate", "rotation", "rotation-point", "row-gap", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-type", "shape-image-threshold", "shape-inside", "shape-margin", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-orientation", "text-outline", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "touch-action", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index", // SVG-specific
  "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "paint-order", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "text-anchor", "writing-mode"],
      propertyKeywords = keySet(propertyKeywords_);
  var nonStandardPropertyKeywords_ = ["border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "margin-block", "margin-block-end", "margin-block-start", "margin-inline", "margin-inline-end", "margin-inline-start", "padding-block", "padding-block-end", "padding-block-start", "padding-inline", "padding-inline-end", "padding-inline-start", "scroll-snap-stop", "scrollbar-3d-light-color", "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color", "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color", "scrollbar-track-color", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "shape-inside", "zoom"],
      nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);
  var fontProperties_ = ["font-display", "font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"],
      fontProperties = keySet(fontProperties_);
  var counterDescriptors_ = ["additive-symbols", "fallback", "negative", "pad", "prefix", "range", "speak-as", "suffix", "symbols", "system"],
      counterDescriptors = keySet(counterDescriptors_);
  var colorKeywords_ = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
      colorKeywords = keySet(colorKeywords_);
  var valueKeywords_ = ["above", "absolute", "activeborder", "additive", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page", "avoid-region", "axis-pan", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse", "compact", "condensed", "contain", "content", "contents", "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "dense", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "difference", "disc", "discard", "disclosure-closed", "disclosure-open", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fill-box", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "japanese-formal", "japanese-informal", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten", "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "manipulation", "match", "matrix", "matrix3d", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "multiple_mask_images", "multiply", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "perspective", "pinch-zoom", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radial-gradient", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running", "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen", "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "simp-chinese-formal", "simp-chinese-informal", "single", "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "stroke-box", "sub", "subpixel-antialiased", "svg_masks", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "tamil", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "trad-chinese-formal", "trad-chinese-informal", "transform", "translate", "translate3d", "translateX", "translateY", "translateZ", "transparent", "ultra-condensed", "ultra-expanded", "underline", "unidirectional-pan", "unset", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "var", "vertical", "vertical-text", "view-box", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor", "xx-large", "xx-small"],
      valueKeywords = keySet(valueKeywords_);
  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_).concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_).concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false,
        ch;

    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }

      maybeEnd = ch == "*";
    }

    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function (stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });
  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function (stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function (stream) {
        if (stream.match(/^\s*\{/, false)) return [null, null];
        return false;
      },
      "$": function (stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false)) return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function (stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });
  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function (stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function (stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false)) return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function () {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });
  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function (stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });
}

function xml(CodeMirror) {
  var htmlConfig = {
    autoSelfClosers: {
      'area': true,
      'base': true,
      'br': true,
      'col': true,
      'command': true,
      'embed': true,
      'frame': true,
      'hr': true,
      'img': true,
      'input': true,
      'keygen': true,
      'link': true,
      'meta': true,
      'param': true,
      'source': true,
      'track': true,
      'wbr': true,
      'menuitem': true
    },
    implicitlyClosed: {
      'dd': true,
      'li': true,
      'optgroup': true,
      'option': true,
      'p': true,
      'rp': true,
      'rt': true,
      'tbody': true,
      'td': true,
      'tfoot': true,
      'th': true,
      'tr': true
    },
    contextGrabbers: {
      'dd': {
        'dd': true,
        'dt': true
      },
      'dt': {
        'dd': true,
        'dt': true
      },
      'li': {
        'li': true
      },
      'option': {
        'option': true,
        'optgroup': true
      },
      'optgroup': {
        'optgroup': true
      },
      'p': {
        'address': true,
        'article': true,
        'aside': true,
        'blockquote': true,
        'dir': true,
        'div': true,
        'dl': true,
        'fieldset': true,
        'footer': true,
        'form': true,
        'h1': true,
        'h2': true,
        'h3': true,
        'h4': true,
        'h5': true,
        'h6': true,
        'header': true,
        'hgroup': true,
        'hr': true,
        'menu': true,
        'nav': true,
        'ol': true,
        'p': true,
        'pre': true,
        'section': true,
        'table': true,
        'ul': true
      },
      'rp': {
        'rp': true,
        'rt': true
      },
      'rt': {
        'rp': true,
        'rt': true
      },
      'tbody': {
        'tbody': true,
        'tfoot': true
      },
      'td': {
        'td': true,
        'th': true
      },
      'tfoot': {
        'tbody': true
      },
      'th': {
        'td': true,
        'th': true
      },
      'thead': {
        'tbody': true,
        'tfoot': true
      },
      'tr': {
        'tr': true
      }
    },
    doNotIndent: {
      "pre": true
    },
    allowUnquoted: true,
    allowMissing: true,
    caseFold: true
  };
  var xmlConfig = {
    autoSelfClosers: {},
    implicitlyClosed: {},
    contextGrabbers: {},
    doNotIndent: {},
    allowUnquoted: false,
    allowMissing: false,
    allowMissingTagName: false,
    caseFold: false
  };
  CodeMirror.defineMode("xml", function (editorConf, config_) {
    var indentUnit = editorConf.indentUnit;
    var config = {};
    var defaults = config_.htmlMode ? htmlConfig : xmlConfig;

    for (var prop in defaults) config[prop] = defaults[prop];

    for (var prop in config_) config[prop] = config_[prop]; // Return variables for tokenizers


    var type, setStyle;

    function inText(stream, state) {
      function chain(parser) {
        state.tokenize = parser;
        return parser(stream, state);
      }

      var ch = stream.next();

      if (ch == "<") {
        if (stream.eat("!")) {
          if (stream.eat("[")) {
            if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));else return null;
          } else if (stream.match("--")) {
            return chain(inBlock("comment", "-->"));
          } else if (stream.match("DOCTYPE", true, true)) {
            stream.eatWhile(/[\w\._\-]/);
            return chain(doctype(1));
          } else {
            return null;
          }
        } else if (stream.eat("?")) {
          stream.eatWhile(/[\w\._\-]/);
          state.tokenize = inBlock("meta", "?>");
          return "meta";
        } else {
          type = stream.eat("/") ? "closeTag" : "openTag";
          state.tokenize = inTag;
          return "tag bracket";
        }
      } else if (ch == "&") {
        var ok;

        if (stream.eat("#")) {
          if (stream.eat("x")) {
            ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
          } else {
            ok = stream.eatWhile(/[\d]/) && stream.eat(";");
          }
        } else {
          ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
        }

        return ok ? "atom" : "error";
      } else {
        stream.eatWhile(/[^&<]/);
        return null;
      }
    }

    inText.isInText = true;

    function inTag(stream, state) {
      var ch = stream.next();

      if (ch == ">" || ch == "/" && stream.eat(">")) {
        state.tokenize = inText;
        type = ch == ">" ? "endTag" : "selfcloseTag";
        return "tag bracket";
      } else if (ch == "=") {
        type = "equals";
        return null;
      } else if (ch == "<") {
        state.tokenize = inText;
        state.state = baseState;
        state.tagName = state.tagStart = null;
        var next = state.tokenize(stream, state);
        return next ? next + " tag error" : "tag error";
      } else if (/[\'\"]/.test(ch)) {
        state.tokenize = inAttribute(ch);
        state.stringStartCol = stream.column();
        return state.tokenize(stream, state);
      } else {
        stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
        return "word";
      }
    }

    function inAttribute(quote) {
      var closure = function (stream, state) {
        while (!stream.eol()) {
          if (stream.next() == quote) {
            state.tokenize = inTag;
            break;
          }
        }

        return "string";
      };

      closure.isInAttribute = true;
      return closure;
    }

    function inBlock(style, terminator) {
      return function (stream, state) {
        while (!stream.eol()) {
          if (stream.match(terminator)) {
            state.tokenize = inText;
            break;
          }

          stream.next();
        }

        return style;
      };
    }

    function doctype(depth) {
      return function (stream, state) {
        var ch;

        while ((ch = stream.next()) != null) {
          if (ch == "<") {
            state.tokenize = doctype(depth + 1);
            return state.tokenize(stream, state);
          } else if (ch == ">") {
            if (depth == 1) {
              state.tokenize = inText;
              break;
            } else {
              state.tokenize = doctype(depth - 1);
              return state.tokenize(stream, state);
            }
          }
        }

        return "meta";
      };
    }

    function Context(state, tagName, startOfLine) {
      this.prev = state.context;
      this.tagName = tagName || "";
      this.indent = state.indented;
      this.startOfLine = startOfLine;
      if (config.doNotIndent.hasOwnProperty(tagName) || state.context && state.context.noIndent) this.noIndent = true;
    }

    function popContext(state) {
      if (state.context) state.context = state.context.prev;
    }

    function maybePopContext(state, nextTagName) {
      var parentTagName;

      while (true) {
        if (!state.context) {
          return;
        }

        parentTagName = state.context.tagName;

        if (!config.contextGrabbers.hasOwnProperty(parentTagName) || !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
          return;
        }

        popContext(state);
      }
    }

    function baseState(type, stream, state) {
      if (type == "openTag") {
        state.tagStart = stream.column();
        return tagNameState;
      } else if (type == "closeTag") {
        return closeTagNameState;
      } else {
        return baseState;
      }
    }

    function tagNameState(type, stream, state) {
      if (type == "word") {
        state.tagName = stream.current();
        setStyle = "tag";
        return attrState;
      } else if (config.allowMissingTagName && type == "endTag") {
        setStyle = "tag bracket";
        return attrState(type, stream, state);
      } else {
        setStyle = "error";
        return tagNameState;
      }
    }

    function closeTagNameState(type, stream, state) {
      if (type == "word") {
        var tagName = stream.current();
        if (state.context && state.context.tagName != tagName && config.implicitlyClosed.hasOwnProperty(state.context.tagName)) popContext(state);

        if (state.context && state.context.tagName == tagName || config.matchClosing === false) {
          setStyle = "tag";
          return closeState;
        } else {
          setStyle = "tag error";
          return closeStateErr;
        }
      } else if (config.allowMissingTagName && type == "endTag") {
        setStyle = "tag bracket";
        return closeState(type, stream, state);
      } else {
        setStyle = "error";
        return closeStateErr;
      }
    }

    function closeState(type, _stream, state) {
      if (type != "endTag") {
        setStyle = "error";
        return closeState;
      }

      popContext(state);
      return baseState;
    }

    function closeStateErr(type, stream, state) {
      setStyle = "error";
      return closeState(type, stream, state);
    }

    function attrState(type, _stream, state) {
      if (type == "word") {
        setStyle = "attribute";
        return attrEqState;
      } else if (type == "endTag" || type == "selfcloseTag") {
        var tagName = state.tagName,
            tagStart = state.tagStart;
        state.tagName = state.tagStart = null;

        if (type == "selfcloseTag" || config.autoSelfClosers.hasOwnProperty(tagName)) {
          maybePopContext(state, tagName);
        } else {
          maybePopContext(state, tagName);
          state.context = new Context(state, tagName, tagStart == state.indented);
        }

        return baseState;
      }

      setStyle = "error";
      return attrState;
    }

    function attrEqState(type, stream, state) {
      if (type == "equals") return attrValueState;
      if (!config.allowMissing) setStyle = "error";
      return attrState(type, stream, state);
    }

    function attrValueState(type, stream, state) {
      if (type == "string") return attrContinuedState;

      if (type == "word" && config.allowUnquoted) {
        setStyle = "string";
        return attrState;
      }

      setStyle = "error";
      return attrState(type, stream, state);
    }

    function attrContinuedState(type, stream, state) {
      if (type == "string") return attrContinuedState;
      return attrState(type, stream, state);
    }

    return {
      startState: function (baseIndent) {
        var state = {
          tokenize: inText,
          state: baseState,
          indented: baseIndent || 0,
          tagName: null,
          tagStart: null,
          context: null
        };
        if (baseIndent != null) state.baseIndent = baseIndent;
        return state;
      },
      token: function (stream, state) {
        if (!state.tagName && stream.sol()) state.indented = stream.indentation();
        if (stream.eatSpace()) return null;
        type = null;
        var style = state.tokenize(stream, state);

        if ((style || type) && style != "comment") {
          setStyle = null;
          state.state = state.state(type || style, stream, state);
          if (setStyle) style = setStyle == "error" ? style + " error" : setStyle;
        }

        return style;
      },
      indent: function (state, textAfter, fullLine) {
        var context = state.context; // Indent multi-line strings (e.g. css).

        if (state.tokenize.isInAttribute) {
          if (state.tagStart == state.indented) return state.stringStartCol + 1;else return state.indented + indentUnit;
        }

        if (context && context.noIndent) return CodeMirror.Pass;
        if (state.tokenize != inTag && state.tokenize != inText) return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0; // Indent the starts of attribute names.

        if (state.tagName) {
          if (config.multilineTagIndentPastTag !== false) return state.tagStart + state.tagName.length + 2;else return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
        }

        if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
        var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);

        if (tagAfter && tagAfter[1]) {
          // Closing tag spotted
          while (context) {
            if (context.tagName == tagAfter[2]) {
              context = context.prev;
              break;
            } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
              context = context.prev;
            } else {
              break;
            }
          }
        } else if (tagAfter) {
          // Opening tag spotted
          while (context) {
            var grabbers = config.contextGrabbers[context.tagName];
            if (grabbers && grabbers.hasOwnProperty(tagAfter[2])) context = context.prev;else break;
          }
        }

        while (context && context.prev && !context.startOfLine) context = context.prev;

        if (context) return context.indent + indentUnit;else return state.baseIndent || 0;
      },
      electricInput: /<\/[\s\w:]+>$/,
      blockCommentStart: "<!--",
      blockCommentEnd: "-->",
      configuration: config.htmlMode ? "html" : "xml",
      helperType: config.htmlMode ? "html" : "xml",
      skipAttribute: function (state) {
        if (state.state == attrValueState) state.state = attrState;
      },
      xmlCurrentTag: function (state) {
        return state.tagName ? {
          name: state.tagName,
          close: state.type == "closeTag"
        } : null;
      },
      xmlCurrentContext: function (state) {
        var context = [];

        for (var cx = state.context; cx; cx = cx.prev) context.push(cx.tagName);

        return context.reverse();
      }
    };
  });
  CodeMirror.defineMIME("text/xml", "xml");
  CodeMirror.defineMIME("application/xml", "xml");
  if (!CodeMirror.mimeModes.hasOwnProperty("text/html")) CodeMirror.defineMIME("text/html", {
    name: "xml",
    htmlMode: true
  });
}

function stex(CodeMirror) {
  CodeMirror.defineMode("stex", function (_config, parserConfig) {
    function pushCommand(state, command) {
      state.cmdState.push(command);
    }

    function peekCommand(state) {
      if (state.cmdState.length > 0) {
        return state.cmdState[state.cmdState.length - 1];
      } else {
        return null;
      }
    }

    function popCommand(state) {
      var plug = state.cmdState.pop();

      if (plug) {
        plug.closeBracket();
      }
    } // returns the non-default plugin closest to the end of the list


    function getMostPowerful(state) {
      var context = state.cmdState;

      for (var i = context.length - 1; i >= 0; i--) {
        var plug = context[i];

        if (plug.name == "DEFAULT") {
          continue;
        }

        return plug;
      }

      return {
        styleIdentifier: function () {
          return null;
        }
      };
    }

    function addPluginPattern(pluginName, cmdStyle, styles) {
      return function () {
        this.name = pluginName;
        this.bracketNo = 0;
        this.style = cmdStyle;
        this.styles = styles;
        this.argument = null; // \begin and \end have arguments that follow. These are stored in the plugin

        this.styleIdentifier = function () {
          return this.styles[this.bracketNo - 1] || null;
        };

        this.openBracket = function () {
          this.bracketNo++;
          return "bracket";
        };

        this.closeBracket = function () {};
      };
    }

    var plugins = {};
    plugins["importmodule"] = addPluginPattern("importmodule", "tag", ["string", "builtin"]);
    plugins["documentclass"] = addPluginPattern("documentclass", "tag", ["", "atom"]);
    plugins["usepackage"] = addPluginPattern("usepackage", "tag", ["atom"]);
    plugins["begin"] = addPluginPattern("begin", "tag", ["atom"]);
    plugins["end"] = addPluginPattern("end", "tag", ["atom"]);
    plugins["label"] = addPluginPattern("label", "tag", ["atom"]);
    plugins["ref"] = addPluginPattern("ref", "tag", ["atom"]);
    plugins["eqref"] = addPluginPattern("eqref", "tag", ["atom"]);
    plugins["cite"] = addPluginPattern("cite", "tag", ["atom"]);
    plugins["bibitem"] = addPluginPattern("bibitem", "tag", ["atom"]);
    plugins["Bibitem"] = addPluginPattern("Bibitem", "tag", ["atom"]);
    plugins["RBibitem"] = addPluginPattern("RBibitem", "tag", ["atom"]);

    plugins["DEFAULT"] = function () {
      this.name = "DEFAULT";
      this.style = "tag";

      this.styleIdentifier = this.openBracket = this.closeBracket = function () {};
    };

    function setState(state, f) {
      state.f = f;
    } // called when in a normal (no environment) context


    function normal(source, state) {
      var plug; // Do we look like '\command' ?  If so, attempt to apply the plugin 'command'

      if (source.match(/^\\[a-zA-Z@]+/)) {
        var cmdName = source.current().slice(1);
        plug = plugins.hasOwnProperty(cmdName) ? plugins[cmdName] : plugins["DEFAULT"];
        plug = new plug();
        pushCommand(state, plug);
        setState(state, beginParams);
        return plug.style;
      } // escape characters


      if (source.match(/^\\[$&%#{}_]/)) {
        return "tag";
      } // white space control characters


      if (source.match(/^\\[,;!\/\\]/)) {
        return "tag";
      } // find if we're starting various math modes


      if (source.match("\\[")) {
        setState(state, function (source, state) {
          return inMathMode(source, state, "\\]");
        });
        return "keyword";
      }

      if (source.match("\\(")) {
        setState(state, function (source, state) {
          return inMathMode(source, state, "\\)");
        });
        return "keyword";
      }

      if (source.match("$$")) {
        setState(state, function (source, state) {
          return inMathMode(source, state, "$$");
        });
        return "keyword";
      }

      if (source.match("$")) {
        setState(state, function (source, state) {
          return inMathMode(source, state, "$");
        });
        return "keyword";
      }

      var ch = source.next();

      if (ch == "%") {
        source.skipToEnd();
        return "comment";
      } else if (ch == '}' || ch == ']') {
        plug = peekCommand(state);

        if (plug) {
          plug.closeBracket(ch);
          setState(state, beginParams);
        } else {
          return "error";
        }

        return "bracket";
      } else if (ch == '{' || ch == '[') {
        plug = plugins["DEFAULT"];
        plug = new plug();
        pushCommand(state, plug);
        return "bracket";
      } else if (/\d/.test(ch)) {
        source.eatWhile(/[\w.%]/);
        return "atom";
      } else {
        source.eatWhile(/[\w\-_]/);
        plug = getMostPowerful(state);

        if (plug.name == 'begin') {
          plug.argument = source.current();
        }

        return plug.styleIdentifier();
      }
    }

    function inMathMode(source, state, endModeSeq) {
      if (source.eatSpace()) {
        return null;
      }

      if (endModeSeq && source.match(endModeSeq)) {
        setState(state, normal);
        return "keyword";
      }

      if (source.match(/^\\[a-zA-Z@]+/)) {
        return "tag";
      }

      if (source.match(/^[a-zA-Z]+/)) {
        return "variable-2";
      } // escape characters


      if (source.match(/^\\[$&%#{}_]/)) {
        return "tag";
      } // white space control characters


      if (source.match(/^\\[,;!\/]/)) {
        return "tag";
      } // special math-mode characters


      if (source.match(/^[\^_&]/)) {
        return "tag";
      } // non-special characters


      if (source.match(/^[+\-<>|=,\/@!*:;'"`~#?]/)) {
        return null;
      }

      if (source.match(/^(\d+\.\d*|\d*\.\d+|\d+)/)) {
        return "number";
      }

      var ch = source.next();

      if (ch == "{" || ch == "}" || ch == "[" || ch == "]" || ch == "(" || ch == ")") {
        return "bracket";
      }

      if (ch == "%") {
        source.skipToEnd();
        return "comment";
      }

      return "error";
    }

    function beginParams(source, state) {
      var ch = source.peek(),
          lastPlug;

      if (ch == '{' || ch == '[') {
        lastPlug = peekCommand(state);
        lastPlug.openBracket(ch);
        source.eat(ch);
        setState(state, normal);
        return "bracket";
      }

      if (/[ \t\r]/.test(ch)) {
        source.eat(ch);
        return null;
      }

      setState(state, normal);
      popCommand(state);
      return normal(source, state);
    }

    return {
      startState: function () {
        var f = parserConfig.inMathMode ? function (source, state) {
          return inMathMode(source, state);
        } : normal;
        return {
          cmdState: [],
          f: f
        };
      },
      copyState: function (s) {
        return {
          cmdState: s.cmdState.slice(),
          f: s.f
        };
      },
      token: function (stream, state) {
        return state.f(stream, state);
      },
      blankLine: function (state) {
        state.f = normal;
        state.cmdState.length = 0;
      },
      lineComment: "%"
    };
  });
  CodeMirror.defineMIME("text/x-stex", "stex");
  CodeMirror.defineMIME("text/x-latex", "stex");
}

function placeholder(CodeMirror) {
  CodeMirror.defineOption("placeholder", "", function (cm, val, old) {
    var prev = old && old != CodeMirror.Init;

    if (val && !prev) {
      cm.on("blur", onBlur);
      cm.on("change", onChange);
      cm.on("swapDoc", onChange);
      CodeMirror.on(cm.getInputField(), "compositionupdate", cm.state.placeholderCompose = function () {
        onComposition(cm);
      });
      onChange(cm);
    } else if (!val && prev) {
      cm.off("blur", onBlur);
      cm.off("change", onChange);
      cm.off("swapDoc", onChange);
      CodeMirror.off(cm.getInputField(), "compositionupdate", cm.state.placeholderCompose);
      clearPlaceholder(cm);
      var wrapper = cm.getWrapperElement();
      wrapper.className = wrapper.className.replace(" CodeMirror-empty", "");
    }

    if (val && !cm.hasFocus()) onBlur(cm);
  });

  function clearPlaceholder(cm) {
    if (cm.state.placeholder) {
      cm.state.placeholder.parentNode.removeChild(cm.state.placeholder);
      cm.state.placeholder = null;
    }
  }

  function setPlaceholder(cm) {
    clearPlaceholder(cm);
    var elt = cm.state.placeholder = document.createElement("pre");
    elt.style.cssText = "height: 0; overflow: visible";
    elt.style.direction = cm.getOption("direction");
    elt.className = "CodeMirror-placeholder CodeMirror-line-like";
    var placeHolder = cm.getOption("placeholder");
    if (typeof placeHolder == "string") placeHolder = document.createTextNode(placeHolder);
    elt.appendChild(placeHolder);
    cm.display.lineSpace.insertBefore(elt, cm.display.lineSpace.firstChild);
  }

  function onComposition(cm) {
    setTimeout(function () {
      var empty = false;

      if (cm.lineCount() == 1) {
        var input = cm.getInputField();
        empty = input.nodeName == "TEXTAREA" ? !cm.getLine(0).length : !/[^\u200b]/.test(input.querySelector(".CodeMirror-line").textContent);
      }

      if (empty) setPlaceholder(cm);else clearPlaceholder(cm);
    }, 20);
  }

  function onBlur(cm) {
    if (isEmpty(cm)) setPlaceholder(cm);
  }

  function onChange(cm) {
    var wrapper = cm.getWrapperElement(),
        empty = isEmpty(cm);
    wrapper.className = wrapper.className.replace(" CodeMirror-empty", "") + (empty ? " CodeMirror-empty" : "");
    if (empty) setPlaceholder(cm);else clearPlaceholder(cm);
  }

  function isEmpty(cm) {
    return cm.lineCount() === 1 && cm.getLine(0) === "";
  }
}

function matchbrackets(CodeMirror) {
  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) && (document.documentMode == null || document.documentMode < 8);
  var Pos = CodeMirror.Pos;
  var matching = {
    "(": ")>",
    ")": "(<",
    "[": "]>",
    "]": "[<",
    "{": "}>",
    "}": "{<",
    "<": ">>",
    ">": "<<"
  };

  function bracketRegex(config) {
    return config && config.bracketRegex || /[(){}[\]]/;
  }

  function findMatchingBracket(cm, where, config) {
    var line = cm.getLineHandle(where.line),
        pos = where.ch - 1;
    var afterCursor = config && config.afterCursor;
    if (afterCursor == null) afterCursor = /(^| )cm-fat-cursor($| )/.test(cm.getWrapperElement().className);
    var re = bracketRegex(config); // A cursor is defined as between two characters, but in in vim command mode
    // (i.e. not insert mode), the cursor is visually represented as a
    // highlighted box on top of the 2nd character. Otherwise, we allow matches
    // from before or after the cursor.

    var match = !afterCursor && pos >= 0 && re.test(line.text.charAt(pos)) && matching[line.text.charAt(pos)] || re.test(line.text.charAt(pos + 1)) && matching[line.text.charAt(++pos)];
    if (!match) return null;
    var dir = match.charAt(1) == ">" ? 1 : -1;
    if (config && config.strict && dir > 0 != (pos == where.ch)) return null;
    var style = cm.getTokenTypeAt(Pos(where.line, pos + 1));
    var found = scanForBracket(cm, Pos(where.line, pos + (dir > 0 ? 1 : 0)), dir, style, config);
    if (found == null) return null;
    return {
      from: Pos(where.line, pos),
      to: found && found.pos,
      match: found && found.ch == match.charAt(0),
      forward: dir > 0
    };
  } // bracketRegex is used to specify which type of bracket to scan
  // should be a regexp, e.g. /[[\]]/
  //
  // Note: If "where" is on an open bracket, then this bracket is ignored.
  //
  // Returns false when no bracket was found, null when it reached
  // maxScanLines and gave up


  function scanForBracket(cm, where, dir, style, config) {
    var maxScanLen = config && config.maxScanLineLength || 10000;
    var maxScanLines = config && config.maxScanLines || 1000;
    var stack = [];
    var re = bracketRegex(config);
    var lineEnd = dir > 0 ? Math.min(where.line + maxScanLines, cm.lastLine() + 1) : Math.max(cm.firstLine() - 1, where.line - maxScanLines);

    for (var lineNo = where.line; lineNo != lineEnd; lineNo += dir) {
      var line = cm.getLine(lineNo);
      if (!line) continue;
      var pos = dir > 0 ? 0 : line.length - 1,
          end = dir > 0 ? line.length : -1;
      if (line.length > maxScanLen) continue;
      if (lineNo == where.line) pos = where.ch - (dir < 0 ? 1 : 0);

      for (; pos != end; pos += dir) {
        var ch = line.charAt(pos);

        if (re.test(ch) && (style === undefined || (cm.getTokenTypeAt(Pos(lineNo, pos + 1)) || "") == (style || ""))) {
          var match = matching[ch];
          if (match && match.charAt(1) == ">" == dir > 0) stack.push(ch);else if (!stack.length) return {
            pos: Pos(lineNo, pos),
            ch: ch
          };else stack.pop();
        }
      }
    }

    return lineNo - dir == (dir > 0 ? cm.lastLine() : cm.firstLine()) ? false : null;
  }

  function matchBrackets(cm, autoclear, config) {
    // Disable brace matching in long lines, since it'll cause hugely slow updates
    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000,
        highlightNonMatching = config && config.highlightNonMatching;
    var marks = [],
        ranges = cm.listSelections();

    for (var i = 0; i < ranges.length; i++) {
      var match = ranges[i].empty() && findMatchingBracket(cm, ranges[i].head, config);

      if (match && (match.match || highlightNonMatching !== false) && cm.getLine(match.from.line).length <= maxHighlightLen) {
        var style = match.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
        marks.push(cm.markText(match.from, Pos(match.from.line, match.from.ch + 1), {
          className: style
        }));
        if (match.to && cm.getLine(match.to.line).length <= maxHighlightLen) marks.push(cm.markText(match.to, Pos(match.to.line, match.to.ch + 1), {
          className: style
        }));
      }
    }

    if (marks.length) {
      // Kludge to work around the IE bug from issue #1193, where text
      // input stops going to the textarea whenever this fires.
      if (ie_lt8 && cm.state.focused) cm.focus();

      var clear = function () {
        cm.operation(function () {
          for (var i = 0; i < marks.length; i++) marks[i].clear();
        });
      };

      if (autoclear) setTimeout(clear, 800);else return clear;
    }
  }

  function doMatchBrackets(cm) {
    cm.operation(function () {
      if (cm.state.matchBrackets.currentlyHighlighted) {
        cm.state.matchBrackets.currentlyHighlighted();
        cm.state.matchBrackets.currentlyHighlighted = null;
      }

      cm.state.matchBrackets.currentlyHighlighted = matchBrackets(cm, false, cm.state.matchBrackets);
    });
  }

  function clearHighlighted(cm) {
    if (cm.state.matchBrackets && cm.state.matchBrackets.currentlyHighlighted) {
      cm.state.matchBrackets.currentlyHighlighted();
      cm.state.matchBrackets.currentlyHighlighted = null;
    }
  }

  CodeMirror.defineOption("matchBrackets", false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.off("cursorActivity", doMatchBrackets);
      cm.off("focus", doMatchBrackets);
      cm.off("blur", clearHighlighted);
      clearHighlighted(cm);
    }

    if (val) {
      cm.state.matchBrackets = typeof val == "object" ? val : {};
      cm.on("cursorActivity", doMatchBrackets);
      cm.on("focus", doMatchBrackets);
      cm.on("blur", clearHighlighted);
    }
  });
  CodeMirror.defineExtension("matchBrackets", function () {
    matchBrackets(this, true);
  });
  CodeMirror.defineExtension("findMatchingBracket", function (pos, config, oldConfig) {
    // Backwards-compatibility kludge
    if (oldConfig || typeof config == "boolean") {
      if (!oldConfig) {
        config = config ? {
          strict: true
        } : null;
      } else {
        oldConfig.strict = config;
        config = oldConfig;
      }
    }

    return findMatchingBracket(this, pos, config);
  });
  CodeMirror.defineExtension("scanForBracket", function (pos, dir, style, config) {
    return scanForBracket(this, pos, dir, style, config);
  });
}

function lint(CodeMirror) {
  var GUTTER_ID = "CodeMirror-lint-markers";
  var LINT_LINE_ID = "CodeMirror-lint-line-";

  function showTooltip(cm, e, content) {
    var tt = document.createElement("div");
    tt.className = "CodeMirror-lint-tooltip cm-s-" + cm.options.theme;
    tt.appendChild(content.cloneNode(true));
    if (cm.state.lint.options.selfContain) cm.getWrapperElement().appendChild(tt);else document.body.appendChild(tt);

    function position(e) {
      if (!tt.parentNode) return CodeMirror.off(document, "mousemove", position);
      tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + "px";
      tt.style.left = e.clientX + 5 + "px";
    }

    CodeMirror.on(document, "mousemove", position);
    position(e);
    if (tt.style.opacity != null) tt.style.opacity = 1;
    return tt;
  }

  function rm(elt) {
    if (elt.parentNode) elt.parentNode.removeChild(elt);
  }

  function hideTooltip(tt) {
    if (!tt.parentNode) return;
    if (tt.style.opacity == null) rm(tt);
    tt.style.opacity = 0;
    setTimeout(function () {
      rm(tt);
    }, 600);
  }

  function showTooltipFor(cm, e, content, node) {
    var tooltip = showTooltip(cm, e, content);

    function hide() {
      CodeMirror.off(node, "mouseout", hide);

      if (tooltip) {
        hideTooltip(tooltip);
        tooltip = null;
      }
    }

    var poll = setInterval(function () {
      if (tooltip) for (var n = node;; n = n.parentNode) {
        if (n && n.nodeType == 11) n = n.host;
        if (n == document.body) return;

        if (!n) {
          hide();
          break;
        }
      }
      if (!tooltip) return clearInterval(poll);
    }, 400);
    CodeMirror.on(node, "mouseout", hide);
  }

  function LintState(cm, conf, hasGutter) {
    this.marked = [];
    if (conf instanceof Function) conf = {
      getAnnotations: conf
    };
    if (!conf || conf === true) conf = {};
    this.options = {};
    this.linterOptions = conf.options || {};

    for (var prop in defaults) this.options[prop] = defaults[prop];

    for (var prop in conf) {
      if (defaults.hasOwnProperty(prop)) {
        if (conf[prop] != null) this.options[prop] = conf[prop];
      } else if (!conf.options) {
        this.linterOptions[prop] = conf[prop];
      }
    }

    this.timeout = null;
    this.hasGutter = hasGutter;

    this.onMouseOver = function (e) {
      onMouseOver(cm, e);
    };

    this.waitingFor = 0;
  }

  var defaults = {
    highlightLines: false,
    tooltips: true,
    delay: 500,
    lintOnChange: true,
    getAnnotations: null,
    async: false,
    selfContain: null,
    formatAnnotation: null,
    onUpdateLinting: null
  };

  function clearMarks(cm) {
    var state = cm.state.lint;
    if (state.hasGutter) cm.clearGutter(GUTTER_ID);
    if (state.options.highlightLines) clearErrorLines(cm);

    for (var i = 0; i < state.marked.length; ++i) state.marked[i].clear();

    state.marked.length = 0;
  }

  function clearErrorLines(cm) {
    cm.eachLine(function (line) {
      var has = line.wrapClass && /\bCodeMirror-lint-line-\w+\b/.exec(line.wrapClass);
      if (has) cm.removeLineClass(line, "wrap", has[0]);
    });
  }

  function makeMarker(cm, labels, severity, multiple, tooltips) {
    var marker = document.createElement("div"),
        inner = marker;
    marker.className = "CodeMirror-lint-marker CodeMirror-lint-marker-" + severity;

    if (multiple) {
      inner = marker.appendChild(document.createElement("div"));
      inner.className = "CodeMirror-lint-marker CodeMirror-lint-marker-multiple";
    }

    if (tooltips != false) CodeMirror.on(inner, "mouseover", function (e) {
      showTooltipFor(cm, e, labels, inner);
    });
    return marker;
  }

  function getMaxSeverity(a, b) {
    if (a == "error") return a;else return b;
  }

  function groupByLine(annotations) {
    var lines = [];

    for (var i = 0; i < annotations.length; ++i) {
      var ann = annotations[i],
          line = ann.from.line;
      (lines[line] || (lines[line] = [])).push(ann);
    }

    return lines;
  }

  function annotationTooltip(ann) {
    var severity = ann.severity;
    if (!severity) severity = "error";
    var tip = document.createElement("div");
    tip.className = "CodeMirror-lint-message CodeMirror-lint-message-" + severity;

    if (typeof ann.messageHTML != 'undefined') {
      tip.innerHTML = ann.messageHTML;
    } else {
      tip.appendChild(document.createTextNode(ann.message));
    }

    return tip;
  }

  function lintAsync(cm, getAnnotations) {
    var state = cm.state.lint;
    var id = ++state.waitingFor;

    function abort() {
      id = -1;
      cm.off("change", abort);
    }

    cm.on("change", abort);
    getAnnotations(cm.getValue(), function (annotations, arg2) {
      cm.off("change", abort);
      if (state.waitingFor != id) return;
      if (arg2 && annotations instanceof CodeMirror) annotations = arg2;
      cm.operation(function () {
        updateLinting(cm, annotations);
      });
    }, state.linterOptions, cm);
  }

  function startLinting(cm) {
    var state = cm.state.lint;
    if (!state) return;
    var options = state.options;
    /*
     * Passing rules in `options` property prevents JSHint (and other linters) from complaining
     * about unrecognized rules like `onUpdateLinting`, `delay`, `lintOnChange`, etc.
     */

    var getAnnotations = options.getAnnotations || cm.getHelper(CodeMirror.Pos(0, 0), "lint");
    if (!getAnnotations) return;

    if (options.async || getAnnotations.async) {
      lintAsync(cm, getAnnotations);
    } else {
      var annotations = getAnnotations(cm.getValue(), state.linterOptions, cm);
      if (!annotations) return;
      if (annotations.then) annotations.then(function (issues) {
        cm.operation(function () {
          updateLinting(cm, issues);
        });
      });else cm.operation(function () {
        updateLinting(cm, annotations);
      });
    }
  }

  function updateLinting(cm, annotationsNotSorted) {
    var state = cm.state.lint;
    if (!state) return;
    var options = state.options;
    clearMarks(cm);
    var annotations = groupByLine(annotationsNotSorted);

    for (var line = 0; line < annotations.length; ++line) {
      var anns = annotations[line];
      if (!anns) continue; // filter out duplicate messages

      var message = [];
      anns = anns.filter(function (item) {
        return message.indexOf(item.message) > -1 ? false : message.push(item.message);
      });
      var maxSeverity = null;
      var tipLabel = state.hasGutter && document.createDocumentFragment();

      for (var i = 0; i < anns.length; ++i) {
        var ann = anns[i];
        var severity = ann.severity;
        if (!severity) severity = "error";
        maxSeverity = getMaxSeverity(maxSeverity, severity);
        if (options.formatAnnotation) ann = options.formatAnnotation(ann);
        if (state.hasGutter) tipLabel.appendChild(annotationTooltip(ann));
        if (ann.to) state.marked.push(cm.markText(ann.from, ann.to, {
          className: "CodeMirror-lint-mark CodeMirror-lint-mark-" + severity,
          __annotation: ann
        }));
      } // use original annotations[line] to show multiple messages


      if (state.hasGutter) cm.setGutterMarker(line, GUTTER_ID, makeMarker(cm, tipLabel, maxSeverity, annotations[line].length > 1, options.tooltips));
      if (options.highlightLines) cm.addLineClass(line, "wrap", LINT_LINE_ID + maxSeverity);
    }

    if (options.onUpdateLinting) options.onUpdateLinting(annotationsNotSorted, annotations, cm);
  }

  function onChange(cm) {
    var state = cm.state.lint;
    if (!state) return;
    clearTimeout(state.timeout);
    state.timeout = setTimeout(function () {
      startLinting(cm);
    }, state.options.delay);
  }

  function popupTooltips(cm, annotations, e) {
    var target = e.target || e.srcElement;
    var tooltip = document.createDocumentFragment();

    for (var i = 0; i < annotations.length; i++) {
      var ann = annotations[i];
      tooltip.appendChild(annotationTooltip(ann));
    }

    showTooltipFor(cm, e, tooltip, target);
  }

  function onMouseOver(cm, e) {
    var target = e.target || e.srcElement;
    if (!/\bCodeMirror-lint-mark-/.test(target.className)) return;
    var box = target.getBoundingClientRect(),
        x = (box.left + box.right) / 2,
        y = (box.top + box.bottom) / 2;
    var spans = cm.findMarksAt(cm.coordsChar({
      left: x,
      top: y
    }, "client"));
    var annotations = [];

    for (var i = 0; i < spans.length; ++i) {
      var ann = spans[i].__annotation;
      if (ann) annotations.push(ann);
    }

    if (annotations.length) popupTooltips(cm, annotations, e);
  }

  CodeMirror.defineOption("lint", false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
      clearMarks(cm);
      if (cm.state.lint.options.lintOnChange !== false) cm.off("change", onChange);
      CodeMirror.off(cm.getWrapperElement(), "mouseover", cm.state.lint.onMouseOver);
      clearTimeout(cm.state.lint.timeout);
      delete cm.state.lint;
    }

    if (val) {
      var gutters = cm.getOption("gutters"),
          hasLintGutter = false;

      for (var i = 0; i < gutters.length; ++i) if (gutters[i] == GUTTER_ID) hasLintGutter = true;

      var state = cm.state.lint = new LintState(cm, val, hasLintGutter);
      if (state.options.lintOnChange) cm.on("change", onChange);
      if (state.options.tooltips != false && state.options.tooltips != "gutter") CodeMirror.on(cm.getWrapperElement(), "mouseover", state.onMouseOver);
      startLinting(cm);
    }
  });
  CodeMirror.defineExtension("performLint", function () {
    startLinting(this);
  });
}

xquery(CodeMirror);
css(CodeMirror);
xml(CodeMirror);
stex(CodeMirror);
placeholder(CodeMirror);
matchbrackets(CodeMirror);
lint(CodeMirror);

async function loadTheme(theme) {
  const resource = resolveURL('../css/codemirror/') + `${theme}.css`;
  console.log('<pb-code-editor> loading theme %s from %s', theme, resource);
  const fetchedStyles = await fetch(resource).then(async response => response.text()).catch(e => '');
  return html$1`<style>${fetchedStyles}</style>`;
}
/**
 * A wrapper for the popular codemirror code editor.
 *
 *
 * @customElement
 * @demo demo/pb-code-editor.html
 */


class PbCodeEditor extends LitElement {
  static get styles() {
    return css$1`
            :host {
                display: block;
                width: 100%;
                margin: 0;
                position: relative;
                color:inherit;
            }

            #editorDiv, .CodeMirror {
              width: 100%;
            }

            .label {
                color: var(--paper-grey-500);
                margin-bottom:5px;
            }

            /* BASICS */

            .CodeMirror {
                /* Set height, width, borders, and global font properties here */
                font-family: monospace;
                height: auto;
                color: black;
                direction: ltr;
            }

            /* PADDING */

            .CodeMirror-lines {
                padding: 4px 0; /* Vertical padding around content */
            }
            .CodeMirror pre.CodeMirror-line,
            .CodeMirror pre.CodeMirror-line-like {
                padding: 0 4px; /* Horizontal padding of content */
            }

            .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
                background-color: white; /* The little square between H and V scrollbars */
            }

            /* GUTTER */

            .CodeMirror-gutters {
                border-right: 1px solid #ddd;
                background-color: #f7f7f7;
                white-space: nowrap;
            }
            .CodeMirror-linenumbers {}
            .CodeMirror-linenumber {
                padding: 0 3px 0 5px;
                min-width: 20px;
                text-align: right;
                color: #999;
                white-space: nowrap;
            }

            .CodeMirror-guttermarker { color: black; }
            .CodeMirror-guttermarker-subtle { color: #999; }

            /* CURSOR */

            .CodeMirror-cursor {
                border-left: 1px solid black;
                border-right: none;
                width: 0;
            }
            /* Shown when moving in bi-directional text */
            .CodeMirror div.CodeMirror-secondarycursor {
                border-left: 1px solid silver;
            }
            .cm-fat-cursor .CodeMirror-cursor {
                width: auto;
                border: 0 !important;
                background: #7e7;
            }
            .cm-fat-cursor div.CodeMirror-cursors {
                z-index: 1;
            }
            .cm-fat-cursor-mark {
                background-color: rgba(20, 255, 20, 0.5);
                -webkit-animation: blink 1.06s steps(1) infinite;
                -moz-animation: blink 1.06s steps(1) infinite;
                animation: blink 1.06s steps(1) infinite;
            }
            .cm-animate-fat-cursor {
                width: auto;
                border: 0;
                -webkit-animation: blink 1.06s steps(1) infinite;
                -moz-animation: blink 1.06s steps(1) infinite;
                animation: blink 1.06s steps(1) infinite;
                background-color: #7e7;
            }
            @-moz-keyframes blink {
                0% {}
                50% { background-color: transparent; }
                100% {}
            }
            @-webkit-keyframes blink {
                0% {}
                50% { background-color: transparent; }
                100% {}
            }
            @keyframes blink {
                0% {}
                50% { background-color: transparent; }
                100% {}
            }

            /* Can style cursor different in overwrite (non-insert) mode */
            .CodeMirror-overwrite .CodeMirror-cursor {}

            .cm-tab { display: inline-block; text-decoration: inherit; }

            .CodeMirror-rulers {
                position: absolute;
                left: 0; right: 0; top: -50px; bottom: 0;
                overflow: hidden;
            }
            .CodeMirror-ruler {
                border-left: 1px solid #ccc;
                top: 0; bottom: 0;
                position: absolute;
            }

            /* DEFAULT THEME */

            .cm-s-default .cm-header {color: blue;}
            .cm-s-default .cm-quote {color: #090;}
            .cm-negative {color: #d44;}
            .cm-positive {color: #292;}
            .cm-header, .cm-strong {font-weight: bold;}
            .cm-em {font-style: italic;}
            .cm-link {text-decoration: underline;}
            .cm-strikethrough {text-decoration: line-through;}

            .cm-s-default .cm-keyword {color: #708;}
            .cm-s-default .cm-atom {color: #219;}
            .cm-s-default .cm-number {color: #164;}
            .cm-s-default .cm-def {color: #00f;}
            .cm-s-default .cm-variable,
            .cm-s-default .cm-punctuation,
            .cm-s-default .cm-property,
            .cm-s-default .cm-operator {}
            .cm-s-default .cm-variable-2 {color: #05a;}
            .cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}
            .cm-s-default .cm-comment {color: #a50;}
            .cm-s-default .cm-string {color: #a11;}
            .cm-s-default .cm-string-2 {color: #f50;}
            .cm-s-default .cm-meta {color: #555;}
            .cm-s-default .cm-qualifier {color: #555;}
            .cm-s-default .cm-builtin {color: #30a;}
            .cm-s-default .cm-bracket {color: #997;}
            .cm-s-default .cm-tag {color: #170;}
            .cm-s-default .cm-attribute {color: #00c;}
            .cm-s-default .cm-hr {color: #999;}
            .cm-s-default .cm-link {color: #00c;}

            .cm-s-default .cm-error {color: #f00;}
            .cm-invalidchar {color: #f00;}

            .CodeMirror-composing { border-bottom: 2px solid; }

            /* Default styles for common addons */

            div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}
            div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}
            .CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
            .CodeMirror-activeline-background {background: #e8f2ff;}

            /* STOP */

            /* The rest of this file contains styles related to the mechanics of
            the editor. You probably shouldn't touch them. */

            .CodeMirror {
                position: relative;
                overflow: hidden;
                background: white;
            }

            .CodeMirror-scroll {
                /* 50px is the magic margin used to hide the element's real scrollbars */
                /* See overflow: hidden in .CodeMirror */
                margin-bottom: -50px; margin-right: -50px;
                padding-bottom: 50px;
                max-height: 100%;
                outline: none; /* Prevent dragging from highlighting the element */
                position: relative;
            }
            .CodeMirror-sizer {
                position: relative;
                border-right: 50px solid transparent;
            }

            /* The fake, visible scrollbars. Used to force redraw during scrolling
            before actual scrolling happens, thus preventing shaking and
            flickering artifacts. */
            .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
                position: absolute;
                z-index: 6;
                display: none;
            }
            .CodeMirror-vscrollbar {
                right: 0; top: 0;
                overflow-x: hidden;
                overflow-y: scroll;
            }
            .CodeMirror-hscrollbar {
                bottom: 0; left: 0;
                overflow-y: hidden;
                overflow-x: scroll;
            }
            .CodeMirror-scrollbar-filler {
                right: 0; bottom: 0;
            }
            .CodeMirror-gutter-filler {
                left: 0; bottom: 0;
            }

            .CodeMirror-gutters {
                position: absolute; left: 0; top: 0;
                min-height: 100%;
                z-index: 3;
            }
            .CodeMirror-gutter {
                white-space: normal;
                height: 100%;
                display: inline-block;
                vertical-align: top;
                margin-bottom: -50px;
            }
            .CodeMirror-gutter-wrapper {
                position: absolute;
                z-index: 4;
                background: none !important;
                border: none !important;
            }
            .CodeMirror-gutter-background {
                position: absolute;
                top: 0; bottom: 0;
                z-index: 4;
            }
            .CodeMirror-gutter-elt {
                position: absolute;
                cursor: default;
                z-index: 4;
            }
            .CodeMirror-gutter-wrapper ::selection { background-color: transparent }
            .CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }

            .CodeMirror-lines {
                cursor: text;
                min-height: 1px; /* prevents collapsing before first draw */
            }
            .CodeMirror pre.CodeMirror-line,
            .CodeMirror pre.CodeMirror-line-like {
                /* Reset some styles that the rest of the page might have set */
                -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;
                border-width: 0;
                background: transparent;
                font-family: inherit;
                font-size: inherit;
                margin: 0;
                white-space: pre;
                word-wrap: normal;
                line-height: inherit;
                color: inherit;
                z-index: 2;
                position: relative;
                overflow: visible;
                -webkit-tap-highlight-color: transparent;
                -webkit-font-variant-ligatures: contextual;
                font-variant-ligatures: contextual;
            }
            .CodeMirror-wrap pre.CodeMirror-line,
            .CodeMirror-wrap pre.CodeMirror-line-like {
                word-wrap: break-word;
                white-space: pre-wrap;
                word-break: normal;
            }

            .CodeMirror-linebackground {
                position: absolute;
                left: 0; right: 0; top: 0; bottom: 0;
                z-index: 0;
            }

            .CodeMirror-linewidget {
                position: relative;
                z-index: 2;
                padding: 0.1px; /* Force widget margins to stay inside of the container */
            }

            .CodeMirror-widget {}

            .CodeMirror-rtl pre { direction: rtl; }

            .CodeMirror-code {
                outline: none;
            }

            /* Force content-box sizing for the elements where we expect it */
            .CodeMirror-scroll,
            .CodeMirror-sizer,
            .CodeMirror-gutter,
            .CodeMirror-gutters,
            .CodeMirror-linenumber {
                -moz-box-sizing: content-box;
                box-sizing: content-box;
            }

            .CodeMirror-measure {
                position: absolute;
                width: 100%;
                height: 0;
                overflow: hidden;
                visibility: hidden;
            }

            .CodeMirror-cursor {
                position: absolute;
                pointer-events: none;
            }
            .CodeMirror-measure pre { position: static; }

            div.CodeMirror-cursors {
                visibility: hidden;
                position: relative;
                z-index: 3;
            }
            div.CodeMirror-dragcursors {
                visibility: visible;
            }

            .CodeMirror-focused div.CodeMirror-cursors {
                visibility: visible;
            }

            .CodeMirror-selected { background: #d9d9d9; }
            .CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
            .CodeMirror-crosshair { cursor: crosshair; }
            .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }
            .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

            .cm-searching {
                background-color: #ffa;
                background-color: rgba(255, 255, 0, .4);
            }

            /* Used to force a border model for a node */
            .cm-force-border { padding-right: .1px; }

            @media print {
                /* Hide the cursor when printing */
                .CodeMirror div.CodeMirror-cursors {
                    visibility: hidden;
                }
            }

            /* See issue #2901 */
            .cm-tab-wrap-hack:after { content: ''; }

            /* Help users use markselection to safely style text background */
            span.CodeMirror-selectedtext { background: none; }

            /* The lint marker gutter */
            .CodeMirror-lint-markers {
            width: 16px;
            }

            .CodeMirror-lint-tooltip {
            background-color: #ffd;
            border: 1px solid black;
            border-radius: 4px 4px 4px 4px;
            color: black;
            font-family: monospace;
            font-size: 10pt;
            overflow: hidden;
            padding: 2px 5px;
            position: fixed;
            white-space: pre;
            white-space: pre-wrap;
            z-index: 100;
            max-width: 600px;
            opacity: 0;
            transition: opacity .4s;
            -moz-transition: opacity .4s;
            -webkit-transition: opacity .4s;
            -o-transition: opacity .4s;
            -ms-transition: opacity .4s;
            }

            .CodeMirror-lint-mark-error, .CodeMirror-lint-mark-warning {
            background-position: left bottom;
            background-repeat: repeat-x;
            }

            .CodeMirror-lint-mark-error {
            background-image:
            url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==")
            ;
            }

            .CodeMirror-lint-mark-warning {
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJFhQXEbhTg7YAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAMklEQVQI12NkgIIvJ3QXMjAwdDN+OaEbysDA4MPAwNDNwMCwiOHLCd1zX07o6kBVGQEAKBANtobskNMAAAAASUVORK5CYII=");
            }

            .CodeMirror-lint-marker-error, .CodeMirror-lint-marker-warning {
            background-position: center center;
            background-repeat: no-repeat;
            cursor: pointer;
            display: inline-block;
            height: 16px;
            width: 16px;
            vertical-align: middle;
            position: relative;
            }

            .CodeMirror-lint-message-error, .CodeMirror-lint-message-warning {
            padding-left: 18px;
            background-position: top left;
            background-repeat: no-repeat;
            }

            .CodeMirror-lint-marker-error, .CodeMirror-lint-message-error {
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAHlBMVEW7AAC7AACxAAC7AAC7AAAAAAC4AAC5AAD///+7AAAUdclpAAAABnRSTlMXnORSiwCK0ZKSAAAATUlEQVR42mWPOQ7AQAgDuQLx/z8csYRmPRIFIwRGnosRrpamvkKi0FTIiMASR3hhKW+hAN6/tIWhu9PDWiTGNEkTtIOucA5Oyr9ckPgAWm0GPBog6v4AAAAASUVORK5CYII=");
            }

            .CodeMirror-lint-marker-warning, .CodeMirror-lint-message-warning {
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEX/uwDvrwD/uwD/uwD/uwD/uwD/uwD/uwD/uwD6twD/uwAAAADurwD2tQD7uAD+ugAAAAD/uwDhmeTRAAAADHRSTlMJ8mN1EYcbmiixgACm7WbuAAAAVklEQVR42n3PUQqAIBBFUU1LLc3u/jdbOJoW1P08DA9Gba8+YWJ6gNJoNYIBzAA2chBth5kLmG9YUoG0NHAUwFXwO9LuBQL1giCQb8gC9Oro2vp5rncCIY8L8uEx5ZkAAAAASUVORK5CYII=");
            }

            .CodeMirror-lint-marker-multiple {
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAMAAADzjKfhAAAACVBMVEUAAAAAAAC/v7914kyHAAAAAXRSTlMAQObYZgAAACNJREFUeNo1ioEJAAAIwmz/H90iFFSGJgFMe3gaLZ0od+9/AQZ0ADosbYraAAAAAElFTkSuQmCC");
            background-repeat: no-repeat;
            background-position: right bottom;
            width: 100%; height: 100%;
            }
        `;
  }

  static get properties() {
    return {
      /**
       * reference to actual CodeMirror object
       */
      _editor: {
        type: Object
      },

      /**
       * the code as a string
       */
      code: {
        type: String,
        reflect: true
      },

      /**
       * the language mode e.g. 'javascript' or 'xquery'.
       */
      mode: {
        type: String
      },

      /**
       * placeholder if code is empty
       */
      placeholder: {
        type: String
      },

      /**
       * tab indent size
       */
      tabSize: {
        type: Number
      },

      /**
       * label for the editor
       */
      label: {
        type: String
      },
      theme: {
        type: String
      },
      _themeStyles: {
        type: String
      },
      linter: {
        attribute: true
      },
      apiVersion: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.code = '';
    this.mode = 'javascript';
    this.placeholder = 'odd.editor.model.empty';
    this.tabSize = 2;
    this.label = '';
    this.linter = '';
    this.theme = null;
    this._themeStyles = null;
    this.apiVersion = '0.9.0';
  }

  set theme(value) {
    if (value) {
      loadTheme(value).then(styles => {
        this._themeStyles = styles;

        this._editor.setOption('theme', value);
      });
    }

    this.requestUpdate('_themeStyles', value);
  }

  render() {
    return html$1`
            ${this._themeStyles}
            <iron-ajax id="lint" url="${this.linter}"
               handle-as="json"
               method="POST"
               @error="${this._handleLintError}"></iron-ajax>

            <div class="label">${this.label}</div>
            <div id="editorDiv"></div>
        `;
  }

  attributeChangedCallback(name, old, value) {
    super.attributeChangedCallback(name, old, value);

    if (name === 'code') {
      this.setSource(value);
      this.code = value;
      this.requestUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.placeholder = get(this.placeholder);
    document.addEventListener('pb-i18n-update', ev => {
      this.placeholder = ev.detail.t(this.placeholder);

      if (this._editor) {
        this._editor.setOption('placeholder', this.placeholder);
      }
    });
  }

  async firstUpdated() {
    await this.updateComplete;

    this._initEditor();
  }

  _initEditor() {
    const options = {
      value: this.code || '',
      mode: this.mode,
      lineNumbers: true,
      lineWrapping: true,
      autofocus: false,
      matchBrackets: true,
      placeholder: this.placeholder,
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
      viewportMargin: Infinity
    };

    if (this.theme) {
      options.theme = this.theme;
    }

    const editorDiv = this.shadowRoot.getElementById('editorDiv');
    const cm = CodeMirror(editorDiv, options);
    cm.on('change', () => this.setCode(cm.getValue()));
    this._editor = cm;

    if (this.mode === 'xquery' && this.linter !== '') {
      CodeMirror.registerHelper("lint", "xquery", this.lintXQuery.bind(this));
    }
  }
  /**
   * XQuery linting.
   *
   * calls server-side service for XQuery linting. Will return an array of linting errors or an empty array
   * if code is fine.
   *
   * @param {String} text
   * @returns {Array|Promise}
   */


  lintXQuery(text) {
    if (!text) {
      return [];
    }

    const ajax = this.shadowRoot.getElementById('lint');
    return new Promise(resolve => {
      if (cmpVersion(this.apiVersion, '1.0.0')) {
        ajax.contentType = "application/x-www-form-urlencoded";
        ajax.params = null;
        const params = {
          action: "lint",
          code: text
        };
        ajax.body = params;
      } else {
        ajax.contentType = "text";
        ajax.params = {
          code: text
        };
      }

      const request = ajax.generateRequest();
      request.completes.then(req => {
        const data = req.response;

        if (data.status === 'fail') {
          resolve([{
            message: data.message,
            severity: "error",
            from: CodeMirror.Pos(data.line - 1, data.column),
            to: CodeMirror.Pos(data.line - 1, data.column + 3)
          }]);
        } else {
          resolve([]);
        }
      });
    });
  }
  /**
   *
   * @returns {String} the sourcecode
   */


  getSource() {
    if (!this._editor) {
      return '';
    }

    return this._editor.getValue();
  }
  /**
   * pass code to editor for editing/display.
   *
   * @param {String} newval
   */


  setSource(newval) {
    if (!this._editor || newval === this._editor.getValue()) {
      return;
    }

    const val = newval || '';

    this._editor.setValue(val);

    this._editor.refresh();
  }
  /**
   * call refresh() to update the view after external changes have occured. Might be needed after dynamic
   * changes of the UI.
   */


  refresh() {
    if (!this._editor) return;

    this._editor.refresh();
  }

  setCode(value) {
    this.code = value;
    this.dispatchEvent(new CustomEvent('code-changed', {
      composed: true,
      bubbles: true,
      detail: {
        code: this.code
      }
    }));
  }

  _handleLintError(e) {
    console.error('error while linting: ', e.detail);
    const error = e.detail.error.message;

    if (error.includes('404')) {
      const url = this.shadowRoot.getElementById('lint').url;
      this.dispatchEvent(new CustomEvent('linting-error', {
        composed: true,
        bubbles: true,
        detail: {
          error: 'linting service unavailable',
          url: url
        }
      }));
    } else {
      this.dispatchEvent(new CustomEvent('linting-error', {
        composed: true,
        bubbles: true,
        detail: {
          error: error
        }
      }));
    }
  }

}
customElements.define('pb-code-editor', PbCodeEditor);

/**
 * Show a dialog with buttons. Used by editor.
 *
 *
 * todo:confirmation is only partly implemented needs some method to detect which button was clicked
 * @customElement
 * @polymer
 * @demo demo/pb-message.html
 */

class PbMessage extends LitElement {
  static get styles() {
    return css$1`
            :host {
                display:block;
            }
            
            paper-dialog{
                min-width:300px;
            }
        `;
  }

  static get properties() {
    return {
      /**
       * the dialog box title
       */
      title: {
        type: String,
        reflect: true
      },

      /**
       * type of message. Can be either 'message' or 'confirm'. In case of confirm the buttons 'yes' and 'no'
       * will be shown and the dialog becomes modal.
       */
      type: {
        type: String
      },

      /**
       * main message text to be shown on dialog.
       */
      message: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.type = 'message'; //defaults to 'message'
  }

  render() {
    return html$1`
        <paper-dialog id="modal">
            <h2 id="title">${this.title}</h2>
            <paper-dialog-scrollable id="message" class="message" tabindex="0">${unsafeHTML(this.message)}</paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-confirm="dialog-confirm" autofocus="autofocus" ?hidden="${this.isConfirm()}">${translate('dialogs.close')}</paper-button>
                <paper-button id="confirm" dialog-confirm="dialog-confirm" autofocus="autofocus" ?hidden="${this.isMessage()}">${translate('dialogs.yes')}</paper-button>
                <paper-button id="reject" dialog-confirm="dialog-confirm" autofocus="autofocus" ?hidden="${this.isMessage()}">${translate('dialogs.no')}</paper-button>
            </div>
        </paper-dialog>
        `;
  }

  firstUpdated() {
    // this.shadowRoot.getElementById('modal').open();
    this.modal = this.shadowRoot.getElementById('modal');
  }

  updated() {
    if (this.modal) {
      this.modal.notifyResize();
    }
  }
  /**
   * Open a modal dialog to display a message to the user.
   * 
   * @param {string} title The title of the dialog
   * @param {string} message The message to display in the dialog body
   */


  show(title, message) {
    this.type = 'message';
    this.set(title, message);
    this.modal.noCancelOnOutsideClick = false;
    this.modal.noCancelOnEscKey = false;
    this.modal.open();
  }
  /**
   * Open a modal dialog to prompt the user for confirmation.
   * Returns a promise which will be resolved upon confirmation
   * and rejected otherwise.
   * 
   * @param {string} title The title of the dialog
   * @param {string} message The message to display in the dialog body
   * @returns {Promise} promise which will be resolved upon confirmation and rejected otherwise
   */


  confirm(title, message) {
    this.type = 'confirm';
    this.set(title, message);
    this.modal.noCancelOnOutsideClick = true;
    this.modal.noCancelOnEscKey = true;
    this.modal.open();
    const confirm = this.shadowRoot.getElementById('confirm');
    const cancel = this.shadowRoot.getElementById('reject');
    return new Promise((resolve, reject) => {
      confirm.addEventListener('click', resolve, {
        once: true
      });
      cancel.addEventListener('click', reject, {
        once: true
      });
    });
  }

  set(title, message) {
    if (title || message) {
      if (title) {
        this.title = title;
      }

      if (message) {
        this.message = message;
      }

      this.modal.notifyResize();
    }
  }

  isMessage() {
    return this.type === 'message';
  }

  isConfirm() {
    return this.type === 'confirm';
  }

}
customElements.define('pb-message', PbMessage);

export { DirHelper as D, ElementMixin as E, PaperItemBehavior as P, ThemableMixin as T, pbHotkeys as p, unsafeHTML as u };
//# sourceMappingURL=pb-message-a461d7ee.js.map
