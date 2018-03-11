const Data = class{
    async getData(){
        const json = await this._getData();
        return new Info(json);
    }
    async _getData(){
        throw '_getData must overrided';
    }
}

const JsonData = class extends Data{
    constructor(data){
        super();
        this._data = data;
    }
    async _getData(){
        if(typeof this._data === 'string') {
            const response = await fetch(this._data);
            return await response.json();
        } else return this._data;
    }
}

const Renderer = class{
    async render(data) {
        try {
            if(!(data instanceof Data)) throw 'invalid param';            
            this._info = await data.getData();
            this._render();
        } catch(msg) {
            console.log(msg);
        }
    }
    async _render(){ 
        throw '_render must overrided'; 
    }
}

const TableRenderer = (_=>{
    const Private = Symbol();
    return class extends Renderer{
        constructor(parent){
            super();
            if(typeof parent !== 'string' || !parent) throw 'invalid param';
                this[Private] = {parent};
        }
        async _render() {
             const parent = document.querySelector(this[Private].parent);
             if(!parent) throw 'invalid parent';
             parent.innerHTML = "";
             const table = document.createElement('table');
             const caption = document.createElement('caption');
             caption.innerHTML = this._info.title;
             table.appendChild(caption);
             table.appendChild(
                 this._info.header.reduce((thead, data) => (
                    thead.appendChild(document.createElement('th')).innerHTML = data, thead),
                    document.createElement("thead"))
             );
             parent.appendChild(
                 this._info.items.reduce((table, row) => (
                    table.appendChild(
                        row.reduce((tr, data) => (tr.appendChild(document.createElement('td').innerHTML = data) ,tr), 
                            document.createElement('tr'))
                    ), table
                ), table)
             );
    
        }
    }
})();

const Info = class{
    constructor(json){
        const {title, header, items} = json;
        if(typeof title !== 'string' || !title) throw 'invalid title';
        if(!Array.isArray(header) || !header.length) throw 'invalid header';
        if(!Array.isArray(items) || !header.length) throw 'invalid items';
        items.forEach((v, idx)=>{
            if(!Array.isArray(v) || v.length !== header.length) {
                throw new Error('invalid items:' + idx);
            }
        });
        this._private = {title, header, items};
    }
    get title(){return this._private.title;}
    get header(){return this._private.header;}
    get items(){return this._private.items;}
};

const jsonData = new JsonData('data.json');
const tableRenderer = new TableRenderer('#data')
tableRenderer.render(jsonData);