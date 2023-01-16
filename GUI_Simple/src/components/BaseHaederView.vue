<template>
  <div class="baseHeaderView">
    <div class="utilityView">
      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in first" :key="k"
            @click="checkedToggling(first, k, v), changedStrokeType(k)"
            :class="{isToggle:v && disable}">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <div class="itemBox">
        <div
            class="item"
            v-for="(v, k) in second" :key="k"
            @click="checkedToggling(second, k, v), changedStrokeType(k), changedEvent(k)"
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
            v-for="(k, i) in fourth" :key="k"
            @click="changedEvent(i)">
          <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
        </div>
      </div>
      <div class="line"></div>

      <div class="itemBox">
        <button class="item same" @click.prevent="$refs.VueCanvasDrawing.undo()">U</button>
        <button class="item same" @click.prevent="$refs.VueCanvasDrawing.redo()">R</button>
        <button class="item same" @click.prevent="save">S</button>
        <!-- 회전 초기화-->
        <button class="item same" @click="clearView">View</button>
        <!-- 회전, 그림 초기화-->
        <button class="item same" @click="clearView" @click.prevent="$refs.VueCanvasDrawing.reset()">A</button>
        {{ x }} {{ y }}
      </div>
    </div>

    <div class="baseUtilityView" id="canvas"
         @mousedown="startMoving($event)"
         @mousemove="moveImage($event)"
         @mouseup="endMoving"
         @mouseleave="endMoving"
    >
      <VueDrawingCanvas
          ref="VueCanvasDrawing"
          v-model:image="image"
          :stroke-type="strokeType"
          :fill-shape="fillShape"
          :backgroundImage="backgroundImage"
          :height="canvasHeight"
          :width="canvasWidth"
          :lock="lock"
          :color=lineColor
          :lineWidth=lineWidth
          @mousedown="downFlag = !downFlag, startCoordinate($event)"
          @mousemove="changedMouseEvent($event), getCoordinate($event)"
          @mouseup="downFlag = !downFlag, endCoordinate($event)"
          @wheel="changedScale"
          saveAs="png"
          line-cap="round"
          line-join="round"
          :initial-image="initialImage"
          :background-image="mainImg"
          classes="canvasEvent"
          :styles="{ }"
      />
      <!--
          :height="500"
          :width="500"
           -->
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
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  name: 'BaseUtilityView',

  components: {
    VueDrawingCanvas,
  },

  props: {},

  data: () => ({
    tempOverlaies: "",
    tempImage: "",

    // disable: true,
    disable: false,
    rated: 0,

    // Save marker
    overlayes: [],

    // Canvas
    // cSize
    canvasHeight: 0,
    canvasWidth: 0,
    canvasMaxSize: 0,

    // dSize
    // sSize
    // mm -> px
    imageHeight: 1,
    imageWidth: 1,

    // 0, 0 coordinate set
    maginTop: 0,
    maginLeft: 0,

    // reSizeScale
    reSizeScale: 1,


    // utility ===================================================
    lock: true,
    // 1
    imageArr: [],

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
    },
    // 2 s
    second: {
      bright: false,
      inverse: false,
      sharpen: false,
      ruler: false,
      tapeline: false,
      draw: false
    },
    // 4 o
    fourth: ['01', '02', '03', '04'],

    preImage: '',
    btnchg: false,

    mainImg: require('@/assets/img/board.png'),

    // canvas
    initialImage: [{
      type: "dash",
      from: {
        x: 262,
        y: 154,
      },
      coordinates: [],
      color: '#FF0000',
      width: 1,
      fill: false,
    }],

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
    window.addEventListener('resize', this.handleResize);
    const canvas = document.getElementById('canvas');
    this.canvasHeight = canvas.clientHeight;
    this.canvasWidth = canvas.clientWidth;
    this.canvasMaxSize = Math.max(this.canvasWidth, this.canvasHeight);

    /*if ("vue-drawing-canvas" in window.localStorage) {
      this.initialImage = JSON.parse(
          window.localStorage.getItem("vue-drawing-canvas")
      );
    }*/
  }, computed: {
    ...mapGetters([
      'patientSeriesList',
    ]),
  },

  watch: {
    patientSeriesList: {
      deep: true,
      handler() {
        this.imageArr = [];

        const ch = this.patientSeriesList.chartId;
        this.patientSeriesList.entity.forEach(async e => {
          const cr = e.Created;
          // image
          const url = await axios({
            url: drf.patient.patientImgFileDownload(e.UniqueID),
            method: 'get',
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

          // xml to json
          let XmlNode = new DOMParser().parseFromString(e.Tags, "text/xml");
          const json = xmlToJson(XmlNode);
          this.imageHeight = (json.tags.tags[0].tag[1]["@attributes"].value * e.PixelSpacingH) / 25.4 * 96;
          this.imageWidth = (json.tags.tags[0].tag[0]["@attributes"].value * e.PixelSpacingV) / 25.4 * 96;

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
            pw: this.imageHeight,
            // 높이
            ph: this.imageWidth,
            // 마커 배열
            overl: dr.data.overlaies,
          })

          this.disable = true;

          this.tempOverlaies = dr.data.overlaies;
          this.tempImage = im;
          // 마커 배열, y축 이미지 비율 크기, 팬 타입
          await this.importImageDrawing();
        })
      }
    }
  },

  created() {
  },

  methods: {
    async handleResize() {
      let canvas = document.getElementById('canvas');
      this.canvasHeight = canvas.clientHeight;
      this.canvasWidth = canvas.clientWidth;

      await this.importImageDrawing()
      console.log(this.imageArr[0].overl);
    },

    checkedToggling(idx, name, bool) {
      if (this.disable) {
        console.log(name, idx[name])
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
        console.log('call');
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
      let distance = 0;
      let x = arr[0].x;
      let y = arr[0].y;
      arr.forEach(a => {
        distance += Math.pow(Math.pow(y - a.y, 2) + Math.pow(x - a.x, 2), 0.5);
        x = a.x;
        y = a.y;
      });
      // Number.EPSILON = 오차없이 나타낼수 있는 가장 작은 양의 수, 부동 소수점 오차를 보정
      distance = Math.round((distance + Number.EPSILON) * 100) / 100;
      return distance.toFixed(2);
    },

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
    async changedEvent(e) {
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
        if (s === 'zoom') {
          this.lock = false;
        } else if (s === 'ruler') {
          this.strokeType = 'line';
          this.lock = !this.second.ruler;
        } else if (s === 'draw') {
          this.strokeType = 'dash';
          this.lock = !this.second.draw;
        } else {
          this.lock = true;
        }
      }
    },

    // 7-1, 7-2
    clearView() {
      this.first.pen = false;
      this.first.zoom = false;

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
     * One2         => Canvas  pen.style
     * length       => line       0
     * multi-length => tapeline
     * angle        => line       0
     * arrow        => line       1
     * ellipse      => circle     1
     * rectangle    => square     1
     * freedraw     => dash       1
     * */
    // One2 --> Web
    async importImageDrawing() {
      let canvas = document.querySelector('#VueDrawingCanvas');
      const context = this.context ? this.context : canvas.getContext('2d');
      this.mainImg = this.tempImage;
      let distance;
      // context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      context.save();
      this.reSizeScale = Math.min(this.canvasHeight / this.imageHeight, this.canvasWidth / this.imageWidth);
      // context.transform(this.reSizeScale, 0, 0, this.reSizeScale, this.canvasWidth / this.reSizeScale / 2.0, this.canvasHeight / this.reSizeScale / 2.0)
      context.scale(this.reSizeScale, this.reSizeScale);
      context.translate(this.canvasWidth / this.reSizeScale / 2.0, this.canvasHeight / this.reSizeScale / 2.0);
      context.rotate((Math.PI / 180) * this.ang);
      // context.translate(this.imageWidth / -2.0, this.imageHeight / -2.0);
      await this.$refs.VueCanvasDrawing.redraw();
      context.restore();

      for (const m of this.tempOverlaies) {
        // 스케일
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
        };

        switch (m.type) {
          case "freedraw":
            stroke.type = "dash";
            stroke.from.x = m.scene_pos['control-points'][0].x / 25.4 * 96;
            stroke.from.y = m.scene_pos['control-points'][0].y / 25.4 * 96;
            m.scene_pos['control-points'].forEach(p => {
              stroke.coordinates.push({x: p.x / 25.4 * 96, y: p.y / 25.4 * 96});
            })
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "length":
            console.log('call by length');
            stroke.type = "line";
            stroke.from.x = m.scene_pos.start.x / 25.4 * 96;
            stroke.from.y = m.scene_pos.start.y / 25.4 * 96;
            stroke.coordinates.push({
              x: m.scene_pos.end.x / 25.4 * 96,
              y: m.scene_pos.end.y / 25.4 * 96,
              valueBox: m.scene_pos["value-box"]
            });
            distance = this.getDistance([{x: m.scene_pos.start.x, y: m.scene_pos.start.y},
              {x: m.scene_pos.end.x, y: m.scene_pos.end.y}]);
            console.log(m.scene_pos.start.x);
            // 단위 표시하기
            context.save();
            this.reSizeScale = Math.min(this.canvasHeight / this.imageHeight, this.canvasWidth / this.imageWidth);
            context.scale(this.reSizeScale, this.reSizeScale);
            context.translate(this.canvasWidth / this.reSizeScale / 2.0, this.canvasHeight / this.reSizeScale / 2.0);
            context.font = "10px serif"
            context.textAlign = "start"
            context.textBaseline = "alphabetic";
            context.fillStyle = "#ffff00";
            context.fillText(distance + ' mm', m.scene_pos["value-box"].x / 25.4 * 96, m.scene_pos["value-box"].y / 25.4 * 96);
            context.restore();
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
          case "multi-length":
            stroke.type = "tapeline";
            stroke.from.x = m.scene_pos['control-points'][0].x / 25.4 * 96;
            stroke.from.y = m.scene_pos['control-points'][0].y / 25.4 * 96;
            m.scene_pos['control-points'].forEach(p => {
              stroke.coordinates.push({x: p.x / 25.4 * 96, y: p.y / 25.4 * 96});
            })
            distance = this.getDistance(m.scene_pos['control-points']);
            // 단위 표시하기
            context.save();
            this.reSizeScale = Math.min(this.canvasHeight / this.imageHeight, this.canvasWidth / this.imageWidth);
            context.scale(this.reSizeScale, this.reSizeScale);
            context.translate(this.canvasWidth / this.reSizeScale / 2.0, this.canvasHeight / this.reSizeScale / 2.0);
            context.font = "10px serif"
            context.textAlign = "start"
            context.textBaseline = "alphabetic";
            context.fillStyle = "#ffff00";
            context.fillText(distance + ' mm', m.scene_pos["value-box"].x / 25.4 * 96, m.scene_pos["value-box"].y / 25.4 * 96);
            context.restore();
            this.$refs.VueCanvasDrawing.drawShape(context, stroke, false);
            this.$refs.VueCanvasDrawing.images.push(stroke);
            break;
        }
      }
    },

    // Web --> One2
    async save() {
      await this.getRefImage2Overlayes();
      var data = {
        "manipulate": {"effect": {"invert": this.second.inverse, "sharpen": 0}, "windowing": {"wc": 1000, "ww": 4000}},
        "overlaies": this.overlayes
      }

      // const obj = JSON.parse(json);
      const s = JSON.stringify(data);
      axios({
        url: drf.patient.saveDrwingMarker('1.2.410.200062.2.1.20221222144825737.86.125615.843.799'),
        method: 'post',
        data: s
      })
    },

    // async setImage(event) {
    //   let URL = window.URL;
    //   this.backgroundImage = URL.createObjectURL(event.target.files[0]);
    //   await this.$refs.VueCanvasDrawing.redraw();
    // },

    getCoordinate(event) {
      if (this.disable) {
        let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
        this.x = coordinates.x;
        this.y = coordinates.y;
      }
    },

    getWeb2One(coordiX, coordiY) {
      return {x: (coordiX - this.maginLeft) / this.rated, y: (coordiY - this.canvasHeight) / this.rated};
    },

    /***
     * Canvas     => One2         pen.style
     * line       => length         0
     * tapeline   => multi-length
     * angle      => angle          0
     * arrow      => arrow          1
     * ellipse    => circle         1
     * rectangle  => square         1
     * dash       => freedraw       1
     * */
    // Web --> One2
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
          console.log(data);
          this.overlayes.push(data);
        }
      })
    },

    ...mapActions([
      Constant.GET_PATIENTSERIESLIST,
    ]),
  },
}
</script>

<style>
.baseHeaderView {
  background-color: black;
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
}

.baseUtilityView {
  /* debug용 */
  /*background-color: orange;*/
  background-color: black;
  height: 100%;
  width: 100%;
  position: relative;
  /*justify-content: flex-start;*/
  /*overflow: auto;*/

  justify-content: center;
  overflow: hidden;
}

.isToggle {
  border: solid 2px blue;
}

/* mainImg에 적용 되는 event
.mainImg {
  position: absolute;
  object-fit: contain;
  height: calc(1px * v-bind(screenHeight));
  width: calc(1px * v-bind(screenWidth));
  top: calc(1px * v-bind(movingTop));
  left: calc(1px * v-bind(movingLeft));
}

.utilityEvent {
  !*overflow: hidden;*!
  !* 2-1, 2-2, *!
  filter: brightness(calc(1% * v-bind(brightness))) invert(calc(1% * v-bind(inverse)));

  !* 1-2, 4-1, 4-2, 4-3, 4-4 *!
  transform: scale(v-bind('scale')) rotate(calc(1deg * v-bind(ang))) rotateX(calc(1deg * v-bind(rotX))) rotateY(calc(1deg * v-bind(rotY)));
}*/

/* 2-3 */
.sharpen {
  image-rendering: pixelated;
}

.canvasEvent {
  /*height: calc(1px * v-bind(canvasHeight));*/
  height: calc(v-bind(canvasHeight) * 1px);
  /*height: 500px;*/
  /*width: calc(1px * v-bind(canvasWidth));*/
  width: calc(v-bind(canvasWidth) * 1px);
  /*width: 500px;*/

  /*z-index: 10;*/
  border: solid 1px #FF0000;
  position: absolute;
  /*top: calc(-1px * (v-bind(maginTop) - v-bind(movingTop)));*/
  /*left: calc(1px * v-bind(movingLeft));*/
  top: calc(1px * v-bind(movingTop));
  left: calc(1px * v-bind(movingLeft));

  transform: scale(v-bind('scale')) rotate(calc(1deg * v-bind(ang))) rotateX(calc(1deg * v-bind(rotX))) rotateY(calc(1deg * v-bind(rotY)));
}
</style>