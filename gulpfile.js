var gulp = require('gulp');




/*
Custom code from Lions Den Mobile locted here
*/
// var replace = require('replace');

var gulp = require('gulp');
const { task } = require('gulp');
var bump = require('gulp-bump');
var pkg = require('./package.json');
var file = require('gulp-file');
var fs = require('fs');

gulp.task('default', function() {
    // place code for your default task here
});

function setVersion(done) {
    var Config = require('cordova-config');
    var config = new Config('config.xml');
    version = pkg.version;
    config.setVersion(version);

    config.writeSync();
    done();
};

function setVersionCode(done) {
    // gulp.task('setVersionCode', function() {
    // Setting android versionCode due to Ionic Package issue
    // If this code does not run, then the versionCode will be too low
    //   and Dev console will not allow you to upload a new APK.
    var Config = require('cordova-config');
    var config = new Config('config.xml');
    version = pkg.version;
    config.setVersion(version);

    var nums = version.split('-')[0].split('.');
    var versionCode = 0;
    if (+nums[0]) {
        versionCode += +nums[0] * 10000;
    }
    if (+nums[1]) {
        versionCode += +nums[1] * 100;
    }
    if (+nums[2]) {
        versionCode += +nums[2];
    }
    versionCode += "8";
    // Load and parse the config.xml

    config.setAndroidVersionCode(versionCode);
    config.writeSync();
    done();
};



function setAppVersionInfo(done) {
    const verInfo = {};

    verInfo.version = pkg.version;
    strOut =
        `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(verInfo, null, 4)};
/* tslint:enable */
`;

    fs.writeFileSync('./src/assets/version.ts', strOut);
    done();
};


// Basic usage:
// Will patch the version
function bumpVer(done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
    done();
};

gulp.task('bump', gulp.series(bumpVer));

task('bump-minor', function(done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'minor'
        }))
        .pipe(gulp.dest('./'));
    done();
});


function bumpMjr(done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'major'
        }))
        .pipe(gulp.dest('./'));
    done();
};
task('bump-major', gulp.series(bumpMjr));


function setDev(done) {
    var Config = require('cordova-config');
    // Load and parse the config.xml
    var config = new Config('config.xml');
    config.setName(pkg.appName + " DEV");
    config.setID(pkg.appId + "1234");
    // Write the config file
    config.writeSync();
    done();
};

// gulp.task('set-dev', gulp.series(setVersion, setDev, setAppVersionInfo)); // Use if you have mobile app
gulp.task('set-dev', gulp.series(setAppVersionInfo));

function setProd(done) {
    var Config = require('cordova-config');
    // Load and parse the config.xml
    var config = new Config('config.xml');
    config.setName(pkg.appName);
    config.setID(pkg.appId);
    config.setVersion(pkg.version);
    // Write the config file
    config.writeSync();
    done();
};

// gulp.task('set-prod', gulp.series(setVersion, setProd, setAppVersionInfo)); // Use if you have mobile app
gulp.task('set-prod', gulp.series(setAppVersionInfo));
