<script>
  import { groups } from './data-groups.js'
  import {onMount} from 'svelte'
  import Group from './Group.svelte'
  import GroupRegister from './GroupRegister.svelte'
  import GroupEdit from './GroupEdit.svelte'
  import { authenticated } from '../../../stores/auth'
  import {serverPort} from '../../LogIn.svelte'


  // List counter
  let counter = 1;
  function caunternumber(){
    return counter++
  }

  //it checks whether the user is logged in
  let auth 
  authenticated.subscribe(a => auth = a);
  let message = 'You are not logged in!'

  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userChech 
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!';


  // fetch groups list 
  const  fetchGroups = async () => {
    const url = serverPort + 'groups/groupsList'
      let res = await fetch (url)
      res = await res.json()
      $groups = res.group
  }

  // fetch groups list from database 
  onMount (async()=> {
    fetchGroups();
  })

 

  // search function
  let textForSearch = ''
  const findGroup = async () =>{
  const url = serverPort + 'groups/groupFind'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      textForSearch
      })
    })
    res = await res.json()
    $groups = res.group
  };



</script> 




{#if auth}
  {#if userChech}

  <!-- Serch form -->
  <form class="d-flex" on:input|preventDefault={findGroup} >
      <input class="form-control me-2" type="search" placeholder="Durchsuchen" bind:value = {textForSearch}  aria-label="Geben Sie die Name ein, um zu suchen">
  </form>
  <br/>

  <!-- Show linka button to list, Add and Edit/Delete -->
  <ul class="nav nav-pills mb-3" id="groups-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button on:click={fetchGroups} class="nav-link active" id="groups-home-tab" data-bs-toggle="pill" data-bs-target="#groups-home" type="button" role="tab" aria-controls="groups-home" aria-selected="true">Gruppenliste</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="groups-profile-tab" data-bs-toggle="pill" data-bs-target="#groups-profile" type="button" role="tab" aria-controls="groups-profile" aria-selected="false">Gruppe hinzufügen</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="groups-contact-tab" data-bs-toggle="pill" data-bs-target="#groups-contact" type="button" role="tab" aria-controls="groups-contact" aria-selected="false"> Gruppe Bearbeiten / Löschen</button>
    </li>
  </ul>


  
  <!-- Shows result -->
  <div class="tab-content" id="groups-tabContent">
    <div class="tab-pane fade show active" id="groups-home" role="tabpanel" aria-labelledby="groups-home-tab">
        <div class="tab-pane fade show active" id="v-groups-home" role="tabpanel" aria-labelledby="v-groups-home-tab">
            
          <div id="groups">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Gruppename</th>
                </tr>
              </thead>
              
              <tbody>
                {#each $groups as group, index(group.group_id)}
                <tr>
                  <th scope="row">{index+1}</th>
                  <th class="list-group-item"><Group {group}/></th>
                </tr>
                {/each}
              </tbody>
            
            </table>
          </div>
        </div>
    </div>

    <!-- Linka button to list, Add and Edit/Delete -->
    <div class="tab-pane fade" id="groups-profile" role="tabpanel" aria-labelledby="groups-profile-tab"><GroupRegister/></div>
    <div class="tab-pane fade" id="groups-contact" role="tabpanel" aria-labelledby="groups-contact-tab"><GroupEdit/></div>
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
