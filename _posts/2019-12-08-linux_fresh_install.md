---
title: linux installation checklist
excerpt: "리눅스 초기 설치 시 배포판에 상관 없이 수행하는 작업 정리"
tags: [linux, checklist, install]
key: 191208linuxfresh
---

리눅스를 설치할 때 항상 반복하는 작업들

## root user 비밀번호 설정

```bash
$ sudo passwd
```

## 패키지 관리자 저장소를 지역 미러로 설정

### fedora

- fastest mirror 플러그인 활성화
```bash
$ echo "fastestmirror=True" | sudo tee -a /etc/dnf/dnf.conf && sudo dnf makecache --refresh
```

### centos

- `/etc/yum.repos.d/`에 아래의  기존 repo들은 압축 후, 카카오 미러용 repo파일 추가
```
[base]
name=CentOS-$releasever - Base
baseurl=http://ftp.daumkakao.com/centos/$releasever/os/$basearch/
gpgcheck=0
[updates]
name=CentOS-$releasever - Updates
baseurl=http://ftp.daumkakao.com/centos/$releasever/updates/$basearch/
gpgcheck=0
[extras]
name=CentOS-$releasever - Extras
baseurl=http://ftp.daumkakao.com/centos/$releasever/extras/$basearch/
gpgcheck=0
```

### ubuntu

- 카카오 미러 사용
```bash
$ sudo sed -i 's/archive.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list
```

## 소프트웨어 설치

### 공통

- sshd
- git
- vim
- wget
- curl
- htop
- tmux

### 배포마다 다름
#### centos
- epel-release
- 'Development Tools'
  `sudo yum -y groupinstall 'Development Tools'`

#### fedora
- 'Development Tools'
  `sudo dnf -y groupinstall 'Development Tools'`
- gcc-c++ _(for g++)_

#### ubuntu
- 'build-essential'

### gui 환경
- code (vscode)
  - [fedora](https://computingforgeeks.com/install-visual-studio-code-on-fedora/)
  - [ubuntu](https://linuxize.com/post/how-to-install-visual-studio-code-on-ubuntu-18-04/)

### 자주 쓰는 소프트웨어

- docker
- [docker-compose](https://docs.docker.com/compose/install/#install-compose)
- chrome
  - [fedora | centos](https://www.if-not-true-then-false.com/2010/install-google-chrome-with-yum-on-fedora-red-hat-rhel/)
  ```bash
  $ sudo dnf install -y fedora-workstation-repositories
  $ sudo dnf config-manager --set-enabled google-chrome
  $ sudo dnf install -y google-chrome-stable
  ```
  - [ubuntu](https://webnautes.tistory.com/1184)
- [miniconda3](https://docs.conda.io/en/latest/miniconda.html)
- xrdp
- snapd
- cmake
- ctags (exuberant-ctags)
- python3
- python3-pip
- nano

## selinux 끄기

- `/etc/selinux/config` 파일을 열고 **SELINUX=disabled** 로 수정
- reboot

## 방화벽 zone 설정

- (gui 툴 사용이 가능한 경우) firewall-config 설치하여 사용
- 집에서 쓰는경우 home

## ssh 설정

- `.ssh` 디렉터리 만들기. 권한 700
- 키 생성
  - 다른 기기에 접속하기 위한 기본 키, git ssh 용 키
```bash
$ ssh-keygen -t rsa -b 2048 -C "Default ${HOSTNAME}'s ${USER} key" -f "${HOME}/.ssh/id_rsa"
$ ssh-keygen -t rsa -b 2048 -C "${HOSTNAME} ${USER}'s git key" -f "${HOME}/.ssh/${HOSTNAME}_git_key"
```

- config 파일 생성. 권한 400

```config
Host yourhostname
    Hostname 192.168.0.1
    IdentityFile ~/.ssh/id_rsa
    User remote_user
    Port 22

Host github.com
    hostname github.com
    user git
    identityfile ~/.ssh/${HOSTNAME}_git_key

Host gitlab.com
    hostname gitlab.com
    user git
    identityfile ~/.ssh/${HOSTNAME}_git_key

Host bitbucket.org
    hostname bitbucket.org
    user git
    identityfile ~/.ssh/${HOSTNAME}_git_key

Host gitlab.diyaml.com
    hostname gitlab.diyaml.com
    user git
    identityfile ~/.ssh/${HOSTNAME}_git_key

Host yoursecondhostname
    Hostname 192.168.0.2
    IdentityFile ~/.ssh/id_rsa
    User remote_user
    Port 22
    IdentitiesOnly yes
    PreferredAuthentications publickey
    LocalForward 8080 127.0.0.1:8080

```

  - 팁
```bash
$ chmod u+w "${HOME}/.ssh/config" && vim "${HOME}/.ssh/config" && chmod u-w "${HOME}/.ssh/config"
```

- 공개 키를 접속을 원하는 호스트에 등록

- **비밀 키 권한 600 꼭 확인하기**

## sshd 설정(서버의 경우)

- `.ssh/authorized_keys` 파일 만들기. 권한 644
- 키 추가
- `/etc/ssh/sshd_config` 파일 수정
  - LoginGraceTime
  - PermitRootLogin
  - MaxAuthTries
  - MaxSessions
  - PubkeyAuthentication yes
  - PermitEmptyPasswords
  - PasswordAuthentication
  - GSSAPIAuthentication
  - X11Forwarding
- 방화벽의 현재 zone에서 permanent 와 runtime으로 ssh 서비스 혹은 22/tcp 포트가 허용되어 있는지 확인.
- 데몬 실행

```bash
$ sudo systemctl start sshd
$ sudo systemctl enable sshd
```

## .bashrc 수정

```bash
# ...
# skip
alias l='ls --color=auto'
alias ls='ls --color=auto'
alias ll='ls -l --color=auto'
alias la='ls -a --color=auto'
alias lla='ls -al --color=auto'
alias sctl='sudo systemctl'
alias manc='man -Hgoogle-chrome'  # if you want to install google chrome
alias manf='man -Hfirefox'
#skip
# ...
```

- 터미널 컬러 수정
 

## git 설정

- 홈 디렉터리에 .gitconfig 파일 생성

```conf
[user]
	name = zhixian001
	email = okyjh12@naver.com
[core]
	autocrlf = false
	editor = code
[merge]
    tool = vscode
[mergetool "vscode"]
    cmd = code --wait $MERGED
[diff]
    tool = vscode
[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE
```

- git 온라인 서비스에 ssh pubkey 등록
  - [gitlab](https://gitlab.com/profile/keys)
  - [github](https://github.com/settings/keys)
  - [diya git](https://gitlab.diyaml.com/profile/keys)
  - bitbucket

## vim 설정

`.vimrc`
<script src="https://gitlab.diyaml.com/snippets/4.js"></script>

## tmux 설정

`.tmux.conf`
<script src="https://gitlab.diyaml.com/snippets/5.js"></script>

15번째 줄에 wlo1 은 ifconfig 명령어로 확인한 네트워크 인터페이스 이름을 넣으면 됨

## 한글 디렉터리 링크

- 터미널에서 한글이 깨짐

```bash
$ ln -s 다운로드/ Downloads
$ ln -s 바탕화면/ Desktop
```
