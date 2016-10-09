(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('emitter');
var requestBase = require('./request-base');
var isObject = require('./is-object');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = module.exports = require('./request').bind(null, Request);

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */),
        key = parts.shift(),
        val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this._setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this._parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype._setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype._setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      // issue #876: return the http status code if the response parsing fails
      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (res.status < 200 || res.status >= 300) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `requestBase`.
 */

Emitter(Request.prototype);
for (var key in requestBase) {
  Request.prototype[key] = requestBase[key];
}

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
 * 'arraybuffer'.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (!options) {
    options = {
      type: 'basic'
    }
  }

  switch (options.type) {
    case 'basic':
      var str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
  }
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  this._getFormData().append(field, file, filename || file.name);
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype._timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self._timeoutError();
      if (self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  this._appendQueryString();

  // initiate request
  if (this.username && this.password) {
    xhr.open(this.method, this.url, true, this.username, this.password);
  } else {
    xhr.open(this.method, this.url, true);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};


/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-object":3,"./request":5,"./request-base":4,"emitter":1}],3:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],4:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

exports.clearTimeout = function _clearTimeout(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

exports.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

exports.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

exports.timeout = function timeout(ms){
  this._timeout = ms;
  return this;
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} reject
 * @return {Request}
 */

exports.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

exports.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

exports.use = function use(fn) {
  fn(this);
  return this;
}


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

exports.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

exports.getHeader = exports.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

exports.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
exports.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
exports.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
exports.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

exports.withCredentials = function(){
  // This is browser-only functionality. Node side is no-op.
  this._withCredentials = true;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

exports.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

exports.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

exports._isHost = function _isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

exports.send = function(data){
  var obj = isObject(data);
  var type = this._header['content-type'];

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || this._isHost(data)) return this;

  // default to json
  if (!type) this.type('json');
  return this;
};

},{"./is-object":3}],5:[function(require,module,exports){
// The node and browser modules expose versions of this with the
// appropriate constructor function bound as first argument
/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(RequestConstructor, method, url) {
  // callback
  if ('function' == typeof url) {
    return new RequestConstructor('GET', method).end(url);
  }

  // url first
  if (2 == arguments.length) {
    return new RequestConstructor('GET', method);
  }

  return new RequestConstructor(method, url);
}

module.exports = request;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 本管理クラス
 * @param {string} title - タイトル
 * @param {string} author - 著者
 * @param {string} price - 値段
 * @param {string} img - 画像URL
 */
var Book = function () {

  /**
   * コンストラクタ
   * @param {Object} data - 本のオブジェクト
   */
  function Book() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Book);

    if (!data) console.log("Book read error");
    this.title = data.title || "";
    this.author = data.author || "";
    this.price = data.price || "";
    this.img = data.img || "";
  }

  /**
   * 本のsetter
   * @param {Object} data - 本のオブジェクト
   */


  _createClass(Book, [{
    key: "set",
    value: function set() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!data) {
        console.log("Book set error");
        return;
      }
      this.title = data.title || this.title;
      this.author = data.author || this.author;
      this.price = data.price || this.price;
      this.img = data.img || this.img;
    }

    /**
     * 本のgetter
     * @return {Object} 本のオブジェクト
     */

  }, {
    key: "get",
    value: function get() {
      return {
        title: this.title,
        author: this.author,
        price: this.price,
        img: this.img
      };
    }
  }]);

  return Book;
}();

exports.default = Book;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ローディングインジケーター クラス
 * @param {Object} $scope
 */
var Loading = function () {

  /**
   * コンストラクタ
   * @param {Object} $scope - スコープにしたいオブジェクト(通常はnullでおっけです。)
   */
  function Loading() {
    var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Loading);

    console.log("Loading.constructor");

    //スコープのset
    var element = document.getElementById("content");
    var scope = angular.element(element).scope();
    this.$scope = $scope || scope;
  }

  /**
   * インジケータを表示
   */


  _createClass(Loading, [{
    key: "show",
    value: function show() {
      console.log("Loading.show");
      this.$scope.loaderClass = "loadshow";
    }

    /**
     * インジケータを非表示
     */

  }, {
    key: "hide",
    value: function hide() {
      console.log("Loading.hide");
      this.$scope.loaderClass = "loadhide";
    }
  }]);

  return Loading;
}();

exports.default = Loading;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //import


var _swiper_setiing = require("./swiper_setiing");

var _swiper_setiing2 = _interopRequireDefault(_swiper_setiing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * モーダル クラス
 * @param {Object} $scope
 */
var Modal = function () {

	/**
  * コンストラクタ
  * @param {Object} $scope - スコープにしたいオブジェクト(通常はnullでおっけです。)
  */
	function Modal() {
		var $scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		_classCallCheck(this, Modal);

		console.log("Loading.constructor");

		//スコープのset
		var element = document.getElementById("content");
		var scope = angular.element(element).scope();
		this.$scope = $scope || scope;
	}

	/**
  * モーダルの設定
  * @return {object} 設定内容
  */


	_createClass(Modal, [{
		key: "setting",
		value: function setting() {
			console.log("modal_setting");
			return {
				dismissible: true, // Modal can be dismissed by clicking outside of the modal
				opacity: .6, // Opacity of modal background
				in_duration: 500, // Transition in duration
				out_duration: 500, // Transition out duration
				starting_top: '0%', // Starting top style attribute
				ending_top: '0%', // Ending top style attribute
				ready: function ready() {
					// Callback for Modal open
					(0, _swiper_setiing2.default)();
				}
			};
		}

		/**
   * モーダルのオブジェクトのsetter
   * @param {Object} book 本管理クラスのオブジェクト
   */

	}, {
		key: "set",
		value: function set() {
			var book = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			console.log("modal.set");
			this.$scope.modal_books = book;
		}
	}]);

	return Modal;
}();

exports.default = Modal;

},{"./swiper_setiing":9}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  console.log("swiper_setiing");
  new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30,
    grabCursor: true,
    loop: true
  });
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('../util/api');

var _api2 = _interopRequireDefault(_api);

var _header = require('./header.controller');

var _header2 = _interopRequireDefault(_header);

var _stabMain = require('./stabMain.controller');

var _stabMain2 = _interopRequireDefault(_stabMain);

var _main = require('./main.controller');

var _main2 = _interopRequireDefault(_main);

var _footer = require('./footer.controller');

var _footer2 = _interopRequireDefault(_footer);

var _loading = require('../components/loading');

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//----------------------------------------------------------------------
// グローバル コントローラ
//----------------------------------------------------------------------
// INCLUDE
exports.default = angular.module('mainApp.controller', [_header2.default.name, _stabMain2.default.name, _main2.default.name, _footer2.default.name]).controller('mainController', ['$scope', function ($scope) {
  console.log("mainController");
  var loading = new _loading2.default();
  loading.show();
  $scope.hideIndicator = function () {
    loading.hide();
  };

  $scope.parents = [{ id: 1, name: "南山大学" }, { id: 2, name: "名古屋大学" }, { id: 3, name: "その他" }];
  $scope.categories = [{ id: 1, parent: 1, name: "nanzan-1" }, { id: 2, parent: 1, name: "nanzan-2" }, { id: 3, parent: 1, name: "nanzan-3" }, { id: 4, parent: 2, name: "meidai-1" }, { id: 5, parent: 2, name: "meidai-2" }, { id: 6, parent: 3, name: "other-1" }];
  $scope.books = [{
    id: 1,
    category: 1,
    title: "民法〈2〉物権・担保物権 (ファンダメンタル法学講座)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51YCHjbcDeL._SL160_.jpg",
    author: "nanzan-1",
    point: 2,
    amazon: 3672,
    count: 1,
    description: ""
  }, {
    id: 2,
    category: 1,
    title: "TOEIC(R) テスト BEYOND 990 超上級リーディング 7つのコアスキル",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51q6IJjNfbL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 3,
    category: 2,
    title: "微分",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/4133qr1x9rL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 4,
    category: 2,
    title: "新TOEIC TEST サラリーマン特急 満点リーディング",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51YCHjbcDeL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 5,
    category: 3,
    title: "長考力 1000手先を読む技術 (幻冬舎新書)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/31p9ELA9OEL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 6,
    category: 3,
    title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 7,
    category: 4,
    title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 8,
    category: 1,
    title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 9,
    category: 1,
    title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 10,
    category: 1,
    title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }, {
    id: 11,
    category: 6,
    title: "プロ合格の原動力! 今泉の勝てる中飛車 (マイナビ将棋BOOKS)",
    img: "http://beak.sakura.ne.jp/texchg_test3/wp-content/uploads/2015/11/51Fc5lO7kmL._SL160_.jpg",
    author: "テッド寺倉",
    point: 2,
    amazon: 2484,
    count: 1,
    description: ""
  }];

  /**
   * APIリクエスト用のメソッド
   * @param {String} path - APIのパス名
   */
  $scope.onLoadRequestAPI = function (path) {
    (0, _api2.default)($scope, path);
  };

  /**
   * 名前のフィルター
   * @param {Stinr} input - 検索する文字
   */
  $scope.searchInput = "";
  $scope.searchResult = [];
  $scope.changedInput = function (input) {
    if (!input) {
      $scope.searchResult = [];return;
    }
    $scope.searchResult = _.filter($scope.books, function (book) {
      return book.title.match(new RegExp(input));
    });
    //_.each($scope.searchResult, (el) =>{ console.log(el.title); });
  };
}]); //APIのクラス

},{"../components/loading":7,"../util/api":17,"./footer.controller":11,"./header.controller":12,"./main.controller":13,"./stabMain.controller":14}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
//--------------------------
// フッターコンテンツ コントローラ
//--------------------------
exports.default = angular.module('controllers.footer', []).controller('footerController', ['$scope', function ($scope) {}]);

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animation = require('../util/animation');

var anime = _interopRequireWildcard(_animation);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//TODO: カテゴリ情報の集約地点を作成
//TODO: サイドバーのロジックの修正

//--------------------------
// ヘッダーコンテンツ コントローラ
//--------------------------
exports.default = angular.module('controllers.header', []).controller('headerController', ['$scope', function ($scope) {

  //ヘッダー初期描画時
  $scope.onLoadHeader = function () {
    console.log("onLoadHeader");
    jQuery('.carousel').carousel();
    jQuery('.carousel.carousel-slider').carousel({ full_width: true });
    window.addEventListener('scroll', anime.onScroll, false);
  };

  /**
   * サイドバーの表示
   * @param {boolean} bool - true:表示,false:非表示
   */
  $scope.onSideber = function (bool) {
    anime.onSideber(bool);
  };
}]);

},{"../util/animation":16}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('../util/api');

var _api2 = _interopRequireDefault(_api);

var _loading = require('../components/loading');

var _loading2 = _interopRequireDefault(_loading);

var _book = require('../components/book');

var _book2 = _interopRequireDefault(_book);

var _modal = require('../components/modal');

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
//ローディングインジケータのクラス
// INCLUDE
exports.default = angular.module('controllers.main', []).controller('midController', ['$scope', function ($scope) {
  console.log("controllers.main");
  var loading = new _loading2.default();
  var modal = new _modal2.default();

  //メイン初期描画時
  $scope.onLoadMid = function () {
    console.log("onLoadMid");
  };
}]); //本情報のクラス
//APIのクラス

},{"../components/book":6,"../components/loading":7,"../components/modal":8,"../util/api":17}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('../util/api');

var _api2 = _interopRequireDefault(_api);

var _loading = require('../components/loading');

var _loading2 = _interopRequireDefault(_loading);

var _book = require('../components/book');

var _book2 = _interopRequireDefault(_book);

var _modal = require('../components/modal');

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
//ローディングインジケータのクラス
// INCLUDE
exports.default = angular.module('controllers.stabMain', []).controller('stabMidController', ['$scope', function ($scope) {
  console.log("controllers.stabMain");
  var sampleApi = new _api2.default("sample");
  var loading = new _loading2.default();
  var modal = new _modal2.default();

  //メイン初期描画時
  $scope.onLoadStabMid = function () {
    console.log("onLoadMid");
    //jQuery('.modal-trigger').leanModal(modal.setting());
  };

  // APIレスポンス表示ボタン
  $scope.onLoadRequestAPI = function () {
    console.log("onLoadRequestAPI");
    loading.show();

    // APIリクエスト(Thenでres|errorを受け取ってください。)
    sampleApi.post().then(function (res) {
      console.log("API OK!");
      console.log(res.books);
      $scope.serch_count = res.search_count;
      $scope.books = res.books;
      loading.hide();
      $scope.$apply(); //画面更新
    }, function (error) {
      console.log("API NG!");
      loading.hide();
      $scope.$apply(); //画面更新
    });
  };

  // 予約のモーダル表示
  $scope.pushReservation = function (obj) {
    console.log("pushReservation");
    console.log(obj);
    var book = new _book2.default({
      title: obj.book_title,
      author: obj.book_author,
      price: obj.book_price,
      img: obj.book_img
    });
    modal.set({ book: book });
    $('#modal1').openModal();
  };
}]); //本情報のクラス
//APIのクラス

},{"../components/book":6,"../components/loading":7,"../components/modal":8,"../util/api":17}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// INCLUDE
var request = require('superagent');

/**
 * @class API通信クラス
 * @param {String} path - root以下のパス
 */

var ApiClass = function () {

  /**
   * コンストラクタ
   * @param {String} path - root以下のパス
   */
  function ApiClass() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ApiClass);

    console.log("ApiClass.constructor START");
    if (!path) console.log("apiパスが不足しています");
    this.path = 'mock/' + path; //モックにpath通し
  }

  /**
   * POSTを行うメソッド
   * @param {Object} send - リクエストパラメータ
   * @return {Object} resolve - レスポンスデータ
   * @return {Object} reject - エラーオブジェクト
   */


  _createClass(ApiClass, [{
    key: "post",
    value: function post() {
      var _this = this;

      var send = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      console.log("ApiClass.post START");
      if (!window.JSON) return null;
      return new Promise(function (resolve, reject) {
        request.post(_this.path).send(send).end(function (err, res) {
          res.ok ? resolve(_this.res(res)) : reject(_this.rej(err));
        });
      });
    }

    /**
     * GETを行うメソッド
     * @param {Object} send - リクエストパラメータ
     * @return {Object} resolve - レスポンスデータ
     * @throws {Object} reject - エラーオブジェクト
     */

  }, {
    key: "get",
    value: function get() {
      var _this2 = this;

      var send = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      console.log("ApiClass.get START");
      if (!window.JSON) return null;
      return new Promise(function (resolve, reject) {
        request.get(_this2.path).send(send).end(function (err, res) {
          res.ok ? resolve(_this2.res(res)) : reject(_this2.rej(err));
        });
      });
    }

    /**
     * resolveのラップ
     * @returns {Object} レスポンス
     */

  }, {
    key: "res",
    value: function res(_res) {
      console.log('success');
      return _res.body;
    }

    /**
     * resolveのラップ
     * @returns {Object} エラー
     */

  }, {
    key: "rej",
    value: function rej(err) {
      console.log('error');
      return err;
    }
  }]);

  return ApiClass;
}();

exports.default = ApiClass;

},{"superagent":2}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFadein = addFadein;
exports.addFadeout = addFadeout;
exports.onScroll = onScroll;
exports.onSideber = onSideber;
//--------------------------
// アニメーションメソッド
//--------------------------

/**
 * フェードインクラスの付加
 * @param {string} name - 適用するタグ名
 */
function addFadein(name) {
  $(name).addClass("fadein");
  $(name).removeClass("fadeout");
}
/**
 * フェードインクラスの付加
 * @param {string} name - 適用するタグ名
 */
function addFadeout(name) {
  $(name).addClass("fadeout");
  $(name).removeClass("fadein");
}
//---------------------------------------------------------------------------------
/**
 * スクロールのトップバー表示
 */
function onScroll() {
  var scrollTop = $(window).scrollTop();
  if (scrollTop < 50) {
    jQuery('ul.tabs').tabs(); //このロジックいまいち（エラー吐くでな）
    jQuery('.modal-trigger').leanModal();
  }
  !$('#sideber').hasClass("fadein") && scrollTop > 90 ? addFadein('.navbar-fixed-top') : addFadeout('.navbar-fixed-top');
}

/**
 * スクロールのサイドバー表示
 * @param {boolean=true} bool - 表示時:ture,非表示時:false
 */
function onSideber() {
  var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  bool ? addFadein('#sideber') : addFadeout('#sideber');
  bool ? addFadein('#sideber-overlay') : addFadeout('#sideber-overlay');
}

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LoadRequestAPI;

var _ApiClass = require('../util/ApiClass');

var _ApiClass2 = _interopRequireDefault(_ApiClass);

var _loading = require('../components/loading');

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API通信用
 * @param {Object} $scope - スコープ
 * @param {String} path - root以下のパス
 */
// INCLUDE
function LoadRequestAPI($scope, path) {
  console.log("onLoadRequestAPI");
  var api = new _ApiClass2.default(path);
  var loading = new _loading2.default();
  loading.show();

  // APIリクエスト(Thenでres|errorを受け取ってください。)
  api.post().then(function (res) {
    console.log("API OK!");
    console.log(res.books);
    $scope.parents = res.parents;
    $scope.categories = res.categories;
    $scope.books = res.books;
    loading.hide();
    $scope.$apply(); //画面更新
    jQuery('ul.tabs').tabs(); //描画後にtabにアニメーションを適用してね！
    jQuery('.modal-trigger').leanModal(); //描画後にモーダルのアニメーションを適用してね！
  }, function (error) {
    console.log("API NG!");
    loading.hide();
    $scope.$apply(); //画面更新
  });
} //APIのクラス

},{"../components/loading":7,"../util/ApiClass":15}],18:[function(require,module,exports){
'use strict';

var _common = require('./controller/common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//----------------------------------------------------------------------
// INITIALIZE
//----------------------------------------------------------------------
window.onload = function () {
  console.log('Page Loaded');
};

//----------------------------------------------------------------------
// コントローラ
//----------------------------------------------------------------------
//----------------------------------------------------------------------
// INCLUDE
//----------------------------------------------------------------------
angular.module('main', [_common2.default.name]);

/*********************************************************************
 * ## メモ ##
 * ng-includeは、onLoadModel後じゃないとクエリの発行はできないよ！
 * 
 * 
 * 
 ********************************************************************/

},{"./controller/common":10}]},{},[18]);
