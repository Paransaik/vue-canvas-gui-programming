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
        <!--        <div
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
      <!--      <div class="itemBox">
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
            <!-- x-axis: <strong>{{ x }}</strong>, y-axis: <strong>{{ y }}</strong> -->
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
                <!-- {{ imageArr }} -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/utility.css'
import {xmlToJson} from '@/assets/js/x2j.js'

import axios from "axios"
import drf from '@/api/drf'
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
    disable: false,

    // Canvas
    canvasFullWidth: 0,
    canvasFullHeight: 0,
    // 0, 0 coordinate set
    coorWidth: 0,
    coorHeight: 0,
    // halfHeight
    halfHeight: 0,

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
          yRate = this.fullHeight / (ph * e.PixelSpacingH);
          const h = e.PixelSpacingH;
          const v = e.PixelSpacingV;

          this.imageArr.push({
            chartId: ch,
            images: im,
            drawMark: dr,
            create: cr,
            pw: pw,
            ph: ph,
            PixelSpacingH: h,
            PixelSpacingW: v,
            // one2 to web rate: 512 * pixcelspacing : fullHeight
            one2web: yRate,
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
    // 저도 이러고 싶지 않았습니다. 저는 백엔드 개발자인데...
    // 알고리즘은 짰는데 js 문법을 모르겠습니다. 자바로 5분도 안걸리는데...
    // 알고리즘은 리스트에 해당 pan, bright ... nerve를 넣고 for문을 돌려 함수 파라미터로 넘겨 받는 name과
    // 일치하는 것을 제외하고 값을 정해주면 됩니다. 제가 생각했을 때 6줄 내로 끝나는 알고리즘입니다.
    // Refactoring 에정
    // - 2122.12.07. 정태영 사원
    checkedToggling(idx, name, bool) {
      if (this.disable) {
        idx[name] = !bool;
        console.log(name, idx[name])
        // if (idx[name] === bool) {
        //   this.first.pan = false;
        //   this.second.bright = false;
        //   this.second.ruler = false;
        //   this.second.tapeline = false;
        //   this.second.angle = false;
        //   this.second.shape = false;
        //   this.second.rectangle = false;
        //   this.third.draw = true;
        //   this.third.nerve = true;
        // }
        switch (name) {
          case 'pan':
            if (this.first.pan === true) {
              this.second.bright = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'bright':
            if (this.second.bright === true) {
              this.first.pan = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'ruler':
            if (this.second.ruler === true) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'tapeline':
            if (this.second.tapeline === true) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.ruler = false;
              this.second.angle = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'angle':
            if (this.second.angle === true) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'shape':
            if (this.second.shape === true) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.rectangle = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'rectangle':
            if (this.second.rectangle === true) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.shape = false;
              this.third.draw = true;
              this.third.nerve = true;
            }
            break;
          case 'draw':
            if (this.third.draw === false) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.nerve = true;
            }
            break;
          case 'nerve':
            if (this.third.nerve === false) {
              this.first.pan = false;
              this.second.bright = false;
              this.second.ruler = false;
              this.second.tapeline = false;
              this.second.angle = false;
              this.second.shape = false;
              this.second.rectangle = false;
              this.third.draw = true;
            }
            break;
        }
        console.log('end case')
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
      this.disable = true;

      if (this.preImage !== '') {
        this.preImage.setAttribute('style', '');
      }

      this.mainImg = node.images;
      e.target.setAttribute('style', 'border: 2px solid blue');
      this.preImage = e.target;

      this.pS = node.PixelSpacingH;
      this.pW = node.pw;
      this.dataInfo = {
        'chartId': node.chartId,
        'time': node.create,
      }

      for (const d of node.overl) {
        // console.log(d.scene_pos);
        // console.log(d.style);
        // console.log(d.transformation);
        // console.log(d.type);
        await this.drawing(d, node.one2web);
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
        const rate = this.pW / this.fullHeight;
        // const pixelSpacing = 0.10000000149011612;
        const pixelSpacing = this.pS;
        const distance = Math.pow(Math.pow(this.startY - this.endY, 2) + Math.pow(this.startX - this.endX, 2), 0.5) * rate * pixelSpacing;
        console.log(distance);
      }
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
        if (s === 'ruler') {
          this.strokeType = 'line';
          this.lock = !this.second.ruler;
        } else if (s === 'shape') {
          this.strokeType = 'circle';
          this.lock = !this.second.shape;
        } else if (s === 'rectangle') {
          this.strokeType = 'square';
          this.lock = !this.second.rectangle;
        } else if (s === 'draw') {
          this.strokeType = 'dash';
          this.lock = this.third.draw;
        } else if (s === 'zoom' || s === 'info') {
          this.lock = false;
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

    drawing(d, rate) {
      // RGBA -> RGB
      this.lineColor = '#' + d.style.pen.color.substring(3, 9);
      this.lineWidth = d.style.pen.width;

      let canvas = document.querySelector('#VueDrawingCanvas');
      const context = this.context ? this.context : canvas.getContext('2d');
      context.strokeStyle = this.lineColor;
      context.fillStyle = this.lineColor;
      context.lineWidth = this.lineWidth;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeType = "dash";

      context.beginPath();
      context.setLineDash([]);
      if (d.scene_pos['control-points'][0]) {
        context.moveTo(d.scene_pos['control-points'][0].x * rate + this.coorWidth,
            d.scene_pos['control-points'][0].y * rate + this.coorHeight);
      }
      d.scene_pos['control-points'].forEach(p => {
        // console.log(this.coorWidth + (p.x * rate));
        // console.log(this.coorHeight + (p.y * rate));
        context.lineTo(this.coorWidth + (p.x * rate), this.coorHeight + (p.y * rate));
      })
      context.stroke();
    },


    save() {
      console.log("Call by method save");
      const link = document.createElement('a');
      link.download = 'param'; // filename
      link.href = this.image;
      link.click();
    },

    // base ===================================================
    ...mapActions([
      Constant.GET_PATIENTSERIESLIST,
    ]),

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
  width: calc(1px * v-bind(fullHeight));
  position: absolute;
  top: calc(1px * v-bind(movingTop));
  left: calc(1px * (((v-bind(fullWidth) - v-bind(fullHeight)) / 2) + v-bind(movingLeft)));
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
  margin: 0 0 0 8px;
  border: solid 1px #d5dae5;
  background-color: #eaecf2;
  flex: 0 0 auto;
}

.imgs {
  margin: 0 auto;
  width: 90px;
  height: 89px;
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
