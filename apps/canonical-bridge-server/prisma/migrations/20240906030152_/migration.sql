-- CreateTable
CREATE TABLE `Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rank` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `platformSlug` VARCHAR(191) NULL,
    `platformName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `price` DECIMAL(65, 30) NULL,
    `updateAt` DATETIME(3) NOT NULL,

    INDEX `Token_address_symbol_idx`(`address`, `symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
