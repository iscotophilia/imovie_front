<template>

</template>

<script>
  import { mdbIcon,mdbBtn,mdbModal,mdbModalTitle,mdbModalHeader,mdbModalBody,mdbModalFooter } from 'mdbvue';
  export default {
    name: 'LoginTip',

    components: {
      mdbIcon,
      mdbModal,
      mdbModalHeader,
      mdbModalBody,
      mdbModalFooter,
      mdbBtn,
      mdbModalTitle
    },
    data(){
      return{
        modal:false,
        options:{
          title:'',
          text:'',
        }
      }
    },
    methods:{
      show(options){
        this.modal = true
        this.options = options
      }
    },

  }
</script>

<style scoped>

</style>
