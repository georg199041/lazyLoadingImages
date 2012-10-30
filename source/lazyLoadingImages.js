(function(global) {
	global = ((global) ? global : window);

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
		"addImage": function(node, url, id) {
			var type = node.getAttribute("data-type");
			var obj = {
				"id": id,
				"node": node,
				"url": url,
				"type": type || false,
				"image": false,
				"isLoad": false,
				"callback": false
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
		"loadAndShow": function(type, makeVisible) {
			type = type || false;
			var parent = this;
			var arrayImages = this.images;
			for (var i = 0, l = arrayImages.length; i < l; i++) {
				var obj = arrayImages[i];
				if(obj.type != type) continue;
				if(obj.image) {
					if(makeVisible) {
						if(obj.isLoad) {
							obj.node.src = obj.image.src;
						} else if(!obj.callback) {
							parent.addCallback(obj, i);
						}
					}
				} else {
					obj.image = new Image();
					obj.image.src = obj.url;
					if(makeVisible) {
						parent.addCallback(obj, i);
					}
				}
			}
		},
		"show": function(type) {
			this.loadAndShow(type, true);
		},
		"update": function() {
			var parent = this;
			var listRealId = [];
			for (var i = 0, l = document.images.length; i < l; i++) {
				var node = document.images[i];
				var url = node.getAttribute("data-url");
				var lazyId = node.getAttribute("data-lazyId");
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
			var parent = this;
			var arrayRealObject = [];
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
		}
	};

	utils.addEvent(document, "DOMContentLoaded", function() {
		global.lazyLoadingImages.update();
	}, false);
})(this);