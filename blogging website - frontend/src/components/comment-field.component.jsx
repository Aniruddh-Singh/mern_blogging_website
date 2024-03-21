import { useContext } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {

    let { userAuth: { accessToken, username, fullname, profile_img } } = useContext(UserContext);

    let { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentArr }, activity, activity: { total_comments, total_parent_comments } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);

    const [comment, setComment] = useState("");

    const handleComment = () => {
        if (!accessToken) {
            return toast.error("login first to leave a comment");
        }

        if (!comment.length) {
            return toast.error("Write something to leave a comment...");
        }

        axios.post(import.meta.env.VITE_SERVER_ROUTE + "/add-comment", { _id, blog_author, comment, replying_to: replyingTo }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(({ data }) => {

                setComment("");

                data.commented_by = { personal_info: { username, profile_img, fullname } };

                let newCommentArr;

                if (replyingTo) {

                    commentArr[index].children.push(data._id);

                    data.childrenLevel = commentArr[index].childrenLevel + 1;
                    data.parentIndex = index;

                    commentArr[index].isReplyLoaded = true;
                    commentArr.splice(index + 1, 0, data);

                    newCommentArr = commentArr;

                    setReplying(false);

                } else {
                    data.childrenLevel = 0;

                    newCommentArr = [data, ...commentArr];
                }


                let parentCommentIncrementVal = replyingTo ? 0 : 1;

                setBlog({ ...blog, comments: { ...comments, results: newCommentArr }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementVal } })

                setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementVal)

            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Toaster />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto">
            </textarea>

            <button
                className="btn-dark mt-5 px-10"
                onClick={handleComment}>{action}</button>
        </>
    )
}

export default CommentField
