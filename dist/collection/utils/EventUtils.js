export class EventUtils {
    // the A-Frame debounce util doesn't work with ionic
    static debounce(fn, debounceDuration) {
        // summary:
        //      Returns a debounced function that will make sure the given
        //      function is not triggered too much.
        // fn: Function
        //      Function to debounce.
        // debounceDuration: Number
        //      OPTIONAL. The amount of time in milliseconds for which we
        //      will debounce the function. (defaults to 100ms)
        debounceDuration = debounceDuration || 100;
        return function () {
            if (!fn.debouncing) {
                // tslint:disable-next-line: no-any
                const args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(this, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(() => {
                fn.debouncing = false;
            }, debounceDuration);
            return fn.lastReturnVal;
        };
    }
}
