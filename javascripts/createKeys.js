function createKeys(state, city) {
  return `${state.toLowerCase()}-${city.toLowerCase()}`;
}

module.exports = {
  createKeys,
};
