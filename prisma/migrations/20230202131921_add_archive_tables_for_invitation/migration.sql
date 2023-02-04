-- AlterTable
ALTER TABLE "DishTypeAndDishes" ADD COLUMN     "invitationDishTypesId" INTEGER,
ADD COLUMN     "invitationDishTypesInvitationRestaurantId" INTEGER,
ADD COLUMN     "invitationDishTypesRestaurantId" INTEGER;

-- CreateTable
CREATE TABLE "InvitationRestaurant" (
    "id" SERIAL NOT NULL,
    "restaurantId" SERIAL NOT NULL,
    "deliveryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isQualityMerchant" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "position" JSONB NOT NULL,
    "priceRange" JSONB NOT NULL,
    "photos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invitationId" TEXT NOT NULL,

    CONSTRAINT "InvitationRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationDishTypes" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "invitationRestaurantId" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitationDishTypes_pkey" PRIMARY KEY ("id","invitationRestaurantId")
);

-- CreateTable
CREATE TABLE "InvitationDishTypeAndDishes" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,
    "dishTypeId" INTEGER NOT NULL,
    "invitationRestaurantId" INTEGER NOT NULL,

    CONSTRAINT "InvitationDishTypeAndDishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationDish" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "price" JSONB NOT NULL,
    "discountPrice" JSONB NOT NULL,
    "photos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invitationRestaurantId" INTEGER NOT NULL,

    CONSTRAINT "InvitationDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationDishOption" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "invitationRestaurantId" INTEGER NOT NULL,

    CONSTRAINT "InvitationDishOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationOption" (
    "id" SERIAL NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "ntop" TEXT NOT NULL,
    "invitationRestaurantId" INTEGER NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "maxQuantity" INTEGER NOT NULL,

    CONSTRAINT "InvitationOption_pkey" PRIMARY KEY ("id","invitationRestaurantId")
);

-- CreateTable
CREATE TABLE "InvitationOptionItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER,
    "price" JSONB NOT NULL,
    "ntopPrice" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "maxQuantity" INTEGER,
    "topOrder" INTEGER NOT NULL DEFAULT 0,
    "dishId" INTEGER NOT NULL,
    "optionId" INTEGER,
    "invitationOptionId" INTEGER,
    "invitationOptionRestaurantId" INTEGER NOT NULL,

    CONSTRAINT "InvitationOptionItem_pkey" PRIMARY KEY ("id","dishId","invitationOptionRestaurantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitationRestaurant_deliveryId_key" ON "InvitationRestaurant"("deliveryId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationRestaurant_url_key" ON "InvitationRestaurant"("url");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationRestaurant_invitationId_key" ON "InvitationRestaurant"("invitationId");

-- CreateIndex
CREATE INDEX "invitataionDishTypesDisplayOrder" ON "InvitationDishTypes"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationDishTypes_id_invitationRestaurantId_key" ON "InvitationDishTypes"("id", "invitationRestaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationDishTypeAndDishes_id_dishId_key" ON "InvitationDishTypeAndDishes"("id", "dishId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationDish_id_invitationRestaurantId_key" ON "InvitationDish"("id", "invitationRestaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationDishOption_id_dishId_invitationRestaurantId_key" ON "InvitationDishOption"("id", "dishId", "invitationRestaurantId");

-- CreateIndex
CREATE INDEX "InvitationOption_invitationRestaurantId_idx" ON "InvitationOption"("invitationRestaurantId");

-- AddForeignKey
ALTER TABLE "DishTypeAndDishes" ADD CONSTRAINT "DishTypeAndDishes_invitationDishTypesId_invitationDishType_fkey" FOREIGN KEY ("invitationDishTypesId", "invitationDishTypesInvitationRestaurantId") REFERENCES "InvitationDishTypes"("id", "invitationRestaurantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationRestaurant" ADD CONSTRAINT "InvitationRestaurant_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishTypes" ADD CONSTRAINT "InvitationDishTypes_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishTypeAndDishes" ADD CONSTRAINT "InvitationDishTypeAndDishes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "InvitationDish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishTypeAndDishes" ADD CONSTRAINT "InvitationDishTypeAndDishes_dishTypeId_invitationRestauran_fkey" FOREIGN KEY ("dishTypeId", "invitationRestaurantId") REFERENCES "InvitationDishTypes"("id", "invitationRestaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDish" ADD CONSTRAINT "InvitationDish_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishOption" ADD CONSTRAINT "InvitationDishOption_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "InvitationDish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishOption" ADD CONSTRAINT "InvitationDishOption_optionId_invitationRestaurantId_fkey" FOREIGN KEY ("optionId", "invitationRestaurantId") REFERENCES "InvitationOption"("id", "invitationRestaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationOption" ADD CONSTRAINT "InvitationOption_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationOptionItem" ADD CONSTRAINT "InvitationOptionItem_invitationOptionId_invitationOptionRe_fkey" FOREIGN KEY ("invitationOptionId", "invitationOptionRestaurantId") REFERENCES "InvitationOption"("id", "invitationRestaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "displayOrder" RENAME TO "dishTypesDisplayOrder";
