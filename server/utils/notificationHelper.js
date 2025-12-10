export const createNotification = async (tx, userId, typeName, message) => {
  try {
    const notifType = await tx.notificationType.findUnique({
      where: { type: typeName },
    });

    if (notifType) {
      await tx.notifications.create({
        data: {
          userId: userId,
          notificationTypeId: notifType.notificationTypeId,
          message: message,
          isRead: false,
        },
      });
      console.log(`Notification created for User ${userId}: ${typeName}`);
    } else {
      console.warn(`Notification Type "${typeName}" not found in database.`);
    }
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
