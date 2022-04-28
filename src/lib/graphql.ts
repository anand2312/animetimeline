export interface TimelineQueryResponse {
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


export interface UserQueryResponse {
  data: {
    User: User
  }
}

export interface User {
  id: number;
  name: string;
}

export const userSearchQuery = `query ($search: String) {
  User(search: $search) {
    id
    name
  }
}`

export const timelineQuery = `query ($uid: Int) {
    MediaListCollection(userId: $uid, forceSingleCompletedList: true, type: ANIME, status: COMPLETED, startedAt_greater: 20211231, sort: STARTED_ON) {
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
