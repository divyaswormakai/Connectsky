import React, { useState, useEffect, useRef, useContext } from "react";
// import { dummyData } from "./dummyData";
import PostSection from "../../components/PageComponents/Feed/PostSection";
import PostCard from "../../components/PageComponents/Feed/PostCard";
import {
  BskyAgent,
  AtpSessionData,
  AtpSessionEvent,
  AppBskyEmbedImages,
  BlobRef,
} from "@atproto/api";
import PostLoader from "../../components/PageComponents/Feed/PostLoader";
import { appContext } from "../../context/appContext";
//  Props = {
//   profileImg?: string;
//   author: string;
//   caption?: string;
//   image?: string;
//   likes: number;
//   comments: number;
// };
interface Author {
  displayName: string;
  avatar: string;
}

interface Caption {
  text: string;
}

interface Image {
  thumb: string;
}

interface Embed {
  images: Image[];
}

interface ImageObject {
  embed: Embed;
}

interface Item {
  author: Author;
  comments: number;
  likes: number;
  caption: Caption;
  image: ImageObject;
}

// const feedOptionsButtons = [
//   {
//     name: "For you",
//     filter: "forYou",
//     icon: undefined,
//   },
//   {
//     name: "Following",
//     filter: "following",
//     icon: undefined,
//   },
// ];

// the component begins here
const Feed = () => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [cursor, setCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<Item[]>([]);
  const [image, setImage] = useState<BlobRef | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const { postText, setPostText, fileRef, uploadedFile } =
    useContext(appContext);

  const differentButtonsForFeed = [
    {
      name: "Media",
      icon: undefined,
      action: () => {
        fileRef.current?.click();
      },
    },
    {
      name: "Post",
      icon: undefined,
      action: async () => {
        try {
          const sessData = localStorage.getItem("sess");
          if (sessData !== null) {
            const sessParse = JSON.parse(sessData);
            await agent.resumeSession(sessParse);
          }
          if (image !== null && postText.length > 0) {
            const res = await agent.post({
              text: postText,
              embed: {
                $type: "app.bsky.embed.images",
                images: [
                  {
                    image,
                    alt: "UnNamed",
                  },
                ],
              },
            });
          } else {
            if (postText.length > 0) {
              await agent.post({ text: postText });
            }
          }
          setPostText("");
          setImage(null);
        } catch (error) {
          console.log(error);
        }
      },
    },
  ];

  const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
      // console.log("first");
      const sessData = JSON.stringify(sess);
      localStorage.setItem("sess", sessData);
    },
  });

  async function followingFeed() {
    const sessData = localStorage.getItem("sess");
    if (sessData !== null) {
      const sessParse = JSON.parse(sessData);
      await agent.resumeSession(sessParse);
    }
    const { data } = await agent.getTimeline({
      limit: 20,
      cursor: cursor,
    });
    console.log(data);
    if (data.cursor == null) return;
    setCursor(data.cursor);
    const mappedData: Item[] = data.feed.map((feed: any) => {
      // console.log(feed);
      const images =
        feed.post.embed && "images" in feed.post.embed
          ? feed.post.embed.images
          : [];
      const firstImageThumb = images?.length > 0 ? images[0].thumb : "";

      return {
        author: {
          displayName: feed.post.author.displayName,
          avatar: feed.post.author.avatar,
        },
        likes: feed.post.likeCount,
        comments: feed.post.replyCount,
        caption: {
          text:
            feed.post.record && "text" in feed.post.record
              ? feed.post.record.text
              : "",
        },
        image: {
          embed: {
            images: [{ thumb: firstImageThumb }],
          },
        },
      };
    });
    setFeedData((prevData) => [...prevData, ...mappedData]);
  }
  const observerCallback: IntersectionObserverCallback = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      followingFeed();
      setIsLoading(true);
    }
  };
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5,
  });

  useEffect(() => {
    if (!isLoading) {
      followingFeed();
      setIsLoading(true);
    }
    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [isLoading, observer]);
  return (
    <div className=" w-full px-5">
      {showAddPost ? (
        <PostSection
          differentButtonsForFeed={differentButtonsForFeed}
          setImage={setImage}
          setShowAddPost={setShowAddPost}
        />
      ) : (
        <div className="w-full h-full">
          <button
            className=":hidden z-50 fixed bottom-20 right-5 w-14 h-14 bg-blue-500 rounded-full text-2xl flex items-center justify-center text-white"
            onClick={() => setShowAddPost(true)}
          >
            +
          </button>

          <div className="hidden md:block">
            <PostSection
              differentButtonsForFeed={differentButtonsForFeed}
              setImage={setImage}
              setShowAddPost={setShowAddPost}
            />
          </div>
          <div className="grid grid-cols-4 gap-5 h-screen relative">
            <div className="col-span-4 md:col-span-3 mt-5">
              {/* create the feed */}
              <div className=" rounded-md  w-full flex flex-col gap-2 mt-5">
                {
                  // here we will map the feed
                  feedData.map((item: Item, index) => {
                    if (index === feedData.length - 1) {
                      return (
                        <div ref={lastElementRef} key={index}>
                          <PostCard
                            author={item.author.displayName}
                            comments={item.comments}
                            likes={item.likes}
                            caption={item.caption.text}
                            image={item.image.embed.images[0].thumb}
                            profileImg={item.author.avatar}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={index}>
                          <PostCard
                            author={item.author.displayName}
                            comments={item.comments}
                            likes={item.likes}
                            caption={item.caption.text}
                            image={item.image.embed.images[0].thumb}
                            profileImg={item.author.avatar}
                          />
                        </div>
                      );
                    }
                  })
                }
                {isLoading ? (
                  <>
                    {" "}
                    <PostLoader /> <PostLoader />
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="bg-slate-50 hidden md:block col-span-1 sticky h-full top-5"></div>
          </div>
        </div>
      )}
      {/* create the top - post option */}
    </div>
  );
};

export default Feed;
