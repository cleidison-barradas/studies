module.exports = (argv) => {
  const VALID_ARGS = ['versionCode', 'openCore'];
  const ARGS_DELIMITER = '=';

  // Get only valid args format
  argv = argv.filter(arg => arg.indexOf(ARGS_DELIMITER) !== -1);

  // Get only valid usage args
  argv = argv.filter(arg => {
    const split = arg.split(ARGS_DELIMITER);

    return VALID_ARGS.indexOf(split[0]) !== -1;
  });

  // Parse args
  argv = argv.map(arg => {
    const split = arg.split(ARGS_DELIMITER);

    return {
      [split[0]]: split[1]
    }
  })

  // Now we want it as object
  let _arguments = {};
  argv.forEach(arg => {
    _arguments = {
      ..._arguments,
      ...arg
    }
  })

  return _arguments;
}
