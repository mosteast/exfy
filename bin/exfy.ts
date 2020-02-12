#!/usr/bin/env ts-node
import { cwd, exfy, opt_def } from '../src/main'

require('yargs')
  .command({
    command: '$0 <paths..>',
    builder(argv) {
      return argv
        .positional('paths', {
          array: true,
          desc: 'Directories or files to add shebang, use `.` for current directory',
        })
        .options({
          level: {
            type: 'number',
            alias: 'l',
            describe: '0 for Recursive convert (convert sub-directories)',
            default: opt_def.level,
          },
          shebang: {
            type: 'string',
            default: opt_def.shebang,
            describe: 'Custom shebang "#!/path/to/env runner"',
          },
          ext: {
            type: 'array',
            alias: 'e',
            default: opt_def.ext,
            describe: 'Target file extensions to match, can pass multiple extension by: `-e .ext1 -e .ext2`',
          },
          out_ext: {
            type: 'string',
            default: opt_def.out_ext,
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

