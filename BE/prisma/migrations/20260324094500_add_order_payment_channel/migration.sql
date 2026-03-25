-- Add Midtrans payment metadata fields so admin can see channel details (QRIS/VA/etc)
ALTER TABLE "Order"
ADD COLUMN "paymentType" TEXT,
ADD COLUMN "paymentChannel" TEXT;
