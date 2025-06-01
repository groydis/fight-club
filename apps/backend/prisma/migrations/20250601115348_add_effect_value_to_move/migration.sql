/*
  Warnings:

  - Added the required column `effectValue` to the `CharacterMove` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterMove" ADD COLUMN     "effectValue" INTEGER NOT NULL;
