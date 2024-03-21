import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";
import UserCard from "../components/usercard.component";

const SearchPage = () => {

    let { query } = useParams();

    let [blogs, setBlog] = useState(null);
    let [users, setUsers] = useState(null);

    const searchBlogs = ({ page = 1, createNewArr = false }) => {

        axios.post(import.meta.env.VITE_SERVER_ROUTE + "/search-blogs", { query, page })
            .then(async ({ data }) => {

                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    dataToSend: { query },
                    createNewArr
                })

                setBlog(formatedData);

            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_ROUTE + "/search-users", { query })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const resetState = () => {
        setBlog(null);
        setUsers(null);
    }

    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, createNewArr: true });
        fetchUsers();
    }, [query])

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users === null ? <Loader /> : users.length ?
                        users.map((user, i) => {
                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                <UserCard user={user} />
                            </AnimationWrapper>
                        })
                        : <NoDataMessage message="No User Found" />
                }
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-10">

            <div className="w-full">
                <InPageNavigation routes={[`search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>

                    <>
                        {
                            blogs === null ?
                                (
                                    <Loader />
                                )
                                : (
                                    blogs.results.length ?
                                        blogs.results.map((blog, i) => {
                                            return (<AnimationWrapper
                                                key={i}
                                                transition={{ duration: 1, delay: i * .1 }}
                                            >
                                                <BlogPostCard
                                                    content={blog}
                                                    author={blog.author.personal_info}

                                                />
                                            </AnimationWrapper>)
                                        })
                                        : <NoDataMessage message={"No blogs published"} />
                                )
                        }
                        <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
                    </>

                    <UserCardWrapper />

                </InPageNavigation>
            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">User related to search <i className="fi fi-rr-user mt-1"></i></h1>

                <UserCardWrapper />
            </div>

        </section>
    )
}

export default SearchPage
