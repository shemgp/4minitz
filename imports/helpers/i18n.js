import { Meteor } from 'meteor/meteor';
import { i18n } from 'meteor/universe:i18n';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

// Only server can provide all available languages via server-side method
Meteor.methods({
    getAvailableLocales() {
        // [{code: "el", name: "Greek", nameNative: "Ελληνικά"}, ...]
        return i18n.getLanguages().map(code => ({
            code,
            name: i18n.getLanguageName(code),
            nameNative: i18n.getLanguageNativeName(code),
        }));
    }
});

// Two modes here:
// 1. No locale given
//      => determine preference, then set it
// 2. Given locale (e.g., 'en-US')
//      => store in user profile, then set it
export class I18nHelper {
    static setLanguageLocale(localeCode) {
        if (!localeCode) {
            localeCode = I18nHelper._getPreferredLocale();
        } else if (Meteor.userId()) {
            // TODO: Should not be possible for demo user
            console.log(Meteor.user() && Meteor.user().name);
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.locale': localeCode}});
        }
        i18n.setLocale(localeCode);
        T9n.setLanguage(localeCode);
    }

    static getLanguageLocale() {
        if (!Meteor.user() || !Meteor.user().profile || !Meteor.user().profile.locale) {
            return 'auto';
        }
        return i18n.getLocale();
    }

    static _getPreferredLocale () {
        return (
            Meteor.user() && Meteor.user().profile && Meteor.user().profile.locale ||
            navigator.languages && navigator.languages[0] ||
            navigator.language ||
            navigator.browserLanguage ||
            navigator.userLanguage ||
            'en-US'
        );
    }
}
