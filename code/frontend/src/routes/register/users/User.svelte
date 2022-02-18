<script>
  export let user = {}
  import { authenticated } from '../../../stores/auth'
  import {onMount} from 'svelte'


  //it checks whether the user is logged in
  let auth = false
  authenticated.subscribe(a => auth = a);
  let message = 'Sie sind nicht eingeloggt!'


  // it checks which user is logged in. 
  //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
  let currentUser = ' not '
  onMount(async () => {
      const response = await fetch('http://localhost:3333/api/user/currentUser', {
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
      })
      const content = await response.json();
      currentUser = `${content.user.username}` 
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