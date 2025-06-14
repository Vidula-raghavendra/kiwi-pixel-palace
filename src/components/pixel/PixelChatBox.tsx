
import React from "react";
import { ChatBubbleIcon, PixelGem } from "./PixelIcons";

/** Main chat window as a pixel art dialogue box w/ avatar and RPG chat bar */
export default function PixelChatBox() {
  // Prevent form submission from refreshing the page
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Add chat logic here if needed!
  }

  return (
    <section className="flex flex-col items-center justify-center px-7 py-4 w-full h-full"
      style={{ minWidth: "340px", maxWidth: "540px" }}>
      <div
        className="pixel-outline bg-[#fffde8] flex flex-col items-stretch px-0 py-0 shadow-none no-radius"
        style={{
          minWidth: "330px",
          boxSizing: "border-box",
          borderWidth: "3px",
        }}
      >
        {/* Header */}
        <div className="pixel-outline bg-[#b4f49f] block py-2 px-5 pixel-font pixel-title text-[#233f24] tracking-wide no-radius"
          style={{ fontSize: "15px", borderBottom: "none", outlineWidth:"2.5px" }}>
          MY WORKSPACE
        </div>
        {/* Chat Body */}
        <div className="relative flex py-6 pb-11 px-8 bg-[#fffde8] min-h-[110px]">
          {/* Avatar */}
          <div className="mr-4">
            <div className="w-10 h-10 pixel-outline bg-[#f0fdde] flex items-center justify-center no-radius"
              style={{ outlineColor: "#8CC84B" }}>
              <img
                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=KiwiBot&eyes=variant09&mouth=variant13&scale=110"
                alt="KIWI AI avatar"
                width={30}
                height={30}
                style={{
                  imageRendering: "pixelated",
                  width: 30,
                  height: 30,
                  display: "block",
                }}
                className="no-radius"
              />
            </div>
          </div>
          {/* Bubble + Text */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute -left-5 -top-2 z-0">
                <ChatBubbleIcon size={32} />
              </div>
              <div
                className="pl-5 z-10 pixel-font text-[12px] text-[#233f24]"
                style={{ textTransform: "none" }}
              >
                welcome to kiwi! how can i help you today?
              </div>
            </div>
          </div>
        </div>
        {/* Chat Bar: RPG input */}
        <form
          className="flex items-center px-4 py-3 bg-[#e8f6da] pixel-outline border-t-0 border-[#badc5b] no-radius"
          style={{
            borderTop: 0,
            minHeight: "44px",
          }}
          onSubmit={handleSubmit}
        >
          {/* Emoji/Gem */}
          <span className="mr-2 flex items-center justify-center">
            <PixelGem size={18} />
          </span>
          {/* Input */}
          <input
            type="text"
            className="pixel-font text-[13px] no-radius bg-[#fff] py-1 px-2 w-full outline-none border-2 border-[#b4f49f] pixel-outline"
            placeholder="type your message..."
            style={{
              outlineWidth: "1px",
              borderRadius: 0,
              minHeight: "27px",
              boxSizing: "border-box"
            }}
            spellCheck={false}
          />
          {/* Send button */}
          <button
            type="submit"
            className="ml-3 flex items-center justify-center px-2 py-1 pixel-outline bg-[#91eead] hover:bg-[#b4f49f] no-radius pixel-font text-xs text-[#233f24] transition"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            SEND
          </button>
        </form>
      </div>
    </section>
  );
}
