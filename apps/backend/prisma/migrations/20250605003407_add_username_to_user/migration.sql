/* Add nullable username column */
ALTER TABLE "User" ADD COLUMN "username" TEXT;

/* Populate existing rows using email */
UPDATE "User"
SET "username" = email
WHERE "username" IS NULL;

/* Create unique index on username */
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");