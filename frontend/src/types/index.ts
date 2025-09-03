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

export interface MessageType {
    _id: string,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt: string
}

export interface UserType {
	_id: string;
	userId: string;
	username: string;
	imageUrl: string;
}