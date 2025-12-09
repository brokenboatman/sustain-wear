-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationImage" DROP CONSTRAINT "DonationImage_donationId_fkey";

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationImage" ADD CONSTRAINT "DonationImage_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("donationId") ON DELETE CASCADE ON UPDATE CASCADE;
