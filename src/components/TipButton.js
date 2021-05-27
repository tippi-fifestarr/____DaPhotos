import React, { useState } from "react";
import "./styles.css";
import { GithubSelector } from "@charkour/react-reactions";

export default function App() {
  const [emojiSelector, setEmojiSelector] = useState(false);
  return (
    <div className="animation-story">
      <div style={{ position: "relative" }}>
        <div
          className={
            emojiSelector ? "GithubSelector_Active" : "GithubSelector_Idle"
          }
        >
          <GithubSelector iconSize={20} />
        </div>
      </div>
      <button
                          className="btn btn-link btn-sm float-right pt-0"
                          // name={image.id}
                          
                        >
                          JUST TIP 0.05 ETH
                        </button>
    </div>
  );
}
