<template>
  <div class="baseHeaderView">
    <div class="utilityView">
      <!-- 1 -->
      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in first" :key="k"
            @click="checkedToggling(first, k, v), changedStrokeType(s)"
            :class="{isToggle:v && disable}"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <!-- 2 -->
      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in second" :key="k"
            @click="checkedToggling(second, k, v), changedStrokeType(k), changedEvent(k)"
            :class="{isToggle:v && disable}">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
          <!-- ({'name' : k, 'state' : v }, inverse)-->
        </div>
      </div>
      <div class="line"></div>

      <!-- 3 -->
      <div class="itemBox">
        <div
            class="item bar"
            v-for="(v, k) in third" :key="k"
            @click="checkedToggling(third, k, v), changedStrokeType(k)"
            :class="{isToggle:!v && disable}"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
        <div><input type="color" class="item" v-model="lineColor"/></div>
        <select class="colorSelect same" v-model="lineWidth">
          <option v-for="n in 25" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <div class="line"></div>

      <!-- 4 -->
      <div class="itemBox">
        <div
            class="item"
            v-for="(k, i) in fourth" :key="k"
            @click="changedEvent(i)"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <!-- 5 -->
      <div class="itemBox">
        <div class="implant">
          <img src="@/assets/img/utils/icon-implant.png"/>
          <span class="same">임플란트 식립</span>
        </div>
        <!--<div
            class="item"
            v-for="(v, k) in fifth" :key="k"
            @click="fifth[k] = !v"
            :class="{isToggle:v}"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>-->
      </div>
      <div class="line"></div>
      <!-- 6 -->
      <!--<div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in sixth" :key="k"
            @click="sixth[k] = !v"
            :class="{isToggle:v}"
        >
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>-->

      <!-- 7 -->
      <span class="same" style="padding: 0 0 0 3px;">초기화</span>
      <div class="itemBox">
        <button class="item bar same" @click.prevent="$refs.VueCanvasDrawing.undo()">Undo</button>
        <button class="item bar same" @click.prevent="$refs.VueCanvasDrawing.redo()">Redo</button>
        <button class="item bar same" @click.prevent="save">save</button>

        <!-- 회전 초기화-->
        <button class="item bar same" @click="clearView">뷰</button>
        <!-- 회전, 그림 초기화-->
        <button class="item bar same" @click="clearView" @click.prevent="$refs.VueCanvasDrawing.reset()">전체</button>
      </div>
    </div>
    <div class="baseUtilityView">

      <div class="mainPrintView" id="canvas"
           @mousedown="startMoving($event)"
           @mousemove="moveImage($event)"
           @mouseup="endMoving"
           @mouseleave="endMoving"
      >
        <img :src="mainImg" :class="{ sharpen:second['sharpen'] }" class="mainImg utilityEvent"/>

        <VueDrawingCanvas
            ref="VueCanvasDrawing"
            v-model:image="image"
            :stroke-type="strokeType"
            :fill-shape="fillShape"
            :backgroundImage="backgroundImage"
            :height="canvasFullHeight"
            :width="canvasFullWidth"
            :lock="lock"
            :color=lineColor
            :lineWidth=lineWidth
            @mousedown="downFlag = !downFlag, startCoordinate($event)"
            @mousemove="changedMouseEvent($event)"
            @mouseup="downFlag = !downFlag, endCoordinate($event)"
            @wheel="changedScale"
            saveAs="png"
            line-cap="round"
            line-join="round"
            :initial-image="initialImage"
            classes="canvasEvent"
            :styles="{
            }"
        />
      </div>

      <div class="thumbnail" :class="{ thumbList:btnchg }">
        <div class="filterBtns" :class="{ filterCng:btnchg }">
          <div>
          <span class="filterName">Date {{ brightness }}
          </span>
            <select class="filterSelect">
              <option>All</option>
            </select>
          </div>
          <div>
            <span class="filterName">Modality</span>
            <select class="filterSelect">
              <option>All</option>
            </select>
          </div>
        </div>
        <div id="thumbnailList" class="thumbnailList" :class="{ ListCng:btnchg }">
          <div class="thumbnailBtn" @click="btnchg = !btnchg"> {{ btnchg ? "▲" : "▼" }} Thumbnail {{ x }}
            {{ y }} {{ scale }}
          </div>
          <div id="thumbnails" class="thumbnails" :class="{ thumbnailsCng:btnchg }">
            <div id="imgBox" class="imgBox"
                 @click="showInfo(node, $event)"
                 v-for="(node, i) in imageArr"
                 :key="i">
              <img class="imgs" :src="node.images" style="pointer-events: none;" alt=""/>

              <div v-if="first.info" class="info">
                데이터 전처리 필요 <br>
                Chart Id:: {{ dataInfo.chartId }} <br>
                Unix Time:: {{ dataInfo.time }} <br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/utility.css';
import {xmlToJson} from '@/assets/js/x2j.js';

import axios from "axios";
import drf from '@/api/drf';
// import {}
import {mapGetters, mapActions} from 'vuex';
import Constant from "@/common/Constant.js";
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  name: 'BaseUtilityView',

  components: {
    VueDrawingCanvas,
  },

  props: {},

  data: () => ({
    // disable: true,
    disable: false,
    rated: 0,

    // Save marker
    overlayes: [],
    // Canvas
    canvasFullWidth: 0,
    canvasFullHeight: 0,
    pictureHeightSize: 0,
    pictureWidthSize: 0,
    bindingWidthImg: 160,
    // 0, 0 coordinate set
    coorWidth: 0,
    coorHeight: 0,
    // halfHeight
    halfHeight: 0,

    // 모든 마커 정보
    strokes: [],

    // utility ===================================================
    lock: true,
    // 1
    imageArr: [],
    dataInfo: {},

    // 1-1
    mouseFlag: false,
    startTop: 0,
    startLeft: 0,
    movingTop: 0,
    movingLeft: 0,
    // 1-2
    scale: 1.0,
    // 1-3
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,

    // 2
    brightness: 100,
    inverse: 0,
    // 3
    lineColor: '#FF0000',
    lineWidth: 1,
    // 4
    ang: 0,
    rotX: 0,
    rotY: 0,

    // 1 f
    first: {
      pan: false,
      zoom: false,
      info: false
    },
    // 2 s
    second: {
      bright: false,
      inverse: false,
      sharpen: false,
      ruler: false,
      tapeline: false,
      angle: false,
      arrow: false,
      shape: false,
      rectangle: false,
    },
    // 3 t
    third: {draw: true, nerve: true},
    // 4 o
    fourth: ['01', '02', '03', '04'],
    // 5 i
    // fifth: {'implant-01': false, 'implant-02': false, pontic: false},
    // 6 x
    // sixth: {'select-capture': false, 'full-screen-capture': false, 'window-capture': false},

    // base ===================================================
    // canvas height, width
    fullHeight: 0,
    fullWidth: 0,
    halfWidth: 0,

    // thumbnail static width
    thumbnailsWidth: 0,

    preImage: '',
    btnchg: false,

    mainImg: 'https://png.pngtree.com/background/20210714/original/pngtree-pure-black-dark-background-wallpaper-picture-image_1218983.jpg',

    // canvas
    initialImage: [
      {
        type: "dash",
        from: {
          x: 262,
          y: 154,
        },
        coordinates: [],
        color: '#FF0000',
        width: 1,
        fill: false,
      },
    ],

    downFlag: false,
    x: 0,
    y: 0,
    preX: 0,
    preY: 0,
    image: "",
    strokeType: "dash",
    fillShape: false,
    backgroundImage: null,
  }),

  mounted() {
    this.fullHeight = document.getElementById('canvas').clientHeight;
    this.fullWidth = document.getElementById('canvas').clientWidth;
    this.halfHeight = this.fullHeight / 2;
    this.coorWidth = this.fullWidth / 2;
    this.coorHeight = this.fullHeight;

    this.canvasFullWidth = this.fullWidth;
    this.canvasFullHeight = this.fullHeight * 2;
    this.thumbnailsWidth = document.getElementById('thumbnailList').clientWidth;
    if ("vue-drawing-canvas" in window.localStorage) {
      this.initialImage = JSON.parse(
          window.localStorage.getItem("vue-drawing-canvas")
      );
    }
  },

  computed: {
    ...mapGetters([
      'patientSeriesList',
    ]),
  },

  watch: {
    patientSeriesList: {
      deep: true,
      handler() {
        this.mainImg = 'https://png.pngtree.com/background/20210714/original/pngtree-pure-black-dark-background-wallpaper-picture-image_1218983.jpg';
        this.imageArr = [];

        const ch = this.patientSeriesList.chartId;
        this.patientSeriesList.entity.forEach(async e => {
          // create time
          const cr = e.Created;

          // image
          const url = await axios({
            url: drf.patient.patientImgFileDownload(e.UniqueID),
            method: 'get',
            // headers: {
            //   "Content-Type": "multipart/form-data"
            // }
            responseType: 'blob',
          })
          const im = URL.createObjectURL(new Blob([url.data], {type: 'image/bmp'}));

          const dr = await axios({
            url: drf.patient.drawImage(e.UniqueID),
            method: 'get',
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })

          let pw, ph, yRate;
          // xml to json
          let XmlNode = new DOMParser().parseFromString(e.Tags, "text/xml");
          const json = xmlToJson(XmlNode);
          pw = json.tags.tags[0].tag[0]["@attributes"].value;
          ph = json.tags.tags[0].tag[1]["@attributes"].value;
          console.log(pw, ph);
          yRate = this.fullHeight / (ph * e.PixelSpacingH);
          this.pictureHeightSize = this.fullHeight;
          this.pictureWidthSize = (pw / ph * this.fullHeight);
          const h = e.PixelSpacingH;
          const v = e.PixelSpacingV;

          // 이미지 마다 다른 것
          this.imageArr.push({
            // 차트ID
            chartId: ch,
            // 마커 정보
            images: im,
            // 마커 파일
            drawMark: dr,
            // 생성 일자
            create: cr,
            // 너비
            pw: pw,
            // 높이
            ph: ph,
            // 픽셀스페이싱 높이
            PixelSpacingH: h,
            // 픽셀스페이싱 너비
            PixelSpacingW: v,
            // y 비율:: one2 to web rate: 512 * pixcelspacing : fullHeight
            one2webRate: yRate,
            // 마커 배열
            overl: dr.data.overlaies,
          })
        })

        // this.imageArr = [];
        // this.mainImg = ' ';
        // this.patientSeriesList.forEach(async instanceID => {
        //   const url = await axios({
        //     url: drf.patient.patientImgFileDownload(instanceID),
        //     method: 'get',
        //     // headers: {
        //     //   "Content-Type": "multipart/form-data"
        //     // }
        //     responseType: 'blob',
        //   })
        //   const re = URL.createObjectURL(new Blob([url.data], {type: 'image/bmp'}));
        //   this.imageArr.push(re);
        // })
      }
    }
  },

  created() {
  },

  methods: {
    // Button Toggle checked
    // Refactoring 완료
    checkedToggling(idx, name, bool) {
      if (this.disable) {
        console.log(name, idx[name])
        if (idx[name] === bool) {
          this.first.pan = false;
          this.second.bright = false;
          this.second.ruler = false;
          this.second.tapeline = false;
          this.second.angle = false;
          this.second.arrow = false;
          this.second.shape = false;
          this.second.rectangle = false;
          this.third.draw = true;
          this.third.nerve = true;
          idx[name] = !bool;
        }
      }
    },

    // utility ===================================================
    // 1-1
    startMoving(e) {
      if (this.first.pan && !this.mouseFlag) {
        this.startTop = e.screenY;
        this.startLeft = e.screenX;
        this.mouseFlag = true;
      }
    },
    moveImage(e) {
      if (this.first.pan && this.mouseFlag) {
        this.movingTop += e.screenY - this.startTop;
        this.startTop = e.screenY;
        this.movingLeft += e.screenX - this.startLeft;
        this.startLeft = e.screenX;
      }
    },
    endMoving() {
      if (this.first.pan && this.mouseFlag) {
        this.mouseFlag = false;
      }
    },

    // 1-2
    changedScale(e) {
      if (this.first.zoom) {
        const rate = 0.002;
        if (e.deltaY > 0 && this.scale >= 0.5 + rate) this.scale -= rate;
        else if (e.deltaY < 0 && this.scale <= 2.0 - rate) this.scale += rate;
      }
    },

    // 1-3
    async showInfo(node, e) {
      // debug용
      this.disable = true;

      if (this.preImage !== '') {
        this.preImage.setAttribute('style', '');
      }
      this.bindingWidthImg = 156;
      this.mainImg = node.images;
      // this.mainImg = 'https://png.pngtree.com/background/20210714/original/pngtree-pure-black-dark-background-wallpaper-picture-image_1218983.jpg';
      e.target.setAttribute('style', 'border: 2px solid blue');
      this.preImage = e.target;

      this.pS = node.PixelSpacingH;
      this.pW = node.pw;
      this.dataInfo = {
        'chartId': node.chartId,
        'time': node.create,
      }

      this.rated = node.one2webRate;
      // 마커 배열, y축 이미지 비율 크기, 팬 타입
      this.importImageDrawing(node.overl);
    },

    // 2-4
    startCoordinate(e) {
      if (this.second.ruler) {
        this.getCoordinate(e);
        this.startX = this.x;
        this.startY = this.y;
      }
    },
    endCoordinate(e) {
      if (this.second.ruler) {
        this.getCoordinate(e);
        this.endX = this.x;
        this.endY = this.y;
        this.getDistance([this.getWeb2One({x: this.startX, y: this.startY}),
          this.getWeb2One({x: this.endX, y: this.endY})]);
      }
    },
    getDistance(arr) {
      // const rate = this.pW / this.fullHeight;
      // const pixelSpacing = 0.10000000149011612;
      const pixelSpacing = this.pS;
      let distance = 0;
      let x = arr[0].x;
      let y = arr[0].y;
      arr.forEach(a => {
        distance += Math.pow(Math.pow(y - a.y, 2) + Math.pow(x - a.x, 2), 0.5) * pixelSpacing * 10;
        x = a.x;
        y = a.y;
      });
      // Number.EPSILON = 오차없이 나타낼수 있는 가장 작은 양의 수, 부동 소수점 오차를 보정
      distance = Math.round((distance + Number.EPSILON) * 100) / 100;
      return distance.toFixed(2) + ' mm';
    },
    getAngle(x1, y1, x2, y2) {
      let rad = Math.atan2(y2 - y1, x2 - x1);
      console.log(x1, y1, x2, y2);
      console.log(x2 - x1);
      console.log(y2 - y1);
      console.log('angle' + (rad * 180) / Math.PI);
      return (rad * 180) / Math.PI;
    },

    /* angle = this.getAngle(m.scene_pos.vertex.x, m.scene_pos.vertex.y,
        m.scene_pos.side2.x, m.scene_pos.side2.y) -
    this.getAngle(m.scene_pos.vertex.x, m.scene_pos.vertex.y,
        m.scene_pos.side1.x, m.scene_pos.side1.y);
    if (angle > 180) angle = 360 - angle;
    else if (angle < 0) angle *= -1;*/

    // 2-1, 2-3
    changedMouseEvent(e) {
      if (this.downFlag && this.second.bright) {
        this.lock = this.second.bright;
        this.cnt++;
        this.preX = this.x;
        this.preY = this.y;
        this.getCoordinate(e);
        if (this.preX < this.x || this.preY < this.y) {
          this.brightness += 2;
        } else if (this.preX > this.x || this.preY > this.y) {
          this.brightness -= 2;
        }
      }
    },

    // event
    // 2-2, 4-1, 4-2, 4-3, 4-3
    changedEvent(e) {
      if (this.disable) {
        if (e === 'inverse') {
          // Change Inverse
          // 2-2
          if (this.second[e] === true) this.inverse = 100;
          else this.inverse = 0;
        } else {
          // Change Angle
          // 4-1, 4-2, 4-3, 4-4
          // @click="utilityEvent(i), send({'name' : k, 'state' : i }, [ang, rotX, rotY])"
          if (e === 0) {
            this.ang = (this.ang + 90) % 360
          } else if (e === 1) {
            if (this.ang === 0) this.ang = 360;
            this.ang = (this.ang - 90) % 360
          } else if (e === 2) {
            if (this.ang === 90 || this.ang === 270) {
              this.rotX = (this.rotX % 360) + 180;
            } else {
              this.rotY = (this.rotY % 360) + 180;
            }
          } else if (e === 3) {
            if (this.ang === 0 || this.ang === 180) {
              this.rotX = (this.rotX % 360) + 180;
            } else {
              this.rotY = (this.rotY % 360) + 180;
            }
          }
        }
      }
    },

    // 2-4, 2-8, 2-9, 3-1
    changedStrokeType(s) {
      if (this.disable) {
        if (s === 'zoom' || s === 'info') {
          this.lock = false;
        } else if (s === 'ruler') {
          this.strokeType = 'line';
          this.lock = !this.second.ruler;
        } else if (s === 'arrow') {
          this.strokeType = 'arrow';
          this.lock = !this.second.arrow;
        } else if (s === 'shape') {
          this.strokeType = 'circle';
          this.lock = !this.second.shape;
        } else if (s === 'rectangle') {
          this.strokeType = 'square';
          this.lock = !this.second.rectangle;
        } else if (s === 'draw') {
          this.strokeType = 'dash';
          this.lock = this.third.draw;
        } else {
          this.lock = true;
        }
      }
    },

    // 7-1, 7-2
    clearView() {
      this.first.pen = false;
      this.first.zoom = false;
      this.first.info = false;

      this.second.bright = false;
      this.second.inverse = false;
      this.second.sharpen = false;

      this.scale = 1.0;

      this.brightness = 100;
      this.inverse = 0;

      this.ang = 0;
      this.rotX = 0;
      this.rotY = 0;
    },

    /***
     * One2       => Canvas,  pen.style
     * freedraw   => dash       1
     * arrow      => line       1
     * length     => line       0
     * angle      => line       0
     * rectangle  => square     1
     * ellipse    => circle     1
     * */
    // One2 --> Web
    importImageDrawing(d) {
      let canvas = document.querySelector('#VueDrawingCanvas');
      const context = this.context ? this.context : canvas.getContext('2d');
      let coordi, coordi2;
      let distance;
      let angle;
      d.forEach(async m => {
        console.log('importImageDrawing data');
        console.log(m);
        this.lineColor = '#' + m.style.pen.color.substring(3, 9);
        this.lineWidth = m.style.pen.width;
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
        };

        console.log(m.type);
        switch (m.type) {
          case "freedraw":
            stroke.type = "dash";
            coordi = this.getOne2Web(m.scene_pos['control-points'][0].x, m.scene_pos['control-points'][0].y);
            stroke.from.x = coordi.x;
            stroke.from.y = coordi.y;
            m.scene_pos['control-points'].forEach(p => {
              coordi = this.getOne2Web(p.x, p.y);
              stroke.coordinates.push({x: coordi.x, y: coordi.y});
            })
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "length":
            stroke.type = "line";
            coordi = this.getOne2Web(m.scene_pos.start.x, m.scene_pos.start.y);
            stroke.from.x = coordi.x;
            stroke.from.y = coordi.y;
            coordi = this.getOne2Web(m.scene_pos.end.x, m.scene_pos.end.y);
            stroke.coordinates.push({x: coordi.x, y: coordi.y, valueBox: m.scene_pos["value-box"]});
            coordi = this.getOne2Web(m.scene_pos["value-box"].x, m.scene_pos["value-box"].y);
            distance = this.getDistance([{x: m.scene_pos.start.x, y: m.scene_pos.start.y},
              {x: m.scene_pos.end.x, y: m.scene_pos.end.y}]);
            // 단위 표시하기
            context.font = "15px serif"
            context.textAlign = "start"
            context.textBaseline = "alphabetic";
            context.fillStyle = "#ffff00";
            context.fillText(distance, coordi.x, coordi.y);
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            // 선과 단위 잇기, 구현 중
            break;
          case "multi-length":
            stroke.type = "tapeline";
            coordi = this.getOne2Web(m.scene_pos['control-points'][0].x,
                m.scene_pos['control-points'][0].y);
            stroke.from.x = coordi.x;
            stroke.from.y = coordi.y;
            m.scene_pos['control-points'].forEach(p => {
              coordi = this.getOne2Web(p.x, p.y);
              stroke.coordinates.push({x: coordi.x, y: coordi.y});
            })

            console.log(m.scene_pos["value-box"]);
            coordi = this.getOne2Web(m.scene_pos["value-box"].x,
                m.scene_pos["value-box"].y);
            distance = this.getDistance(m.scene_pos['control-points']);
            // 단위 표시하기
            context.font = "15px serif"
            context.textAlign = "start"
            context.textBaseline = "alphabetic";
            context.fillStyle = "#ffff00";
            context.fillText(distance, coordi.x, coordi.y);
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "angle":
            stroke.type = "angle";
            coordi = this.getOne2Web(m.scene_pos.side1.x, m.scene_pos.side1.y);
            stroke.coordinates.push({x: coordi.x, y: coordi.y});
            coordi = this.getOne2Web(m.scene_pos.side2.x, m.scene_pos.side2.y);
            stroke.coordinates.push({x: coordi.x, y: coordi.y});
            angle = this.getAngle(m.scene_pos.vertex.x, m.scene_pos.vertex.y,
                    m.scene_pos.side2.x, m.scene_pos.side2.y) -
                this.getAngle(m.scene_pos.vertex.x, m.scene_pos.vertex.y,
                    m.scene_pos.side1.x, m.scene_pos.side1.y);
            if (angle > 180) angle = 360 - angle;
            else if (angle < 0) angle *= -1;
            coordi = this.getOne2Web(m.scene_pos.vertex.x, m.scene_pos.vertex.y);
            stroke.from.x = coordi.x;
            stroke.from.y = coordi.y;
            angle = (Math.round((angle + Number.EPSILON) * 100) / 100).toFixed(2) + ' °';

            coordi = this.getOne2Web(m.scene_pos["value-box"].x, m.scene_pos["value-box"].y);
            context.font = "15px serif"
            context.textAlign = "start"
            context.textBaseline = "alphabetic";
            context.fillStyle = "#ffff00";
            context.fillText(angle, coordi.x, coordi.y);
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "arrow":
            stroke.type = "arrow";
            coordi = this.getOne2Web(m.scene_pos.start.x, m.scene_pos.start.y);
            stroke.from.x = coordi.x;
            stroke.from.y = coordi.y;
            coordi = this.getOne2Web(m.scene_pos.end.x, m.scene_pos.end.y);
            stroke.coordinates.push({x: coordi.x, y: coordi.y});
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "rectangle":
            stroke.type = "square";
            coordi = this.getOne2Web(m.scene_pos.left, m.scene_pos.top);
            stroke.from.x = coordi.x;
            stroke.from.y = coordi.y;
            coordi2 = this.getOne2Web(m.scene_pos.right, m.scene_pos.bottom);
            stroke.coordinates.push({x: coordi2.x, y: coordi.y},
                {x: coordi2.x, y: coordi2.y},
                {x: coordi.x, y: coordi2.y},
                {x: coordi.x, y: coordi.y});
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "ellipse":
            stroke.type = "circle";

            break;
        }
      })
    },

    // (My) Web --> One2
    async save() {
      // sharpen, windowing 수정 필요
      await this.getRefImage2Overlayes();
      var data = {
        "manipulate": {"effect": {"invert": this.second.inverse, "sharpen": 0}, "windowing": {"wc": 1000, "ww": 4000}},
        "overlaies": this.overlayes
      }

      /*var data = {
        "manipulate": {"effect": {"invert": false, "sharpen": 0}, "windowing": {"wc": 1000, "ww": 4000}},
        "overlaies": [{
          "scene_pos": {
            "end": {"x": 0.21756374261872313, "y": 20.378470558620378},
            "start": {"x": 0.50764873277702005, "y": -12.038527091569339}
          },
          "style": {
            "brush": {"color": "#00ffffff"},
            "pen": {"cap": 32, "color": "#ff0000ff", "join": 128, "style": 1, "width": 1}
          },
          "transformation": {"rot_deg": 0},
          "type": "freedraw"
        }]
      }*/

      // const obj = JSON.parse(json);
      const s = JSON.stringify(data);
      // console.log(s);
      axios({
        // url: drf.patient.saveDrwingMarker('1.2.410.200062.2.1.20221013134141642.12.62098.726.713'),
        url: drf.patient.saveDrwingMarker('1.2.410.200062.2.1.20221222144825737.86.125615.843.799'),
        method: 'post',
        data: s
      })


      // const link = document.createElement('a');
      // link.download = 'param'; // filename
      // link.href = this.image;
      // link.click();
    },


    // async setImage(event) {
    //   let URL = window.URL;
    //   this.backgroundImage = URL.createObjectURL(event.target.files[0]);
    //   await this.$refs.VueCanvasDrawing.redraw();
    // },

    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    },

    getOne2Web(coordiX, coordiY) {
      return {x: coordiX * this.rated + this.coorWidth, y: coordiY * this.rated + this.coorHeight};
    },

    getWeb2One(coordiX, coordiY) {
      return {x: (coordiX - this.coorWidth) / this.rated, y: (coordiY - this.coorHeight) / this.rated};
    },

    // Web --> One2
    // p.s. 제가 안맞추고 싶은 게 아니라 당사 네이밍 컨벤션이 이렇습니다... -정태영 사원
    getRefImage2Overlayes() {
      this.$refs.VueCanvasDrawing.images.forEach(e => {
            console.log(e);
            const data = {"style": {}};
            let coordi, coordi2;
            const scene_pos = {};
            const start = {}, end = {}
            const value_box = {};
            let dataType;
            let newArr;
            switch (e.type) {
              case "dash":
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
              case "ellipse":
                break;
              case "square":
                // from:: 시작점
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
              console.log(data);
              this.overlayes.push(data);
            }
          }
      )
    },

// base ===================================================
    ...
        mapActions([
          Constant.GET_PATIENTSERIESLIST,
        ]),
  },
}
</script>

<style>
.baseHeaderView {
  background-color: black;
  /*background-color: orange;*/
  width: 100%;
  height: 100%;
  display: flex;
}

/*  =============================================================== */
.baseUtilityView {
  /* debug용 */
  /*background-color: black;*/
  height: 718px;
  width: 100%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.info {
  top: 10px;
  left: 10px;
  text-shadow: 1px 0 1px #000;
  position: absolute;
  overflow: hidden;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: -0.64px;
  color: #fff;
}

.mainPrintView {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.mainImg {
  height: calc(1px * v-bind(fullHeight));
  width: calc(1px * v-bind(pictureWidthSize));
  position: absolute;
  top: calc(1px * v-bind(movingTop));
  left: calc(1px * (((v-bind(fullWidth) - v-bind(pictureWidthSize)) / 2) + v-bind(movingLeft)));

}

.thumbnail {
  display: flex;
  flex-direction: row;
  height: 140px;
  width: auto;
}

.filterBtns {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 148px;
  height: 140px;
  padding: 12px 16px 16px 16px;
  background-color: #d8dde8;
}

.filterName {
  margin: 0 0 4px 2px;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.7px;
  color: #545454;
}

.filterSelect {
  width: 115px;
  height: 25px;
  border-radius: 2px;
  border: solid 1px #95a1b3;
  background-color: #fff;
}

.thumbnailList {
  width: 100%;
  height: auto;
  background-color: #f4f6f9;
  display: flex;
  flex-direction: column;
}

.thumbnailBtn {
  height: 16px;
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.46px;
  text-align: center;
  cursor: pointer;
  color: #96a2b3;
}

.thumbnails {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: calc(1px * v-bind(thumbnailsWidth));
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  height: 124px;
  background-color: #f4f6f9;
}

.imgBox {
  display: flex;
  width: 160px;
  height: 90px;
  margin: 0 0 0 8px;
  /*border: solid 1px #d5dae5;*/
  background: black;
  align-items: center;
  justify-content: center;
}

.imgs {
  /*height: 86px;*/
  width: calc(1px * v-bind(bindingWidthImg));
}

/* HS */
.thumbList {
  height: 16px;
}

.ListCng {
  height: auto;
}

.filterCng {
  display: none;
}

.thumbnailsCng {
  display: none;
}

/* end */

.isToggle {
  border: solid 2px blue;
}

.utilityEvent {
  overflow: hidden;
  /* 2-1, 2-2, */
  filter: brightness(calc(1% * v-bind(brightness))) invert(calc(1% * v-bind(inverse)));

  /* 1-2, 4-1, 4-2, 4-3, 4-4 */
  transform: scale(v-bind('scale')) rotate(calc(1deg * v-bind(ang))) rotateX(calc(1deg * v-bind(rotX))) rotateY(calc(1deg * v-bind(rotY)));
}

/* 2-3 */
.sharpen {
  image-rendering: pixelated;
}

.canvasEvent {
  z-index: 10;
  border: solid 1px #FF0000;
  position: absolute;
  /*top: calc(1px * v-bind(movingTop));*/

  top: calc(-1px * (v-bind(halfHeight) - v-bind(movingTop)));
  left: calc(1px * v-bind(movingLeft));

  transform: scale(v-bind('scale')) rotate(calc(1deg * v-bind(ang))) rotateX(calc(1deg * v-bind(rotX))) rotateY(calc(1deg * v-bind(rotY)));
}
</style>
