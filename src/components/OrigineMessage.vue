<template>
  <b-container
    v-bind:class="'pointer alert alert-' + maxPriority"
    v-on:click="$emit('onclick', value)"
    v-bind:active="this.selectedOrigine === this.value">
    {{this.libelle}}
  </b-container>
</template>
<script>
  export default{
    name:"OrigineMessage",
    props: {
      value : {type:String, required : true},
      libelle : {type:String, required : true},
      selectedOrigine : {type:String , required : true},
      maxPriority : {type : String, required : true}
    }
  }
</script>
