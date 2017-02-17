angular.module('easyRash.directives', [])

	.directive('slideable', function () {
		return {
			restrict:'C',
			compile: function (element, attr) {
				// wrap tag
				var contents = element.html();
				element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

				return function postLink(scope, element, attrs) {
					// default properties
					attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
					attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
					element.css({
						'overflow': 'hidden',
						'height': '0px',
						'transitionProperty': 'height',
						'transitionDuration': attrs.duration,
						'transitionTimingFunction': attrs.easing
					});
				};
			}
		};
	})

	.directive('slideToggle', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var target, content;

				attrs.expanded = false;

				element.bind('click', function() {
					if (!target) target = document.querySelector(attrs.slideToggle);
					if (!content) content = target.querySelector('.slideable_content');

					var y = content.clientHeight;
					if(!attrs.expanded) {
						content.style.border = '1px solid rgba(0,0,0,0)';
						content.style.border = 0;
						target.style.height = y + 'px';
					} else {
						target.style.height = '0px';
					}
					attrs.expanded = !attrs.expanded;
				});
			}
		};
	})

	.directive('innerSlideToggle', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var target, content;

				attrs.expanded = false;

				element.bind('click', function() {
					if (!target) target = document.querySelector(attrs.innerSlideToggle);
					if (!content) content = target.querySelector('.slideable_content');

					var altezza_lista_conferenze = $('#lista-conferenze').height();
					var y = content.clientHeight;
					if(!attrs.expanded) {
						$('#lista-conferenze').height(y+altezza_lista_conferenze);
						content.style.border = '1px solid rgba(0,0,0,0)';
						content.style.border = 0;
						target.style.height = y + 'px';
					} else {
						$('#lista-conferenze').height(altezza_lista_conferenze-y);
						target.style.height = '0px';
					}
					attrs.expanded = !attrs.expanded;
				});
			}
		};
	});
