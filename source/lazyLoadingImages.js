(function(global) {
	global = global || window;

	var utils = {
		addEvent: function(element, eventName, callback) {
			if(element.addEventListener) {
				element.addEventListener(eventName, callback, false);
			} else if(element.attachEvent) {
				element.attachEvent('on' + eventName, callback);
			}
		}
	};

	var lazyLoadingImages = {
		"node": {},
		"images": [],
		"scroll": {
			"type": [],
			"on": false,
			"timer": null,
			"event": false
		},
		"addImage": function(node, url, id) {
			var type = node.getAttribute("data-type");
			var obj = {
				"id": id,
				"node": node,
				"url": url,
				"type": type || false,
				"image": null,
				"isLoad": false,
				"callback": null,
				"offset": node.offsetTop
			};
			this.images.push(obj);
		},
		"showImage": function(index) {
			var obj = this.images[index];
			obj.isLoad = true;
			obj.node.src = obj.image.src;
		},
		"load": function(type) {
			this.loadAndShow(type, false);
		},
		"addCallback": function(obj, i) {
			var parent = this;
			var callback = (function(index) {
				parent.showImage(index);
			})(i);
			obj.callback = true;
			utils.addEvent(obj.image, "load", callback);
		},
		"loadAndShow": function(type, makeVisible, isScroll) {
			type = type || false;
			isScroll = isScroll || false;
			var self = this,
				obj = null;
			for (var i = 0, l = self.images.length; i < l; i++) {
				obj = self.images[i];
				if(obj.type != type) continue;
				if(isScroll && obj.offset > self.getRealScroll()) continue;
				if(obj.image) {
					if(makeVisible) {
						if(obj.isLoad) {
							obj.node.src = obj.image.src;
						} else if(!obj.callback) {
							self.addCallback(obj, i);
						}
					}
				} else {
					obj.image = new Image();
					obj.image.src = obj.url;
					if(makeVisible) {
						self.addCallback(obj, i);
					}
				}
			}
		},
		"show": function(type) {
			this.loadAndShow(type, true);
		},
		"update": function() {
			var parent = this,
				listRealId = [];
			for (var i = 0, l = document.images.length; i < l; i++) {
				var node = document.images[i];
				var url = node.getAttribute("data-url"),
					lazyId = node.getAttribute("data-lazyId");
				if(!lazyId && url && url != "") {
					var id = Math.ceil(Math.random() * 10000);
					node.setAttribute("lazyId", id);
					parent.addImage(node, url, id);
				}
				if(lazyId || id) listRealId.push(lazyId || id);
			}
			parent.removeUnrealObj(listRealId);
		},
		"removeUnrealObj": function(listRealId) {
			var parent = this,
				arrayRealObject = [];
			for (var i = 0, l = parent.images.length; i < l; i++) {
				var obj = parent.images[i];
				if(parent.isRealObject(obj, listRealId)) arrayRealObject.push(obj);
			}
			parent.images = arrayRealObject;
		},
		"isRealObject": function(obj, listRealId) {
			for (var i = 0, l = listRealId.length; i < l; i++) {
				if(obj.id == listRealId[i]) return true;
			}
			return false;
		},
		"getIndexInArray": function(arrayElements, value) {
			for (var i = 0, l = arrayElements.length; i < l; i++) if(arrayElements[i] == value) return i;
			return false;
		},
		"onScroll": function(type) {
			type = type || false;
			var self = this;
			var types = self.scroll.type;
			var index = self.getIndexInArray(types, type || false);
			if(!index && index !== 0) types.push(type);
			self.inspectScroll();
			if(!self.scroll.event) {
				self.scroll.event = true;
				utils.addEvent(document, "scroll", function() {
					self.inspectScroll();
				});
			}
		},
		"offScroll": function(type) {
			type = type || false;
			var self = this;
			var types = self.scroll.type;
			var index = self.getIndexInArray(types, type || false);
			if(index || index === 0) types.splice(index, 1);
		},
		"getRealScroll": function() {
			var scrollTop = window.pageYOffset ? window.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop),
				windowHeight = document.documentElement.clientHeight * 1.5;
			return (scrollTop + windowHeight);
		},
		"inspectScroll": function() {
			var self = this;
			var arrayElements = self.scroll.type,
				callback = function() {
					for (var i = 0, l = arrayElements.length; i < l; i++) self.loadAndShow(arrayElements[i], true, true);
				};
			clearInterval(self.scroll.timer);
			self.scroll.timer = setTimeout(callback, 100);
		}
	};

	global.lazyLoadingImages = {
		"update": function() {
			lazyLoadingImages.update.call(lazyLoadingImages);
			return global.lazyLoadingImages;
		},
		"show": function(type) {
			lazyLoadingImages.show.call(lazyLoadingImages, type);
			return global.lazyLoadingImages;
		},
		"load": function(type) {
			lazyLoadingImages.load.call(lazyLoadingImages, type);
			return global.lazyLoadingImages;
		},
		"onScroll": function(type) {
			lazyLoadingImages.onScroll.call(lazyLoadingImages, type);
			return global.lazyLoadingImages;
		},
		"offScroll": function(type) {
			lazyLoadingImages.offScroll.call(lazyLoadingImages, type);
			return global.lazyLoadingImages;
		}
	};

	utils.addEvent(document, "DOMContentLoaded", function() {
		global.lazyLoadingImages.update();
	}, false);
})(this);
