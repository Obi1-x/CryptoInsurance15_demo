// below code is needed to have access to the env variable
require('dotenv').config();

module.exports = {
    privKey: process.env.PRIVKEY,
    mnemonic: process.env.MNEMONIC
}