export class Utils {
  // https://stackoverflow.com/questions/8495687/split-array-into-chunks
  static chunk<T>(arr: T[], chunkSize: number): T[][] {
    return arr.reduce((all, one, i) => {
      const ch = Math.floor(i / chunkSize);
      all[ch] = [...(all[ch] || []), one];
      return all;
    }, [] as T[][]);
  }

  static chunkJoin<T>(arr: T[], chunkSize: number) {
    const chunks = Utils.chunk(arr, chunkSize).map((x) => x.join(''));
    return chunks;
  }
}
