> 수업 중 언급된 JSONP 추가 정리

### JSONP
- JSONP는 동일출처정책을 우회하기 위해 나온 기법이다.

### 동일출처정책(Same Origin Policy)
- 이름 그대로 동일한 출처(서버)가 아니면 요청을 차단하는 브라우저 단의 정책이다.
- 예를 들어서 'a.com' 서버와 'b.com' 서버가 있다고 가정한다.
- 동일출처정책 아래에서 'a.com' 서버로부터 다운받은 웹 페이지는 다른 서버인 'b.com'에 GET, POST같은 HTTP 요청을 할 수 없다.
- 단, `<img src=...>`, `<script src=...>`, `<link src=...>`등을 통해 요청되는 이미지, 스크립트의 웹 리소스들은 허용된다.
- 동일출처정책을 우회하는 방법에는 CORS와 JSONP가 있다.

### CORS
- CORS(Cross Origin Resource Sharing) 기법을 사용하기 위해서는 서버 측에서 HTTP Response의 헤더를 수정하면 된다.
- CORS 기법의 가장 큰 제약사항은 IE 7이하에서는 지원하지 않는다.
- 또 IE 8,9에서는 도메인이 다른 서버가 프로토콜까지 일치해야 하는 제한(http에서 https로 요청 불가)이 있다.

### JSONP
- JSONP는 위에서 언급한 것처럼 다른 출처라도 리소스 요청은 허용되는 점을 이용한 기법이다.
- 또한 JSONP에서는 하위 IE에서도 잘 동작하고, 서버 측 코드의 수정도 필요하지만 CORS에 비해서 제약사항도 적다.

### JSONP 요청

- 다음은 'a.com' 웹 페이지에서 'b.com' 서버에 있는 상품 목록을 JSONP 요청으로 받아오는 코드.

```
var script = document.createElement('script');
script.src = 'http://b.com/getProducts?callback=onSuccess';
var head = document.getElementsByTagName('head')[0];
head.appendChild(script);

function onSuccess(data) {
    // data 인자 처리
}
```

- 먼저 `script.src='http://b.com/getProducts?callback=onSuccess` 코드를 보면, 상품목록을 요청하는 URL 뒤에 파라메터로 `callback=onSuccess`를 넘겨준다.
- `onSuccess`는 a.com의 자바스크립트에서 정의된 **함수 이름**이다.
- 만들어진 `<script>` 태그를 `<head>` 태그에 추가하면, 브라우저는 `src`가 가르키는 서버에 리소스를 받아온다.
- 'b.com' 서버는 JSONP 응답으로 다음의 자바스크립트 코드를 구성해서 내려준다.
```
onSuccess([{id:1, name:'donuts'}, {id:2, name:'coffee'}]);
```
- 자바스크립트 코드는 'a.com'의 웹 페이지에서 실행되면서 `onSuccess`함수에 'b.com'에서 넘어온 상품 목록을 넘겨줄 수 있다.