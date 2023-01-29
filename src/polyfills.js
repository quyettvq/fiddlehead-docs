import getGlobalThis from 'globalthis';
import 'mdn-polyfills/Array.prototype.includes';
import 'mdn-polyfills/String.prototype.startsWith';
import 'mdn-polyfills/Object.entries';
import 'mdn-polyfills/Object.assign';

window.globalThis = getGlobalThis();

if (Promise.prototype.finally === undefined) {
    Promise.prototype.finally = function (callback) {
        if (typeof callback !== 'function') {
            return this.then(callback, callback);
        }
        const P = this.constructor || Promise;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            error => P.resolve(callback()).then(() => {
                throw error;
            })
        );
    };
}
