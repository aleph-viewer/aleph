import { m as readTask, w as writeTask } from './core-684c60cc.js';
var startStatusTap = function () {
    var win = window;
    win.addEventListener('statusTap', function () {
        readTask(function () {
            var width = win.innerWidth;
            var height = win.innerHeight;
            var el = document.elementFromPoint(width / 2, height / 2);
            if (!el) {
                return;
            }
            var contentEl = el.closest('ion-content');
            if (contentEl) {
                contentEl.componentOnReady().then(function () {
                    writeTask(function () { return contentEl.scrollToTop(300); });
                });
            }
        });
    });
};
export { startStatusTap };
