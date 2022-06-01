<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import {educators} from './data-educators.js'
  import {onMount} from 'svelte'
  import Educator from './Educator.svelte'
  import { authenticated } from '../../../stores/auth'
  import {serverPort} from '../../LogIn.svelte'

  // List counter
  let counter = 1;
  function caunternumber(){
    return counter++
  };


  //it checks whether the user is logged in
  let auth 
  authenticated.subscribe(a => auth = a);
  let message = 'You are not logged in!'

  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userChech 
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'You are not allowed to visit this page !';


  //fetched educators list
  const  fetchEducators = async () => {
    const url = serverPort + 'educators/educatorlist'
      let res = await fetch (url)
      res = await res.json()
      $educators = res.educator
  }

  //  fetch educators from database
  onMount (async()=> {
    fetchEducators();
  })


  
  // Edit functions
  let educator_id = '', firstname = '', lastname = ''
  const gotoEditPage =  (educatorData) =>{
    educator_id = educatorData.educator_id
    firstname = educatorData.firstname
    lastname = educatorData.lastname
  }
  
  let msg = ''
  const editEducator = async () =>{
    const url = serverPort + 'educators/editEducator'
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        educator_id,
        firstname,
        lastname
      })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchEducators()
  };


  // delete functions
  const gotoDelete = async (educatorData) =>{
    educator_id = educatorData.educator_id
    firstname = educatorData.firstname,
    lastname = educatorData.lstname

    const url = serverPort + 'educators/deleteEducator'
    let res = await fetch(url, {
        method: 'POST',
          headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          educator_id,
          firstname,
          lastname
        })
    })
    res = await res.json()
    msg = `${res.msg}`
    fetchEducators()
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


    <!-- Shows educators list result -->
    <div class="tab-content" id="educators-tabContent">
      <div class="tab-pane fade show active" id="educators-home" role="tabpanel" aria-labelledby="educators-home-tab">
          <div class="tab-pane fade show active" id="v-educators-home" role="tabpanel" aria-labelledby="v-educators-home-tab">
            <div id="educators">
              <table class="table table-striped" >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">educatorname</th>
                    <th scope="col"><div class="lastColspan">Edite  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  Delete &nbsp &nbsp &nbsp</div></th>
                  </tr>
                </thead>
                <tbody>
                  {#each $educators as educator, index(educator.educator_id)}
                    <tr>
                      <th scope="row">{index+1}</th>
                      <th ><Educator {educator}/></th>
                      <th class="lastColspan">
                        <button class="btn btn btn bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#educatorModal"  on:click={gotoEditPage(educator)}>edit &nbsp &nbsp &nbsp &nbsp</button>
                        <button class="btn btn bi bi-trash" on:click={gotoDelete(educator)} >delete</button>
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
    <div class="modal fade" id="educatorModal" tabindex="-1" aria-labelledby="educatorModalLabel" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabeleducator">Erzieher/in bearbeiten</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- educator register form -->
            <form on:submit|preventDefault={editEducator}> 

              <div class="field">
                  <Input bind:value = {firstname}  placeholder={firstname} class="input" label="Vorname"  type="text" required/>
                  <Input bind:value = {lastname}  placeholder={lastname} class="input" label="Nachname"  type="text" required/>
                  <br>
                  <Button class="button is-primary" type="submit"> Speichern </Button>
                </div>
          </form>
          <br/>
          <!--  outputs returned message  -->
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
 