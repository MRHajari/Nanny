<script>
  import { onMount } from 'svelte'
  import { authenticated } from '../../stores/auth'
  import { groups } from '../register/groups/data-groups.js'
  import Group from '../register/groups/Group.svelte'
  import { children } from './data-childrens-abwesened.js'
  import  ChildrenName from './ChildrenName.svelte'
  import {serverPort} from '../LogIn.svelte'

  let currentClassIsEnter = "btn btn-outline-success"
  let currentClassIsexit = "btn btn-outline-danger"
  let currentClassDescription = "btn btn-outline-info "
  

  //it checks whether the user is logged in
  let auth 
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'



 
  // fetched gropup liste from database  
  onMount (async()=> {
    const url = serverPort + 'groups/groupslist'
    let res = await fetch (url)
    res = await res.json()
    $groups = res.group
  });



  // shows List of children for each group  
  const childrenListOfGroups = async(groupname)=>{
    if (groupname === 'allKinder'){
      fetchChildren()
    }else{
      const url = serverPort + 'absence/childrenListOfGroups'
    let res = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupname
      })
    })
    res = await res.json()
    $children = res.child
    }
  };

  let groupName = '', groupNameToCheck = ''
  const groupNameOfChildrenList = (groupNemeFromButton)=>{
    groupName = groupNemeFromButton
    groupNameToCheck = groupName
    childrenListOfGroups(groupName)
  };



  //fetched children list
  const fetchChildren = async () => {
    const url = serverPort + 'absence/childrenlist'
      let res = await fetch (url)
      res = await res.json()
      $children = res.child
    }

  // fetch childrens list from database 
  onMount (async()=> {
    fetchChildren();
  })
  

  
 
   // if someone clicked on button "Abmelden", it write date and hour in datenbank
  const enterChildrenToKindergarten = async (childrenData) =>{
    let absence_id = childrenData.absence_id
  const url = serverPort + 'absence/enterChildren'
    await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        absence_id
      })
    })
   
  };
  
  
  // if someone clicked on button "Abholen", it write date and hour in datenbank
  const exitChildrenFromKindergarten = async (childrenData) =>{
    let absence_id = childrenData.absence_id
    const url = serverPort + 'absence/exitChildren'
     await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        absence_id
      })
    })
    fetchChildren();
  };
  
  
  // if someone clicked on button "Anmerkung",opens the notation window 
  let descriptionId = ''
  let descriptionText = ''
  const gotoDescriptionPage = async (childrenData) => {
    descriptionId = childrenData.absence_id
    descriptionText = childrenData.description
  }

  const saveDescription = async () => {
    let absence_id = descriptionId
    let description = descriptionText
    const url = serverPort + 'absence/saveDescription'
    await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        absence_id,
        description
      })
    })
    fetchChildren();
  };
  
  
  

  // scarch function
  let textForSearch = ''
  const findChildren = async () =>{
  const url = serverPort + 'absence/childrenFind'
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
  
  


    // shows list of children present in kindergarten  
    const presentChildrenList = async()=>{
      const url = serverPort + 'absence/presentChildrenList'
      let res = await fetch (url)
      res = await res.json()
      $children = res.child
    };

    
     // shows list of children absent in kindergarten  
     const absentChildrenList = async()=>{
      const url = serverPort + 'absence/absentChildrenList'
      let res = await fetch (url)
      res = await res.json()
      $children = res.child
    };




</script> 




{#if auth}


  <!-- shows group button -->
  <br>
    <div id="groups">
        <button on:click={groupNameOfChildrenList(groupName = 'allKinder')} type="button" class="btn btn-outline-secondary"> Alle Kinder</button>
        <button on:click={presentChildrenList} type="button" class="btn btn-outline-secondary"> Anwesend</button>
        <button on:click={absentChildrenList(groupName = 'Abgeholt')} type="button" class="btn btn-outline-secondary"> Abgeholt</button>

        {#each $groups as group, index(group.group_id)}
        <div class="choiceGroup ">
          {groupName = group.groupname}
        </div>
        <button on:click={groupNameOfChildrenList(group.groupname)} type="button" class="btn btn-outline-secondary"><Group {group}/></button>
        {/each}
    </div>
  <br>
  <div class="displayCheck">
      {#if groupNameToCheck === 'allKinder'}
      { fetchChildren() }
      {:else if groupNameToCheck === groupName}
      {childrenListOfGroups(groupName)}
      {/if}
  </div>





  <!-- Serch form -->
  <form class="d-flex" on:input|preventDefault={findChildren} >
    <input class="form-control me-2" type="search" placeholder="Search" bind:value = {textForSearch}  aria-label="Geben Sie die Name ein, um zu suchen">
  </form>
  <br/>
  
       
  <!--Shows result -->
  <div class="children">
  <div id="child">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Kinder name</th>
        </tr>
      </thead>
      
      <tbody >
        {#each $children as child, index(child.absence_id)}
      
          <!-- checks whether each child is checked in or checked out -->
          <div class="displayCheck">
            {#if child.enter_child}
              { currentClassIsEnter = "btn btn-outline-success active" }
            {/if}
            {#if child.exit_child}
              { currentClassIsexit = "btn btn-outline-danger active" }
            {/if}
            {#if child.description}
              { currentClassDescription = "btn btn-outline-info active" }
            {/if}
          </div>
        <tr>
          <th scope="row">{index+1}</th>
          <th class="list-children-item"><ChildrenName  {child}/></th>
          <th class="lastColspan">

              <!-- Toggel Button - checkin and checkout for childrens -->
              <button on:click={enterChildrenToKindergarten(child)}  type="button" class={currentClassIsEnter} data-bs-toggle="button"> Anmelden </button>
              <div> &nbsp &nbsp &nbsp</div>
              {#if child.enter_child}
              <button on:click={exitChildrenFromKindergarten(child)}  type="button" class={currentClassIsexit}  data-bs-toggle="button">Abholen</button>
              <div> &nbsp &nbsp &nbsp</div> 
              {:else}
              <div> &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp</div> 
              {/if}
              <!-- Description form button for each child  -->
              <button on:click={gotoDescriptionPage(child)} type="button" class={currentClassDescription} data-bs-toggle="modal" data-bs-target="#absenceModal" >Anmerkung</button>
        </th>   
        </tr>
     {/each}
    </tbody>
  </table>



  <!-- Description form for each child  -->
  <div class="modal fade" id="absenceModal" tabindex="-1" aria-labelledby="absenceModalLabel" aria-hidden="true">
    <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title" id="absenceModalLabel">Anmerkung:  </h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
         <div class="form-group">
           <label for="absenceFormControlTextarea1">textarea</label>
           <textarea bind:value = {descriptionText}  placeholder={descriptionText} class="form-control" id="absenceFormControlTextarea1" rows="3"></textarea>
         </div>
         <form on:click={saveDescription} >
             <div class="modal-footer" >
               <button type="button" class="btn btn-secondary"  data-bs-dismiss="modal">Close</button>
               <button  type="button"  class="btn btn-primary" >Save changes </button>
             </div>
           </form>
       </div>
   </div>
   </div>
 </div>
 
  </div>
  </div>  







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

  .choiceGroup{
    display: none;
  }

  .lastColspan{
		position: relative;
		display: flex;
    justify-content: right;
  }
  
    .displayCheck{
      display:none;
    }
    

</style>
 