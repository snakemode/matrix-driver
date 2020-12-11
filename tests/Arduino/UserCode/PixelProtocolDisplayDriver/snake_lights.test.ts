import { Coord, SnakeLights } from "../../../../app";
import { carriage_return_mode, displayConfiguration, index_mode } from "../../../../app/Adruino/UserCode/PixelProtocolDisplayDriver/DataStructures";

describe("Snake Lights", () => {

    let config: displayConfiguration;
    beforeEach(() => {
        config = {
            width: 2,
            height: 2,
            carriageReturnMode: carriage_return_mode.REGULAR,
            indexMode: index_mode.TOP_LEFT,
            gpioPin: 0,
            pixelType: 0
        };
    });

    it("adjustCoordinatesToMatchDisplay, coord: top left pixel, wiring: top left:horizontal, no change", () => {
        config.indexMode = index_mode.TOP_LEFT;
        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 0, pixel_number: 0 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top right pixel, wiring: top left:horizontal, no change", () => {
        config.indexMode = index_mode.TOP_LEFT;
        const coord = { x: 0, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 1, pixel_number: 2 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top left left, wiring: top right:horizontal, x inverted", () => {
        config.indexMode = index_mode.TOP_RIGHT;
        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 1, y: 0, pixel_number: 1 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top right pixel, wiring: top right:horizontal, x inverted", () => {
        config.indexMode = index_mode.TOP_RIGHT;
        const coord = { x: 0, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 1, y: 1, pixel_number: 3 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top left pixel, wiring: bottom left:horizontal, y inverted", () => {
        config.indexMode = index_mode.BOTTOM_LEFT;
        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 1, pixel_number: 2 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: bottom left pixel, wiring: bottom left:horizontal, y inverted", () => {
        config.indexMode = index_mode.BOTTOM_LEFT;
        const coord = { x: 0, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 0, pixel_number: 0 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top left pixel, wiring: bottom right:horizontal, x and y inverted", () => {
        config.indexMode = index_mode.BOTTOM_RIGHT;
        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 1, y: 1, pixel_number: 3 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: bottom left pixel, wiring: bottom right:horizontal, x and y inverted", () => {
        config.indexMode = index_mode.BOTTOM_RIGHT;
        const coord = { x: 1, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 1, pixel_number: 2 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: bottom right pixel, wiring: bottom right:horizontal, x and y inverted", () => {
        config.indexMode = index_mode.BOTTOM_RIGHT;
        const coord = { x: 1, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 0, pixel_number: 0 });
    });

    // snaked horizontally

    it("adjustCoordinatesToMatchDisplay, coord: top left pixel, wiring: top left:snaked:horizontal, no change", () => {
        config.indexMode = index_mode.TOP_LEFT;
        config.carriageReturnMode = carriage_return_mode.SNAKED;

        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 0, pixel_number: 0 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: bottom left pixel, wiring: top left:snaked:horizontal, x inverted", () => {
        config.indexMode = index_mode.TOP_LEFT;
        config.carriageReturnMode = carriage_return_mode.SNAKED;

        const coord = { x: 0, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 1, y: 1, pixel_number: 3 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top left pixel, wiring: top right:snaked:horizontal, x inverted cos top right wired", () => {
        config.indexMode = index_mode.TOP_RIGHT;
        config.carriageReturnMode = carriage_return_mode.SNAKED;

        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 1, y: 0, pixel_number: 1 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: bottom left pixel, wiring: top right:snaked:horizontal, x NOT inverted cos top right wired", () => {
        config.indexMode = index_mode.TOP_RIGHT;
        config.carriageReturnMode = carriage_return_mode.SNAKED;

        const coord = { x: 0, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 1, pixel_number: 2 });
    });

    // snaked vertical

    it("adjustCoordinatesToMatchDisplay, coord: top left pixel, wiring: top left:snaked:vertical, no change cos first col", () => {
        config.indexMode = index_mode.TOP_LEFT;
        config.carriageReturnMode = carriage_return_mode.SNAKED_VERTICALLY;

        const coord = { x: 0, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 0, pixel_number: 0 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: bottom left pixel, wiring: top left:snaked:vertical, no change first col", () => {
        config.indexMode = index_mode.TOP_LEFT;
        config.carriageReturnMode = carriage_return_mode.SNAKED_VERTICALLY;

        const coord = { x: 0, y: 1 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 0, y: 1, pixel_number: 1 });
    });

    it("adjustCoordinatesToMatchDisplay, coord: top right pixel, wiring: top left:snaked:vertical, y inverted cos second col", () => {
        config.indexMode = index_mode.TOP_LEFT;
        config.carriageReturnMode = carriage_return_mode.SNAKED_VERTICALLY;

        const coord = { x: 1, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        expect(adjusted).toStrictEqual({ x: 1, y: 1, pixel_number: 3 });
    });


    it("adjustCoordinatesToMatchDisplay [manually testing scenarios]", () => {
        config.width = 32;
        config.height = 8;

        config.indexMode = index_mode.TOP_RIGHT;
        config.carriageReturnMode = carriage_return_mode.SNAKED_VERTICALLY;

        const coord = { x: 31, y: 0 };

        const adjusted = adjustCoordinatesToMatchDisplay(coord, config);

        const pixel_number = adjusted.y + (adjusted.x * config.height);
        console.log(pixel_number);

        expect(adjusted.pixel_number).toStrictEqual(0);
    });

});

function adjustCoordinatesToMatchDisplay(coord: Coord, config: displayConfiguration) {
    return SnakeLights.adjustXYToMatchDisplay(coord.x, coord.y, config);
}
