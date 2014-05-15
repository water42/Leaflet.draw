L.Draw.TextLabel = L.Draw.Feature.extend({
	statics: {
		TYPE: 'textlabel'
	},

	options: {
		icon: new L.divIcon({
				className: 'count-icon',
				// html here defines what goes in the div created for each marker
				html: 'hi',
				// and the marker width and height
				iconSize: [40, 40]
			}),
		repeatMode: false,
		zIndexOffset: 2000 // This should be > than the highest z-index any markers
	},

	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.TextLabel.TYPE;

		L.Draw.Feature.prototype.initialize.call(this, map, options);
	},

	addHooks: function () {
		L.Draw.Feature.prototype.addHooks.call(this);

		//if (this._map){this._tooltip.updateContent({ text: L.drawLocal.draw.handlers.textlabel.tooltip.start });
		if (this._map){this._tooltip.updateContent({ text: 'Text Label' });

			// Same mouseMarker as in Draw.Polyline
			if (!this._mouseMarker) {
				this._mouseMarker = L.marker(this._map.getCenter(), {
					icon: L.divIcon({
						className: 'leaflet-textlabel',
						iconAnchor: [20, 20],
						iconSize: [40, 40]
					}),
					opacity: 0,
					zIndexOffset: this.options.zIndexOffset
				});
			}

			this._mouseMarker
				.on('click', this._onClick, this)
				.addTo(this._map);

			this._map.on('mousemove', this._onMouseMove, this);
			this._map.on('click', this._onTouch, this);
		}
	},

	removeHooks: function () {
		L.Draw.Feature.prototype.removeHooks.call(this);

		if (this._map) {
			if (this._textlabel) {
				this._textlabel.off('click', this._onClick, this);
				this._map
					.off('click', this._onClick, this)
					.off('click', this._onTouch, this)
					.removeLayer(this._textlabel);
				delete this._textlabel;
			}

			this._mouseMarker.off('click', this._onClick, this);
			this._map.removeLayer(this._mouseMarker);
			delete this._mouseMarker;

			this._map.off('mousemove', this._onMouseMove, this);
		}
	},

	_onMouseMove: function (e) {
		var latlng = e.latlng;

		this._tooltip.updatePosition(latlng);
		this._mouseMarker.setLatLng(latlng);

		if (!this._textlabel) {
			this._textlabel = new L.Marker(latlng, {
				icon: this.options.icon,
				zIndexOffset: this.options.zIndexOffset
			});
			// Bind to both marker and map to make sure we get the click event.
			this._textlabel.on('click', this._onClick, this);
			this._map
				.on('click', this._onClick, this)
				.addLayer(this._textlabel);
		}
		else {
			latlng = this._mouseMarker.getLatLng();
			this._textlabel.setLatLng(latlng);
		}
	},

	_onClick: function () {
		this._fireCreatedEvent();

		this.disable();
		if (this.options.repeatMode) {
			this.enable();
		}
	},

	_onTouch: function (e) {
		// called on click & tap, only really does any thing on tap
		this._onMouseMove(e); // creates & places marker
		this._onClick(); // permenantly places marker & ends interaction
	},

	_fireCreatedEvent: function () {
		var textLabel = new L.Marker(this._textlabel.getLatLng(), { icon: this.options.icon });
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, textLabel);
	}
});
