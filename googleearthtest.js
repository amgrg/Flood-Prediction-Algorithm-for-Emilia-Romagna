// Load the Romagna FeatureCollection
for google earth engine code editor

var romagna = ee.FeatureCollection('projects/erfloodprevention/assets/romagna_italy');

// Center map on Romagna region
Map.centerObject(romagna, 8);

// Style the FeatureCollection
var romagnaStyle = {
  color: 'FF0000', // Red outline
  fillColor: '00000000', // Transparent fill
  width: 2
};

// Add the styled layer to the map
Map.addLayer(romagna, romagnaStyle, 'Romagna Region');

// Add different basemap layers
Map.setOptions('HYBRID');

// Create a custom UI panel
var panel = ui.Panel({
  style: {
    width: '300px',
    padding: '10px'
  }
});

// Add a title
panel.add(ui.Label({
  value: 'Romagna Region Analysis',
  style: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0'
  }
}));

// Calculate and display area
var area = romagna.geometry().area().divide(1000000); // Convert to km²
area.evaluate(function(result) {
  panel.add(ui.Label('Total Area: ' + result.toFixed(2) + ' km²'));
});

// Add feature count
var count = romagna.size();
count.evaluate(function(result) {
  panel.add(ui.Label('Number of Features: ' + result));
});

// Add property names
var properties = romagna.first().propertyNames();
properties.evaluate(function(props) {
  panel.add(ui.Label('Properties:', {fontWeight: 'bold', margin: '10px 0'}));
  props.forEach(function(prop) {
    panel.add(ui.Label('- ' + prop));
  });
});

// Add legend
var legend = ui.Panel({
  style: {
    padding: '8px 15px',
    position: 'bottom-left'
  }
});

var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});

legend.add(legendTitle);

var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('#FF0000', 'Region Boundary'));

// Add layer controls
var layerPanel = ui.Panel({
  style: {
    position: 'top-right',
    padding: '10px'
  }
});

// Add export button
var exportButton = ui.Button({
  label: 'Export to Drive',
  onClick: function() {
    Export.table.toDrive({
      collection: romagna,
      description: 'Romagna_Region_Export',
      fileFormat: 'GeoJSON'
    });
  }
});

panel.add(ui.Label('', {margin: '10px 0'}));  // Spacer
panel.add(exportButton);

// Add basemap selector
var basemapSelector = ui.Select({
  items: ['HYBRID', 'SATELLITE', 'ROADMAP', 'TERRAIN'],
  value: 'HYBRID',
  onChange: function(value) {
    Map.setOptions(value);
  },
  style: {margin: '10px 0'}
});

panel.add(ui.Label('Basemap:', {margin: '10px 0 0 0'}));
panel.add(basemapSelector);

// Add panels to the map
Map.add(panel);
Map.add(legend);

// Add scale bar and north arrow
Map.setControlVisibility({
  scaleControl: true,
  zoomControl: true,
  fullscreenControl: true
});

// Print some basic statistics to the console
print('Romagna Region Statistics:', {
  'Dataset': 'projects/erfloodprevention/assets/romagna_italy',
  'Number of Features': romagna.size(),
  'Geometry Type': romagna.first().geometry().type(),
  'CRS': romagna.first().geometry().projection()
});

// Function to get feature properties
var getFeatureProperties = function(feature) {
  return feature.toDictionary();
};

// Print first feature properties
print('First Feature Properties:', romagna.first().toDictionary());