import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {

    const { userAuth: { username }, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ accessToken: null });
    }

    return (
        <AnimationWrapper transition={{ duration: 0.2 }}>
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
                <Link to="/editor" className="md:hidden flex gap-2 link pl-8 py-4">
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <Link to={`/user/${username}`} className="link pl-8 py-4">
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className="link pl-8 py-4">
                    Dashboard
                </Link>
                <Link to="settings/edit-profile" className="link pl-8 py-4">
                    Settings
                </Link>

                <span className="absolute border-t border-black w-[200%]">
                </span>

                <button className="text-left hover:bg-grey w-full pl-8 py-4" onClick={signOutUser}>
                    <h1 className="font-bold text-xl">Sign Out</h1>
                    <p className="text-dark-grey">@{username}</p>
                </button>

            </div>
        </AnimationWrapper>
    )
}
export default UserNavigationPanel;