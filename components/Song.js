import moment from "moment";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({ track, order }) {
  const spotifyApi = useSpotify();

  //   <p>{moment.utc(addedAt).local().startOf("seconds").fromNow()}</p>

  return (
    <div className="grid grid-cols-5 text-sm text-gray-400 py-2 hover:bg-gray-900 rounded-lg active:bg-gray-500 hover:text-white space-x-40 px-2">
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={track?.track?.album.images[0].url} />
        <div>
          <p className="w-40 lg:w-64 truncate text-white pl-4">
            {track?.track?.name}
          </p>
          <p className="w-40 lg:w-64 cursor-pointer hover:underline hover:text-white pl-4 truncate">
            {track?.track?.artists[0].name}
          </p>
        </div>
      </div>
      <p className="hidden md:inline cursor-pointer hover:underline hover:text-white w-60 truncate">
        {track.track.album.name}
      </p>
      <p className="hidden md:inline cursor-pointer hover:underline hover:text-white">
        {track.added_by.id}
      </p>
      <p className="w-40 hidden md:inline">
        {moment.utc(track.added_at).local().startOf("seconds").fromNow()}
      </p>
      <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
    </div>
  );
}

export default Song;
