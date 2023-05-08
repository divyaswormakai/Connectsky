import moment from "moment";
import { BskyAgent, AtpSessionEvent, AtpSessionData } from "@atproto/api";
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
// Import moment.js

// Function to format date in desired output
export function formatDateAgo(date: Date) {
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asDays() >= 1) {
    return `${Math.floor(diff.asDays())}d ago`;
  } else if (diff.asHours() >= 1) {
    return `${Math.floor(diff.asHours())}h ago`;
  } else if (diff.asMinutes() >= 1) {
    return `${Math.floor(diff.asMinutes())}m ago`;
  } else {
    return "just now";
  }
}

export const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
    // console.log("first");
    const sessData = JSON.stringify(sess);
    localStorage.setItem("sess", sessData);
  },
});

export async function refreshSession() {
  const sessData = localStorage.getItem("sess");
  if (sessData !== null) {
    const sessParse = JSON.parse(sessData);
    await agent.resumeSession(sessParse);
  }
}

function handleLongText(str: string | undefined): { __html: string } | undefined {
  const longText = /\b\w{30,}\b/g;
  if (!str) {
    return undefined;
  }
  return {
    __html: str.replace(longText, (match) => `
  <div class="w-full overflow-hidden">
    <span class="break-all">${match}</span>
  </div>
`)
  };
}
export function handleLinks(str: string | undefined): { __html: string } | undefined {
  const linkRegex = /(\bhttps?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|])/gi;

  if (!str) {
    return undefined;
  }
  const processedLongText = handleLongText(str);
  const stringWithLongTextHandled = processedLongText?.__html || str;
  console.log(stringWithLongTextHandled);
  return { __html: stringWithLongTextHandled.replace(linkRegex, (match) => `<span class="break-all"><a href="${match}" class="text-indigo-600" target="_blank">${match}</a></span>`) };
}