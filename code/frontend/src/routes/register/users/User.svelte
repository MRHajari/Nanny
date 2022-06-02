<script>
  export let user = {}
  import { authenticated } from '../../../stores/auth'
  import {onMount} from 'svelte'
  import {serverPort} from '../../LogIn.svelte'
  import axios  from 'axios';


  //it checks whether the user is logged in
  let auth 
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'


  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
  let currentUser = ' not '
  onMount(async () => {
    const url = serverPort + 'user/currentUser'
    const res  = await axios.get(url);
      currentUser = `${res.data.username}` 
  });




</script>


{#if currentUser === 'admin'}
  {#if auth}

  <div class="user">
      <h6> {user.username}</h6> 
  </div>


  {:else}
  <!-- unauthenticated message -->
  {message}
  {/if}
{/if}