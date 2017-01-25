//notes.component.js
angular
    .module('dap.viz')
    .component("dapVizNotes", {
        controller: NotesController,
        bindings: {
            visualId: '<',
            primaryColor: '<',
            accentColor: '<'
        },
        templateUrl: 'app/visualizations/notes.html'
    });

NotesController.$inject = ['notesApi', 'utilService', '$rootRouter', '$mdDialog', 'authService', 'vizConstants', '$scope', '$mdColors'];

function NotesController(notesApi, utilService, $rootRouter, $mdDialog, authService, vizConstants, $scope, $mdColors) {
    var
        ctrl = this;

    ctrl.$onInit = $onInit;
    ctrl.$onChanges = bind;
    ctrl.filter = filter;
    ctrl.add = add;
    ctrl.edit = edit;
    ctrl.remove = remove;
    ctrl.canEdit = canEdit;
    ctrl.getExportUrl = getExportUrl;
    ctrl.defaultAccentColor = $mdColors.getThemeColor('default-accent-A200-1');

    //events
    $scope.$on('DAP.VIZ.NOTES.REFRESH', function (event, args) {
        bind(true);
    });


    ////////////
    function $onInit() {
        isAdmin = authService.isInAnyRole([authService.roles.visuals_admin]);
        user = authService.getUser().Id;

        bind();
    }

    function bind(cacheRefresh) {
        if (ctrl.visualId) {
            ctrl.notes = null;
            notesApi.get(ctrl.visualId, cacheRefresh).then(function (response) {
                ctrl.notes = response.data.data || [];
            }, function (error) {
                ctrl.notes = [];
            });
        }
    }

    function filter(item) {
        return utilService.filter(item, ['message', 'authorDisplayName'], ctrl.search);
    }

    function add(message) {
        if (message) {
            notesApi.add({
                visualId: ctrl.visualId,
                message: message
            }).then(function () {
                utilService.showSuccessToast('Your note was successfully added!');
                ctrl.note = '';
            }, function () {
                utilService.showErrorToast('An error occured tyring to add your note. Please try again or contact support.');
            });
        }
    }

    function edit(item, e) {
        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: 'app/visualizations/add-note.html',
            targetEvent: e,
            controller: AddNoteController,
            controllerAs: 'ctrl',
            bindToController: true,
            fullscreen: true,
            locals: {
                note: item
            }
        });
    }

    function remove(item, e) {
        $mdDialog.show(utilService.deleteConfirmDialog('Delete Note', 'Are you sure you want to delete this note?', e)).then(function () {
            notesApi.remove(item.id).then(function () {
                utilService.showSuccessToast('Your note was successfully deleted!');
            }, function () {
                utilService.showErrorToast('An error occured tyring to deleted your note. Please try again or contact support.');
            });
        });
    }

    function canEdit(item) {
        return (isAdmin || item.author === user);
    }

    function getExportUrl() {
        return notesApi.getExportUrl(ctrl.visualId);
    }
};


// Add Note Controller
AddNoteController.$inject = ['$mdDialog', 'notesApi', 'utilService'];

function AddNoteController($mdDialog, notesApi, utilService) {
    var ctrl = this;

    ctrl.close = function () {
        $mdDialog.hide();
    }

    ctrl.submit = function (note) {
        notesApi.update(note).then(function () {
            utilService.showSuccessToast('Your note was successfully updated!');
            $mdDialog.hide();
        }, function () {
            utilService.showErrorToast('An error occured tyring to update your note. Please try again or contact support.');
        });
    }
}