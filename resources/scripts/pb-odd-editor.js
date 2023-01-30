import { h as html, o as PolymerElement, F as FlattenedNodesObserver, D as Debouncer, E as timeOut, H as mixinBehaviors, l as afterNextRender, f as IronResizableBehavior, t as translate, g as get } from './paper-checkbox-ea000977.js';
import { E as ElementMixin, T as ThemableMixin, D as DirHelper, p as pbHotkeys } from './pb-message-a461d7ee.js';
import { d as directive, N as NodePart, e as createMarker, f as reparentNodes, g as removeNodes, A as AttributePart, L as LitElement, c as css, h as html$1, a as cmpVersion, p as pbMixin } from './pb-mixin-ae9e2885.js';

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
// TODO(kschaaf): Refactor into Part API?

const createAndInsertPart = (containerPart, beforePart) => {
  const container = containerPart.startNode.parentNode;
  const beforeNode = beforePart === undefined ? containerPart.endNode : beforePart.startNode;
  const startNode = container.insertBefore(createMarker(), beforeNode);
  container.insertBefore(createMarker(), beforeNode);
  const newPart = new NodePart(containerPart.options);
  newPart.insertAfterNode(startNode);
  return newPart;
};

const updatePart = (part, value) => {
  part.setValue(value);
  part.commit();
  return part;
};

const insertPartBefore = (containerPart, part, ref) => {
  const container = containerPart.startNode.parentNode;
  const beforeNode = ref ? ref.startNode : containerPart.endNode;
  const endNode = part.endNode.nextSibling;

  if (endNode !== beforeNode) {
    reparentNodes(container, part.startNode, endNode, beforeNode);
  }
};

const removePart = part => {
  removeNodes(part.startNode.parentNode, part.startNode, part.endNode.nextSibling);
}; // Helper for generating a map of array item to its index over a subset
// of an array (used to lazily generate `newKeyToIndexMap` and
// `oldKeyToIndexMap`)


const generateMap = (list, start, end) => {
  const map = new Map();

  for (let i = start; i <= end; i++) {
    map.set(list[i], i);
  }

  return map;
}; // Stores previous ordered list of parts and map of key to index


const partListCache = new WeakMap();
const keyListCache = new WeakMap();
/**
 * A directive that repeats a series of values (usually `TemplateResults`)
 * generated from an iterable, and updates those items efficiently when the
 * iterable changes based on user-provided `keys` associated with each item.
 *
 * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
 * meaning previous DOM for a given key is moved into the new position if
 * needed, and DOM will never be reused with values for different keys (new DOM
 * will always be created for new keys). This is generally the most efficient
 * way to use `repeat` since it performs minimum unnecessary work for insertions
 * and removals.
 *
 * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
 * given call to `repeat`. The behavior when two or more items have the same key
 * is undefined.
 *
 * If no `keyFn` is provided, this directive will perform similar to mapping
 * items to values, and DOM will be reused against potentially different items.
 */

const repeat = directive((items, keyFnOrTemplate, template) => {
  let keyFn;

  if (template === undefined) {
    template = keyFnOrTemplate;
  } else if (keyFnOrTemplate !== undefined) {
    keyFn = keyFnOrTemplate;
  }

  return containerPart => {
    if (!(containerPart instanceof NodePart)) {
      throw new Error('repeat can only be used in text bindings');
    } // Old part & key lists are retrieved from the last update
    // (associated with the part for this instance of the directive)


    const oldParts = partListCache.get(containerPart) || [];
    const oldKeys = keyListCache.get(containerPart) || []; // New part list will be built up as we go (either reused from
    // old parts or created for new keys in this update). This is
    // saved in the above cache at the end of the update.

    const newParts = []; // New value list is eagerly generated from items along with a
    // parallel array indicating its key.

    const newValues = [];
    const newKeys = [];
    let index = 0;

    for (const item of items) {
      newKeys[index] = keyFn ? keyFn(item, index) : index;
      newValues[index] = template(item, index);
      index++;
    } // Maps from key to index for current and previous update; these
    // are generated lazily only when needed as a performance
    // optimization, since they are only required for multiple
    // non-contiguous changes in the list, which are less common.


    let newKeyToIndexMap;
    let oldKeyToIndexMap; // Head and tail pointers to old parts and new values

    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1; // Overview of O(n) reconciliation algorithm (general approach
    // based on ideas found in ivi, vue, snabbdom, etc.):
    //
    // * We start with the list of old parts and new values (and
    //   arrays of their respective keys), head/tail pointers into
    //   each, and we build up the new list of parts by updating
    //   (and when needed, moving) old parts or creating new ones.
    //   The initial scenario might look like this (for brevity of
    //   the diagrams, the numbers in the array reflect keys
    //   associated with the old parts or new values, although keys
    //   and parts/values are actually stored in parallel arrays
    //   indexed using the same head/tail pointers):
    //
    //      oldHead v                 v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [ ,  ,  ,  ,  ,  ,  ]
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new
    //                                      item order
    //      newHead ^                 ^ newTail
    //
    // * Iterate old & new lists from both sides, updating,
    //   swapping, or removing parts at the head/tail locations
    //   until neither head nor tail can move.
    //
    // * Example below: keys at head pointers match, so update old
    //   part 0 in-place (no need to move it) and record part 0 in
    //   the `newParts` list. The last thing we do is advance the
    //   `oldHead` and `newHead` pointers (will be reflected in the
    //   next diagram).
    //
    //      oldHead v                 v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
    //                                      & newHead
    //      newHead ^                 ^ newTail
    //
    // * Example below: head pointers don't match, but tail
    //   pointers do, so update part 6 in place (no need to move
    //   it), and record part 6 in the `newParts` list. Last,
    //   advance the `oldTail` and `oldHead` pointers.
    //
    //         oldHead v              v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldTail
    //                                      & newTail
    //         newHead ^              ^ newTail
    //
    // * If neither head nor tail match; next check if one of the
    //   old head/tail items was removed. We first need to generate
    //   the reverse map of new keys to index (`newKeyToIndexMap`),
    //   which is done once lazily as a performance optimization,
    //   since we only hit this case if multiple non-contiguous
    //   changes were made. Note that for contiguous removal
    //   anywhere in the list, the head and tails would advance
    //   from either end and pass each other before we get to this
    //   case and removals would be handled in the final while loop
    //   without needing to generate the map.
    //
    // * Example below: The key at `oldTail` was removed (no longer
    //   in the `newKeyToIndexMap`), so remove that part from the
    //   DOM and advance just the `oldTail` pointer.
    //
    //         oldHead v           v oldTail
    //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
    //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map: remove
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    5 and advance oldTail
    //         newHead ^           ^ newTail
    //
    // * Once head and tail cannot move, any mismatches are due to
    //   either new or moved items; if a new key is in the previous
    //   "old key to old index" map, move the old part to the new
    //   location, otherwise create and insert a new part. Note
    //   that when moving an old part we null its position in the
    //   oldParts array if it lies between the head and tail so we
    //   know to skip it when the pointers get there.
    //
    // * Example below: neither head nor tail match, and neither
    //   were removed; so find the `newHead` key in the
    //   `oldKeyToIndexMap`, and move that old part's DOM into the
    //   next head position (before `oldParts[oldHead]`). Last,
    //   null the part in the `oldPart` array since it was
    //   somewhere in the remaining oldParts still to be scanned
    //   (between the head and tail pointers) so that we know to
    //   skip that old part on future iterations.
    //
    //         oldHead v        v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck: update & move 2
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    into place and advance
    //                                      newHead
    //         newHead ^           ^ newTail
    //
    // * Note that for moves/insertions like the one above, a part
    //   inserted at the head pointer is inserted before the
    //   current `oldParts[oldHead]`, and a part inserted at the
    //   tail pointer is inserted before `newParts[newTail+1]`. The
    //   seeming asymmetry lies in the fact that new parts are
    //   moved into place outside in, so to the right of the head
    //   pointer are old parts, and to the right of the tail
    //   pointer are new parts.
    //
    // * We always restart back from the top of the algorithm,
    //   allowing matching and simple updates in place to
    //   continue...
    //
    // * Example below: the head pointers once again match, so
    //   simply update part 1 and record it in the `newParts`
    //   array.  Last, advance both head pointers.
    //
    //         oldHead v        v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched: update 1
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
    //                                      & newHead
    //            newHead ^        ^ newTail
    //
    // * As mentioned above, items that were moved as a result of
    //   being stuck (the final else clause in the code below) are
    //   marked with null, so we always advance old pointers over
    //   these so we're comparing the next actual old value on
    //   either end.
    //
    // * Example below: `oldHead` is null (already placed in
    //   newParts), so advance `oldHead`.
    //
    //            oldHead v     v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6] <- old head already used:
    //   newParts: [0, 2, 1,  ,  ,  , 6]    advance oldHead
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
    //               newHead ^     ^ newTail
    //
    // * Note it's not critical to mark old parts as null when they
    //   are moved from head to tail or tail to head, since they
    //   will be outside the pointer range and never visited again.
    //
    // * Example below: Here the old tail key matches the new head
    //   key, so the part at the `oldTail` position and move its
    //   DOM to the new head position (before `oldParts[oldHead]`).
    //   Last, advance `oldTail` and `newHead` pointers.
    //
    //               oldHead v  v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]   head: update & move 4,
    //                                     advance oldTail & newHead
    //               newHead ^     ^ newTail
    //
    // * Example below: Old and new head keys match, so update the
    //   old head part in place, and advance the `oldHead` and
    //   `newHead` pointers.
    //
    //               oldHead v oldTail
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance oldHead &
    //                                      newHead
    //                  newHead ^  ^ newTail
    //
    // * Once the new or old pointers move past each other then all
    //   we have left is additions (if old list exhausted) or
    //   removals (if new list exhausted). Those are handled in the
    //   final while loops at the end.
    //
    // * Example below: `oldHead` exceeded `oldTail`, so we're done
    //   with the main loop.  Create the remaining part and insert
    //   it at the new head position, and the update is complete.
    //
    //                   (oldHead > oldTail)
    //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
    //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
    //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
    //                     newHead ^ newTail
    //
    // * Note that the order of the if/else clauses is not
    //   important to the algorithm, as long as the null checks
    //   come first (to ensure we're always working on valid old
    //   parts) and that the final else clause comes last (since
    //   that's where the expensive moves occur). The order of
    //   remaining clauses is is just a simple guess at which cases
    //   will be most common.
    //
    // * TODO(kschaaf) Note, we could calculate the longest
    //   increasing subsequence (LIS) of old items in new position,
    //   and only move those not in the LIS set. However that costs
    //   O(nlogn) time and adds a bit more code, and only helps
    //   make rare types of mutations require fewer moves. The
    //   above handles removes, adds, reversal, swaps, and single
    //   moves of contiguous items in linear time, in the minimum
    //   number of moves. As the number of multiple moves where LIS
    //   might help approaches a random shuffle, the LIS
    //   optimization becomes less helpful, so it seems not worth
    //   the code at this point. Could reconsider if a compelling
    //   case arises.

    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        // `null` means old part at head has already been used
        // below; skip
        oldHead++;
      } else if (oldParts[oldTail] === null) {
        // `null` means old part at tail has already been used
        // below; skip
        oldTail--;
      } else if (oldKeys[oldHead] === newKeys[newHead]) {
        // Old head matches new head; update in place
        newParts[newHead] = updatePart(oldParts[oldHead], newValues[newHead]);
        oldHead++;
        newHead++;
      } else if (oldKeys[oldTail] === newKeys[newTail]) {
        // Old tail matches new tail; update in place
        newParts[newTail] = updatePart(oldParts[oldTail], newValues[newTail]);
        oldTail--;
        newTail--;
      } else if (oldKeys[oldHead] === newKeys[newTail]) {
        // Old head matches new tail; update and move to new tail
        newParts[newTail] = updatePart(oldParts[oldHead], newValues[newTail]);
        insertPartBefore(containerPart, oldParts[oldHead], newParts[newTail + 1]);
        oldHead++;
        newTail--;
      } else if (oldKeys[oldTail] === newKeys[newHead]) {
        // Old tail matches new head; update and move to new head
        newParts[newHead] = updatePart(oldParts[oldTail], newValues[newHead]);
        insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
        oldTail--;
        newHead++;
      } else {
        if (newKeyToIndexMap === undefined) {
          // Lazily generate key-to-index maps, used for removals &
          // moves below
          newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
          oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
        }

        if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
          // Old head is no longer in new list; remove
          removePart(oldParts[oldHead]);
          oldHead++;
        } else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
          // Old tail is no longer in new list; remove
          removePart(oldParts[oldTail]);
          oldTail--;
        } else {
          // Any mismatches at this point are due to additions or
          // moves; see if we have an old part we can reuse and move
          // into place
          const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
          const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;

          if (oldPart === null) {
            // No old part for this value; create a new one and
            // insert it
            const newPart = createAndInsertPart(containerPart, oldParts[oldHead]);
            updatePart(newPart, newValues[newHead]);
            newParts[newHead] = newPart;
          } else {
            // Reuse old part
            newParts[newHead] = updatePart(oldPart, newValues[newHead]);
            insertPartBefore(containerPart, oldPart, oldParts[oldHead]); // This marks the old part as having been used, so that
            // it will be skipped in the first two checks above

            oldParts[oldIndex] = null;
          }

          newHead++;
        }
      }
    } // Add parts for any remaining new values


    while (newHead <= newTail) {
      // For all remaining additions, we insert before last new
      // tail, since old pointers are no longer valid
      const newPart = createAndInsertPart(containerPart, newParts[newTail + 1]);
      updatePart(newPart, newValues[newHead]);
      newParts[newHead++] = newPart;
    } // Remove any remaining unused old parts


    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead++];

      if (oldPart !== null) {
        removePart(oldPart);
      }
    } // Save order of new parts for next round


    partListCache.set(containerPart, newParts);
    keyListCache.set(containerPart, newKeys);
  };
});

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
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
const previousValues = new WeakMap();
/**
 * For AttributeParts, sets the attribute if the value is defined and removes
 * the attribute if the value is undefined.
 *
 * For other part types, this directive is a no-op.
 */

const ifDefined = directive(value => part => {
  const previousValue = previousValues.get(part);

  if (value === undefined && part instanceof AttributePart) {
    // If the value is undefined, remove the attribute, but only if the value
    // was previously defined.
    if (previousValue !== undefined || !previousValues.has(part)) {
      const name = part.committer.name;
      part.committer.element.removeAttribute(name);
    }
  } else if (value !== previousValue) {
    part.setValue(value);
  }

  previousValues.set(part, value);
});

const $_documentContainer = html`<dom-module id="lumo-tab" theme-for="vaadin-tab">
  <template>
    <style>
      :host {
        box-sizing: border-box;
        padding: 0.5rem 0.75rem;
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size-m);
        line-height: var(--lumo-line-height-xs);
        font-weight: 500;
        opacity: 1;
        color: var(--lumo-contrast-60pct);
        transition: 0.15s color, 0.2s transform;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        transform-origin: 50% 100%;
        outline: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden;
        min-width: var(--lumo-size-m);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      :host(:not([orientation="vertical"])) {
        text-align: center;
      }

      :host([orientation="vertical"]) {
        transform-origin: 0% 50%;
        padding: 0.25rem 1rem;
        min-height: var(--lumo-size-m);
        min-width: 0;
      }

      :host(:hover),
      :host([focus-ring]) {
        color: var(--lumo-body-text-color);
      }

      :host([selected]) {
        color: var(--lumo-primary-text-color);
        transition: 0.6s color;
      }

      :host([active]:not([selected])) {
        color: var(--lumo-primary-text-color);
        transition-duration: 0.1s;
      }

      :host::before,
      :host::after {
        content: "";
        position: absolute;
        display: var(--_lumo-tab-marker-display, block);
        bottom: 0;
        left: 50%;
        width: var(--lumo-size-s);
        height: 2px;
        background-color: var(--lumo-contrast-60pct);
        border-radius: var(--lumo-border-radius) var(--lumo-border-radius) 0 0;
        transform: translateX(-50%) scale(0);
        transform-origin: 50% 100%;
        transition: 0.14s transform cubic-bezier(.12, .32, .54, 1);
        will-change: transform;
      }

      :host([selected])::before,
      :host([selected])::after {
        background-color: var(--lumo-primary-color);
      }

      :host([orientation="vertical"])::before,
      :host([orientation="vertical"])::after {
        left: 0;
        bottom: 50%;
        transform: translateY(50%) scale(0);
        width: 2px;
        height: var(--lumo-size-xs);
        border-radius: 0 var(--lumo-border-radius) var(--lumo-border-radius) 0;
        transform-origin: 100% 50%;
      }

      :host::after {
        box-shadow: 0 0 0 4px var(--lumo-primary-color);
        opacity: 0.15;
        transition: 0.15s 0.02s transform, 0.8s 0.17s opacity;
      }

      :host([selected])::before,
      :host([selected])::after {
        transform: translateX(-50%) scale(1);
        transition-timing-function: cubic-bezier(.12, .32, .54, 1.5);
      }

      :host([orientation="vertical"][selected])::before,
      :host([orientation="vertical"][selected])::after {
        transform: translateY(50%) scale(1);
      }

      :host([selected]:not([active]))::after {
        opacity: 0;
      }

      :host(:not([orientation="vertical"])) ::slotted(a[href]) {
        justify-content: center;
      }

      :host ::slotted(a) {
        display: flex;
        width: 100%;
        align-items: center;
        height: 100%;
        margin: -0.5rem -0.75rem;
        padding: 0.5rem 0.75rem;
        outline: none;

        /*
          Override the CSS inherited from \`lumo-color\` and \`lumo-typography\`.
          Note: \`!important\` is needed because of the \`:slotted\` specificity.
        */
        text-decoration: none !important;
        color: inherit !important;
      }

      :host ::slotted(iron-icon) {
        margin: 0 4px;
        width: var(--lumo-icon-size-m);
        height: var(--lumo-icon-size-m);
      }

      /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
      :host ::slotted(iron-icon[icon^="vaadin:"]) {
        padding: 0.25rem;
        box-sizing: border-box !important;
      }

      :host(:not([dir="rtl"])) ::slotted(iron-icon:first-child) {
        margin-left: 0;
      }

      :host(:not([dir="rtl"])) ::slotted(iron-icon:last-child) {
        margin-right: 0;
      }

      :host([theme~="icon-on-top"]) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        text-align: center;
        padding-bottom: 0.5rem;
        padding-top: 0.25rem;
      }

      :host([theme~="icon-on-top"]) ::slotted(a) {
        flex-direction: column;
        align-items: center;
        margin-top: -0.25rem;
        padding-top: 0.25rem;
      }

      :host([theme~="icon-on-top"]) ::slotted(iron-icon) {
        margin: 0;
      }

      /* Disabled */

      :host([disabled]) {
        pointer-events: none;
        opacity: 1;
        color: var(--lumo-disabled-text-color);
      }

      /* Focus-ring */

      :host([focus-ring]) {
        box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
        border-radius: var(--lumo-border-radius);
      }

      /* RTL specific styles */

      :host([dir="rtl"])::before,
      :host([dir="rtl"])::after {
        left: auto;
        right: 50%;
        transform: translateX(50%) scale(0);
      }

      :host([dir="rtl"][selected]:not([orientation="vertical"]))::before,
      :host([dir="rtl"][selected]:not([orientation="vertical"]))::after {
        transform: translateX(50%) scale(1);
      }

      :host([dir="rtl"]) ::slotted(iron-icon:first-child) {
        margin-right: 0;
      }

      :host([dir="rtl"]) ::slotted(iron-icon:last-child) {
        margin-left: 0;
      }

      :host([orientation="vertical"][dir="rtl"]) {
        transform-origin: 100% 50%;
      }

      :host([dir="rtl"][orientation="vertical"])::before,
      :host([dir="rtl"][orientation="vertical"])::after {
        left: auto;
        right: 0;
        border-radius: var(--lumo-border-radius) 0 0 var(--lumo-border-radius);
        transform-origin: 0% 50%;
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer.content);

/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 * @polymerMixin
 */
const ItemMixin = superClass => class VaadinItemMixin extends superClass {
  static get properties() {
    return {
      /**
       * Used for mixin detection because `instanceof` does not work with mixins.
       * e.g. in VaadinListMixin it filters items by using the
       * `element._hasVaadinItemMixin` condition.
       * @type {boolean}
       */
      _hasVaadinItemMixin: {
        value: true
      },

      /**
       * If true, the user cannot interact with this element.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        observer: '_disabledChanged',
        reflectToAttribute: true
      },

      /**
       * If true, the item is in selected state.
       * @type {boolean}
       */
      selected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_selectedChanged'
      },

      /** @private */
      _value: String
    };
  }
  /**
   * @return {string}
   */


  get value() {
    return this._value !== undefined ? this._value : this.textContent.trim();
  }
  /**
   * @param {string} value
   */


  set value(value) {
    this._value = value;
  }
  /** @protected */


  ready() {
    super.ready();
    const attrValue = this.getAttribute('value');

    if (attrValue !== null) {
      this.value = attrValue;
    }

    this.addEventListener('focus', e => this._setFocused(true), true);
    this.addEventListener('blur', e => this._setFocused(false), true);
    this.addEventListener('mousedown', e => {
      this._setActive(this._mousedown = true);

      const mouseUpListener = () => {
        this._setActive(this._mousedown = false);

        document.removeEventListener('mouseup', mouseUpListener);
      };

      document.addEventListener('mouseup', mouseUpListener);
    });
    this.addEventListener('keydown', e => this._onKeydown(e));
    this.addEventListener('keyup', e => this._onKeyup(e));
  }
  /** @protected */


  disconnectedCallback() {
    super.disconnectedCallback(); // in Firefox and Safari, blur does not fire on the element when it is removed,
    // especially between keydown and keyup events, being active at the same time.
    // reproducible in `<vaadin-select>` when closing overlay on select.

    if (this.hasAttribute('active')) {
      this._setFocused(false);
    }
  }
  /** @private */


  _selectedChanged(selected) {
    this.setAttribute('aria-selected', selected);
  }
  /** @private */


  _disabledChanged(disabled) {
    if (disabled) {
      this.selected = false;
      this.setAttribute('aria-disabled', 'true');
      this.blur();
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
  /**
   * @param {boolean} focused
   * @protected
   */


  _setFocused(focused) {
    if (focused) {
      this.setAttribute('focused', '');

      if (!this._mousedown) {
        this.setAttribute('focus-ring', '');
      }
    } else {
      this.removeAttribute('focused');
      this.removeAttribute('focus-ring');

      this._setActive(false);
    }
  }
  /**
   * @param {boolean} active
   * @protected
   */


  _setActive(active) {
    if (active) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }
  /**
   * @param {!KeyboardEvent} event
   * @protected
   */


  _onKeydown(event) {
    if (/^( |SpaceBar|Enter)$/.test(event.key) && !event.defaultPrevented) {
      event.preventDefault();

      this._setActive(true);
    }
  }
  /**
   * @param {!KeyboardEvent} event
   * @protected
   */


  _onKeyup(event) {
    if (this.hasAttribute('active')) {
      this._setActive(false);

      this.click();
    }
  }

};

/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
/**
 * `<vaadin-tab>` is a Web Component providing an accessible and customizable tab.
 *
 * ```
 *   <vaadin-tab>
 *     Tab 1
 *   </vaadin-tab>
 * ```
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `disabled` | Set to a disabled tab | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `selected` | Set when the tab is selected | :host
 * `active` | Set when mousedown or enter/spacebar pressed | :host
 * `orientation` | Set to `horizontal` or `vertical` depending on the direction of items  | :host
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends PolymerElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes ItemMixin
 */

class TabElement extends ElementMixin(ThemableMixin(ItemMixin(PolymerElement))) {
  static get template() {
    return html`
    <slot></slot>
`;
  }

  static get is() {
    return 'vaadin-tab';
  }

  static get version() {
    return '3.2.0';
  }

  ready() {
    super.ready();
    this.setAttribute('role', 'tab');
  }
  /**
   * @param {!KeyboardEvent} event
   * @protected
   */


  _onKeyup(event) {
    const willClick = this.hasAttribute('active');

    super._onKeyup(event);

    if (willClick) {
      const anchor = this.querySelector('a');

      if (anchor) {
        anchor.click();
      }
    }
  }

}

customElements.define(TabElement.is, TabElement);

const $_documentContainer$1 = html`<dom-module id="lumo-tabs" theme-for="vaadin-tabs">
  <template>
    <style>
      :host {
        -webkit-tap-highlight-color: transparent;
      }

      :host(:not([orientation="vertical"])) {
        box-shadow: inset 0 -1px 0 0 var(--lumo-contrast-10pct);
        position: relative;
        min-height: var(--lumo-size-l);
      }

      :host([orientation="horizontal"]) [part="tabs"] ::slotted(vaadin-tab:not([theme~="icon-on-top"])) {
        justify-content: center;
      }

      :host([orientation="vertical"]) {
        box-shadow: -1px 0 0 0 var(--lumo-contrast-10pct);
      }

      :host([orientation="horizontal"]) [part="tabs"] {
        margin: 0 0.75rem;
      }

      :host([orientation="vertical"]) [part="tabs"] {
        width: 100%;
        margin: 0.5rem 0;
      }

      [part="forward-button"],
      [part="back-button"] {
        position: absolute;
        z-index: 1;
        font-family: lumo-icons;
        color: var(--lumo-tertiary-text-color);
        font-size: var(--lumo-icon-size-m);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5em;
        height: 100%;
        transition: 0.2s opacity;
        top: 0;
      }

      [part="forward-button"]:hover,
      [part="back-button"]:hover {
        color: inherit;
      }

      :host(:not([dir="rtl"])) [part="forward-button"] {
        right: 0;
      }

      [part="forward-button"]::after {
        content: var(--lumo-icons-angle-right);
      }

      [part="back-button"]::after {
        content: var(--lumo-icons-angle-left);
      }

      /* Tabs overflow */

      [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: none;
        -webkit-mask-image: var(--_lumo-tabs-overflow-mask-image);
        /* For IE11 */
        min-height: var(--lumo-size-l);
      }

      /*
        TODO: CSS custom property in \`mask-image\` causes crash in Edge
        see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15415089/
      */
      @-moz-document url-prefix() {
        [part="tabs"] {
          mask-image: var(--_lumo-tabs-overflow-mask-image);
        }
      }

      /* Horizontal tabs overflow */

      /* Both ends overflowing */
      :host([overflow~="start"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(90deg, transparent 2em, #000 4em, #000 calc(100% - 4em), transparent calc(100% - 2em));
      }

      /* End overflowing */
      :host([overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(90deg, #000 calc(100% - 4em), transparent calc(100% - 2em));
      }

      /* Start overflowing */
      :host([overflow~="start"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(90deg, transparent 2em, #000 4em);
      }

      /* Vertical tabs overflow */

      /* Both ends overflowing */
      :host([overflow~="start"][overflow~="end"][orientation="vertical"]) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(transparent, #000 2em, #000 calc(100% - 2em), transparent);
      }

      /* End overflowing */
      :host([overflow~="end"][orientation="vertical"]) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(#000 calc(100% - 2em), transparent);
      }

      /* Start overflowing */
      :host([overflow~="start"][orientation="vertical"]) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(transparent, #000 2em);
      }

      :host [part="tabs"] ::slotted(:not(vaadin-tab)) {
        margin-left: var(--lumo-space-m);
      }

      /* Centered */

      :host([theme~="centered"][orientation="horizontal"]) [part="tabs"] {
        justify-content: center;
      }

      /* Small */

      :host([theme~="small"]),
      :host([theme~="small"]) [part="tabs"] {
        min-height: var(--lumo-size-m);
      }

      :host([theme~="small"]) [part="tabs"] ::slotted(vaadin-tab) {
        font-size: var(--lumo-font-size-s);
      }

      /* Minimal */

      :host([theme~="minimal"]) {
        box-shadow: none;
        /* This doesn't work with ShadyCSS */
        --_lumo-tab-marker-display: none;
      }

      /* Workaround for the above ShadyCSS issue */
      :host([theme~="minimal"]) [part="tabs"] ::slotted(vaadin-tab[selected])::before,
      :host([theme~="minimal"]) [part="tabs"] ::slotted(vaadin-tab[selected])::after {
        display: none;
      }

      /* Hide-scroll-buttons */

      :host([theme~="hide-scroll-buttons"]) [part="back-button"],
      :host([theme~="hide-scroll-buttons"]) [part="forward-button"] {
        display: none;
      }

      :host([theme~="hide-scroll-buttons"][overflow~="start"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(90deg, transparent, #000 2em, #000 calc(100% - 2em), transparent 100%);
      }

      :host([theme~="hide-scroll-buttons"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(90deg, #000 calc(100% - 2em), transparent 100%);
      }

      :host([theme~="hide-scroll-buttons"][overflow~="start"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(90deg, transparent, #000 2em);
      }

      /* Equal-width tabs */
      :host([theme~="equal-width-tabs"]) {
        flex: auto;
      }

      :host([theme~="equal-width-tabs"]) [part="tabs"] ::slotted(vaadin-tab) {
        flex: 1 0 0%;
      }

      /* RTL specific styles */

      :host([dir="rtl"]) [part="forward-button"]::after {
        content: var(--lumo-icons-angle-left);
      }

      :host([dir="rtl"]) [part="back-button"]::after {
        content: var(--lumo-icons-angle-right);
      }

      :host([orientation="vertical"][dir="rtl"]) {
        box-shadow: 1px 0 0 0 var(--lumo-contrast-10pct);
      }

      :host([dir="rtl"]) [part="forward-button"] {
        left: 0;
      }

      :host([dir="rtl"]) [part="tabs"] ::slotted(:not(vaadin-tab)) {
        margin-left: 0;
        margin-right: var(--lumo-space-m);
      }

      /* Both ends overflowing */
      :host([dir="rtl"][overflow~="start"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(-90deg, transparent 2em, #000 4em, #000 calc(100% - 4em), transparent calc(100% - 2em));
      }

      /* End overflowing */
      :host([dir="rtl"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(-90deg, #000 calc(100% - 4em), transparent calc(100% - 2em));
      }

      /* Start overflowing */
      :host([dir="rtl"][overflow~="start"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(-90deg, transparent 2em, #000 4em);
      }

      :host([dir="rtl"][theme~="hide-scroll-buttons"][overflow~="start"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(-90deg, transparent, #000 2em, #000 calc(100% - 2em), transparent 100%);
      }

      :host([dir="rtl"][theme~="hide-scroll-buttons"][overflow~="end"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(-90deg, #000 calc(100% - 2em), transparent 100%);
      }

      :host([dir="rtl"][theme~="hide-scroll-buttons"][overflow~="start"]:not([orientation="vertical"])) [part="tabs"] {
        --_lumo-tabs-overflow-mask-image: linear-gradient(-90deg, transparent, #000 2em);
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer$1.content);

/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
/**
 * A mixin for `nav` elements, facilitating navigation and selection of childNodes.
 *
 * @polymerMixin
 */

const ListMixin = superClass => class VaadinListMixin extends superClass {
  static get properties() {
    return {
      /**
       * Used for mixin detection because `instanceof` does not work with mixins.
       * @type {boolean}
       */
      _hasVaadinListMixin: {
        value: true
      },

      /**
       * The index of the item selected in the items array.
       * Note: Not updated when used in `multiple` selection mode.
       */
      selected: {
        type: Number,
        reflectToAttribute: true,
        notify: true
      },

      /**
       * Define how items are disposed in the dom.
       * Possible values are: `horizontal|vertical`.
       * It also changes navigation keys from left/right to up/down.
       * @type {!ListOrientation}
       */
      orientation: {
        type: String,
        reflectToAttribute: true,
        value: ''
      },

      /**
       * The list of items from which a selection can be made.
       * It is populated from the elements passed to the light DOM,
       * and updated dynamically when adding or removing items.
       *
       * The item elements must implement `Vaadin.ItemMixin`.
       *
       * Note: unlike `<vaadin-combo-box>`, this property is read-only,
       * so if you want to provide items by iterating array of data,
       * you have to use `dom-repeat` and place it to the light DOM.
       * @type {!Array<!Element> | undefined}
       */
      items: {
        type: Array,
        readOnly: true,
        notify: true
      },

      /**
       * The search buffer for the keyboard selection feature.
       * @private
       */
      _searchBuf: {
        type: String,
        value: ''
      }
    };
  }

  static get observers() {
    return ['_enhanceItems(items, orientation, selected, disabled)'];
  }
  /** @protected */


  ready() {
    super.ready();
    this.addEventListener('keydown', e => this._onKeydown(e));
    this.addEventListener('click', e => this._onClick(e));
    this._observer = new FlattenedNodesObserver(this, info => {
      this._setItems(this._filterItems(Array.from(this.children)));
    });
  }
  /** @private */


  _enhanceItems(items, orientation, selected, disabled) {
    if (!disabled) {
      if (items) {
        this.setAttribute('aria-orientation', orientation || 'vertical');
        this.items.forEach(item => {
          orientation ? item.setAttribute('orientation', orientation) : item.removeAttribute('orientation');
          item.updateStyles();
        });

        this._setFocusable(selected);

        const itemToSelect = items[selected];
        items.forEach(item => item.selected = item === itemToSelect);

        if (itemToSelect && !itemToSelect.disabled) {
          this._scrollToItem(selected);
        }
      }
    }
  }
  /**
   * @return {Element}
   */


  get focused() {
    return this.getRootNode().activeElement;
  }
  /**
   * @param {!Array<!Element>} array
   * @return {!Array<!Element>}
   * @protected
   */


  _filterItems(array) {
    return array.filter(e => e._hasVaadinItemMixin);
  }
  /**
   * @param {!MouseEvent} event
   * @protected
   */


  _onClick(event) {
    if (event.metaKey || event.shiftKey || event.ctrlKey || event.defaultPrevented) {
      return;
    }

    const item = this._filterItems(event.composedPath())[0];

    let idx;

    if (item && !item.disabled && (idx = this.items.indexOf(item)) >= 0) {
      this.selected = idx;
    }
  }
  /**
   * @param {number} currentIdx
   * @param {string} key
   * @return {number}
   * @protected
   */


  _searchKey(currentIdx, key) {
    this._searchReset = Debouncer.debounce(this._searchReset, timeOut.after(500), () => this._searchBuf = '');
    this._searchBuf += key.toLowerCase();
    const increment = 1;

    const condition = item => !(item.disabled || this._isItemHidden(item)) && item.textContent.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().indexOf(this._searchBuf) === 0;

    if (!this.items.some(item => item.textContent.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().indexOf(this._searchBuf) === 0)) {
      this._searchBuf = key.toLowerCase();
    }

    const idx = this._searchBuf.length === 1 ? currentIdx + 1 : currentIdx;
    return this._getAvailableIndex(idx, increment, condition);
  }
  /**
   * @return {boolean}
   * @protected
   */


  get _isRTL() {
    return !this._vertical && this.getAttribute('dir') === 'rtl';
  }
  /**
   * @param {!KeyboardEvent} event
   * @protected
   */


  _onKeydown(event) {
    if (event.metaKey || event.ctrlKey) {
      return;
    } // IE names for arrows do not include the Arrow prefix


    const key = event.key.replace(/^Arrow/, '');
    const currentIdx = this.items.indexOf(this.focused);

    if (/[a-zA-Z0-9]/.test(key) && key.length === 1) {
      const idx = this._searchKey(currentIdx, key);

      if (idx >= 0) {
        this._focus(idx);
      }

      return;
    }

    const condition = item => !(item.disabled || this._isItemHidden(item));

    let idx, increment;
    const dirIncrement = this._isRTL ? -1 : 1;

    if (this._vertical && key === 'Up' || !this._vertical && key === 'Left') {
      increment = -dirIncrement;
      idx = currentIdx - dirIncrement;
    } else if (this._vertical && key === 'Down' || !this._vertical && key === 'Right') {
      increment = dirIncrement;
      idx = currentIdx + dirIncrement;
    } else if (key === 'Home') {
      increment = 1;
      idx = 0;
    } else if (key === 'End') {
      increment = -1;
      idx = this.items.length - 1;
    }

    idx = this._getAvailableIndex(idx, increment, condition);

    if (idx >= 0) {
      this._focus(idx);

      event.preventDefault();
    }
  }
  /**
   * @param {number} idx
   * @param {number} increment
   * @param {function(!Element):boolean} condition
   * @return {number}
   * @protected
   */


  _getAvailableIndex(idx, increment, condition) {
    const totalItems = this.items.length;

    for (let i = 0; typeof idx == 'number' && i < totalItems; i++, idx += increment || 1) {
      if (idx < 0) {
        idx = totalItems - 1;
      } else if (idx >= totalItems) {
        idx = 0;
      }

      const item = this.items[idx];

      if (condition(item)) {
        return idx;
      }
    }

    return -1;
  }
  /**
   * @param {!Element} item
   * @return {boolean}
   * @protected
   */


  _isItemHidden(item) {
    return getComputedStyle(item).display === 'none';
  }
  /**
   * @param {number} idx
   * @protected
   */


  _setFocusable(idx) {
    idx = this._getAvailableIndex(idx, 1, item => !item.disabled);
    const item = this.items[idx] || this.items[0];
    this.items.forEach(e => e.tabIndex = e === item ? 0 : -1);
  }
  /**
   * @param {number} idx
   * @protected
   */


  _focus(idx) {
    const item = this.items[idx];
    this.items.forEach(e => e.focused = e === item);

    this._setFocusable(idx);

    this._scrollToItem(idx);

    item.focus();
  }

  focus() {
    // In initialisation (e.g vaadin-select) observer might not been run yet.
    this._observer && this._observer.flush();
    const firstItem = this.querySelector('[tabindex="0"]') || (this.items ? this.items[0] : null);
    firstItem && firstItem.focus();
  }
  /**
   * @return {!HTMLElement}
   * @protected
   */


  get _scrollerElement() {// Returning scroller element of the component
  }
  /**
   * Scroll the container to have the next item by the edge of the viewport.
   * @param {number} idx
   * @protected
   */


  _scrollToItem(idx) {
    const item = this.items[idx];

    if (!item) {
      return;
    }

    const props = this._vertical ? ['top', 'bottom'] : this._isRTL ? ['right', 'left'] : ['left', 'right'];

    const scrollerRect = this._scrollerElement.getBoundingClientRect();

    const nextItemRect = (this.items[idx + 1] || item).getBoundingClientRect();
    const prevItemRect = (this.items[idx - 1] || item).getBoundingClientRect();
    let scrollDistance = 0;

    if (!this._isRTL && nextItemRect[props[1]] >= scrollerRect[props[1]] || this._isRTL && nextItemRect[props[1]] <= scrollerRect[props[1]]) {
      scrollDistance = nextItemRect[props[1]] - scrollerRect[props[1]];
    } else if (!this._isRTL && prevItemRect[props[0]] <= scrollerRect[props[0]] || this._isRTL && prevItemRect[props[0]] >= scrollerRect[props[0]]) {
      scrollDistance = prevItemRect[props[0]] - scrollerRect[props[0]];
    }

    this._scroll(scrollDistance);
  }
  /**
   * @return {boolean}
   * @protected
   */


  get _vertical() {
    return this.orientation !== 'horizontal';
  }
  /**
   * @param {number} pixels
   * @protected
   */


  _scroll(pixels) {
    if (this._vertical) {
      this._scrollerElement['scrollTop'] += pixels;
    } else {
      const scrollType = DirHelper.detectScrollType();
      const scrollLeft = DirHelper.getNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', this._scrollerElement) + pixels;
      DirHelper.setNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', this._scrollerElement, scrollLeft);
    }
  }
  /**
   * Fired when the selection is changed.
   * Not fired when used in `multiple` selection mode.
   *
   * @event selected-changed
   * @param {Object} detail
   * @param {Object} detail.value the index of the item selected in the items array.
   */


};

/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
const safari10 = /Apple.* Version\/(9|10)/.test(navigator.userAgent);
/**
 * `<vaadin-tabs>` is a Web Component for easy switching between different views.
 *
 * ```
 *   <vaadin-tabs selected="4">
 *     <vaadin-tab>Page 1</vaadin-tab>
 *     <vaadin-tab>Page 2</vaadin-tab>
 *     <vaadin-tab>Page 3</vaadin-tab>
 *     <vaadin-tab>Page 4</vaadin-tab>
 *   </vaadin-tabs>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|--------------------------------------
 * `back-button`     | Button for moving the scroll back
 * `tabs`            | The tabs container
 * `forward-button`  | Button for moving the scroll forward
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `orientation` | Tabs disposition, valid values are `horizontal` and `vertical`. | :host
 * `overflow` | It's set to `start`, `end`, none or both. | :host
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends PolymerElement
 * @mixes ElementMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @demo demo/index.html
 */

class TabsElement extends ElementMixin(ListMixin(ThemableMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)))) {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        align-items: center;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host([orientation="vertical"]) {
        display: block;
      }

      :host([orientation="horizontal"]) [part="tabs"] {
        flex-grow: 1;
        display: flex;
        align-self: stretch;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
      }

      /* This seems more future-proof than \`overflow: -moz-scrollbars-none\` which is marked obsolete
         and is no longer guaranteed to work:
         https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#Mozilla_Extensions */
      @-moz-document url-prefix() {
        :host([orientation="horizontal"]) [part="tabs"] {
          overflow: hidden;
        }
      }

      :host([orientation="horizontal"]) [part="tabs"]::-webkit-scrollbar {
        display: none;
      }

      :host([orientation="vertical"]) [part="tabs"] {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      [part="back-button"],
      [part="forward-button"] {
        pointer-events: none;
        opacity: 0;
        cursor: default;
      }

      :host([overflow~="start"]) [part="back-button"],
      :host([overflow~="end"]) [part="forward-button"] {
        pointer-events: auto;
        opacity: 1;
      }

      [part="back-button"]::after {
        content: '◀';
      }

      [part="forward-button"]::after {
        content: '▶';
      }

      :host([orientation="vertical"]) [part="back-button"],
      :host([orientation="vertical"]) [part="forward-button"] {
        display: none;
      }

      /* RTL specific styles */

      :host([dir="rtl"]) [part="back-button"]::after {
        content: '▶';
      }

      :host([dir="rtl"]) [part="forward-button"]::after {
        content: '◀';
      }
    </style>
    <div on-click="_scrollBack" part="back-button"></div>

    <div id="scroll" part="tabs">
      <slot></slot>
    </div>

    <div on-click="_scrollForward" part="forward-button"></div>
`;
  }

  static get is() {
    return 'vaadin-tabs';
  }

  static get version() {
    return '3.2.0';
  }

  static get properties() {
    return {
      /**
       * Set tabs disposition. Possible values are `horizontal|vertical`
       * @type {!ListOrientation}
       */
      orientation: {
        value: 'horizontal',
        type: String
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number
      }
    };
  }

  static get observers() {
    return ['_updateOverflow(items.*, vertical)'];
  }

  ready() {
    super.ready();
    this.addEventListener('iron-resize', () => this._updateOverflow());

    this._scrollerElement.addEventListener('scroll', () => this._updateOverflow());

    this.setAttribute('role', 'tablist'); // Wait for the vaadin-tab elements to upgrade and get styled

    afterNextRender(this, () => {
      this._updateOverflow();
    });
  }
  /** @private */


  _scrollForward() {
    this._scroll(-this.__direction * this._scrollOffset);
  }
  /** @private */


  _scrollBack() {
    this._scroll(this.__direction * this._scrollOffset);
  }
  /**
   * @return {number}
   * @protected
   */


  get _scrollOffset() {
    return this._vertical ? this._scrollerElement.offsetHeight : this._scrollerElement.offsetWidth;
  }
  /**
   * @return {!HTMLElement}
   * @protected
   */


  get _scrollerElement() {
    return this.$.scroll;
  }
  /** @private */


  get __direction() {
    return !this._vertical && this.getAttribute('dir') === 'rtl' ? 1 : -1;
  }
  /** @private */


  _updateOverflow() {
    const scrollPosition = this._vertical ? this._scrollerElement.scrollTop : this.__getNormalizedScrollLeft(this._scrollerElement);
    let scrollSize = this._vertical ? this._scrollerElement.scrollHeight : this._scrollerElement.scrollWidth; // In Edge we need to adjust the size in 1 pixel

    scrollSize -= 1;
    let overflow = scrollPosition > 0 ? 'start' : '';
    overflow += scrollPosition + this._scrollOffset < scrollSize ? ' end' : '';

    if (this.__direction == 1) {
      overflow = overflow.replace(/start|end/gi, matched => {
        return matched === 'start' ? 'end' : 'start';
      });
    }

    overflow ? this.setAttribute('overflow', overflow.trim()) : this.removeAttribute('overflow');

    this._repaintShadowNodesHack();
  }
  /** @private */


  _repaintShadowNodesHack() {
    // Safari 10 has an issue with repainting shadow root element styles when a host attribute changes.
    // Need this workaround (toggle any inline css property on and off) until the issue gets fixed.

    /* istanbul ignore if */
    if (safari10 && this.root) {
      const WEBKIT_PROPERTY = '-webkit-backface-visibility';
      this.root.querySelectorAll('*').forEach(el => {
        el.style[WEBKIT_PROPERTY] = 'visible';
        el.style[WEBKIT_PROPERTY] = '';
      });
    }
  }

}

customElements.define(TabsElement.is, TabsElement);

// @ts-nocheck
/**
 * represents an odd parameter element for editing
 *
 * @customElement
 *
 * @polymer
 */

class PbOddRenditionEditor extends LitElement {
  static get styles() {
    return css`
            :host {
                display: block;
            }
            .wrapper{
                display:grid;
                grid-template-columns:150px auto 50px;
                grid-column-gap:20px;
                grid-row-gap:20px;
                margin-bottom:10px;
            }

            paper-dropdown-menu{
            }
            
            paper-icon-button{
                align-self:center;
            }
        `;
  }

  render() {
    return html$1`
        <div class="wrapper">
            <paper-dropdown-menu label="Scope">
                <paper-listbox id="scopeList" slot="dropdown-content" selected="${this.scope}" attr-for-selected="value"
                    @iron-select="${this._listchanged}">
                      ${this.scopes.map(scope => html$1`
                            <paper-item value="${scope}">${scope}</paper-item>
                        `)}
                </paper-listbox>
            </paper-dropdown-menu>
            <pb-code-editor
                id="editor"
                label="Rendition"
                code="${this.css}"
                mode="css"
                @code-changed="${this._handleCodeChange}"></pb-code-editor>
            <paper-icon-button @click="${this._remove}" icon="delete" title="delete this rendition"></paper-icon-button>
        </div>



        <slot></slot>

        `;
  }

  static get properties() {
    return {
      scopes: {
        type: Array
      },
      css: {
        type: String,
        reflect: true
      },
      scope: {
        type: String,
        reflect: true
      },
      selected: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.scopes = ["", "before", "after"];
    this.css = '';
    this.scope = '';
    this.selected = '';
    this._initialized = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.css = this.css.trim();
    this.dispatchEvent(new CustomEvent('rendition-connected', {
      composed: true,
      bubbles: true,
      detail: {
        target: this
      }
    }));
  }

  firstUpdated(changedProperties) {
    this.refreshEditor();
    this._initialized = true;
  }

  refreshEditor() {
    console.log('refreshEditor');
    const editor = this.shadowRoot.getElementById('editor');

    if (!editor) {
      return;
    }

    editor.refresh();
  }

  _remove(ev) {
    ev.preventDefault();
    this.dispatchEvent(new CustomEvent('remove-rendition', {}));
  }

  _handleCodeChange() {
    this.css = this.shadowRoot.getElementById('editor').getSource();
    this.dispatchEvent(new CustomEvent('rendition-changed', {
      composed: true,
      bubbles: true,
      detail: {
        name: this.name,
        css: this.css,
        scope: this.scope
      }
    }));
  }

  _listchanged(e) {
    const scopelist = this.shadowRoot.getElementById('scopeList');
    this.scope = scopelist.selected;
  }

}
customElements.define('pb-odd-rendition-editor', PbOddRenditionEditor);

// @ts-nocheck
/**
 * represents an odd parameter element for editing
 *
 * @customElement
 *
 * @polymer
 */

class PbOddParameterEditor extends LitElement {
  static get styles() {
    return css`
            :host {
                display: block;
            }
            .wrapper{
                display:grid;
                grid-template-columns:150px auto 50px 50px;
                grid-column-gap:20px;
                grid-row-gap:20px;
                margin-bottom:10px;
            }
            paper-dropdown-menu{
                align-self:start;
            }
            paper-icon-button, paper-checkbox {
                align-self: center;
                margin-top: 16px;
            }
        `;
  }

  render() {
    return html$1`
        <div class="wrapper">
            
            <paper-autocomplete id="combo" text="${this.name}" placeholder="${translate('odd.editor.model.param-name-placeholder')}" label="Name" 
                .source="${this._currentParameters}"></paper-autocomplete>

            <pb-code-editor id="editor"
                        label="Parameter"
                        mode="xquery"
                        code="${this.value}"
                        linter="${this.endpoint}/${cmpVersion(this.apiVersion, '1.0.0') ? 'modules/editor.xql' : 'api/lint'}"
                        apiVersion="${this.apiVersion}"></pb-code-editor>
            <paper-checkbox id="set" ?checked="${this.setParam}" @change="${this._handleCodeChange}">${translate('odd.editor.model.set-param')}</paper-checkbox>
            <paper-icon-button @click="${this._delete}" icon="delete" title="delete this parameter"></paper-icon-button>
        </div>

        
        `;
  }

  static get properties() {
    return {
      /**
       * the parameter name
       */
      name: {
        type: String,
        reflect: true
      },

      /**
       * the parameter value
       */
      value: {
        type: String,
        reflect: true
      },
      behaviour: {
        type: String
      },
      parameters: {
        type: Object
      },
      setParam: {
        type: Boolean,
        attribute: 'set'
      },
      _currentParameters: {
        type: Array
      },
      endpoint: {
        type: String
      },
      apiVersion: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.name = '';
    this.value = '';
    this.setParam = false;
    this.behaviour = '';
    this.currentParameters = [];
    this.parameters = {
      '': [],
      alternate: ["default", "alternate", "persistent"],
      anchor: ["content", "id"],
      block: ["content"],
      body: ["content"],
      break: ["content", "type", "label"],
      cell: ["content"],
      cit: ["content", "source"],
      "document": ["content"],
      figure: ["content", "title"],
      graphic: ["content", "url", "width", "height", "scale", "title"],
      heading: ["content", "level"],
      inline: ["content"],
      link: ["content", "uri", "target"],
      list: ["content", "type"],
      listItem: ["content", "n"],
      metadata: ["content"],
      note: ["content", "place", "label"],
      omit: [],
      paragraph: ["content"],
      row: ["content"],
      section: ["content"],
      table: ["content"],
      text: ["content"],
      title: ["content"],
      webcomponent: ["content", "name"]
    };
    this.selected = '';
    this.endpoint = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.value = this.value.trim();
    this.dispatchEvent(new CustomEvent('parameter-connected', {
      composed: true,
      bubbles: true,
      detail: {
        target: this
      }
    }));
  }

  attributeChangedCallback(name, old, value) {
    super.attributeChangedCallback(name, old, value);

    if (name === 'behaviour') {
      this._currentParameters = this.parameters[value];
    }
  }

  firstUpdated(changedProperties) {
    // console.log('parameters firstupdated ', changedProperties);
    this.selected = this.parameters[this.behaviour] || [];
    this.requestUpdate();
    this.shadowRoot.getElementById('combo').addEventListener('focused-changed', this._handleCodeChange.bind(this));
    this.shadowRoot.getElementById('editor').addEventListener('code-changed', this._handleCodeChange.bind(this));
  }

  refreshEditor() {
    // console.log('parameters refresh');
    const editor = this.shadowRoot.getElementById('editor');

    if (!editor) {
      return;
    }

    editor.refresh();
  }

  _delete(ev) {
    console.log('parameter delete ', ev);
    ev.preventDefault();
    this.dispatchEvent(new CustomEvent('parameter-remove', {}));
  }
  /*
      _handleChange(e) {
          console.log('_handleChange ', e);
          this.value = this.shadowRoot.getElementById('editor').getSource();
          this.dispatchEvent(new CustomEvent('parameter-changed', {composed:true, bubbles:true, detail: {name: this.name, value: this.value}}));
  
      }
  */


  _handleCodeChange(e) {
    console.log('_handleCodeChange ', e);
    this.value = this.shadowRoot.getElementById('editor').getSource();
    this.name = this.shadowRoot.getElementById('combo').text;
    this.setParam = this.shadowRoot.getElementById('set').checked;
    this.dispatchEvent(new CustomEvent('parameter-changed', {
      composed: true,
      bubbles: true,
      detail: {
        name: this.name,
        value: this.value,
        set: this.setParam
      }
    }));
  }

}
customElements.define('pb-odd-parameter-editor', PbOddParameterEditor);

// @ts-nocheck
/**
 * represents an odd model element for editing
 *
 * @customElement
 *
 * @polymer
 */

class PbOddModelEditor extends LitElement {
  static get styles() {
    return css`
            :host {
                display: flex;
                flex-direction:column;
            }
            h1, h2, h3, h4, h5, h6 {
                font-family: "Oswald", Verdana, "Helvetica", sans-serif;
                font-weight: 400 !important;
            }

            form {
                margin-bottom: 8px;
            }

            paper-input, paper-autocomplete {
                margin-bottom: 16px;
            }

            .models {
                margin-left:20px;
                margin-top:10px;
            }

            .btn, .btn-group {
                margin-top: 0;
                margin-bottom: 0;
            }

            header {
                // background-color: #d1dae0;
                background:var(--paper-grey-300);
                margin:0;
            }

            header div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }

            header h4 {
                padding: 4px 8px;
                margin: 0;
                display: grid;
                grid-template-columns: 40px 40% auto;
            }
            h4 .btn-group{
                text-align: right;
                display: none;
            }

            #toggle, .modelType{
                align-self:center;
            }

            header div.info {
                padding: 0 16px 4px;
                margin: 0;
                font-size: 85%;
                display: block;
                margin:0 0 0 32px;
            }
            header div.info *{
                display: block;
                line-height: 1.2;
            }

            header .outputDisplay{
                text-transform: uppercase ;
            }
            header .description{
                font-style: italic;
            }

            header .predicate {
                color: #ff5722;
            }

            .predicate label, .template label {
                display: block;
                font-size: 12px;
                font-weight: 300;
                color: rgb(115, 115, 115);
            }

            .model-collapse {
                color: #000000;
                cursor: pointer;
            }

            .model-collapse:hover {
                text-decoration: none;
            }

            .behaviour {
                color: #ff5722;
            }

            .behaviour:before {
                content: ' [';
            }

            .behaviour:after {
                content: ']';
            }

            .behaviourWrapper{
                display:grid;
                grid-template-columns: 140px 40px 140px auto;
            }
            .behaviourWrapper > *{
                display:inline;
                align-self:stretch;
            }
            
            .group {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }

            .group .title {
                /*text-decoration: underline;*/
            }

            .renditions, .parameters {
                padding-left: 16px;
                border-left: 3px solid #e0e0e0;
                margin-bottom:20px;
            }

            .renditions .group {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }

            .predicate .form-control {
                width: 100%;
            }

            .source {
                text-decoration: none;
                margin-bottom: 8px;
            }

            .selectOutput {
                margin-right: 10px;
            }

            :host([currentselection]) > form > header{
                @apply --shadow-elevation-4dp;
                border-left:3px solid var(--paper-blue-500);
            }

            paper-menu-button paper-icon-button{
                margin-left:-10px;
            }

            /* need to play it save for FF */
            :host([currentselection]) > form > header > h4 > .btn-group{
                display: inline-block;
            }
            iron-collapse{
            }

            .renditions{
                margin-top:10px;
            }
            
            .details{
                padding:0px 50px 20px 20px;
                background:var(--paper-grey-200);
            }
            
            pb-code-editor {
                margin-bottom: 20px;
            }

            .horizontal {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }

            #mode {
                min-width: 18em;
            }
        `;
  }

  static get properties() {
    return {
      /**
       * maps to ODD ´model` behaviour attribute
       */
      behaviour: {
        type: String
      },

      /**
       * maps to ODD `model` predicate
       */
      predicate: {
        type: String,
        reflect: true,
        converter: (value, type) => {
          if (value.toLowerCase() === 'null') {
            return '';
          }

          return value;
        }
      },
      type: {
        type: String,
        reflect: true
      },
      template: {
        type: String,
        reflect: true,
        converter: (value, type) => {
          if (value.toLowerCase() === 'null') {
            return '';
          }

          return value;
        }
      },
      output: {
        type: String,
        reflect: true,
        converter: (value, type) => {
          if (value.toLowerCase() === 'null') {
            return '';
          }

          return value;
        }
      },
      css: {
        type: String,
        converter: (value, type) => {
          if (value.toLowerCase() === 'null') {
            return '';
          }

          return value;
        }
      },
      mode: {
        type: String
      },
      model: {
        type: Object
      },
      models: {
        type: Array
      },
      parameters: {
        type: Array
      },
      renditions: {
        type: Array
      },
      desc: {
        type: String,
        converter: (value, type) => {
          if (value.toLowerCase() === 'null') {
            return '';
          }

          return value;
        }
      },
      sourcerend: {
        type: String
      },
      show: {
        type: Boolean,
        reflect: true
      },
      outputs: {
        type: Array
      },
      behaviours: {
        type: Array
      },
      icon: {
        type: String
      },
      open: {
        type: String
      },
      hasCustomBehaviour: {
        type: Boolean
      },
      endpoint: {
        type: String
      },
      apiVersion: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.behaviour = 'inline';
    this.predicate = '';
    this.type = '';
    this.template = '';
    this.output = '';
    this.css = '';
    this.mode = '';
    this.model = {};
    this.model.models = [];
    this.parameters = [];
    this.renditions = [];
    this.desc = '';
    this.sourcerend = '';
    this.show = false;
    this.outputs = ["", "web", "print", "epub", "fo", "latex", "plain"];
    this.parentModel = [];
    this.behaviours = ["alternate", "anchor", "block", "body", "break", "cell", "cit", "document", "figure", "graphic", "heading", "inline", "link", "list", "listItem", "metadata", "note", "omit", "paragraph", "pass-through", "row", "section", "table", "text", "title", "webcomponent"];
    this.icon = 'expand-more';
    this.hasCustomBehaviour = false;
  }

  render() {
    return html$1`
        <form>
            <header> 
                <h4>
                    <paper-icon-button id="toggle"
                                       icon="${this.icon}" @click="${this.toggle}"
                                       class="model-collapse"></paper-icon-button>
                                       
                    <span class="modelType">${this.type}<span class="behaviour" ?hidden="${this._isGroupOrSequence()}">${this.behaviour}</span></span>

                    <span class="btn-group">
                        <paper-icon-button @click="${this._moveDown}" icon="arrow-downward"
                                           title="move down"></paper-icon-button>
                        <paper-icon-button @click="${this._moveUp}" icon="arrow-upward"
                                           title="move up"></paper-icon-button>
                        <paper-icon-button @click="${this._requestRemoval}" icon="delete" title="remove"></paper-icon-button>
                        <paper-icon-button @click="${this._copy}" icon="content-copy" title="copy"></paper-icon-button>
                        <paper-icon-button @click="${this._paste}" icon="content-paste"
                                           ?hidden="${this._isModel}"></paper-icon-button>

                        ${this._isGroupOrSequence() ? html$1`
                            <paper-menu-button horizontal-align="right">
                                <paper-icon-button icon="add" slot="dropdown-trigger"></paper-icon-button>
                                <paper-listbox id="modelType" slot="dropdown-content" @iron-select="${this._addNested}"
                                               attr-for-selected="value">
                                   ${this.type === 'modelSequence' ? html$1`
                                            <paper-item value="model">model</paper-item>
                                        ` : ''}
                                   ${this.type === 'modelGrp' ? html$1`
                                            <paper-item value="modelSequence">modelSequence</paper-item>
                                            <paper-item value="model">model</paper-item>
                                        ` : ''}
                                </paper-listbox>
                            </paper-menu-button>
                            ` : ''}
                    </span>
                </h4>
                <div class="info">
                    <div class="outputDisplay">${this.output}</div>
                    <div class="description">${this.desc}</div>
                    <div class="predicate">${this.predicate}</div>
                </p>
            </header>
            <iron-collapse id="details" ?opened="${this.show}" class="details">
                <div class="horizontal">
                    <paper-dropdown-menu class="selectOutput" label="Output">
                        <paper-listbox id="output" slot="dropdown-content" attr-for-selected="value"
                                    selected="${this.output}" @iron-select="${this._selectOutput}">

                            ${this.outputs.map(item => html$1`
                                <paper-item value="${item}">${item}</paper-item>
                            `)}

                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="mode" .value="${this.mode}"
                        placeholder="${translate('odd.editor.model.mode-placeholder')}"
                        label="Mode"
                        @change="${this._inputMode}"></paper-input>
                </div>
                <paper-input id="desc" .value="${this.desc}" placeholder="${translate('odd.editor.model.description-placeholder')}"
                    label="Description" @change="${this._inputDesc}"></paper-input>

                <pb-code-editor id="predicate"
                     code="${this.predicate}"   
                     mode="xquery"
                     linter="${this.endpoint}/${cmpVersion(this.apiVersion, '1.0.0') < 0 ? 'modules/editor.xql' : 'api/lint'}"
                     label="Predicate"
                     placeholder="${translate('odd.editor.model.predicate-placeholder')}"
                     @code-changed="${this._updatePredicate}"
                     apiVersion="${this.apiVersion}"></pb-code-editor>
               
                ${this._isModel() ? html$1`
                        <div>
                            <div class="behaviourWrapper">
                                <paper-dropdown-menu label="behaviour" id="behaviourMenu" ?disabled="${this.hasCustomBehaviour}">
                                    <paper-listbox id="behaviour" slot="dropdown-content" attr-for-selected="value"
                                                   selected="${this.behaviour}" @iron-select="${this._selectBehaviour}">
                                        ${this.behaviours.map(item => html$1`
                                            <paper-item value="${item}">${item}</paper-item>
                                        `)}
                                    </paper-listbox>
                                </paper-dropdown-menu>
                                <span style="align-self:center;justify-self: center;"> ${translate('odd.editor.model.link-with-or')} </span>
                                <paper-input id="custombehaviour" label="" @input="${this._handleCustomBehaviour}" placeHolder="${translate('odd.editor.model.custom-behaviour-placeholder')}"></paper-input>
                                <span></span>
                            </div>

                                
    
                            <paper-input id="css" .value="${this.css}"
                                placeholder="${translate('odd.editor.model.css-class-placeholder')}"
                                label="CSS Class"
                                @change="${this._inputCss}"></paper-input>
                                
                            <pb-code-editor id="template"
                                             code="${this.template}"
                                             mode="${this.output === 'latex' ? 'stex' : 'xml'}"
                                             label="Template"
                                             placeholder="${translate('odd.editor.model.template-placeholder')}"
                                             @code-changed="${this._updateTemplate}"
                                             apiVersion="${this.apiVersion}"></pb-code-editor>
                        </div>
        
                        <div class="parameters">
                            <div class="group">
                                <span class="title">Parameters</span>
                                <paper-icon-button icon="add"
                                                   @click="${this._addParameter}"></paper-icon-button>
                            </div>
                            ${repeat(this.parameters, parameter => parameter.name, (parameter, index) => html$1`
                                <pb-odd-parameter-editor 
                                       behaviour="${this.behaviour}"
                                       name="${parameter.name}"
                                       value="${parameter.value}"
                                       ?set="${parameter.set}"
                                       endpoint="${this.endpoint}"
                                       apiVersion="${this.apiVersion}"
                                       @parameter-remove="${e => this._removeParam(e, index)}"
                                       @parameter-changed="${e => this._updateParam(e, index)}"
                                       ></pb-odd-parameter-editor>
                            `)}
                        </div>

                        <div class="renditions">
                            <div class="group">
                                <div>
                                    <span class="title">Renditions</span>
                                    <paper-icon-button icon="add" @click="${this._addRendition}"></paper-icon-button>
                                </div>
                                <div class="source">
                                    <paper-checkbox ?checked="${this.sourcerend}" id="sourcerend">Use source rendition</paper-checkbox>
                                </div>
                            </div>

                            ${repeat(this.renditions, rendition => rendition.name, (rendition, index) => html$1`
                                <pb-odd-rendition-editor scope="${rendition.scope}"
                                       css="${rendition.css}"
                                       @remove-rendition="${e => this._removeRendition(e, index)}"
                                       @rendition-changed="${e => this._updateRendition(e, index)}"
                                       ></pb-odd-rendition-editor>
                            `)}

                        </div>
                    ` : ''}
            </iron-collapse>
            
            <div class="models">
                ${repeat(this.model.models, (model, index) => html$1`
                <pb-odd-model-editor 
                    behaviour="${model.behaviour || 'inline'}"
                    predicate="${model.predicate}"
                    type="${model.type}"
                    output="${model.output}"
                    css="${model.css}"
                    mode="${model.mode}"
                    .model="${model}"
                    .parameters="${model.parameters}"
                    desc="${model.desc}"
                    sourcerend="${model.sourcerend}"
                    .renditions="${model.renditions}"
                    .template="${model.template}"
                    .show="${model.show}"
                    endpoint="${this.endpoint}"
                    apiVersion="${this.apiVersion}"
                    @model-remove="${this._removeModel}"
                    @model-move-down="${this._moveModelDown}"
                    @model-move-up="${this._moveModelUp}"
                    @model-changed="${this.handleModelChanged}"
                    @click="${e => this.setCurrentSelection(e, index)}"
                    hasParent
                    ></pb-odd-model-editor>
            `)}
    
            </div> 
        </form> 
        <pb-message id="dialog"></pb-message>
        `;
  }

  firstUpdated() {
    super.firstUpdated();
    this.hasCustomBehaviour = this.behaviours.indexOf(this.behaviour) < 0;

    if (this.hasCustomBehaviour) {
      this.shadowRoot.getElementById('custombehaviour').value = this.behaviour;
    }
  }

  updated(_changedProperties) {
    if (_changedProperties.has('show') && this.show) {
      this.refreshEditors();
    }
  }

  refreshEditors() {
    console.log('refreshEditors');
    this.shadowRoot.getElementById('predicate').refresh();

    if (this._isGroupOrSequence()) {
      return console.log("asfdfa");
    }

    this.shadowRoot.getElementById('template').refresh();
    const models = this.shadowRoot.querySelectorAll('pb-odd-model-editor');

    for (let i = 0; i < models.length; i++) {
      models[i].refreshEditors();
    }

    const renditions = this.shadowRoot.querySelectorAll('pb-odd-rendition-editor');

    for (let i = 0; i < renditions.length; i++) {
      renditions[i].refreshEditor();
    }

    const parameters = this.shadowRoot.querySelectorAll('pb-odd-parameter-editor');

    for (let i = 0; i < parameters.length; i++) {
      parameters[i].refreshEditor();
    }
  }

  toggle(e) {
    // e.stopPropagation()
    // e.preventDefault()
    this.show = !this.show;
    this.toggleButtonIcon();
    const oldModel = this.model;
    const newModel = Object.assign({}, oldModel, {
      show: this.show
    });
    this.model = newModel;
    this.refreshEditors();
    this.dispatchEvent(new CustomEvent('model-changed', {
      composed: true,
      bubbles: true,
      detail: {
        oldModel,
        newModel
      }
    }));
  }

  toggleButtonIcon() {
    if (this.show) {
      this.icon = 'expand-less';
    } else {
      this.icon = 'expand-more';
    }
  }

  _isModel() {
    return this.type === 'model';
  }

  _isGroupOrSequence() {
    return this.type !== 'model';
  }

  static _templateMode(output) {
    switch (output) {
      case 'latex':
        return 'latex';

      case 'web':
      default:
        return 'xml';
    }
  }

  _changeSelection(e) {
    if (e.detail.target == this) return;
    e.preventDefault();
    e.stopPropagation();

    if (this.currentSelection != undefined) {
      this.currentSelection.removeAttribute('currentselection');
    }

    const newSelection = e.detail.target;
    newSelection.setAttribute('currentselection', 'true');
    this.currentSelection = newSelection;
  }

  _requestRemoval(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('model-remove'));
  }
  /**
   * move model down in list
   *
   * @param e
   * @event model-move-down dispatched to request the model to move down
   */


  _moveDown(e) {
    e.preventDefault();
    e.stopPropagation(); // this.dispatchEvent(new CustomEvent('model-move-down'));

    this.dispatchEvent(new CustomEvent('model-move-down', {
      composed: true,
      bubbles: true,
      detail: {
        model: this
      }
    }));
  }
  /**
   * move model up in list
   *
   * @param e
   * @event model-move-up dispatched to request the model to move up
   */


  _moveUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('model-move-up'));
  }

  _addNested(e) {
    const newNestedModel = {
      behaviour: 'inline',
      css: '',
      desc: '',
      predicate: '',
      type: e.detail.item.getAttribute('value'),
      output: '',
      sourcerend: false,
      models: [],
      mode: '',
      parameters: [],
      renditions: [],
      template: '',
      show: true
    };
    const oldModel = this.model;
    const models = Array.from(this.model.models);
    models.unshift(newNestedModel);
    this.model = Object.assign({}, oldModel, {
      models
    }); // important to reset the listbox - otherwise next attempt to use it will fail if value has not changed
    // use querySelector here instead of 'this.$' as listbox is in it's own <template>

    const modelTypeSelector = this.shadowRoot.querySelector('#modelType');
    modelTypeSelector.select("");
    this.dispatchEvent(new CustomEvent('model-changed', {
      composed: true,
      bubbles: true,
      detail: {
        oldModel,
        newModel: this.model
      }
    }));
  }

  _removeModel(ev) {
    console.log('_removeModel ', ev);
    ev.stopPropagation();
    const {
      model
    } = ev.target;
    const index = this.model.models.indexOf(model);
    this.shadowRoot.getElementById('dialog').confirm(get('odd.editor.model.delete-model-label'), get('odd.editor.model.delete-model-message')).then(() => {
      const oldModel = this.model;
      const models = Array.from(this.model.models);
      models.splice(index, 1);
      this.model = Object.assign({}, oldModel, {
        models
      });
      this.models = models;
      this.dispatchEvent(new CustomEvent('model-changed', {
        composed: true,
        bubbles: true,
        detail: {
          oldModel,
          newModel: this.model
        }
      }));
    }, () => null);
  }

  _moveModelDown(ev) {
    console.log('MODEL._moveModelDown ', ev);
    ev.stopPropagation();
    const {
      model
    } = ev.target;
    const index = this.model.models.indexOf(model);

    if (index === this.model.models.length) {
      return;
    }

    const oldModel = this.model;
    const models = Array.from(this.model.models);
    models.splice(index, 1);
    models.splice(index + 1, 0, model);
    this.model = Object.assign({}, oldModel, {
      models
    });
    const targetModel = this.shadowRoot.querySelectorAll('pb-odd-model-editor')[index + 1];

    this._setCurrentSelection(index + 1, targetModel);

    this.dispatchEvent(new CustomEvent('model-changed', {
      composed: true,
      bubbles: true,
      detail: {
        oldModel,
        newModel: this.model
      }
    }));
    this.requestUpdate();
  }

  _moveModelUp(ev) {
    ev.stopPropagation();
    const {
      model
    } = ev.target;
    const index = this.model.models.indexOf(model);

    if (index === 0) {
      return;
    }

    const oldModel = this.model;
    const models = Array.from(this.model.models); // remove element from models

    models.splice(index, 1); // add element to new index

    models.splice(index - 1, 0, model);
    this.model = Object.assign({}, oldModel, {
      models
    });
    const targetModel = this.shadowRoot.querySelectorAll('pb-odd-model-editor')[index - 1];

    this._setCurrentSelection(index - 1, targetModel);

    this.dispatchEvent(new CustomEvent('model-changed', {
      composed: true,
      bubbles: true,
      detail: {
        oldModel,
        newModel: this.model
      }
    })); // this.requestUpdate();
  }

  handleModelChanged(ev) {
    console.log('handleModelChanged ', ev, this);
    ev.stopPropagation();
    const oldModel = this.model;
    const index = this.model.models.indexOf(ev.detail.oldModel);
    const models = Array.from(this.model.models);
    models.splice(index, 1, ev.detail.newModel);
    this.model = Object.assign({}, oldModel, {
      models
    });
    this.dispatchEvent(new CustomEvent('model-changed', {
      composed: true,
      bubbles: true,
      detail: {
        oldModel,
        newModel: this.model
      }
    }));
  } //todo: setCurrentSelection functions are redundant in model and elementspec components - do better


  setCurrentSelection(e, index) {
    e.preventDefault();
    e.stopPropagation(); //prevent event if model is already the current one

    this._setCurrentSelection(index, e.target);
  }

  _setCurrentSelection(index, target) {
    // console.log('_setCurrentSelection ', target);
    const targetModel = this.shadowRoot.querySelectorAll('pb-odd-model-editor')[index];

    if (!targetModel) {
      return;
    }

    if (targetModel.hasAttribute('currentselection')) return;
    this.dispatchEvent(new CustomEvent('current-changed', {
      composed: true,
      bubbles: true,
      detail: {
        target: target
      }
    }));
    this.requestUpdate();
  }

  _inputDesc(e) {
    this.desc = e.composedPath()[0].value;

    this._fireModelChanged('desc', this.desc);
  }

  _selectOutput(e) {
    this.output = e.composedPath()[0].selected;

    this._fireModelChanged('output', this.output);
  }

  _updatePredicate(ev) {
    this.predicate = this.shadowRoot.getElementById('predicate').getSource();
    console.log('_updatePredicate ', this.predicate);

    this._fireModelChanged('predicate', this.predicate);
  }

  _selectBehaviour(ev) {
    this.behaviour = ev.composedPath()[0].selected;

    this._fireModelChanged('behaviour', this.behaviour);
  }

  _inputCss(ev) {
    this.css = ev.composedPath()[0].value;

    this._fireModelChanged('css', this.css);
  }

  _inputMode(ev) {
    this.mode = ev.composedPath()[0].value;

    this._fireModelChanged('mode', this.mode);
  }

  _updateTemplate(ev) {
    this.template = this.shadowRoot.getElementById('template').getSource();

    this._fireModelChanged('template', this.template);
  }
  /**
   * add a model parameter
   *
   * @param e
   */


  _addParameter(e) {
    this.parameters.push({
      name: "",
      value: ""
    });

    this._fireModelChanged('parameters', this.parameters);
  }

  _updateParam(e, index) {
    this.parameters[index].name = e.detail.name;
    this.parameters[index].value = e.detail.value;
    this.parameters[index].set = e.detail.set;

    this._fireModelChanged('parameters', this.parameters);
  }
  /**
   * remove a parameter
   * @param e
   * @param index
   * @private
   */


  _removeParam(e, index) {
    this.parameters.splice(index, 1);

    this._fireModelChanged('parameters', this.parameters);
  }
  /**
   * add a rendition
   *
   * @param ev
   */


  _addRendition(ev) {
    this.renditions.push({
      scope: '',
      css: ''
    });

    this._fireModelChanged('renditions', this.renditions);
  }

  _updateRendition(e, index) {
    this.renditions[index].css = e.detail.css;
    this.renditions[index].scope = e.detail.scope;

    this._fireModelChanged('renditions', this.renditions);
  }

  _removeRendition(e, index) {
    this.renditions.splice(index, 1);

    this._fireModelChanged('renditions', this.renditions);
  }

  _fireModelChanged(prop, value) {
    const oldModel = this.model;
    this.model = Object.assign({}, this.model, {
      [prop]: value
    });
    console.log('model changed for %s: %o - %o', prop, value, this.model);
    this.dispatchEvent(new CustomEvent('model-changed', {
      composed: true,
      bubbles: true,
      detail: {
        oldModel,
        newModel: this.model
      }
    }));
    this.requestUpdate();
  }

  _copy(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('odd-model.copy ', ev);
    console.log('odd-model.copy data', this.model);
    this.dispatchEvent(new CustomEvent('odd-copy', {
      composed: true,
      bubbles: true,
      detail: {
        model: this.model
      }
    }));
  }

  _paste(ev) {
    console.log('model _paste ', ev);
    this.dispatchEvent(new CustomEvent('odd-paste', {
      composed: true,
      bubbles: true,
      detail: {
        target: this
      }
    }));
  }

  _handleCustomBehaviour(e) {
    this.behaviour = e.composedPath()[0].value;

    this._fireModelChanged('behaviour', this.behaviour); // en-/disable behaviour menu


    if (this.behaviour === '') {
      this.behaviour = 'inline';
      this.hasCustomBehaviour = false;
    } else {
      this.hasCustomBehaviour = true;
    }

    this.requestUpdate();
  }

}
customElements.define('pb-odd-model-editor', PbOddModelEditor);

// @ts-nocheck
/**
 * A wrapper for the popular codemirror code editor.
 *
 *
 * @customElement
 * @polymer
 */

class PbOddElementspecEditor extends LitElement {
  static get styles() {
    return css`
            :host {
                display: block;
                padding: 4px 10px;
                height: auto;
            }

            h1, h2, h3, h4, h5, h6 {
                font-family: "Oswald", Verdana, "Helvetica", sans-serif;
                font-weight: 400 !important;
            }
            

            input {
                vertical-align: middle;
            }

            .ident {
                display: inline-block;
                font-size:26px;
                position:relative;
            }
            .mode{
                font-size:10px;
                display:inline-block;
                text-transform:uppercase;
                border-radius:12px;
                color:var(--paper-grey-700);
                background:var(--paper-grey-300);
                padding:2px 6px;
                border:thin solid var(--paper-grey-500);
                margin-left:6px;
                position:absolute;
                top:8px;
            }
            
            :host([currentselection]){
                    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                    0 1px 18px 0 rgba(0, 0, 0, 0.12),
                    0 3px 5px -1px rgba(0, 0, 0, 0.4);

            }

            :host([currentSelection]) > h3, :host([currentSelection]) > header{
                border-left:thin solid var(--paper-blue-500);
            }
            

            h3{
                display:grid;
                grid-template-columns:260px auto 160px;
                align-items:center;
            }
            h3 .controls{
                text-align: right;
                margin-right: 10px;
            }

            h3 .ident{
                align-self: center;
             }

            paper-menu-button paper-icon-button{
                margin-left:-10px;
            }

            /*todo: this does not take effect*/
            iron-collapse.models{
                --iron-collapse-transition-duration:0.4s;
            }
            
            .models{
                padding:10px;
            }
        `;
  }

  static get properties() {
    return {
      // identifier for this ´element-spec´
      ident: {
        type: String
      },

      /**
       * mode for an ´elementSpec` may be 'add', 'remove' or being undefined
       */
      mode: {
        type: String
      },

      /**
       * array of ODD `model` elements
       */
      models: {
        type: Array
      },
      endpoint: {
        type: String
      },
      apiVersion: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.ident = '';
    this.mode = '';
    this.models = [];
    this.icon = 'expand-more';
  }

  render() {
    return html$1`   
        <h3>
            <span class="ident">${this.ident}<span class="mode">mode: ${this.mode}</span></span>
            <span class="spacer"></span>

            <span class="controls">
                <paper-icon-button @click="${this._remove}" icon="delete"></paper-icon-button>
                <paper-icon-button @click="${this._paste}" icon="content-paste"></paper-icon-button>
                <paper-menu-button horizontal-align="right">
                    <paper-icon-button icon="add" slot="dropdown-trigger"></paper-icon-button>
                    <paper-listbox id="addModel" slot="dropdown-content" @iron-select="${this._addModel}"
                                   attr-for-selected="value">
                        <paper-item value="model">model</paper-item>
                        <paper-item value="modelSequence">modelSequence</paper-item>
                        <paper-item value="modelGrp">modelGrp</paper-item>
                    </paper-listbox>
                </paper-menu-button>


            </span>
        </h3>

        <div>
            ${repeat(this.models, (model, index) => html$1`
            <pb-odd-model-editor
                behaviour="${model.behaviour || ''}"
                predicate="${model.predicate}"
                type="${model.type}"
                output="${model.output}"
                css="${model.css}"
                mode="${model.mode}"
                .model="${model}"
                .parameters="${model.parameters}"
                desc="${model.desc}"
                .sourcerend="${model.sourcerend}"
                .renditions="${model.renditions}"
                .template="${model.template}"
                .show="${model.show}"
                .endpoint="${this.endpoint}"
                .apiVersion="${this.apiVersion}"
                @model-remove="${this._removeModel}"
                @model-move-down="${this._moveModelDown}"
                @model-move-up="${this._moveModelUp}"
                @model-changed="${this.handleModelChanged}"
                @click="${e => this.setCurrentSelection(e, index)}"
                ></pb-odd-model-editor>
            `)}
        </div>
        <pb-message id="dialog"></pb-message>
        `;
  }

  addModel(newModel) {
    this.models.unshift(newModel);
    this.requestUpdate();
  }

  _addModel(e) {
    console.log('ELEMENTSPEC._addModel ', e);
    const addModel = this.shadowRoot.getElementById('addModel');
    const newModel = {
      behaviour: 'inline',
      css: '',
      mode: '',
      predicate: '',
      desc: '',
      type: addModel.selected,
      output: '',
      template: '',
      sourcerend: false,
      models: [],
      parameters: [],
      renditions: [],
      show: true
    };
    const models = Array.from(this.models);
    models.unshift(newModel);
    this.models = models;
    this.dispatchEvent(new CustomEvent('element-spec-changed', {
      composed: true,
      bubbles: true,
      detail: {
        action: "models",
        ident: this.ident,
        models: this.models
      }
    }));
    addModel.selected = "";
    this.requestUpdate();
  }

  _remove(ev) {
    this.dispatchEvent(new CustomEvent('element-spec-removed', {
      composed: true,
      bubbles: true,
      detail: {
        target: this
      }
    }));
  }

  _paste(ev) {
    console.log('_paste ', ev); // const editor = document.querySelector('pb-odd-editor');

    this.dispatchEvent(new CustomEvent('odd-paste', {
      composed: true,
      bubbles: true,
      detail: {
        target: this
      }
    }));
  }

  setCurrentSelection(e, index) {
    e.preventDefault();
    e.stopPropagation(); //prevent event if model is already the current one

    this._setCurrentSelection(index, e.target);
  }

  _setCurrentSelection(index, target) {
    const targetModel = this.shadowRoot.querySelectorAll('pb-odd-model-editor')[index];

    if (!targetModel) {
      return;
    }

    if (targetModel.hasAttribute('currentselection')) return;
    this.dispatchEvent(new CustomEvent('current-changed', {
      composed: true,
      bubbles: true,
      detail: {
        target: target
      }
    }));
    this.requestUpdate();
  }

  _removeModel(ev) {
    console.log('_removeModel ', ev);
    ev.stopPropagation();
    const {
      model
    } = ev.target;
    const index = this.models.indexOf(model);
    this.shadowRoot.getElementById('dialog').confirm(get('odd.editor.model.delete-model-label'), get('odd.editor.model.delete-model-message')).then(() => {
      const models = Array.from(this.models);
      models.splice(index, 1);
      this.models = models;
      this.dispatchEvent(new CustomEvent('element-spec-changed', {
        composed: true,
        bubbles: true,
        detail: {
          action: "models",
          ident: this.ident,
          models: this.models
        }
      }));
    }, () => null);
  }

  _moveModelDown(ev) {
    console.log('ELEMENTSPEC._moveModelDown ', ev);
    ev.stopPropagation();
    const {
      model
    } = ev.target;
    const index = this.models.indexOf(model);

    if (index === this.models.length) {
      return;
    }

    const models = Array.from(this.models);
    models.splice(index, 1);
    models.splice(index + 1, 0, model);
    this.models = models;
    const targetModel = this.shadowRoot.querySelectorAll('pb-odd-model-editor')[index + 1];

    if (!targetModel) {
      return;
    }

    this._setCurrentSelection(index + 1, targetModel);

    this.dispatchEvent(new CustomEvent('element-spec-changed', {
      composed: true,
      bubbles: true,
      detail: {
        action: "models",
        ident: this.ident,
        models: this.models
      }
    })); // this.requestUpdate();
  }

  _moveModelUp(ev) {
    ev.stopPropagation();
    const {
      model
    } = ev.target;
    const index = this.models.indexOf(model);

    if (index === 0) {
      return;
    }

    const models = Array.from(this.models); // remove element from models

    models.splice(index, 1); // add element to new index

    models.splice(index - 1, 0, model);
    this.models = models;
    const targetModel = this.shadowRoot.querySelectorAll('pb-odd-model-editor')[index - 1];

    this._setCurrentSelection(index - 1, targetModel);

    this.dispatchEvent(new CustomEvent('element-spec-changed', {
      composed: true,
      bubbles: true,
      detail: {
        action: "models",
        ident: this.ident,
        models: this.models
      }
    })); // this.requestUpdate();
  }

  handleModelChanged(ev) {
    // console.log('ELEMENTSPEC.handleModelChanged ', ev.detail);
    ev.stopPropagation();
    const index = this.models.indexOf(ev.detail.oldModel);
    const models = Array.from(this.models);
    models.splice(index, 1, ev.detail.newModel);
    this.models = models;
    this.dispatchEvent(new CustomEvent('element-spec-changed', {
      composed: true,
      bubbles: true,
      detail: {
        action: "models",
        ident: this.ident,
        models: this.models
      }
    }));
    this.requestUpdate();
  }

}
customElements.define('pb-odd-elementspec-editor', PbOddElementspecEditor);

// @ts-nocheck
/**
 * ODD editor component
 *
 * @slot - default unnamed slot
 * @fires pb-login - When received, registers if user is logged in
 * @cssprop --pb-heading-font-family - font family used for headings
 * @cssprop --pb-heading-font-weight
 * @cssprop --pb-heading-line-height
 */

class PbOddEditor extends pbHotkeys(pbMixin(LitElement)) {
  static get styles() {
    return css`
            :host {
                display: flex;
                /*margin: 30px 20px;*/
                margin:0;
                padding:0;
                height:auto;
            }
            
            #layout {
                width: 100%;
                display: grid;
                grid-template-columns: auto 1fr;
                grid-template-rows: auto 1fr;
            }

            #drawer {
                grid-column: 1 / 1;
                min-width: 320px;
            }

            #navlist {
                grid-column: 1 / 1;
                grid-row: 2 / 2;
                overflow: auto;
                height: 100%;
            }

            .specs {
                grid-column: 2 / 2;
                grid-row: 1 / span 2;
                overflow: auto;
            }

            section{
                padding:20px;
            }

            h3, h4 {
                font-family: var(--pb-heading-font-family);
                font-weight: var(--pb-heading-font-weight);
                line-height: var(--pb-heading-line-height);
            }

            /* ported over but not checked yet */

            .specs {
                padding:6px;
            }

            .metadata {
                display: block;
            }

            .metadata div {
                padding: 0 16px 16px;
            }

            .metadata paper-input {
                margin-bottom: 10px;
            }

            .metadata .extCssEdit {
                display: flex;
                align-items: center;
                padding: 0;
            }
            .metadata .extCssEdit paper-input {
                flex: 2;
            }
            .metadata .extCssEdit pb-edit-xml {
                width: 40px;
            }

            #jump-to {
                margin-top: 1em;
            }

            odd-model {
                border-bottom: 1px solid #E0E0E0;
            }
            odd-model h4 {
                margin-top: 15px;
                padding-top: 5px;
                border-top: 1px solid #E0E0E0;
            }
            .renditions {
                margin-top: 10px;
            }
            .icons{
                display:inline-block;
                white-space: nowrap;
            }

            /* todo: this doesn't work - should refactor to have the complete trigger exposed here (move out of pb-collapse) */
            pb-collapse#meta ::slotted(.collapse-trigger){
                /*height:56px;*/
            }

            iron-collapse {
                --iron-collapse-transition-duration:0.8s;
            }
            
            pb-message#errorMsg{
                background: var(--paper-red-500);
                color:white;
            }
            .card-content{
                height:100%;
                overflow:auto;
            }
            
            paper-tab{
                width:100px;
            }
            
            .editingView {
                width:100%;
            }
            
            vaadin-tabs{
                margin-top:10px;
            }
            
            vaadin-tab{
                background:var(--paper-grey-200);
                padding:0 6px;
                border:thin solid var(--paper-grey-300);
                border-bottom:none;
            }
            vaadin-tab[selected]{
                background:white;
                border-top-right-radius:20px;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);

            }

        `;
  }

  static get properties() {
    return Object.assign(Object.assign({}, super.properties), {}, {
      ident: {
        type: String
      },

      /**
       * ElementSpec mode. Can be ´add´, ´change´ or undefined.
       */
      mode: {
        type: String
      },

      /**
       * Array of ´odd-model´ Elements
       */
      models: {
        type: Array
      },

      /**
       * the odd file being edited
       */
      odd: {
        type: String,
        reflect: true
      },

      /**
       * array of ´element-spec´ Elements of given odd file
       */
      elementSpecs: {
        type: Array
      },
      source: {
        type: String
      },
      title: {
        type: String
      },
      titleShort: {
        type: String,
        reflect: true,
        attribute: 'title-short'
      },
      description: {
        type: String
      },
      namespace: {
        type: String
      },
      rootPath: {
        type: String,
        attribute: 'root-path'
      },
      loading: {
        type: Boolean
      },
      indentString: {
        type: String
      },
      outputPrefix: {
        type: String,
        attribute: 'output-prefix'
      },
      outputRoot: {
        type: String,
        attribute: 'output-root'
      },
      currentSelection: {
        type: Object
      },
      useNamespace: {
        type: Boolean
      },
      loggedIn: {
        type: Boolean
      },
      tabs: {
        type: Array
      },
      tabIndex: {
        type: Number,
        reflect: true
      }
    });
  }

  constructor() {
    super();
    this.ident = '';
    this.mode = '';

    this.models = () => [];

    this.odd = '';
    this.elementSpecs = [];
    this.source = '';
    this.title = '';
    this.titleShort = '';
    this.description = '';
    this.namespace = '';
    this.rootPath = '';
    this.loading = false;
    this.indentString = '    ';
    this.outputPrefix = '';
    this.outputRoot = '';
    this.currentSelection = {};
    this.useNamespace = false;
    this.loggedIn = true;
    this.tabs = [];
    this.tabIndex = undefined;
    this.selectedNavIndex = 0;
    this.cssFile = '';
    this.hotkeys = {
      save: 'ctrl+shift+s,command+shift+s'
    };
  }

  render() {
    return html$1`
        <iron-ajax id="loadContent"
                handle-as="json" content-type="application/x-www-form-urlencoded"
                with-credentials
                method="GET"></iron-ajax>
                
        <iron-ajax id="saveOdd"
                handle-as="json"
                with-credentials></iron-ajax>

        <div id="layout">
            <div id="drawer">
                    <slot id="slot"></slot>
                    <h3>
                        <span>${this.odd}</span>

                        <span class="icons">
                            <pb-edit-xml id="editSource"><paper-icon-button icon="code" title="${translate('odd.editor.odd-source')}"></paper-icon-button></pb-edit-xml>
                            <paper-icon-button @click="${this._reload}" icon="refresh" title="${translate('odd.editor.reload')}"></paper-icon-button>
                            <paper-icon-button @click="${this.save}" icon="save" title="${translate('odd.editor.save')} ${this.display('save')}" 
                                ?disabled="${!this.loggedIn}"></paper-icon-button>
                        </span>
                    </h3>
                    <div id="new-element" class="input-group">
                        <paper-input id="identNew" label="${translate('odd.editor.add-element')}" always-float-label="always-float-label">
                            <paper-icon-button slot="suffix" @click="${this.addElementSpec}" icon="add" tabindex="-1"></paper-icon-button>
                        </paper-input>
                    </div>

                    <div id="jump-to">
                        <paper-autocomplete id="jumpTo" label="${translate('odd.editor.jump-to')}" always-float-label="always-float-label"></paper-autocomplete>
                    </div>
                    
                    <h3>${translate('odd.editor.specs')}</h3>
            </div>
            <div id="navlist">
                ${repeat(this.elementSpecs, i => i.ident, (i, index) => html$1`
                    <paper-item id="es_${i.ident}"
                        index="${index}"
                        @click="${ev => this._openElementSpec(ev, index)}">${i.ident}</paper-item>
                `)}
            </div>
            <section class="specs" id="specs">
    
                <paper-card class="metadata">
                    <pb-collapse id="meta">
                        <h4 slot="collapse-trigger" class="panel-title">
                            ${this._computedTitle()}
                        </h4>
                        <div slot="collapse-content">
                            <paper-input id="title" name="title" value="${this.title}" label="${translate('odd.editor.title')}"
                                         placeholder="[${translate('odd.editor.title-placeholder')}]"
                                         @change="${this._inputTitle}"></paper-input>
                            <paper-input id="titleShort" name="short-title" .value="${this.titleShort}" label="${translate('odd.editor.title-short')}"
                                         placeholder="[${translate('odd.editor.title-short-placeholder')}]"
                                         @change="${e => this.titleShort = e.composedPath()[0].value}"></paper-input>
                            <paper-input id="description" name="description" .value="${ifDefined(this.description)}" label="${translate('odd.editor.description-label')}"
                                      placeholder="[${translate('odd.editor.description-placeholder')}]"
                                      @change="${e => this.description = e.composedPath()[0].value}"></paper-input>
                            <paper-input id="source" name="source" ?value="${this.source}" label="${translate('odd.editor.source-label')}"
                                         placeholder="[${translate('odd.editor.source-placeholder')}]"
                                         @change="${e => this.source = e.composedPath()[0].value}"></paper-input>
                            <paper-checkbox id="useNamespace" @change="${this.setUseNamespace}">${translate('odd.editor.use-namespace')}</paper-checkbox>
                            <paper-input id="namespace" name="namespace" value="${this.namespace}" label="Namespace" ?disabled="${!this.useNamespace}"
                                         placeholder="[${translate('odd.editor.namespace-placeholder')}]"
                                         @change="${e => this.namespace = e.composedPath()[0].value}"></paper-input>
                            <div class="extCssEdit">
                                <paper-input name="cssFile" value="${this.cssFile}" label="External CSS File"
                                    placeholder="[External CSS file with additional class definitions]"
                                    @change="${this._cssFileChanged}"></paper-input>
                                <pb-edit-xml id="editCSS"><paper-icon-button icon="create" title="${translate('odd.editor.css-source')}"></paper-icon-button></pb-edit-xml>
                            </div>
                        </div>
                    </pb-collapse>
                </paper-card>
    
                <!-- todo: import elementspec to make it function  -->
    
                <div class="editingView">
                    <vaadin-tabs id="tabs" selected="${this.tabIndex}">
                        ${repeat(this.tabs, i => i.id, (i, index) => html$1`
                            <vaadin-tab name="${i}" @click="${e => this._selectTab(e, i)}"><span style="padding-right:20px;">${i}</span><paper-icon-button icon="close" @click="${ev => this._closeTabHandler(ev, index)}"></paper-icon-button></vaadin-tab>
                        `)}                    
                    </vaadin-tabs>
                                       
                    <div id="currentElement"></div>
                </div>
            </section>
            
        </div>


        <pb-message id="dialog" hidden></pb-message>
        <pb-message id="errorMsg"></pb-message>
        `;
  }

  firstUpdated(changedProperties) {
    this.shadowRoot.getElementById('useNamespace').checked = this.useNamespace; // console.log('firstUpdated ', changedProperties);
    // console.log('firstUpdated endpoint', this.getEndpoint());
    // console.log('firstUpdated rootpath', this.rootPath);

    this.jumpCtrl = this.shadowRoot.getElementById('jumpTo');
    this.jumpCtrl.addEventListener('autocomplete-selected', this.jumpTo.bind(this));
    const oddSelector = this.querySelector('odd-selector');

    if (this.odd && oddSelector) {
      oddSelector.selected = this.odd;
      oddSelector.addEventListener('odd-selected', e => {
        if (confirm('Any unsaved changes will be lost. Continue?')) {
          this.odd = e.detail.odd;
          window.history.pushState({}, "", '?odd=' + this.odd);
        }

        oddSelector.selected = this.odd;
      });
    }

    this.addEventListener('current-changed', this._changeSelection);
    this.addEventListener('odd-copy', e => this._copy(e));
    this.addEventListener('odd-paste', e => this._paste(e));
    this.addEventListener('element-spec-removed', this.removeElementSpec.bind(this));
    window.addEventListener('beforeunload', () => 'Any unsaved changes will be lost. Continue?');
    this.subscribeTo('pb-login', ev => {
      this.loggedIn = ev.detail.user != null;
    });
    this.focus();
    this.loadContent = this.shadowRoot.getElementById('loadContent'); // it is unclear to me why root-path is not read from attribute without this explicit call

    this.rootPath = this.getAttribute('root-path');
    PbOddEditor.waitOnce('pb-page-ready', () => {
      this.load();
      this.inited = true;
    });
    this.registerHotkey('save', this.save.bind(this));
  }

  setUseNamespace() {
    this.useNamespace = this.shadowRoot.getElementById('useNamespace').checked;
  }

  async load() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    if (this.rootPath === '' || this.odd === '') {
      return;
    } // reset


    this.elementSpecs = [];
    document.dispatchEvent(new CustomEvent('pb-start-update')); // this.$.editSource.setPath(this.rootPath + '/' + this.odd);

    const editSrc = this.shadowRoot.getElementById('editSource');
    editSrc.setPath(this.rootPath + '/' + this.odd); // this.shadowRoot.getElementById('editSource').setPath(this.rootPath + '/' + this.odd)

    const params = {
      odd: this.odd,
      root: this.rootPath
    }; // this.$.loadContent.params = params;

    this.loadContent.params = params;
    this.loadContent.url = `${this.getEndpoint()}/${this.lessThanApiVersion('1.0.0') ? 'modules/editor.xql' : 'api/odd/' + this.odd}`;
    const request = this.loadContent.generateRequest();
    request.completes.then(r => this.handleOdd(r));
  }

  handleOdd(req) {
    const data = req.response;
    this.loggedIn = data.canWrite;
    this.source = data.source;
    this.title = data.title;
    this.titleShort = data.titleShort;
    this.description = data.description;
    this.cssFile = data.cssFile == null ? '' : data.cssFile;
    this.namespace = data.namespace != null ? data.namespace : '';
    this.useNamespace = data.namespace != null;

    if (this.cssFile) {
      const editCss = this.shadowRoot.getElementById('editCSS');
      editCss.setPath(this.rootPath + '/' + this.cssFile);
    } // update elementSpecs


    this.elementSpecs = data.elementSpecs.map(es => this.mapElementSpec(es)); // init auto-complete list
    // const jumpTo = this.shadowRoot.getElementById('jumpTo');
    // jumpTo.source = this.elementSpecs.map(this._specMapper);

    this._updateAutoComplete();

    this.requestUpdate();
    this.loading = false;
    document.dispatchEvent(new CustomEvent('pb-end-update'));
    document.title = this.titleShort || this.title;
  }

  _updateAutoComplete() {
    const jumpTo = this.shadowRoot.getElementById('jumpTo');
    jumpTo.source = this.elementSpecs.map(this._specMapper);
  }

  _cssFileChanged(e) {
    this.cssFile = e.composedPath()[0].value;

    if (this.cssFile) {
      const editCss = this.shadowRoot.getElementById('editCSS');
      editCss.setPath(this.rootPath + '/' + this.cssFile);
    }
  }
  /**
   * handler for paper-item in navigation list in the drawer
   *
   * @param e
   * @param index
   * @private
   */


  _navlistActiveChanged(e, index) {
    // set the paper-item active that got the click
    this.selectedNavIndex = index;
    this.requestUpdate();
  }

  _returnTabs() {
    return this.tabs;
  }

  _selectTab(e, item) {
    const spec = this.elementSpecs.find(theSpec => theSpec.ident === item);

    this._updateElementspec(spec);
  }

  _openElementSpec(ev, index) {
    console.log('_openElementSpec ', ev, index);
    const spec = this.elementSpecs[index]; //get target elementspec

    this._updateElementspec(spec);

    const ident = spec.ident; // do not re-open existing tab, but select it

    if (this.tabs.indexOf(ident) >= 0) {
      this.tabIndex = this.tabs.indexOf(ident);
      this.requestUpdate();
      return;
    }

    this.tabs.push(ident);
    this.tabIndex = this.tabs.length - 1;
    this.requestUpdate();
  }

  _updateElementspec(elementSpec) {
    // const spec = this.elementSpecs.find(theSpec => theSpec.ident === specIdent);
    // reset - delete current element if there's one
    const currentElement = this.shadowRoot.getElementById('currentElement');
    currentElement.innerHTML = ""; // create new elementspec

    const newElementSpec = new PbOddElementspecEditor();
    newElementSpec.addEventListener('element-spec-changed', this.handleElementSpecChanged.bind(this));
    newElementSpec.ident = elementSpec.ident;
    newElementSpec.models = elementSpec.models;
    newElementSpec.mode = elementSpec.mode;
    newElementSpec.endpoint = this._endpoint;
    newElementSpec.apiVersion = this._apiVersion;
    newElementSpec.hotkeys = this.hotkeys;
    currentElement.appendChild(newElementSpec);
  }

  _closeTabHandler(ev, index) {
    console.log('_closeTabHandler ', index);
    ev.preventDefault();
    ev.stopPropagation();

    this._closeTab(index);

    return false;
  }

  _closeTab(index) {
    this.tabs.splice(index, 1); // last tab closed

    if (this.tabs.length === 0) {
      this.shadowRoot.getElementById('currentElement').innerHTML = '';
      this.tabIndex = 0;
      this.tabs = [];
    } // a tab left of selected tab or current tab closed
    else if (this.tabIndex > 0 && this.tabIndex >= index) {
      // decrease tabIndex by one
      this.tabIndex -= 1;
      const currentTab = this.tabs[this.tabIndex];

      this._selectTab(null, currentTab);
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // console.log('attributeChangedCallback', name, oldVal, newVal);
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name == 'odd' && oldVal !== newVal) {
      // console.log('<pb-document> Emit update event');
      // this.emitTo('pb-odd-editor', this);
      if (this.inited) {
        this.load();
      }
    }
  }

  static get replaceCharMap() {
    return {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
  }

  static get replaceCharRegexp() {
    return /"|&|<|>/g;
  }

  static replaceChars(match) {
    return PbOddEditor.replaceCharMap[match];
  }

  jumpTo(e) {
    const jumpCtrl = this.shadowRoot.getElementById('jumpTo');
    const id = '#es_' + jumpCtrl.text;
    const target = this.shadowRoot.querySelector(id);

    if (!target) {
      return;
    }

    this.jumpCtrl.clear();
    target.click();
  }

  _computedTitle() {
    if (!this.odd) {
      return '';
    }

    return this.title || this.titleShort || this.odd || 'Loading ...';
  }

  _copy(e) {
    // console.log('odd-editor._copy ', e);
    this.clipboard = e.detail.model;
    const clone = JSON.parse(JSON.stringify(e.detail.model));
    this.clipboard = clone;
  }

  _paste(e) {
    console.log('_paste ', e);
    console.log('_paste clipboard', this.clipboard);

    if (this.clipboard == {} || this.clipboard == undefined) {
      return;
    }

    const targetElement = e.detail.target;
    targetElement.addModel(this.clipboard);
    targetElement.render();
  }

  _specMapper(spec) {
    return {
      text: spec.ident,
      value: spec.ident
    };
  }

  _specObserver(changeRecord) {
    const source = this.elementSpecs.map(this._specMapper);
    this.jumpCtrl.source = source;
  }

  mapElementSpec(elementSpec) {
    return Object.assign({}, elementSpec, {
      models: elementSpec.models.map(m => this.addShowToModel(m))
    });
  }

  addShowToModel(model) {
    if (model.models) {
      const extendedModels = model.models.map(m => this.addShowToModel(m));
      return Object.assign({}, model, {
        models: extendedModels,
        show: false
      });
    }

    return Object.assign({}, model, {
      show: false
    });
  }

  addElementSpec(ev) {
    // const ident = this.$.identNew.value;
    const identNew = this.shadowRoot.getElementById('identNew');
    const ident = identNew.value;

    if (!ident || ident.length === 0) {
      return;
    }

    const existingSpec = this.elementSpecs.find(spec => spec.ident === ident);

    if (existingSpec) {
      console.log('<pb-odd-editor> element spec to be added already exists: %s', ident);
      const id = `#es_${ident}`;
      const target = this.shadowRoot.querySelector(id);

      if (!target) {
        return;
      }

      target.click();
      return;
    }

    const oldApiParams = {
      action: "find",
      odd: this.odd,
      root: this.rootPath,
      ident
    };
    const newApiParams = {
      root: this.rootPath,
      ident
    };
    const params = this.lessThanApiVersion('1.0.0') ? oldApiParams : newApiParams;
    this.loadContent.params = params;
    this.loadContent.url = `${this.getEndpoint()}/${this.lessThanApiVersion('1.0.0') ? 'modules/editor.xql' : 'api/odd/' + this.odd}`;
    let request = this.loadContent.generateRequest();
    request.completes.then(this._handleElementSpecResponse.bind(this));
  }

  _handleElementSpecResponse(req) {
    const identNew = this.shadowRoot.getElementById('identNew');
    const data = req.response;
    const ident = identNew.value;
    const mode = data.status === 'not-found' ? 'add' : 'change';
    const models = data.models || [];
    const newSpec = {
      ident,
      mode,
      models
    };
    this.elementSpecs.unshift(newSpec); // trigger update of autocomplete list in jumpTo

    identNew.value = ''; //open new tab with newly created element

    this.tabs.push(ident);
    this.tabIndex = this.tabs.length - 1;
    this.elementSpecs.sort((a, b) => a.ident.localeCompare(b.ident));
    this.requestUpdate().then(() => {
      const elem = this.shadowRoot.querySelectorAll('paper-item');
      const idx = this.elementSpecs.indexOf(newSpec);

      this._updateAutoComplete();

      elem[idx].click();
      elem[idx].focus();
    });
  }

  removeElementSpec(ev) {
    const ident = ev.detail.target.ident;
    this.shadowRoot.getElementById('dialog').confirm(get('browse.delete'), get('odd.editor.delete-spec', {
      ident
    })).then(() => {
      const targetIndex = this.elementSpecs.findIndex(theSpec => theSpec.ident === ident);
      this.elementSpecs.splice(targetIndex, 1);
      this.requestUpdate();
      const selectedTab = this.shadowRoot.querySelector('vaadin-tab[selected]');
      const tabName = selectedTab.getAttribute('name');
      const idx = this.tabs.indexOf(tabName);

      this._closeTab(idx);
    }, () => null);
  }

  serializeOdd() {
    const ns = this.useNamespace ? ` ns="${this.namespace}"` : '';
    const source = this.source ? ` source="${this.source}"` : '';
    const description = this.description ? ` <desc>${this.description}</desc>` : '';
    const title = `${this.indentString}<title>${this.title}${description}</title>\n`;
    const titleShort = this.titleShort ? `${this.indentString}<title type="short">${this.titleShort}</title>\n` : '';
    const cssFile = this.cssFile ? `${this.indentString}<rendition source="${this.cssFile}"/>\n` : '';
    const elementSpecs = this.elementSpecs.map(e => this.serializeElementSpec(this.indentString, e)).join('');
    return `<schemaSpec xmlns="http://www.tei-c.org/ns/1.0" xmlns:pb="http://teipublisher.com/1.0"${ns}${source}>\n${title}${titleShort}${cssFile}\n${elementSpecs}</schemaSpec>\n`;
  }

  serializeElementSpec(indent, elementSpec) {
    const mode = elementSpec.mode ? ` mode="${elementSpec.mode}"` : '';
    const indent2 = indent + this.indentString;
    const models = elementSpec.models.map(m => this.serializeModel(indent2, m)).join('');
    return `${indent}<elementSpec ident="${elementSpec.ident}"${mode}>\n${models}${indent}</elementSpec>\n`;
  }

  serializeModel(indent, model) {
    if (model.type === 'model' && !model.behaviour) {
      return '';
    }

    const nestedIndent = indent + this.indentString;
    const attributes = [this.serializeAttribute('output', model.output), this.serializeAttribute('predicate', model.predicate), model.type === 'model' ? this.serializeAttribute('behaviour', model.behaviour) : '', this.serializeAttribute('cssClass', model.css), this.serializeAttribute('useSourceRendition', model.sourcerend), this.serializeAttribute('pb:mode', model.mode)].join('');
    const desc = model.desc ? nestedIndent + '<desc>' + model.desc + '</desc>\n' : ''; // innerXML += this.serializeTag('model', nestedIndent);

    const models = model.models.map(m => this.serializeModel(nestedIndent, m)).join('');
    const parameters = model.parameters.map(p => this.serializeParameter(nestedIndent, p)).join('');
    const renditions = model.renditions.map(r => this.serializeRendition(nestedIndent, r)).join('');
    const template = PbOddEditor.serializeTemplate(nestedIndent, model.template);
    const innerXML = `${desc}${models}${parameters}${template}${renditions}`;
    const end = innerXML.length > 0 ? `>\n${innerXML}${indent}</${model.type}` : '/';
    return `${indent}<${model.type}${attributes}${end}>\n`;
  }

  serializeParameter(indent, parameter) {
    if (!parameter.name) {
      return '';
    }

    const name = this.serializeAttribute('name', parameter.name);
    const value = this.serializeAttribute('value', parameter.value);

    if (parameter.set) {
      return `${indent}<pb:set-param xmlns=""${name}${value}/>\n`;
    }

    return `${indent}<param${name}${value}/>\n`;
  }

  serializeRendition(indent, rendition) {
    const scope = rendition.scope && rendition.scope !== 'null' ? this.serializeAttribute('scope', rendition.scope) : '';
    const css = PbOddEditor.escape(rendition.css);
    return `${indent}<outputRendition xml:space="preserve" ${scope}>\n${indent}${css}\n${indent}</outputRendition>\n`;
  }

  static serializeTemplate(indent, template) {
    if (!template) {
      return '';
    }

    return `${indent}<pb:template xml:space="preserve" xmlns="">${template}</pb:template>\n`;
  }

  serializeAttribute(name, value) {
    return value ? ` ${name}="${PbOddEditor.escape(value)}"` : '';
  }

  static escape(code) {
    if (!code) {
      return '';
    }

    if (typeof code === 'string') {
      return code.replace(PbOddEditor.replaceCharRegexp, PbOddEditor.replaceChars);
    }

    return code;
  }

  save(e) {
    document.dispatchEvent(new CustomEvent('pb-start-update'));
    const data = this.serializeOdd();
    console.log('serialised ODD:', data);
    this.shadowRoot.getElementById('dialog').show(get("odd.editor.save"), get('odd.editor.saving'));
    const saveOdd = this.shadowRoot.getElementById('saveOdd');
    saveOdd.url = `${this.getEndpoint()}/${this.lessThanApiVersion('1.0.0') ? 'modules/editor.xql' : 'api/odd/' + this.odd}`;

    if (this.lessThanApiVersion('1.0.0')) {
      saveOdd.contentType = 'application/x-www-form-urlencoded';
      saveOdd.method = "POST";
      saveOdd.params = null;
      saveOdd.body = {
        action: "save",
        root: this.rootPath,
        "output-prefix": this.outputPrefix,
        "output-root": this.outputRoot,
        odd: this.odd,
        data
      };
    } else {
      saveOdd.contentType = 'application/xml';
      saveOdd.method = "PUT";
      saveOdd.params = {
        root: this.rootPath,
        "output-prefix": this.outputPrefix,
        "output-root": this.outputRoot
      };
      saveOdd.body = data;
    }

    const request = saveOdd.generateRequest();
    request.completes.then(this.handleSaveComplete.bind(this)).catch(this.handleSaveError.bind(this));
  } //to be deprecated: only used for old api


  static _renderReport(report) {
    if (report.error) {
      return `
                        <div class="list-group-item-danger">
                          <h4 class="list-group-item-heading">${report.file}</h4>
                          <h5 class="list-group-item-heading">Compilation error on line ${report.line}:</h5>
                          <pre class="list-group-item-text">${report.error}</pre>
                          <pre class="list-group-item-text">${report.message}</pre>
                        </div>
                    `;
    }

    return `
                    <div class="list-group-item-success">
                      <p class="list-group-item-text">Generated ${report.file}</p>
                    </div>
                `;
  }

  handleSaveComplete(req) {
    const data = req.response;

    if (data.status === 'denied') {
      this.shadowRoot.getElementById('dialog').set(get("odd.editor.denied"), get("odd.editor.denied-message", {
        odd: this.odd
      }));
      document.dispatchEvent(new CustomEvent('pb-end-update'));
      return;
    }

    let msg;

    if (this.lessThanApiVersion('1.0.0')) {
      const report = data.report.map(PbOddEditor._renderReport);
      msg = `<div class="list-group">${report.join('')}</div>`;
    } else {
      const report = data.report;
      msg = `<div class="list-group">${report}</div>`;
    }

    this.shadowRoot.getElementById('dialog').set(get("odd.editor.saved"), msg);
    document.dispatchEvent(new CustomEvent('pb-end-update'));
  }

  handleSaveError(rejected) {
    this.shadowRoot.getElementById('dialog').set("Error", rejected.error); // this.$.dialog.set("Error", rejected.error);

    document.dispatchEvent(new CustomEvent('pb-end-update'));
  }

  _reload() {
    this.shadowRoot.getElementById('dialog').confirm(get('odd.editor.reload'), get('odd.editor.reload-confirm')).then(() => {
      this.load();
      this.tabs = [];
      this.tabIndex = 0;
      this.shadowRoot.getElementById('currentElement').innerHTML = '';
    }, () => null);
  }

  _setCurrentSelection(e) {
    if (this.currentSelection != undefined) {
      this.currentSelection.removeAttribute('currentselection');
    }

    this.currentSelection = e.target;
    this.currentSelection.setAttribute('currentselection', 'true');
  }

  _changeSelection(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.detail.target === this) return;

    if (this.currentSelection && this.currentSelection.tagName !== undefined) {
      this.currentSelection.removeAttribute('currentselection');
    }

    let newSelection;

    if (ev.detail.target) {
      newSelection = ev.detail.target;
    } else {
      newSelection = ev.target;
    }

    newSelection.setAttribute('currentselection', 'true');
    this.currentSelection = newSelection;
  }

  _selectElementspec(e) {
    if (this.currentElementSpec && this.currentElementSpec.tagName === 'PB-ODD-ELEMENTSPEC-EDITOR') {
      this.currentElementSpec.removeAttribute('currentselection');
    }

    const newSelection = e.target;
    newSelection.setAttribute('currentselection', 'true');
    this.currentElementSpec = newSelection;
  }

  nsDisabled() {
    return !this.useNamespace;
  }

  _handleLoadError(e) {
    console.log('loading error occurred: ', e);
    const msg = this.shadowRoot.getElementById('errorMsg');
    msg.style.background = 'red';
    const url = this.shadowRoot.getElementById('loadContent').url;
    console.log('url ', url);
    msg.show('Error: ', 'ODD file could not be loaded from ' + url);
  }

  handleElementSpecChanged(e) {
    // console.log('handleElementSpecChanged ',e);
    const elementSpec = this.elementSpecs.find(es => es.ident === e.detail.ident);
    const index = this.elementSpecs.indexOf(elementSpec);
    const newSpec = Object.assign({}, elementSpec, {
      models: e.detail.models
    });
    const allSpecs = Array.from(this.elementSpecs);
    allSpecs.splice(index, 1, newSpec);
    this.elementSpecs = allSpecs; // console.log('updated elementspecs ', this.elementSpecs);
  }

  _inputTitle(ev) {
    this.title = ev.composedPath()[0].value;
  }

}
customElements.define('pb-odd-editor', PbOddEditor);

export { PbOddEditor };
//# sourceMappingURL=pb-odd-editor.js.map
