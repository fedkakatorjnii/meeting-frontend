/**
 * Вычисляет координаты центра вложенного прямоугольника
 *
 * @param {number[]} coordinate - координата центра
 * @param {number[]} size - размер основного блока в пикселях
 * @param {number[]} position - размер вложенного блока в пикселях
 * @param {number} rotation - вращение
 * @param {number} [resolution] - разрешающая способность
 */
export const calculateCenterOn = (
  coordinate: number[],
  size: number[],
  position: number[],
  rotation: number,
  resolution?: number,
) => {
  const cosAngle = Math.cos(-rotation);
  let sinAngle = Math.sin(-rotation);
  let rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  let rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;

  if (resolution !== undefined) {
    rotX += (size[0] / 2 - position[0]) * resolution;
    rotY += (position[1] - size[1] / 2) * resolution;
  }

  sinAngle = -sinAngle;
  const centerX = rotX * cosAngle - rotY * sinAngle;
  const centerY = rotY * cosAngle + rotX * sinAngle;

  return [centerX, centerY];
};
