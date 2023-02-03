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
            v-for="(k, i) in third" :key="k"
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

    <div class="baseUtilityView" id="divCanvas">
      <canvas id="canvas"
              :width="canvasWidth"
              :height="canvasHeight">
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
    /*
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

    /*
    * canvas
    * */
    imageArr: [],
    downFlag: false,
    x: 0,
    y: 0,
    preX: 0,
    preY: 0,
    image: "",
    strokeType: "dash",
    fillShape: false,
    backgroundImage: null,

    /*
    * required drawing
    * */
    canvas: null,
    context: null,
    divCanvas: null,
    divContext: null,

    mainImg: require('@/assets/img/board.png'),
    drawMarkArray: [],
    overlaies: null,
    reSizeScale: 0,
    angle: 0,
    symmetry: 1,
    verticalSymmetry: 1,
    //=========================================

    /*
    * stroke
    * */
    lineColor: null,
    lineWidth: null,
    //=========================================

    /*
    * icon list
    * */
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
    this.context.font = "10px serif"
    this.context.textAlign = "start"
    this.context.textBaseline = "alphabetic";
    this.context.save();

    this.divCanvas = document.getElementById('divCanvas');
    this.canvasHeight = this.divCanvas.clientHeight - 2;
    this.canvasWidth = this.divCanvas.clientWidth - 2;
  },

  computed: {
    ...mapGetters([
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

          this.overlaies = markCoordinate.data.overlaies;
          this.mainImg = blobImage;
        }

        await this.setCanvasTransrateAndScale();
        setTimeout(() => this.importOne2Drawing(), 10);
      }
    }
  },

  created() {
  },

  methods: {
    async setCanvasTransrateAndScale() {
      await this.context.restore();
      await this.context.save();
      [this.reSizeScale] = await Promise.all([Math.min(this.canvasWidth / this.realityImageWidth, this.canvasHeight / this.realityImageHeight)]);

      // 1. 스케일 -> 캔바스 스케일을 높이와 너비 중 짧은 걸 기준으로 맞춤
      await this.context.scale(this.reSizeScale, this.reSizeScale);
      // 2. Rect 클리어
      await this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 3. 트랜스레이트 -> 화면의 중앙으로 이동
      await this.context.translate(this.canvasWidth / this.reSizeScale / 2.0, this.canvasHeight / this.reSizeScale / 2.0);
      // 4. 로테이트 -> 효과 적용
      await this.context.rotate((Math.PI / 180) * this.angle);
      // 5. 트랜스레이트 -> 화면의 중앙에서 그림 박기 위한 0, 0으로 이동
      await this.context.translate(this.realityImageWidth / -2.0, this.realityImageHeight / -2.0);
      // 6. 상하좌우반전 유무
      if (this.symmetry === -1) await this.context.translate(this.realityImageWidth, 0);
      if (this.verticalSymmetry === -1) await this.context.translate(0, this.realityImageHeight);
      if (this.angle === 0 || this.angle === 180) {
        await this.context.scale(this.symmetry, this.verticalSymmetry);
      } else if (this.angle === 90 || this.angle === 270) {
        await this.context.scale(this.verticalSymmetry, this.symmetry);
      }

      const image = new Image();
      image.src = this.mainImg;
      image.onload = async () => {
        // 7. 이미지 그리기
        await this.context.drawImage(image, 0, 0, this.realityImageWidth, this.realityImageHeight);

        // 8. 그리기 위해 다시 원점 중앙 이동
        await this.context.translate(this.realityImageWidth / 2.0, this.realityImageHeight / 2.0);
      }
    },

    markDraw() {
      for (let m of this.drawMarkArray) {
        this.drawShape(m);
      }
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

      this.context.stroke();
    },

    async handleResize() {
      this.canvasHeight = this.divCanvas.clientHeight - 2;
      this.canvasWidth = this.divCanvas.clientWidth - 2;
      await this.setCanvasTransrateAndScale();
      setTimeout(() => this.markDraw(), 1);
    },

    checkedToggling(idx, name, bool) {
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

    // button click event =====================================================
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
          // 4-1, 4-2, 4-3, 4-4
          if (e === 0) {
            if (this.angle === 360) this.angle = 0;
            this.angle += 90;
          } else if (e === 1) {
            if (this.angle === 0) this.angle = 360;
            this.angle -= 90;
          } else if (e === 2) {
            this.symmetry *= -1;
          } else if (e === 3) {
            this.verticalSymmetry *= -1;
          }

          await this.setCanvasTransrateAndScale();
          setTimeout(() => this.markDraw(), 1);
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
        };

        switch (m.type) {
          case "freedraw":
            stroke.type = "dash";
            stroke.from.x = m.scene_pos['control-points'][0].x / 25.4 * this.DPI;
            stroke.from.y = m.scene_pos['control-points'][0].y / 25.4 * this.DPI;
            m.scene_pos['control-points'].forEach(p => {
              stroke.coordinates.push({x: p.x / 25.4 * this.DPI, y: p.y / 25.4 * this.DPI});
            })
            this.drawShape(stroke);
            this.drawMarkArray.push(stroke);
            break;
        }
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
     * dash       => freedraw       1
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

.isToggle {
  border: solid 2px blue;
}
</style>