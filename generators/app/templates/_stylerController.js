/*
This file is also optional, but contains the controller for the
design options on a new widget type. This acts as a bridge between
*/

mod.controller('stylerController', ['$scope',
    function($scope) {
        /**
         * variables
         */

        /**
         * watches
         */
        $scope.$watch('widget', function (val) {
            $scope.model = $$get($scope, 'widget.style');
        });

        /**
         * public methods
         */

        $scope.example = function (isRunning) {
        	$scope.model.isRunning = isRunning;
        	_.defer(function() {
        		$scope.$root.widget.redraw();
        	});
        };
    }
]);
