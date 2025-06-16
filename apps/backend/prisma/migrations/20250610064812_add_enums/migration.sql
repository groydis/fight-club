/*
  Warnings:

  - The `alignment` column on the `Character` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `Character` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CharacterGender" AS ENUM ('Male', 'Female', 'Other', 'Unknown');

-- CreateEnum
CREATE TYPE "CharacterAlignment" AS ENUM ('LawfulGood', 'NeutralGood', 'ChaoticGood', 'LawfulNeutral', 'TrueNeutral', 'ChaoticNeutral', 'LawfulEvil', 'NeutralEvil', 'ChaoticEvil');

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "alignment",
ADD COLUMN     "alignment" "CharacterAlignment",
DROP COLUMN "gender",
ADD COLUMN     "gender" "CharacterGender";
