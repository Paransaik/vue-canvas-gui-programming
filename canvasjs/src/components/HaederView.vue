<template>
  <div class="headerView">
    <section class="section">
      <div class="searchBar">
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
      <div class="haeaderStatusBar">
        <div>ㅡ</div>
        <div><input type="button" value="Download"></div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import Constant from "@/common/Constant";

export default {
  name: 'HeaderView',

  data: () => ({}),

  components: {},

  computed: {
    ...mapGetters([
      'allPatientList',
      'patientSeriesList',
      'patientRecordList',
      'patientRecordFilenameList',
    ]),

  },

  watch: {},

  created() {
    this.getAllPatientList();
  },

  methods: {
    ...mapActions([
      Constant.GET_ALLPATIENTLIST,
      Constant.GET_PATIENTNAME,
      Constant.GET_PATIENTSERIESLIST,
      Constant.GET_PATIENTRECORDLIST,
      Constant.GET_PATIENTRECORDFILENAMELIST,
    ]),
  }


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

.searchInput {
  width: 300px;
}

.searchOption {
  z-index: 99;
}

.haeaderStatusBar {
  height: 40px;
  padding: 0 15px;
  opacity: 0.6;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
