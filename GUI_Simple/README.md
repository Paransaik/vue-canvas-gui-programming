# Web-GUI-Programing

- [Web-GUI-Programing](#web-gui-programing)
  - [Description](#description)
  - [Summary](#summary)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Run serve:](#run-serve)
    - [Connect to the server:](#connect-to-the-server)
  - [Function](#function)
    - [Patient Info : 환자 검색 및 선택된 환자의 영상 미리보기](#patient-info--환자-검색-및-선택된-환자의-영상-미리보기)
    - [Pan : 영상의 확대 / 축소](#pan--영상의-확대--축소)
    - [Zoom : 영상 이동 기능](#zoom--영상-이동-기능)
    - [Info : 영상 정보 확인](#info--영상-정보-확인)
    - [Sharpen : 선명효과 필터](#sharpen--선명효과-필터)
    - [Ruler : 두 지점에 대한 길이 측정](#ruler--두-지점에-대한-길이-측정)
    - [Tapeline : 연속 지점에 대한 길이 측정](#tapeline--연속-지점에-대한-길이-측정)
    - [Angle : 각도 측정](#angle--각도-측정)
    - [Arrow : 화살표 표시](#arrow--화살표-표시)
    - [Draw Nerve : 입력 포인트에 의한 신경관 라인 생성](#draw-nerve--입력-포인트에-의한-신경관-라인-생성)
    - [Rotation : 영상을 원하는 방향으로 돌리기](#rotation--영상을-원하는-방향으로-돌리기)
    - [Insert implant : 치식 번호 및 Fixture 정보 선택 후 임플란트 식립](#insert-implant--치식-번호-및-fixture-정보-선택-후-임플란트-식립)
    - [Capture : 원하는 크기로 영상 capture](#capture--원하는-크기로-영상-capture)
  - [Implemented Screen](#implemented-screen)

## Description

**웹 GUI 프로그램** - 치과용(DICOM) 2D 이미지 웹 뷰어

## Summary

2D 영상을 진단, 시뮬레이션 할 수 있는 치과 전용 웹 뷰어입니다. 분석에 필요한 도구를 제공함으로써 빠르고 편리하게 영상을 분석할 수 있습니다.

---
## Installation
- Vue
- Vuex
- Node.js

Install the Node.js like: *[https://nodejs.org/ko/](https://nodejs.org/ko/)*

Install the Vue like:

    npm install vue

Install the Vue CLI like:

    npm install -g @vue/cli

---
## Usage
### Run serve:

    npm run serve

### Connect to the server:

In the address bar

    localhost:8080

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

---
## Function
### Patient Info : 환자 검색 및 선택된 환자의 영상 미리보기
### Pan : 영상의 확대 / 축소
### Zoom : 영상 이동 기능
### Info : 영상 정보 확인
### Sharpen : 선명효과 필터
### Ruler : 두 지점에 대한 길이 측정
### Tapeline : 연속 지점에 대한 길이 측정
### Angle : 각도 측정
### Arrow : 화살표 표시
### Draw Nerve : 입력 포인트에 의한 신경관 라인 생성 
### Rotation : 영상을 원하는 방향으로 돌리기
### Insert implant : 치식 번호 및 Fixture 정보 선택 후 임플란트 식립
### Capture : 원하는 크기로 영상 capture

---
## Implemented Screen
<center>

![implemented_screen](https://user-images.githubusercontent.com/30463982/197709891-c05e8ddc-375f-419f-987a-2b9d46f6bb9f.png)  
<메인화면>

</center>

Header, BaseHeader, Utility, BaseUtility로 총 4개의 컴포넌트로 나누어져있으며, BaseHeader에서 Utility와 BaseUtility로 나누어져있고, BaseUtility에서 MainView와 List로 나뉩니다.

Header에서는 환자 검색을 하여 선택을 할 수 있고, Utility에서는 영상에 필요한 기능들이 있고, MainView에서 영상을 확인할 수 있으며, List에서 썸네일을 확인할 수 있습니다.
