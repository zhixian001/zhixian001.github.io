---
title: Gitlab CE 호스팅 시 시도해볼 만한 설정들
excerpt: "Gitlab Comunity Edition을 호스팅하는 관리자로서 시도해 볼 만한 재미있는 설정들"
tags: [gitlab]
---

# 로컬 저장 공간 절약을 위해 S3 연동

용량을 줄이기 위해 LFS, 컨테이너 레지스트리, 업로드 파일(MR 게시글의 이미지 등등)을 S3에 direct 로 업로드 가능

# 정기적인 백업 -> S3
