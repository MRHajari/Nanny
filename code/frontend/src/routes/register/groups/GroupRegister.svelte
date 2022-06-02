<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import { authenticated } from '../../../stores/auth'
  import { groups } from './data-groups.js'
  import { rooms } from '../rooms/data-rooms.js'
  import Room from '../rooms/Room.svelte'
  import {serverPort} from '../../LogIn.svelte'


  //it checks whether the user is logged in
  let auth
  authenticated.subscribe(a => auth = a);
  let message = 'Du bist nicht eingeloggt!'

  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
  import { usernameCheck } from '../../../stores/auth'
  let userChech
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!';


  // fetches a list of rooms that have already been registered 
  const  fetchRooms = async () => {
    const url = serverPort + 'rooms/roomsList'
      let res = await fetch (url)
      res = await res.json()
      $rooms = res.room
  }


  // Register functiongroouüp
  let selectedRoom = ''
  let groupname = ''
  let msg = ''

  const submit = async () =>{
    let room_id = selectedRoom
    const url = serverPort + 'api/groups/register'
    let res = await fetch( url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          groupname,
          room_id
      })
    })
    fetchRooms()
    res = await res.json()
    msg = `${res.msg}`
  };





</script>



{#if auth}
  {#if userChech}

    <!-- outputs returned messag   -->
    {#if  msg}
      <div class="alert alert-success alert-dismissible" role="alert">
        <p><strong>{msg}</strong></p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    {/if}

    {#if $rooms.length}
      <!-- Register form  -->
      <form class="box" on:submit|preventDefault={submit}>
          <div class="field">
              <Input bind:value = {groupname} class="input" label="Gruppename"  type="text" required/>
              
              <!-- shows all rooms  -->
              <div id="rooms"> 
                {#each $rooms as room}
                  <div  id="groups" class="form-check form-check-inline">
                    <input bind:group = {selectedRoom}  value = {room.room_id} class="form-check-input" id="form-check-group" type="radio" name="inlineRadioOptions" >
                    <!-- svelte-ignore a11y-label-has-associated-control -->  
                    <label class="form-check-label" id="form-check-group" ><Room {room}/></label> 
                </div>
                {/each}
            </div>  

              <br>
              <Button class="button is-primary" type="submit"> Gruppe hinzufügen </Button>
            </div>
      </form>
    {:else}
      <br>
      <h4>Bitte erst Räume hinzufügen</h4>
    {/if}

    



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