const Main = imports.ui.main;
const Lang = imports.lang;
const Meta = imports.gi.Meta;

const extension = imports.misc.extensionUtils.getCurrentExtension();
const convenience = extension.imports.convenience;

let settings;

function init() {
    settings = convenience.getSettings();
}

function enable() {
    _add_keybinding('focus-left',  _focus_left);
    _add_keybinding('focus-right', _focus_right);
    _add_keybinding('focus-up',    _focus_up);
    _add_keybinding('focus-down',  _focus_down);
}

function disable() {
    global.display.remove_keybinding('focus-left');
    global.display.remove_keybinding('focus-right');
    global.display.remove_keybinding('focus-up');
    global.display.remove_keybinding('focus-down');
}

function _add_keybinding(key, binding) {
    global.log("Adding keybinding for " + key);
    global.display.add_keybinding(key, settings, Meta.KeyBindingFlags.NONE, binding);
}

function _get_horizontal_windows(focused) {
    let ws = focused.get_workspace();
    let f_rect = focused.get_outer_rect();
    let f_y1 = f_rect.y;
    let f_y2 = f_rect.y + f_rect.height;

    let sorted = ws.list_windows().filter(function (w) { 
        return w.get_window_type() == Meta.WindowType.NORMAL;
    }).filter(function (w) {
        let w_rect = w.get_outer_rect();
        let w_y1 = w_rect.y;
        let w_y2 = w_rect.y + w_rect.height;
        return (f_y1 > w_y1 && f_y1 < w_y2) ||
               (f_y2 > w_y1 && f_y2 < w_y2) ||
               (f_y1 <= w_y1 && f_y2 >= w_y2);
    }).sort(function(a,b) {
        return a.get_outer_rect().x - b.get_outer_rect().x;
    });

    return sorted;
}

function _get_vertical_windows(focused) {
    let ws = focused.get_workspace();
    let f_rect = focused.get_outer_rect();
    let f_x1 = f_rect.x;
    let f_x2 = f_rect.x + f_rect.width;

    let sorted = ws.list_windows().filter(function (w) { 
        return w.get_window_type() == Meta.WindowType.NORMAL;
    }).filter(function (w) {
        let w_rect = w.get_outer_rect();
        let w_x1 = w_rect.x;
        let w_x2 = w_rect.x + w_rect.width;
        return (f_x1 > w_x1 && f_x1 < w_x2) ||
               (f_x2 > w_x1 && f_x2 < w_x2) ||
               (f_x1 <= w_x1 && f_x2 >= w_x2);
    }).sort(function(a,b) {
        return a.get_outer_rect().y - b.get_outer_rect().y;
    });

    return sorted;
}

function _focus_left() {
    let focused = global.display.get_focus_window();
    if (focused == null) {
        return;
    }

    let sorted = _get_horizontal_windows(focused);

    let closest = focused;
    for (let i=0; i < sorted.length; i++) {
        if (sorted[i] == focused && i-1 >= 0) {
            closest = sorted[i-1];
        }
    }

    if (closest != focused) {
        Main.activateWindow(closest);
    }
}

function _focus_right() {
    let focused = global.display.get_focus_window();
    if (focused == null) {
        return;
    }

    let sorted = _get_horizontal_windows(focused);

    let closest = focused;
    for (let i=0; i < sorted.length; i++) {
        if (sorted[i] == focused && i+1 < sorted.length) {
            closest = sorted[i+1];
        }
    }

    if (closest != focused) {
        Main.activateWindow(closest);
    }
}

function _focus_up() {
    let focused = global.display.get_focus_window();
    if (focused == null) {
        return;
    }

    let sorted = _get_vertical_windows(focused);

    let closest = focused;
    for (let i=0; i < sorted.length; i++) {
        if (sorted[i] == focused && i-1 >= 0) {
            closest = sorted[i-1];
        }
    }

    if (closest != focused) {
        Main.activateWindow(closest);
    }
}

function _focus_down() {
    let focused = global.display.get_focus_window();
    if (focused == null) {
        return;
    }

    let sorted = _get_vertical_windows(focused);

    let closest = focused;
    for (let i=0; i < sorted.length; i++) {
        if (sorted[i] == focused && i+1 < sorted.length) {
            closest = sorted[i+1];
        }
    }

    if (closest != focused) {
        Main.activateWindow(closest);
    }
}

