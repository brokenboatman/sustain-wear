-- CreateTable
CREATE TABLE "DonationImage" (
    "imageId" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "donationId" INTEGER NOT NULL,

    CONSTRAINT "DonationImage_pkey" PRIMARY KEY ("imageId")
);

-- AddForeignKey
ALTER TABLE "DonationImage" ADD CONSTRAINT "DonationImage_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("donationId") ON DELETE RESTRICT ON UPDATE CASCADE;
