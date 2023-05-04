import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
type Props = {
  profileImg?: string;
  author: string;
  caption?: string;
  image?: string;
  likes: number;
  comments: number;
};

const PostCard = ({
  author,
  comments,
  likes,
  caption,
  image,
  profileImg,
}: Props) => {
  /**
   * A React component that renders a post card with the given data.
   *
   * @param {string} author - The name of the author of the post.
   * @param {number} comments - The number of comments on the post.
   * @param {number} likes - The number of likes on the post.
   * @param {string} caption - The caption of the post.
   * @param {string} image - The URL of the image associated with the post.
   * @param {string} profileImg - The URL of the author's profile image.
   * @returns {JSX.Element} A React component that renders a post card with the given data.
   */
  return (
    <div className="w-full bg-white p-5 rounded-sm shadow_custom">
      <div className="flex">
        {/* Render author's profile image, name and caption */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={profileImg} alt="" className="w-10 h-10 object-cover" />
            </div>
            <p className="text-xl">{author}</p>
          </div>
          <div>
            <p className="text-lg">{caption}</p>
          </div>
        </div>
      </div>

      {image?.length == 0 ? (
        ""
      ) : (
        <div>
          {/* Render the post image */}
          <div className="w-full aspect-video overflow-hidden">
            <img src={image} alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      <div>
        {/* Render the number of likes and comments */}
        <div className="flex gap-5 mt-2 text-lg">
          <div>
            <AiFillHeart />
            <p>{likes}</p>
          </div>
          <div>
            <FiMessageCircle />
            <p>{comments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;