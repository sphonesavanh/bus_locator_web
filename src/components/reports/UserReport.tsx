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
import { UserData } from "@/api/userAPI";

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
  user: UserData[];
  lotNumber: number;
  date: string;
}

export const UserReportDocument: React.FC<ReportProps> = ({
  user,
  lotNumber,
  date,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>ລາຍງານຜູ້ໃຊ້ງານ</Text>
      <Text style={styles.subtitle}>
        ຊຸດທີ {lotNumber} · ວັນທີ: {date}
      </Text>

      <View style={styles.headerRow}>
        {["ລະຫັດຜູ້ໃຊ້ງານ", "ຊື່ຜູ້ໃຊ້ງານ", "ອີເມວ", "ເບີໂທ"].map((h) => (
          <Text style={styles.headerCell} key={h}>
            {h}
          </Text>
        ))}
      </View>

      {user.map((u, i) => (
        <View style={styles.row} key={i}>
          <Text style={styles.cell}>{u.id || ""}</Text>
          <Text style={styles.cell}>{u.name || ""}</Text>
          <Text style={styles.cell}>{u.email || ""}</Text>
          <Text style={styles.cell}>{u.tel || ""}</Text>
        </View>
      ))}

      <View style={styles.count}>
        <Text>ລວມທັງໝົດ: {user.length}</Text>
        <View style={styles.signatureRow}>
          <Text style={styles.signature}>ເຊັນຜູ້ຈັດການ</Text>
          <Text style={styles.signature}>ເຊັນຜູ້ລາຍງານ</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function handleExportPDF(user: UserData[]) {
  const lotKey = "userReportLot";
  const lotNumber =
    (parseInt(localStorage.getItem(lotKey) || "0", 10) || 0) + 1;
  localStorage.setItem(lotKey, lotNumber.toString());

  const date = new Date().toLocaleDateString("en-GB");
  const blob = await pdf(
    <UserReportDocument user={user} lotNumber={lotNumber} date={date} />
  ).toBlob();

  saveAs(blob, `User_Report_Lot${lotNumber}.pdf`);
}
