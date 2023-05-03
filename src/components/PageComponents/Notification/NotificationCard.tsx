import React, { useState } from "react";
import moment from "moment";
import { formatDateAgo } from "../../../utils";
type NotificationCardProps = {
  image: string;
  title: "repost" | "follow" | "reply" | "like";
  description: string;
  createdAt: Date;
  reply: string
};

const NotificationCard = ({
  image,
  title,
  description,
  createdAt,
  reply
}: NotificationCardProps) => {
  let reason = ""
  let color = "";
  switch (title) {
    case "repost": {
      color = "bg-blue-500";
      reason = "reposted your post!"
      break;
    }
    case "follow": {
      color = "bg-green-500";
      reason = "follows you!"
      break;
    }
    case "reply": {
      color = "bg-yellow-500";
      reason = "replied on your post!"
      break;
    }
    case "like": {
      color = "bg-red-500";
      reason = "liked your post!"
      break;
    }
    default: {
      color = "bg-orange-500";
      // setReason("unknown!")
      break;
    }
  }
  return (
    <div>
      <div className="flex flex-row gap-5 py-2 px-2 items-center shadow_custom bg-white justify-between">
        {/* left side for the image */}
        <div className="flex flex-row relative">
          <div className="rounded-full w-16 h-16 overflow-hidden">
            <img src={image} alt={title} />
          </div>
          {/* <div
            className={`absolute bottom-0 right-0 w-6 h-6  rounded-full ${color}`}
          >
          </div> */}
          <div className="flex flex-col px-2 py-2">
            <p className="line-clamp-2">{description}</p>
            <p className="text-blue-800">{reason}</p>
          </div>
          {title === "reply" ? reply : ""}
        </div>

        {/* right side for the title and description */}
        <div className="flex justify-between">
          <span>{formatDateAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
