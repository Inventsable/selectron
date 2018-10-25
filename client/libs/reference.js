var csInterface = new CSInterface();

function extFolder(){
  var str = csInterface.getSystemPath(SystemPath.EXTENSION);
  var parent = str.substring(str.lastIndexOf('/') + 1, str.length);
  return parent;
}

function loadJSX(fileName) {
    var root = csInterface.getSystemPath(SystemPath.EXTENSION) + "/host/";
    csInterface.evalScript('$.evalFile("' + root + fileName + '")');
}

function loadUniversalJSXLibraries() {
    var libs = ["json2.jsx", "Console.jsx"];
    var root = csInterface.getSystemPath(SystemPath.EXTENSION) + "/host/universal/";
    for (var i = 0; i < libs.length; i++)
      csInterface.evalScript('$.evalFile("' + root + libs[i] + '")');
}

/// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
