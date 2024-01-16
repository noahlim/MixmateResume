"use client";
import { useEdgeStore } from "lib/edgestore";
import Link from "next/link";
import { stringify } from "querystring";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File>();
  const [urls, setUrls] = useState<{
    url: string | null;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();
  return (
    <div className="flex flex-col items-center m-6 gap-2">
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <button
        className="bg-white text-black rounded px-2 hover:opacity-80"
        onClick={async () => {
          if (file) {
            const res = await edgestore.myPublicImages.upload({ file });
            //save to database
            setUrls({
              url: res.url,
              thumbnailUrl: res.thumbnailUrl,
            });
          }
        }}
      />
      {urls?.url && <Link href={urls.url} target="_blank">URL</Link>}
      {urls?.thumbnailUrl && <Link href={urls.thumbnailUrl} target="_blank">ThumbnailURL</Link>}

    </div>
  );
}
