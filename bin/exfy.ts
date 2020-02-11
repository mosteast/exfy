#!/usr/bin/env ts-node

import { exfy } from '../src/main'

require('yargs')
  .command({
    command: '$0 <path> [--level|-l] [--output_dir|-o] [--shebang] [--extensions|-e] [--keep_extensions] [--match]',
    builder(argv) {
      return argv
        .positional('path', {
          array: true,
          type: 'string',
          desc: 'Directories or files to add shebang, use `.` for current directory',
        })
        .options({
          output_dir: {
            type: 'string',
            describe: 'Output directory to store converted files, default: same directory',
          },
          level: {
            type: 'number',
            describe: '0 for Recursive convert (convert sub-directories)',
            default: 1,
          },
          shebang: {
            type: 'string',
            default: '#!/usr/bin/env node',
            describe: 'Custom shebang "#!/path/to/env runner"',
          },
          extensions: {
            type: 'array',
            default: [ 'js', 'mjs' ],
            describe: 'Can pass multiple extension by: `-e ext1 -e ext2`',
          },
          keep_extensions: {
            type: 'boolean',
            default: false,
            describe: 'Remove extensions or not',
          },
          match: {
            type: 'string',
            default: '/^#!.+$/m',
            describe: 'Regex to match shebang',
          },
        })
    },
    async handler(args) {
      await exfy(args).catch(console.error)
    },
  })

  .argv

