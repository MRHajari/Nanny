<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import { authenticated } from '../../../stores/auth'
  import { rooms } from './data-rooms.js'
  import { onMount } from "svelte";


  //it checks whether the user is logged in
  let auth = false
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'

  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userChech = false
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!';



  //fetched rooms list
  const  fetchRooms = async () => {
    const url = 'http://localhost:3333/api/rooms/roomsList'
      let res = await fetch (url)
      res = await res.json()
      $rooms = res.room
  }

  onMount(async()=> {
    fetchRooms();
  })



  // Register function
  let roomname = ''
  let msg = ''
  const submit = async () =>{
     const url = 'http://localhost:3333/api/rooms/register'
    let res = await fetch( url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        roomname
     })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchRooms();
  };


</script>


{#if auth}
  {#if userChech}

    <!-- outputs returned messag  -->
    {#if  msg}
      <div class="alert alert-success alert-dismissible" role="alert">
        <p><strong>{msg}</strong></p> 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    {/if}

    <!-- Register form  -->
    <form class="box" on:submit|preventDefault={submit}>
        <p class="title">Raum Register</p>
        <h6>Achtung: bitte schreiben Sie Räumename ohne leerzeichen</h6>
        <br>
        
        <div class="field">
            <Input bind:value = {roomname} class="input" label="Raumname"  type="text" required/>
            <br>
            <Button class="button is-primary" type="submit"> Raum hinzufügen </Button>
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
     