let defaultInfo = {
    version: '1.1.0',
    releasedate: new Date()
};

module.exports = (state = defaultInfo, action) => {
    switch (action.type) {
    default:
        return state;
    }
}
