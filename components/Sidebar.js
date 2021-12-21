import { useState, useEffect } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  // add session provider in app.js
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  console.log("Playlist id ", playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      console.log("HAS ACCESS TOKEN");
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
        console.log(data);
      });
    } else {
      console.log("NO ACCESS TOKEN");
    }
  }, [session, spotifyApi]);

  const router = useRouter();
  return (
    <div className="text-gray-400 p-5 border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide w-68 text-sm">
      <div className="pb-6 cursor-pointer">
        <Image
          src={"/logo.png"}
          width={140}
          height={42}
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-4">
          <button
            className="flex items-center space-x-2 hover:text-white"
            onClick={() => signOut()}
          >
            Log out
          </button>
          <button className="flex items-center space-x-2  hover:text-white">
            <HomeIcon className="h-5 w-5" />
            <p>Home</p>
          </button>
          <button className="flex items-center space-x-2  hover:text-white">
            <SearchIcon className="h-5 w-5" />
            <p>Search</p>
          </button>
          <button className="flex items-center space-x-2  hover:text-white">
            <LibraryIcon className="h-5 w-5" />
            <p>Your Library</p>
          </button>
        </div>
        <div className="space-y-4 pt-5">
          <button className="flex items-center space-x-2  hover:text-white">
            <PlusCircleIcon className="h-5 w-5" />
            <p>Create Playlist</p>
          </button>
          <button className="flex items-center space-x-2  hover:text-white">
            <HeartIcon className="h-5 w-5" />
            <p>Liked Songs</p>
          </button>
          <button className="flex items-center space-x-2  hover:text-white">
            <RssIcon className="h-5 w-5" />
            <p>Your Episodes</p>
          </button>
        </div>

        <hr className="border-t-[0.1px] border-gray-900" />
        {/* Playlists */}
        {playlists?.map((playlist) => (
          <p
            onClick={() => setPlaylistId(playlist.id)}
            key={playlist.id}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
