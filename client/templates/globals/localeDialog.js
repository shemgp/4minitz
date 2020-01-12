import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { I18nHelper } from '/imports/helpers/i18n';
import {ReactiveVar} from 'meteor/reactive-var';

let supportedLocales = new ReactiveVar([]);

Template.localeDialog.onCreated(function () {
    Meteor.call('getAvailableLocales',
        function(error, result){
            if(error){
                console.log('Error: No supported language locales reported by server.');
            }else{
                supportedLocales.set(result);
            }
        }
    );
});


Template.localeDialog.helpers({
    'supportedLocales': function () {
        return supportedLocales.get();
    }
});


Template.localeDialog.events({
    'submit #frmDlgSetLocale'(evt, tmpl) {
        evt.preventDefault();

        const newLoc = tmpl.find('#selLocale').value;
        console.log('Switch to language locale: >'+newLoc+'<');
        I18nHelper.setLanguageLocale(newLoc);
        tmpl.$('#dlgLocale').modal('hide');
    },

    'show.bs.modal #dlgLocale': function (evt, tmpl) {
        // preselect the current locale, if user is logged in
        const loc = I18nHelper.getLanguageLocale();
        tmpl.find('#loc-'+loc).selected = true;
    },
});