-- DropForeignKey
ALTER TABLE "public"."Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
