import { Buffer } from "buffer";

let cachedToken: string | null = null;

export interface AlbumItem {
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface AlbumDetail {
  album_type: string;
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  copyrights: {
    text: string;
    type: string;
  }[];
  external_ids: {
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  genres: any[];
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: {
    href: string;
    items: AlbumItem[];
    limit: number;
    next?: any;
    offset: number;
    previous?: any;
    total: number;
  };
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface SpotifyResult {
  albums: {
    href: string;
    items: Album[];
    limit: number;
    next: string;
    offset: number;
    previous?: any;
    total: number;
  };
}

async function getToken() {
  if (!cachedToken) {
    const creds = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const encodedCreds = Buffer.from(creds).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCreds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const resp = await res.json();
    cachedToken = resp.access_token;
  }
  return cachedToken;
}

const albumSearchCache: Record<string, Album[]> = {};

export async function getAlbums(q: string): Promise<Album[]> {
  if (!albumSearchCache[q]) {
    const token = await getToken();
    const req = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=album&limit=20&offset=0`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const res = await req.json();
    albumSearchCache[q] = res?.albums?.items || [];
  }
  return albumSearchCache[q];
}

const albumCache: Record<string, AlbumDetail> = {};

export async function getAlbum(id: string): Promise<AlbumDetail> {
  if (!albumCache[id]) {
    const token = await getToken();
    const req = await fetch(
      `https://api.spotify.com/v1/albums/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    albumCache[id] = await req.json();
  }
  return albumCache[id];
}
