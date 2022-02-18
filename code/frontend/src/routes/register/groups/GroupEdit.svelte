<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import {groups} from './data-groups.js'
  import {onMount} from 'svelte'
  import Group from './Group.svelte'
  import { authenticated } from '../../../stores/auth'
  import { rooms } from '../rooms/data-rooms.js'
  import Room from '../rooms/Room.svelte'

  //it checks whether the group is logged in
  let auth = false
  authenticated.subscribe(a => auth = a);
  let message = 'You are not logged in!'


  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userChech = false
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!'



 // List counter
 let counter = 1;
  function caunternumber(){
    return counter++
  }

  //fetched groups list
  const  fetchGroups = async () => {
    const url = 'http://localhost:3333/api/groups/groupsList'    
      let res = await fetch (url)
      res = await res.json()
      $groups = res.group
  }

  // fetch groups list from database 
  onMount (async()=> {
    fetchGroups();
  })


  // fetches a list of rooms that have already been registered
  const  fetchRooms = async () => {
    const url = 'http://localhost:3333/api/rooms/roomsList'    
      let res = await fetch (url)
      res = await res.json()
      $groups = res.user
  }


  // Edit functions
  let selectedRoom = '' 
  let group_id = '', groupname = ''
  const gotoEditPage =  (groupData) =>{
    group_id = groupData.group_id
    groupname = groupData.groupname
  }
    let msg = ''
    const editGroup = async () =>{
    const url = 'http://localhost:3333/api/groups/editgroup'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        group_id,
        groupname,
        room_id: selectedRoom
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchGroups()
  };



  // delete functions
  const gotoDelete = async (groupData) =>{
    group_id = groupData.group_id
    groupname = groupData.groupname
    const url = 'http://localhost:3333/api/groups/deletegroup'
    let res = await fetch(url, {
        method: 'POST',
          headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          group_id
        })
    })
    
    res = await res.json()
    msg = `${res.msg}`
    fetchGroups()
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


    <!-- Shows groups list result -->
    <div class="tab-content" id="groups-tabContent">
      <div class="tab-pane fade show active" id="groups-home" role="tabpanel" aria-labelledby="groups-home-tab">
          <div class="tab-pane fade show active" id="v-groups-home" role="tabpanel" aria-labelledby="v-groups-home-tab">
            <div id="groups">
              <table class="table table-striped" >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Gruppename</th>
                    <th scope="col"><div class="lastColspan">Bearbeiten  &nbsp &nbsp  &nbsp &nbsp  löschen  &nbsp &nbsp &nbsp</div></th>
                  </tr>
                </thead>
                <tbody>
                  {#each $groups as group, index(group.group_id)}
                    <tr>
                      <th scope="row">{index+1}</th>
                      <th ><Group {group}/></th>
                      <th class="lastColspan">
                        <button class="btn btn btn bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#groupModal"  on:click={gotoEditPage(group)}>edit &nbsp &nbsp &nbsp &nbsp</button>
                        <button class="btn btn bi bi-trash" on:click={gotoDelete(group)} >löschen</button>
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
    <div class="modal fade" id="groupModal" tabindex="-1" aria-labelledby="groupModalLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabelgroup">Gruppe bearbeiten</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- group register form -->
            <form on:submit|preventDefault={editGroup}> 

              <div class="field">
                  <Input bind:value = {groupname}  placeholder={groupname} class="input" label="Gruppename"  type="text" required/>
                  
                  <!-- shows all rooms  -->
                  <div id="rooms"> 
                    {#each $rooms as room}
                      <div  id="groups" class="form-check form-check-inline">
                        <input bind:group = {selectedRoom} value = {room.room_id} class="form-check-input" id="form-check-group" type="radio" name="inlineRadioOptions" >
                        <!-- svelte-ignore a11y-label-has-associated-control -->  
                        <label class="form-check-label" id="form-check-group" ><Room {room}/></label> 
                    </div>
                    {/each}
                </div>  
                  
                  <br>
                  <Button class="button is-primary" type="submit">Speichern</Button>
                </div>
          </form>
          <br/>
          <!-- outputs returned messag  -->
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
