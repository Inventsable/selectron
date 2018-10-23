var hasSelection = app.project.activeItem.selectedLayers.length > 0;
var exist = app.project.items.length > 0;

function scanSelection() {
  var activeItem = app.project.activeItem;
  var result = {
    layers: {
      raw: [],
      length: 0,
    },
  };
  if (activeItem != null && activeItem instanceof CompItem) {
    if (activeItem.selectedLayers.length > 0) {
      var child = {};
      result.layers.length = activeItem.selectedLayers.length;
      for (var i = 0; i < activeItem.selectedLayers.length; i++) {
        var layer = activeItem.selectedLayers[i];
        child = {
          name: layer.name,
          DNA: 'app.project.activeItem.layers[' + layer.index + ']',
          index: layer.index,
          locked: layer.locked,
          props: []
        }
        if (layer.selectedProperties.length > 0) {
         // This should be replaced with redefinery recursive loop
        for (var e = 0; e < layer.selectedProperties.length; e++) {
          var prop = layer.selectedProperties[e];
            var childprop = {
              name: prop.name,
              index: prop.propertyIndex,
              depth: prop.propertyDepth,
              parent: prop.propertyGroup().name,
              layer: layer.index,
            }
            if (prop.isEffect)
              childprop['DNA'] = child.DNA + '(\"' + prop.name + '\")';
            else if (prop.parent == 'Transform')
              childprop['DNA'] = child.DNA + '.' + prop.name.toLowerCase();
            else
              childprop['DNA'] = child.DNA + '.' + prop.name;
            child.props.push(childprop);
          }
        }
        result.layers.raw.push(child);
      }
    }
  }
  return JSON.stringify(result);
}


function scanComp() {
  var activeItem = app.project.activeItem;
  var result = {
    layers: {
      raw: [],
      length: 0,
    },
  };
  if (activeItem != null && activeItem instanceof CompItem) {
    if (activeItem.layers.length > 0) {
      var child = {};
      result.layers.length = activeItem.layers.length;
      for (var i = 1; i <= activeItem.layers.length; i++) {
        var layer = activeItem.layers[i], blank = [];
        child = {
          name: layer.name,
          DNA: 'app.project.activeItem.layers[' + layer.index + ']',
          index: layer.index,
          locked: layer.locked,
          props: scanPropGroupProperties(layer, blank, layer.index),
        }
        result.layers.raw.push(child);
      }
    }
  }
  return JSON.stringify(result);
}

// thanks redefinery
// http://www.redefinery.com/ae/fundamentals/properties/
function scanPropGroupProperties(propGroup, mirror, parent) {
  // console.log(mirror);
  var i, prop;
  var group = {
    index: propGroup.propertyIndex,
    depth: propGroup.propertyDepth,
    // parent: propGroup.parentProperty,
    layer: parent,
    name: propGroup.name,
    matchName: propGroup.matchName,
    children: [],
  }
  // Iterate over the specified property group's properties
  for (i = 1; i <= propGroup.numProperties; i++) {
    prop = propGroup.property(i);
    if (prop.propertyType === PropertyType.PROPERTY) {
      if (prop.canSetExpression) {
        var child = {
          index: prop.propertyIndex,
          depth: prop.propertyDepth,
          parent: prop.propertyGroup().name,
          value: prop.value,
        }
        if (prop.expressionEnabled)
          child['exp'] = prop.expression;
        else
          child['exp'] = false;
        if (prop.hasMax) {
          child['maxValue'] = prop.maxValue;
          child['minValue'] = prop.minValue;
        }
        group.children.push(child)
      }

      // console.log(prop.name);
      // FYI: layer markers have a prop.matchName = "ADBE Marker"
    } else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP)) {
      // Found an indexed or named group, so check its nested properties
      scanPropGroupProperties(prop, mirror);
    }
  }
  mirror.push(group)
  return mirror;
}

// checkPropsOnSelected();
function checkPropsOnSelected() {
  var results = [];
  if (hasSelection) {
    for (var i = 0; i < app.project.activeItem.selectedLayers.length; i++) {
      var targ = app.project.activeItem.selectedLayers[i], reflect = [];
      var propList = scanPropGroupProperties(targ, reflect);
      results.push(propList);
    }
  }
  return JSON.stringify(results);
}
