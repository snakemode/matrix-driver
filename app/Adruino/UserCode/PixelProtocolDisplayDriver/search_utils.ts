export class search_utils {

    public static indexOf(bytes: number[], length: number, byteValueToFind: number) {
        for (let i = 0; i < length; i++) {
            if (bytes[i] == byteValueToFind) {
                return i;
            }
        }
        return -1;
    }

}