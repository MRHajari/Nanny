<script>
    import EducatorInLocation from './EducatorInLocation.svelte'
    import { educatorsInLocation } from './data-educatorInLocation'
    import { authenticated } from '../../../stores/auth'
    import { onMount } from 'svelte'
    import ReadMore from 'svelte-read-more'
    import {serverPort} from '../../LogIn.svelte'
    
  //it checks whether the user is logged in
  let auth 
  authenticated.subscribe(a => auth = a);
  let message = 'You are not logged in!';


   //fetched educators list
 const  fetchEducators = async () => {
    const url = serverPort + 'educators/educatorlist'
      let res = await fetch (url)
      res = await res.json()
      $educatorsInLocation = res.educator
  }

  //  fetch educators from database
  onMount (async()=> {
    fetchEducators();
  })

  
    // scarch function
    let textForSearch = ''
  const findEducator = async () =>{
  const url = serverPort + 'api/educators/educatorFind'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      textForSearch
      })
    })
    res = await res.json()
    $educatorsInLocation = res.educator
  };

  



  // if someone clicked on button "Anmerkung", opens the notation window 
  let descriptionId = ''
  let descriptionText = ''
  const gotoDescriptionPage = async (educatorInLocationData) => {
    descriptionId = educatorInLocationData.educator_id
    descriptionText = educatorInLocationData.description
   
  }

  const saveDescription = async () => {
    let educator_id = descriptionId
    let description = descriptionText
    const url = serverPort + 'educators/saveDescription'
    await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        educator_id,
        description
      })
    })
    fetchEducators();
  };
  




</script>



{#if auth}

    <!-- Serch form -->
    <form class="d-flex" on:input|preventDefault={findEducator} >
        <input class="form-control me-2" type="search" placeholder="suchen" bind:value = {textForSearch}  aria-label="Search">
    </form>
    <br/>


    <div id="users">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name &nbsp &nbsp &nbsp &nbsp  &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                               Raum &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                              Anmerkung</th>
            </tr>
          </thead>

          <tbody>
            {#each $educatorsInLocation as educatorInLocation, index(educatorInLocation.educator_id)}
            <tr>
              <th scope="row">{index+1}</th>
              <th class="list-educator-item"><EducatorInLocation {educatorInLocation}/></th>
              

                <th>
                    <button on:click={gotoDescriptionPage(educatorInLocation)} type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#educatorAbsenceModal" >ändern</button>
                </th>

            </tr>
            {/each}
          </tbody>
        </table>
      </div>


      <!-- Description form for each educator  -->
      <div class="modal fade" id="educatorAbsenceModal" tabindex="-1" aria-labelledby="educatorAbsenceModalLabel" aria-hidden="true">
        <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="educatorAbsenceModalLabel">Anmerkung:  </h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             <div class="form-group">
            
               <textarea bind:value = {descriptionText}  placeholder={descriptionText} class="form-control" id="educatorAbsenceFormControlTextarea1" rows="3"></textarea>
             </div>
             <form on:click={saveDescription} >
                 <div class="modal-footer" >
                   <button type="button" class="btn btn-secondary"  data-bs-dismiss="modal">schließen</button>
                   <button  type="button"  class="btn btn-primary" >speichern</button>
                 </div>
               </form>
           </div>
       </div>
       </div>
     </div>







{:else}
  <!-- unauthenticated message -->
  <div class= "message">
      {message}
  </div>
{/if}




<style>
.message {
  display: flex;
  justify-content: center;
  background: none;
}

</style>
