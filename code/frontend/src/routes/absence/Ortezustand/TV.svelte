<script>
  import { onMount } from 'svelte';

  import { authenticated } from '../../../stores/auth'
  import { rooms } from '../../register/rooms/data-rooms.js'
  import Room from '../../register/rooms/Room.svelte'

  import {current_rooms} from '../../data-current_rooms.js'
  import {educators} from '../../register/educator/data-educators'
  import {childrenForlocation} from '../location_tracking/data-childreb-location'


  import {serverPort} from '../../LogIn.svelte'



  let childInEachRoomCaunterForHomePage = []
  let educatorInEachRoomCaunterForHomePage = []


  let src = "../../static/img/"
  let red = "-Rot.png"
  let green = "-Greun.png"
  let srcRoom





  //it checks whether the user is logged in
  let auth
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!';







  let educatorInLocationCunter
  // http://localhost:3333/api/educators/educatorInLocationCunter'
  const educatorInLocationCunterFunc = async () => {

      const url = serverPort + 'educators/educatorInLocationCunter'
      let res = await fetch(url, {
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
      })
      res = await res.json();
      educatorInLocationCunter = res.educator.length
  }
  educatorInLocationCunterFunc();
  

  

  const  fetchEducatorsForEachRoom = async (roomname, index) => {
  const url = serverPort + 'locationTracking/educatorsForEachRoom'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        roomname
      })
    })
    res = await res.json()
    $educators = res.educator
    educatorInEachRoomCaunterForHomePage[index]= $educators.length
    }





// shows List of children for each group  
const childrenListInEachroom = async(roomname, index) =>{
      const url = serverPort + 'locationTracking/childrenListInEachroom'
      let res = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          roomname
      })
      })
      res = await res.json()
      $childrenForlocation = res.child
      childInEachRoomCaunterForHomePage[index] = $childrenForlocation.length
  };

  
  let currentRoomsCaunter
  const fetchOccupiedRooms = async() =>{
      const url = serverPort + 'absence/occupiedRooms'
      let res = await fetch(url, {
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
      })
      res = await res.json();
  
      $current_rooms = res.occupiedRoom

      currentRoomsCaunter = $current_rooms.length
      for (let i = 0; i<$current_rooms.length; i++){
           childrenListInEachroom(res.occupiedRoom[i].current_room, i)
      }
      for (let i = 0; i<$current_rooms.length; i++){
          fetchEducatorsForEachRoom(res.occupiedRoom[i].current_room, i)
      }
  };

  onMount(async () =>{
      fetchOccupiedRooms()
  });






</script>






{#if auth}

  <div id="rooms"> 
      <div class="container">
          <div class="row">
              {#each $rooms as room, index(room)}
                <div class="notShow">
                  {srcRoom = src + room.img_name}

                  {#if room.trafficLight == 0}
                    {srcRoom = srcRoom + red}
                  {:else if room.trafficLight == 1}
                    {srcRoom = srcRoom + green}
                  {/if}
                </div>
                {#if room.zustand == 1 }

                    <div class="col-3">
                      <!-- svelte-ignore a11y-label-has-associated-control --> 
                      <div class="notShow">
                        <label><Room {room}/></label> 
                      </div> 
                    
                      <div class="roomname">
                        {#if room.img_name == null}
                          {room.roomname}
                        {/if}
                      </div>

                      <section class="locationInformation">
                        
                        <div class="img">
                          <img src={srcRoom} alt={room.img_name} />
  
                        </div>


                        <div>

  
                        <div class="information">
                          {#if childInEachRoomCaunterForHomePage[index]}
                            <h6>Zahl der Kinder  : {childInEachRoomCaunterForHomePage[index]}</h6>
                          {:else}
                            <h6>Zahl der Kinder  : 0</h6>
                          {/if}

                          {#if educatorInEachRoomCaunterForHomePage[index]}
                            <h6>Zahl der Erzieher: {educatorInEachRoomCaunterForHomePage[index]}</h6>
                          {:else}
                            <h6>Zahl der Erzieher: 0</h6>
                          {/if}
                        
                        </div>
  
                    </section>



                  </div>
                {/if}
              {/each}
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

.notShow{
  display: none;
}

  .message {
      display: flex;
  justify-content: center;
  background: none;
  }


.col-3{
  margin-bottom: 20px;
  padding: 15px;
}

.information{
position: relative;
/* display: flex; */
justify-content: left;

top: -65px;
left: 95px;
}

.roomname{
  position: absolute;
}


</style>