/**
 * FTColumnflow BaselineGrid test suite
 *
 * @copyright The Financial Times Limited [All Rights Reserved]
*/

var target, viewport;

buster.testCase('BaselineOffset', {
	setUp : function(done) {
		this.timeout = 1000;
		document.body.innerHTML = '<div id="viewportid"><div id="targetid"></div></div>';
		target   = document.getElementById('targetid');
		viewport = document.getElementById('viewportid');
		addStylesheets(['all.css', 'baselineoffset.css'], done);
	},

	tearDown : function() {
		removeStyleSheets();
		document.body.className = '';
	},

	"ShouldThrowExceptionOnInvalidBaselineOffset" : function() {

		assert.exception(function test() {
			new FTColumnflow('targetid', 'viewportid', {
				'baselineOffset' : 'invalid'
			});
		}, 'FTColumnflowBaselineOffsetException');

		refute.exception(function test() {
			new FTColumnflow('targetid', 'viewportid', {
				'baselineOffset' : 20
			});
		});
	},

	'ShouldShiftColumnsDownByLineheightMinusBaselineOffset' : function() {

		var cf = createCf({
			baselineOffset: 8
		}).flow('<p>Test paragraph</p>\n<p>Test paragraph</p>\n<p>Test paragraph</p>');

		var column = target.querySelector('.cf-column-1');

		// Column should be shifted down by (lineHeight - baselineOffset) === (20px - 12px)
		assert.match(column.offsetTop, 8);
	},

	'ShouldSetCorrectDimensionsAndPositionOnSecondColumn' : function() {

		var cf = createCf({
			baselineOffset: 8
		}).flow(_exactHeightWrapPara);

		var column1 = target.querySelector('.cf-column-1');
		var column2 = target.querySelector('.cf-column-2');

		assert.match(column1.clientHeight, 600);
		assert.match(column2.offsetTop, 8);

		assert.match(column1.clientHeight, 600);
		assert.match(column2.offsetTop, 8);
	},

	'ShouldSetNegativeTopMarginOnRemainderOfOverflowedElement' : function() {

		var cf = createCf({
			baselineOffset: 8
		}).flow(_overflowedElementPara);

		var column2 = target.querySelector('.cf-column-2');
		var element = column2.childNodes[0];
		assert.match(element.offsetTop, -50);
	},

	'ShouldWrapAroundFixedElementAtBottomLeft' : function() {

		var cf = createCf({
			baselineOffset: 8
		}).flow('<p class="height600">height600</p><p class="height600">height600</p><p class="height600">height600</p>', '<div class="fixed anchor-bottom-left">fixedContent</div>');

		var page    = target.querySelector('.cf-page-1');

		var column1 = page.querySelector('.cf-column-1');
		var column2 = page.querySelector('.cf-column-2');
		var column3 = page.querySelector('.cf-column-3');

		assert.match(column1.offsetTop, 8);
		assert.match(column1.offsetHeight, 360);

		assert.match(column2.offsetTop, 8);
		assert.match(column2.childNodes[0].offsetTop, -360);

		assert.match(column3.offsetTop, 8);
		assert.match(column3.childNodes[0].offsetTop, -360);
	},

	'ShouldWrapAroundFixedElementAtTopLeft' : function() {

		var cf = createCf({
			baselineOffset: 8
		}).flow('<p class="height600">height600</p><p class="height600">height600</p><p class="height600">height600</p>', '<div class="fixed anchor-top-left">fixedContent</div>');

		var page    = target.querySelector('.cf-page-1');

		var column1 = page.querySelector('.cf-column-1');
		var column2 = page.querySelector('.cf-column-2');
		var column3 = page.querySelector('.cf-column-3');

		assert.match(column1.offsetTop, 228);
		assert.match(column1.offsetHeight, 380);

		assert.match(column2.offsetTop, 8);
		assert.match(column2.childNodes[0].offsetTop, -380);

		assert.match(column3.offsetTop, 8);
		assert.match(column3.childNodes[0].offsetTop, -380);
	},

	'ShouldCorrectlyAdjustToMinFixedPadding' : function() {

		// 205px, minimum gap 20px, next element starts at 220px but shifted down to 228px
		// => 23px gap
		var cf = createCf({
			baselineOffset: 8
		}).flow('<p>flowedContent</p>', '<div class="fixed fixed205">fixedContent</div>');

		var page   = target.querySelector('.cf-page-1');
		var column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 228);
		assert.match(column.offsetHeight, 380);

		// 205px, minimum gap 10px, next element starts at 228px => 23px gap
		var cf = createCf({
			baselineOffset: 8,
			minFixedPadding : 0.5
		}).flow('<p>flowedContent</p>', '<div class="fixed fixed205">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 228);
		assert.match(column.offsetHeight, 380);

		// 200px, minimum gap 30px, next element starts at 248px => 48px gap
		var cf = createCf({
			baselineOffset: 8,
			minFixedPadding : 1.5
		}).flow('<p>flowedContent</p>', '<div class="fixed">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 248);
		assert.match(column.offsetHeight, 360);

		// 200px, minimum gap 20px, element can't end at 380px as it's shifted down to
		// 388px, so reduced to 368px => 32px gap
		var cf = createCf({
			baselineOffset: 8
		}).flow('<p>flowedContent</p>', '<div class="fixed anchor-bottom-left">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 8);
		assert.match(column.offsetHeight, 360);

		// 200px, minimum gap 30px, element ends at 360px, shifted down to 368px => 32px gap
		var cf = createCf({
			baselineOffset: 8,
			minFixedPadding : 1.5
		}).flow('<p>flowedContent</p>', '<div class="fixed anchor-bottom-left">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 8);
		assert.match(column.offsetHeight, 360);

		// 205px, minimum gap 10px, element ends at 380px, shifted down to 385px => 15px gap
		var cf = createCf({
			baselineOffset: 5,
			minFixedPadding : 0.5
		}).flow('<p>flowedContent</p>', '<div class="fixed fixed205 anchor-bottom-left">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 5);
		assert.match(column.offsetHeight, 380);
	},

	'RegressionShouldPlaceSecondFixedElementUnderneathFirstWithTheCorrectGap' : function() {

		var cf = createCf({
			baselineOffset:  20
		}).flow('<div class="height600">height600</div>', '<div class="fixed col-span-2">fixedContent</div><div class="fixed col-span-1">fixedContent</div>');

		var page    = target.querySelector('.cf-page-1');
		var fixed1  = page.querySelector('.col-span-2');
		var fixed2  = page.querySelector('.col-span-1');
		var column1 = page.querySelector('.cf-column-1');
		var column2 = page.querySelector('.cf-column-2');
		var column3 = page.querySelector('.cf-column-3');

		assert.match(fixed1.offsetTop, 0);
		assert.match(fixed2.offsetTop, 220);

		assert.match(column1.offsetTop, 440);
		assert.match(column1.offsetHeight, 180);

		assert.match(column2.offsetTop, 220);
		assert.match(column2.offsetHeight, 400);

		assert.match(cssProp(column2.childNodes[0], 'margin-top'), '-180px');
		assert.match(cssProp(column3.childNodes[0], 'margin-top'), '-580px');
	},

	'RegressionShouldPlaceSecondFixedElementUnderneathFirstWithTheCorrectGapWithUnevenOffset' : function() {

		var cf = createCf({
			baselineOffset:  10
		}).flow('<p class="height600">height600</p>', '<div class="fixed col-span-2">fixedContent</div><div class="fixed col-span-1">fixedContent</div>');

		var page    = target.querySelector('.cf-page-1');
		var fixed1  = page.querySelector('.col-span-2');
		var fixed2  = page.querySelector('.col-span-1');
		var column1 = page.querySelector('.cf-column-1');
		var column2 = page.querySelector('.cf-column-2');
		var column3 = page.querySelector('.cf-column-3');

		assert.match(fixed1.offsetTop, 0);
		assert.match(fixed2.offsetTop, 220);

		assert.match(column1.offsetTop, 450);
		assert.match(column1.offsetHeight, 160);

		assert.match(column2.offsetTop, 230);
		assert.match(column2.offsetHeight, 380);

		assert.match(cssProp(column2.childNodes[0], 'margin-top'), '-160px');
		assert.match(cssProp(column3.childNodes[0], 'margin-top'), '-540px');
	},

//*/

});