/*
  Warnings:

  - You are about to drop the `DonationItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colourId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conditionId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_colourId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_conditionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_donationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_genderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_materialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DonationItem" DROP CONSTRAINT "DonationItem_statusId_fkey";

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "co2" DOUBLE PRECISION,
ADD COLUMN     "colourId" INTEGER NOT NULL,
ADD COLUMN     "conditionId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "genderId" INTEGER NOT NULL,
ADD COLUMN     "materialId" INTEGER NOT NULL,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "sizeId" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."DonationItem";

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_colourId_fkey" FOREIGN KEY ("colourId") REFERENCES "Colour"("colourId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("conditionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("genderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;
