const Notification = require("../models/Notification");

const handleGetNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    
    // Count unread
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleMarkAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    // Mark all as read for this user
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleGetNotifications,
  handleMarkAsRead
};
