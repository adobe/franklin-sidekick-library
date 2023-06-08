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

export function getAdminUrl({
  owner, repo, ref, adminVersion,
}, api, path = '') {
  const adminUrl = new URL([
    'https://admin.hlx.page/',
    api,
    `/${owner}`,
    `/${repo}`,
    `/${ref}`,
    path,
  ].join(''));
  if (adminVersion) {
    adminUrl.searchParams.append('hlx-admin-version', adminVersion);
  }
  return adminUrl;
}

/**
 * Returns true if the href provided in a CDN URL
 *
 * @public
 */
export function isCDNUrl(href) {
  return href.includes('hlx.page') || href.includes('hlx.live');
}

/**
 * Resolve the site configuration from a URL
 *
 * @param url - The URL to resolve
 * @returns The site configuration
 */
export function resolveConfig(url) {
  const [ref, repo, owner] = url.hostname.split('.')[0].split('--');
  return {
    owner,
    repo,
    ref,
  };
}
