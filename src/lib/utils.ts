export class Utils {
    // https://stackoverflow.com/questions/8495687/split-array-into-chunks
    static chunk = (arr: any[], chunkSize: number) => {
        return arr.reduce((all, one, i) => {
            const ch = Math.floor(i / chunkSize);
            all[ch] = [].concat((all[ch] || []),one);
            return all;
         }, [])
    }

    static chunkJoin = (arr: any[], chunkSize: number) => {
        const chunks = Utils.chunk(arr, chunkSize)
            .map((x: any) => x.join(''));
        return chunks;
    }
}