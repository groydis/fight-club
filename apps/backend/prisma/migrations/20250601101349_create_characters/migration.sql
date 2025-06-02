-- CreateEnum
CREATE TYPE "MoveType" AS ENUM ('BASIC', 'SPECIAL');

-- CreateEnum
CREATE TYPE "CharacterStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lore" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "status" "CharacterStatus" NOT NULL DEFAULT 'PROCESSING',
    "imageFrontUrl" TEXT,
    "imageBackUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterMove" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stat" TEXT NOT NULL,
    "type" "MoveType" NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "CharacterMove_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacterMove" ADD CONSTRAINT "CharacterMove_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
