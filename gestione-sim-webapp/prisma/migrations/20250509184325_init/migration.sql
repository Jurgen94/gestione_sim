-- CreateTable
CREATE TABLE "Societa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "piva" TEXT NOT NULL,
    "ragione_sociale" TEXT NOT NULL,
    "referente" TEXT,
    "iban" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "iccid" TEXT NOT NULL,
    "operatore" TEXT NOT NULL,
    "stato" TEXT NOT NULL,
    "data_fatturazione" DATETIME,
    "costo_mensile" REAL NOT NULL,
    "minuti_lavorati" INTEGER,
    "societaId" INTEGER NOT NULL,
    CONSTRAINT "Sim_societaId_fkey" FOREIGN KEY ("societaId") REFERENCES "Societa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Societa_piva_key" ON "Societa"("piva");

-- CreateIndex
CREATE UNIQUE INDEX "Sim_iccid_key" ON "Sim"("iccid");
