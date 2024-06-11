<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { remult } from 'remult';
import App from './App.vue';

const username = ref("");
const signedIn = ref(false);

const signIn = async () => {
    const result = await fetch("/api/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username.value })
    })

    if(result.ok){
        remult.user = await result.json();
        signedIn.value = true;
        username.value = ""
    } else {
        alert(await result.json())
    }
}

const signOut = async() => {
    await fetch("/api/signout", {
        method: "POST"
    })
    remult.user = undefined;
    signedIn.value = false;
}

onMounted( async () => {
    remult.user = await fetch("/api/currentUser").then(r=>r.json());
    signedIn.value = remult.authenticated();
})

</script>

<template>
        <div v-if="!signedIn" class="signin-container">
        <h1>To Do List</h1>
        <p>Sign in with the username 'Luz' to experience admin access. Users with admin access have the ability to create new tasks and delete tasks.</p>
        <p>Sign in with the username 'User' to experience non-admin access.</p>
        <main>
            <form @submit.prevent="signIn()" class="signin-form">
                <input
                    class="input-signin"
                    v-model="username"
                    placeholder="Sign in"
                />
                <button>Sign In</button>
            </form>
        </main>
        </div>
        <div class="signout-container" v-else>
        <div class="header-content">
        <header>Hello {{ remult.user!.name }}!</header>
        <button @click="signOut()">Sign Out</button>            
        </div>

        <App />
        </div>        


</template>

<style scoped>

.signin-container {
    /* border: 1px solid red; */

    width: 350px;
    height: 300px;
    background-color: #7b87b8;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 25px;
    gap: 25px;
    box-shadow: 5px 10px #303c6c;
    outline: none;
    caret-color: transparent;

    p {
        margin: auto 10px;
    }
    
}

.input-signin:focus-visible {
  outline: none;
  border-bottom: 1px solid white;
    }
.signin-form {
    display: flex;
    margin-bottom: 10px;
    gap: 10px;
    align-items: center;

    input {
        height: 25px;
    }

    

    button {
        width: 80px;
        height: 30px;
        border-radius: 5px;
        border: none;
        align-self: center;
        background-color: rgb(248 166 128);
    }
}

.signout-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 50px;
    background-color: #7b87b8;
    box-shadow: 5px 10px #303c6c;
    caret-color: transparent;

    header {
        font-weight: bolder;
        font-size: 24px;
    }

    button {
        width: 80px;
        height: 30px;
        border-radius: 5px;
        align-self: center;
        background-color: rgb(248 166 128);
        border: none;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        margin: auto 5px;
    }

}

</style>