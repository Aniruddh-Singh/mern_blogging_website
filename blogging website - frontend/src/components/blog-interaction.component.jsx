import { useContext, useEffect } from "react"
import { BlogContext } from "../pages/blog.page"
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"
import axios from "axios";

const BlogInteraction = () => {

    let { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, setCommentsWrapper } = useContext(BlogContext);

    let { userAuth: { username, accessToken } } = useContext(UserContext);

    const handleLike = () => {

        if (accessToken) {
            // like the blog.
            setIsLikedByUser(preVal => !preVal);

            !isLikedByUser ? total_likes++ : total_likes--;

            setBlog({ ...blog, activity: { ...activity, total_likes } })

            axios.post(import.meta.env.VITE_SERVER_ROUTE + "/like-blog",
                { _id, isLikedByUser },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )
                .then(({ data }) => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            // not logged in
            toast.error("Please login to like this blog")
        }

    }

    useEffect(() => {

        if (accessToken) {
            // make request to server to get like information.
            axios.post(import.meta.env.VITE_SERVER_ROUTE + "/isliked-by-user", { _id }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(({ data }) => {
                    setIsLikedByUser(Boolean(result));
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, []);

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />

            <div className="flex justify-between gap-6">

                <div className="flex gap-2 items-center">

                    <button
                        onClick={handleLike}
                        className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")}>
                        <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button
                        onClick={() => setCommentsWrapper(preVal => !preVal)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>

                </div>

                <div className="flex gap-6 items-center">

                    {
                        username = author_username ?
                            <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}><i class="fi fi-brands-twitter-alt text-xl hover:text-twitter"></i></Link>
                </div>

            </div>

            <hr className="border-grey my-2" />
        </>
    )
}

export default BlogInteraction
