BEGIN TRY

BEGIN TRAN;

-- AlterTable
-- A validação de domínio (Funcionario.ts) permite nomes de até 50 caracteres,
-- mas a coluna estava definida como NVARCHAR(30), causando falha no banco
-- para nomes entre 31 e 50 caracteres que já haviam passado na validação da aplicação.
ALTER TABLE [dbo].[TB_FUNCIONARIOS] ALTER COLUMN [NomeFuncionario] NVARCHAR(50) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
