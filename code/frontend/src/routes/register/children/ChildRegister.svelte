<script>
  import Button from "../../../components/Button.svelte"
  import Input from "../../../components/Input.svelte"
  import { authenticated } from '../../../stores/auth'
  import {onMount} from 'svelte'
  import { groups } from '../groups/data-groups.js'
  import Group from '../groups/Group.svelte'
  import {children} from './data-children.js'
  import {serverPort} from '../../LogIn.svelte'


  //it checks whether the user is logged in
  let auth = false
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'

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



  // Register function
  let selectedIdGroup = ''
  
  let firstname = '', lastname = '', kind = ''
  let msg = ''
  const submit = async () =>{
     const url = serverPort + 'children/register'
    let res = await fetch( url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstname,
        lastname,
        kind,
        group_id: selectedIdGroup
     })
    })
    fetchGroups();
    res = await res.json()
    msg = `${res.msg}`
    fetchChildren();
  };



</script>



{#if auth}
  {#if userCheck}

    <!-- outputs returned messag   -->
    {#if  msg}
      <div class="alert alert-success alert-dismissible" role="alert">
        <p><strong>{msg}</strong></p> 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    {/if}

    {#if $groups.length}
      <!-- Register form  -->
      <form id="children" class="box" on:submit|preventDefault={submit}>

        <p class="title"> Kinder registrieren </p>
        <div class="field">
            <Input bind:value = {firstname} class="input" label="Vorname"  type="text" required/>
            <Input bind:value = {lastname} class="input" label="Nachname"  type="text" required/>
            <Input bind:value = {kind} class="input" label="Art"  type="text" />
            
            <!-- Shows groups list  -->
            <div id="groups"> 
                {#each $groups as group}
                  <div  id="groups" class="form-check form-check-inline">
                    <input bind:group = {selectedIdGroup} value = {group.group_id} class="form-check-input" id="form-check-group" type="radio" name="inlineRadioOptions"  required >
                    <!-- svelte-ignore a11y-label-has-associated-control -->  
                    <label class="form-check-label" id="form-check-group" ><Group {group}/></label> 
                </div>
                {/each}
            </div>  
            <br>
            <Button class="" type="submit"> hinzufügen </Button>
        </div>
      </form>
    {:else}
      <br>
      <h4>Bitte erst Gruppen hinzufügen</h4>
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