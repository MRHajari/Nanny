<script>
  import {rooms} from './data-rooms.js'
  import {onMount} from 'svelte'
  import Room from './Room.svelte'
  import RoomRegister from './RoomRegister.svelte'
  import RoomEdit from './RoomEdit.svelte'
  import { authenticated } from '../../../stores/auth'

  // List counter
  let counter = 1;
  function caunternumber(){
    return counter++
  }

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


  // scarch function
  let searchText = ''
  const findRoom = async () =>{
  const url = 'http://localhost:3333/api/rooms/roomFind'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      searchText
      })
    })
    res = await res.json()
    $rooms = res.room
  };

</script> 


{#if auth}
  {#if userChech}

  <!-- Serch form -->
  <form class="d-flex" on:input|preventDefault={findRoom} >
      <input class="form-control me-2" type="search" placeholder="Geben Sie den Raumnamen ein, um zu suchen" bind:value = {searchText}  aria-label="Geben Sie die Name ein, um zu suchen">
  </form>
  <br/>


  <!-- Show linka button to list, Add and Edit/Delete -->
  <ul class="nav nav-pills mb-3" id="rooms-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="rooms-home-tab" data-bs-toggle="pill" data-bs-target="#rooms-home" type="button" role="tab" aria-controls="rooms-home" aria-selected="true">Räumeliste</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="rooms-profile-tab" data-bs-toggle="pill" data-bs-target="#rooms-profile" type="button" role="tab" aria-controls="rooms-profile" aria-selected="false">Räume hinzufügen</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="rooms-contact-tab" data-bs-toggle="pill" data-bs-target="#rooms-contact" type="button" role="tab" aria-controls="rooms-contact" aria-selected="false"> Räume Bearbeiten / Löschen</button>
    </li>
  </ul>



  <!-- Shows result -->
  <div class="tab-content" id="rooms-tabContent">
    <div class="tab-pane fade show active" id="rooms-home" role="tabpanel" aria-labelledby="rooms-home-tab">
        <div class="tab-pane fade show active" id="v-rooms-home" role="tabpanel" aria-labelledby="v-rooms-home-tab">
            
          <div id="users">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name der Räume</th>
                </tr>
              </thead>

              <tbody>
                {#each $rooms as room, index(room.room_id) }
                <tr>
                  <th scope="row">{index+1}</th>
                  <th class="list-group-item"><Room {room}/></th>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <!-- Linka button to list, Add and Edit/Delete -->
    <div class="tab-pane fade" id="rooms-profile" role="tabpanel" aria-labelledby="rooms-profile-tab"><RoomRegister/></div>
    <div class="tab-pane fade" id="rooms-contact" role="tabpanel" aria-labelledby="rooms-contact-tab"><RoomEdit/></div>
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
