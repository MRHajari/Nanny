<script>
    import { onMount } from 'svelte';
  
    import { authenticated } from '../../../stores/auth'
    import { rooms } from '../../register/rooms/data-rooms.js'
    import Room from '../../register/rooms/Room.svelte'
    import {serverPort} from '../../LogIn.svelte';
  
  
  
    //it checks whether the user is logged in
    let auth
    authenticated.subscribe(a => auth = a);
    let message = 'Sie sind nicht eingeloggt!';
  
  
  
   //fetched rooms list
   const  fetchRooms = async () => {
    const url = serverPort + 'rooms/roomsList'
      let res = await fetch (url)
      res = await res.json()
      $rooms = res.room
  }

  // fetch rooms list from database 
  onMount (async()=> {
    fetchRooms();
  })

  





  let msg = ''
  const trafficLightChange = async (room_id, trafficLight) =>{
    const url = serverPort + 'rooms/trafficLightChange'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        room_id,
        trafficLight
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchRooms();
  };



  const zustandChange = async (room_id, zustand) =>{
    const url = serverPort + 'rooms/zustandChange'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        room_id,
        zustand
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchRooms();
  };



 

  
</script>
  
  
  
  
  
{#if auth}

     
     <!-- Shows result -->
     <div class="tab-content" id="rooms-tabContent">
        <div class="tab-pane fade show active" id="rooms-home" role="tabpanel" aria-labelledby="rooms-home-tab">
            <div class="tab-pane fade show active" id="v-rooms-home" role="tabpanel" aria-labelledby="v-rooms-home-tab">
                
            <div id="users">
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name </th>
                        <th scope="col">Ampel umschalten</th>
                        <th scope="col">öffnen/schließen</th>
                    </tr>
                </thead>

                <tbody >
                    {#each $rooms as room, index(room.room_id) }
                
                        <tr >
                        <th >{index+1}</th>
                        <th ><Room {room}/></th>

                        <th>
                            <div class="trafficLight">
                                {#if room.trafficLight == 0}
                                    <button on:click={trafficLightChange(room.room_id, 1)} type="button" class="btn btn-danger">Grün</button>
                                {:else if room.trafficLight == 1 }
                                    <button on:click={trafficLightChange(room.room_id, 0)} type="button" class="btn btn-success">&nbsp Rot &nbsp</button>
                                {/if}
                            </div>
                        </th>

                        <th>
                            <div class="zustand">
                                {#if room.zustand == 0}
                                    <button on:click={zustandChange(room.room_id, 1)} type="button" class="btn btn-danger"> &nbsp öffnen &nbsp </button>
                                {:else if room.zustand == 1 }
                                    <button on:click={zustandChange(room.room_id, 0)} type="button" class="btn btn-success">schließen</button>
                                {/if}
                            </div>
                        </th>
                
                    </tr>
         
                    {/each}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>

  
  


  
  
{:else}
    <div class= "message">
        <h4>{message}</h4>
    </div>
    
    <div class= "message">
        <a href="../LogIn" class="link-primary"><h3>Log in</h3></a>
    </div>
{/if}
  
  
  


  
  
  
<style>



  
    .message {
        display: flex;
    justify-content: center;
    background: none;
    }
  

  
</style>