<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import {children} from './data-children.js'
  import {onMount} from 'svelte'
  import Child from './Child.svelte'
  import { authenticated } from '../../../stores/auth'
  import { groups } from '../groups/data-groups.js'
  import Group from '../groups/Group.svelte'
  import {serverPort} from "../../LogIn.svelte"


  //it checks whether the user is logged in
  let auth = false
  authenticated.subscribe(a => auth = a);
  let message = 'Du bist nicht eingeloggt!'

    // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userCheck = false
  usernameCheck.subscribe(user => userCheck = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!';


  //fetched children list
  const  fetchChildren = async () => {
    const url = serverPort + 'children/childrenList'
      let res = await fetch (url)
      res = await res.json()
      $children = res.child
  }

  // fetch children list from database 
  onMount (async()=> {
    fetchChildren();
  })



  // fetches a list of groups that have already been registered
  const  fetchGroups = async () => {
    const url = serverPort + 'groups/groupsList'
      let res = await fetch (url)
      res = await res.json()
      $groups = res.group
  }

  // fetch groups list from database 
  onMount (async()=> {
    fetchGroups();
  })


  // Edit functions
  let selectedIdGroup = ''
  let id = '', firstname = '', lastname = '', kind = '', group_id = '', msg = ''

  const gotoEditPage =  (childData) =>{
    id = childData.id
    firstname = childData.firstname
    lastname = childData.lastname
    kind = childData.kind
    group_id = childData.group_id
  }
  
  const editChildren = async () =>{
    const url = serverPort + 'children/editChildren'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id,
        firstname,
        lastname,
        kind,
        group_id: selectedIdGroup
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchChildren();
  };



  // delete functions
  const gotoDelete = async (childData) =>{
    id = childData.id
    firstname = childData.firstname,
    lastname = childData.lstname

    const url = serverPort + 'children/deleteChildren'
    let res = await fetch(url, {
        method: 'POST',
          headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id,
          firstname,
          lastname
        })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchChildren();
  };


let groupIdForGroups
let groupIdForchildren;

</script>




{#if auth}
  {#if userCheck}

    <!-- outputs returned messag  -->
    {#if  msg}
    <div class="alert alert-success alert-dismissible" role="alert">
      <p><strong>{msg}</strong></p> 
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    {/if}


    <!-- Shows children list result -->
    <div class="tab-content" id="children-tabContent">
      <div class="tab-pane fade show active" id="children-home" role="tabpanel" aria-labelledby="children-home-tab">
          <div class="tab-pane fade show active" id="v-children-home" role="tabpanel" aria-labelledby="v-children-home-tab">
            <div id="child" class="child">
              <table class="table table-striped" >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Kindername</th>
                    <th scope="col"><div class="lastColspan">Bearbeiten  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp  Löschen &nbsp &nbsp &nbsp</div></th>
                  </tr>
                </thead>
                <tbody>
                  {#each $children as child, index(child.id)}
                    <tr>
                      <th scope="row">{index+1}</th>
                      <th ><Child {child}/></th>
                      <th class="lastColspan">
                        <button class="btn btn btn bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#childrenModal"  on:click={gotoEditPage(child)}>Bearbeiten &nbsp &nbsp &nbsp &nbsp</button>
                        <button class="btn btn bi bi-trash" on:click={gotoDelete(child)} >Löschen</button>
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
    <div class="modal fade" id="childrenModal" tabindex="-1" aria-labelledby="childrenModalLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabelchildren">Kind bearbeiten</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- children register form -->
            <form on:submit|preventDefault={editChildren}> 

              <div class="field">
                <Input bind:value = {firstname} placeholder={firstname} class="input" label="Vorname"  type="text" required/>
                <Input bind:value = {lastname} placeholder={lastname} class="input" label="Nachname"  type="text" required/>
                <Input bind:value = {kind} placeholder={kind} class="input" label="Art"  type="text" />
                
                <!-- Shows groups list  -->
                <div id="groups"> 
                  {#each $groups as group}
                    <div class="form-check form-check-inline">
                      <input bind:group = {selectedIdGroup} placeholder={selectedIdGroup} value = {group.group_id} class="form-check-input" id="form-check-group" type="radio" name="inlineRadioOptions"  required >
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="form-check-label" id="form-check-group" ><Group {group}/></label> 
                  </div>
                  {/each}
              </div>  
              
                  <br>
                  <Button class="button is-primary" type="submit"> Speichern </Button>
                </div>
          </form>
          <br/>
          <!-- gibt zurückgekommene messag aus   -->
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
 