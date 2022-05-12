<script>
    import { authenticated } from '../../../stores/auth';
    import moment from 'moment';
    import TV from './TV.svelte';
    import LocationControl from './LocationControl.svelte';
   

  
    function getCurrentDate() {
      return moment().format(`DD.MM.YYYY`)
    }
  
  

    //it checks whether the user is logged in
    let auth = false
    authenticated.subscribe(a => auth = a);
    let message = 'Sie sind nicht eingeloggt!';
  
  





  
  </script>
  







{#if auth}
  
    

    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">TV</button>
        <button class="nav-link" id="nav-grupe-tab" data-bs-toggle="tab" data-bs-target="#nav-grupe" type="button" role="tab" aria-controls="nav-grupe" aria-selected="false">Standortkontrolle</button>
      </div>
    </nav>
       
    <div>
      <h1>{getCurrentDate()}</h1>
    </div>

    <br/>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"><TV/></div>
 
      <div class="tab-pane fade" id="nav-grupe" role="tabpanel" aria-labelledby="nav-grupe-tab"><LocationControl/></div>
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


	.message {
		display: flex;
    justify-content: center;
    background: none;
	}
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