import { cp, mkdir, rm } from 'shelljs'
import { resolve } from 'path'
import { exfy, N_shebang } from '../src/main'
import { readFileSync } from 'fs'

const path_template = resolve(__dirname, 'template/*')
const path_asset = resolve(__dirname, 'asset')

function prepare_testing_files() {
  rm('-fr', path_asset)
  mkdir(path_asset)
  cp('-r', path_template, path_asset)
}

beforeEach(() => {
  prepare_testing_files()
})

afterEach(() => {
  // rm('-fr', path_asset)
})

it('exfy', async (done) => {
  await run_default()
  let ar, br
  ar = readFileSync(path_asset + '/a').toString()
  expect(ar).toBe(N_shebang + '\n\n' + readFileSync(path_asset + '/a.js').toString())

  await run_default()
  expect(readFileSync(path_asset + '/a').toString())
    .toBe(ar)

  await run_default()
  br = readFileSync(path_asset + '/b').toString()
  expect(br).toBe(N_shebang + '\n\n' + readFileSync(path_asset + '/b.js').toString())

  expect(readFileSync(path_asset + '/b').toString())
    .toBe(br)
  done()
})

async function run_default() {
  await exfy({
    path: path_asset,
    match: '/^#!.+$/m',
    extensions: [ 'mjs', 'js' ],
    level: 0,
  })
}
