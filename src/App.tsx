// Importing required modules from React and React Router libraries
import { useState, useRef } from "react";
import Layout from "./components/HOC/Navigation/Layout";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { appContext } from "./context/appContext";
import "./interceptors/axios";
// Importing components for different pages of the application
import Feed from "./Page/Feed";
import Notification from "./Page/Notification";
import Search from "./Page/Search";
import Setting from "./Page/Setting";
import { linksType } from "./components/@types/Layout/SideBar";
import { BsFillGearFill, BsPencilSquare } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import WillComeSoon from "./components/PageComponents/WillComeSoon";

// Defining type for active page check, with limited values
export type activePageCheck = "Feed" | "Search" | "Notifications" | "Setting";
// this contains the actual links which will be made into the buttons

export const links: linksType[] = [
  {
    linkName: "Feed",
    links: "/",
    icon: <BsPencilSquare />,
  },
  {
    linkName: "Search",
    links: "/search",
    icon: <AiOutlineSearch />,
  },
  {
    linkName: "Notifications",
    links: "/notification",
    icon: <IoNotifications />,
  },
  // replace the icon with a seperate compoenent wohich only returns an profile picure
  {
    linkName: "Settings",
    links: "/search",
    icon: <BsFillGearFill />,
  },
];

function App() {
  // State to manage the currently active page of the application
  const [activePage, setActivePage] = useState<activePageCheck>("Feed");
  const [postText, setPostText] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<Uint8Array | null>(null);

  return (
    <div>
      <appContext.Provider
        value={{
          postText,
          setPostText,
          fileRef,
          setUploadedFile,
          uploadedFile,
        }}
      >
        {/* Setting up the router for the application */}
        <Router>
          {/* Wrapping the Layout component around the application */}
          <Layout activePage={activePage} setActivePage={setActivePage}>
            {/* Setting up the routes for the application */}
            <Routes>
              {/* Defining routes for different pages */}
              <Route path="/" element={<Feed />} />
              <Route path="/search" element={<WillComeSoon />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/setting" element={<WillComeSoon />} />
            </Routes>
          </Layout>
        </Router>
      </appContext.Provider>
    </div>
  );
}

// Exporting the App component as the main component of the application
export default App;
