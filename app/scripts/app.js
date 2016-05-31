(function() {
    function config($stateProvider, $locationProvider) {
       $locationProvider
            .html5mode({
                enabled: true,
                requireBase: false
       });
        
        $stateProvider
            .state('landing', {
                .url: '/',
                templateUrl: '/templates/landing.html'
        })
            .state('album', {
                .url: '/album',
                templateUrl: '/templates/album.html'
        });
    }
    
angular
    .module('blocJams', ['ui.router']);
    .config(config);
})();