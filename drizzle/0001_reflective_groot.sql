CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`contentEn` text,
	`contentAr` text,
	`excerptEn` text,
	`excerptAr` text,
	`blogCategory` enum('saudi_tourism','property_investment','travel_guides','industry_news') NOT NULL DEFAULT 'industry_news',
	`tags` json,
	`featuredImage` varchar(1000),
	`authorId` int,
	`blogStatus` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`seoTitle` varchar(500),
	`seoDescription` text,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestId` int NOT NULL,
	`propertyId` int NOT NULL,
	`checkIn` timestamp NOT NULL,
	`checkOut` timestamp NOT NULL,
	`guests` int DEFAULT 1,
	`totalPrice` decimal(10,2),
	`bookingStatus` enum('pending','confirmed','checked_in','checked_out','cancelled') NOT NULL DEFAULT 'pending',
	`specialRequests` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`nameAr` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`heroImage` varchar(1000),
	`statsJson` json,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`isActive` boolean NOT NULL DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `cities_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`propertyId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`inquiryType` enum('owner','guest','booking','general','rental_forecast') NOT NULL DEFAULT 'general',
	`city` varchar(100),
	`neighborhood` varchar(200),
	`inquiryPropertyType` varchar(100),
	`message` text,
	`propertyId` int,
	`inquiryStatus` enum('new','contacted','site_visit','quote','signed','live','closed') NOT NULL DEFAULT 'new',
	`assignedTo` int,
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `neighborhoods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`nameEn` varchar(200) NOT NULL,
	`nameAr` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`zone` varchar(100),
	`profileEn` text,
	`profileAr` text,
	`descriptionEn` text,
	`descriptionAr` text,
	`heroImage` varchar(1000),
	`landmarks` json,
	`avgAdrPeak` decimal(10,2),
	`avgAdrHigh` decimal(10,2),
	`avgAdrLow` decimal(10,2),
	`propertyTypes` json,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`propertyCount` int DEFAULT 0,
	`avgNightlyRate` decimal(10,2),
	`walkTimeToLandmark` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `neighborhoods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`cityId` int NOT NULL,
	`neighborhoodId` int NOT NULL,
	`propertyType` enum('studio','1br','2br','3br','4br','villa','penthouse') NOT NULL DEFAULT '2br',
	`bedrooms` int DEFAULT 1,
	`bathrooms` int DEFAULT 1,
	`maxGuests` int DEFAULT 2,
	`sizeSqm` decimal(10,2),
	`pricePeak` decimal(10,2),
	`priceHigh` decimal(10,2),
	`priceLow` decimal(10,2),
	`amenities` json,
	`images` json,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`propertyStatus` enum('draft','active','maintenance','inactive') NOT NULL DEFAULT 'active',
	`isFeatured` boolean DEFAULT false,
	`ownerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestId` int NOT NULL,
	`propertyId` int NOT NULL,
	`bookingId` int,
	`rating` int NOT NULL,
	`comment` text,
	`reviewStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text,
	`groupName` varchar(100),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`roleEn` varchar(255),
	`roleAr` varchar(255),
	`image` varchar(1000),
	`bioEn` text,
	`bioAr` text,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','owner','guest') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` varchar(1000);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `company` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` varchar(5) DEFAULT 'ar';