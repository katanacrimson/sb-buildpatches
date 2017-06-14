# sb-buildpatches - Starbound mod helper

sb-buildpatches is a node.js utility designed to assist with quickly creating .patch files of core game asset files.

## installation

Install the latest version of node.js, then:

    npm install damianb/sb-buildpatches

Then, create a small stub file (of your own naming) to call the module.

## usage

Just call the exported function - see the example below.

	let patchbuilder = require('sb-buildpatches')
	patchbuilder({
		workingDir: 'D:\\code\\starbound\\sbmods\\AsteroidOres\\modified',
		dest: 'D:\\code\\starbound\\sbmods\\AsteroidOres\\src',
		starboundAssets: 'E:\\Steam\\steamapps\\common\\Starbound\\assets\\packed'
	})

The only arguments taken by the module's function are as follows:

* **options**: a javascript object with any of the following properties:
* *options.workingDir*: the filesystem location where your modified asset files live.
* *options.dest*: the filesystem location where patch files and new files should be placed (for packing the mod).
* *options.starboundAssets*: the filesystem location where the unpacked Starbound asset files are located.

* **callback**: a javascript callback to receive any JSON parsing errors discovered when validating the mod's JSON files.  Will only receive one argument, which is true if errors are encountered.

And that's it!  Run the js, and watch patch files be dumped into your dest path.