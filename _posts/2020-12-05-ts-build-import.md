---
layout: article
title: |
  [Typescript] Symlink 로 빌드 디렉터리의 구조 변경 없이 소스 디렉터리 밖의 모듈 가져오기
excerpt: "Symbolic Link 기능으로 빌드 디렉터리의 구조를 해치지 않고 소스 디렉터리 외부의 모듈 (ts, js, json 등등) 을 가져오기."
tags: [tip, typescript, build]
key: 201205ts-build-import
type: article
lang: ko
---

## 문제 상황

```
/
	tsconfig.json
	package.json
	data/
		myData.json
	src/
		index.ts
	...
```

- 위와 같은 프로젝트 구조에서 index.ts 코드가 아래와 같을 경우 빌드 디렉터리의 구조가 이상하게 바뀐다.

    ```tsx
    import myData from '../myData.json';

    console.log(JSON.stringify(myData));
    ```

    ```
    /
    	dist/
    		index.js
    		data/
    			myData.json
    		src/
    			index.js
    ```

- 기대하는 빌드 디렉터리 구조는 아래와 같다.

    ```
    /
    	dist/
    		index.js
    ```

- 위처럼 소스 디렉터리 밖의 코드, json 파일을 import 하면 빌드 디렉터리의 구조가 기대와 다르게 나온다. → npm package 를 빌드하는 경우라면 패키지가 제대로 동작하지 않을 수 있다.
- `myData.json` 파일을 `data` 와 `src` 디렉터리 내부 두 곳에 위치시키는 방법은 데이터의 일관성을 유지하기가 어렵다.
- `fs` 모듈로 읽어와서 처리할 수도 있지만 코드 intellisense 가 안되는 아쉬움이 있다.

## 해결 방법

- [symbolic link 기능](https://ko.wikipedia.org/wiki/%EC%8B%AC%EB%B3%BC%EB%A6%AD_%EB%A7%81%ED%81%AC)을 활용하여 소스 디렉터리 내부에서 외부 모듈을 가져오도록 한다.

  ```bash
  mkdir -p src/res
  ln -s ../../data/myData.json src/res/myData.json
  ```

- 이처럼 소스 디렉터리 (`src/`) 외부의 파일을 소스 디렉터리 내부의 symlink 로 연결하면 빌드 디렉터리의 구조가 변하지 않는다.
