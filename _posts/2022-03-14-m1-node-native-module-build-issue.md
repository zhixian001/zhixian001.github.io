---
layout: article
title: |
  M1 arm 환경에서 nodejs native module 빌드 문제 해결 (error: unsupported load command)
excerpt: "nodejs native module 설치 시 /opt/homebrew/opt/llvm/bin/objcopy: error: unsupported load command (cmd=0x80000034) 에러와 함께 빌드 실패하는 문제 해결 방법 정리"
tags: [troubleshooting, macos, m1, homebrew, build, nodejs, llvm]
key: 220314m1-node-native-module-build-issue
type: article
lang: ko
---

## 문제 상황

- [`aws-crt`](https://github.com/awslabs/aws-crt-nodejs) 같은 native nodejs module 설치 시 `nodejs native module 설치 시 /opt/homebrew/opt/llvm/bin/objcopy: error: unsupported load command (cmd=0x80000034)` 에러 발생
  - `yarn add aws-crt` 실행 결과
  - ![error log](https://jhycontents.s3.ap-northeast-2.amazonaws.com/blog/images/m1-node-native-module-build-issue.png)

### 환경

- m1 용 homebrew 사용
  ```bash
  $ brew --prefix
  /opt/homebrew
  ```
- m1 용 llvm 설치됨
  ```bash
  $ which clang
  /opt/homebrew/opt/llvm/bin/clang

  $ file /opt/homebrew/opt/llvm/bin/clang
  /opt/homebrew/opt/llvm/bin/clang: Mach-O 64-bit executable arm64
  ```
- arm64 용 nodejs v16.14.0 사용
  ```bash
  $ which node
  /Users/homejh/.nvm_arm/versions/node/v16.14.0/bin/node
  $ file /Users/homejh/.nvm_arm/versions/node/v16.14.0/bin/node
  /Users/homejh/.nvm_arm/versions/node/v16.14.0/bin/node: Mach-O 64-bit executable arm64
  ```

## 해결 방법

- 문제 원인이 되는 **objcopy** 를 없앤다
  ```bash
  $ mv "$(brew --prefix)/opt/llvm/bin/objcopy" "$(brew --prefix)/opt/llvm/bin/objcopy.backup"
  ```

### 해결 과정

- 빌드시 `node_modules/aws-crt/build/` 아래에 cmake 를 활용해 빌드 파일이 생성됨 -> 실패
- `$ cd node_modules/aws-crt/build/ && grep "objcopy" -ir .` 로 objcopy 명령어 찾기
- `node_modules/aws-crt/build/CMakeFiles/aws-crt-nodejs.dir/build.make` 파일에서 objcopy 명령어를 사용하는 부분이 두 군데 등장
  - objcopy 를 사용하는 빌드 명령어에 사용 불가능한 옵션(`--add-gnu-debuglink`)이 있는 것을 확인 (mac 용 objcopy 에는 없는 것으로 보임)
- `node_modules` 디렉터리를 지운 후 x86 nodejs 로 다시 해당 모듈 설치 시 별 문제 없이 빌드되는것을 확인
- x86 용 brew 로 설치한 llvm 의 bin 디렉터리(`"$(brew --prefix)/opt/llvm/bin/"`)엔 objcopy 가 없는 것 확인
  - <u>arm brew 로 설치한 llvm 과 x86으로 설치한 llvm 의 bin 디렉터리 구성이 다르다!</u>
- cmake 로 빌드 파일 생성시 <u>objcopy 명령어가 시스템에 존재하는지 여부에 상관 없이 빌드가 가능</u>하도록 구현되어 있을 것으로 추정
- objcopy 명령어의 이름을 바꾸고 native module 설치(빌드) 시도해보니 성공!
