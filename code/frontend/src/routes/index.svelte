<script>
	import { onMount } from 'svelte';
	import {current_rooms} from './data-current_rooms.js'
 	import RoomForStandort from './RoomForStandort.svelte'
	import {educators} from './register/educator/data-educators'
	import {childrenForlocation} from './absence/location_tracking/data-childreb-location'

	let childInEachRoomCaunterForHomePage = []
    let educatorInEachRoomCaunterForHomePage = []
	 
	//  authention check 
	import { authenticated } from '../stores/auth'
	let auth = false
	authenticated.subscribe(a => auth = a);
	let message = ''
	onMount(async () => {
		try{
			const response = await fetch('http://localhost:3333/api/user/currentUser', {
			headers: {'Content-Type': 'application/json'},
			credentials: 'include'
			});
			const content = await response.json();
			message = `mit "${content.user.username}"`
			authenticated.set(true);
		} catch (e) {
			message = ' not '
			authenticated.set(false);
		}
	});


	// User check function
	import { usernameCheck } from '../stores/auth'
	let currentUser
	onMount(async () => {
	try{
		const response = await fetch('http://localhost:3333/api/user/currentUser', {
		headers: {'Content-Type': 'application/json'},
		credentials: 'include'
		}); 

		const content = await response.json();
		currentUser = `${content.user.username}`

		if (currentUser === 'admin'){
			usernameCheck.set(true)
		} else{
			usernameCheck.set(false)
		}
	} catch (err) {
		throw err
	}
	});


	

	let childrenAbsenceCunter
	// http://localhost:3333/api/absence/chilrenInKindergartenCounter
	const chilrenInKindergartnCounte = async () => {

		const url = 'http://localhost:3333/api/absence/chilrenInKindergartenCounter'
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

		const url = 'http://localhost:3333/api/absence/beenPickedUpchilrenCounter'
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

		const url = 'http://localhost:3333/api/educators/educatorInLocationCunter'
		let res = await fetch(url, {
		headers: {'Content-Type': 'application/json'},
		credentials: 'include'
		})
		res = await res.json();
		educatorInLocationCunter = res.educator.length
	}
	educatorInLocationCunterFunc();
	

	

	


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
      educatorInEachRoomCaunterForHomePage[index]= $educators.length
  	}


	// shows List of children for each group  
	const childrenListInEachroom = async(roomname, index) =>{
		const url = 'http://localhost:3333/api/locationTracking/childrenListInEachroom'
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
		const url = 'http://localhost:3333/api/absence/occupiedRooms'
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
					Sie haben <strong>{message}</strong> angemeldet!
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
					<h5>Zahl der anwesende Kinde:  &nbsp &nbsp &nbsp &nbsp &nbsp <mark>{childrenAbsenceCunter}</mark></h5>
					<br>
					<h5>Zahl der abgehole Kinder: &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <mark>{childrenpickedUPCunter}</mark></h5>
					<br>
					<h5>Zahl der Erzhier/inen im Räume:  <mark>{educatorInLocationCunter}</mark></h5>
					<br>
					<h5>Zahl der öffenen Räume: &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <mark>{currentRoomsCaunter}</mark></h5>
				</div>
			</div>	
	</section>
	<br/> 
	


	<section class="alert alert-success">
		<div class="row">
			<div class="col-3 ">
				<br>
				<a href="/absence/location_tracking/locations">
					<h3>Standorte</h3>
					<h6>Die Zimmer sind besetzt: </h6>
				</a>
			</div>
			<hr class="standorte">
			
			


			<div class="col-8">
				
	
	
			<table>
				<thead>
					<tr>
						<th scope="col"># &nbsp &nbsp &nbsp</th>
						<th scope="col">Raumname  &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp</th>
						<th scope="col">Kinder Zahl  &nbsp &nbsp &nbsp &nbsp &nbsp </th>
						<th scope="col">Erzhier/inene Zahl </th>
					</tr>
	  			</thead>

				<tbody>
					{#each $current_rooms as roomForStandort, index(roomForStandort)  }
						<tr>
							<th scope="row">{index+1}</th>
							<th class="list-room-item"><RoomForStandort {roomForStandort}/></th>
							<th class="list-room-item">{childInEachRoomCaunterForHomePage[index]}</th>
							<th class="list-room-item">{educatorInEachRoomCaunterForHomePage[index]}</th>
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