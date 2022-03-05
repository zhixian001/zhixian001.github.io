---
layout: article
title: |
  M1 맥 터미널에서 명령어 하나로 arm / x86 환경 전환해가며 사용하기
excerpt: "터미널에서 간단한 명령어 입력을 통해 arm / x86 환경을 오가며 사용할 수 있도록 설정하는 방법을 정리해 보았습니다."
tags: [macos, m1, bash, shell, homebrew, tip]
key: 220304m1-bash-setup
type: article
lang: ko
---

## 목표

M1 맥북 터미널에서 간단한 명령어 **`intel`**, **`arm`** 으로 터미널 아키텍처와 환경 전환해가며 사용 가능하게 구성

## 작업 환경

- 하드웨어
  - MBP M1 Max 14인치
- 터미널 에뮬레이터
  - iterm2
- 시스템 기본 쉘
  - bash
- 기존에 사용하던 intel 맥에서 `마이그레이션 지원` 을 활용해 새 맥으로 데이터를 모두 옯긴 후 작업하였습니다.
  - 즉, 초기 환경이 마이그레이션 작업 완료 직후 `/usr/local/bin/brew` 경로에 intel 용 homebrew 가 설치되어 있는 환경입니다.

## 작업 전 준비사항

### rosetta2 설치

터미널에서 아래 명령어를 입력하여 rosetta2 를 설치합니다.

```bash
$ softwareupdate --install-rosetta
```

### 터미널 에뮬레이터 실행 아키텍처를 arm 으로 변경

![image1](https://jhycontents.s3.ap-northeast-2.amazonaws.com/blog/images/m1-bash-setup-1.png)

finder 의 `응용 프로그램` 에서 iterm 를 찾아 선택 후 `cmd + i` 를 눌러 **종류가 Universal** 이고, **Rosetta 를 사용하여 열기에 체크가 해제**되어 있는지 확인합니다.

만약 사진과 같은 옵션이 보이지 않는다면 iterm 버전을 업그레이드합니다.

## apple silicon 용 homebrew 설치

아래 명령어로 apple silicon 용 homebrew 를 설치해 줍니다

```bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## apple silcon 용 bash 쉘 설치

아래 명령어를 순서대로 입력하여 apple silicon 용 bash 쉘을 설치합니다

```bash
$ export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:${PATH}"
$ brew install bash
```

아래 명령어로 arm / x86 bash 쉘이 설치되어 잘 동작하는지 확인해 줍니다

- arm 쉘 확인


  ```bash
  $ env /usr/bin/arch -arm64 /opt/homebrew/bin/bash
  $ arch
  ```

  -> 결과가 **arm64** 가 나오면 정상입니다.


- x86 쉘 확인

  ```bash
  $ env /usr/bin/arch -x86_64 /usr/local/bin/bash
  $ arch
  ```

  -> 결과가 **i386** 이 나오면 정상입니다.


## 쉘 전환 명령어 추가하기

`~/.bash_profile` 하단에 아래 코드를 추가합니다. (시스템 기본 쉘이 zsh 이면 `.zshrc` 에 하단에 아래 코드를 수정(bash -> zsh) 해서 추가해 보세요 (작동 확인은 해보지 않았습니다.))

```bash
# Shell architecture switcher from (https://blog.jhyeom.com)
# Detect OS / Processor
current_kernel_name="$(uname -s)"
if [[ $current_kernel_name == "Darwin" ]]; then
    # Mac OS
    current_cpu_m1="$(sysctl -a | grep machdep.cpu.brand_string | tr " " "\n" |  grep M1)"
    if [[ $current_cpu_m1 == "M1" ]]; then
        # M1 processor family
        # Switch architecture command aliases (intel / arm)
        alias arm="env /usr/bin/arch -arm64 /opt/homebrew/bin/bash"
        alias intel="env /usr/bin/arch -x86_64 /usr/local/bin/bash"

        # Update $PATH by shell architecture to use differenct homebrew / clang (installed by brew install clang)
        current_arch="$(arch)"
        if [[ $current_arch == "i386" ]]; then
            # Current shell architecture is x86

            TMP_PATH="/usr/local/opt/llvm/bin:${PATH}"
            export PATH=`echo $TMP_PATH | tr ":" "\n" | \
                grep -v "/opt/homebrew/bin" | \
                grep -v "/opt/homebrew/sbin" | \
                # needed after installing clang with brew
                grep -v "/opt/homebrew/opt/llvm/bin" | \
            tr "\n" ":"`
        else
            # Current shell architecture is not x86 (arm)
            TMP_PATH="/opt/homebrew/opt/llvm/bin:${PATH}"

            export PATH=`echo $TMP_PATH | tr ":" "\n" | \
                grep -v "/opt/homebrew/bin" | \
                grep -v "/opt/homebrew/sbin" | \
                # needed after installing clang with brew
                grep -v "/usr/local/opt/llvm/bin" | \
            tr "\n" ":"`
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    fi
fi
```

이후 아래 명령어를 입력해 현제 쉘에 설정을 적용해 줍니다.

```bash
$ source ~/.bash_profile
```

명령어 설정이 잘 되었는지 확인해 줍니다

- arm 쉘 확인

  ```bash
  $ arm
  $ arch
  ```

  -> **arm64** 확인

  ```bash
  $ arm
  $ which brew
  ```

  -> **/opt/homebrew/bin/brew** 확인


- x86 쉘 확인

  ```bash
  $ intel
  $ arch
  ```

  -> **i386** 확인

  ```bash
  $ intel
  $ which brew
  ```

  -> **/usr/local/bin/brew** 확인

x86 용 homebrew 와 arm 용 homebrew 가 각각 다른 경로에 설치되어 있는 것을 확인하실 수 있습니다.


터미널 에뮬레이터를 종료 후 다시 쉘을 시작해서 위 명령어가 작동하는지 확인합니다.

만약 작동하지 않으면 `~/.bashrc` 파일을 열어 하단에 입력 후 다시 터미널 에뮬레이터를 켜서 확인해 보면 됩니다.

## 환경 전환이 잘 되는지 확인

x86 용 vim 과 arm 용 vim 을 설치해서 환경 전환이 잘 되는지 확인해 봅니다.

```bash
$ arm
$ brew install vim
$ arm_vim="$(which vim)"
$ file $arm_vim
# -> /opt/homebrew/bin/vim: Mach-O 64-bit executable arm64

$ intel
$ brew install vim
$ intel_vim="$(which vim)"
$ file $intel_vim
# -> /usr/local/bin/vim: Mach-O 64-bit executable x86_64
```

![image2](https://jhycontents.s3.ap-northeast-2.amazonaws.com/blog/images/m1-bash-setup-2.png)

## 팁

- 아래 명령어들로 현재 쉘과 실행하려는 바이너리의 아키텍처를 확인할 수 있습니다
  - `which` : 특정 명령어가 어느 위치에 위치해 있는지 확인
  - `file` : 특정 파일이 어떤 파일인지 (바이너리면 아키텍처 정보 포함) 확인
  - `arch` : 현재 쉘이 어느 아키텍처로 동작중인지 확인 (다른 기능은 `man arch` 로 확인해 보세요)
- file 명령어로 확인하다 보면 `/bin/sh` 와 같은 **Univeral Binary** 도 있습니다. 하나의 바이너리에 두 종류 이상의 바이너리를 패키징 한 것입니다.
- 매번 arch 명령어로 확인이 번거롭다면 PS1 환경 변수 설정으로 현재 쉘의 아키텍처를 쉘 프롬프트에 표시하도록 구성해 보세요.

## 참고 링크

- [M1 Mac — How to switch the Terminal between x86_64 and arm64 (by Vineeth Bharadwaj P)](https://vineethbharadwaj.medium.com/m1-mac-switching-terminal-between-x86-64-and-arm64-e45f324184d9)
- [Stackexchange - Removing a directory from PATH](https://unix.stackexchange.com/questions/108873/removing-a-directory-from-path)
