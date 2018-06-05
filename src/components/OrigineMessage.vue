<template>
  <b-nav-item
    class="typeMessage"
    v-on:click="$emit('onclick', value)"
    v-bind:active="this.selectedOrigine === this.value">
    {{this.libelle}}
  </b-nav-item>
</template>
<script>
  export default{
    name:"OrigineMessage",
    props: {
      value : {type:String, required : true},
      libelle : {type:String, required : true},
      selectedOrigine : {type:String , required : true}
    }
  }
</script>
