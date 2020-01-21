'use strict';

const index$1 = require('./index-8b27a14a.js');

// Given a menu, return whether or not the menu toggle should be visible
const updateVisibility = async (menu) => {
    const menuEl = await index$1.menuController.get(menu);
    return !!(menuEl && await menuEl.isActive());
};

exports.updateVisibility = updateVisibility;
