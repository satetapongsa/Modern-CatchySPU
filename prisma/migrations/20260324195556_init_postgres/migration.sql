-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "slot" TEXT,
    "shardedDb" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event" TEXT NOT NULL,
    "loadLevel" INTEGER NOT NULL,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");
