[//]: # (아키택쳐 개념도, H/W 구성도, S/W 구성도)

[//]: # (H/W:: server - client[통신 방법], S/W:: os-브라우저, 윈도우-브라우저-뷰-원투웹버전...)

# Web-GUI-Programing

- [Web-GUI-Programing](#web-gui-programing)
    - [Description](#description)
    - [Summary](#summary)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Run serve:](#run-serve)
        - [Connect to the server:](#connect-to-the-server)
    - [Simple Web Prototype Sepcification:](#simple-web-prototype-sepcification)
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

**웹 GUI 프로그램** 치과용(DICOM([https://www.dicomstandard.org/](https://www.dicomstandard.org/))) 2D 이미지 웹 뷰어

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

## Simple Web Prototype Sepcification

![image](https://user-images.githubusercontent.com/30463982/214742099-fff55eca-93a3-41d7-a235-3ef6aaf22ee2.png)

- 이미지 확대, 축소 기능
- 이미지 정보 표시
- 이미지 밝기 조절 —> 마우스 드레그로 명도 조절 가능
- 이미지 고대비
- 이미지 Sharpen 기능
- 3차원 의료 이미지(Dicom file) 실제 거리 측정, 화살표 표시 기능
- 연속된 선의 길이 측정 기능
- 두 선 사이의 각도 구하는 기능
- Text 메모 기능
- Circle, Rectangle 도형 그리기 기능
- 선 자유 그리기, 선 색 변경, 굵기 조절 기능
- 하치조신경 그리는 기능
- 이미지 회전, 뒤집기
- 이미지·드로우 Reset, Redo, Undo 기능

---

## Function

#### Patient Info : 환자 검색 및 선택된 환자의 영상 미리보기

#### Pan : 영상의 확대 / 축소

#### Zoom : 영상 이동 기능

[//]: # (#### Info : 영상 정보 확인)

#### Brightness : 선명효과 필터

#### Inverse : 선명효과 필터

#### Sharpen : 선명효과 필터

#### Ruler : 두 지점에 대한 길이 측정

#### Tapeline : 연속 지점에 대한 길이 측정

#### Freedraw : 연속 지점에 대한 길이 측정

[//]: # (#### Angle : 각도 측정)

[//]: # ()

[//]: # (#### Arrow : 화살표 표시)

[//]: # ()

[//]: # (#### Draw Nerve : 입력 포인트에 의한 신경관 라인 생성)

#### Rotation : 영상을 원하는 방향으로 돌리기

[//]: # (#### Insert implant : 치식 번호 및 Fixture 정보 선택 후 임플란트 식립)

[//]: # (#### Capture : 원하는 크기로 영상 capture)

---

## Implemented Screen

<p align="center">
  <img src="https://user-images.githubusercontent.com/30463982/214742270-7450a703-669b-4604-9f05-9f1ad3aa8327.png" align="center" width="49%">
  <img src="https://user-images.githubusercontent.com/30463982/214742459-49dc42fd-49aa-478d-b2c6-7ea243b9d57f.png" align="center" width="49%">
</p>

1. 향후 추가 기능 구현을 대비하여 Header, BaseHeader 컴포넌트 방식으로 구현하였습니다.
2. Header에서 환자 검색을 하여 선택하고 Utility에서영상을 조작한 뒤, MainView에서 영상을 확인할 수 있습니다.
