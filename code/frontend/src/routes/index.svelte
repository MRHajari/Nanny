<script >
	import { onMount } from 'svelte';
	import {current_rooms} from './data-current_rooms.js'
 	import RoomForStandort from './RoomForStandort.svelte'
	import {educators} from './register/educator/data-educators'
	import {childrenForlocation} from './absence/location_tracking/data-childreb-location'

	import { authenticated } from '../stores/auth'
	import axios  from 'axios';
	import {serverPort} from './LogIn.svelte'


	let childInEachRoomCaunterForHomePage = []
    let educatorInEachRoomCaunterForHomePage = []



	//  authention check 
	let auth = false
	authenticated.subscribe(a => auth = a);
	let message = ''

    //  User check 
	import { usernameCheck } from '../stores/auth'
    let userCheck
    usernameCheck.subscribe(cu => userCheck = cu);

	onMount(async () => {
			const url = serverPort + 'user/currentUser'
			const res  = await axios.get(url);
			if (res.status === 200){
				message = `als "${res.data.username}"`
				authenticated.set(true);
				if (res.data.username === 'admin'){
					usernameCheck.set(true);

				}
			} else {
				authenticated.set(false);
				usernameCheck.set(false);
				message = ' not '
			}
	});




	let childrenAbsenceCunter
	// http://localhost:3333/api/absence/chilrenInKindergartenCounter
	const chilrenInKindergartnCounte = async () => {

		const url = serverPort + 'absence/chilrenInKindergartenCounter'
		let res = await fetch(url, {
		headers: {'Content-Type': 'application/json'},
		credentials: 'include'
		})
		res = await res.json();
		childrenAbsenceCunter = res.childrenAbsenceCunter.length
	}

	chilrenInKindergartnCounte();



	let childrenpickedUPCunter
	// http://localhost:3333/api/absence/beenPickedUpchilrenCounter
	const beenPickedUpchilrenCounter = async () => {

		const url = serverPort + 'absence/beenPickedUpchilrenCounter'
		let res = await fetch(url, {
		headers: {'Content-Type': 'application/json'},
		credentials: 'include'
		})
		res = await res.json();
		childrenpickedUPCunter = res.childrenpickedUPCunter.length
	}
	beenPickedUpchilrenCounter();



	let educatorInLocationCunter
	// http://localhost:3333/api/educators/educatorInLocationCunter'
	const educatorInLocationCunterFunc = async () => {

		const url = serverPort + 'educators/educatorInLocationCunter'
		let res = await fetch(url, {
		headers: {'Content-Type': 'application/json'},
		credentials: 'include'
		})
		res = await res.json();
		educatorInLocationCunter = res.educator.length
	}
	educatorInLocationCunterFunc();




	const  fetchEducatorsForEachRoom = async (roomname, index) => {
    const url = serverPort + 'locationTracking/educatorsForEachRoom'
      let res   = await fetch( url , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          roomname
        })
      })
      res = await res.json()
      $educators = res.educator
      educatorInEachRoomCaunterForHomePage[index]= $educators.length
  	}


	// shows List of children for each group
	const childrenListInEachroom = async(roomname, index) =>{
		const url = serverPort + 'locationTracking/childrenListInEachroom'
		let res = await fetch( url , {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			roomname
		})
		})
		res = await res.json()
		$childrenForlocation = res.child
		childInEachRoomCaunterForHomePage[index] = $childrenForlocation.length
	};


	let currentRoomsCaunter
	const fetchOccupiedRooms = async() =>{
		const url = serverPort + 'absence/occupiedRooms'
		let res = await fetch(url, {
		headers: {'Content-Type': 'application/json'},
		credentials: 'include'
		})
		res = await res.json();

		$current_rooms = res.occupiedRoom

		currentRoomsCaunter = $current_rooms.length
		for (let i = 0; i<$current_rooms.length; i++){
     		childrenListInEachroom(res.occupiedRoom[i].current_room, i)
		}
		for (let i = 0; i<$current_rooms.length; i++){
			fetchEducatorsForEachRoom(res.occupiedRoom[i].current_room, i)
		}
	};

	onMount(async () =>{
		fetchOccupiedRooms()
	});







</script>




<svelte:head>
	<title>Nanny</title>
</svelte:head>
	
	
{#if auth}

	<section>
		<h1>
			<div class="welcome">
				<picture>
					<source srcset="svelte-welcome.webp" type="image/webp" />
					<img src="svelte-welcome.png" alt="Welcome" />
				</picture>
			</div>
			<h2 class="title is-3">
				<div class="notification is-primary">
					Sie sind <strong>{message}</strong> angemeldet!
				  </div>
				<div>
			</h2>
		</h1>
	</section>


	
	<section class="alert alert-primary">
			<div class="row">
				<div class="col-3 p-3 border">
					<br>
					<a href="/absence/Absence"><h3>Anwesenheit</h3></a>
					
				</div>
				<hr class="anwesenheit">
				<div class="col-sm-7 p-3 border">
					<h5>Zahl der anwesenden Kinder: &nbsp <mark>{childrenAbsenceCunter}</mark></h5>
					<br>
					<h5>Abgeholte Kinder : &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp<mark>{childrenpickedUPCunter}</mark></h5>
					<br>
					<h5>Anwesende Erzieher/innen : &nbsp  &nbsp  &nbsp<mark>{educatorInLocationCunter}</mark></h5>
					<br>
					<h5>Zahl offener Räume: &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp<mark>{currentRoomsCaunter}</mark></h5>
				</div>
			</div>	
	</section>
	<br/>


	<section class="alert alert-success">
		<div class="row">
			<div class="col-3 ">
				<br>
				<a href="/absence/location_tracking/locations">
					<h3>Belegung</h3>
				</a>
			</div>
			<hr class="standorte">



			<div class="col-8">


			<table>
				<thead>
					<tr>
						<th scope="col"># &nbsp &nbsp &nbsp</th>
						<th scope="col">Raumname  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp  &nbsp</th>
						<th scope="col">Anzahl Kinder  &nbsp &nbsp &nbsp &nbsp &nbsp </th>
						<th scope="col">Anzahl Erzieher/innen  </th>
					</tr>
	  			</thead>
				<hr size="8" width="1600%" color="grin">

				<tbody>
					{#each $current_rooms as roomForStandort, index(roomForStandort)  }
						<tr>
							<th scope="row">{index+1}</th>
							<th class="list-room-item"><RoomForStandort {roomForStandort}/></th>
							<th class="list-room-item" id="AnzahlcChildrenInRooms">{childInEachRoomCaunterForHomePage[index]}</th>
							<th class="list-room-item" id="AnzahlEducatorInRooms">{educatorInEachRoomCaunterForHomePage[index]}</th>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>



{:else}
    <div class= "message">
      <h4>You are not logged in</h4>
    </div>

    <div class= "message">
      <a href="./LogIn" class="link-primary"><h3>Log in</h3></a>
    </div>
{/if}



<style>
	#AnzahlcChildrenInRooms{
		text-align: center;
	}

	#AnzahlEducatorInRooms{
		text-align: center;
	}

	.message {
		display: flex;
    	justify-content: center;
   		background: none;
	}

	hr.anwesenheit{ 
 		margin-bottom: -0.3rem;
		border:         none;
		border-left:    0.5px solid hsla(200, 10%, 50%,100);
		height:         30vh;
		width:          0.5px;       
	}

	
	hr.standorte{ 
 		margin-bottom: -0.3rem;
		border:         none;
		border-left:    0.5px solid hsla(200, 10%, 50%,100);
		height:         50vh;
		width:          0.5px;       
	}

	mark {
		background: linear-gradient(-100deg, hsla(48,92%,75%,.3), hsla(48,92%,75%,.7) 95%, hsla(48,92%,75%,.1));
		border-radius: 1em 0;
		padding: .5rem;
	}
	
	
	a:link, a:visited {
  color: rgb(0, 0, 0);
  padding: 14px 25px;

  text-decoration: none;

}

a:hover, a:active {
	color: rgb(61, 27, 27);
}
</style>