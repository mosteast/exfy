import { readFileSync } from 'fs'
import { stat, writeFile } from 'fs-extra'
import { trim } from 'lodash'
import { extname, relative, resolve } from 'path'
import { chmod, ls, pwd } from 'shelljs'

export interface T_opt_exfy {
  paths?: string[]
  ext?: string[]
  level?: number
  match?: string
  out_ext?: string
  shebang?: string
}

export interface T_exfy_state {
  initial_path: string
}

export const N_shebang = '#!/usr/bin/env node'

export const opt_def: T_opt_exfy = {
  level: 0,
  match: '/^#!.+$/m',
  paths: [ './' ],
  ext: [ '.js', '.mjs' ],
  shebang: N_shebang,
  out_ext: '',
}

export async function exfy(opt: T_opt_exfy, state: T_exfy_state) {

  let { paths, level }: T_opt_exfy = opt = {
    ...opt_def,
    ...opt,
  }

  if ( ! paths?.length) return

  for (let it of paths) {
    it = cwd(it)
    let st = await stat(it)
    if ( ! st) continue
    if (st.isFile()) {
      await exfy_file(it, opt)
    } else if (st.isDirectory()) {
      if (level && calc_level(state.initial_path, it) > level) {
        continue
      }
      await exfy({ ...opt, paths: lls(it) }, state)
    }
  }
}

/**
 * Calc level from 2 absolute paths
 * @param from
 * @param to
 */
export function calc_level(from: string, to: string): number {
  const path = relative(from, to)
  if ( ! path) {
    return 0
  }
  return path.split('/').length
}

/**
 * exfy a single file
 * @param path
 */
export async function exfy_file(path: string, { ext, shebang, match, out_ext }: T_opt_exfy,
) {
  let ext_o = extname(path)
  if ( ! ext_o || ! ext?.includes(ext_o)) {return}

  const o = (readFileSync(path)).toString()
  let n: string = ''
  const re = regex_from_str(match)

  // shebang exists
  if (re.test(o)) {
    // correct shebang already exists
    if (o.startsWith(shebang + '\n')) { return }

    n = o.replace(re, shebang)
  } else {
    n = shebang + '\n\n' + o
  }

  const n_path = path.slice(0, -(ext_o.length)) + out_ext

  await writeFile(n_path, n)
  chmod('+x', n_path)
}

export function cwd(...path: string[]): string {
  return resolve(pwd().toString(), ...path)
}

/**
 * ls absolute path (long ls)
 */
export function lls(path: string = cwd()): string[] {
  return ls(path).map(it => cwd(path, it))
}

export function regex_from_str(str: string): RegExp {
  const arr = trim(str, '/').split('/')
  return new RegExp(arr[0], arr[1])
}
