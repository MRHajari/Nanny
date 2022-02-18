<script>
  import { educators } from './data-educators.js'
  import {onMount} from 'svelte'
  import Educator from './Educator.svelte'
  import EducatorRegister from './EducatorRegister.svelte'
  import EducatorEdit from './EducatorEdit.svelte'
  import { authenticated } from '../../../stores/auth'




  //it checks whether the user is logged in
  let auth = false
  authenticated.subscribe(a => auth = a);
  let message = 'You are not logged in!'

  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userChech = false
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'You are not allowed to visit this page !';


 //fetched educators list
 const  fetchEducators = async () => {
    const url = 'http://localhost:3333/api/educators/educatorlist'
      let res = await fetch (url)
      res = await res.json()
      $educators = res.educator
  }

  //  fetch educators from database
  onMount (async()=> {
    fetchEducators();
  })


  // scarch function
  let textForSearch = ''
  const findEducator = async () =>{
  const url = 'http://localhost:3333/api/educators/educatorFind'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      textForSearch
      })
    })
    res = await res.json()
    $educators = res.educator
  };




</script> 


{#if auth}
  {#if userChech}

  <!-- Serch form -->
  <form class="d-flex" on:input|preventDefault={findEducator} >
      <input class="form-control me-2" type="search" placeholder="Geben Sie die Name ein, um zu suchen" bind:value = {textForSearch}  aria-label="Search">
  </form>
  <br/>

  <!-- Show linka button to list, Add and Edit/Delete -->
  <ul class="nav nav-pills mb-3" id="educators-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="educators-home-tab" data-bs-toggle="pill" data-bs-target="#educators-home" type="button" role="tab" aria-controls="educators-home" aria-selected="true">Erzieherliste</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="educators-profile-tab" data-bs-toggle="pill" data-bs-target="#educators-profile" type="button" role="tab" aria-controls="educators-profile" aria-selected="false">Erzieher hinzufügen</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="educators-contact-tab" data-bs-toggle="pill" data-bs-target="#educators-contact" type="button" role="tab" aria-controls="educators-contact" aria-selected="false">Erzieher Bearbeiten / Löschen</button>
    </li>
  </ul>



  <!-- Shows result -->
  <div class="tab-content" id="educators-tabContent">
    <div class="tab-pane fade show active" id="educators-home" role="tabpanel" aria-labelledby="educators-home-tab">
        <div class="tab-pane fade show active" id="v-educators-home" role="tabpanel" aria-labelledby="v-educators-home-tab">
            
          <div id="users">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Erzieher name</th>
                </tr>
              </thead>

              <tbody>
                {#each $educators as educator, index(educator.educator_id)}
                <tr>
                  <th scope="row">{index+1}</th>
                  <th class="list-educator-item"><Educator {educator}/></th>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <!-- Linka button to list, Add and Edit/Delete -->
    <div class="tab-pane fade" id="educators-profile" role="tabpanel" aria-labelledby="educators-profile-tab"><EducatorRegister/></div>
    <div class="tab-pane fade" id="educators-contact" role="tabpanel" aria-labelledby="educators-contact-tab"><EducatorEdit/></div>
  </div>




  {/if}
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
