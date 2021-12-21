import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronDownIcon, ClockIcon } from "@heroicons/react/outline";
import {
  PlayIcon,
  DotsHorizontalIcon,
  HeartIcon,
} from "@heroicons/react/solid";
import { useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import moment from "moment";

const colors = [
  "from-indigo-900",
  "from-blue-900",
  "from-green-900",
  "from-red-900",
  "from-yellow-900",
  "from-pink-900",
  "from-purple-900",
];

function Center() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  };

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  console.log("SESSION", session);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getPlaylist(playlistId).then((data) => {
        setPlaylist(data?.body)?.catch((error) =>
          console.log("Something went wrong!", error)
        );
      });
    }
  }, [spotifyApi, playlistId]);

  console.log(playlist);

  return (
    <div className="flex-grow overflow-scroll h-screen">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white hover:bg-[#3b3b3b]">
          <img
            className="rounded-full w-7 h-7"
            src={session?.user?.image}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        {playlist ? (
          <>
            <img
              src={playlist?.images?.[0].url}
              alt=""
              className="h-52 w-52 shadow-2xl"
            />
            <div>
              <p className="text-sm pb-5">
                {playlist?.collaborative
                  ? "COLLABORATIVE PLAYLIST"
                  : "PLAYLIST"}
              </p>
              <h1 className="text-5xl font-bold">{playlist?.name}</h1>
              <p className="text-sm pb-1 pt-6 text-gray-400">
                {playlist?.description}
              </p>
              <div className="flex text-sm">
                <p className="font-semibold">
                  {playlist?.owner?.display_name} &middot;{" "}
                </p>

                <p className="text-gray-400">
                  {numFormatter(playlist?.followers.total)}{" "}
                  {playlist?.followers?.total === 1 ? " like" : " likes"}{" "}
                  &middot;{" "}
                </p>
                <p className="text-gray-400">
                  {" "}
                  {playlist?.tracks?.items?.length}
                  {playlist?.tracks?.items?.length === 1 ? " song" : " songs"}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </section>
      <section>
        <div className="pl-5 flex space-x-5">
          <PlayIcon className="w-20 text-green-600" />
          {session?.user?.name !== playlist?.owner?.display_name ? (
            <HeartIcon className="w-10 text-green-600" />
          ) : null}
          <DotsHorizontalIcon className="w-8 text-gray-400" />
        </div>
        <div className="pl-14 pt-8">
          <div className="text-gray-400 text-xs grid grid-cols-4 gap-10 items-center">
            <p># TITLE</p>
            <p className="pl-14">ALBUM</p>
            <p className="pl-14">DATE ADDED</p>
            <p className="w-5 ml-14">
              <ClockIcon />
            </p>
          </div>
          <div className="border-b border-gray-700 pt-2 mr-5" />
          {playlist?.tracks?.items.map((track, index) => (
            <div className="grid grid-cols-4 text-gray-400 py-2 text-sm items-top w-full">
              <div className="flex w-full">
                <p className="pr-3 text-right">{index + 1}</p>
                <img
                  src={track?.track?.album?.images[2].url}
                  alt=""
                  className="w-9 h-9 flex-none"
                />
                <div className="pl-4">
                  <p className="text-white">
                    {track?.track?.name.length < 35
                      ? track?.track?.name
                      : track?.track?.name.substring(0, 35) + "..."}
                  </p>

                  <p>{track?.track?.artists?.[0].name}</p>
                </div>
              </div>
              <p>{track?.track?.album?.name}</p>
              <p>
                {moment
                  .utc(track?.added_at)
                  .local()
                  .startOf("seconds")
                  .fromNow()}
              </p>
              <p>{millisToMinutesAndSeconds(track?.track?.duration_ms)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Center;
