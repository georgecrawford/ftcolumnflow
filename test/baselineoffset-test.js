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
		assert.match(column1.offsetHeight, 380);

		assert.match(column2.offsetTop, 8);
		assert.match(column2.childNodes[0].offsetTop, -380);

		assert.match(column3.offsetTop, 8);
		assert.match(column3.childNodes[0].offsetTop, -380);
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

	'ShouldRespectAFloatValueForMinFixedPadding' : function() {

		// 205px, minimum gap 20px, next element starts at 220px but shifted down to 228px
		// so gap is acceptable at 23px
		var cf = createCf({
			baselineOffset: 8
		}).flow('<p>flowedContent</p>', '<div class="fixed fixed205">fixedContent</div>');

		var page   = target.querySelector('.cf-page-1');
		var column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 228);
		assert.match(column.offsetHeight, 380);

		// 205px, minimum gap 10px, next element starts at 228px
		var cf = createCf({
			baselineOffset: 8,
			minFixedPadding : 0.5
		}).flow('<p>flowedContent</p>', '<div class="fixed fixed205">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 228);
		assert.match(column.offsetHeight, 380);

		// 200px, minimum gap 30px, next element starts at 248px
		var cf = createCf({
			baselineOffset: 8,
			minFixedPadding : 1.5
		}).flow('<p>flowedContent</p>', '<div class="fixed">fixedContent</div>');

		page   = target.querySelector('.cf-page-1');
		column = page.querySelector('.cf-column');

		assert.match(column.offsetTop, 248);
		assert.match(column.offsetHeight, 360);
	},

//*/

});