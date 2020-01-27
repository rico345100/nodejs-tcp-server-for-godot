// Babel doesn't create directory if there isn't exists.
// Simple node script to fix that!

const fs = require('fs');

if(!fs.existsSync('./build')) {
    console.log('Cannot found ./build directory, attempt to create new one...');

    try {
        fs.mkdirSync('./build');
        console.log('Directory created.');
        process.exit(0);
    }
    catch(err) {
        console.error('Failed to create directory!');
        console.error(err);

        process.exit(1);
    }
}