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

/* eslint-disable no-unused-expressions */

import { expect } from '@open-wc/testing';
import { EventEmitter } from '../../src/events/eventemitter.js';

describe('EventEmitter', () => {
  let eventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  describe('addEventListener', () => {
    it('should add a listener to the listeners array', () => {
      const listener = eventEmitter.addEventListener('test', () => {});
      expect(eventEmitter.listeners).to.deep.equal([listener]);
    });

    it('should return the added listener', () => {
      const listener = eventEmitter.addEventListener('test', () => {});
      expect(listener).to.be.an('object');
      expect(listener.type).to.equal('test');
      expect(listener.callback).to.be.a('function');
    });
  });

  describe('removeEventListener', () => {
    it('should remove a listener from the listeners array', () => {
      const listener = eventEmitter.addEventListener('test', () => {});
      eventEmitter.removeEventListener(listener);
      expect(eventEmitter.listeners).to.be.an('array').that.is.empty;
    });
  });

  describe('removeEventListeners', () => {
    it('should remove an array of listeners from the listeners array', () => {
      const listener1 = eventEmitter.addEventListener('test1', () => {});
      const listener2 = eventEmitter.addEventListener('test2', () => {});
      const listener3 = eventEmitter.addEventListener('test3', () => {});
      eventEmitter.removeEventListeners([listener1, listener3]);
      expect(eventEmitter.listeners).to.deep.equal([listener2]);
    });
  });

  describe('dispatchEvent', () => {
    it('should call the callback function of the listener that matches the type of the dispatched event', () => {
      let callbackCalled = false;
      eventEmitter.addEventListener('test', () => {
        callbackCalled = true;
      });
      eventEmitter.dispatchEvent({ type: 'test' });
      expect(callbackCalled).equals(true);
    });

    it('should not call the callback function of listeners that do not match the type of the dispatched event', () => {
      let callbackCalled = false;
      eventEmitter.addEventListener('test1', () => {
        callbackCalled = true;
      });
      eventEmitter.addEventListener('test2', () => {
        callbackCalled = true;
      });
      eventEmitter.dispatchEvent({ type: 'test3' });
      expect(callbackCalled).to.be.false;
    });
  });
});
