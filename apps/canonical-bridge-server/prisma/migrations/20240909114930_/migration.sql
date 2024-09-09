-- CreateTable
CREATE TABLE `LlamaToken` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `chainId` INTEGER NULL,
    `updateAt` DATETIME(3) NOT NULL,
    `price` DECIMAL(65, 30) NULL,
    `decimals` INTEGER NULL,

    INDEX `LlamaToken_updateAt_idx`(`updateAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
