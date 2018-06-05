<template>
  <b-container class="filterDiv pHeader">
    <b-row>
      <b-col cols="2" class="zoneDate">
        Entre le :
      </b-col>
      <b-col cols="2">
        <input type="date" id="dateDebut" :value="getDateDebut()"/>
      </b-col>
      <b-col cols="1">
        <p> et le </p>
      </b-col>
      <b-col cols="2">
        <input type="date" id="dateFin" :value="getDateFin()" />
      </b-col>
      <b-col cols = "2">
          Priorité :
      </b-col>
      <b-col cols = "3">
        <select>
          <option value=""></option>
          <option  v-for="prio in listPrio" v-bind:value="prio" > {{prio}} </option>
        </select>
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
    onchange(org){
      //alert(event);
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
