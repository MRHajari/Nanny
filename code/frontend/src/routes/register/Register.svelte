<script>
 
  import { authenticated } from '../../stores/auth'
  import ChildrenList from './children/ChildrenList.svelte'
  import EducatorRegister from './educator/EducatorList.svelte'
  import UserList from './users/UserList.svelte'
  import GroupList from './groups/GroupList.svelte'
  import RoomsList from './rooms/RoomList.svelte'
  
  //it checks whether the user is logged in
  let auth
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'


  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../stores/auth'
	let userChech
  usernameCheck.subscribe(user => userChech = user);
  let messageUser = 'Sie dürfen diese Seite nicht besuchen!';



</script>



<br>
{#if auth}
  {#if userChech}


    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Kinder</button>
        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Erzieher/in</button>
        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Benutzer</button>
        <button class="nav-link" id="nav-grupe-tab" data-bs-toggle="tab" data-bs-target="#nav-grupe" type="button" role="tab" aria-controls="nav-grupe" aria-selected="false">Gruppen</button>
        <button class="nav-link" id="nav-room-tab" data-bs-toggle="tab" data-bs-target="#nav-room" type="button" role="tab" aria-controls="nav-room" aria-selected="false">Räume</button>
      </div>
    </nav>

    <br/>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"><UserList/></div>
      <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"><ChildrenList/></div>
      <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"><EducatorRegister/></div> 
      <div class="tab-pane fade" id="nav-grupe" role="tabpanel" aria-labelledby="nav-grupe-tab"><GroupList/></div>
      <div class="tab-pane fade" id="nav-room" role="tabpanel" aria-labelledby="nav-room-tab"><RoomsList/></div>
    </div>




  {/if}
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