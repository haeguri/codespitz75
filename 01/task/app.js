//
// [ 과제 #1 ]
// Q. 실제 코드를 구현하고 실행하면 예외가 발생한다. 예외 지점을 찾고 수정하여 완성하라.
// 
// [ 과제 #2 ]
// Q. 지금까지 전개한 객체협력모델에서는 여전히 문제가 남아있다. Info는 Data와 Renderer 사이에 교환을 위한 프로토콜인데,
// Renderer의 자식인 TableRenderer도 Info에 의존적인 상태다. 이를 개선하라.
// 
//
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
        if(!(data instanceof Data)) throw 'invalid param';            
        // [ 과제 #2 풀이 ]
        // - Info 클래스에 getFields 메서드 추가
        // - Renderer는 getFields 메서드를 이용하여 필드 목록을 받아오고, Info의 필드명과 값을 Renderer 인스턴스의 fields 객체에 등록
        // - TableRenderer는 _info를 직접 참조하지 않고, 인스턴스의 fields 객체를 통해 title, header, items 접근 가능.
        const _info = await data.getData();
        this.fields = {};
        _info.getFields().forEach((v, i) => {
            this.fields[v] = _info[v];
        })
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
            caption.innerHTML = this.fields.title; // _info -> fields
            table.appendChild(caption);  
            table.appendChild(
                this.fields.header.reduce( // _info -> fields
                   (thead, data)=>(thead.appendChild(document.createElement('th')).innerHTML = data, thead),
                   document.createElement("thead"))
            );
            parent.appendChild(
                this.fields.items.reduce( // _info -> fields
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
            // [ 과제 #1 풀이 ]
            // - items 필드 검증 코드의 바깥에 try/catch 추가
            // - 로우 데이터가 더 많다면 pop 메서드로 여분의 로우 데이터를 제거
            // - 로우 데이터가 더 적다면 push 메서드로 빈 문자열 ''을 로우 데이터에 추가
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
    getFields(){return ['title', 'header', 'items'];} // Info 인스턴스의 필드명 배열 반환
    get title(){return this._private.title;}
    get header(){return this._private.header;}
    get items(){return this._private.items;}
};

const jsonData = new JsonData('data.json');
const tableRenderer = new TableRenderer('#data')
tableRenderer.render(jsonData);