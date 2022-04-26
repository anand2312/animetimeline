import type { QueryResult, AnimeHistoryListEntry } from './graphql';

export interface DateEntry {
	type: 'month' | 'year'
	data: number;
}

export interface AnimeEntry {
    type: 'anime';
    data: AnimeHistoryListEntry;
}

export function formTimeline(data: QueryResult): (DateEntry | AnimeEntry)[] {
	let curYear = 2022;
	let curMonth = 1;
	const out = new Array<DateEntry | AnimeEntry>();

	out.push({ type: 'year', data: curYear });
	out.push({ type: 'month', data: curMonth });

	for (const entry of data['data']['MediaListCollection']['lists'][0]['entries']) {
        if (entry.private) {
            continue
        }
    
		const { year, month } = entry['completedAt'];

		if (month > curMonth) {
			out.push({ type: 'month', data: month });
			out.push({ type: 'anime', data: entry });
			curMonth = month;
			continue;
		}

		if (year > curYear) {
			out.push({ type: 'year', data: year });
			out.push({ type: 'month', data: 1 });
			out.push({ type: 'anime', data: entry });
			curYear = year;
			continue;
		}

		out.push({ type: 'anime', data: entry });
	}

	out.reverse(); // the list was in ascending order since jan 1 2022;
	// for easy rendering, we reverse it, so that the latest anime comes first (at the top)
	return out;
}
