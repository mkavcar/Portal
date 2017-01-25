//menu.service.js
angular
    .module('dap.core')
    .factory('menuApi', menuApi);

menuApi.$inject = ['constants', 'metadataApi', 'authService'];

function menuApi(constants, metadataApi, authService) {
    var menuApi = {
        get: get,
        update: update
    };

    return menuApi;

    ////////////
    function get(id, cacheRefresh) {
        var isAdmin = authService.isInRole(authService.roles.app_admin);

        return metadataApi.get(id, cacheRefresh).then(function (response) {
            var data = _.sortBy(response.data.data || [], ['order']),
                menu = [];

            if (isAdmin)
                return data;
            else {
                //if user is not app admin filter out all top and submenus that are admin only
                _.forEach(data, function (item) {
                    if (_.indexOf(item.roles, authService.roles.app_admin) == -1) {
                        menu.push(item);

                        //authorize top menu
                        item.hasAccess = !item.roles || item.roles.length == 0 || authService.isInAnyRole(item.roles);

                        if (item.submenu) {
                            item.submenu = _.chain(item.submenu).filter(function (subitem) {
                                return (_.indexOf(subitem.roles, authService.roles.app_admin) == -1);
                            }).sortBy(['order']).value();

                            //authorize sub menu
                            _.forEach(item.submenu, function (submenu) {
                                submenu.hasAccess = !submenu.roles || submenu.roles.length == 0 || authService.isInAnyRole(submenu.roles);
                            });
                        }
                    }
                });

                return menu;
            }
        });
    }

    function update(id, value) {
        return metadataApi.update(id, value);
    }
};
