<template>
  <b-container class="filterDiv pHeader">
    <b-row>
      <b-col cols="1" class="zoneDate">
        Search :
      </b-col>
      <b-col cols="3">
        <input v-model="searching" placeholder="...tmp" v-on:keyup="checkKey">
      </b-col>
      <b-col cols="1">
          <button v-on:click="$emit('onclick', searching)">Search</button>
      </b-col>
      <b-col cols="2">
        <input type="date" id="dateFin" :value="getDateFin()" />
      </b-col>
      <b-col cols = "2">
          Priorité :
      </b-col>
      <b-col cols = "3">
        
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  function getDate(date){
    //retour date HTML5
    return date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + date.getDay()).slice(-2) ;
  }

  export default {
    name : "filtre",
      data: function () {
      return {
        searching: ""
      }
    },
    props : {
      dateDebut : {type : Date, required : true},
      dateFin : {type : Date, required : false, default : null},
      selectedPriority : {type : String, required : false, default : ""},
      listPrio : {
        type : Array, required : true
      }
    },
    methods : {
      getDateDebut(){
        return getDate(this.dateDebut);
      },
      getDateFin(){
        if (this.dateFin != undefined)
          return getDate(this.dateFin);
        else
          return null;
      },
      checkKey(ev){
        if (ev.keyCode == 13){
          this.$emit('onclick', this.searching);
        }
      }
    }
  }
</script>
<style>
  .zoneDate{
    display: inline;
    position:static;
  }

  .filterDiv{
    max-height: 150px;
  }
</style>
