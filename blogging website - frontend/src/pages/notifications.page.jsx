import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserContext } from '../App';
import { filterPaginationData } from '../common/filter-pagination-data';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import NotificationCard from '../components/notification-card.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';

const Notification = () => {

    const { userAuth: { accessToken } } = useContext(UserContext);

    const [filter, setFilter] = useState("all");
    const [notifications, setNotifications] = useState(null);

    let filters = ['all', 'like', 'comment', 'reply'];

    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_ROUTE + "/notifications", { page, filter, deletedDocCount }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(async ({ data: { notifications: data } }) => {
                let formatedData = await filterPaginationData({
                    state: notifications,
                    data,
                    page,
                    countRoute: "/all-notifications-count",
                    dataToSend: { filter },
                    user: accessToken
                });

                setNotifications(formatedData);

            })
            .catch(err => {
                console.log(err);
            })

    }

    const handleFilter = (e) => {
        let btn = e.target;

        setFilter(btn.innerHTML);

        setNotifications(null);
    }

    useEffect(() => {
        if (accessToken) {
            fetchNotifications({ page: 1 })
        }
    }, [accessToken, filter])

    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>

            <div className='my-8 flex gap-6'>
                {
                    filters.map((filterName, i) => {
                        return <button key={i} className={"py-2 " + (filter == filterName ? "btn-dark" : "btn-light")} onClick={handleFilter}>{filterName}</button>
                    })
                }
            </div>

            {
                notifications == null ? <Loader /> :
                    <>
                        {
                            notifications.results.length ?
                                notifications.results.map((notification, i) => {
                                    return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }} >
                                        <NotificationCard />
                                    </AnimationWrapper>
                                }) : <NoDataMessage message="Nothing Available" />
                        }

                        <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} />
                    </>
            }
        </div>
    )
}

export default Notification
