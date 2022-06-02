<script>
  import {users} from './data-users.js'
  import {onMount} from 'svelte'
  import User from './User.svelte'
  import UserRegister from './UserRegister.svelte'
  import UserEdit from './UserEdit.svelte'
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
  let message = 'Sie sind nicht eingeloggt!'

  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userChech 
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!';



  //fetched users list
  const  fetchUsers = async () => {
    const url = serverPort + 'user/userslist'
      let res = await fetch (url)
      res = await res.json()
      $users = res.user
  }

  //  fetch users from database
  onMount (async()=> {
    fetchUsers()
  })

  

  // scarch function
  let textForSearch = ''
  const findUser = async () =>{
  const url = serverPort + '/user/userfind'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      textForSearch
      })
    })
    res = await res.json()
    $users = res.user
  };

</script> 


{#if auth}
  {#if userChech}

  <!-- Serch form -->
  <form class="d-flex" on:input|preventDefault={findUser} >
      <input class="form-control me-2" type="search" placeholder="suchen" bind:value = {textForSearch}  aria-label="Geben Sie die Name ein, um zu suchen">
  </form>
  <br/>

  <!-- Show linka button to list, Add and Edit/Delete -->
  <ul class="nav nav-pills mb-3" id="users-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="users-home-tab" data-bs-toggle="pill" data-bs-target="#users-home" type="button" role="tab" aria-controls="users-home" aria-selected="true">Liste</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="users-profile-tab" data-bs-toggle="pill" data-bs-target="#users-profile" type="button" role="tab" aria-controls="users-profile" aria-selected="false"> Hinzufügen</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="users-contact-tab" data-bs-toggle="pill" data-bs-target="#users-contact" type="button" role="tab" aria-controls="users-contact" aria-selected="false"> Bearbeiten/Löschen</button>
    </li>
  </ul>

  <!-- Shows result -->
  <div class="tab-content" id="users-tabContent">
    <div class="tab-pane fade show active" id="users-home" role="tabpanel" aria-labelledby="users-home-tab">
        <div class="tab-pane fade show active" id="v-users-home" role="tabpanel" aria-labelledby="v-users-home-tab">
            
          <div id="users">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Benuzername</th>
                </tr>
              </thead>

              <tbody>
                {#each $users as user, index(user.user_id)}
                <tr>
                  <th scope="row">{index+1}</th>
                  <th class="list-group-item"><User {user}/></th>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <!-- Linka button to list, Add and Edit/Delete -->
    <div class="tab-pane fade" id="users-profile" role="tabpanel" aria-labelledby="users-profile-tab"><UserRegister/></div>
    <div class="tab-pane fade" id="users-contact" role="tabpanel" aria-labelledby="users-contact-tab"><UserEdit/></div>
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
 