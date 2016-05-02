/* jshint laxbreak: true */
var parser = function(arr) {
	var iso = new RegExp(/(&#34;)/g), apo = '"';
	arr.forEach(function(i) {
		for (var p in i ) {
			if (typeof i[p] === 'object') {
				i[p].types[0] = i[p].types[0].replace(iso, apo);
			} else {
				i[p] = i[p].replace(iso, apo);
			}
		}
	});
};
prism.registerWidget("<%= name %>", {

	name : "<%= name %>",
	family : "<%= family %>",
	title : "<%= title %>",
	iconSmall : "/plugins/<%= name %>/widget-24.png",
	styleEditorTemplate : null,
	style : {},
	// sizing must be stated
	sizing: {
		minHeight: 128, // header
		maxHeight: 2048,
		minWidth: 128,
		maxWidth: 2048,
		height: 640,
		defaultWidth: 512
	},
	data: {
		selection : [],
		defaultQueryResult : {},
		panels: <%= panels %>, // jshint ignore:line
		allocatePanel: function(widget, metadataItem) {

			for (var i = 0; i < this.data.panels.length; i++) {

				if (prism.$jaql.isMeasure(metadataItem)
				&& widget.metadata.panel(this.data.panels[i].name).items.length === 0) {
					return this.data.panels[i].name;
				}

		},
		// returns true/ reason why the given item configuration is not/supported by the widget
		isSupported: function(items) {
			return this.rankMetadata(items, null, null) > - 1;
		},
		// ranks the compatibility of the given metadata items with the widget
		rankMetadata: function(items, type, subtype) {
			var a = prism.$jaql.analyze(items);
			// require at least 2 dimensions of lat and lng and 1 measure
			return -1;
		},
		// populates the metadata items to the widget
		populateMetadata: function(widget, items) {
			var a = prism.$jaql.analyze(items);
			// allocating dimensions
			widget.metadata.panel("Item").push(a.dimensions);
			widget.metadata.panel("X-Axis").push(a.measures);
			widget.metadata.panel("Y-Axis").push(a.measures);
			widget.metadata.panel("X-Origin").push(a.measures);
			widget.metadata.panel("Y-Origin").push(a.measures);
			widget.metadata.panel("filters").push(a.filters);
		},
		// builds a jaql query from the given widget
		buildQuery: function(widget) {
			// building jaql query object from widget metadata
			var query = {
				datasource : widget.datasource,
				metadata : []
			};
			// pushing items
			widget.metadata.panel("Item").items.forEach(function (item) {
				query.metadata.push(item);
			});
			// pushing data
			query.metadata.push(widget.metadata.panel("X-Axis").items[0]);
			query.metadata.push(widget.metadata.panel("Y-Axis").items[0]);
			query.metadata.push(widget.metadata.panel("X-Origin").items[0]);
			query.metadata.push(widget.metadata.panel("Y-Origin").items[0]);
			// series - dimensions
			widget.metadata.panel('filters').items.forEach(function (item) {
				item = $$.object.clone(item, true);
				item.panel = "scope";
				query.metadata.push(item);
			});
			return query;
		},
		// prepares the widget-specific query result from the given result data-table
		processResult: function(widget, queryResult) {
			return queryResult;
		}
	},
	render: function(s, e) {
		var $lmnt = $(e.element), rawData = s.queryResult.$$rows;

		// this is where most of the customization will come in, depending on family type

		if (!document.getElementById('svgDivId')) {
			var svgDiv = document.createElement('div')
			svgDiv.className = 'svgDiv'
			svgDiv.id = 'svgDivId'
			$lmnt.append(svgDiv)
		}

		console.log($lmnt)
		var rawData = s.queryResult.$$rows; // results
		//var headers = s.rawQueryResult.headers; // headers

			console.log("rawdata",rawData)
		var dataArray = [], xAxis = [], yAxis = []
		var setup= {};
			setup.width=800;
			setup.height=600;
			setup.dotRadius=4;
			setup.xtype = '.3n';
			setup.ytype = '.3n';
			setup.gridSpacing = 40;

		if (rawData && rawData[0][0] && rawData[0][1] && rawData[0][2]  && rawData[0][3] && rawData[0][4]) {

			for(var i =0; i < rawData.length; i++){
				var tmp = {
						label : rawData[i][0].data,
						x : rawData[i][1].data,
						y : rawData[i][2].data
					}
				dataArray.push(tmp)
				xAxis.push(rawData[i][1].data)
				yAxis.push(rawData[i][2].data)

			}

			xAxis.sort()
			yAxis.sort()
			xCenter = 0
			yCenter = 0
			xAxis.forEach(function(item){
				xCenter += item
			})

			yAxis.forEach(function(item){
				yCenter += item
			})

			xCenter = xCenter / xAxis.Length
			yCenter = yCenter / yAxis.LengthA

			setup.quadrantxaxis = rawData[0][3].data
			setup.quadrantyaxis = rawData[0][4].data


			console.log('objectin', dataArray, setup.quadrantxaxis, setup.quadrantyaxis)
			//$lmnt.empty();

			createQuadrantChart("svgDivId", dataArray, setup);
		}
	},

	destroy : function (s, e) {}
});
