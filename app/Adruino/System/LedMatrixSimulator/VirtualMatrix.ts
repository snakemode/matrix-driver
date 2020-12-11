import { CarriageReturnMode, IndexMode, LedMatrixConfiguration } from "../../../types";
import { ILedStrip } from "./ILedStrip";

export class VirtualMatrix implements ILedStrip {

    private _root: HTMLElement;
    private _config: LedMatrixConfiguration;
    private _totalPixels: number;

    public get totalPixelCount() {
        return this._totalPixels;
    };

    constructor(rootElement: HTMLElement | string, configuration: LedMatrixConfiguration) {
        this._root = typeof rootElement === "string" ? document.getElementById(rootElement) : rootElement;
        this._config = configuration;
        this._totalPixels = configuration.width * configuration.height;
    }

    public async setPixelColor(pixelNumber: number, r: number, g: number, b: number) {
        const element = document.getElementById("pixel-" + pixelNumber);
        if (element) {
            element.style.backgroundColor = `rgb(${r},${g},${b})`;
        }
    }

    public clear() {
        for (let i = 0; i < this._totalPixels; i++) {
            this.setPixelColor(i, 0, 0, 0);
        }
    }

    public display() {
        this._root.innerHTML = "";
        let pixelNumber = 0;

        for (let y = 0; y < this._config.height; y++) {
            const row = document.createElement("div");
            row.classList.add("row");

            for (let x = 0; x < this._config.width; x++) {

                const pixel = this.adjustPixelNumberBasedOnConfiguration(pixelNumber);

                const cell = document.createElement("div");
                cell.id = `pixel-${pixel}`;
                cell.classList.add("cell");
                cell.setAttribute("data-coord", `{ "x": ${x}, "y": ${y} }`);

                cell.style.backgroundColor = `rgb(0,0,0)`;
                cell.style.width = 100 / this._config.width + "%";

                row.appendChild(cell);
                pixelNumber++;
            }

            this._root.appendChild(row);
        }
    }

    private adjustPixelNumberBasedOnConfiguration(pixel: number) {

        const currentRowNumber = Math.floor(pixel / this._config.width);

        let rowFlaggedForInversion = false;
        if (this._config.indexFrom === IndexMode.TopLeft && this._config.carriageReturnMode === CarriageReturnMode.Snaked) {
            rowFlaggedForInversion = Math.floor(currentRowNumber % 2) == 1;
        } else if (this._config.indexFrom === IndexMode.TopRight) {

            if (this._config.carriageReturnMode === CarriageReturnMode.Snaked) {
                rowFlaggedForInversion = Math.floor(currentRowNumber % 2) == 0;
            } else {
                rowFlaggedForInversion = true;
            }
        }

        let position = Math.floor(pixel % this._config.width);

        if (rowFlaggedForInversion) {
            position = ((this._config.width - 1) - position);
        }

        let snakePixelId = position + (currentRowNumber * this._config.width);
        return snakePixelId;
    }
}
