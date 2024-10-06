import { Color, Texture } from 'pixi.js';

/**
 * Create a radial gradient texture using a canvas element.
 * @param radius - Radius of the gradient.
 * @param colorStops - Array of colors (in hex) and their respective stop positions (from 0 to 1).
 *                     Example: [{color: PIXI.Color, stop: 0}, {color: PIXI.Color, stop: 1}]
 * @returns A PIXI.Texture with the radial gradient.
 */
export default function createRadialGradientTexture(
  radius: number,
  colorStops: { color: Color; stop: number }[]
): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = radius * 2;
  canvas.height = radius * 2;

  const ctx = canvas.getContext('2d')!;

  // Create a radial gradient on the canvas context
  const gradient = ctx.createRadialGradient(
    radius,
    radius,
    0,
    radius,
    radius,
    radius
  );

  // Add color stops
  for (const { color, stop } of colorStops) {
    gradient.addColorStop(stop, color.toRgbaString());
  }

  // Draw the gradient to the canvas
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Convert the canvas to a PIXI texture
  const texture = Texture.from(canvas);
  return texture;
}
