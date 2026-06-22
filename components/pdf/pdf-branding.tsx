import { View, Text, Svg, Line, Path, Circle } from "@react-pdf/renderer";
import { PDF_COLORS, pdfStyles } from "./pdf-theme";

function PdfShrineIcon() {
  const stroke = PDF_COLORS.muted;
  return (
    <Svg width={52} height={32} viewBox="0 0 200 120">
      <Line x1={28} y1={108} x2={28} y2={42} stroke={stroke} strokeWidth={1.2} />
      <Line x1={22} y1={42} x2={34} y2={42} stroke={stroke} strokeWidth={1.2} />
      <Path d="M28 36 L32 42 L24 42 Z" stroke={stroke} strokeWidth={1} fill="none" />
      <Line x1={172} y1={108} x2={172} y2={42} stroke={stroke} strokeWidth={1.2} />
      <Line x1={166} y1={42} x2={178} y2={42} stroke={stroke} strokeWidth={1.2} />
      <Path d="M172 36 L176 42 L168 42 Z" stroke={stroke} strokeWidth={1} fill="none" />
      <Path
        d="M60 78 C60 48, 85 28, 100 26 C115 28, 140 48, 140 78"
        stroke={stroke}
        strokeWidth={1.4}
      />
      <Line x1={58} y1={78} x2={142} y2={78} stroke={stroke} strokeWidth={1} />
      <Path d="M82 108 L82 86 Q100 68 118 86 L118 108" stroke={stroke} strokeWidth={1.2} />
      <Line x1={40} y1={108} x2={160} y2={108} stroke={stroke} strokeWidth={0.8} />
      <Line x1={100} y1={26} x2={100} y2={16} stroke={stroke} strokeWidth={1} />
      <Circle cx={100} cy={14} r={2} stroke={stroke} strokeWidth={0.8} fill="none" />
    </Svg>
  );
}

export function PdfLogoHeader() {
  return (
    <View style={pdfStyles.logoRow}>
      <PdfShrineIcon />
      <View style={pdfStyles.logoTextBlock}>
        <Text style={pdfStyles.logoArabic}>مُهَج</Text>
        <Text style={pdfStyles.logoSubtitle}>The heart&apos;s last blood</Text>
      </View>
    </View>
  );
}

export function PdfArabicDua() {
  return (
    <View style={pdfStyles.duaBlock}>
      <Text style={pdfStyles.duaArabic}>
        <Text style={pdfStyles.duaGold}>الَّذِينَ بَذَلُوا مُهَجَهُمْ دُونَ </Text>
        <Text style={pdfStyles.duaHussain}>الْحُسَيْنِ</Text>
        <Text style={pdfStyles.duaGold}> عَلَيْهِ السَّلَامُ</Text>
      </Text>
      <Text style={pdfStyles.duaTranslation}>
        Those who sacrificed their hearts&apos; blood and vital lifeforce for the sake of Hussain
        (AS).
      </Text>
    </View>
  );
}
