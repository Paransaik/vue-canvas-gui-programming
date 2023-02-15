<template>
  <div class="baseHeaderView">
    <div class="utilityView">
      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in first" :key="k"
            @click="checkedButtonToggling(first, k, v), changedStrokeType(k)"
            :class="{isToggle:v && disable}">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in second" :key="k"
            @click="checkedButtonToggling(second, k, v), changedEvent(k), changedStrokeType(k)"
            :class="{isToggle:v && disable}">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
        <div>
          <input type="color" class="item" v-model="lineColor"/>
        </div>
        <select class="colorSelect" v-model="lineWidth">
          <option v-for="n in 25" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <div class="line"></div>

      <div class="itemBox">
        <div
            class="item"
            v-for="(k, i) in third" :key="k"
            @click="changedEvent(i)">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <div class="itemBox">
        <button class="item same" @click="undo">U</button>
        <button class="item same" @click="redo">R</button>
        <!-- 회전 초기화-->
        <button class="item same" @click="reset">S</button>
        <!--        <button class="item same" @click="save">S</button>-->
        {{ x }} {{ y }}
      </div>
    </div>

    <div class="baseUtilityView" id="divCanvas">
      <div v-if="patientInfo['LastName']" class="information">
        <p> {{ patientInfo['LastName'] }} {{ patientInfo['FirstName'] }} ({{ patientInfo['ChartID'] }}) </p>
        <p> 만 {{
            new Date().getFullYear() - getUnixToTimestamp(patientInfo['Birthday']['MilliSecondsSinceEpoch'] / 1000).substring(0, 4)
          }} 세, {{ patientInfo['Gender'] === 1 ? '남성' : '여성' }} </p>
        <p> {{ getUnixToTimestamp(patientInfo['DateTimeUtcLastCapturedSeries'] / 1000) }} </p>
      </div>
      <canvas id="canvas"
              :width="canvasWidth"
              :height="canvasHeight"
              @mousedown="startDraw($event), startMoving($event)"
              @mousemove="lineDraw($event), getCoordinates($event), moveImage($event)"
              @mouseup="stopDraw(), endMoving()"
              @mouseleave="stopDraw(), endMoving()"
              @wheel="changedScale($event)"
      >
        <!-- wheel event is "Added non-passive event listener to a scroll-blocking 'wheel'"-->
      </canvas>
    </div>
  </div>
</template>

<script>
import '@/assets/css/utility.css';
import {xmlToJson} from '@/assets/js/x2j.js';

import axios from "axios";
import drf from '@/api/drf';
import {mapGetters, mapActions} from 'vuex';
import Constant from "@/common/Constant.js";

export default {
  name: 'BaseUtilityView',

  components: {},

  data: () => ({

    /***
     * patient info
     * */
    patientInfo: {},

    /***
     * width, height
     * */
    DPI: 96,
    // canvas width, height
    canvasWidth: 0,
    canvasHeight: 0,

    // pixel * pixel spacing / 25.4 * 96
    realityImageWidth: 0,
    realityImageHeight: 0,
    //=========================================

    /***
     * canvas
     * */
    imageArr: [],
    downFlag: false,
    x: 0,
    y: 0,
    strokeType: "freedraw",
    fillShape: false,
    backgroundImage: null,

    /***
     * panning
     * */
    startTop: 0,
    startLeft: 0,
    movingTop: 0,
    movingLeft: 0,

    /***
     * required drawing
     * */
    canvas: null,
    context: null,
    divCanvas: null,
    divContext: null,

    strokes: {
      type: '',
      from: {
        x: 0,
        y: 0
      },
      coordinates: [],
      color: '',
      width: '',
      fill: false,
      lineCap: '',
      lineJoin: ''
    },
    lineCount: 0,
    drawMarkArray: [],
    guides: [],
    trash: [],

    mainImg: require('@/assets/img/board.png'),
    tempImage: '',
    guideTempImage: '',
    overlaies: null,
    reSizeScale: 0,
    scale: 0.0,
    angle: 0,
    symmetry: 1,
    verticalSymmetry: 1,
    //=========================================

    /***
     * stroke
     * */
    lineColor: '#ff0000',
    lineWidth: 1,
    //=========================================

    /***
     * icon list
     * */
    disable: false,
    lock: '',
    first: {
      pan: false,
      zoom: false,
    },
    second: {
      bright: false,
      inverse: false,
      sharpen: false,
      ruler: false,
      tapeline: false,
      draw: false
    },
    third: ['01', '02', '03', '04'],
    //=========================================
  }),

  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.context.save();
    this.divCanvas = document.getElementById('divCanvas');
    this.canvasHeight = this.divCanvas.clientHeight - 2;
    this.canvasWidth = this.divCanvas.clientWidth - 2;
  },

  computed: {
    ...mapGetters([
      'patientRecordList',
      'patientSeriesList',
    ]),
  },

  watch: {
    patientSeriesList: {
      deep: true,
      async handler() {
        this.imageArr = [];

        const chartId = this.patientSeriesList.chartId;
        for (let e of this.patientSeriesList.entity) {
          const createdTime = e.Created;
          // image
          const url = await axios({
            url: drf.patient.patientImgFileDownload(e.UniqueID),
            method: 'get',
            responseType: 'blob',
          })
          const blobImage = URL.createObjectURL(new Blob([url.data], {type: 'image/bmp'}));
          window.onload = function () {
            console.log(blobImage);
            this.context.drawImage(blobImage, 0, 0, 1000, 1000);
          }
          const markCoordinate = await axios({
            url: drf.patient.drawImage(e.UniqueID),
            method: 'get',
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })

          // xml to json
          let XmlNode = new DOMParser().parseFromString(e.Tags, "text/xml");
          const json = xmlToJson(XmlNode);
          this.realityImageWidth = (json.tags.tags[0].tag[0]["@attributes"].value * e.PixelSpacingV) / 25.4 * this.DPI;
          this.realityImageHeight = (json.tags.tags[0].tag[1]["@attributes"].value * e.PixelSpacingH) / 25.4 * this.DPI;

          // 이미지 마다 다른 것
          this.imageArr.push({
            // 차트ID
            chartId: chartId,
            // 마커 정보
            images: blobImage,
            // 마커 파일
            drawMark: markCoordinate,
            // 생성 일자
            create: createdTime,
            // 너비
            ph: this.realityImageWidth,
            // 높이
            pw: this.realityImageHeight,
            // 마커 배열
            overlaies: markCoordinate.data.overlaies,
          })
          this.disable = true;

          await axios({
            url: drf.patient.getPatientInfo('DD2C442B6B1541BA82AEB90508045177'),
            method: 'get',
          }).then(res => {
            this.patientInfo = res.data.Result;
          })

          this.overlaies = markCoordinate.data.overlaies;
          this.mainImg = blobImage;
        }

        await this.setCanvasTransrateAndScale();
        setTimeout(() => this.importOne2Drawing(), 10);
      }
    }
  },

  methods: {
    async handleResize() {
      this.canvasHeight = this.divCanvas.clientHeight - 2;
      this.canvasWidth = this.divCanvas.clientWidth - 2;
      this.movingTop = 0;
      this.movingLeft = 0;
      await this.setCanvasTransrateAndScale();
      setTimeout(() => this.markDraw(), 1);
    },

    /***
     * ===============================================================
     * panning & scale
     * ===============================================================
     * */
    startMoving(e) {
      if (this.first.pan && !this.mouseFlag) {
        this.startTop = e.screenY;
        this.startLeft = e.screenX;
        this.mouseFlag = true;
      }
    },
    async moveImage(e) {
      if (this.first.pan && this.mouseFlag) {
        this.movingTop += e.screenY - this.startTop;
        this.startTop = e.screenY;
        this.movingLeft += e.screenX - this.startLeft;
        this.startLeft = e.screenX;

        await this.setCanvasTransrateAndScale();
        setTimeout(() => this.markDraw(), 1);
      }
    },
    endMoving() {
      if (this.first.pan && this.mouseFlag) {
        this.mouseFlag = false;
      }
    },
    async changedScale(e) {
      if (this.first.zoom) {
        const rate = 0.005;
        if (e.deltaY > 0) this.scale -= rate;
        else if (e.deltaY < 0) this.scale += rate;
        await this.setCanvasTransrateAndScale();
        setTimeout(() => this.markDraw(), 1);
      }
    },

    /***
     * ===============================================================
     * Set transrate scale
     * ===============================================================
     * */
    async setCanvasTransrateAndScale() {
      this.context.restore();
      this.context.save();
      // 1. Rect 클리어
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 2. 가로/세로 중 reSize 크기 선택
      if (this.angle === 0 || this.angle === 180) {
        [this.reSizeScale] = await Promise.all([Math.min(this.canvasWidth / this.realityImageWidth, this.canvasHeight / this.realityImageHeight)]);
      } else if (this.angle === 90 || this.angle === 270) {
        [this.reSizeScale] = await Promise.all([Math.min(this.canvasWidth / this.realityImageHeight, this.canvasHeight / this.realityImageWidth)]);
      }
      this.reSizeScale += this.scale;

      // 3. 스케일 -> 캔바스 스케일을 높이와 너비 중 짧은 걸 기준으로 맞춤
      this.context.scale(this.reSizeScale, this.reSizeScale);

      // 4. 트랜스레이트 -> 화면의 중앙으로 이동
      this.context.translate(this.canvasWidth / this.reSizeScale / 2.0 + this.movingLeft, this.canvasHeight / this.reSizeScale / 2.0 + this.movingTop);
      // 5. 로테이트 -> 효과 적용
      this.context.rotate((Math.PI / 180) * this.angle);
      // 6. 트랜스레이트 -> 화면의 중앙에서 그림 박기 위한 0, 0으로 이동
      this.context.translate(this.realityImageWidth / -2.0, this.realityImageHeight / -2.0);

      // 7. 상하좌우반전 유무
      if (this.angle === 0 || this.angle === 180) {
        if (this.symmetry === -1) {
          this.context.translate(this.realityImageWidth, 0);
        }
        if (this.verticalSymmetry === -1) {
          this.context.translate(0, this.realityImageHeight);
        }
        this.context.scale(this.symmetry, this.verticalSymmetry);
      } else if (this.angle === 90 || this.angle === 270) {
        if (this.symmetry === -1) {
          this.context.translate(0, this.realityImageHeight);
        }
        if (this.verticalSymmetry === -1) {
          this.context.translate(this.realityImageWidth, 0);
        }
        this.context.scale(this.verticalSymmetry, this.symmetry);
      }

      // 8. 이미지 그리기
      if (this.tempImage) {
        this.context.drawImage(this.tempImage, 0, 0, this.realityImageWidth, this.realityImageHeight);
        // 9. 마커 그리기 위해 다시 원점 중앙 이동
        this.context.translate(this.realityImageWidth / 2.0, this.realityImageHeight / 2.0);
        console.log('111111111111');
      } else {
        const image = new Image();
        image.src = this.mainImg;
        this.tempImage = image;
        image.onload = async () => {
          this.context.drawImage(image, 0, 0, this.realityImageWidth, this.realityImageHeight);
          // 9. 마커 그리기 위해 다시 원점 중앙 이동
          this.context.translate(this.realityImageWidth / 2.0, this.realityImageHeight / 2.0);
          console.log('2222222222222');
        }
      }
    },

    /***
     * ===============================================================
     * freedraw
     * ===============================================================
     * */
    startDraw(event) {
      if (!this.lock) {
        this.drawing = true;
        let coordinate = this.getCoordinates(event);
        if (this.strokeType === 'freedraw' || this.lineCount === 0) {
          this.strokes = {
            type: this.eraser ? 'eraser' : this.strokeType,
            from: coordinate,
            coordinates: [],
            color: this.lineColor,
            width: this.lineWidth,
            fill: this.eraser ||
            this.strokeType === 'freedraw' ||
            this.strokeType === 'ruler' ||
            this.strokeType === 'tapeline'
                ? false : this.fillShape,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin
          };
        }

        if (this.strokeType === 'ruler') {
          const image = new Image();
          image.src = this.canvas.toDataURL('image/png');
          this.guideTempImage = image;
        }
      }
    },

    lineDraw(event) {
      let coordinate = this.getCoordinates(event);
      if (this.drawing) {
        if (this.strokeType === 'freedraw') {
          this.strokes.coordinates.push(coordinate);
          this.drawShape(this.strokes);
        }
      }
      if (this.lineCount > 0) {
        switch (this.strokeType) {
          case 'ruler':
            this.guides = [{
              x: coordinate.x,
              y: coordinate.y
            }];
            break;
        }

        this.drawGuide();
      }
    },

    async markDraw() {
      for (let m of this.drawMarkArray) {
        this.drawShape(m);
      }

      /*// 10. 마커 그린 후 pan 기능 적용 시 좌표 맞춤
      if (this.angle === 0 || this.angle === 180) {
        this.context.translate(-this.movingLeft, -this.movingTop);

        /!*if (this.symmetry === -1) {
          this.context.translate(-this.movingLeft, -this.movingTop);
        }
        if (this.verticalSymmetry === -1) {
          this.context.translate(0, this.realityImageHeight);
        }*!/
      } else if (this.angle === 90 || this.angle === 270) {
        console.log(this.angle + ' 22222222222');

        await this.drawCircle();
        await this.context.translate(-this.movingTop, -this.movingLeft);
        await this.drawCircle();

        // if (this.symmetry === -1) {
        //   this.context.translate(0, this.realityImageHeight);
        // }
        // if (this.verticalSymmetry === -1) {
        //   this.context.translate(this.realityImageWidth, 0);
        // }
      }*

    },
    async drawCircle() {
      this.context.beginPath();
      this.context.arc(0, 0, 20, 0, 2 * Math.PI);
      this.context.stroke();
    },

    async drawGuide() {
      this.context.clearRect(this.canvasWidth / this.reSizeScale / -2,
          this.canvasHeight / this.reSizeScale / -2,
          this.canvasWidth / this.reSizeScale,
          this.canvasHeight / this.reSizeScale);
      this.context.drawImage(this.guideTempImage,
          this.canvasWidth / this.reSizeScale / -2,
          this.canvasHeight / this.reSizeScale / -2,
          this.canvasWidth / this.reSizeScale,
          this.canvasHeight / this.reSizeScale);
      console.log(this.canvasWidth);
      /*await this.setCanvasTransrateAndScale();
      setTimeout(() => this.markDraw(), 20);*/
      this.context.strokeStyle = this.lineColor;
      this.context.lineWidth = this.lineWidth;
      this.context.lineJoin = this.lineJoin;
      this.context.lineCap = this.lineCap;
      this.context.beginPath();
      this.context.moveTo(this.strokes.from.x, this.strokes.from.y);
      this.guides.forEach(coordinate => {
        this.context.lineTo(coordinate.x, coordinate.y);
      });

      // 단위 표시
      if (this.strokes.type === 'ruler') {
        this.context.fillStyle = "#ffff00";
        let distance = this.getDistance([{x: this.strokes.from.x, y: this.strokes.from.y},
          {x: this.guides[0].x, y: this.guides[0].y}]);
        this.context.font = "10px serif"
        this.context.textAlign = "center"
        this.context.textBaseline = "alphabetic";
        this.context.fillStyle = "#ffff00";

        /*const x1 = Math.abs(this.strokes.from.x),
            x2 = Math.abs(this.guides[0].x),
            y1 = Math.abs(this.strokes.from.y),
            y2 = Math.abs(this.guides[0].y);*/

        const x1 = this.strokes.from.x,
            x2 = this.guides[0].x,
            y1 = this.strokes.from.y,
            y2 = this.guides[0].y;
        this.context.fillText(distance,
            (x1 - x2) / 2 / 25.4 * this.DPI,
            (y1 - y2) / 2 / 25.4 * this.DPI);

        console.log((this.strokes.from.x - this.guides[0].x) / 2 / 25.4 * this.DPI);
        console.log((this.strokes.from.y - this.guides[0].y) / 2 / 25.4 * this.DPI);
      }

      this.context.closePath();
      this.context.stroke();

    },

    drawShape(stroke) {
      this.context.strokeStyle = stroke.color;
      this.context.fillStyle = stroke.color;
      this.context.lineWidth = stroke.width;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";
      this.context.beginPath();
      this.context.setLineDash([]);

      this.context.moveTo(stroke.from.x, stroke.from.y);
      stroke.coordinates.forEach(s => {
        this.context.lineTo(s.x, s.y);
      });

      // 단위 표시
      if (stroke.coordinates.valueBox) {
        this.context.fillStyle = "#ffff00";
        let distance
        if (stroke.type === 'length') {
          distance = this.getDistance([{x: stroke.from.x, y: stroke.from.y},
            {x: stroke.coordinates[0].x, y: stroke.coordinates[0].y}]);
        } else if (stroke.type === 'tapeline') {
          distance = this.getDistance(stroke.coordinates);
        }
        this.context.font = "10px serif"
        this.context.textAlign = "center"
        this.context.textBaseline = "alphabetic";
        this.context.fillStyle = "#ffff00";
        this.context.fillText(distance, stroke.coordinates.valueBox.x / 25.4 * this.DPI, stroke.coordinates.valueBox.y / 25.4 * this.DPI);
      }
      this.context.stroke();
    },

    stopDraw() {
      if (this.drawing) {
        this.strokes.coordinates = this.guides.length > 0 ? this.guides : this.strokes.coordinates;
        if (this.strokeType === 'ruler') {
          this.lineCount++;
        }

        if (this.strokeType === 'freedraw' ||
            (this.strokeType === 'ruler' && this.lineCount === 2)) {
          this.drawMarkArray.push(this.strokes);
          this.lineCount = 0;
        }

        this.drawing = false;
        this.trash = [];
      }
    },

    getCoordinates(event) {
      this.x = (event.offsetX - (this.canvasWidth / 2.0)) / this.reSizeScale;
      this.y = (event.offsetY - (this.canvasHeight / 2.0)) / this.reSizeScale;
      /*if (this.angle === 0 || this.angle === 180) {

      } else {
        this.x = (event.offsetX - (this.canvasWidth / 2.0)) / this.reSizeScale;
        this.y = (event.offsetY - (this.canvasHeight / 2.0)) / this.reSizeScale;
      }*/

      this.y *= -1;
      for (let i = 0, cnt = this.angle / 90; i < cnt; i++) {
        [this.x, this.y] = [-this.y, this.x];
      }
      this.y *= -1;

      if (this.angle === 0 || this.angle === 180) {
        if (this.symmetry === -1) this.x *= -1;
        if (this.verticalSymmetry === -1) this.y *= -1;
      } else if (this.angle === 90 || this.angle === 270) {
        if (this.symmetry === -1) this.y *= -1;
        if (this.verticalSymmetry === -1) this.x *= -1;
      }

      // console.log(this.movingTop + ' ' + this.movingLeft);
      if (this.angle === 0) {
        this.x += -this.movingLeft;
        this.y += -this.movingTop;
      } else if(this.angle === 90){
        this.x += -this.movingLeft;
        this.y += -this.movingTop;
      } else if (this.angle === 180) {
        this.x += this.movingLeft;
        this.y += this.movingTop;
      } else {
        this.x += this.movingLeft;
        this.y += this.movingTop;
      }

      return {
        x: this.x,
        y: this.y
      };
    },

    // 4-1, 4-2
    async reset() {
      if (!this.lock) {
        this.first.pan = false;
        this.first.zoom = false;

        this.second.bright = false;
        this.second.inverse = false;
        this.second.sharpen = false;

        this.second.ruler = false;
        this.second.tapeline = false;
        this.second.draw = false;

        this.scale = 1.0;
        this.brightness = 100;
        this.inverse = 0;

        this.strokes = {
          type: '',
          coordinates: [],
          color: '',
          width: '',
          fill: false,
          lineCap: '',
          lineJoin: ''
        };

        this.tempImage = '';
        this.mainImg = require('@/assets/img/board.png');
        this.drawMarkArray = [];
        this.guides = [];
        this.trash = [];
        await this.setCanvasTransrateAndScale();
      }
    },

    async undo() {
      if (!this.lock) {
        let strokes = this.drawMarkArray.pop();

        if (strokes) {
          this.trash.push(strokes);
          await this.setCanvasTransrateAndScale();
          setTimeout(() => this.markDraw(), 5);
        }
      }
    },

    async redo() {
      if (!this.lock) {
        let strokes = this.trash.pop();

        if (strokes) {
          this.drawMarkArray.push(strokes);
          await this.setCanvasTransrateAndScale();
          setTimeout(() => this.markDraw(), 5);
        }
      }
    },

    /***
     * ===============================================================
     * Event
     * ===============================================================
     * */
    checkedButtonToggling(idx, name, bool) {
      if (this.disable) {
        if (idx[name] === bool) {
          this.first.pan = false;
          this.second.bright = false;
          this.second.ruler = false;
          this.second.tapeline = false;
          this.second.draw = false;
          idx[name] = !bool;
        }
      }
    },

    // 2-1, 2-3
    changedMouseWheelEvent(e) {
      if (this.downFlag && this.second.bright) {
        this.lock = this.second.bright;
        this.preX = this.x;
        this.preY = this.y;
        this.getCoordinates(e);
        if (this.preX < this.x || this.preY < this.y) {
          this.brightness += 2;
        } else if (this.preX > this.x || this.preY > this.y) {
          this.brightness -= 2;
        }
      }
    },

    // 2-2, 4-1, 4-2, 4-3, 4-3
    async changedEvent(e) {
      if (this.disable) {
        if (e === 'inverse') {
          // Change Inverse
          // 2-2
          if (this.second[e] === true) this.inverse = 100;
          else this.inverse = 0;
        } else if (typeof e === 'number') {
          // Change Angle
          // 3-1, 2, 3, 4
          if (e === 0) {
            this.angle += 90;
            if (this.angle === 360) this.angle = 0;
          } else if (e === 1) {
            if (this.angle === 0) this.angle = 360;
            this.angle -= 90;
          } else if (e === 2) {
            this.symmetry *= -1;
          } else if (e === 3) {
            this.verticalSymmetry *= -1;
          }

          await this.setCanvasTransrateAndScale();
          setTimeout(() => this.markDraw(), 10);
        }
      }
    },

    // 2-4, 2-8, 2-9, 3-1
    changedStrokeType(s) {
      if (this.disable) {
        if (s === 'pan') {
          this.lock = true;
        } else if (s === 'zoom') {
          this.lock = true;
        } else if (s === 'ruler') {
          this.strokeType = 'ruler';
          this.lock = !this.second.ruler;
        } else if (s === 'tapeline') {
          this.strokeType = 'tapeline';
          this.lock = !this.second.tapeline;
        } else if (s === 'draw') {
          this.strokeType = 'freedraw';
          this.lock = !this.second.draw;
        }
      }
      /*else {
        this.lock = true;
      }*/
    },

    getDistance(arr) {
      let distance = 0;
      let x = arr[0].x;
      let y = arr[0].y;
      arr.forEach(a => {
        distance += Math.pow(Math.pow(y - a.y, 2) + Math.pow(x - a.x, 2), 0.5);
        x = a.x;
        y = a.y;
      });
      // Number.EPSILON = 오차없이 나타낼수 있는 가장 작은 양의 수, 부동 소수점 오차를 보정
      distance = Math.round((distance + Number.EPSILON) * 100) / 100 / this.DPI * 25.4;
      return distance.toFixed(2) + ' mm';
    },

    getUnixToTimestamp(time) {
      const date = new Date(time * 1000);
      console.log()
      const year = date.getFullYear();
      const month = "0" + (date.getMonth() + 1);
      const day = "0" + date.getDate();
      const hour = "0" + date.getHours();
      const minute = "0" + date.getMinutes();
      const second = "0" + date.getSeconds();
      return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
      // return new Date().getFullYear() - year;
    },

    /***
     * One2         => Canvas  pen.style
     * length       => line       0
     * multi-length => tapeline
     * angle        => line       0
     * arrow        => line       1
     * ellipse      => circle     1
     * rectangle    => square     1
     * freedraw     => freedraw       1
     * */
    // One2 --> Web
    async importOne2Drawing() {
      for (const m of this.overlaies) {
        // 선 속성 지정
        this.lineColor = '#' + m.style.pen.color.substring(3, 9);
        this.lineWidth = m.style.pen.width / this.reSizeScale;
        const stroke = {
          type: '',
          from: {
            x: 0,
            y: 0,
          },
          coordinates: [],
          color: this.lineColor,
          width: this.lineWidth,
          fill: false,
          lineCap: "round",
          lineJoin: "round",
          valueBox: {
            x: 0,
            y: 0,
          },
        };
        switch (m.type) {
          case "freedraw":
            stroke.type = "freedraw";
            stroke.from.x = m.scene_pos['control-points'][0].x / 25.4 * this.DPI;
            stroke.from.y = m.scene_pos['control-points'][0].y / 25.4 * this.DPI;
            m.scene_pos['control-points'].forEach(p => {
              stroke.coordinates.push({x: p.x / 25.4 * this.DPI, y: p.y / 25.4 * this.DPI});
            });
            break;
          case "length":
            stroke.type = "length";
            stroke.from = {x: m.scene_pos.start.x / 25.4 * this.DPI, y: m.scene_pos.start.y / 25.4 * this.DPI}
            stroke.coordinates.push({
              x: m.scene_pos.end.x / 25.4 * this.DPI,
              y: m.scene_pos.end.y / 25.4 * this.DPI
            });
            stroke.coordinates.valueBox = m.scene_pos["value-box"]
            break;
          case "multi-length":
            stroke.type = "tapeline";
            stroke.from.x = m.scene_pos['control-points'][0].x / 25.4 * this.DPI;
            stroke.from.y = m.scene_pos['control-points'][0].y / 25.4 * this.DPI;
            m.scene_pos['control-points'].forEach(p => {
              stroke.coordinates.push({
                x: p.x / 25.4 * this.DPI,
                y: p.y / 25.4 * this.DPI
              });
            })
            stroke.coordinates.valueBox = m.scene_pos["value-box"]
            break;
        }
        this.drawShape(stroke);
        this.drawMarkArray.push(stroke);
      }
    },

    /***
     * Canvas     => One2         pen.style
     * line       => length         0
     * tapeline   => multi-length
     * angle      => angle          0
     * arrow      => arrow          1
     * ellipse    => circle         1
     * rectangle  => square         1
     * freedraw       => freedraw       1
     * */
    // Web --> One2
    getRefImage2Overlayes() {
      this.$refs.VueCanvasDrawing.images.forEach(e => {
        const data = {"style": {}};
        let coordi, coordi2;
        const scene_pos = {};
        const start = {}, end = {}
        const value_box = {};
        let dataType;
        let newArr;
        switch (e.type) {
          case "freedraw":
            newArr = e.coordinates.map(c => {
              coordi = this.getWeb2One(c.x, c.y);
              return {x: coordi.x, y: coordi.y};
            })
            scene_pos["control-points"] = newArr;
            data["style"]["brush"] = {"color": "#00ffffff"};
            dataType = "freedraw";
            break;
          case "line":
            coordi = this.getWeb2One(e.from.x, e.from.y);
            start["x"] = coordi.x;
            start["y"] = coordi.y;
            coordi = this.getWeb2One(e.coordinates[0].x, e.coordinates[0].y);
            end["x"] = coordi.x;
            end["y"] = coordi.y;
            value_box["x"] = e.coordinates[0].valueBox.x;
            value_box["y"] = e.coordinates[0].valueBox.y;
            scene_pos["start"] = start;
            scene_pos["end"] = end;
            scene_pos["value-box"] = value_box;
            data["style"]["value-box"] = {
              "brush": {"color": "#00ffffff"},
              "pen": {"cap": 32, "color": "#00ffffff", "join": 128, "style": 0, "width": 0},
              "text": {"color": "#ffffd700", "font-size": 12}
            };
            dataType = "length";
            break;
          case "tapeline":
            break;
          case "angle":
            break;
          case "arrow":
            coordi = this.getWeb2One(e.from.x, e.from.y);
            start["x"] = coordi.x;
            start["y"] = coordi.y;
            coordi = this.getWeb2One(e.coordinates[0].x, e.coordinates[0].y);
            end["x"] = coordi.x;
            end["y"] = coordi.y;
            scene_pos["start"] = start;
            scene_pos["end"] = end;
            data["style"]["brush"] = {"color": "#00ffffff"};
            dataType = "arrow";
            break;
          case "circle":
            coordi = this.getWeb2One(e.coordinates[0].x - e.coordinates[1].x, e.coordinates[0].y - e.coordinates[1].y);
            coordi2 = this.getWeb2One(e.coordinates[0].x + e.coordinates[1].x, e.coordinates[0].y + e.coordinates[1].y);
            scene_pos["bottom"] = coordi2.y;
            scene_pos["left"] = coordi.x;
            scene_pos["right"] = coordi2.x;
            scene_pos["top"] = coordi.y;
            data["style"]["brush"] = {"color": "#00ffffff"};
            dataType = "ellipse";
            break;
          case "square":
            // from:: 시작점, left - top
            coordi = this.getWeb2One(e.coordinates[3].x, e.coordinates[3].y);
            coordi2 = this.getWeb2One(e.coordinates[1].x, e.coordinates[1].y);
            scene_pos["bottom"] = coordi2.y;
            scene_pos["left"] = coordi.x;
            scene_pos["right"] = coordi2.x;
            scene_pos["top"] = coordi.y;
            data["style"]["brush"] = {"color": "#00ffffff"};
            dataType = "rectangle";
            break;
        }

        if (e.coordinates.length !== 0) {
          // 1. scene_pos
          data["scene_pos"] = scene_pos;
          // 2. style
          data["style"]["pen"] = {
            "cap": 32,
            "color": '#ff' + e.color.substring(1),
            "join": 128,
            "style": 1,
            "width": e.width
          };
          // 3. transformation
          data["transformation"] = {"rot_deg": 0};
          // 4. type
          data["type"] = dataType;
          this.overlayes.push(data);
        }
      })
    },

    ...mapActions([
      Constant.GET_PATIENTRECORDLIST,
      Constant.GET_PATIENTSERIESLIST,
    ]),
  }
}
</script>

<style>
#canvas {
  border: 1px solid black;
}

.baseHeaderView {
  background-color: black;
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
}

.baseUtilityView {
  /* debug용 */
  background-color: orange;
  /*background-color: black;*/
  height: 100%;
  width: 100%;
  position: relative;
  /*justify-content: flex-start;*/
  /*overflow: auto;*/

  justify-content: center;
  overflow: hidden;
}

.information {
  position: absolute;
  left: 10px;
  top: 10px;

  text-shadow: 1px 0 1px #000;
  font-family: MalgunGothic;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: -0.64px;
  color: #fff;
}

.isToggle {
  border: solid 2px blue;
}
</style>