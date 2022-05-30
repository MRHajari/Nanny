<script>
    import { authenticated } from '../../../stores/auth'
    import moment from 'moment';
    import { onMount } from 'svelte'
    import { rooms } from '../../register/rooms/data-rooms.js'
    import Room from '../../register/rooms/Room.svelte'
    import { childrenForlocation} from './data-childreb-location.js'
    import  ChildrenDataForLocation from './ChildrenDataForLocation.svelte'
    import { educators } from '../../register/educator/data-educators'
    import Educator from '../../register/educator/Educator.svelte'
    import { childrenToAdd} from './data-childreb-toAdd.js'
    import  ChildrenToAdd from './ChildrenToAdd.svelte'

    
    


    let collapseId = ''
    let data_bs_target = ''
    let panelsStayOpen_heading = ''
    let ariaExpanded = false
    let textForSearch = ''
    let childrenFindMsg = ''
    let roomnameForSearch = ''
    let roomFindMsg = ''
    let textForSearchEducator = ''
    let currentClassDescription = "btn btn-outline-info "
    let selectedRoom = ''
    let id01 = ''
    let aria_labelledby = ''
    let id02 = ''
    let data_bs_target02 = ''

  
    function getCurrentDate() {
      return moment().format(`DD.MM.YYYY`)
    }  
  
  
    //it checks whether the user is logged in
    let auth = false
    authenticated.subscribe(a => auth = a);
    let message = 'Sie sind nicht eingeloggt!'
  
  

    let childInEachRoomCaunter = []
    let educatorInEachRoomCaunter = []
   // fetched room liste from database  
   onMount (async()=> {
    const url = 'http://localhost:3333/api/rooms/roomslist'
    let res = await fetch (url)
    res = await res.json()
    $rooms = res.room
    for (let i = 0; i<$rooms.length; i++){
      childrenListInEachroom(res.room[i].roomname, i)
    }
    for (let i = 0; i<$rooms.length; i++){
      fetchEducatorsForEachRoom(res.room[i].roomname, i)
    }
  
  });


  //fetched educators list
  const  fetchEducatorsForEachRoom = async (roomname, index) => {
    const url = 'http://localhost:3333/api/locationTracking/educatorsForEachRoom'
      let res   = await fetch( url , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          roomname
        })
      })
      res = await res.json()
      $educators = res.educator
      educatorInEachRoomCaunter[index]= $educators.length
  }

  


  // shows List of children for each group  
  const childrenListInEachroom = async(roomname, index) =>{
    let roomName = roomname;
    const url = 'http://localhost:3333/api/locationTracking/childrenListInEachroom'
    let res = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        roomname: roomName
      })
    })
    res = await res.json()
    $childrenForlocation = res.child
    childInEachRoomCaunter[index] = $childrenForlocation.length
    fetchEducatorsForEachRoom(roomName)
  }

       
    

  


  const findChildrenForAdd = async () =>{

    const url = 'http://localhost:3333/api/absence/childrenFind'
      let res   = await fetch( url , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        textForSearch
        })
      })
    res = await res.json()
    $childrenToAdd = res.child
       }
  
  // if (res.child[0] && res.child[0].enter_child){
  //     addChildToRoom(roomname, res.child[0])
  //     childrenListInEachroom(roomname)
  // } else {
  //   childrenFindMsg = `Das Kind "${textForSearch}" wurde nicht gefunden!`
  // }




const sendChildToRoom = async(childData, roomname) =>{
    let absence_id = childData.absence_id
    const url = 'http://localhost:3333/api/locationTracking/addChildToRoom'
    let res = await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        roomname,
        absence_id
      })
    })
    fetchEducatorsForEachRoom(roomname)
    fetchEducatorsForEachRoom(roomname)

  }


  // const sendChildToAnotherRoom = async(childData, newRoom) =>{
  //   console.log(childData)
  //   console.log(newRoom)
  //   let searchText = roomnameForSearch
  //   const url = 'http://localhost:3333/api/rooms/roomFind'
  //     let res   = await fetch( url , {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         searchText
  //       })
  //     })
  // res = await res.json()
  // if (res.room[0]){
  //     addChildToRoom(res.room[0].roomname, childData)
  //     roomnameForSearch = ''
  //     childrenListInEachroom(currentRoom)
  // } else {
  //   roomFindMsg = `Das Zimmer "${textForSearch}" wurde nicht gefunden!`
  // }
  // }



  const setCurrentRoomForEducator = async(educatorId, roomname, roomnameToRefresch)=>{
    const url = 'http://localhost:3333/api/locationTracking/setCurrentRoomForEducator'
      let res   = await fetch( url , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          educator_id: educatorId,
          roomname: roomname
        })
      })

      let res1   = await fetch( 'http://localhost:3333/api/locationTracking/educatorsForEachRoom' , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          roomname: roomnameToRefresch
        })
      })
      res1 = await res1.json()
      $educators = res1.educator
      fetchEducatorsForEachRoom(roomname)
       fetchEducatorsForEachRoom(roomname)
  }
  


//http://localhost:3333/api/educators/educatorFind
  let textForSearchToShow
  const findEducatorToShow = async()=>{
    const url = 'http://localhost:3333/api/educators/educatorFind'
      let res   = await fetch( url , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          textForSearch: textForSearchToShow
        })
      })
  res = await res.json()
  $educators = res.educator
} 




  let descriptionId = ''
  let descriptionText = ''
  const gotoDescriptionPage = async (childrenData) => {
    descriptionId = childrenData.absence_id
    descriptionText = childrenData.description
  }

  const saveDescription = async () => {
    let absence_id = descriptionId
    let description = descriptionText
    const url = 'http://localhost:3333/api/absence/saveDescription'
    await fetch( url , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        absence_id,
        description
      })
    })
  };








  
</script>
  
  
  
  
{#if auth}
  


  {#if  childrenFindMsg}
    <div class="alert alert-success alert-dismissible" role="alert">
      <p><strong>{childrenFindMsg}</strong></p> 
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  {/if}
    
      



<div class="accordion" id="accordionExample">
  <div class="accordion-item">

    <!-- shows all rooms all titles for each room -->
    <div id="rooms">
      {#each $rooms as room, index(room.room_id)}

      <div class="notShow">
        {collapseId = 'collapse' + `${index+1}`}
        {panelsStayOpen_heading = 'panelsStayOpen-heading' + `${index+1}`}
        {data_bs_target = '#collapse' + `${index+1}` }
      </div>

      
      <h2 class="accordion-header" id="headingOne">
        <button on:click={childrenListInEachroom(room.roomname , index)} class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={data_bs_target} aria-expanded="true" aria-controls="collapseId">
            <div class="col-2 roomname"> <Room {room}/> </div> &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp
            <div class="col-9 alert alert-info"><h5>In diesem Raum befindet sich  <mark> { childInEachRoomCaunter[index] } </mark>  Kind/er und  <mark>{ educatorInEachRoomCaunter[index] } </mark> Erzieher/inen </h5></div>
        </button>
      </h2>

      <!-- shows body for  each  rooms  -->
      <div id={collapseId} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">   
           <div  id="children" >

            <!-- delete one educator from this room -->
            	<div class="alert alert-primary" role="alert">
              <div class="row">
                  {#each $educators as educator, index(educator.educator_id)}
                      <div class="col-6 ">
                        <div class="noEnter">
                  
                            <div class="col6">
                              <h6><Educator {educator}/></h6>
                              <button on:click={setCurrentRoomForEducator(educator.educator_id, ' ', room.roomname)} class="btn btn-warning"><i class="bi bi-person-dash"></i></button> 
                              <button on:click={setCurrentRoomForEducator(educator.educator_id, room.roomname, room.roomname)} class="btn btn-success"><i class="bi bi-person-plus"></i></button>
                             
                          </div>
                             
                        </div>
                      </div>
                  {/each}

                    <div class="container" >
                      <div class="row">
                        <div class="search">
                          <input bind:value = {textForSearchToShow} type="text" class="form-control input-sm" maxlength="64" placeholder="Name suchen" />
                          <button on:click={findEducatorToShow} type="submit" class="btnsearch btn-primary btn-sm">suchen</button>
                        </div>
                      </div>
                    </div>

              </div>
            </div>
           


            <!-- table heade  -->
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Kindername</th>
                  <th scope="col" class="lastColspan" >
                    <div class="notShow">
                      {id01 = `${room.roomname}`+ 'Modal'}
                      {aria_labelledby = `${room.roomname}` + 'ModalLabel'}
                      {id02 = `${room.roomname}`+ 'ModalLabel'}
                      {data_bs_target02 = '#' + `${room.roomname}`+ 'Modal'}
                    </div>

                      <div class="hstack gap-4">
                        <div>
                        </div>
                        <input bind:value = {textForSearch} class="form-control me-auto" id="inputChildNameForAddToRoom"  type="search" placeholder="Name suchen" aria-label="Add your item here...">

                        <!-- Button for add child  -->
                        <button on:click={findChildrenForAdd(textForSearch)} type="button" class="btn btn-success active" data-bs-toggle="modal" data-bs-target={data_bs_target02}>
                          <i class="bi bi-person-plus "></i>
                        </button>


                        <!-- Modal for add child -->
                        <div class="modal fade" id= {id01} tabindex="-1" aria-labelledby={aria_labelledby} aria-hidden="true">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id={id02}>Kind in Raum hinzufügen</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">

                                {#each $childrenToAdd as childToAdd, index(childToAdd.id)}
                                  <div class="list-child-item"> <ChildrenToAdd {childToAdd}/></div>  
                                  <div class="lastColspan" id="childAddButton">
                                    <button on:click={sendChildToRoom(childToAdd, room.roomname)} type="button" id ="personPlus"  class="btn btn-success"> <i class="bi bi-person-plus" ></i></button>
                                  </div>
                                {/each}

                              </div>
                            </div>
                          </div>
                        </div>

                    </div>
                  </th>
                </tr>
              </thead>



  
            <!-- shows children list whit Anmerkung and delete button  -->
              <tbody>
                {#each $childrenForlocation as childForLocation, index(childForLocation.id)}
                <div class="notShow">
                  {#if childForLocation.description}
                    { currentClassDescription = "btn btn-outline-info active" }
                  {/if}
                </div>

                <tr>
                  <th scope="row">{index+1}</th>
                  <th class="list-child-item"> <ChildrenDataForLocation {childForLocation}/></th>  
                  <th class="lastColspan">
                    <button on:click={gotoDescriptionPage(childForLocation)} type="button" class={currentClassDescription} id="Anmerkung" data-bs-toggle="modal" data-bs-target="#locationModal">Anmerkung</button>
                    &nbsp &nbsp &nbsp &nbsp 
                    
                    <div class="hstack gap-2">
          
                        <!-- Button trigger modal -->
                        <button  type="button" class="btn btn-warning active" data-bs-toggle="modal" data-bs-target="#sendChildModal">
                          <i class="bi bi-person-dash"></i>
                        </button>

                        <!-- Modal -->
                        <div class="modal fade" id="sendChildModal" tabindex="-1" aria-labelledby="sendChildModalLabel" aria-hidden="true">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="sendChildModalLabel">Orte</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
            

                                <!-- shows all rooms  -->
                                <div id="rooms"> 
                                  {#each $rooms as room}
                                    <div  id="groups" class="form-check form-check-inline">
                                      <input bind:group = {selectedRoom}  value = {room.roomname} class="form-check-input" id="form-check-group" type="radio" name="inlineRadioOptions" >
                                      <!-- svelte-ignore a11y-label-has-associated-control -->  
                                      <label class="form-check-label" id="form-check-group" ><Room {room}/></label> 
                                  </div>
                                  {/each}
                              </div>  

                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button  on:click={sendChildToRoom(childForLocation, selectedRoom)}  type="button" class="btn btn-primary">Ort wechseln</button>
                              </div>
                            </div>
                          </div>
                        </div>








                                      
                  
                  
                  </div>
                  </th>
                </tr>
                {/each}
              </tbody>
            </table>

        </div>
      </div>
    </div>
            




           
     <!-- Description form for each child  -->
    <div class="modal fade" id="locationModal" tabindex="-1" aria-labelledby="locationModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="locationModalLabel">Anmerkung:  </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="locationFormControlTextarea1">textarea</label>
              <textarea bind:value = {descriptionText}  placeholder={descriptionText} class="form-control" id="locationFormControlTextarea1" rows="3"></textarea>
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

       
      <h2 class="hrcolor">
          <hr>
      </h2>
      {/each}
    </div>
  </div>
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
  mark {
    background: linear-gradient(-100deg, hsla(48,92%,75%,.3), hsla(48,92%,75%,.7) 95%, hsla(48,92%,75%,.1));
    border-radius: 1em 0;
    padding: .5rem;
  }
  .message {
    display: flex;
    justify-content: center;
    background: none;
  }

   
  .roomname{
    color: #32557f;
    text-decoration: none;
    border-bottom: 2px dashed #32557f;
    padding-bottom: 3px;
  }
   
  .notShow{
    display: none;
  }
  .hrcolor{
    color: rgba(53,86,129, 0.8);
  } 

  .lastColspan{
  position: relative;
  display: flex;
  justify-content: right;
  }
  /* #Anmerkung{
    margin-right: 55px;
  } */

  /* #inputChildNameForAddToRoom{
    margin-top: -6px;
  } */

  /* #childAddButton{
    margin: 10px;
    right: 10px;
   
    top: -40px;
    
  } */

  .noEnter{
    position: relative;
    display: flex;

  }


  .col-2{
    justify-content: right;
  }

  .col-6{
    padding: 0.4rem;
  }



  .container{
    position: relative;
    display: flex;
    justify-content: right;
    padding-right: 28px;
    padding-top: 28px;
  }

  #personPlus{
    position: relative;
    top: -30px;
  }

  #search {
    float: right;
    margin-top: 9px;
    width: 250px;
}

.search {
    padding: 5px 0;
    width: 230px;
    height: 30px;
    position: relative;
    left: 10px;
    float: left;
    line-height: 22px;
}

    .search input {
        position: absolute;
        width: 0px;
        float: Left;
        margin-left: 210px;
        -webkit-transition: all 0.7s ease-in-out;
        -moz-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        height: 30px;
        line-height: 18px;
        padding: 0 2px 0 2px;
        border-radius:1px;
    }

        .search:hover input, .search input:focus {
            width: 200px;
            margin-left: 0px;
        }

.btnsearch {
    height: 30px;
    position: absolute;
    right: 0;
    top: 5px;
    border-radius:1px;
}

 
</style>