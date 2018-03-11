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
            )

            // // mycode... 
            // const {title, header, items} = this[Private];
            // if(typeof title !== 'string' || !title) throw 'invalid title';
            // if(!header.length) throw 'no header';

            // const table = document.createElement('table');

            // const caption = table.appendChild(document.createElement('caption'));
            // caption.innerHTML = title;

            // const thead = table.appendChild(document.createElement('thead'));
            // const theadTr = thead.appendChild(document.createElement('tr'));
            // header.reduce((tr, h) => {
            //     const td = document.createElement('td');
            //     td.innerHTML = h;
            //     tr.appendChild(td);
            //     return tr;
            // }, theadTr);

            // const tbody = table.appendChild(document.createElement('tbody'));
            // items.reduce((tbody, item) => {
            //     const tr = tbody.appendChild(document.createElement('tr'));
            //     item.reduce((tr, v) => {
            //         const td = document.createElement('td');
            //         td.innerHTML = v;
            //         tr.appendChild(td);
            //         return tr;
            //     }, tr);
            //     return tbody;
            // }, tbody);

            // document.querySelector('#data').appendChild(table);
        }
    }
})();

const table = new Table('#data');
table.load('data.json');