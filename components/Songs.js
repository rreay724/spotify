import moment from "moment";
import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import { Song } from "../components/index";
import { ClockIcon } from "@heroicons/react/outline";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  console.log(playlist);
  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      <div className="grid grid-cols-5 text-sm text-gray-400 py-2  space-x-40 mb-5 sticky top-0 opacity-100 border-b border-gray-800 bg-black">
        <div className="flex space-x-3">
          <p>#</p>
          <p>Title</p>
        </div>
        <p>ALBUM</p>
        <p>ADDED BY</p>
        <p>DATE ADDED</p>
        <p className="">
          <ClockIcon className="w-5 h-5" />
        </p>
      </div>
      {playlist?.tracks?.items.map((track, i) => (
        <Song key={track.track.id} order={i} track={track} />
      ))}
    </div>
  );
}

export default Songs;
