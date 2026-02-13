CREATE TABLE `job_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`linkedinUrl` varchar(500),
	`resumeUrl` varchar(1000),
	`coverLetter` text,
	`applicationStatus` enum('new','screening','interview','offered','hired','rejected') NOT NULL DEFAULT 'new',
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`departmentEn` varchar(200),
	`departmentAr` varchar(200),
	`locationEn` varchar(200) DEFAULT 'Riyadh',
	`locationAr` varchar(200) DEFAULT 'الرياض',
	`typeEn` varchar(100) DEFAULT 'Full-time',
	`typeAr` varchar(100) DEFAULT 'دوام كامل',
	`descriptionEn` text,
	`descriptionAr` text,
	`requirementsEn` text,
	`requirementsAr` text,
	`salaryRange` varchar(200),
	`contactEmail` varchar(320) DEFAULT 'hr@cobnb.sa',
	`jobStatus` enum('open','closed','draft') NOT NULL DEFAULT 'draft',
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_postings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`logo` varchar(1000),
	`partnerCategory` enum('press','client','ota','award') NOT NULL DEFAULT 'client',
	`partnerUrl` varchar(500),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
