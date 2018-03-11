const Table = (_=>{
    const Private = Symbol();
    return class{
        constructor(parent){
            if(typeof parent !== 'string' || !parent) throw 'invalid param';
            this[Private] = {parent};
        }
        async load(url){
            const response = await fetch(url);
            const json = await response.json();
            // Data validation - start.
            const {title, header, items} = json;
            if(!items.length) throw 'no items';
            Object.assign(this[Private], {title, header, items});
            this._render();
        }
        _render(){
            const {title, header, items} = this[Private];
            if(typeof title !== 'string' || !title) throw 'invalid title';
            if(!header.length) throw 'no header';

            const table = document.createElement('table');

            const caption = table.appendChild(document.createElement('caption'));
            caption.innerHTML = title;

            const thead = table.appendChild(document.createElement('thead'));
            const theadTr = thead.appendChild(document.createElement('tr'));
            header.reduce((tr, h) => {
                const td = document.createElement('td');
                td.innerHTML = h;
                tr.appendChild(td);
                return tr;
            }, theadTr);

            const tbody = table.appendChild(document.createElement('tbody'));
            items.reduce((tbody, item) => {
                const tr = tbody.appendChild(document.createElement('tr'));
                item.reduce((tr, v) => {
                    const td = document.createElement('td');
                    td.innerHTML = v;
                    tr.appendChild(td);
                    return tr;
                }, tr);
                return tbody;
            }, tbody);

            document.querySelector('#data').appendChild(table);
        }
    }
})();

const table = new Table('#data');
table.load('data.json');