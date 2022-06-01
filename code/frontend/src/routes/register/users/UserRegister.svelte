<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import { authenticated } from '../../../stores/auth'
  import {users} from './data-users.js'
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
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!'


  //fetched users list
  const  fetchUsers = async () => {
    const url = serverPort + 'user/userslist'
      let res = await fetch (url)
      res = await res.json()
      $users = res.user
  }

  

  // Register function
  let username = '', password = '', password_repeat = ''
  let msg = ''
  const submit = async () =>{
    const url = serverPort + 'user/register'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        password,
        password_repeat
     })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchUsers()
  };


</script>



{#if auth}
  {#if usernameCheck}

    <!-- gibt zurückgekommene messag aus   -->
    {#if  msg}
      <div class="alert alert-success alert-dismissible" role="alert">
        <p><strong>{msg}</strong></p> 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    {/if}

    <!-- Register form  -->
    <form class="box" on:submit|preventDefault={submit}>
        <p class="title">Benutzer registrieren</p>
        <div class="field">
            <Input bind:value = {username} class="input" label="Benutzername"  type="text" required/>
            <Input bind:value = {password} class="input" label="Passwort"  type="password" required/>
            <Input bind:value = {password_repeat} class="input" label="Wiederhole das Passwort" type="password" required/>
            <br>
            <Button class="button is-primary" type="submit"> Benutzer hinzufügen </Button>
          </div>
    </form>




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