import { cp, mkdir, rm, pwd, ls } from 'shelljs'
import { resolve } from 'path'
import { cwd, exfy, N_shebang } from '../src/main'
import { readFileSync, readFile } from 'fs-extra'

const path_template = resolve(__dirname, 'template/*')
const path_tmp = resolve(__dirname, 'tmp')

function prepare_testing_files() {
  rm('-fr', path_tmp)
  mkdir(path_tmp)
  cp('-r', path_template, path_tmp)
}

beforeEach(() => {
  prepare_testing_files()
})

afterEach(() => {
  rm('-fr', path_tmp)
})

it('exfy recursive', async () => {
  await run_recursive()
  let ar, br
  ar = readFileSync(path_tmp + '/a').toString()
  expect(ar).toBe(N_shebang + '\n\n' + readFileSync(path_tmp + '/a.js').toString())

  await run_recursive()
  expect(readFileSync(path_tmp + '/a').toString())
    .toBe(ar)

  await run_recursive()
  br = readFileSync(path_tmp + '/b').toString()
  expect(br).toBe(N_shebang + '\n\n' + readFileSync(path_tmp + '/b.js').toString())

  expect(readFileSync(path_tmp + '/b').toString())
    .toBe(br)

  expect(() => { readFileSync(path_tmp + '/a1/a1')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/b1/b1')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/b1/b2/b2')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c1')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c2/c2')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c2/c3/c3')}).not.toThrow()
})

it('exfy with level 1', async () => {
  await run_level(1)
  expect(readFileSync(path_tmp + '/a').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/a.js').toString())
  expect(readFileSync(path_tmp + '/aa').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/aa.mjs').toString())
  expect(readFileSync(path_tmp + '/b').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/b.js').toString())
  expect(readFileSync(path_tmp + '/bb').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/bb.mjs').toString())

  expect(() => { readFileSync(path_tmp + '/a1/a1')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/b1/b1')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/b1/b2/b2')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c1')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c2/c2')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c2/c3/c3')}).toThrow()
})
it('exfy with level 2', async () => {
  await run_level(2)
  expect(readFileSync(path_tmp + '/a').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/a.js').toString())
  expect(readFileSync(path_tmp + '/aa').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/aa.mjs').toString())
  expect(readFileSync(path_tmp + '/b').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/b.js').toString())
  expect(readFileSync(path_tmp + '/bb').toString()).toBe(
    N_shebang + '\n\n' + readFileSync(path_tmp + '/bb.mjs').toString())

  expect(() => { readFileSync(path_tmp + '/a1/a1')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/b1/b1')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/b1/b2/b2')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c1')}).not.toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c2/c2')}).toThrow()
  expect(() => { readFileSync(path_tmp + '/c1/c2/c3/c3')}).toThrow()
})

it('exfy with shebang', async () => {
  const shebang = '#!/bin/sh'
  await exfy({ paths: [ path_tmp ], shebang: shebang }, { wd: __dirname })
  expect(readFileSync(path_tmp + '/a').toString()).toBe(
    shebang + '\n\n' + readFileSync(path_tmp + '/a.js').toString())
  expect(readFileSync(path_tmp + '/aa').toString()).toBe(
    shebang + '\n\n' + readFileSync(path_tmp + '/aa.mjs').toString())
  expect(readFileSync(path_tmp + '/b').toString()).toBe(
    shebang + '\n\n' + readFileSync(path_tmp + '/b.js').toString())
  expect(readFileSync(path_tmp + '/bb').toString()).toBe(
    shebang + '\n\n' + readFileSync(path_tmp + '/bb.mjs').toString())
})

it('exfy with result_extension', async () => {
  const extension = '.run'
  await exfy({ paths: [ path_tmp ], out_ext: extension }, { wd: __dirname })
  expect(() => { readFileSync(path_tmp + `/a1/a1${extension}`)}).not.toThrow()
  expect(() => { readFileSync(path_tmp + `/b1/b1${extension}`)}).not.toThrow()
  expect(() => { readFileSync(path_tmp + `/b1/b2/b2${extension}`)}).not.toThrow()
  expect(() => { readFileSync(path_tmp + `/c1/c1${extension}`)}).not.toThrow()
  expect(() => { readFileSync(path_tmp + `/c1/c2/c2${extension}`)}).not.toThrow()
  expect(() => { readFileSync(path_tmp + `/c1/c2/c3/c3${extension}`)}).not.toThrow()
})

async function run_recursive() {
  await exfy({ paths: [ path_tmp ] }, { wd: __dirname })
}

async function run_level(level: number) {
  await exfy({ paths: [ path_tmp ], level }, { wd: __dirname })
}
