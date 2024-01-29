import React from "react";

import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

export default function App() {
  return (
    <div className="App">
      <FacebookShareButton
        url={"https://peing.net/ja/"}
        quote={"フェイスブックはタイトルが付けれるようです"}
        hashtag={"#hashtag"}
        description={"aiueo"}
        className="Demo__some-network__share-button"
      >
        <FacebookIcon size={32} round /> Facebookでshare
      </FacebookShareButton>
      <br />
      <TwitterShareButton
        title={"test"}
        url={"https://peing.net/ja/"}
        hashtags={["hashtag1", "hashtag2"]}
      >
        <TwitterIcon size={32} round />
        Twitterでもshare
      </TwitterShareButton>
    </div>
  );
}
