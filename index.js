//
// sb-buildpatches - Starbound mod helper - patch file builder
// ---
// @copyright (c) 2017 Damian Bushong <katana@odios.us>
// @license MIT license
// @url <https://github.com/damianb/>
// @reddit <https://reddit.com/u/katana__>
//
/*jslint node: true, asi: true */
"use strict"

let r_readdir = require('recursive-readdir')
let patch = require('fast-json-patch')
let stripComments = require('strip-json-comments')
let path = require('path')
let fs = require('fs-extra')

module.exports = function(options) {
	if(!options.workingDir) {
		throw new Error('working directory for mod MUST be specified')
	}
	if(!options.dest) {
		throw new Error('destination for patch files MUST be specified')
	}
	if(!options.starboundAssets) {
		throw new Error('location of unpacked Starbound asset files MUST be specified')
	}

	options.workingDir += path.sep
	options.dest += path.sep
	options.starboundAssets += path.sep

	// these should let us ignore files that can't be JSON-patched.
	let ignoredExtensions = [
		// .disabled and .objectdisabled exist in the Starbound asset files
		//   we're ignoring them for now, because we probably shouldn't be JSON patching a disabled file o_O
		'.disabled', // ignored for now. @todo: reconsider?
		'.objectdisabled',  // ignored for now. @todo: reconsider?
		'.ase' // no idea why an ASE file is in the Starbound assets...lol Chucklefish.
	]
	
	let unpatchableExtensions = [
		'.md',
		'.png',
		'.wav',
		'.ogg',
		'.ttf',
		'.lua',
		'.txt'
	]

	r_readdir(options.workingDir, ignoredExtensions, function(err, files) {
		if(err) throw err
		files.forEach(function(filePath) {
			let relFilepath = '',
				assetFilepath = '',
				destFilepath = ''

			// sanity check
			if(!filePath.startsWith(options.workingDir)) {
				return
			}

			relFilepath = filePath.substring(options.workingDir.length)
			assetFilepath = path.join(options.starboundAssets, relFilepath)
			destFilepath = path.join(options.dest, relFilepath)

			// files with these extensions are not candidates for JSON patching, and must be hand copied.
			if(unpatchableExtensions.includes(path.extname(filePath))) {
				try {
					fs.copySync(filePath, destFilepath, { overwrite: true })
				} catch(err) {
					console.log('failed to copy mod file to ' + destFilepath)
					return
				}
				console.log('copied mod file to ' + destFilepath)
				return
			}

			// files that fall into this case are newly introduced and should not be JSON patched (it wouldn't make sense)
			try {
				fs.accessSync(assetFilepath, fs.constants.R_OK)
			} catch(err) {
				console.log('asset ' + relFilepath + ' does not seem to exist in Starbound asset files...')
				console.log('copying file to ' + destFilepath)
				// oh boy...try/catch within try/catch! yay!
				// (screw you, node, for getting rid of fs.exists)
				try {
					fs.copySync(filePath, destFilepath, { overwrite: true })
				} catch(err) {
					console.log('failed to copy mod file to ' + destFilepath)
					return
				}
				console.log('sucessfully copied mod file to ' + destFilepath)
				return
			}

			// from this point on, this file will *be* a JSON patch file
			destFilepath += '.patch'
			let originalFile = null,
				modifiedFile = null
			try {
				originalFile = JSON.parse(stripComments(fs.readFileSync(assetFilepath, "utf8")))
			} catch(err) {
				console.log('failed to load ' + relFilepath + ' from Starbound asset files')
				return
			}
			try {
				modifiedFile = JSON.parse(stripComments(fs.readFileSync(filePath, "utf8")))
			} catch(err) {
				console.log('failed to load ' + filePath + ' from modded asset files')
				return
			}

			// create and write the patch file
			let diff = patch.compare(originalFile, modifiedFile)
			try {
				fs.outputJsonSync(destFilepath, diff, { replacer: "\t" })
			} catch(err) {
				console.log('failed to write mod patch file to ' + destFilepath + ' from modded asset files as JSON')
				return
			}
			console.log('successfully created mod patch file at ' + destFilepath)
		})
	})
}