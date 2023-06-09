/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable no-underscore-dangle */
import { EventBus } from '../events/eventbus.js';

/* eslint-disable no-param-reassign, no-shadow */
export function store(data = {}, name = 'store') {
  /**
   * Emit a custom event
   * @param  {String} type   The event type
   * @param  {*}      detail Any details to pass along with the event
   */
  function emit(type, prop, detail) {
    // Create a new event
    const event = new CustomEvent(prop, {
      bubbles: true,
      cancelable: true,
      detail,
    });

    // Dispatch the event
    return EventBus.instance.dispatchEvent(event);
  }

  function handler(name, data) {
    return {
      get(obj, prop) {
        if (prop === '_isProxy') return true;
        /**
        * Checks if the property value is an object or an array.
        * If it is, and if the property does not already have a
        * proxy attached to it, then create a new proxy object.
        */
        if (typeof obj[prop] === 'object' && obj[prop] !== null && !obj[prop]._isProxy) {
          obj[prop] = new Proxy(obj[prop], handler(name, data));
        }
        return obj[prop];
      },
      set(obj, prop, value) {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        emit(name, prop, data);
        return true;
      },
      deleteProperty(obj, prop) {
        delete obj[prop];
        emit(name, prop, data);
        return true;
      },
    };
  }

  return new Proxy(data, handler(name, data));
}
