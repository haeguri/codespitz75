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
            // 부모, 데이터 체크
            const fields = this[Private], parent = document.querySelector(fields.parent);
            if(!parent) throw 'invalid parent';
            if(!fields.items || !fields.items.length) { // ㅣ
                parent.innerHTML = 'no data';
                return;
            } else parent.innerHTML = "";
            //table 생성
            //캡션을 title로
            const table = document.createElement('table');
            const caption = document.createElement('caption');
            caption.innerHTML = fields.title;
            table.appendChild(caption);
            // header를 thead로
            table.appendChild(
                fields.header.reduce((thead, data) => {
                    const th = document.createElement('th');
                    th.innerHTML = data;
                    thead.appendChild(th);
                    return thead;
                }, document.createElement("thead"))
            );
            // items를 tr로
            // 부모에 table 삽입
            parent.appendChild(
                fields.items.reduce((table, row, i) => {
                    table.appendChild(
                        row.reduce((tr, data) => {
                            const td = document.createElement('td');
                            td.innerHTML = data;
                            tr.appendChild(td);
                            return tr;
                        }, document.createElement('tr'))
                    );
                    return table;
                }, table)
            );
        }
    }
})();

const table = new Table('#data');
table.load('data.json');