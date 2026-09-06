-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rollNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "guardianEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FeeChallan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "tuitionAmount" INTEGER NOT NULL,
    "fineAmount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Unpaid',
    "paidDate" DATETIME,
    "method" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeeChallan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeeStructure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "className" TEXT NOT NULL,
    "admissionFee" INTEGER NOT NULL,
    "monthlyTuition" INTEGER NOT NULL,
    "examFee" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdmissionApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "classAppliedFor" TEXT NOT NULL,
    "previousSchool" TEXT,
    "guardianName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JobOpening" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobOpeningId" INTEGER,
    "applicantName" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "coverMessage" TEXT,
    "resumeFilePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobApplication_jobOpeningId_fkey" FOREIGN KEY ("jobOpeningId") REFERENCES "JobOpening" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacultyMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "photoPath" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "colorTheme" TEXT NOT NULL DEFAULT 'blue',
    "iconKey" TEXT NOT NULL DEFAULT 'camera',
    "displayOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GalleryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventOrNews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JournalIssue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "issueLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publishDate" DATETIME NOT NULL,
    "pdfFilePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JournalSubscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "subscribedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNumber_key" ON "Student"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FeeStructure_className_key" ON "FeeStructure"("className");

-- CreateIndex
CREATE UNIQUE INDEX "JournalSubscriber_email_key" ON "JournalSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
