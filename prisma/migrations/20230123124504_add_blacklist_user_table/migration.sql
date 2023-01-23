-- CreateTable
CREATE TABLE "BlacklistedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "BlacklistedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedUser_userId_key" ON "BlacklistedUser"("userId");

-- AddForeignKey
ALTER TABLE "BlacklistedUser" ADD CONSTRAINT "BlacklistedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
