export interface QueryResult {
	data: {
    MediaListCollection: MediaListCollection
  }
}

export interface MediaListCollection {
	lists: AnimeHistoryList[];
}

export interface AnimeHistoryList {
	name: string;
	isCustomList: boolean;
	status: 'COMPLETED';
	entries: AnimeHistoryListEntry[];
}

export interface AnimeHistoryListEntry {
	media: Media;
	score: number;
	private: boolean;
	startedAt: {
		year: number;
		month: number;
		day: number;
	};
	completedAt: {
		year: number;
		month: number;
		day: number;
	};
}

export interface Media {
	id: number;
  episodes: number;
  siteUrl: string;
	title: {
    english: string,
    native: string,
		userPreferred: string;
	};
	description: string;
	coverImage: {
		medium: string,
    large: string,
	};
  bannerImage: string;
}

export const query = `query {
    MediaListCollection(userId: 5405631, forceSingleCompletedList: true, type: ANIME, status: COMPLETED, startedAt_greater: 20211231, sort: STARTED_ON) {
      lists {
        name
        isCustomList
        entries {
          media {
            id
            title {
              english
              native
              userPreferred
            }
            description
            episodes
            coverImage {
              medium
              large
            }
            bannerImage
          }
          score
          private
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
        }
        status
      }
    }
  }`;
