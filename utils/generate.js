const randomGenerate = require('otp-generators');

exports.number = async (numbers) => {
        return await randomGenerate.generate(numbers, { alphabets: false, upperCase: false, specialChar: false });
};
