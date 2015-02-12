function addStylesheets(urls, callback) {

	var head = document.getElementsByTagName( "head" )[0],
		pending = [],
		timer;

	function _loaded() {
		document.body.removeChild(this);
		if (0 === --pendingCount) callback();
	}

	urls.forEach(function add(url) {
		var link = document.createElement('link'),
			div  = document.createElement('div');

		link.setAttribute('href', url);
		link.setAttribute('rel', 'stylesheet');
		head.appendChild(link);

		div.id = url.replace(/(.*?)\.css/, 'stylesheetload-$1');
		document.body.appendChild(div);
		pending.push(div);
	});

	timer = setInterval(function() {
		pending = pending.filter(function(div, index) {
			var style = getComputedStyle(div);
			if ('-1000' === style.zIndex) {
				return false;
			}
			return true;
		});

		if (0 === pending.length) {
			clearInterval(timer);
			callback();
		}
	}, 50);
}


function removeStyleSheets() {
	var links = document.getElementsByTagName('link');
	for (var i = links.length - 1; i >= 0; i--) {
		if (links[i] && 'stylesheet' === links[i].getAttribute('rel')) {
			links[i].parentNode.removeChild(links[i]);
		} else {
			console.log(links[i]);
		}
	}
}