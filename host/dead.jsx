// // thanks redefinery
// // http://www.redefinery.com/ae/fundamentals/properties/
// function scanPropGroupPropertiesSamp(propGroup, mirror, layerid) {
//   var i, prop;
//   var group = {
//     matchName: propGroup.matchName,
//     name: propGroup.name,
//     index: propGroup.propertyIndex,
//     depth: propGroup.propertyDepth,
//     layer: layerid,
//     children: [],
//     value: propGroup.value,
//   }
//   for (i = 1; i <= propGroup.numProperties; i++) {
//     prop = propGroup.property(i);
//     if ((prop.propertyType === PropertyType.PROPERTY)
//       && (prop.propertyValueType !== PropertyValueType.NO_VALUE)) {
//       var child = {
//         name: prop.name,
//         matchName: prop.matchName,
//         index: prop.propertyIndex,
//         depth: prop.propertyDepth,
//         parent: prop.propertyGroup().name,
//         layer: layerid,
//         value: prop.value,
//           // Returns [1, 0, 0, 1]
//         children: [],
//       }
//       if (prop.expressionEnabled)
//         child['exp'] = prop.expression;
//       else
//         child['exp'] = false;
//       if (prop.hasMax) {
//         child['maxValue'] = prop.maxValue;
//         child['minValue'] = prop.minValue;
//       }
//       // if (/color$/i.test(prop.matchName))
//       //   child['color'] = prop.valueAtTime(0, false);
//               //  Returns [1, 0, 0, 1]
//
//       // if (prop.propertyValueType == PropertyValueType.COLOR)
//       //   child['color'] = rgbToHex(prop.value[0] * 255, prop.value[1] * 255, prop.value[2] * 255);
//               //  Returns '#ff0000' instead of '#579F61'
//
//       group.children.push(child)
//     } else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP)) {
//       scanPropGroupPropertiesSamp(prop, mirror, layerid);
//     }
//   }
//   mirror.push(group)
//   return mirror;
// }
