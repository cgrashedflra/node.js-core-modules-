// URL Module - Real-world Examples
// =================================

const { URL, URLSearchParams } = require('url');

console.log('=== URL Module Real-world Examples ===\n');

// Example 1: API URL Builder
// ---------------------------
console.log('১. API URL Builder:');
console.log('─'.repeat(50));

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  buildURL(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseURL);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.set(key, params[key]);
      }
    });
    
    return url.href;
  }
  
  getPosts(options = {}) {
    return this.buildURL('/posts', {
      page: options.page || 1,
      limit: options.limit || 10,
      sort: options.sort || 'date',
      order: options.order || 'desc'
    });
  }
  
  searchPosts(query, filters = {}) {
    return this.buildURL('/posts/search', {
      q: query,
      ...filters
    });
  }
}

const api = new APIClient('https://api.example.com');

console.log('Get posts (page 2):');
console.log(api.getPosts({ page: 2, limit: 20 }));
console.log('');

console.log('Search posts:');
console.log(api.searchPosts('nodejs', { category: 'tutorial', lang: 'en' }));
console.log('');

// Example 2: Pagination Helper
// -----------------------------
console.log('২. Pagination Helper:');
console.log('─'.repeat(50));

class Pagination {
  constructor(baseURL, totalItems, itemsPerPage = 10) {
    this.baseURL = baseURL;
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
  }
  
  getPageURL(page) {
    const url = new URL(this.baseURL);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', this.itemsPerPage);
    return url.href;
  }
  
  getLinks(currentPage) {
    const links = {
      first: this.getPageURL(1),
      last: this.getPageURL(this.totalPages),
      prev: currentPage > 1 ? this.getPageURL(currentPage - 1) : null,
      next: currentPage < this.totalPages ? this.getPageURL(currentPage + 1) : null,
      current: this.getPageURL(currentPage)
    };
    
    return links;
  }
}

const pagination = new Pagination('https://example.com/products', 250, 20);

console.log('Total pages:', pagination.totalPages);
console.log('\nPage 5 links:');
console.log(pagination.getLinks(5));
console.log('');

// Example 3: URL Shortener
// -------------------------
console.log('৩. URL Shortener:');
console.log('─'.repeat(50));

class URLShortener {
  constructor() {
    this.urls = new Map();
    this.counter = 1000;
  }
  
  shorten(longURL) {
    // Validate URL
    try {
      new URL(longURL);
    } catch {
      throw new Error('Invalid URL');
    }
    
    // Generate short code
    const shortCode = this.generateCode();
    this.urls.set(shortCode, longURL);
    
    return {
      shortCode,
      shortURL: `https://short.link/${shortCode}`,
      longURL
    };
  }
  
  expand(shortCode) {
    return this.urls.get(shortCode) || null;
  }
  
  generateCode() {
    this.counter++;
    return this.counter.toString(36); // Base-36 encoding
  }
}

const shortener = new URLShortener();

const short1 = shortener.shorten('https://example.com/very/long/url/with/many/segments?param=value');
console.log('Shortened:', short1);
console.log('Expand:', shortener.expand(short1.shortCode));
console.log('');

// Example 4: SEO-Friendly URL Slugs
// ----------------------------------
console.log('৪. SEO-Friendly URL Generator:');
console.log('─'.repeat(50));

class SEOURLGenerator {
  static createSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/-+/g, '-');     // Replace multiple - with single -
  }
  
  static createPostURL(baseURL, category, title, id) {
    const slug = this.createSlug(title);
    return `${baseURL}/${category}/${slug}-${id}`;
  }
  
  static parsePostURL(url) {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(p => p);
    
    if (parts.length < 2) return null;
    
    const [category, slugWithId] = parts;
    const lastDash = slugWithId.lastIndexOf('-');
    const slug = slugWithId.substring(0, lastDash);
    const id = slugWithId.substring(lastDash + 1);
    
    return { category, slug, id };
  }
}

const postTitle = 'How to Learn Node.js in 2024?';
const postURL = SEOURLGenerator.createPostURL(
  'https://blog.example.com',
  'tutorials',
  postTitle,
  123
);

console.log('Title:', postTitle);
console.log('SEO URL:', postURL);
console.log('Parsed:', SEOURLGenerator.parsePostURL(postURL));
console.log('');

// Example 5: Query String Filter Builder
// ---------------------------------------
console.log('৫. Query Filter Builder:');
console.log('─'.repeat(50));

class FilterBuilder {
  constructor(baseURL) {
    this.url = new URL(baseURL);
  }
  
  addFilter(key, value) {
    if (Array.isArray(value)) {
      value.forEach(v => this.url.searchParams.append(key, v));
    } else {
      this.url.searchParams.set(key, value);
    }
    return this;
  }
  
  addRange(key, min, max) {
    if (min !== undefined) this.url.searchParams.set(`${key}_min`, min);
    if (max !== undefined) this.url.searchParams.set(`${key}_max`, max);
    return this;
  }
  
  addSort(field, order = 'asc') {
    this.url.searchParams.set('sort', field);
    this.url.searchParams.set('order', order);
    return this;
  }
  
  build() {
    return this.url.href;
  }
  
  getFilters() {
    const filters = {};
    for (const [key, value] of this.url.searchParams.entries()) {
      if (filters[key]) {
        // Multiple values
        if (Array.isArray(filters[key])) {
          filters[key].push(value);
        } else {
          filters[key] = [filters[key], value];
        }
      } else {
        filters[key] = value;
      }
    }
    return filters;
  }
}

const filter = new FilterBuilder('https://shop.example.com/products');

const filterURL = filter
  .addFilter('category', 'electronics')
  .addFilter('brand', ['Samsung', 'Apple', 'Sony'])
  .addRange('price', 10000, 50000)
  .addSort('price', 'asc')
  .build();

console.log('Filter URL:', filterURL);
console.log('Parsed filters:', filter.getFilters());
console.log('');

// Example 6: Redirect URL Manager
// --------------------------------
console.log('৬. Redirect URL Manager:');
console.log('─'.repeat(50));

class RedirectManager {
  constructor() {
    this.redirects = new Map();
  }
  
  add(from, to, permanent = false) {
    this.redirects.set(from, { to, permanent });
  }
  
  check(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    if (this.redirects.has(pathname)) {
      const redirect = this.redirects.get(pathname);
      const newURL = new URL(redirect.to, urlObj.origin);
      
      // Preserve query parameters
      urlObj.searchParams.forEach((value, key) => {
        newURL.searchParams.set(key, value);
      });
      
      return {
        redirect: true,
        statusCode: redirect.permanent ? 301 : 302,
        location: newURL.href
      };
    }
    
    return { redirect: false };
  }
}

const redirects = new RedirectManager();

redirects.add('/old-page', '/new-page', true);
redirects.add('/products', '/shop/products', false);

console.log('Check /old-page:');
console.log(redirects.check('https://example.com/old-page?id=123'));
console.log('');

console.log('Check /products:');
console.log(redirects.check('https://example.com/products?category=electronics'));
console.log('');

// Example 7: URL Parameter Sanitizer
// -----------------------------------
console.log('৭. URL Parameter Sanitizer:');
console.log('─'.repeat(50));

class URLSanitizer {
  static sanitize(url, allowedParams = []) {
    const urlObj = new URL(url);
    const cleanParams = new URLSearchParams();
    
    allowedParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        let value = urlObj.searchParams.get(param);
        
        // Sanitize value
        value = this.sanitizeValue(value);
        
        if (value) {
          cleanParams.set(param, value);
        }
      }
    });
    
    urlObj.search = cleanParams.toString();
    return urlObj.href;
  }
  
  static sanitizeValue(value) {
    // Remove potentially dangerous characters
    return value
      .replace(/[<>\"']/g, '')  // Remove HTML chars
      .replace(/javascript:/gi, '')  // Remove javascript: protocol
      .trim();
  }
}

const dirtyURL = 'https://example.com/search?q=<script>alert("xss")</script>&page=1&token=secret&sort=date';

console.log('Original URL:', dirtyURL);
console.log('');

const cleanURL = URLSanitizer.sanitize(dirtyURL, ['q', 'page', 'sort']);
console.log('Sanitized URL:', cleanURL);
console.log('');

// Example 8: URL Analytics Tracker
// ---------------------------------
console.log('৮. URL Analytics Tracker:');
console.log('─'.repeat(50));

class URLTracker {
  static addTracking(url, source, medium, campaign) {
    const urlObj = new URL(url);
    
    if (source) urlObj.searchParams.set('utm_source', source);
    if (medium) urlObj.searchParams.set('utm_medium', medium);
    if (campaign) urlObj.searchParams.set('utm_campaign', campaign);
    
    return urlObj.href;
  }
  
  static parseTracking(url) {
    const urlObj = new URL(url);
    
    return {
      url: urlObj.origin + urlObj.pathname,
      tracking: {
        source: urlObj.searchParams.get('utm_source'),
        medium: urlObj.searchParams.get('utm_medium'),
        campaign: urlObj.searchParams.get('utm_campaign'),
        term: urlObj.searchParams.get('utm_term'),
        content: urlObj.searchParams.get('utm_content')
      }
    };
  }
}

const trackedURL = URLTracker.addTracking(
  'https://example.com/products',
  'facebook',
  'social',
  'summer-sale-2024'
);

console.log('Tracked URL:', trackedURL);
console.log('');

console.log('Parsed tracking:', URLTracker.parseTracking(trackedURL));
console.log('');

console.log('=== URL Real-world Examples Complete! ===');