<template>
  
</template>
<script>
  export default{
    name:"chcn-pagination",
    props : {
      listFull : {type : Array, required : true},
      per : {type : Number, required : false, default : 10},
      maxPage : {type : Number, required : false, default : 10},
    },
    data : function() {
        return {
            nbPage : 0,
            currentPage : 0,
            nbElement : 0
        }
    },
    methods : {
        getElements : function (){
            if (listFull != undefined && nbElement > 0){
                return listFull.slice((currentPage -1) * per, currentPage * per);
            }
        }
    },
    watch : {
        listFull : function (newVal, oldVal) {
            if (Array.isArray(newVal)){
                nbElement = newVal.length;
                nbPage = Math.ceil(nbElement/per);
                if (currentPage > nbPage || currentPage == 0){
                    currentPage = 1;
                }
            }
        }
    }
  }
</script>

<style lang="css">
  
</style>
