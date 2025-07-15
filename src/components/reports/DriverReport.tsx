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
import { DriverData } from "@/api/driverAPI";

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
  driver: DriverData[];
  lotNumber: number;
  date: string;
}

export const DriverReportDocument: React.FC<ReportProps> = ({
  driver,
  lotNumber,
  date,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>ລາຍງານເສັ້ນທາງ</Text>
      <Text style={styles.subtitle}>
        Lot {lotNumber} · Date: {date}
      </Text>

      <View style={styles.headerRow}>
        {["ລະຫັດຄົນຂັບ", "ຊື່ຄົນຂັບ", "ເບີໂທ", "ສະຖານະ"].map((h) => (
          <Text style={styles.headerCell} key={h}>
            {h}
          </Text>
        ))}
      </View>

      {driver.map((d, i) => (
        <View style={styles.row} key={i}>
          <Text style={styles.cell}>{d.id || ""}</Text>
          <Text style={styles.cell}>{d.name || ""}</Text>
          <Text style={styles.cell}>{d.tel || ""}</Text>
          <Text style={styles.cell}>{d.status || ""}</Text>
        </View>
      ))}

      <View style={styles.count}>
        <Text>ລວມທັງໝົດ: {driver.length}</Text>
        <View style={styles.signatureRow}>
          <Text style={styles.signature}>ເຊັນຜູ້ຈັດການ</Text>
          <Text style={styles.signature}>ເຊັນຜູ້ລາຍງານ</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function handleExportPDF(driver: DriverData[]) {
  const lotKey = "driverReportLot";
  const lotNumber =
    (parseInt(localStorage.getItem(lotKey) || "0", 10) || 0) + 1;
  localStorage.setItem(lotKey, lotNumber.toString());

  const date = new Date().toLocaleDateString("en-GB");
  const blob = await pdf(
    <DriverReportDocument driver={driver} lotNumber={lotNumber} date={date} />
  ).toBlob();

  saveAs(blob, `Driver_Report_Lot${lotNumber}.pdf`);
}
