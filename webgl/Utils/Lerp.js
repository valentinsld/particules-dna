/**
 *
 * @param {number}  p1 current position
 * @param {number}  p2 target position
 * @param {number}  t amount to interpolate between x and y
 *  @return {number}
 */
export function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}
