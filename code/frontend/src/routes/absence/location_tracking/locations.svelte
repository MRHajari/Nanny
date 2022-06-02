<script>
    import { authenticated } from '../../../stores/auth'
    import moment from 'moment';
    import ListOflocations from './ListOflocations.svelte'
    import EducatorInformation from './EducatorInformation.svelte'



    function getCurrentDate() {
      return moment().format(`DD.MM.YYYY`)
    }


    //it checks whether the user is logged in
    let auth
    authenticated.subscribe(a => auth = a);
    let message = 'Sie sind nicht eingeloggt!';










</script>




{#if auth}

<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Info</button>
    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Erzieher/innen </button>
  </div>
</nav>
 
  <div>
    <h1>{getCurrentDate()}</h1>
  </div>
 


  
  

  <div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"><ListOflocations/></div>
    <div class="tab-pane fade notShow active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"><EducatorInformation/></div>
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
    h1{
    margin: 0.7em 0 0.7em 0;
    font-weight: normal;
    position: relative;
    text-shadow: 0 -1px rgba(0,0,0,0.6);
    font-size: 28px;
    line-height: 40px;
    background: #355681;
    background: rgba(53,86,129, 0.8);
    border: 1px solid #fff;
    padding: 5px 15px;
    color: white;
    border-radius: 0 10px 0 10px;
    box-shadow: inset 0 0 5px rgba(53,86,129, 0.5);
    font-family: 'Muli', sans-serif;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;  
  }
</style>