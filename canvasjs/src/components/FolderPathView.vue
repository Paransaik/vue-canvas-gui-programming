<template>
    <table class="folerPath">
        
    </table>
</template>
  
<script>
import { mapGetters, mapActions } from 'vuex';
import Constant from "@/common/Constant.js";

export default {
    name: 'FloerPathView',

    components: {},

    data: () => ({
        imageArr: [],
    }),


    mounted() {
    },

    computed: {
        ...mapGetters([
            'patientRecordList',
            'patientSeriesList',
        ]),
    },

    watch: {
        
    },

    methods: {
        ...mapActions([
            Constant.GET_PATIENTRECORDLIST,
            Constant.GET_PATIENTSERIESLIST,
        ]),
    }
}
</script>
  
<style>
.folerPath {
    width: 100%;
}
</style>