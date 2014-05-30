// Styleable is depended on Jquery and Spectrum.js
// Spectrum was picked for the community support and features with pallets, alpha, touch and multi instance
// This is included for demo only. You should grab the latest version
// of it here: https://github.com/bgrins/spectrum
// Specrum is dependent on jquery but that's cool :P

L.EditToolbar.Styleable = L.Handler.extend({
	statics: {
		TYPE: 'styleable'
	},

	includes: L.Mixin.Events,

	initialize: function (map, options) {
		this._styleable = this; // cache this to target in jquery
		
		L.Handler.prototype.initialize.call(this, map);

		L.Util.setOptions(this, options);
		
		this._map = map;

		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.EditToolbar.Styleable.TYPE;

		this._setColor('#fe57a1', '0.2'); // Set color for all tools on load
		this._createControls(); // Create style controls
	},

	enable: function () {
	},

	disable: function () {
	},

	addHooks: function () {
		//this.fire('enable');
	},
	
	removeHooks: function () {
	},
	
	_createControls: function () {
		var styleable = this._styleable,
			selectStroke = this._createSelect(20),
			selectFontSize = this._createSelect(50),
			inputURL = this._createInput(),
			inputDescription = this._createInput();
		
		// default settings
		// #TODO: move to init() and use this.options/settings
		this._setStroke(4);
		this._setFontSize(12);
		selectStroke.value = 4;
		selectFontSize.value = 12;		

		selectStroke.addEventListener('change', function() {
			styleable._setStroke(this.value); 
		});
		
		selectFontSize.addEventListener('change', function() {
			styleable._setFontSize(this.value); 
		});

		$(document).ready(function(){ // initialize after dom creation
			// Color is depended on Jquery and Spectrum.js
			$('.leaflet-draw-edit-styleable').spectrum({
				chooseText: 'Ok',
				color: 'rgba(254,87,161,0.2)', //Hot pink all the things! 
				showAlpha: true,
				showPalette: true,
				palette: [ ],
				allowEmpty:true,
			    chooseText: "Close",
			    cancelText: "",
				move: function(color) {
					styleable._setColor(color.toHexString(), color.alpha);
				}
			});

			// #TODO: Be less redundant
			var polyControlsContainer = L.DomUtil.create('fieldset', 'sp-palette-container poly-controls'),
				textControlsContainer = L.DomUtil.create('fieldset', 'sp-palette-container text-controls'),
				linkControlsContainer = L.DomUtil.create('fieldset', 'sp-palette-container link-controls'),
				polyLegend = L.DomUtil.create('legend', 'leaflet-draw-layer-edit-styleable-legend'),
				textLegend = L.DomUtil.create('legend', 'leaflet-draw-layer-edit-styleable-legend'),
				linkLegend = L.DomUtil.create('legend', 'leaflet-draw-layer-edit-styleable-legend'),
				strokeLabel = L.DomUtil.create('label', 'leaflet-draw-layer-edit-styleable-stroke-label'),
				fontLabel = L.DomUtil.create('label', 'leaflet-draw-layer-edit-styleable-font-label')
				urlLabel = L.DomUtil.create('label', 'leaflet-draw-layer-edit-styleable-url-label'),
				descriptionLabel = L.DomUtil.create('label', 'leaflet-draw-layer-edit-styleable-description-label');
			
			polyLegend.textContent = 'Poly Shape Settings';
			strokeLabel.textContent = 'Stroke Width: ';
			
			textLegend.textContent = 'Font Settings';
			fontLabel.textContent = 'Font Size: ';

			linkLegend.textContent = 'Link Settings';
			urlLabel.textContent = 'Url: ';
			descriptionLabel.textContent = 'Descption: ';
			
			polyControlsContainer.appendChild(polyLegend);
			polyControlsContainer.appendChild(strokeLabel);
			polyControlsContainer.appendChild(selectStroke);
			
			textControlsContainer.appendChild(textLegend);
			textControlsContainer.appendChild(fontLabel);
			textControlsContainer.appendChild(selectFontSize);

			linkControlsContainer.appendChild(linkLegend);
			linkControlsContainer.appendChild(urlLabel);
			linkControlsContainer.appendChild(inputURL);
			linkControlsContainer.appendChild(descriptionLabel);
			linkControlsContainer.appendChild(inputDescription);

			$('.leaflet-draw-edit-styleable').spectrum("container").append(polyControlsContainer);
			$('.leaflet-draw-edit-styleable').spectrum("container").append(textControlsContainer);
			$('.leaflet-draw-edit-styleable').spectrum("container").append(linkControlsContainer);
		});
	},

	_createSelect: function (n) { 
		var select = L.DomUtil.create('select','leaflet-draw-layer-edit-styleable-select');

		for ( var i = 1; n >= i; i++) {
			var option = L.DomUtil.create("option",'size-' + i);
			option.setAttribute('style','font-size: ' + i + 'px');
			option.value = i
			option.text = i;
			select.add(option);
		}

		return select
	},

	_createInput: function () {
		var input = L.DomUtil.create('input','leaflet-draw-layer-edit-styleable-input');
		return input
	},

	_setDescription: function (description) {
		// Edit selected item in edit mode
		if (L.previousLayer != null ) {
			if (L.previousLayer instanceof L.Marker) {
				L.previousLayer._icon.style.fontSize = L.previousLayer.options.fontSize = size + 'px';
			} else {
				// #TODO: change opacity if it is just the polyline
				L.previousLayer.setStyle({
					fontSize: size
				});
			}
			L.previousLayer.edited = true;
			L.previousLayer.styled = true; // #TODO: simplyfy this to use .edited
		}

		// Use global var of toolbar that gets set on L.Control.Draw initialization
		L.toolbarDraw.setDrawingOptions({ 
			textlabel: { fontSize: size + 'px' }
		});
	},

	_setURL: function (Url) {
		// Edit selected item in edit mode
		if (L.previousLayer != null ) {
			if (L.previousLayer instanceof L.Marker) {
				L.previousLayer._icon.style.fontSize = L.previousLayer.options.fontSize = size + 'px';
			} else {
				// #TODO: change opacity if it is just the polyline
				L.previousLayer.setStyle({
					fontSize: size
				});
			}
			L.previousLayer.edited = true;
			L.previousLayer.styled = true; // #TODO: simplyfy this to use .edited
		}

		// Use global var of toolbar that gets set on L.Control.Draw initialization
		// L.toolbarDraw.setDrawingOptions({ 
		// 	textlabel: { fontSize: size + 'px' }
		// });
	},
	
	_setFontSize: function (size) {
		// Edit selected item in edit mode
		if (L.previousLayer != null ) {
			if (L.previousLayer instanceof L.Marker) {
				L.previousLayer._icon.style.fontSize = L.previousLayer.options.fontSize = size + 'px';
			} else {
				// #TODO: change opacity if it is just the polyline
				L.previousLayer.setStyle({
					fontSize: size
				});
			}
			L.previousLayer.edited = true;
			L.previousLayer.styled = true; // #TODO: simplyfy this to use .edited
		}

		// Use global var of toolbar that gets set on L.Control.Draw initialization
		L.toolbarDraw.setDrawingOptions({ 
			textlabel: { fontSize: size + 'px' }
		});
	},

	_setColor: function (color, opacity) {
		// Edit selected item in edit mode
		if (L.previousLayer != null ) {
			if (L.previousLayer instanceof L.Marker) {
				L.previousLayer._icon.style.color = L.previousLayer.options.color = color;
			} else {
				// #TODO: change opacity if it is just the polyline
				L.previousLayer.setStyle({
					color: color,
					fillOpacity: opacity
				});
			}

			L.previousLayer.edited = true;
			L.previousLayer.styled = true; // #TODO: simplyfy this to use .edited
		}

		// Use global var of toolbar that gets set on L.Control.Draw initialization
		L.toolbarDraw.setDrawingOptions({ 
			polyline: { shapeOptions: { color: color, opacity: opacity } },
			polygon: { shapeOptions: { color: color, fillOpacity: opacity } },
			rectangle: { shapeOptions: { color: color, fillOpacity: opacity } },
			circle: { shapeOptions: { color: color, fillOpacity: opacity } },
			textlabel: { color: color }
		});
	},

	_setStroke: function (weight) {
		// Edit selected item in edit mode
		if (L.previousLayer != null ) {
			L.previousLayer.setStyle({
				weight: weight
			});
			L.previousLayer.edited = true;
			L.previousLayer.styled = true; // #TODO: simplyfy this to use .edited
		}
		
		// Use global var of toolbar that gets set on L.Control.Draw initialization
		L.toolbarDraw.setDrawingOptions({ 
			polyline: { shapeOptions: { weight: weight } },
			polygon: { shapeOptions: { weight: weight } },
			rectangle: { shapeOptions: { weight: weight } },
			circle: { shapeOptions: { weight: weight } }
		});
	},
});