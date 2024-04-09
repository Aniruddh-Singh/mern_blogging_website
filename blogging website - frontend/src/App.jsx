import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component.jsx";
import UserAuthForm from "./pages/userAuthForm.page.jsx";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session.jsx";
import Editor from "./pages/editor.pages.jsx";
import HomePage from "./pages/home.page.jsx";
import SearchPage from "./pages/search.page.jsx";
import PageNotFound from "./pages/404.page.jsx";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";
import SideNav from "./components/sidenavbar.component.jsx";
import ChangePassword from "./pages/change-password.page.jsx";
import EditProfile from "./pages/edit-profile.page.jsx";
import Notification from "../../server/Schema/Notification.js";

export const UserContext = createContext({});

const App = () => {
    const [userAuth, setUserAuth] = useState({ accessToken: null });

    useEffect(() => {
        (async () => {
            let userSession = lookInSession("user");
            userSession ? await setUserAuth({ accessToken: JSON.parse(userSession) }) : setUserAuth({ accessToken: null });
            console.log(userAuth.accessToken);
            // console.log(JSON.parse(userSession));
            // console.log(userSession);
        })();
    }, [])

    // useEffect(() => {
    //     console.log(userAuth.accessToken, "dsf");
    // }, [userAuth.accessToken])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>

                {/* There is some problem in context api which I am not getting yet, that is why I am writing different component separately instead of main one. */}

                {/* <Route path="/editor" element={<Editor />} /> */}
                {userAuth ? < Route path="/editor" element={<Editor />} /> : ""}
                {userAuth ? < Route path="/editor/:blog_id" element={<Editor />} /> : ""}
                <Route path="/" element={<Navbar />} >
                    <Route index element={<HomePage />} />
                    <Route path="dashboard" element={<SideNav />}>
                        <Route path="notifications" element={<Notification />} />
                    </Route>
                    <Route path="settings" element={<SideNav />}>
                        <Route path="edit-profile" element={<EditProfile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>

                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                    <Route path="search/:query" element={<SearchPage />} />
                    <Route path="user/:id" element={<ProfilePage />} />
                    <Route path="blog/:blog_id" element={<BlogPage />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;