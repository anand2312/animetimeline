<script context="module" lang="ts">
    import { userSearchQuery, timelineQuery, type UserQueryResponse, type TimelineQueryResponse } from "$lib/graphql";
    import { formTimeline } from "$lib/timeline";

    /** @type {import('./[user]').Load} */
    export async function load({ params, fetch }) {
        // first, search if the user exists on anilist
        let res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query: userSearchQuery,
                variables: {"search": params.user}
            })
        });
        let data = await res.json();

        if (data.errors) {
            return {
                status: 302,
                redirect: "/404"
            }
        } else {
            data = data as UserQueryResponse;
        }

        const { id, name } = data["data"]["User"];

        res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query: timelineQuery, variables: {"uid": id}})
        });
        data = await res.json() as TimelineQueryResponse;
        const timeline = formTimeline(data);

        return {
            status: 200,
            props: {
                username: name,
                timeline: timeline
            }
        }
    }
</script>


<script lang="ts">
    import type { DateEntry, AnimeEntry } from "$lib/timeline";
    import { isDark } from "$lib/stores";
    import { DateTime } from "luxon";

    export let username: string;
    export let timeline: (DateEntry | AnimeEntry)[];

    let dark: boolean;

    isDark.subscribe(value => {
        dark = value;
    })

    const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };

    function toggleDarkMode() {
        isDark.set(!dark);
    }

    function getDateString({year, month, day}: {year: number, month: number, day: number}): string {
        const dt = DateTime.local(year, month, day);
        return dt.toLocaleString({ month: "long", day: "numeric", year: "numeric"});
    }

    function getAnimeNames({english, native}: {userPreferred: string, english: string, native: string}): string {
        return `${english} || ${native}`;
    }
</script>



<main data-theme={dark ? "night" : "lofi"}>
<div class="p-1 m-1 grid grid-cols-1 justify-center justify-items-center">
    <div class="flex flex-row justify-center w-max py-5">
        <h1 class="font-sans font-bold text-3xl md:text-4xl basis-10/12 w-fit"><span class="hover:text-pink-400">{username}'s</span> anime timeline</h1>
        <button on:click={toggleDarkMode}>
            <img src="lighticon.svg" class="basis-2/12 align-middle w-5 h-5 {dark ? '' : 'hidden'}" alt="lightmode icon">
            <img src="darkicon.svg" class="basis-2/12 align-middle w-5 h-5 {dark ? 'hidden' : ''}" alt="darkmode icon">
        </button>
    </div>


{#each timeline as entry}
    {#if entry.type == "year"}
        <section><h2 class="font-sans text-2xl p-1">{entry.data}</h2></section>
        <hr class="py-1 w-10/12">
    {/if}
    {#if entry.type == "month"}
        <h3 class="font-sans text-xl p-1 decoration-current">{months[entry.data]}</h3>
        <hr class="py-1 w-3/4">
    {/if}
    {#if entry.type == "anime"}
    <div class="card bg-base-100 shadow-xl p-1 m-1 image-full max-w-3xl min-w-3xl">
        <figure class="invisible sm:visible"><img class="rounded-3xl" src={entry.data.media.bannerImage} alt="Anime banner" /></figure>
        <figure class="visible sm:invisible"><img class="rounded-3xl" src={entry.data.media.coverImage.large} alt="Anime banner" /></figure>
        <div class="card-body max-w-5 min-w-5 max-w-3xl min-w-min">
            <h2 class="card-title">
                <div class="tooltip tooltip-secondary tooltip-bottom lg:tooltip-right" data-tip="{getAnimeNames(entry.data.media.title)}">
                    <a href="https://anilist.co/anime/{entry.data.media.id}" class="hover:text-pink-400">{entry.data.media.title.userPreferred}</a>
                </div>
            </h2>
            <p><span class="font-bold">Started on: </span>{getDateString(entry.data.startedAt)}</p>
            <p><span class="font-bold">Finished on: </span>{getDateString(entry.data.completedAt)}</p>
            <p><span class="font-bold">Episodes: </span>{entry.data.media.episodes}</p>
            <p><span class="font-bold">Score: </span>{entry.data.score}</p>
            <p>{@html entry.data.media.description + "</i>"}</p>
        </div>
    </div>
    {/if}
{/each}
</div>
</main>