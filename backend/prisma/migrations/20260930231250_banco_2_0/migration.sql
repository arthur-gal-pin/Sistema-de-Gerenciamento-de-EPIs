/*
  Warnings:

  - You are about to drop the column `DataHoraRealizacao` on the `TB_AMOSTRA_ENSAIO` table. All the data in the column will be lost.
  - You are about to drop the column `FK_IdFuncionario` on the `TB_AMOSTRA_ENSAIO` table. All the data in the column will be lost.
  - You are about to drop the column `FK_IdFuncionario` on the `TB_ENSAIOS` table. All the data in the column will be lost.
  - Added the required column `NomeDado` to the `TB_DADOS_ENSAIO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NomeEnsaio` to the `TB_ENSAIOS` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TB_AMOSTRA_ENSAIO] DROP CONSTRAINT [TB_AMOSTRA_ENSAIO_FK_IdFuncionario_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TB_ENSAIOS] DROP CONSTRAINT [TB_ENSAIOS_FK_IdFuncionario_fkey];

-- AlterTable
ALTER TABLE [dbo].[TB_AMOSTRA_ENSAIO] ALTER COLUMN [Pressao] DECIMAL(10,2) NULL;
ALTER TABLE [dbo].[TB_AMOSTRA_ENSAIO] DROP COLUMN [DataHoraRealizacao],
[FK_IdFuncionario];

-- AlterTable
ALTER TABLE [dbo].[TB_CAMPO_ENSAIO] ADD CONSTRAINT [TB_CAMPO_ENSAIO_Obrigatoriedade_df] DEFAULT 1 FOR [Obrigatoriedade];
ALTER TABLE [dbo].[TB_CAMPO_ENSAIO] ADD [Descricao] NCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[TB_DADOS_ENSAIO] ADD [NomeDado] NVARCHAR(80) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TB_ENSAIOS] DROP COLUMN [FK_IdFuncionario];
ALTER TABLE [dbo].[TB_ENSAIOS] ADD [Descricao] NVARCHAR(1000),
[NomeEnsaio] NVARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TB_FUNCIONARIOS] ADD CONSTRAINT [TB_FUNCIONARIOS_SituacaoEmpregaticia_df] DEFAULT 'ativo' FOR [SituacaoEmpregaticia];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
