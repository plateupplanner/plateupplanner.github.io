import { itemData } from './itemData';

const idMap = new Map(itemData);

function convertLegacy(id: string): [string, string] {
  const value = idMap.get(id) ?? ['404.png', 'Empty tile'];
  return [value[0], value[1]];
}

const itemsData: [string, [string, string]][] = [
  ['00', convertLegacy('00')],
  ['O9', convertLegacy('1154757341')],
  ['UQ', convertLegacy('862493270')],
  ['96', convertLegacy('1266458729')],
  ['ud', convertLegacy('-1448690107')],
  ['JD', convertLegacy('-1068749602')],
  ['2Q', convertLegacy('-1311702572')],
  ['e6', convertLegacy('1921027834')],
  ['5V', convertLegacy('-770041014')],
  ['n2', convertLegacy('481495292')],
  ['0R', convertLegacy('1551609169')],
  ['2V', convertLegacy('2127051779')],
  ['Qs', convertLegacy('-1632826946')],
  ['70', convertLegacy('-1855909480')],
  ['ze', convertLegacy('-1248669347')],
  ['wn', convertLegacy('-1857890774')],
  ['E2', convertLegacy('-1573577293')],
  ['31', convertLegacy('1656358740')],
  ['ot', convertLegacy('-759808000')],
  ['ao', convertLegacy('380220741')],
  ['m2', convertLegacy('1313469794')],
  ['hp', convertLegacy('739504637')],
  ['NH', convertLegacy('-957949759')],
  ['2A', convertLegacy('235423916')],
  ['94', convertLegacy('314862254')],
  ['3D', convertLegacy('1765889988')],
  ['WS', convertLegacy('1738351766')],
  ['kv', convertLegacy('2023704259')],
  ['lq', convertLegacy('209074140')],
  ['tV', convertLegacy('-3721951')],
  ['cJ', convertLegacy('-203679687')],
  ['T2', convertLegacy('-34659638')],
  ['GM', convertLegacy('-2019409936')],
  ['qB', convertLegacy('938247786')],
  ['r6', convertLegacy('639111696')],
  ['Yn', convertLegacy('1358522063')],
  ['mD', convertLegacy('1528688658')],
  ['zZ', convertLegacy('2080633647')],
  ['CZ', convertLegacy('446555792')],
  ['oH', convertLegacy('-1013770159')],
  ['3G', convertLegacy('1129858275')],
  ['qC', convertLegacy('1648733244')],
  ['J1', convertLegacy('221442949')],
  ['bZ', convertLegacy('-266993023')],
  ['W1', convertLegacy('1083874952')],
  ['Nt', convertLegacy('1860904347')],
  ['v2', convertLegacy('1467371088')],
  ['1g', convertLegacy('-214126192')],
  ['xm', convertLegacy('-823922901')],
  ['HD', convertLegacy('-1993346570')],
  ['VX', convertLegacy('1776760557')],
  ['6O', convertLegacy('-1495393751')],
  ['9V', convertLegacy('-2091039911')],
  ['Ad', convertLegacy('1351951642')],
  ['1Z', convertLegacy('-751458770')],
  ['2M', convertLegacy('434150763')],
  ['1P', convertLegacy('624465484')],
  ['fU', convertLegacy('1973114260')],
  ['BM', convertLegacy('-1029710921')],
  ['sC', convertLegacy('-1238047163')],
  ['3V', convertLegacy('-331651461-Left')], // Left
  ['U7', convertLegacy('-331651461-Right')], // Right
  ['mq', convertLegacy('-331651461-Straight')], // Straight
  ['w5', convertLegacy('-1906799936')],
  ['Dg', convertLegacy('-1462602185')],
  ['Z9', convertLegacy('1329097317')],
  ['eY', convertLegacy('-1357906425')],
  ['60', convertLegacy('505496455')],
  ['AY', convertLegacy('-1440053805')],
  ['F5', convertLegacy('-571205127')],
  ['8B', convertLegacy('1139247360')],
  ['CR', convertLegacy('1446975727')],
  ['5T', convertLegacy('-729493805')],
  ['4K', convertLegacy('-272437832')],
  ['ZE', convertLegacy('723626409')],
  ['kF', convertLegacy('1796077718')],
  ['py', convertLegacy('230848637')],
  ['pj', convertLegacy('238041352')],
  ['5d', convertLegacy('-1813414500')],
  ['H5', convertLegacy('532998682')],
  ['zg', convertLegacy('459840623')],
  ['hM', convertLegacy('-1610332021')],
  ['Gt', convertLegacy('-246383526')],
  ['lu', convertLegacy('door')], // Door
  ['Dq', convertLegacy('-349733673')],
  ['yi', convertLegacy('-905438738')],
  ['J0', convertLegacy('-2092567672')],
  ['FG', convertLegacy('1807525572')],
  ['dG', convertLegacy('-1573812073')],
  ['EC', convertLegacy('743010293')],
  ['Dc', convertLegacy('759552160')],
  ['P7', convertLegacy('385684499')],
  ['Ar', convertLegacy('-452101383')],
  ['zQ', convertLegacy('-117339838')],
  ['HL', convertLegacy('148543530')],
  ['Xf', convertLegacy('783588616')],
  ['IX', convertLegacy('303858729')],
  ['gh', convertLegacy('-2070005162')],
  ['6D', convertLegacy('-1609758240')],
  ['jC', convertLegacy('976574457')],
  ['gN', convertLegacy('735786885')],
  ['NV', convertLegacy('961148621')],
  ['Tl', convertLegacy('143484231')],
  ['Ls', convertLegacy('-1735137431')],
  ['AG', convertLegacy('925796718')],
  ['B9', convertLegacy('-63118559')],
  ['1D', convertLegacy('-1132411297')],
  ['Sx', convertLegacy('1799769627')],
  ['xQ', convertLegacy('801015432')],
  ['vu', convertLegacy('-1533430406')],
  ['We', convertLegacy('-965827229')],
  ['NG', convertLegacy('-117356585')],
  ['Yr', convertLegacy('1470180731')],
  ['SS', convertLegacy('1193867305')],
  ['i9', convertLegacy('-1210117767')],
  ['uW', convertLegacy('269523389')],
  ['mL', convertLegacy('120342736')],
  ['U1', convertLegacy('-557736569')],
  ['CH', convertLegacy('-1507801323')],
  ['jt', convertLegacy('1800865634')],
  ['E5', convertLegacy('-484165118')],
  ['5B', convertLegacy('-1097889139')],
  ['Ja', convertLegacy('1834063794')],
  ['WU', convertLegacy('-1963699221')],
  ['2o', convertLegacy('-1434800013')],
  ['fH', convertLegacy('-2042103798')],
  ['co', convertLegacy('44541785')],
  ['I4', convertLegacy('-1055654549')],
  ['Qi', convertLegacy('-1201769154')],
  ['XJ', convertLegacy('595306349')],
  ['um', convertLegacy('-471813067')],
  ['zd', convertLegacy('-2133205155')],
  ['Vi', convertLegacy('-1598460622')],
  ['KE', convertLegacy('1377093570')],
  ['Ix', convertLegacy('-762638188')],
  ['1K', convertLegacy('-712909563')],
  ['ET', convertLegacy('-1506824829')],
  ['0s', convertLegacy('-1353971407')],
  ['UJ', convertLegacy('-1817838704')],
  ['qV', convertLegacy('756364626')],

  // Modded
  ['hz', convertLegacy('-1730837026')], // Avocado
  ['VN', convertLegacy('1764595035')], // Banana
  ['3k', convertLegacy('-383099856')], // Blueberries
  ['Ds', convertLegacy('1179596327')], // Chicken
  ['rk', convertLegacy('1230738176')], // Cinnamon
  ['ye', convertLegacy('-513909256')], // Cocoa Powder
  ['de', convertLegacy('89606396')], // Drumstick
  ['xn', convertLegacy('943091639')], // Garlic
  ['Fr', convertLegacy('-1606497315')], // Honey
  ['K4', convertLegacy('1925531119')], // Ice
  ['uS', convertLegacy('-809522908')], // Jalapenos
  ['C8', convertLegacy('-246158755')], // Lime
  ['GB', convertLegacy('1650604245')], // Macaroni
  ['ag', convertLegacy('895636045')], // Noodles
  ['Af', convertLegacy('-1437429205')], // Oats
  ['sx', convertLegacy('1587659483')], // Orange Juice
  ['mF', convertLegacy('-1977263982')], // Peppers
  ['5M', convertLegacy('-2118978079')], // Pork
  ['wI', convertLegacy('-421276901')], // Spinach
  ['ps', convertLegacy('1243444183')], // Strawberries
  ['ZO', convertLegacy('-2008330096')], // Syrup
  ['yb', convertLegacy('-1232584574')], // Tortillas
  ['YX', convertLegacy('-1164406874')], // Vinegar
  ['BS', convertLegacy('-1475845771')], // Whipping Cream
];

export const legacyItemData = itemsData;
