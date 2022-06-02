<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import {users} from './data-users.js'
  import {onMount} from 'svelte'
  import User from './User.svelte'
  import { authenticated } from '../../../stores/auth'
  import {serverPort} from '../../LogIn.svelte'

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

  
  // List counter
  let counter = 1;
  function caunternumber(){
    return counter++
  };


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



  // Edit functions
  let user_id = '', username = '', password = '', password_repeat = ''
  const gotoEditPage =  (childData) =>{
    user_id = childData.user_id
    username = childData.username
    password = ''
    password_repeat = ''
  }

  let msg = ''
  const editUser = async () =>{
    const url = serverPort + 'user/editUser'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id,
        username,
        password,
        password_repeat
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchUsers()
  };


  // delete functions
  const gotoDelete = async (childData) =>{
    user_id = childData.user_id
    username = childData.username
    const url = serverPort + 'user/deleteUser'
    let res = await fetch(url, {
        method: 'POST',
          headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id,
          username
        })
    })
    res = await res.json()
    msg = `${res.msg}`
       fetchUsers()
  };


</script>




{#if auth}
  {#if userChech}

    <!-- gibt zurückgekommene messag aus  -->
    {#if  msg}
    <div class="alert alert-success alert-dismissible" role="alert">
      <p><strong>{msg}</strong></p> 
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    {/if}


    <!-- Shows users list result -->
    <div class="tab-content" id="users-tabContent">
      <div class="tab-pane fade show active" id="users-home" role="tabpanel" aria-labelledby="users-home-tab">
          <div class="tab-pane fade show active" id="v-users-home" role="tabpanel" aria-labelledby="v-users-home-tab">
            <div id="users">
              <table class="table table-striped" >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Benutzername</th>
                    <th scope="col"><div class="lastColspan">  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp   &nbsp &nbsp &nbsp</div></th>
                  </tr>
                </thead>
                <tbody>
                  {#each $users as user, index(user.user_id)}
                    <tr>
                      <th scope="row">{index+1}</th>
                      <th ><User {user}/></th>
                      <th class="lastColspan">
                        <button class="btn btn btn bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal"  on:click={gotoEditPage(user)}>&nbsp bearbeiten &nbsp &nbsp &nbsp &nbsp</button>
                        <!-- if username is 'admin', don't show delete button -->
                        {#if user.username != 'admin' }
                          <button class="btn btn bi bi-trash" on:click={gotoDelete(user)} >&nbsp löschen</button>
                        {:else}
                          &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
                        {/if}
                      </th>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>


    <!-- Edit window -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- User register form -->
            <form on:submit|preventDefault={editUser}> 

              <div class="field">

                <!-- admin must not be changed -->
                {#if username != 'admin' }
                  <Input bind:value = {username}  placeholder={username} class="input" label="Benuzername"  type="text" required/>
                  {/if}
                  <Input bind:value = {password} placeholder={username} class="input" label="Passwort"  type="password" required/>
                  <Input bind:value = {password_repeat}  placeholder= "" class="input" label="Wiederhole das Passwort" type="password" required/>
                  <br>
                  <Button class="button is-primary" type="submit"> Speichern </Button>
                </div>
          </form>
          <br/>
          <!-- outputs returned message  -->
          {#if  msg}
          <div class="alert alert-success alert-dismissible" role="alert">
            <p><strong>{msg}</strong></p> 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          {/if}
          </div>
          
        </div>
      </div>
    </div>




  {/if}
{:else}
  <!-- unauthenticated message -->
  <div class= "message">
      {message}
  </div>
{/if}


<style>
  .lastColspan{
		position: relative;
		display: flex;
    justify-content: right;
  }

  .message {
    display: flex;
    justify-content: center;
    background: none;
  }
</style>
 