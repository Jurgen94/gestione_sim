-- CreateTable
CREATE TABLE "Societa" (
    "id" SERIAL NOT NULL,
    "piva" TEXT NOT NULL,
    "ragione_sociale" TEXT NOT NULL,
    "referente" TEXT,
    "iban" TEXT NOT NULL,

    CONSTRAINT "Societa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sim" (
    "id" SERIAL NOT NULL,
    "iccid" TEXT NOT NULL,
    "operatore" TEXT NOT NULL,
    "stato" TEXT NOT NULL,
    "data_fatturazione" TIMESTAMP(3),
    "costo_mensile" DOUBLE PRECISION NOT NULL,
    "minuti_lavorati" INTEGER,
    "societaId" INTEGER NOT NULL,

    CONSTRAINT "Sim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Societa_piva_key" ON "Societa"("piva");

-- CreateIndex
CREATE UNIQUE INDEX "Sim_iccid_key" ON "Sim"("iccid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Sim" ADD CONSTRAINT "Sim_societaId_fkey" FOREIGN KEY ("societaId") REFERENCES "Societa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
