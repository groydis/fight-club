import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class SharpBackgroundService {
  async removeEdgeBackground(buffer: Buffer): Promise<Buffer> {
    // Ensure we get 4 channels
    const image = sharp(buffer).ensureAlpha(); // ensures RGBA
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const transparentData = Buffer.from(data); // clone

    const target = this.detectDominantEdgeColor(data, info.width, info.height);
    const tolerance = 40;

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const close =
        Math.abs(r - target.r) < tolerance &&
        Math.abs(g - target.g) < tolerance &&
        Math.abs(b - target.b) < tolerance;

      if (close && info.channels === 4) {
        transparentData[i + 3] = 0; // make transparent
      }
    }

    return sharp(transparentData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    })
      .png()
      .toBuffer();
  }

  private detectDominantEdgeColor(
    data: Buffer,
    width: number,
    height: number,
  ): { r: number; g: number; b: number } {
    const colorCounts = new Map<string, number>();

    const getKey = (r: number, g: number, b: number) => `${r},${g},${b}`;

    const addColor = (r: number, g: number, b: number) => {
      const key = getKey(r, g, b);
      colorCounts.set(key, (colorCounts.get(key) ?? 0) + 1);
    };

    for (let x = 0; x < width; x++) {
      const topIdx = (x + 0 * width) * 4;
      const bottomIdx = (x + (height - 1) * width) * 4;
      addColor(data[topIdx], data[topIdx + 1], data[topIdx + 2]);
      addColor(data[bottomIdx], data[bottomIdx + 1], data[bottomIdx + 2]);
    }

    for (let y = 0; y < height; y++) {
      const leftIdx = (0 + y * width) * 4;
      const rightIdx = (width - 1 + y * width) * 4;
      addColor(data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]);
      addColor(data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]);
    }

    const [dominantColor] = [...colorCounts.entries()].reduce((a, b) =>
      a[1] > b[1] ? a : b,
    );
    const [r, g, b] = dominantColor.split(',').map(Number);
    return { r, g, b };
  }
}
