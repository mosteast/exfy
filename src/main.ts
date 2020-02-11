import { pwd } from 'shelljs'
import { extname, resolve } from 'path'
import { trim, trimEnd } from 'lodash'
import { readFileSync, writeFileSync } from 'fs'
import walk = require('walkdir')

export interface T_opt_exfy {
  path: string
  extensions: string[]
  level: number
  match: string
  keep_extensions?: boolean
  shebang?: string
  output_dir?: string
}

export const N_shebang = '#!/usr/bin/env node'

export async function exfy(opt?: T_opt_exfy) {
  let { path, extensions, output_dir, shebang, keep_extensions, level, match } = {
    shebang: N_shebang,
    ...opt,
  }

  if (!path.startsWith('/')) {
    const cwd = get_cwd()
    path = resolve(cwd, path)
  }

  console.info(`Start converting at: ${path}`)

  const parts = parse_regex_str(match)
  const re = new RegExp(parts[0], parts[1])

  return new Promise((resolve, reject) => {

    const e = walk(path, { max_depth: level }, (path, stat) => {
      if (stat.isFile()) {
        let ext = trim(extname(path), '.')

        if (!ext || !extensions.includes(ext)) {return}

        const o = (readFileSync(path)).toString()
        let n: string = o

        if (re.test(o)) {
          if (!o.startsWith(shebang)) {
            n = o.replace(re, shebang)
          }
        } else {
          n = shebang + '\n\n' + o
        }

        if (keep_extensions) {
          ext = ''
        }

        const n_path = trimEnd(path.slice(0, -(ext.length)), '.')

        writeFileSync(n_path, n)
      }
    })

    e.on('end', () => {
      resolve()
    })

    e.on('error', reject)
  })
}

function get_cwd() {
  return pwd().toString()
}

export function parse_regex_str(str: string) {
  return trim(str, '/').split('/')
}
