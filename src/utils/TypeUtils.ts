export default class TypeUtils {
    static byteArrayToImageURL(value: number[] | Uint8Array): string {
        const byteArray = new Uint8Array(value);
        const blob = new Blob([byteArray], { type: "image/png" });
        return URL.createObjectURL(blob);
    }
    static blobToUint8Array = (blob: Blob): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                resolve(new Uint8Array(arrayBuffer));
            };

            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    };

    static async fetchUint8ArrayFromUrl(url: string) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            const uint8Array = new Uint8Array(arrayBuffer);

            return uint8Array;
        } catch (error) {
            console.error('Error fetching Uint8Array:', error);
        }
    }
}