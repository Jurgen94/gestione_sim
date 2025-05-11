/*
  Warnings:

  - The primary key for the `Sim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `iban` on the `Societa` table. All the data in the column will be lost.
  - You are about to drop the column `referente` on the `Societa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sim" DROP CONSTRAINT "Sim_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sim_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sim_id_seq";

-- AlterTable
ALTER TABLE "Societa" DROP COLUMN "iban",
DROP COLUMN "referente",
ADD COLUMN     "cf_amm" TEXT,
ADD COLUMN     "cognome_amm" TEXT,
ADD COLUMN     "data_nascita_amm" TIMESTAMP(3),
ADD COLUMN     "luogo_nascita_amm" TEXT,
ADD COLUMN     "n_dipendenti" INTEGER,
ADD COLUMN     "nome_amm" TEXT,
ADD COLUMN     "sede_legale" TEXT,
ADD COLUMN     "telefono" TEXT;

-- CreateTable
CREATE TABLE "Documento" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "societaId" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_societaId_fkey" FOREIGN KEY ("societaId") REFERENCES "Societa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
