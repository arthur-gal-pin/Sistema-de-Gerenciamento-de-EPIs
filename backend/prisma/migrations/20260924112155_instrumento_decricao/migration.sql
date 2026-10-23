/*
  Warnings:

  - Added the required column `FuncaoInstrumento` to the `TB_INSTRUMENTO` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[TB_INSTRUMENTO] ADD [FuncaoInstrumento] NVARCHAR(500) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
