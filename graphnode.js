class GraphNode {

    static id_count = 0;

    static defaultID() {
        this.id_count += 1;
        return `N${this.id_count}`;
    }

    static resetID() {
        this.id_count = 0;
    }

    _id = GraphNode.defaultID();
    nodeElement = document.createElement('div');
    links = [];
    data = undefined;

    constructor(data) {
        this.data = data;
    }

    get id() {
        return this._id;
    }

    get element() {
        return this.nodeElement;
    }

    get links() {
        return this.links;
    }

    set element(element) {
        this.nodeElement = element;
    }

    addLink(link) {
        this.links.push(link);
    }

    removeLink(position) {
        this.links.splice(position, 1);
    }

    get data() {
        return this.data;
    }
}