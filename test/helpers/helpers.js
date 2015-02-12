function createCf(config) {

	var defaultConfig = {
		columnGap:      25,
		columnCount:    3
	};

	for (var i in config || {}) {
		if (config.hasOwnProperty(i)) {
			defaultConfig[i] = config[i];
		}
	}

	return new FTColumnflow('targetid', 'viewportid', defaultConfig);
}

function cssProp(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

var assert = buster.assert;
var refute = buster.refute;
var expect = buster.expect;

var _exactHeightWrap       = '<div class="height500">height500</div><div class="height100">height100</div><div class="height100">height100</div>';
var _wrapToPage2           = '<div class="height600">height600</div><div class="height600">height600</div><div class="height600">height600</div><div class="height100">height100</div>';
var _overflowedElement     = '<div class="height500">height500</div><div class="height50">height50</div><div class="height100">height100</div>';
var _exactHeightWrapPara   = '<p class="height500">height500</p><p class="height100">height100</p><p class="height100">height100</p>';
var _wrapToPage2Para       = '<p class="height600">height600</p><p class="height600">height600</p><p class="height600">height600</p><p class="height100">height100</p>';
var _overflowedElementPara = '<p class="height500">height500</p><p class="height50">height50</p><p class="height100">height100</p>';
