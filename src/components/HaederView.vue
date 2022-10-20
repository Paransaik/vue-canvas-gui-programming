<template>
  <div class="headerView">
    <section class="section">
      <div class="searchBar">

        <!-- ================================ -->
        <input 
          list="patientUid"
          type="text" 
          class="searchInput" 
          placeholder="Input patient Info"
          @change="getPatientSeriesList"
        >

        <datalist id="patientUid">
          <option
            class="searchOption"
            v-for="aPL in allPatientList" 
            :key="aPL"
            :value="aPL.ChartID"
          >{{ `${aPL.LastName} ${aPL.MiddleName} ${aPL.FirstName}` }}
          </option>
        </datalist>
        <!-- ================================ -->
      </div>

      <!-- <div class="autocomplete">
        <input type="text" @change="onChange" v-model="search"  @click="showAll" />
        <ul id="autocomplete-results" v-show="isOpen" ref="scrollContainer" class="autocomplete-results">
          <li class="loading" v-if="isLoading">
            Loading results...
          </li>
          <li ref="options" v-else v-for="(result, i) in allPatientList" :key="i" @click="setResult(result, i)" class="autocomplete-result" :class="{ 'is-active': i === arrowCounter }">
            {{ result }}
          </li>
        </ul>
      </div> -->

      <!-- <div v-for="aPL in allPatientList" :key="aPL" :vlaue="aPL">
        <button v-text="`${aPL.LastName} ${aPL.MiddleName} ${aPL.FirstName}`" @click="getPatientPictureList(aPL.UniqueID)"></button>
      </div> -->

      <div class="haeaderStatusBar">
        <div>영상 보기</div>
        <div>ㅡ</div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Constant from "@/common/Constant";

export default {
  name: 'HeaderView',
  
  data: () => ({
    // isOpen: false,
    // results: [],
    // search: "",
    // isLoading: false,
    // arrowCounter: 0
  }),

  components: {
  },

  computed: {
    ...mapGetters([
      'allPatientList',
      'patientName',
      'patientSeriesList',
      'patientRecordList',
      'patientRecordFilenameList',
    ]),

  },

  watch: {
    // allPatientList: function(val, oldValue) {
    //   // actually compare them
    //   if (val.length !== oldValue.length) {
    //     this.results = val;
    //     this.isLoading = false;
    //   }
    // }
  },


  created() {
    // 2266554ADD1E4D63A4976C149834D14C
    console.log("Patient Created Comp.");
    this.getAllPatientList();
    this.processAPL();
    console.log("Call By PatientNameList");
    // this.getPatientNumList();
    // this.getPatientPictureList('2266554ADD1E4D63A4976C149834D14C');
  },

  methods: {
    ...mapActions([
      Constant.GET_ALLPATIENTLIST,
      Constant.GET_PATIENTNAME,
      Constant.GET_PATIENTSERIESLIST,
      Constant.GET_PATIENTRECORDLIST,
      Constant.GET_PATIENTRECORDFILENAMELIST,
    ]),


    processAPL() {
      // var response = "Aleppo Alexandria Alger Almaty"
      // var city = response.split(" ");
      // var options = "";

      // for(var i = 0; i < 4; i++) {
      //     options += "<option value='" + city[i]+ "'>\n";
      // }
      // console.log(options);
      // console.log(document.getElementById("patientUid"));
      // document.getElementById("patientUid").innerHTML = options;
    }


    // onChange() {
    //   console.log( this.search)
    //   // Let's warn the parent that a change was made
    //   this.$emit("input", this.search);
    // },

    // setResult(result, i) {
    //   this.arrowCounter = i;
    //   this.search = result;
    //   this.isOpen = false;
    //   // Fire onChange, because it won't do it on blur
    //   this.onChange();
    // },

    // showAll() {
    //   this.isOpen = !this.isOpen;
		// 	(this.isOpen) ? this.results = this.items : this.results = [];
    // },
  },

  // mounted() {
  //   document.addEventListener("click", this.handleClickOutside);
  // },
  
  // destroyed() {
  //   document.removeEventListener("click", this.handleClickOutside);
  // },
}
</script>

<style>
  .headerView {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .searchBar {
    height: 50px;
    padding: 10px 0px 10px 30px;
    background-color: #f4f5f8;
  }
  
  .btns {
    display: flex;
    flex-direction: column;
    width: 400px;
  }

  .slt {
    width: 400px;
  }

  .searchInput {
    width: 300px;
  }

  .searchOption{
    z-index: 99;
  }

  .haeaderStatusBar{
    height: 30px;
    padding: 0 15px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: MalgunGothic;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.75px;
    color: #fff;
    background-color: #123e72;
  }

  /* autocopmlete */
  /* .autocomplete {
    position: relative;
    width: 130px;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
    width: 100%;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #4aae9b;
    color: white;
  } */
</style>
