<script context="module">
    import Button from "../components/Button.svelte"
    import Input from "../components/Input.svelte"
    import {goto} from "$app/navigation"
    import axios  from 'axios';



    let username = '', password = ''
    let msg = ''
    const login = async () =>{
        const url = 'http://localhost:3333/api/user/login'
        const res = await axios.post(url , {
                username,
                password
        }, {withCredentials: true});
        if (res.status === 200){
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.refreshToken}`;
            await goto('/')
        }
    };


</script>



<br>
<!-- gibt zurückgekommene messag aus  -->
{#if  msg}
    <div class="alert alert-success alert-dismissible" role="alert">
        <p><strong>{msg}</strong></p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
{/if}
<br>

<form class="box" on:submit|preventDefault={login}>

    <p class="title"> Bitte ein loggen </p>
    <div class="field">
        <Input bind:value = {username} class="input" label="Benutzername" type="text" required/>
        <Input bind:value = {password} class="input" label="Passwort" type="password" required/>
        <br>
        <Button class="button is-primary" type="signin"> Anmelden </Button>
    </div>
</form>