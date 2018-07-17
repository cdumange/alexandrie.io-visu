<template>
  <b-nav-item
    v-bind:id="'tm_' + typeMessage.typeMessage"
    v-on:click="$emit('onclick', typeMessage.typeMessage)"
    class="typeMessage"
    v-bind:active="this.typeMessage.typeMessage === this.selectedType">
    {{typeMessage.typeMessage}}
  </b-nav-item>
</template>
<script>
  export default{
    name:"typeMessage",
    props : {
      typeMessage : {type : Object, required : true},
      selectedType : {type : String, required : false},
    },
    methods : {
      isSelected(){
        return this.typeMessage.typeMessage === this.selectedType;
      }
    }
  }
</script>

<style lang="css">
  .typeMessage, .typeMessage>a{
    cursor: pointer;
    color: inherit;
  }

  .corpsTypeMessage {
    font-size: 16px;
    font-weight: bold;
  }
</style>
