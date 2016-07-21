/**
 * GatherContent Importer - v3.0.0 - 2016-07-20
 * http://www.gathercontent.com
 *
 * Copyright (c) 2016 GatherContent
 * Licensed under the GPLv2 license.
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = Backbone.Collection.extend({
	getById: function getById(id) {
		return this.find(function (model) {
			var modelId = model.get('id');
			return modelId === id || modelId && id && modelId == id;
		});
	}
});

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function (app) {
	return app.collections.base.extend({
		model: app.models.item,

		totalChecked: 0,
		allChecked: false,
		syncEnabled: false,
		processing: false,

		initialize: function initialize() {
			this.listenTo(this, 'checkAll', this.toggleChecked);
			this.listenTo(this, 'checkSome', this.toggleCheckedIf);
			this.listenTo(this, 'change:checked', this.checkChecked);
		},

		checkChecked: function checkChecked(model) {
			var render = false;

			if (model.changed.checked) {
				this.totalChecked++;
			} else {
				if (this.totalChecked === this.length) {
					this.allChecked = false;
					render = true;
				}
				this.totalChecked--;
			}

			var syncWasEnabled = this.syncEnabled;
			this.syncEnabled = this.totalChecked > 0;

			if (syncWasEnabled !== this.syncEnabled) {
				this.trigger('enabledChange', this.syncEnabled);
			}

			if (this.totalChecked < this.length) {
				this.trigger('notAllChecked', false);
			}
		},

		toggleCheckedIf: function toggleCheckedIf(cb) {
			this.processing = true;
			this.each(function (model) {
				model.set('checked', Boolean('function' === typeof cb ? cb(model) : cb));
			});
			this.processing = false;
			this.trigger('render');
		},

		toggleChecked: function toggleChecked(checked) {
			this.allChecked = checked;
			this.toggleCheckedIf(checked);
		},

		checkedCan: function checkedCan(pushOrPull) {
			switch (pushOrPull) {
				case 'pull':
					pushOrPull = 'canPull';
					break;
				case 'assign':
					pushOrPull = 'disabled';
					break;
				// case 'push':
				default:
					pushOrPull = 'canPush';
					break;
			}

			var can = this.find(function (model) {
				return model.get(pushOrPull) && model.get('checked');
			});

			return can;
		}

	});
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function (app) {
	app.models = { base: require('./models/base.js') };
	app.collections = { base: require('./collections/base.js') };
	app.views = { base: require('./views/base.js') };
};

},{"./collections/base.js":1,"./models/base.js":5,"./views/base.js":8}],4:[function(require,module,exports){
'use strict';

module.exports = function (app, defaults) {
	defaults = jQuery.extend({}, {
		action: 'gc_sync_items',
		data: '',
		percent: 0,
		nonce: '',
		id: '',
		stopSync: true,
		flush_cache: false
	}, defaults);

	return app.models.base.extend({
		defaults: defaults,

		initialize: function initialize() {
			this.listenTo(this, 'send', this.send);
		},

		reset: function reset() {
			this.clear().set(this.defaults);
			return this;
		},

		send: function send(formData, cb, percent, failcb) {
			if (percent) {
				this.set('percent', percent);
			}

			jQuery.post(window.ajaxurl, {
				action: this.get('action'),
				percent: this.get('percent'),
				nonce: this.get('nonce'),
				id: this.get('id'),
				data: formData,
				flush_cache: this.get('flush_cache')
			}, (function (response) {
				this.trigger('response', response, formData);

				if (response.success) {
					return cb(response);
				}

				if (failcb) {
					return failcb(response);
				}
			}).bind(this));

			return this;
		}

	});
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = Backbone.Model.extend({
	sync: function sync() {
		return false;
	}
});

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (app) {
	return app.models.base.extend({
		defaults: {
			id: 0,
			item: 0,
			project_id: 0,
			parent_id: 0,
			template_id: 0,
			custom_state_id: 0,
			position: 0,
			name: '',
			config: '',
			notes: '',
			type: '',
			overdue: false,
			archived_by: '',
			archived_at: '',
			created_at: null,
			updated_at: null,
			status: null,
			due_dates: null,
			expanded: false,
			checked: false
		},
		_get: function _get(value, attribute) {
			switch (attribute) {
				case 'item':
					value = this.get('id');
					break;
			}

			return value;
		},

		get: function get(attribute) {
			return this._get(app.models.base.prototype.get.call(this, attribute), attribute);
		},

		// hijack the toJSON method and overwrite the data that is sent back to the view.
		toJSON: function toJSON() {
			return _.mapObject(app.models.base.prototype.toJSON.call(this), _.bind(this._get, this));
		}

	});
};

},{}],7:[function(require,module,exports){
'use strict';

window.GatherContent = window.GatherContent || {};

(function (window, document, $, gc, undefined) {
	'use strict';

	gc.sync = gc.sync || {};
	var app = gc.sync;

	// Initiate base objects.
	require('./initiate-objects.js')(app);

	/*
  * Item setup
  */

	app.models.item = require('./models/item.js')(app);
	app.collections.items = require('./collections/items.js')(app);
	app.views.item = require('./views/item.js')(app);
	app.views.items = require('./views/items.js')(app, $, gc);

	app.init = function () {
		// Kick it off.
		app.syncView = new app.views.items({
			collection: new app.collections.items(gc._items)
		});
	};

	$(app.init);
})(window, document, jQuery, window.GatherContent);

},{"./collections/items.js":2,"./initiate-objects.js":3,"./models/item.js":6,"./views/item.js":9,"./views/items.js":10}],8:[function(require,module,exports){
'use strict';

module.exports = Backbone.View.extend({
	toggleExpanded: function toggleExpanded(evt) {
		this.model.set('expanded', !this.model.get('expanded'));
	},

	getRenderedModels: function getRenderedModels(View, models) {
		models = models || this.collection;
		var addedElements = document.createDocumentFragment();

		models.each(function (model) {
			var view = new View({ model: model }).render();
			addedElements.appendChild(view.el);
		});

		return addedElements;
	},

	render: function render() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	close: function close() {
		this.remove();
		this.unbind();
		if (this.onClose) {
			this.onClose();
		}
	}
});

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function (app) {
	return app.views.base.extend({
		template: wp.template('gc-item'),
		tagName: 'tr',
		className: 'gc-item gc-enabled',
		id: function id() {
			return this.model.get('id');
		},

		events: {
			'change .check-column input': 'toggleCheck',
			'click .gc-reveal-items': 'toggleExpanded',
			'click .gc-status-column': 'toggleCheckAndRender'
		},

		initialize: function initialize() {
			this.listenTo(this.model, 'change:checked', this.render);
		},

		toggleCheck: function toggleCheck() {
			this.model.set('checked', !this.model.get('checked'));
		},

		toggleCheckAndRender: function toggleCheckAndRender(evt) {
			this.toggleCheck();
			this.render();
		}
	});
};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (app, $, gc) {
	var percent = gc.percent;
	var thisView;
	var masterCheckSelector = '.gc-field-th.check-column input';

	return app.views.base.extend({
		el: '#sync-tabs',
		template: wp.template('gc-items-sync'),
		progressTemplate: wp.template('gc-items-sync-progress'),
		spinnerRow: '<tr><td colspan="6"><span class="gc-loader spinner is-active"></span></td></tr>',
		$wrap: $('.gc-admin-wrap'),
		timeoutID: null,
		ajax: null,

		events: function events() {
			var evts = {
				'click .gc-cancel-sync': 'clickCancelSync'
			};
			evts['change ' + masterCheckSelector] = 'checkAll';

			return evts;
		},

		initialize: function initialize() {
			thisView = this;

			this.setupAjax();

			this.listenTo(this.ajax, 'response', this.ajaxResponse);
			this.listenTo(this.collection, 'render', this.render);
			this.listenTo(this.collection, 'enabledChange', this.checkEnableButton);
			this.listenTo(this.collection, 'notAllChecked', this.allCheckedStatus);
			this.listenTo(this, 'render', this.render);

			this.$wrap.on('submit', 'form', this.submit.bind(this));

			this.initRender();
		},

		setupAjax: function setupAjax() {
			var Ajax = require('./../models/ajax.js')(app, {
				checkHits: 0,
				time: 500,
				nonce: gc.el('_wpnonce').value,
				id: gc.el('gc-input-mapping_id').value,
				flush_cache: gc.queryargs.flush_cache ? 1 : 0
			});

			this.ajax = new Ajax({
				percent: percent
			});
		},

		checkEnableButton: function checkEnableButton(syncEnabled) {
			this.buttonStatus(syncEnabled);
		},

		buttonStatus: function buttonStatus(enable) {
			this.$wrap.find('.button-primary').prop('disabled', !enable);
		},

		allCheckedStatus: function allCheckedStatus(checked) {
			this.$wrap.find(masterCheckSelector).prop('checked', checked);
		},

		checkAll: function checkAll(evt) {
			this.collection.trigger('checkAll', $(evt.target).is(':checked'));
		},

		clickCancelSync: function clickCancelSync(evt) {
			evt.preventDefault();
			this.cancelSync();
		},

		doSpinner: function doSpinner() {
			this.$el.find('tbody').html(this.spinnerRow);
		},

		submit: function submit(evt) {
			evt.preventDefault();
			this.startSync(this.$wrap.find('form').serialize());
		},

		startSync: function startSync(formData) {
			this.doSpinner();
			this.ajax.reset().set('stopSync', false);
			this.renderProgress(100 === window.parseInt(percent, 10) ? 0 : percent);
			this.doAjax(formData, percent);
		},

		cancelSync: function cancelSync(url) {
			percent = null;

			this.ajax.reset();
			this.clearInterval();

			if (url) {
				this.doAjax('cancel', 0, function () {
					window.location.href = url;
				});
			} else {
				this.doAjax('cancel', 0, function () {});
				this.initRender();
			}
		},

		doAjax: function doAjax(formData, completed, cb) {
			cb = cb || this.ajaxSuccess.bind(this);
			this.ajax.send(formData, cb, completed);
		},

		ajaxSuccess: function ajaxSuccess(response) {
			if (this.ajax.get('stopSync')) {
				return;
			}

			percent = response.data.percent || 1;
			var hits = this.checkHits();
			var time = this.ajax.get('time');

			if (hits > 25 && time < 2000) {
				this.clearInterval();
				this.ajax.set('time', 2000);
			} else if (hits > 50 && time < 5000) {
				this.clearInterval();
				this.ajax.set('time', 5000);
			}

			this.setTimeout(this.checkProgress.bind(this));

			if (percent > 99) {
				this.cancelSync(window.location.href + '&updated=1&flush_cache=1&redirect=1');
			} else {
				this.renderProgressUpdate(percent);
			}
		},

		setTimeout: function setTimeout(callback) {
			this.timeoutID = window.setTimeout(callback, this.ajax.get('time'));
		},

		clearInterval: function clearInterval() {
			window.clearTimeout(this.timeoutID);
			this.timeoutID = null;
		},

		checkProgress: function checkProgress() {
			this.doAjax('check', percent);
		},

		checkHits: function checkHits() {
			return window.parseInt(this.ajax.get('checkHits'), 10);
		},

		ajaxResponse: function ajaxResponse(response, formData) {
			gc.log('warn', 'hits/interval/response: ' + this.checkHits() + '/' + this.ajax.get('time') + '/', response.success ? response.data : response);

			if ('check' === formData) {
				this.ajax.set('checkHits', this.checkHits() + 1);
			} else if (response.data) {
				this.ajax.set('checkHits', 0);
			}

			if (!response.success) {
				this.renderProgressUpdate(0);
				if (response.data) {
					window.alert(response.data);
				}
				this.cancelSync();
			}
		},

		renderProgressUpdate: function renderProgressUpdate(percent) {
			this.$('.gc-progress-bar-partial').css({ width: percent + '%' }).find('span').text(percent + '%');
		},

		renderProgress: function renderProgress(percent) {
			this.$wrap.addClass('gc-sync-progress');
			this.buttonStatus(false);
			this.$el.html(this.progressTemplate({ percent: percent }));
		},

		initRender: function initRender() {
			// If sync is going, show that status.
			if (percent > 0 && percent < 100) {
				this.startSync('check');
			} else {
				this.$el.html(this.template({ checked: this.collection.allChecked }));
				this.render();
			}
		},

		render: function render() {
			// Not syncing, so remove wrap-class
			this.$wrap.removeClass('gc-sync-progress');

			// Re-render and replace table rows.
			this.$el.find('tbody').html(this.getRenderedModels(app.views.item));

			// Make sync button enabled/disabled
			this.buttonStatus(this.collection.syncEnabled);

			// Make check-all inputs checked/unchecked
			this.allCheckedStatus(this.collection.allChecked);

			return this;
		}
	});
};

},{"./../models/ajax.js":4}]},{},[7]);
