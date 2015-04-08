var gulp = require('gulp'),
    Bcrypt = require('bcrypt'),
    argv = require('minimist')(process.argv.slice(2)),
    storedSalt = require('./static_salt'),
    parseNumber = require('parse-number'),
    jshint = require('gulp-jshint');

gulp.task('default', function () {
  return console.log('hello I say.');
});

gulp.task('salt', function () {
  var saltWorkFactor = parseNumber(argv.work) || 10;
  var salt = Bcrypt.genSaltSync(saltWorkFactor);

  return console.log('creating a salt, with work factor %d: %s', saltWorkFactor, salt);
});

gulp.task('hash', function () {
  var result = 'pw not provided, use argument --pw=passwordToHash';

  if (argv.pw) {
    result = 'using stored salt: ' + storedSalt + '\n';
    result += 'hash of ' + argv.pw + ' is: ' + Bcrypt.hashSync(argv.pw, storedSalt);
  }

  return console.log(result);  
});

gulp.task('compare', function() {
  var result = '';

  if (!argv.pw || !argv.hash) {
    result = 'improper usage. use arguments --pw="passwordToHash" --hash="$23a..."';
  } else {  
    result = Bcrypt.compareSync(argv.pw, argv.hash) ? 'match.' : 'mismatch.';
  }

  return console.log(result);
});

gulp.task('lint', function () {
  return gulp.src('./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
})