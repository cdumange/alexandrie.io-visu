<template>
  <b-container v-on:click="$emit('onclick', message)"
        v-bind:class="'pointer alert '+ getPriorityStyleClass +' message'"
        v-if="message != undefined">
    <b-row>
      <b-col cols="8"> Origine : {{message.message.origine}} </b-col>
      <b-col cols="4"> Date :  {{formatDate}}</b-col>
      <b-col cols="2"> Nb itération : {{message.counter}}</b-col>
      <b-col offset="6" cols="4"> Priorité : {{message.priority}}</b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        Message d'erreur : {{formatedMessage.substring(0,80)}}
      </b-col>
    </b-row>
  </b-container>

</template>
<script>
  export default{
    name : "message",
    props : {
      message : {type : Object, required : true}
    },
    method : {
      openMessage() {
        this.$emit('onopen', this.message);
      }
    },
    computed : {
      formatedMessage (){
        let ret = null;
        if(this.message.message.message != undefined)
          ret=  this.message.message.message;
        else {
          if (this.message.message != undefined)
            ret =  this.message.message;
          else ret = this.message;
        }

        if (ret != undefined && typeof ret != 'string')
          ret = JSON.stringify(ret);
        return ret;
      },
      formatDate(){
        const param = this.message.date;
        if (param != undefined && param != ""){
          const d = new Date(param);
          return d.toLocaleDateString() + " " + d.toLocaleTimeString();
        }
      },
      getPriorityStyleClass: function(){
        var priority = this.message.priority.toString().toLowerCase();
        var className = 'light';
        if(priority.indexOf('warn') != -1 || priority == 'Attention'){
          className = 'warning';
        }else if (priority == 'error' || priority == 'danger' || priority == 'fatal' || priority == 'fail') {
          className = 'danger';
        }else if (priority.indexOf('info') != -1) {
          className = 'info';
        }else if (priority == 'success' || priority == 'ok') {
          className = 'success';
        }
        return 'alert-'+ className;
      }
    }
  }
</script>
<style>
</style>
