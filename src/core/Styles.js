/**
 * All the common style which will be use most times goes here
 */

/**
 *
 * @param {Number} width Width of the shadow
 * @param {Number} height Height of the shadow
 * @param {String} color Color of the shadow
 * @param {Number} opacity opacity of the shadow
 * @param {Number} radius radius of the shadow
 */
export const getShadow = ({
  width = 0,
  height = 0,
  color = '#aaaaaa',
  opacity = 0.3,
  radius = 5,
} = {}) => {
  return {
    shadowColor: color,
    shadowOffset: {
      width,
      height,
    },
    shadowOpacity: opacity,
    shadowRadius: radius,

    elevation: 3,
  };
};

export const anotherStyle = () => {
  return {
    fontStyle: 'normal',
    color: '#ffaa22',
  };
};
