import * as SQLite from "expo-sqlite";

export async function initializeDatabase() {
  const db = SQLite.openDatabase("fotos.db");
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS fotos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foto_uri TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      );`
    );
  });
  return db;
}