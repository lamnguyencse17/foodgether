-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "ntop" TEXT NOT NULL,
    "dishId" INTEGER,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionItemConfiguration" (
    "id" SERIAL NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "maxQuantity" INTEGER NOT NULL,
    "optionId" INTEGER,

    CONSTRAINT "OptionItemConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER,
    "price" JSONB NOT NULL,
    "ntopPrice" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "maxQuantity" INTEGER,
    "topOrder" INTEGER NOT NULL DEFAULT 0,
    "optionItemConfigurationId" INTEGER,

    CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItemConfiguration" ADD CONSTRAINT "OptionItemConfiguration_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionItemConfigurationId_fkey" FOREIGN KEY ("optionItemConfigurationId") REFERENCES "OptionItemConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
