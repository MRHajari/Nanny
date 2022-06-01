<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import { authenticated } from '../../../stores/auth'
  import {educators} from './data-educators.js'
  import { usernameCheck } from '../../../stores/auth'
  import {serverPort} from '../../LogIn.svelte'


  //it checks whether the user is logged in
  let auth
  authenticated.subscribe(a => auth = a);
  let message = 'You are bot logged in!'

  // it checks which user is logged in.
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
  let userChech
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'You are not allowed to visit this page !'


  //fetched educators list
 const  fetchEducators = async () => {
    const url = serverPort + 'educators/educatorlist'
      let res = await fetch (url)
      res = await res.json()
      $educators = res.educator
  }



  // Register function
  let firstname = '', lastname = ''
  let msg = ''
  const submit = async () =>{
     const url = serverPort + 'educators/register'
    let res = await fetch( url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstname,
        lastname
     })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchEducators();
  };

</script>


{#if auth}
  {#if userChech}

    <!-- gibt zurückgekommene messag aus   -->
    {#if  msg}
      <div class="alert alert-success alert-dismissible" role="alert">
        <p><strong>{msg}</strong></p> 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    {/if}

    <!-- Register form  -->
    <form class="box" on:submit|preventDefault={submit}>
        <p class="title">Erzieher/in registrieren</p>
        <div class="field">
            <Input bind:value = {firstname} class="input" label="Vorname"  type="text" required/>
            <Input bind:value = {lastname} class="input" label="Nachname"  type="text" required/>

            <br>
            <Button class="button is-primary" type="submit"> Erzieher/in hinzufügen </Button>
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