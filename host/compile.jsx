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
function startColorBuddy(val, nam) {
    var activeItem = app.project.activeItem, complete = false;
    var values = val.split(',');
    var names = nam.split(',');
    // alert(values)
    // alert(names)
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.layers.length > 0) {
            for (var i = 1; i <= activeItem.layers.length; i++) {
                var layer = activeItem.layers[i];
                rigColorBuddy(layer, values, names);
            }
        }
    }
}
function rigColorBuddy(propGroup, colorList, nameList) {
    var i, prop;
    for (i = 1; i <= propGroup.numProperties; i++) {
        prop = propGroup.property(i);
        if ((prop.propertyType === PropertyType.PROPERTY)
            // && (prop.propertyValueType == PropertyValueType.COLOR)
            && (/(ADBE\sVector\s(Fill|Stroke)\sColor)/i.test(prop.matchName))) {
            var temp = rgbToHex(prop.value[0] * 255, prop.value[1] * 255, prop.value[2] * 255);
            var match = -1;
            for (var c = 0; c < colorList.length; c++) {
                if (temp == colorList[c])
                    match = c;
            }
            if (match > -1) {
                var nameMatch = nameList[match];
                prop.expression = 'thisComp.layer(\"colorbuddy\").effect(\"' + nameMatch + '\")(\"Color\")';
            }
        }
        else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP)) {
            // recurse into nested props
            rigColorBuddy(prop, colorList, nameList);
        }
    }
    return true;
}
scrubAllColorExpressions();
function scrubAllColorExpressions() {
    var activeItem = app.project.activeItem, complete = false;
    // var values = val.split(','), names = nam.split(',');
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.layers.length > 0) {
            for (var i = 1; i <= activeItem.layers.length; i++) {
                var layer = activeItem.layers[i];
                scrubColorBuddy(layer);
            }
        }
    }
}
function scrubColorBuddy(propGroup) {
    var i, prop;
    for (i = 1; i <= propGroup.numProperties; i++) {
        prop = propGroup.property(i);
        if ((prop.propertyType === PropertyType.PROPERTY)
            // && (prop.propertyValueType == PropertyValueType.COLOR)
            && (/(ADBE\sVector\s(Fill|Stroke)\sColor)/i.test(prop.matchName))) {
            prop.expression = '';
        }
        else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP)) {
            // recurse into nested props
            scrubColorBuddy(prop);
        }
    }
    return true;
}
function createNewControl(type, val, nam) {
    var controller, activeItem = app.project.activeItem, complete = false;
    var values = val.split(',');
    var names = nam.split(',');
    if (type == 'color') {
        var shape = activeItem.layers.addNull();
        shape.name = "colorbuddy";
        shape.effectsActive = true;
        var eGroup = shape.property("ADBE Effect Parade");
        for (var i = 0; i < values.length; i++) {
            var control = eGroup.addProperty("ADBE Color Control");
            control.name = names[i];
            // alert(arrs[i]);
            var col = hexToRgb(values[i]);
            var rgb = [col.r, col.g, col.b, 255] / 255;
            // alert(rgb)
            control.property("Color").setValue(rgb);
        }
        complete = true;
    }
    return complete;
}
function scanComp() {
    var activeItem = app.project.activeItem;
    var result = {
        name: activeItem.name,
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
    // var ancestor = propGroup.parentProperty;
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
            // var par = prop.propertyGroup();
            var child = {
                name: prop.name,
                matchName: prop.matchName,
                index: prop.propertyIndex,
                depth: prop.propertyDepth,
                parent: prop.propertyGroup().name,
                layer: parent,
                value: prop.value,
                // ancestor: par.propertyGroup().name,
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
            // if (prop.depth > 3)
            // child['ancestor'] = ancestor;
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
