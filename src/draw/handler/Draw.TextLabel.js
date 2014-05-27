L.Draw.TextLabel = L.Draw.Feature.extend({
	statics: {
		TYPE: 'textlabel'
	},

	options: {
		repeatMode: false,
		zIndexOffset: 2000, // This should be > than the highest z-index any markers
		color: '#000000',
		fontSize: '12px'
	},

	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.TextLabel.TYPE;

		L.Draw.Feature.prototype.initialize.call(this, map, options);

		this._map = map;
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
		
		// Update Color and Font-size on initiate of tool
		this.options.icon = this._createDivIcon();

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

	_onFocus: function (e) {
		var target = e.target,
			child = target._icon.firstChild;

		// If it's been created, don't reset the color or fontsize based on the global setting
		if ( target.options.fontSize == undefined || target.options.color == undefined) {
	        target._icon.style.fontSize = target.options.fontSize = this.options.fontSize;
	        target._icon.style.color = target.options.color = this.options.color;
		}
 

		child.nextSibling.hidden = true; // hide text
		child.hidden = false; // Show textarea

		child.focus();
		
		// Call when done editing text
		child.onblur = this._onBlur;
		child.onkeyup = function(e){
			if(e.keyIdentifier == "Enter"){
				child.blur();
			}
		};
	},

	_onBlur: function (e) {
		var target = e.target;
		if ( target.value ){
			target.hidden = true; // hide textarea
			target.nextSibling.hidden = false; // show text

			target.nextSibling.textContent = target.value // update text with textarea value
		}
	},

	_fireCreatedEvent: function () {
		// #TODO: get textarea's width and height and use that to set the label's container for word wrapping
		// currently, css is set to white-space: nowrap

		var textLabel = new L.Marker.Touch(this._textlabel.getLatLng(), { icon: this.options.icon });

		textLabel.on('click', this._onFocus, this);

		L.Draw.Feature.prototype._fireCreatedEvent.call(this, textLabel);
	},

	//#TODO: use this instead of static icon
	_createInput: function (text, className) {
		var input = L.DomUtil.create('input', className, this._container);
		input.type = 'text';
		input.value = '';
		input.placeholder = text;

		L.DomEvent
			.disableClickPropagation(input)
			// .on(input, 'keyup', this._handleKeypress, this)
			// .on(input, 'keydown', this._handleAutoresize, this)
			.on(input, 'blur', function(){console.log('input blur')}, this)
			.on(input, 'focus', function(){console.log('input focus')}, this);

		return input;
	},
	
	//#TODO: use this instead of static icon
	_createDivIcon: function() {
		var divIcon = new L.divIcon({
			className: 'textlabel',
			// html here defines what goes in the div created for each marker
			// #TODO: have a cleaner approach to html
			html: '<textarea class="textlabel-textarea"></textarea><div class="textlabel-text"></div>',
			// and the marker width and height
			iconSize: [40, 40]
		});
		return divIcon;
	}
});
