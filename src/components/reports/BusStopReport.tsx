/* eslint-disable react-refresh/only-export-components */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { BusStopData } from "@/api/busStopAPI";

// 1️⃣ Register a Lao-capable font
Font.register({
  family: "NotoSansLao",
  src: "/fonts/Phetsarath-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "NotoSansLao",
    fontSize: 12,
    lineHeight: 1.4,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#0099C0",
    padding: 4,
  },
  headerCell: {
    flex: 1,
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    padding: 4,
    borderBottomWidth: 0.5,
    borderColor: "#CCC",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  count: {
    marginTop: 12,
    fontSize: 10,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  signature: {
    marginTop: 24,
    marginLeft: 48,
    marginRight: 48,
    fontSize: 12,
    textAlign: "center",
  },
});

interface ReportProps {
  stop: BusStopData[];
  lotNumber: number;
  date: string;
}

export const BusStopReportDocument: React.FC<ReportProps> = ({
  stop,
  lotNumber,
  date,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>ລາຍງານປະເພດລົດເມ</Text>
      <Text style={styles.subtitle}>
        Lot {lotNumber} · Date: {date}
      </Text>

      <View style={styles.headerRow}>
        {["ລະຫັດປ້າຍລົດເມ", "ຊື່ປ້າຍລົດເມ", "Lattitude", "Longitude"].map((h) => (
          <Text style={styles.headerCell} key={h}>
            {h}
          </Text>
        ))}
      </View>

      {stop.map((s, i) => (
        <View style={styles.row} key={i}>
          <Text style={styles.cell}>{s.id || ""}</Text>
          <Text style={styles.cell}>{s.name || ""}</Text>
          <Text style={styles.cell}>{s.lat || ""}</Text>
          <Text style={styles.cell}>{s.lng || ""}</Text>
        </View>
      ))}

      <View style={styles.count}>
        <Text>ລວມທັງໝົດ: {stop.length}</Text>
        <View style={styles.signatureRow}>
          <Text style={styles.signature}>ເຊັນຜູ້ຈັດການ</Text>
          <Text style={styles.signature}>ເຊັນຜູ້ລາຍງານ</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function handleExportPDF(stop: BusStopData[]) {
  const lotKey = "busStopReportLot";
  const lotNumber =
    (parseInt(localStorage.getItem(lotKey) || "0", 10) || 0) + 1;
  localStorage.setItem(lotKey, lotNumber.toString());

  const date = new Date().toLocaleDateString("en-GB");
  const blob = await pdf(
    <BusStopReportDocument stop={stop} lotNumber={lotNumber} date={date} />
  ).toBlob();

  saveAs(blob, `Bus_Stop_Report_Lot${lotNumber}.pdf`);
}
