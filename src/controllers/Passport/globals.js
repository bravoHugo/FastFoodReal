let userId = null;

module.exports = {
  setUserId: (id) => {
    userId = id;
  },
  getUserId: () => {
    return userId;
  }
};