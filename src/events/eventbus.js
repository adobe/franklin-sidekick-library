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

import { EventEmitter } from './eventemitter.js';

/**
 * The EventBus is a singleton that can be used to communicate between components
 */
export class EventBus extends EventEmitter {
  static _instance;

  constructor() {
    super();
    if (!EventBus._instance) {
      EventBus._instance = this;
    }
    return EventBus._instance;
  }

  static get instance() {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }
}
