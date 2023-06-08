/**
 * Total Lite Menu
 * (c) 2009-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalLiteMenu {

    /**
     * Contructor
     * @param args.container
     */

    constructor(args) {

        // Container
        this.container = args.container;

        // Base
        this.menu = {'root': document.createElement('div')};
        this.menu['root'].classList.add('total-lite-menu');

        // Hide
        this.hidden = false;
        this.hide();

        // Append
        this.container.append(this.menu['root']);
    }

    /**
     * Add item entry
     * @param args.parent - parent id
     * @param args.id - id of this element
     * @param args.name - name of this element
     * @param args.onClick - callback
     * @param args.data - dataset to attach to
     */

    addItem(args) {
        if (args.parent in this.menu) {
            const item = document.createElement('div');
            item.classList.add('total-lite-menu-item');
            item.classList.add(args.id);
            if ('data' in args) {
                for (let [dataKey, dataArg] of Object.entries(args.data)) {
                    item.dataset[dataKey] = dataArg;
                }
            }
            item.innerHTML = args.name;
            item.addEventListener('mousedown', (event) => {
                if (!event.target.classList.contains('inactive'))
                {
                    event.stopPropagation();
                    this.hide();
                    if ('onClick' in args && args.onClick != null) args.onClick(event);
                }
            });
            this.menu[args.parent].append(item);
        }
    }

    /**
     * Separator horizontal line
     */

    addSeparator() {
        const sep = document.createElement('hr');
        this.menu['root'].append(sep);
    }

    /**
     * Show menu
     */

    show(x, y) {
        if (this.hidden) {
            this.menu['root'].style.display = 'block';
            this.menu['root'].style.left = (Math.min(x, window.innerWidth - this.menu['root'].offsetWidth) - 8) + 'px';
            this.menu['root'].style.top = (Math.min(y, window.innerHeight - this.menu['root'].offsetHeight) - 8) + 'px';
            this.hidden = false;
            this.container.addEventListener('click', this.unclick.bind(this));
        }
    }

    /**
     * Hide menu or submenu
     */

    hide(id = 'all') {
        if (!this.hidden) {
            for (const [key, element] of Object.entries(this.menu)) {

                // Hide all
                if (id == 'all') {
                    element.style.display = 'none';
                    this.hidden = true;
                    this.container.removeEventListener('click', this.unclick);
                }

                // Hide submenus only
                else if (id == 'submenus' && key != 'root') {
                    element.style.display = 'none';
                }

            };
        }
    }

    /**
     * Clicking outer menu hides
     */

    unclick(event) {
        for (const target of event.composedPath()) {
            if (target.nodeName == 'DIV' && target.hasClass('total-lite-menu')) return;
        }
        this.hide();
    }

    /**
     * Is menu shown or hidden
     */

    visible() {
        return !this.hidden;
    }

    /**
     * Enable entry
     */

    enable(id = 'all') {
        // Enable whole menu
        if (id == 'all') {
            for (const item of this.menu['root'].getElementsByClassName('total-lite-menu-item')) {
                item.classList.remove('inactive');
            }
        }

        // Enable selected item
        else {

            // Item
            const item = this.menu['root'].getElementsByClassName(id)[0];
            if (item) {
                item.classList.remove('inactive');
                // Submenu
                if (item.getElementsByClassName('total-lite-menu').length) {
                    for (const subitem of item.getElementsByClassName('total-lite-menu')[0].getElementsByClassName('total-lite-menu-item')) {
                        subitem.classList.remove('inactive');
                    }
                }
            }
        }
    }

    /**
     * Disable entry (grey)
     */

    disable(id = 'all') {
        // Disable whole menu
        if (id == 'all') {
            for (const item of this.menu['root'].getElementsByClassName('total-lite-menu-item')) {
                item.classList.add('inactive');
            }
        }

        // Disable selected item
        else {
            const item = this.menu['root'].getElementsByClassName(id)[0];
            if (item) {
                item.classList.add('inactive');
            }
        }
    }

    /**
     * Get position
     */

    position() {
        return {x: parseInt(this.menu['root'].style.left.replace('px', '')), y: parseInt(this.menu['root'].style.top.replace('px', ''))};
    }

    /**
     * Identify DOM element as part of menu
     */

    identify(target) {
        return ('classList' in target && (target.classList.contains('total-lite-menu') || target.classList.contains('total-lite-menu-item')));
    }

}
