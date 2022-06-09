<script>
    export let educatorInLocation = {};
</script>



<div class="educatorInLocation">
   <div class="row">
     <div class="col-3">
       <h6>  {educatorInLocation.firstname}  {educatorInLocation.lastname}</h6>
     </div>

      <div class="col-3">
        <h6>  {educatorInLocation.current_room} </h6>
      </div>

      {#if educatorInLocation.description != null}
        <div class="col-6">
          <p>  {educatorInLocation.description} </p>
        </div>
      {:else}
        <div class="col-6">
          <p>  {''} </p>
        </div>
      {/if}

   </div>
</div>
  

