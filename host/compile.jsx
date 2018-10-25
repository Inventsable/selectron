var hasSelection = app.project.activeItem.selectedLayers.length > 0;
var exist = app.project.items.length > 0;
function scanSelection() {
    var activeItem = app.project.activeItem;
    var result = {
        layers: {
            raw: [],
            length: 0
        }
    };
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.selectedLayers.length > 0) {
            var child = {};
            result.layers.length = activeItem.selectedLayers.length;
            for (var i = 0; i < activeItem.selectedLayers.length; i++) {
                var layer = activeItem.selectedLayers[i];
                if (layer.property("sourceText") === null) {
                    child = {
                        name: layer.name,
                        DNA: 'app.project.activeItem.layers[' + layer.index + ']',
                        index: layer.index,
                        locked: layer.locked,
                        props: []
                    };
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
                                value: prop.value
                            };
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
    }
    return JSON.stringify(result);
}
function scanComp() {
    var activeItem = app.project.activeItem;
    var result = {
        layers: {
            raw: [],
            length: 0
        }
    };
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.layers.length > 0) {
            var child = {};
            result.layers.length = activeItem.layers.length;
            for (var i = 1; i <= activeItem.layers.length; i++) {
                var layer = activeItem.layers[i], blank = [];
                if (layer.property("sourceText") === null) {
                    child = {
                        name: layer.name,
                        DNA: 'app.project.activeItem.layers[' + layer.index + ']',
                        index: layer.index,
                        locked: layer.locked,
                        props: scanPropGroupProperties(layer, blank, layer.index)
                    };
                    result.layers.raw.push(child);
                }
            }
        }
    }
    return JSON.stringify(result);
}
// thanks redefinery
// http://www.redefinery.com/ae/fundamentals/properties/
function scanPropGroupProperties(propGroup, mirror, parent) {
    var i, prop;
    var group = {
        matchName: propGroup.matchName,
        name: propGroup.name,
        index: propGroup.propertyIndex,
        depth: propGroup.propertyDepth,
        layer: parent,
        children: [],
        value: propGroup.value
    };
    for (i = 1; i <= propGroup.numProperties; i++) {
        prop = propGroup.property(i);
        if ((prop.propertyType === PropertyType.PROPERTY)
            && (prop.propertyValueType !== PropertyValueType.NO_VALUE)) {
            var child = {
                name: prop.name,
                matchName: prop.matchName,
                index: prop.propertyIndex,
                depth: prop.propertyDepth,
                parent: prop.propertyGroup().name,
                layer: parent,
                value: prop.value,
                //
                children: []
            };
            if (prop.expressionEnabled)
                child['exp'] = prop.expression;
            else
                child['exp'] = false;
            if (prop.hasMax) {
                child['maxValue'] = prop.maxValue;
                child['minValue'] = prop.minValue;
            }
            if (prop.propertyValueType == PropertyValueType.COLOR) {
                child['color'] = rgbToHex(prop.value[0] * 255, prop.value[1] * 255, prop.value[2] * 255);
            }
            group.children.push(child);
        }
        else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP)) {
            // Found an indexed or named group, so check its nested properties
            scanPropGroupProperties(prop, mirror, parent);
        }
    }
    mirror.push(group);
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
// thanks redefinery
// http://www.redefinery.com/ae/fundamentals/properties/
function scanPropGroupPropertiesSamp(propGroup, mirror, layerid) {
    var i, prop;
    var group = {
        matchName: propGroup.matchName,
        name: propGroup.name,
        index: propGroup.propertyIndex,
        depth: propGroup.propertyDepth,
        layer: layerid,
        children: [],
        value: propGroup.value
    };
    for (i = 1; i <= propGroup.numProperties; i++) {
        prop = propGroup.property(i);
        if ((prop.propertyType === PropertyType.PROPERTY)
            && (prop.propertyValueType !== PropertyValueType.NO_VALUE)) {
            var child = {
                name: prop.name,
                matchName: prop.matchName,
                index: prop.propertyIndex,
                depth: prop.propertyDepth,
                parent: prop.propertyGroup().name,
                layer: layerid,
                value: prop.value,
                // Returns [1, 0, 0, 1]
                children: []
            };
            if (prop.expressionEnabled)
                child['exp'] = prop.expression;
            else
                child['exp'] = false;
            if (prop.hasMax) {
                child['maxValue'] = prop.maxValue;
                child['minValue'] = prop.minValue;
            }
            // if (/color$/i.test(prop.matchName))
            //   child['color'] = prop.valueAtTime(0, false);
            //  Returns [1, 0, 0, 1]
            // if (prop.propertyValueType == PropertyValueType.COLOR)
            //   child['color'] = rgbToHex(prop.value[0] * 255, prop.value[1] * 255, prop.value[2] * 255);
            //  Returns '#ff0000' instead of '#579F61'
            group.children.push(child);
        }
        else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP)) {
            scanPropGroupPropertiesSamp(prop, mirror, layerid);
        }
    }
    mirror.push(group);
    return mirror;
}
