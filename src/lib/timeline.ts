import type { TimelineQueryResponse, AnimeHistoryListEntry } from './graphql';

export interface DateEntry {
	type: 'month' | 'year'
	data: number;
}

export interface AnimeEntry {
    type: 'anime';
    data: AnimeHistoryListEntry;
}

function groupBy<T>(list: T[], keyGetter: (i: T) => any): Map<any, T[]> {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

export function formTimeline(data: TimelineQueryResponse): (DateEntry | AnimeEntry)[] {
	const groups = groupBy(data["data"]["MediaListCollection"]["lists"][0]["entries"], i => `${i.startedAt.month}-${i.startedAt.year}`);
	let curYear = data["data"]["MediaListCollection"]["lists"][0]["entries"][0]["startedAt"]["year"];
	let curMonth =  data["data"]["MediaListCollection"]["lists"][0]["entries"][0]["startedAt"]["month"];

	const out: (DateEntry | AnimeEntry)[] = [];
	
	out.push({type: 'year', data: curYear});

	for (let i = 1; i < curMonth; i++) {
		out.push({type: "month", data: i});
	}

	for (const [key, entries] of groups.entries()) {
		let [month, year] = key.split("-");
		month = parseInt(month);
		year = parseInt(year);

		if (year != curYear) {
			out.push({type: 'year', data: year});
			curYear = year;
		}

		if (month > curMonth) {
			for (let i = curMonth + 1; i < month; i++) {
				out.push({type: "month", data: i});
			}
		}

		out.push({type: 'month', data: month});
		curMonth = month;

		for (const entry of entries) {
			out.push({type: 'anime', data: entry});
		}
	}

	out.reverse(); // the graphql query had sorted in ascending order; reverse before rendering
	return out;
}
