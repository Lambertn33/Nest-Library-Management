/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[book_no]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "borrow_requests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "borrow_requests_id_key" ON "borrow_requests"("id");

-- CreateIndex
CREATE UNIQUE INDEX "books_title_key" ON "books"("title");

-- CreateIndex
CREATE UNIQUE INDEX "books_book_no_key" ON "books"("book_no");

-- AddForeignKey
ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
