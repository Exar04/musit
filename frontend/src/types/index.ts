export interface SongType {
    _id: string,
    title: string,
    artist: string,
    album: string | null,
    imageUrl: string,
    audioUrl: string,
    duration: number,
    totalListens: number,
    createdAt: string 
}

export interface AlbumType {
    _id: string,
    title: string,
    artist: string,
    imageUrl: string,
    releaseYear: number,
    songs: SongType[],
    createdAt: Date
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}