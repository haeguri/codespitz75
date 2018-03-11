//
// [ 과제 #1 ]
// - 실제 코드를 구현하고 실행하면 예외가 발생한다. 예외 지점을 찾고 수정하여 완성하라.
//
// [ 예외 지점 ]
// - Info 생성자에서 'items' 필드를 검증할 때 헤더의 길이와 로우의 데이터 길이가 일치하지 않아 예외 발생
// 
// [ 수정 방법 ]
// - 'items' 필드 검증 코드 밖에 try/catch문 추가
// - 로우 데이터가 더 많다면 pop 메서드로 여분의 로우 데이터 제거
// - 로우 데이터가 더 적다면 push 메서드로 빈 문자열 추가
//
const Data = class{
    async getData(){
        const json = await this._getData();
        let info;
        try{ 
            info = new Info(json); 
        }
        catch(eMsg){ 
            console.log(eMsg); 
        }
        return info;
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
        if(!(data instanceof Data)) throw 'invalid param';            
        this._info = await data.getData();
        this._render();
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
                 this._info.header.reduce(
                    (thead, data)=>(thead.appendChild(document.createElement('th')).innerHTML = data, thead),
                    document.createElement("thead"))
             );
             parent.appendChild(
                 this._info.items.reduce(
                    (table, row)=>(table.appendChild(
                        row.reduce(
                            (tr, data)=>(tr.appendChild(document.createElement('td')).innerHTML = data, tr),
                            document.createElement('tr'))
                    ), table), 
                    table)
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
            // try/catch 추가
            try{
                if(!Array.isArray(v) || v.length !== header.length) {
                    throw 'invalid items:' + idx;
                }
            }catch(eMsg){
                console.log(eMsg);
                if(v.length > header.length){
                    while(v.length !== header.length) v.pop();
                } 
                else if(v.length < header.length){
                    while(v.length !== header.length) v.push('');
                }
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