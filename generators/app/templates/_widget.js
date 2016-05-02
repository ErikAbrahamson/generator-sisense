/* jshint laxbreak: true */
prism.registerWidget("<%= name %>", {

	name : "<%= name %>",
	family : "<%= family %>",
	title : "<%= title %>",
	iconSmall : "/plugins/<%= name %>/widget-24.png",
	styleEditorTemplate : null,
	style : {},
	sizing: {
		minHeight: 128,
		maxHeight: 2048,
		minWidth: 128,
		maxWidth: 2048,
		height: 640,
		defaultWidth: 512
	},
	data: {
		selection : [],
		defaultQueryResult : {},
		panels: <%- panels %>,
		allocatePanel: function(widget, metadataItem) {

			var p = widget.metadata.panels;
			for (var i = 0; i < p.length; i++) {
				if (prism.$jaql.isMeasure(metadataItem)
				&& widget.metadata.panel(p[i].name).items.length === 0) {
					return p[i].name;

				} else if (!prism.$jaql.isMeasure(metadataItem)
				&& widget.metadata.panel(p[i].name).items.length < 3) {
					return 'items';
				}
			}
		},
		isSupported: function(items) {
			return this.rankMetadata(items, null, null) > - 1;
		},
		rankMetadata: function(items, type, subtype) {
			var a = prism.$jaql.analyze(items);
			if (a.dimensions.length < 1 && a.measures.length < 1) return 0;
			return -1;
		},
		populateMetadata: function(widget, items) {

			var a = prism.$jaql.analyze(items), p = widget.metadata.panels;
			for (var i = 0; i < p.length; i++) {
				if (p[i].metadata.types[0] === 'filters') {
					widget.metadata.panel(p[i].name).push(a.filters);
				} else if (p[i].metadata.types[0] === 'dimensions') {
					widget.metadata.panel(p[i].name).push(a.dimensions);
				} else if (p[i].metadata.types[0] === 'measures') {
					widget.metadata.panel(p[i].name).push(a.measures);
				}
			}
		},
		buildQuery: function(widget) {
			var query = {
				datasource : widget.datasource,
				metadata : []
			};

			widget.metadata.panel("Item").items.forEach(function(item) {
				query.metadata.push(item);
			});

			var p = widget.metadata.panels;
			for (var i = 0; i < p.length; i++) {
				if (p[i].name !== 'filters') {
					query.metadata.push(widget.metadata.panel(p[i].name).items[0]);
				}
			}

			widget.metadata.panel('filters').items.forEach(function(item) {
				item = $$.object.clone(item, true);
				item.panel = "scope";
				query.metadata.push(item);
			});
			return query;
		},

		processResult: function(widget, queryResult) {
			return queryResult;
		}
	},
	render: function(s, e) {

		// fetch data from widget, and bind data to viz lib
		var $lmnt = $(e.element), rawData = s.queryResult.$$rows;

	},
	destroy: function (s, e) {}
});
