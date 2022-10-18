<template>
  <div class="UtilityView">

    <!-- 1 -->
    <div class="itemBox">
      <div 
        class="item"
        v-for="(v, k) in first" :key="k"
        @click="first[k] = !v, send(first[k])"
        :class="{isToggle:v}"
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
        @click="[second[k] = !v, send(second[k])]"
        :class="{isToggle:v}"
        >
        <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 3 -->
    <div class="itemBox">
      <div 
        class="item bar"
        v-for="(v, k) in third" :key="k"
        @click="third[k] = !v"
        :class="{isToggle:v}"
        >
        <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
      </div>
      <div class="item"><div class="color"></div></div>
      <select class="colorSelect same">
        <option>얇은 선</option>
      </select>
    </div>
    <div class="line"></div>

    <!-- 4 -->
    <div class="itemBox">
      <div 
        class="item"
        v-for="(v, k) in fourth" :key="k"
        @click="fourth[k] = !v"
        :class="{isToggle:v}"
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
      <div 
        class="item"
        v-for="(v, k) in fifth" :key="k"
        @click="fifth[k] = !v"
        :class="{isToggle:v}"
        >
        <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
      </div>
    </div>
    <div class="line"></div>

    <!-- 6 -->
    <div class="itemBox">
      <div 
        class="item"
        v-for="(v, k) in sixth" :key="k"
        @click="sixth[k] = !v"
        :class="{isToggle:v}"
        >
        <img :src="require(`@/assets/img/utils/icon-${k}.png`)"/>
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
    first: {pan: false, zoom: false, info: false},
    second: {bright: false, inverse: false, sharpen: false, ruler: false, tapeline: false, angle: false, arrow: false, shape: false},
    third: {draw: false, nerve: false},
    fourth: {'01': false, '02': false, '03': false, '04': false},
    fifth: {'implant-01': false, 'implant-02': false, pontic: false},
    sixth: {'select-capture': false, 'full-screen-capture': false, 'window-capture': false},
  }),

  methods: {
    send(e){
      this.$emit('status', e);
    }
  },

  // computed: {
  //   // 1-2
  //   zoom: {
  //     send: function () {
  //       return 'tt';
  //     }
  //   }
  // },

  watch: {
    // 1-2
    zoom: function (val) {
      console.log(val);
    }
  },

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