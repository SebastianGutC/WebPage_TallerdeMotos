import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../assets/isotipo_mtfx.png";
import { invoiceNum } from "../../utils/generarFactura";

// ── PALETA MOTORFIX ──────────────────────────────────
const BLACK = "#181717"; // negro base
const RED = "#EF0606"; // rojo principal
const ORANGE = "#F28806"; // naranja
const YELLOW = "#F0A903"; // amarillo dorado
const WHITE = "#FFFFFF";
const OFFWHITE = "#F7F7F7";
const GRAY = "#4A4A4A";
const LGRAY = "#E8E8E8";

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: BLACK,
    backgroundColor: WHITE,
  },

  /* ── HEADER ── */
  header: {
    backgroundColor: BLACK,
    paddingTop: 24,
    paddingBottom: 0,
    paddingHorizontal: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrap: {
    width: 60,
    height: 60,
  },
  brandBlock: {
    alignItems: "flex-end",
  },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 28,
    color: WHITE,
    letterSpacing: 5,
  },
  brandSub: {
    fontSize: 7,
    color: ORANGE,
    letterSpacing: 2.5,
    marginTop: 3,
  },

  /* ── GRADIENT BAR (3 franjas simulando el degradado) ── */
  gradientBar: {
    flexDirection: "row",
    height: 5,
  },
  barRed: {
    flex: 2,
    backgroundColor: RED,
  },
  barOrange: {
    flex: 1,
    backgroundColor: ORANGE,
  },
  barYellow: {
    flex: 1,
    backgroundColor: YELLOW,
  },

  /* ── BODY ── */
  body: {
    paddingHorizontal: 36,
    paddingTop: 20,
    paddingBottom: 30,
  },

  /* ── META ROW ── */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaBox: {
    width: "47%",
    borderLeftWidth: 3,
    borderLeftColor: RED,
    paddingLeft: 10,
    paddingVertical: 4,
  },
  metaBoxRight: {
    borderLeftColor: ORANGE,
  },
  metaLabel: {
    fontSize: 6.5,
    color: GRAY,
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 11,
    color: BLACK,
    fontFamily: "Helvetica-Bold",
  },
  metaValueSub: {
    fontSize: 8,
    color: GRAY,
    marginTop: 2,
  },

  /* ── SECTION TITLE ── */
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: RED,
    letterSpacing: 2.5,
    marginBottom: 6,
  },

  /* ── TABLE HEADER ── */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BLACK,
    paddingVertical: 7,
    paddingHorizontal: 8,
    marginBottom: 1,
  },
  thText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: YELLOW,
    letterSpacing: 1,
  },

  /* ── ROWS ── */
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: LGRAY,
  },
  rowAlt: {
    backgroundColor: OFFWHITE,
  },
  cellMain: {
    fontSize: 9,
    color: BLACK,
    fontFamily: "Helvetica-Bold",
  },
  cellSub: {
    fontSize: 8.5,
    color: GRAY,
  },

  col1: { width: "42%" },
  col2: { width: "13%", alignItems: "center" },
  col3: { width: "22%", alignItems: "flex-end" },
  col4: { width: "23%", alignItems: "flex-end" },

  /* ── TOTALES ── */
  totalsOuter: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: "46%",
    borderWidth: 1,
    borderColor: LGRAY,
    borderRadius: 2,
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: LGRAY,
  },
  totalLabel: {
    fontSize: 8.5,
    color: GRAY,
  },
  totalValue: {
    fontSize: 8.5,
    color: BLACK,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: LGRAY,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  grandLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: BLACK,
    letterSpacing: 1.5,
  },
  grandValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: RED,
  },

  /* ── ACLARACIÓN ── */
  ivaNote: {
    marginTop: 6,
    fontSize: 7,
    color: GRAY,
    textAlign: "right",
  },

  /* ── FOOTER ── */
  footer: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: LGRAY,
    paddingTop: 10,
  },
  footerLeft: {
    fontSize: 7.5,
    color: GRAY,
  },
  footerCenter: {
    alignItems: "center",
  },
  footerBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: RED,
    letterSpacing: 2,
  },
  footerTagline: {
    fontSize: 6.5,
    color: ORANGE,
    marginTop: 2,
    letterSpacing: 1,
  },
  footerRight: {
    fontSize: 7.5,
    color: GRAY,
  },

  /* ── THANK YOU STRIP ── */
  thankStrip: {
    flexDirection: "row",
    marginTop: 14,
  },
  thankRed: {
    flex: 2,
    backgroundColor: RED,
    paddingVertical: 6,
    alignItems: "center",
  },
  thankOrange: {
    flex: 1,
    backgroundColor: ORANGE,
    paddingVertical: 6,
    alignItems: "center",
  },
  thankYellow: {
    flex: 1,
    backgroundColor: YELLOW,
    paddingVertical: 6,
    alignItems: "center",
  },
  thankText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: WHITE,
    letterSpacing: 1.5,
  },
  thankTextDark: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: BLACK,
    letterSpacing: 1.5,
  },
});

export const FacturaPDF = ({ carrito, usuario }) => {
  const now = new Date();
  const fecha = now.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hora = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let subtotal = 0;

  return (
    <Document>
      <Page style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Image style={styles.logoWrap} src={Logo} />
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>MOTORFIX</Text>
            <Text style={styles.brandSub}>TALLER & REPUESTOS PARA MOTOS</Text>
          </View>
        </View>

        {/* ── BARRA TRICOLOR ── */}
        <View style={styles.gradientBar}>
          <View style={styles.barRed} />
          <View style={styles.barOrange} />
          <View style={styles.barYellow} />
        </View>

        <View style={styles.body}>
          {/* ── META ── */}
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>CLIENTE</Text>
              <Text style={styles.metaValue}>{usuario?.nombre ?? "—"}</Text>
              {usuario?.email && (
                <Text style={styles.metaValueSub}>{usuario.email}</Text>
              )}
              {usuario?.telefono && (
                <Text style={styles.metaValueSub}>{usuario.telefono}</Text>
              )}
            </View>
            <View style={[styles.metaBox, styles.metaBoxRight]}>
              <Text style={styles.metaLabel}>FACTURA</Text>
              <Text style={styles.metaValue}>{invoiceNum}</Text>
              <Text style={styles.metaValueSub}>{fecha}</Text>
              <Text style={styles.metaValueSub}>{hora}</Text>
            </View>
          </View>

          {/* ── TABLA ── */}
          <Text style={styles.sectionTitle}>DETALLE DE COMPRA</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.col1]}>
              PRODUCTO / REPUESTO
            </Text>
            <View style={styles.col2}>
              <Text style={styles.thText}>CANT.</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.thText}>P. UNITARIO</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.thText}>SUBTOTAL</Text>
            </View>
          </View>

          {carrito.map((item, i) => {
            const sub = item.precio * item.cantidad;
            subtotal += sub;
            return (
              <View style={[styles.row, i % 2 !== 0 && styles.rowAlt]} key={i}>
                <Text style={[styles.cellMain, styles.col1]}>
                  {item.nombre}
                </Text>
                <View style={styles.col2}>
                  <Text style={styles.cellSub}>{item.cantidad}</Text>
                </View>
                <View style={styles.col3}>
                  <Text style={styles.cellSub}>
                    ${item.precio.toLocaleString("es-CO")}
                  </Text>
                </View>
                <View style={styles.col4}>
                  <Text style={styles.cellMain}>
                    ${sub.toLocaleString("es-CO")}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* ── TOTALES ── */}
          <View style={styles.totalsOuter}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal (sin IVA)</Text>
                <Text style={styles.totalValue}>
                  ${Math.round(subtotal / 1.19).toLocaleString("es-CO")}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IVA (19%)</Text>
                <Text style={styles.totalValue}>
                  $
                  {Math.round(subtotal - subtotal / 1.19).toLocaleString(
                    "es-CO",
                  )}
                </Text>
              </View>
              <View style={styles.grandTotalBar}>
                <Text style={styles.grandLabel}>TOTAL A PAGAR</Text>
                <Text style={styles.grandValue}>
                  ${subtotal.toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          </View>

          {/* ── FOOTER ── */}
          <View style={styles.footer}>
            <Text style={styles.footerLeft}>
              Documento electrónico{"\n"}No requiere firma
            </Text>
            <View style={styles.footerCenter}>
              <Text style={styles.footerBrand}>MOTORFIX</Text>
              <Text style={styles.footerTagline}>TALLER & REPUESTOS</Text>
            </View>
            <Text style={styles.footerRight}>
              www.motorfix.com{"\n"}Tel: 300 000 0000
            </Text>
          </View>

          {/* ── THANK YOU STRIP ── */}
          <View style={styles.thankStrip}>
            <View style={styles.thankRed}>
              <Text style={styles.thankText}>¡GRACIAS POR TU COMPRA!</Text>
            </View>
            <View style={styles.thankOrange}>
              <Text style={styles.thankText}>VUELVE PRONTO</Text>
            </View>
            <View style={styles.thankYellow}>
              <Text style={styles.thankTextDark}>MOTORFIX 🏍</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
