import { Transaction } from "@/data/mockData";

export function exportCSV(transactions: Transaction[]) {
  const headers = ["ID", "Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) =>
    [t.id, t.date, `"${t.description}"`, t.category, t.type, t.amount].join(
      ",",
    ),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  downloadFile(csv, "transactions.csv", "text/csv");
}

export function exportJSON(transactions: Transaction[]) {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, "transactions.json", "application/json");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
