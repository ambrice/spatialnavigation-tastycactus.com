const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const extension = imports.misc.extensionUtils.getCurrentExtension();
const convenience = extension.imports.convenience;

let settings;

const SpatialNavigationSettingsWidget = new GObject.Class({
    Name: 'SpatialNavigation.Prefs.SpatialNavigationSettingsWidget',
    GTypeName: 'SpatialNavigationSettingsWidget',
    Extends: Gtk.Grid,

    _init : function(params) {
        this.parent(params);
        this.orientation = Gtk.Orientation.VERTICAL;
        this.expand = true;

        this.attach(this._createKeyboardConfig(), 0, 0, 1, 9);
    },

    _createKeyboardConfig: function() {
        let model = new Gtk.ListStore();

        model.set_column_types([
            GObject.TYPE_STRING,
            GObject.TYPE_STRING,
            GObject.TYPE_INT,
            GObject.TYPE_INT
        ]);

        let bindings = {
            "focus-left": "Switch to window on the left",
            "focus-right": "Switch to window on the right",
            "focus-up": "Switch to the window above",
            "focus-down": "Switch to the window below",
        };

        for (name in bindings) {
            let [key, mods] = Gtk.accelerator_parse(settings.get_strv(name)[0]);
            let row = model.insert(1);
            model.set(row, [0, 1, 2, 3], [name, bindings[name], mods, key ]);
        }

        let treeview = new Gtk.TreeView({
            'expand': true,
            'model': model
        });

        let cellrend = new Gtk.CellRendererText();
        let col = new Gtk.TreeViewColumn({ 'title': 'Keyboard Shortcut', 'expand': true });
        col.pack_start(cellrend, true);
        col.add_attribute(cellrend, 'text', 1);
        treeview.append_column(col);

        cellrend = new Gtk.CellRendererAccel({
            'editable': true,
            'accel-mode': Gtk.CellRendererAccelMode.GTK
        });

        cellrend.connect('accel-edited', function(rend, iter, key, mods) {
            let value = Gtk.accelerator_name(key, mods);
            let [succ, iterator] = model.get_iter_from_string(iter);

            if (!succ) {
                throw new Error("Error updating Keybinding");
            }

            let name = model.get_value(iterator, 0);

            model.set(iterator, [2, 3], [mods, key]);
            settings.set_strv(name, [value]);
        });

        col = new Gtk.TreeViewColumn({'title': 'Modify'});

        col.pack_end(cellrend, false);
        col.add_attribute(cellrend, 'accel-mods', 2);
        col.add_attribute(cellrend, 'accel-key', 3);
        treeview.append_column(col);

        return treeview;
    }

});

function init() {
    settings = convenience.getSettings();
}

function buildPrefsWidget() {
    let widget = new SpatialNavigationSettingsWidget();
    widget.show_all();
    return widget;
}
