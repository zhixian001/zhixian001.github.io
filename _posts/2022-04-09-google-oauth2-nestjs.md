---
layout: article
title: |
  [NestJS] Google OAuth2 사용
excerpt: |
  NestJS 에서 Google OAuth2 를 활용한 사용자 인증 시스템 제작
tags: [typescript,nestjs,oauth2,study,passportjs,jwt]
key: 220409nestjs-google-oauth2
type: article
lang: ko
---

## 목표

- NestJS 에서 Google OAuth2 로 API Authentication 구현하기

## GCP OAuth 설정

1. 기존 프로젝트를 사용하거나 새 프로젝트를 하나 생성
2. `API 및 서비스` 로 가서 OAuth 동의 화면을 구성
    1. OAuth 동의 화면: 앱 정보를 적당히 넣고, 배포를 위해 도메인 주소를 넣는다.
    2. 범위: 적당히 민감하지 않는 범위로 설정해 준다. *추후 이 부분 Authorization 도 학습 필요!*
    3. 테스트 사용자: 본인 구글 이메일 주소를 넣는다.
3. `사용자 인증 정보` 로 가서 OAuth 2.0 클라이언트 ID 를 구성해 준다.
    1. 승인된 자바스크립트 원본과 승인된 리디렉선 URI 를 아래처럼 구성해 준다 (가린 부분은 배포 주소)

    ![nest-oauth-gcp-settings](https://jhycontents.s3.ap-northeast-2.amazonaws.com/blog/images/nestjs-oauth-gcp-settings.png)

4. 생성된 `클라이언트 ID` , `클라이언트 Secret` 을 확인 (추후 확인 가능하기 때문에 적어둘 필요 없음)

## 프로젝트 저장소 작업

1. nestjs app 생성
2. 구현에 필요한 패키지 설치

  ```json
  {
    "dependencies": {
      "@nestjs/config": "^2.0.0",
      "@nestjs/jwt": "^8.0.0",
      "@nestjs/passport": "^8.2.1",
      "cookie-parser": "^1.4.6",
      "passport": "^0.5.2",
      "passport-google-auth": "^1.0.2",
      "passport-google-oauth20": "^2.0.0",
      "passport-jwt": "^4.0.0",
    },
    "devDependencies": {
      "@types/cookie-parser": "^1.4.2",
      "@types/passport": "^1.0.7",
      "@types/passport-google-oauth20": "^2.0.11",
      "@types/passport-jwt": "^3.0.6",
    }
  }
  ```

3. `main.js` 에서 `cookie-parser` 를 사용하도록 구성
    1. JWT 토큰을 쿠키에 담아서 주고받도록 할 예정 (별도의 front 기능 구현 없이 브라우저에서 사용하기 위해)

    ```typescript
    import { NestFactory } from '@nestjs/core';
    import * as cookieParser from 'cookie-parser';
    import { AppModule } from './app.module';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.use(cookieParser());
      await app.listen(process.env.PORT || 3000);  // heroku 배포시 변경 필요
    }
    bootstrap();
    ```

4. nest generate 명령어로 모듈 / 가드 / strategy 를 다음과 같이 구성한다. (nest 명령어가 없는 경우 `npm i -g @nestjs/cli` 설치)

    ![nestjs-dir-tree](https://jhycontents.s3.ap-northeast-2.amazonaws.com/blog/images/nestjs-oauth-dir-tree.png)

5. 각 코드는 아래 [코드 저장소](https://github.com/zhixian001/nestjs-google-oauth2-blog-post) 를 참고해서 적당히 구현한다.
6. `.env` 파일을 만들고 위에서 생성한  `클라이언트 ID` , `클라이언트 Secret` 를 포함해 데이터들을 적당히 채워 준다.
    1. 이 프로젝트의 환경변수 구성은 아래와 같다.
    2. `@nestjs/config` 의 `ConfigService` 덕분에 process 환경변수와 dotenv 에서 불러올 수 있다.

    ```
    OAUTH_GOOGLE_ID=<클라이언트 ID>
    OAUTH_GOOGLE_SECRET=<클라이언트 Secret>
    OAUTH_GOOGLE_REDIRECT_URL=<GCP 에서 구성한 REDIRECTION URI 넣기>
    JWT_SECRET=<JWT Secret>
    EXPIRES_IN_SECONDS=3600
    ```

7. `yarn start`


## 구현에서 배운 것들

### OAuth2 인증 관련

- `GoogleOAuth Guard` 로 보호된 경로로 접속시 로그인이 되어 있지 않다면 흔히 보는 Google OAuth 로그인 / 계정 선택 창으로 이동한다.
    - 이때 접속한 페이지가 GCP 콘솔에 나열된 도메인이 아니라면 에러가 발생한다.
- Redirect 관련 설정 및 Controller 는 Google OAuth 성공시 `Google` → `내 서비스` 로 다시 돌려보내주는 경로다.
- Redirect 받는 부분에서는 `req.user` 를 구글로부터 받는다. 이 객체를 다루는 부분은 자유롭게 구현하면 된다.
- 여기에서는 해당 인증 User 정보로 JWT 인증을 사용하기로 한다.
- Redirect 받는 부분에서는 JWT 토큰을 생성하는 로직을 넣어주어야 한다.
- 서버 API 로 리다이렉트를 받는 경우 Cookie 에 넣어주거나, Response body 에 넣어 클라이언트에서 알아서 저장하도록 응답을 내려줄 수 있다. 다만 여기에서는 클라이언트 구현이 번거로우니 cookie 에 `jwt=` 로 넣어주기로 한다.
- 이후 `JwtAuth Guard` 를 걸어주어 JWT 로 API 를 인증하여 사용한다. (GoogleOAuth Guard 가 아님)

### NestJS Cookie 관련

- `cookie-parser`, `@types/cookie-parser` 설치 후 `main.ts` 에  `app.use` 로 미들웨어 설정을 해주어야지 쿠키를 받을 수 있다.

### PassportJS  관련

- strategy 에 이름을 붙여주었으면 guard 에서도 해당 이름으로 불러와야 한다.

    ```typescript
    // 아래에 'jwt' 로 이름을 붙이면
    export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    	// ...
    }
    ```

    위처럼 구현하였다면

    ```typescript
    // 아래에서 'jwt' 가드 사용
    @Injectable()
    export class JwtAuthGuard extends AuthGuard('jwt') {}
    ```


### PassportJS 의 passport-jwt strategy 관련

- Custom Extractor 사용법 확인함
- 아래처럼 Cookie 나 Authorization 헤더에서 JWT 를 찾아서 불러올 수 있다. (여러 소스에서 토큰 찾기 가능)

  ```typescript
  import type { Request } from 'express';

  @Injectable()
  export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    private readonly logger = new Logger(JwtAuthStrategy.name, true);

    constructor(configService: ConfigService) {

      // 이 부분에서 Custom Extractor
      const extractJwtFromCookie = (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['jwt'];
        }

        // Bearer extractor 는 클로저 함수 리턴하는것 주의
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      };
      // 인상적인 부분 끝

      super({
        jwtFromRequest: extractJwtFromCookie,
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET'),
      });
    }

    // validate 는 jwt가 유효한 경우 호출된다. 리턴값은 어디로 흘러가는지 확인해보기...
    async validate(payload: JwtPayload) {
      return { providerId: payload.sub, username: payload.username };
    }
  }
  ```


### NestJS 의 controller 에서 `@Res() res`

- **컨트롤러 메소드의 파라미터로 응답 객체를 불러오면 return 으로 응답을 내려줄 수 없다.**
- **res 를 수동으로 끝내줘야한다**
- 사용하지 않을 때는 안받아오는게 최선

## 결과물 확인

### 확인 순서

1. 배포 주소에 접속 (ex- `https://sample-deployment.herokuapp.com`)
2. `https://sample-deployment.herokuapp.com/users/secret` 로 이동하여 401 에러 확인 (안되는게 정상)
3. `https://sample-deployment.herokuapp.com/auth` 로 이동
    1. GCP OAuth 동의 화면 설정에 구성된 계정으로 로그인 (게시 전까지는 허용된 계정만 접속 가능)
4. `https://sample-deployment.herokuapp.com/users/secret` 로 이동하여 이전과는 다르게 200 응답을 내려주는것 확인

## 더 찾아볼것

- Refresh 로직은 어떻게 되는지?
- GCP OAuth 범위에 들어가는 Authorization 설정은 어떻게 해야 하는지?
- JWT 가 만료되었을때 다시 OAuth 에서 인증받아 JWT 를 다시 받아오려면 어떻게 해야 하는지?
    - 요청에 JWT 는 있는데 만료만 된 경우 `3xx` 리다이렉트? (응답 코드는 무엇으로?)
- `@Res() res` 의 구현 (데코레이터 구현을 어찌했길래...)
- passport js 의 strategy 에서 validate 함수의 리턴값이 어디로 흘러가는지?
