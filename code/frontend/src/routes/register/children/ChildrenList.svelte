<script>
  import { children } from './data-children.js'
  import {onMount} from 'svelte'
  import Child from './Child.svelte'
  import ChildRegister from './ChildRegister.svelte'
  import ChildEdit from './ChildEdit.svelte'
  import { authenticated } from '../../../stores/auth'
  import {serverPort} from '../../LogIn.svelte'


  //it checks whether the user is logged in
  let auth
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'


  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../../stores/auth'
	let userCheck 
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

  


  // scarch function
  let textForSearch = ''
  const findChildren = async () =>{
  const url = serverPort + 'children/childrenFind'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      textForSearch
      })
    })
    res = await res.json()
    $children = res.child
  };


</script> 


{#if auth}
  {#if userCheck}

  <!-- Serch form -->
  <form class="d-flex" on:input|preventDefault={findChildren} >
      <input class="form-control me-2" type="search" placeholder="suchen" bind:value = {textForSearch}  aria-label="Geben Sie die Name ein, um zu suchen">
  </form>
  <br/>

  <!-- Show linka button to list, Add and Edit/Delete -->
  <ul class="nav nav-pills mb-3" id="children-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="children-home-tab" data-bs-toggle="pill" data-bs-target="#children-home" type="button" role="tab" aria-controls="children-home" aria-selected="true">Liste</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="children-profile-tab" data-bs-toggle="pill" data-bs-target="#children-profile" type="button" role="tab" aria-controls="children-profile" aria-selected="false">Hinzufügen</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="children-contact-tab" data-bs-toggle="pill" data-bs-target="#children-contact" type="button" role="tab" aria-controls="children-contact" aria-selected="false">Bearbeiten/Löschen</button>
    </li>
  </ul>

  

  <!-- Shows result -->
  <div class="tab-content" id="children-tabContent">
    <div class="tab-pane fade show active" id="children-home" role="tabpanel" aria-labelledby="children-home-tab">
        <div class="tab-pane fade show active" id="v-children-home" role="tabpanel" aria-labelledby="v-children-home-tab">
            
          <div  id="children" >
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>

              <tbody>
                {#each $children as child, index(child.id)}
                <tr>
                  <th scope="row">{index+1}</th>
                  <th class="list-child-item"><Child {child}/></th>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <!-- Linka button to list, Add and Edit/Delete -->
    <div class="tab-pane fade" id="children-profile" role="tabpanel" aria-labelledby="children-profile-tab"><ChildRegister/></div>
    <div class="tab-pane fade" id="children-contact" role="tabpanel" aria-labelledby="children-contact-tab"><ChildEdit/></div>
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
