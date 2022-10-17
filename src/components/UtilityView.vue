<template>
  <div class="UtilityView">

    <!-- 1 -->
    <div class="itemBox">
      <div 
        class="item"
        v-for="f in first" :key="f" :value="f"
        @click="f=!f"
        :class="{isToggle:f}"
        >
        <img :src="require(`@/assets/img/utils/icon-${f}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 2 -->
    <div class="itemBox">
      <div class="item" v-for="s in second" :key="s">
        <img :src="require(`@/assets/img/utils/icon-${s}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 3 -->
    <div class="itemBox">
      <div class="item bar" v-for="t in third" :key="t">
        <img 
          :src="require(`@/assets/img/utils/icon-${t}.png`)"/>
      </div>
      <div class="item"><div class="color"></div></div>
      <select class="colorSelect same">
        <option>얇은 선</option>
      </select>
    </div>
    <div class="line"></div>

    <!-- 4 -->
    <div class="itemBox">
      <div class="item" v-for="f in fourth" :key="f">
        <img :src="require(`@/assets/img/utils/icon-${f}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 5 -->
    <div class="itemBox">
      <div class="implant">
        <img src="@/assets/img/utils/icon-implant.png"/>
        <span class="same">임플란트 식립</span>
      </div>
      <div class="item" v-for="f in fifth" :key="f">
        <img :src="require(`@/assets/img/utils/icon-${f}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 6 -->
    <div class="itemBox">
      <div class="item" v-for="s in sixth" :key="s">
        <img :src="require(`@/assets/img/utils/icon-${s}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 7 -->
    <span class="same" style="padding: 0 0 0 3px;">초기화</span>
    <div class="itemBox">
      <div class="item bar same">뷰</div>
      <div class="item bar same">전체</div>
    </div>

  </div>
</template>

<script>


export default {
  name: 'UtilityView',

  components: {
  },

  data: () => ({
    isActive: false,
    pant: false, zoom: false, info: false,
    bright: false, inverse: false, sharpen: false, ruler: false, tapeline: false, angle: false, arrow: false, shape: false,
    draw : false, nerve: false,
    '01' : false, '02' : false, '03': false, '04': false,
    'implant-01' : false, 'implant-02': false, 'pontic': false,
    'select-capture' : false, 'full-screen-capture': false, 'window-capture': false,


    first: ['pan', 'zoom', 'info'],
    second: ['bright', 'inverse', 'sharpen', 'ruler', 'tapeline', 'angle', 'arrow', 'shape'],
    third: ['draw', 'nerve'],
    fourth: ['01', '02', '03', '04'],
    fifth: ['implant-01', 'implant-02', 'pontic'],
    sixth: ['select-capture', 'full-screen-capture', 'window-capture'],
  }),
}
</script>

<style scoped>
  .UtilityView {
    min-width: 130px;
    max-width: 130px;
    height: auto;
    padding: 8px;
    background-color: #eaeff3;
  }

  .line {
    width: 110px;
    height: 1px;
    margin: 5px 3px 5px 1.5px;
    border: solid 1px #cdd2d9;
  }

  .itemBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .item {
    width: 32px;
    height: 32px;
    margin: 3px;
    border-radius: 4px;
    border: solid 1px #b9bfcc;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .bar {
    width: 51px;
  }

  .implant {
    width: 108px;
    height: 32px;
    margin: 7.5px 3px 8px;
    border-radius: 4px;
    box-shadow: 0 1px 0 0 rgba(39, 50, 57, 0.04);
    border: solid 1px #b9bfcc;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 0 0 5px;
   }

  .same {
    font-family: MalgunGothic;
    font-size: 13px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -2px;
    text-align: center;
    color: #000;
   }

  .color {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background-color: #f00;
  }

  .colorSelect {
    width: 69px;
    height: 32px;
    margin: 3px 0 0 4px;
    padding: 2px 6px 5px 0;
    border-radius: 4px;
    border: solid 1px #b9bfcc;
    background-color: #fff;
  }

  .isToggle {
    background-color: #123e72;
  }
</style>