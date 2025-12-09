-- CreateTable
CREATE TABLE "Notifications" (
    "notificationId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "notificationTypeId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "NotificationType" (
    "notificationTypeId" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("notificationTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_type_key" ON "NotificationType"("type");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_notificationTypeId_fkey" FOREIGN KEY ("notificationTypeId") REFERENCES "NotificationType"("notificationTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
