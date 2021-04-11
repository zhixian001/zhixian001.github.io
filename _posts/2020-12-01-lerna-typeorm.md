---
layout: article
title: Lerna 환경에서 typeorm 이 ormconfig 를 찾지 못하는 문제 해결법
excerpt: "Lerna (Mono Repo) 환경에서 typeorm 사용시 ormconfig 을 찾도록 프로젝트 구성하기"
tags: [troubleshooting, lerna, monorepo, typeorm, typescript]
key: 201201lerna-typeorm
type: article
lang: ko
---

## 문제 원인

- lerna mono repo 를 사용하여 디렉터리 구조가 아래와 같을 때 typeorm 에서 `ormconfig.js` 를 특정하지 못하는 문제

    ```
    /
    	packages/
    		my-package-a/
    			tsconfig.json
    			package.json
    			ormconfig.js
    			src/
    			...
    		my-package-b/
    			tsconfig.json
    			package.json
    			ormconfig.js
    			src/
    			...
    		...
    	tsconfig.json
    	package.json
    	...
    ```

- typeorm 은 npm 스크립트를 실행한 루트 디렉터리에서 ormconfig 를 찾는다.

## 해결

- 루트 패키지에  `ormconfig.js` 파일을 추가하고 아래 코드를 넣어 준다.

    ```jsx
    module.exports = require(process.env.INIT_CWD + "/ormconfig");
    ```

### 해결된 이유

1. typeorm 에서 `createConnection` 호출 시 ormconfig 를 최상위 npm package.json 이 존재하는 루트에서 찾는다.
    1. [createConnections 구현](https://github.com/typeorm/typeorm/blob/56300d810e3e6c200a933261c2b78f442751b842/src/index.ts#L240)에서 ConnectionOptionsReader 호출
    2. [ConnectionOptionsReader 구현](https://github.com/typeorm/typeorm/blob/56300d810e3e6c200a933261c2b78f442751b842/src/connection/ConnectionOptionsReader.ts#L12) → 이곳에서 ormconfig 를 찾는다.
    3. `load` → [로딩 부분](https://github.com/typeorm/typeorm/blob/56300d810e3e6c200a933261c2b78f442751b842/src/connection/ConnectionOptionsReader.ts#L81)에서 파일 형식에 따라 다르게 읽어온다.
    4. `js, cjs, ts` 형식인 경우 `require` 로 읽어온다!! → 최상위 ormconfig.js 파일은 반드시 데이터를 담고 있지 않아도 된다. 모듈을 가져와서 다시 내보내는 동작만 수행해도 된다.

    ```jsx
    } else if (foundFileFormat === "js" || foundFileFormat === "cjs" || foundFileFormat === "ts") {
                const configModule = await require(configFile);

                if (configModule && "__esModule" in configModule && "default" in configModule) {
                    connectionOptions = configModule.default;
                } else {
                    connectionOptions = configModule;
                }
    ```

2. 실행하려는 하위 패키지의 디렉터리는 `process.env.INIT_CWD` 로도 접근이 가능하다. 따라서,루트의 ormconfig 를 위처럼 추가한다면 어떤 하위 패키지를 실행하는지와 관계없이 항상 실행하려는 해당 하위 패키지의 디렉터리에 있는 ormconfig 와 동적으로 연결된다.
