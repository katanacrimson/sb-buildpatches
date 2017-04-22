# sb-buildpatches - Starbound mod helper

sb-buildpatches is a node.js utility designed to assist with quickly creating .patch files of core game asset files.

## installation

Install the latest version of node.js, then:

    npm install damianb/sb-buildpatches

Then, create a small stub file (of your own naming) to call the module.

## usage

Just call the exported function - see the example below.

	/*jslint node: true, asi: true */
	"use strict"
	let patchbuilder = require('sb-buildpatches')
	patchbuilder({
		workingDir: 'D:\\code\\starbound\\sbmods\\AsteroidOres\\modified',
		dest: 'D:\\code\\starbound\\sbmods\\AsteroidOres\\src',
		starboundAssets: 'E:\\Steam\\steamapps\\common\\Starbound\\assets\\packed'
	})

The only three arguments taken by the module's function are as follows:

* **workingDir**: the filesystem location where your modified asset files live.
* **dest**: the filesystem location where patch files and new files should be placed (for packing the mod).
* **starboundAssets**: the filesystem location where the unpacked Starbound asset files are located.

And that's it!  Run the js, and watch patch files be dumped into your dest path.