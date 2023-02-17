[//]: # (아키택쳐 개념도, H/W 구성도, S/W 구성도)

[//]: # (H/W:: server - client[통신 방법], S/W:: os-브라우저, 윈도우-브라우저-뷰-원투웹버전...)

# Web-GUI-Programing

**웹 GUI 프로그램** 치과용(DICOM([https://www.dicomstandard.org/](https://www.dicomstandard.org/))) 2D 이미지 웹 뷰어

![full](https://user-images.githubusercontent.com/30463982/219650504-7558e9f4-a72b-467f-b7d7-93c2e76882e4.gif)

- [Web-GUI-Programing](#web-gui-programing)
    - [Summary](#summary)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Run serve :](#run-serve-)
        - [Connect to the server :](#connect-to-the-server-)
    - [Implemented Screen](#implemented-screen)
    - [Simple Web Viewer Specification :](#simple-web-veiwer-sepcification)
    - [Function](#function)
        - [Patient Info :](#patient-info-)
        - [Pan :](#pan-)
        - [Zoom :](#zoom-)
        - [Brightness :](#brightness-)
        - [Inverse :](#inverse-)
        - [Sharpen :](#sharpen-)
        - [Ruler :](#ruler-)
        - [Tapeline :](#tapeline-)
        - [Freedraw :](#freedraw-)
        - [Rotation :](#rotation-)
    - [Ref](#ref)

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

## Implemented Screen

<p align="center">
  <img src="https://user-images.githubusercontent.com/30463982/214742270-7450a703-669b-4604-9f05-9f1ad3aa8327.png" align="center" width="49%">
  <img src="https://user-images.githubusercontent.com/30463982/214742459-49dc42fd-49aa-478d-b2c6-7ea243b9d57f.png" align="center" width="49%">
</p>

1. 향후 추가 기능 구현을 대비하여 Header, BaseHeader 컴포넌트 방식으로 구현하였습니다.
2. Header에서 환자 검색을 하여 선택하고 Utility에서영상을 조작한 뒤, MainView에서 영상을 확인할 수 있습니다.

---

## Simple Web Veiwer Sepcification

![image](https://user-images.githubusercontent.com/30463982/219648653-0f717550-c721-4775-9d7c-5ca2546a6124.png)

**웹 GUI 프로그램** 치과용(DICOM([https://www.dicomstandard.org/](https://www.dicomstandard.org/))) 2D 이미지 웹 뷰어

---

## Function

#### Patient Info :

- 환자 검색 및 선택된 환자의 영상 미리보기
    - 환자 검색 시 성명, 차트번호로 자동완성 기능 구현
    - 환자 사진 출력 시 좌측 상단에 이미지(이름, 차트번호, 나이, 성별, 사진 촬영 날짜)에 대한 정보 표시

![1](https://user-images.githubusercontent.com/30463982/219615382-946b97ed-08d7-4a72-bb9b-e3f093b15afc.gif)

#### Pan :

- 영상의 확대 / 축소
    - 마우스 휠로 이미지 확대, 축소 기능

![2](https://user-images.githubusercontent.com/30463982/219638566-9445e0ca-a1a7-4b1d-8929-e70f35c7723c.gif)

#### Zoom :

- 영상 이동 기능
    - 마우스 좌클릭으로 이미지를 클릭 후 드래그로 사진 이동

![3](https://user-images.githubusercontent.com/30463982/219646281-6248c5f0-8801-4337-8bb8-9ff36ad6141f.gif)

#### Brightness :

- 밝기 조절 필터
    - 이미지 밝기 조절 —> 마우스 드레그로 명도 조절 가능

#### Inverse :

- 이미지 반전 필터
    - 바이트 코드로 읽어 rgb 값을 반전시킨 후 다시 그림

![4](https://user-images.githubusercontent.com/30463982/219645542-60a2d427-e7d8-485b-a31d-2d01a8509d19.gif)

#### Sharpen :

- 선명효과 필터
    - 이미지 Sharpen 기능

#### Ruler :

- 두 지점에 대한 길이 측정
    - DPI를 적용시켜 3차원 의료 이미지(Dicom image file) 실제 거리로 변환(pixel -> mm)

![5](https://user-images.githubusercontent.com/30463982/219645744-52515fe0-30d9-4c7d-ad87-c239e4eaabc0.gif)

#### Tapeline :

- 연속 지점에 대한 길이 측정

#### Freedraw :

- 자유롭게 선 그리기
    - 선 색상 변경, 굵기(1~20) 조절

![6](https://user-images.githubusercontent.com/30463982/219646142-087d7203-31cc-4bd0-a81e-8960941f89d8.gif)

#### Rotation :

- 영상을 원하는 방향으로 돌리기
    - 이미지 90도 좌·우 회전, 좌·우, 상·하 뒤집기

![8](https://user-images.githubusercontent.com/30463982/219646131-4e8d7d0d-ed5c-42a5-b71d-3bd7a3995040.gif)

#### Undo, Redo :

- 그린 마커 지우기(Undo), 다시 그리기(Redo)

![7](https://user-images.githubusercontent.com/30463982/219646140-b9609235-e780-48d0-9f2e-db6732baa15a.gif)

---

## Ref

1. [두선분 사이의 각도 구하기](https://blog.naver.com/set_star/222963006080)
2. [반응형 페이지에 맞게 이미지 크기 실시간 Resize](https://blog.naver.com/set_star/222974450446)
3. [거리 측정 시 실제 길이 표시(DPI)](https://blog.naver.com/set_star/223000120552)