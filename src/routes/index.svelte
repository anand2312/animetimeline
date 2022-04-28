<script lang="ts">
    import { isDark } from "$lib/stores";

    let dark: boolean;
    let username: string = "";

    isDark.subscribe(value => {
        dark = value;
    });

    function toggleDarkMode() {
        isDark.set(!dark);
    }
</script>

<main class="h-screen flex flex-col" data-theme={dark ? "night" : "lofi"}>
    <div class="grid grid-cols-1 p-3 m-3 gap-3 content-center justify-items-center">
        <div class="flex flex-row py-1">
            <h1 class="font-bold font-sans text-3xl md:text-4xl basis-10/12">anime timeline</h1>
            <button on:click={toggleDarkMode}>
                <img src="lighticon.svg" class="basis-2/12 align-middle w-5 h-5 {dark ? '' : 'hidden'}" alt="lightmode icon">
                <img src="darkicon.svg" class="basis-2/12 align-middle w-5 h-5 {dark ? 'hidden' : ''}" alt="darkmode icon">
            </button>
        </div>
        <input type="text" bind:value={username} placeholder="Enter your AniList username" class="input input-bordered input-accent w-full max-w-xs">
        <a href="/{username}"><button class="btn btn-outline btn-success font-sans" disabled={username === ""}>Go!</button></a>
    </div>
</main>