import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Notification from "../cards/Notification";
import {
  markNotificationAsRead,
  notificationsActions,
} from "../redux/notificationSlice";

const Notifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  useEffect(() => {
    dispatch(markNotificationAsRead());
  }, [dispatch]);

  useEffect(() => {
    dispatch(notificationsActions.markNotificationsAsRead());
  }, [dispatch]);

  return (
    <div className="absolute right-[-9rem] top-[3.2rem] bg-white text-black shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-2 z-20">
      <h2 className="font-bold text-[1.2rem] text-center">Notifications</h2>
      <div className="flex flex-col space-y-2 mt-2 w-[17rem] overflow-y-auto h-[15rem]">
        {notifications.length === 0 && (
          <span className="text-[0.9rem] text-center text-blue-500">
            You dont have any notifications
          </span>
        )}
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            receiverId={notification.id}
            firstName={notification.first_name}
            lastName={notification.last_name}
            image={notification.image}
            type={notification.type}
            postId={notification.post_id}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
