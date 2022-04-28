import { userSearchQuery, timelineQuery, type UserQueryResponse, type TimelineQueryResponse } from "$lib/graphql";
import { formTimeline } from "$lib/timeline";


/** @type {import('./[user].json').RequestHandler} */
export async function get({ params }) {
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
        console.log(data.errors);
        return {
            status: 302,
            redirect: "/404",
        }
    } else {
        data = data as UserQueryResponse;
    }

    const { id, name, avatar } = data["data"]["User"];

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
        body: {
            username: name,
            avatar: avatar,
            timeline: timeline
        }
    }
}