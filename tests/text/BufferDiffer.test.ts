import { BufferDiffer } from "../../app/text/BufferDiffer";

describe("BufferDiffer", () => {

    it("createDelta, no change when the same", async () => {
        const first = ["x"];
        const second = ["x"];

        const result = BufferDiffer.createDelta(first, second);

        expect(result).toStrictEqual([
            " "
        ]);
    });

    it("createDelta, no change when the same (2)", async () => {
        const first = [" "];
        const second = [" "];

        const result = BufferDiffer.createDelta(first, second);

        expect(result).toStrictEqual([
            " "
        ]);
    });

    it("createDelta, creates accurate delta when item added", async () => {
        const first = [" "];
        const second = ["x"];

        const result = BufferDiffer.createDelta(first, second);

        expect(result).toStrictEqual([
            "+"
        ]);
    });

    it("createDelta, creates accurate delta when item removed", async () => {
        const first = ["x"];
        const second = [" "];

        const result = BufferDiffer.createDelta(first, second);

        expect(result).toStrictEqual([
            "-"
        ]);
    });

    it("createDelta, creates accurate delta when item moved", async () => {
        const first = [" x "];
        const second = ["x  "];

        const result = BufferDiffer.createDelta(first, second);

        expect(result).toStrictEqual([
            "+- "
        ]);
    });

    it("createDelta, creates accurate delta when two samples not the same length", async () => {
        const first = [" x  "];
        const second = ["x  "];

        const result = BufferDiffer.createDelta(first, second);

        expect(result).toStrictEqual([
            "+-  "
        ]);
    });

});