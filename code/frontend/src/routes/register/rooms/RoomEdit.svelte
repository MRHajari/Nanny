<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import {rooms} from './data-rooms.js'
  import {onMount} from 'svelte'
  import Room from './Room.svelte'
  import { authenticated } from '../../../stores/auth'


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

  // fetch rooms list from database 
  onMount (async()=> {
    fetchRooms();
  })



  // Edit functions
  let room_id = '', roomname = ''
  const gotoEditPage =  (roomData) =>{
    room_id = roomData.room_id
    roomname = roomData.roomname
  }
  
  let msg = ''
  const editRoom = async () =>{
    const url = 'http://localhost:3333/api/rooms/editRoom'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        room_id,
        roomname
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchRooms();
  };


  // delete functions
  const gotoDelete = async (roomData) =>{
    room_id = roomData.room_id
    roomname = roomData.roomname
    const url = 'http://localhost:3333/api/rooms/deleteRoom'
    let res = await fetch(url, {
        method: 'POST',
          headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          room_id,
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

    <!-- outputs returned message  -->
    {#if  msg}
    <div class="alert alert-success alert-dismissible" role="alert">
      <p><strong>{msg}</strong></p> 
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    {/if}


    <!-- Shows rooms list result -->
    <div class="tab-content" id="rooms-tabContent">
      <div class="tab-pane fade show active" id="rooms-home" role="tabpanel" aria-labelledby="rooms-home-tab">
          <div class="tab-pane fade show active" id="v-rooms-home" role="tabpanel" aria-labelledby="v-rooms-home-tab">
            <div id="rooms">
              <table class="table table-striped" >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Raumname</th>
                    <th scope="col"><div class="lastColspan">Bearbeiten  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  Löschen &nbsp &nbsp &nbsp</div></th>
                  </tr>
                </thead>
                <tbody>
                  {#each $rooms as room, index(room.room_id)}
                    <tr>
                      <th scope="row">{index+1}</th>
                      <th ><Room {room}/></th>
                      <th class="lastColspan">
                        <button class="btn btn btn bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#roomModal"  on:click={gotoEditPage(room)}>Bearbeiten &nbsp &nbsp &nbsp &nbsp</button>
                        <button class="btn btn bi bi-trash" on:click={gotoDelete(room)} >löschen</button>
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
    <div class="modal fade" id="roomModal" tabindex="-1" aria-labelledby="roomModalLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabelRoom"> Raum bearbeiten</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <!-- Room register form -->
            <form on:submit|preventDefault={editRoom}> 
              <div class="field">
                  <Input bind:value = {roomname}  placeholder={roomname} class="input" label="Raumname"  type="text" required/>
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
 