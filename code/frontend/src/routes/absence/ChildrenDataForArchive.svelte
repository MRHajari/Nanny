<script>
    // import ReadMore from 'svelte-read-more';
    
    export let childForArchive = {};
    import moment from 'moment';



  function showOnlyDate(dateToFormat) {
    return moment(dateToFormat).format(`YYYY-MM-DD`)
  }
  
  function showOnlyHourAndMnute(dateToFormat) {
    return moment(dateToFormat).format(`HH:mm`)
  }

</script>
   


<div class="childForArchive">
   <div class="row">
     <div class="col-6 col-sm-2">
       <h6>  {childForArchive.firstname}  {childForArchive.lastname}</h6>
     </div>
     <div class="col-6 col-sm-2">
       {childForArchive.groupname}
     </div>
     <div class="col-6 col-sm-2">
       {showOnlyDate(childForArchive.day)}
     </div>
     <div class="col-6 col-sm-1" >
        {#if childForArchive.enter_child != null}
            {showOnlyHourAndMnute(childForArchive.enter_child)}
        {:else}
            {' '}
        {/if}
     </div>
     <div class="col-6 col-sm-1">
        {#if childForArchive.exit_child != null}
          {showOnlyHourAndMnute(childForArchive.exit_child)}
        {:else}
            {' '}
        {/if}
        
     </div>
     <!-- <div class="textShort"> -->
     <div class="col-6 col-sm-2">
        {#if childForArchive.description != null}
        <!-- <ReadMore textContent={childForArchive.description} maxChars={14} maxWords={4} readMoreLabel='Mehr zeigen' readLessLabel='Wenige zeigen'/> -->
        <p>{childForArchive.description}</p>

        {:else}
            {' '}
        {/if}
     <!-- </div> -->
    </div>

     <div class="col-6 col-sm-2">
      {#if childForArchive.current_room != null}
          <p>{childForArchive.current_room}</p>
      {:else}
          {' '}
      {/if}
   </div>
   </div>


     

</div>
  

<style>
.col-6 {
  border-left:   1px solid hsla(200, 10%, 50%,100);
}


</style>