'use strict';

angular.module('swMobile.restServices', ['ngResource'])
    .factory('Clip', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/employees/:employeeId', {});
        }]);

//    .factory('Report', ['$resource',
//        function ($resource) {
//            return $resource('http://localhost:3000/employees/:employeeId/reports', {});
//        }]);

