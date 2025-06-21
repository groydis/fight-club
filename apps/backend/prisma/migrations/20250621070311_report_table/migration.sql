-- CreateEnum
CREATE TYPE "CharacterReportReason" AS ENUM ('INAPPROPRIATE', 'HATE_SPEECH', 'GRAPHIC_VIOLENCE', 'IMPERSONATION', 'SPAM', 'HARASSMENT', 'NSFW', 'TOS_VIOLATION', 'LOW_QUALITY', 'UNINTELLIGIBLE', 'COPYRIGHTED_CONTENT', 'OTHER');

-- CreateTable
CREATE TABLE "CharacterReport" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" "CharacterReportReason" NOT NULL,
    "detail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacterReport" ADD CONSTRAINT "CharacterReport_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterReport" ADD CONSTRAINT "CharacterReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
