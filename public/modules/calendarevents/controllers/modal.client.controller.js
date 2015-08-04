'use strict';

angular.module('calendarevents').controller('ModalController', ['$scope',
    function($scope) {
        // Modal controller logic
        // ...
    }
]);



/*
example for modal dialog
remove later when integrated to existing code
*/

angular.module('calendarevents').controller('ModalDemoCtrl', function($scope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function(size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('calendarevents').controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', '$stateParams', '$location', 'Authentication', 'Calendarevents',
  function($scope, $modalInstance, items,$stateParams, $location, Authentication, Calendarevents) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    function readDatetimeFromForm(dateForm,timeForm) {
        var datetime = null;
        if (dateForm){
            datetime = new Date(dateForm);
            if (timeForm){
                var time = timeForm.split(':');
                datetime.setHours(time[0]);
                datetime.setMinutes(time[1]);
            }
        }
        return datetime;
    }



    $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.create = function() {
        // Create new Calendarevent object
        var dateFrom= readDatetimeFromForm(this.startDate, this.startTime);
        var dateTo= readDatetimeFromForm(this.endDate, this.endTime);

        var calendarevent = new Calendarevents({
            name: this.name,
            description: this.description,
            startDate: dateFrom,
            endDate: dateTo,
            address: this.address
        });

        // Redirect after save
        calendarevent.$save(function(response) {
            $location.path('calendarevents/' + response._id);

            // Clear form fields
            $scope.name = '';
            $scope.description = '';
            $scope.address = '';
            $modalInstance.close();
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

}]);
