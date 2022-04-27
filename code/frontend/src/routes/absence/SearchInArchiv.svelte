<script>
  import { onMount } from 'svelte'
  import { groups } from '../register/groups/data-groups.js'
  import Group from '../register/groups/Group.svelte'
  import { childrenForArchive } from './data-childrens-abwesened.js'
  import  ChildrenDataForArchive from './ChildrenDataForArchive.svelte'
  import moment from 'moment';
  import { authenticated } from '../../stores/auth'


  
    //it checks whether the user is logged in
    let auth = false
    authenticated.subscribe(a => auth = a);
    let message = 'Sie sind nicht eingeloggt!'
  

  // fetched gropup liste from database  
  onMount (async()=> {
      const url = 'http://localhost:3333/api/groups/groupslist'
      let res = await fetch (url)
      res = await res.json()
      $groups = res.group
  });


  let firstname= '' 
  let lastname = ''
  let fromDay = ''
  let fromMonth = ''
  let fromYear  = ''

  let toDay = ''
  let toMonth = ''
  let toYear  = ''
  toDay = moment().format(`DD`).toString()
  toMonth =  moment().format(`MM`).toString()
  toYear  = moment().format(`YYYY`).toString()
  let selectedGroup = '' 


  // scarch function
  const searchForArchiv = async () =>{

    let groupname
    if(selectedGroup){
      groupname = selectedGroup
    } else {
       groupname = ''
    }

    let fromDate = ''
    if (fromDay && fromMonth && fromYear) {
      fromDate = `${fromYear}-${fromMonth}-${fromDay}`
    } else {
      fromDate = ''
    }

    let toDate = ''
    if (toDay && toMonth && toYear) {
        toDate = `${toYear}-${toMonth}-${toDay}`
    } 
   
   
  const url = 'http://localhost:3333/api/absence/searchForArchiv'
    let res   = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstname,
        lastname,
        groupname,
        fromDate,
        toDate
      })
    })
    res = await res.json()
    $childrenForArchive = res.child
  };











</script>




{#if auth}

<hr>
<h1>Geben Sie die gewünschten Daten für das Durchsuchen ein</h1>

    

<form class="row g-3 needs-validation" novalidate>
  <h6> Daten von Kinder ... </h6>
  <div class="col-md-6">
    <label for="inputFirstname" class="form-label">Vorname</label>
    <input type="text" class="form-control" id="inputFirstname" bind:value = {firstname} placeholder={firstname}  label="Vorname" >
  </div>
  <div class="col-md-6">
    <label for="inputLastname" class="form-label">Nachname</label>
    <input  bind:value = {lastname} placeholder={lastname}  type="text" class="form-control" id="inputLastname" >
  </div>



  <h6> Datum von ...</h6>
    <div class="col-md-4">
      <label for="inputFromDay" class="form-label">Tag</label>
      <input bind:value = {fromDay}  placeholder={fromDay} type="text" class="form-control" id="inputFromDay"/>
    </div>
    <div class="col-md-4">
      <label for="inputFromMonth" class="form-label">Monat</label>
      <input bind:value = {fromMonth}  placeholder={fromMonth} type="text" class="form-control" id="inputFromMonth"/>
    </div>
    <div class="col-md-4">
      <label for="inputFromYear" class="form-label">Jahr</label>
      <input bind:value = {fromYear}  placeholder={fromYear} type="text" class="form-control" id="inputFromYear"/>
    </div>


    <h6> Datum bis ...</h6>
    <div class="col-md-4">
      <label for="inputToDay" class="form-label">Tag</label>
      <input bind:value = {toDay}  placeholder={toDay} type="text" class="form-control" id="inputToDay"/>
    </div>
    <div class="col-md-4">
      <label for="inputToMonth" class="form-label">Monat</label>
      <input bind:value = {toMonth}  placeholder={toMonth} type="text" class="form-control" id="inputToMonth"/>
    </div>
    <div class="col-md-4">
      <label for="inputToYear" class="form-label">Jahr</label>
      <input bind:value = {toYear}  placeholder={toYear} type="text" class="form-control" id="inputToYear"/>
    </div>

 
    <div class="col-12">
      <br>
      <div class="form-check">
    {#each $groups as group, index(group.group_id)}
    <div class="form-check form-check-inline">
      <input bind:group={selectedGroup} placeholder={selectedGroup} value = {group.groupname} class="form-check-input" id="validationCustom09" type="radio" name="inlineRadioOptions"  >
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="form-check-label" id="form-check-group" ><Group {group}/></label> 
  </div>
  {/each}
</div></div>
 

 
  <div class="buttoStyle">
  <div class="col-12">
    <button on:click={searchForArchiv} class="btn btn-primary" type="button">Durchsuchen</button>
  </div>
</div>
  <br>
</form>




<table class="table table-bordered border-primary">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col"> &nbsp Name &nbsp  &nbsp &nbsp &nbsp  &nbsp &nbsp 
        Groppe &nbsp  &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
        Tag &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp  &nbsp &nbsp 
        Anmelden  &nbsp &nbsp  
        Abholen &nbsp &nbsp &nbsp  &nbsp &nbsp  &nbsp 
        Aktueller Raum
      </th>
 
    </tr>
  </thead>
  <tbody>
    <tr>
    </tr>
    <tbody>
      {#each $childrenForArchive as childForArchive, index(childForArchive.absence_id)}     
       <tr>
        <th scope="row">{index+1}</th>
        <div class="list-children-for-archive"><ChildrenDataForArchive  {childForArchive}/></div>
      </tr>
      {/each}
    </tbody>
    
</table>





{:else}
<div class= "message">
  <h4>{message}</h4>
</div>

<div class= "message">
  <a href="../LogIn" class="link-primary"><h3>Log in</h3></a>
</div>
{/if}




  <style>

  h1 { 
    color: #b48608; 
    font-family: 'Droid serif',serif; 
    font-size: 36px;
    font-weight: 400;
    font-style: italic;
    line-height: 44px;
    margin:0 0 45px;
    text-align: center; 
  }

  h6{
    margin-bottom: -7px;
    margin-top: 30px;
  }

 .row{
   
  box-shadow: rgba(89, 89, 180, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border: 0.5mm solid rgba(3, 102, 214, 0.3);
  padding: 1.2rem;
  
  }

 .buttoStyle {
    margin-bottom: 1.2rem;
 }
 .table{
   margin-top:2rem;
 }
 .list-children-for-archive{
   margin-bottom: -0.8rem;
   margin-top: 0.2rem;
 }
</style>
