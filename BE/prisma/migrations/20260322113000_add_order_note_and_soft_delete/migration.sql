-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "note" TEXT,
ADD COLUMN "hiddenByUser" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Order_userId_hiddenByUser_status_idx" ON "Order"("userId", "hiddenByUser", "status");
