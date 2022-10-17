<template>
  <div class="headerView">
    <section class="section">
      <div class="searchBar">
        <input 
        list="patientUid"
        type="text" 
        class="searchInput" 
        placeholder="Input patient Info" 
        @input="getPatientNameList($event.target.value)">
        <datalist id="patientUid">
          <option
          class="searchOption"
          v-for="pNL in patientNameList" 
          @click="getPatientPictureList(pNL)"
          :key=pNL
          :value=pNL>
          </option> 
        </datalist>

        
      </div>

      <div v-for="pNL in patientNameList" :key="pNL" :vlaue="pNL">
        <button v-text="pNL" @click="getPatientPictureList(pNL)"></button>
      </div>
      <!-- {{ patientNameList }} -->


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
  }),

  components: {
  },

  computed: {
    ...mapGetters([
      'patientNameList',
      'patientName',
      'patientPictureList',
      'patientRecordList',
      'patientRecordFilenameList',
    ]),

  },

  created() {
    // 2266554ADD1E4D63A4976C149834D14C
    console.log("Patient Created Comp.");
    this.getPatientNameList('');
    console.log("Call By PatientNameList");
    // this.getPatientNumList();
    // this.getPatientPictureList('2266554ADD1E4D63A4976C149834D14C');
  },

  methods: {
    ...mapActions([
      Constant.GET_PATIENTNAMELIST,
      Constant.GET_PATIENTNAME,
      Constant.GET_PATIENTPICTURELIST,
      Constant.GET_PATIENTRECORDLIST,
      Constant.GET_PATIENTRECORDFILENAMELIST,
    ]),
  },

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
</style>
