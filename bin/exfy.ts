#!/usr/bin/env ts-node
import { cwd, exfy, opt_def } from '../src/main'

require('yargs')
  .command({
    command: '$0 <paths..>',
    builder(argv) {
      return argv
        .positional('path', {
          array: true,
          desc: 'Directories or files to add shebang, use `.` for current directory',
        })
        .options({
          level: {
            type: 'number',
            describe: '0 for Recursive convert (convert sub-directories)',
            default: opt_def.level,
          },
          shebang: {
            type: 'string',
            default: opt_def.shebang,
            describe: 'Custom shebang "#!/path/to/env runner"',
          },
          extensions: {
            type: 'array',
            default: opt_def.extensions,
            describe: 'Target file extensions to match, can pass multiple extension by: `-e .ext1 -e .ext2`',
          },
          result_extension: {
            type: 'string',
            default: opt_def.result_extension,
            describe: 'Set result extensions or not: `--result_extension .js`',
          },
          match: {
            type: 'string',
            default: opt_def.match,
            describe: 'Regex to match shebang',
          },
        })
    },
    async handler(args) {
      await exfy(args, { initial_path: cwd() }).catch(console.error)
    },
  })
  .argv

