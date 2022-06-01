<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authenticated } from '../../stores/auth'
	import axios  from 'axios';
	import LogIn from '../../../src/routes/LogIn.svelte'
	import {serverPort} from '../../../src/routes/LogIn.svelte'


	//it checks whether the user is logged in
	let auth = false
	authenticated.subscribe(a => auth = a);
	let message = 'Du bist nicht eingeloggt!'

	// it checks which user is logged in.
    //When the user is 'admin', he is allowed to have Rigester inks., otherwise the link not show.
	import { usernameCheck } from '../../stores/auth'
	let userChech = false
    usernameCheck.subscribe(user => userChech = user);
    let messageUser = 'Sie dürfen diese Seite nicht besuchen!'



	// Logout function 
	const logout = async () => {
		const url = serverPort + 'user/logout'
		await axios.post(url, {}, {withCredentials:true});
		axios.defaults.headers.common['Authorization'] = '';

		authenticated.set(false);
		usernameCheck.set(false);
		await goto('/LogIn')
	}
</script>


<header>
	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		{#if auth}
			<ul>
				<li class:active={$page.url.pathname === '/'}>
					<a sveltekit:prefetch href="/">Home</a></li>
				<li class:active={$page.url.pathname === '/absence/Absence'}>
					<a sveltekit:prefetch href="/absence/Absence">Anwesenheit</a>
				</li>

				<li class:active={$page.url.pathname === '/absence/location_tracking/locations'}>
					<a sveltekit:prefetch href="/absence/location_tracking/locations">Standorten</a>
				</li>
				<li class:active={$page.url.pathname === '/absence/Ortezustand/Ortezustand'}>
					<a sveltekit:prefetch href="/absence/Ortezustand/Ortezustand">Ortezustand</a>
				</li>

				{#if userChech && auth}
					<li class:active={$page.url.pathname === '/register/Register'}>
						<a sveltekit:prefetch href="/register/Register">Registrieren</a>
					</li>
				{/if}
				<li class="">
					<a  href="/LogIn" on:click={logout}>Ausloggen</a>
				</li>

			</ul>

		{:else}
			<ul>
				<li class:active={$page.url.pathname === '/LogIn'}>
					<a sveltekit:prefetch href="/LogIn">Einloggen</a>
				</li>
			</ul>
		{/if}

		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
	}

	.corner {
		width: 3em;
		height: 3em;
	}


	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
