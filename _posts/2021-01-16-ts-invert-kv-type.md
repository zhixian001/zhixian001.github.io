---
layout: article
title: |
  [Typescript] Readonly object 의 key-value 를 뒤집은 타입 만들기
excerpt: "Readonly object 의 key-value 를 뒤집은 타입 만들기"
tags: [tip, typescript, utility-types]
key: 210116lerna-typeorm
type: article
lang: ko
---

## TODO

아래와 같은 ReadOnly Object 의 Key 와 Value 를 뒤집은 타입 만들기.

### 기존 Readonly Object
  ```typescript
  const originalObject = {
    key1: 'value1',
    key2: 'value2'
  } as const;
  ```

### 만들고자 하는 타입 (위 객체의 Key-Value 를 뒤집은 객체)
  ```typescript
  {
    value1: 'key1',
    value2: 'key2'
  };
  ```

## How TO

[Utility Type](https://www.typescriptlang.org/docs/handbook/utility-types.html) 를 활용해 아래와 같이 `InvertKeyValue` 타입을 만들어 준다.

  ```typescript
  type _AllValues<T extends Record<string, string>> = {
    [P in keyof T]: { key: P & string, value: T[P] }
  }[keyof T];

  type InvertKeyValue<T extends Record<string, string>> = {
    [P in _AllValues<T>['value']]: Extract<_AllValues<T>, { value: P }>['key']
  };
  ```

`InvertKeyValue` 로 Key-Value 를 뒤집은 타입을 만들 수 있다.

```typescript
const invertedObject: InvertKeyValue<typeof originalObject> = {
  value1: 'key1',
  value2: 'key2'
};
```

위의 방법으로 타입을 생성할 경우 Intellisense 도 잘 작동한다.

![Intellisense 작동장면](https://jhycontents.s3.ap-northeast-2.amazonaws.com/blog/images/ts-object-invert-1.gif)


## 참고한 글

- [Is it possible to precisely type _.invert in TypeScript? (stackoverflow)](https://stackoverflow.com/questions/56415826/is-it-possible-to-precisely-type-invert-in-typescript)
