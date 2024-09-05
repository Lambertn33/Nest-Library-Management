/*
  Warnings:

  - Added the required column `book_no` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "book_no" TEXT NOT NULL;
