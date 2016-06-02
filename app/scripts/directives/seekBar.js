(function() {
    function seekBar($document) {
        /**
        @function calculatePercent
        @desc returns the offset position of an event within the seekbar
        @param {object} seekbar {event} passed in as $event from the view
        */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        }
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {
                
                /**
                @attribute scope.value
                @desc holds the value of the seekbar, initialized at 0
                */
                scope.value = 0;
                
                /**
                @attribute scope.max
                @desc defines the maximum value of the seekbar as 100
                */
                scope.max = 100;
                
                /**
                @object
                @desc defines the seekbar as a jQuery element
                */
                var seekBar = $(element);
                
                /**
                @attribute $observe
                @desc notifies the seekBar directive of all changes to attribute values
                @params {object} value
                */
                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });
                
                /**
                @method attributes.$observe
                @desc notifies the seekBar directive of all changes to attribute max values
                @params {object} value
                */
                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });
                
                /**
                @function percentString
                @desc converts scope.value and scope.max into percentages returned as a string
                */
                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };
                
                /**
                @function fillStyle
                @desc returns percentString as the width of the fill within the seekBar
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };
                
                /**
                @function thumbStyle
                @desc returns percentString as the position of the thumb on the seekBar
                */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };
                
                /**
                @function onClickSeekBar
                @desc registers a click on the seekbar and returns the value as a percentage of the seekBar
                @params {object} value
                */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    /*passes the position of the click to the onChange function */
                    notifyOnChange(scope.value);
                };
                
                /**
                @function trackThumb
                @desc registers the user clicking and dragging the position of the thumb to a new position on the seekBar
                */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            /*passes the new position of scope.value to the onChange function */
                            notifyOnChange(scope.value);
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
                
                /**
                @function notifyOnChange
                @desc notifies onChange that scope.value has changed
                @param {function}
                */
                var notifyOnChange = function(oldValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({time: oldValue});
                    }
                }; 
            }
        };
    }
    
    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();